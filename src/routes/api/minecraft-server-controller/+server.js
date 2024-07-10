import { Rcon } from 'rcon-client';
import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { RCON_HOST, RCON_PORT, RCON_PASSWORD, SUPABASE_KEY, SUPABASE_URL } from '$env/static/private';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const rconOptions = {
  host: RCON_HOST,
  port: RCON_PORT,
  password: RCON_PASSWORD,
  timeout: 30000,
};

const rcon = new Rcon(rconOptions);

const commands = {
  list: "list uuids",
  give: "give",
  say: "say",
  stop: "stop",
  restart: "say r35tart",
  help: "help",
  playerInventory: (player) => `data get entity ${player} Inventory`,
  playerEnderchest: (player) => `data get entity ${player} EnderItems`,
};

export async function POST({ request }) {
  const data = await request.json();
  try {
    await rcon.connect();

    switch (data.action) {
      case "retrievePlayers":
        return await handleRetrievePlayers();

      case "retrieveInventories":
        return await handleRetrieveInventories(data.player, data.uuid);

      default:
        return json({ status: 400, message: "Bad Request", error: "Unsupported action" });
    }
  } catch (err) {
    console.error('RCON Error:', err);
    return json({ status: 500, message: "Internal Server Error", error: "An error occurred while processing the request" });
  } finally {
    rcon.end();
  }
}

async function handleRetrievePlayers() {
  const players = await getPlayers(rcon);
  const dataArrayToInsert = Object.keys(players.onlinePlayers).map((username) => ({
    username,
    uuid: players.onlinePlayers[username],
  }));

  if (dataArrayToInsert.length > 0) {
    await supabase.from('players').upsert(dataArrayToInsert);
  }
  return json({ status: 200, message: "Players retrieved successfully", data: players });
}

async function handleRetrieveInventories(player, uuid) {
  const inventories = await getPlayerInventories(rcon, player, uuid);
  return json({ status: 200, message: `Inventories for ${player} retrieved successfully`, data: inventories });
}

async function getPlayers(rcon) {
  const response = await rcon.send(commands.list);
  const regex = /There are (\d+) of a max of (\d+) players online: (.+)$/;
  const match = response.match(regex);
  const playerObject = { onlinePlayers: {}, offlinePlayers: {} };

  if (match) {
    const playerNames = match[3].split(', ');
    playerNames.forEach((name) => {
      const nameMatch = name.match(/^(.*?) \((.*?)\)$/);
      if (nameMatch) {
        const username = nameMatch[1];
        const uuid = nameMatch[2];
        playerObject.onlinePlayers[username] = uuid;
      }
    });
  }

  const onlinePlayerUUIDs = Object.values(playerObject.onlinePlayers);
  const { data: dbPlayers } = await supabase.from('players').select('username, uuid').order('username', { ascending: true });

  const filteredOfflinePlayers = dbPlayers.filter(player => !onlinePlayerUUIDs.includes(player.uuid));
  playerObject.offlinePlayers = filteredOfflinePlayers.reduce((acc, player) => {
    acc[player.username] = player.uuid;
    return acc;
  }, {});

  return playerObject;
}

async function getPlayerInventories(rcon, player, uuid) {
  const data = { enderchest: [], inventory: [], hotbar: [], equipped: [] };

  try {
    const [inventory, enderchest] = await Promise.all([
      getPlayerInventory(rcon, player),
      getPlayerEnderchest(rcon, player),
    ]);

    data.inventory = inventory;
    data.enderchest = enderchest;

    console.log(data.inventory);
    console.log(data.enderchest);

    // Extract hotbar slots (0b to 9b)
    data.hotbar = inventory.filter(item => {
      const slotNumber = parseInt(item.Slot);
      return slotNumber >= 0 && slotNumber <= 8;
    });

    // Remove hotbar slots from inventory
    data.inventory = data.inventory.filter(item => {
      const slotNumber = parseInt(item.Slot);
      return slotNumber < 0 || slotNumber > 8;
    });

    // Extract equipped slots (100b to 103b)
    data.equipped = inventory.filter(item => {
      const slotNumber = parseInt(item.Slot);
      return (slotNumber >= 100 && slotNumber <= 103) || item.Slot === null;
    });

    // Remove equipped slots from inventory
    data.inventory = data.inventory.filter(item => {
      const slotNumber = parseInt(item.Slot);
      return slotNumber < 100 || slotNumber > 103;
    });

    if (data.inventory.length > 0 || data.enderchest.length > 0) {
      await supabase.from("inventories").upsert([{ 
        player_uuid: uuid, 
        inventory: data.inventory, 
        enderchest: data.enderchest,
        hotbar: data.hotbar,
        equipped: data.equipped
      }]);
    } else {
      const { data: dbData } = await supabase.from("inventories").select("enderchest, inventory, hotbar, equipped").eq("player_uuid", uuid);
      return dbData[0];
    }
    return data;
  } catch (err) {
    console.error('Error:', err);
    throw err;
  }
}

async function getPlayerInventory(rcon, player) {
  const regexPattern = /has the following entity data: (.*)/;
  const inventoryPromises = Array.from({ length: 41 }, (_, i) => rcon.send(commands.playerInventory(player) + `[${i}]`));

  const inventoryResponses = await Promise.all(inventoryPromises);
  return inventoryResponses.map(response => {
    const item = response.match(regexPattern);
    if (item) {
      const itemData = item[1].trim();
      try {
        return extractValues(itemData);
      } catch (err) {
        console.error('Error parsing inventory item data:', err, itemData);
        return {};
      }
    }
    return {};
  }).filter(item => item);
}

async function getPlayerEnderchest(rcon, player) {
  const regexPattern = /has the following entity data: (.*)/;
  const enderchestPromises = Array.from({ length: 27 }, (_, i) => rcon.send(commands.playerEnderchest(player) + `[${i}]`));

  const enderchestResponses = await Promise.all(enderchestPromises);
  return enderchestResponses.map(response => {
    const item = response.match(regexPattern);
    if (item) {
      const itemData = item[1].trim();
      try {
        return extractValues(itemData);
      } catch (err) {
        console.error('Error parsing enderchest item data:', err, itemData);
        return {};
      }
    }
    return {};
  }).filter(item => item);
}


function extractValues(data) {
  const extractValue = (regex, text) => {
      const match = regex.exec(text);
      if (!match) return null;
      let value = match[1].trim();
      if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1).replace(/\\"/g, '"');
      }
      return value;
  };

  const countRegex = /count:\s*([0-9]+)/i;
  const slotRegex = /Slot:\s*([\w]+)/i;
  const componentsRegex = /components:\s*({.*?)\s*6}]/is;
  const minecraftCustomNameRegex = /"minecraft:custom_name"\s*:\s*[^"]*"([^"]*)"/is;
  const idRegex = /id:\s*"([^"]+)"\s*}$/i;

  let count = extractValue(countRegex, data);
  let slot = extractValue(slotRegex, data);
  let components = extractValue(componentsRegex, data);
  let minecraftCustomName = extractValue(minecraftCustomNameRegex, data);
  let id = extractValue(idRegex, data).replace("minecraft:", "");
  // if (components){
  //   console.log(`${id} : ` ,components);
  // }
  return {
      count,
      Slot: slot,
      components: components || "",
      minecraftCustomName: minecraftCustomName || "",
      id,
  };
}