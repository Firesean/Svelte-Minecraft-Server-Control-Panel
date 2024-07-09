import { Rcon } from 'rcon-client';
import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { RCON_HOST, RCON_PORT, RCON_PASSWORD, SUPABASE_KEY, SUPABASE_URL } from '$env/static/private';

const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const options = {
  host: RCON_HOST,
  port: RCON_PORT,
  password: RCON_PASSWORD,
  timeout: 30000,
};

const rcon = new Rcon(options);

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
  await rcon.connect();
  try {
    switch (data.action) {
      case "retrievePlayers":
        const players = await getPlayers(rcon);
        const dataArrayToInsert = Object.keys(players.onlinePlayers).map((username) => ({
          username,
          uuid: players.onlinePlayers[username],
        }));

        if (dataArrayToInsert.length > 0) {
          await supabase.from('players').upsert(dataArrayToInsert);
        }
        return json({ status: 200, message: "Players retrieved successfully", data: players });

      case "retrieveInventories":
        const inventories = await getPlayerInventories(rcon, data.player, data.uuid);
        return json({ status: 200, message: `Inventories for ${data.player} retrieved successfully`, data: inventories });

      default:
        return json({ status: 400, message: "Bad Request", error: "Unsupported action" });
    }
  } catch (err) {
    console.error('RCON Error:', err);
    return json({ status: 500, message: "Internal Server Error", error: "An error occurred while retrieving players" });
  } finally {
    rcon.socket.end();
  }
}

async function getPlayers(rcon) {
  let response = await rcon.send(commands.list);
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

  response = await supabase.from('players').select('username, uuid').order('username', { ascending: true });
  const filteredOfflinePlayers = response.data.filter(player => !onlinePlayerUUIDs.includes(player.uuid));

  playerObject.offlinePlayers = filteredOfflinePlayers.reduce((acc, player) => {
    acc[player.username] = player.uuid;
    return acc;
  }, {});

  return playerObject;
}

async function getPlayerInventories(rcon, player, uuid) {
  const regexPattern = /has the following entity data: (.*)/;
  let data = { enderchest: [], inventory: [] };

  try {
    const inventoryPromises = [];
    for (let i = 0; i < 41; i++) {
      inventoryPromises.push(rcon.send(commands.playerInventory(player) + "[" + i.toString() + "]"));
    }

    const enderchestPromises = [];
    for (let i = 0; i < 27; i++) {
      enderchestPromises.push(rcon.send(commands.playerEnderchest(player) + "[" + i.toString() + "]"));
    }

    const [inventoryResponses, enderchestResponses] = await Promise.all([
      Promise.all(inventoryPromises),
      Promise.all(enderchestPromises)
    ]);

    inventoryResponses.forEach(response => {
      const item = response.match(regexPattern);
      if (item) {
        data.inventory.push(item[1].trim());
        console.log(`Index ${data.inventory.length - 1} : `, data.inventory.at(data.inventory.length - 1));
      }
    });

    enderchestResponses.forEach(response => {
      const item = response.match(regexPattern);
      if (item) {
        data.enderchest.push(item[1].trim());
        console.log(`Index ${data.enderchest.length - 1} : `, data.enderchest.at(data.enderchest.length - 1));

      }
    });

    if (data.inventory.length > 0 || data.enderchest.length > 0) {
      await supabase.from("inventories").upsert([{ player_uuid: uuid, inventory: data.inventory, enderchest: data.enderchest }]);
    } else {
      const dbResponse = await supabase.from("inventories").select("enderchest, inventory").eq("player_uuid", uuid);
      return JSON.stringify(dbResponse.data[0], null, 2);
    }

    return JSON.stringify(data, null, 2);
  } catch (err) {
    console.error('Error:', err);
    throw err;
  }
}
