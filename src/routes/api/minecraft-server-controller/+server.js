import { Rcon } from 'rcon-client';
import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js'
import { RCON_HOST, RCON_PORT, RCON_PASSWORD, SUPABASE_KEY, SUPABASE_URL } from '$env/static/private';
const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


const options = {
  host: RCON_HOST, // Replace with your server IP
  port: RCON_PORT, // Replace with your RCON port
  password: RCON_PASSWORD, // Replace with your RCON password
  timeout: 30000,
};

console.log("Attempting to Connect to RCON");
const rcon = new Rcon(options);
console.log('Connected to RCON');

const commands = {
  list: "list uuids",
  give: "give",
  say: "say",
  stop: "stop",
  restart: "say r35tart",
  help: "help",
  playerInventory : function(player){return `data get entity ${player} Inventory`},
  playerEnderchest : function(player){return `data get entity ${player} EnderItems`},
};

export async function POST({ request }) {
  console.log('Request Received!');
  const data = await request.json();
  console.log(data.action);


  await rcon.connect();

  try {
    switch (data.action) {
      case "retrievePlayers":
          const players = await getPlayers(rcon);

          const dataArrayToInsert = Object.keys(players).map((username) => ({
            username,
            uuid: players[username],
          }));
          
          await supabase
          .from('players')
          .upsert(dataArrayToInsert);
        
          return json({status: 200, message: "Players retrieved successfully", data: players});
      case "retrieveInventories":
        const inventories = await getPlayerInventories(rcon, data.player, data.uuid);
        // console.log(inventories);
        return json({status: 200, message: `Inventories for ${data.player} retrieved successfully`, data: inventories});
      default:
        return json({
          status: 400,
          message: "Bad Request",
          error: "Unsupported action",
        });
    }
  }
  catch (err) {
      console.error('RCON Error:', err);
      return json({
        status: 500,
        message: "Internal Server Error",
        error: "An error occurred while retrieving players",
      });
  } finally {
    rcon.socket.end();
  }
}

async function getPlayers(rcon) {
  // https://mc-heads.net/avatar/{uuid}
  let response = await rcon.send(commands.list);
  const regex = /There are (\d+) of a max of (\d+) players online: (.+)$/;
  const match = response.match(regex);
  const playerObject = {
    onlinePlayers: {},
    offlinePlayers: {},
  };

  if (match) {
    const playerNames = match[3].split(', ');

    playerNames.forEach((name) => {
      // Use a regular expression to match the username and UUID
      const nameMatch = name.match(/^(.*?) \((.*?)\)$/);

      if (nameMatch) {
        // Extract the username and UUID from the match
        const username = nameMatch[1];
        const uuid = nameMatch[2];

        // Add the entry to the playerObject
        playerObject.onlinePlayers[username] = uuid;
      }
    });
  }

  const onlinePlayerUUIDs = Object.values(playerObject.onlinePlayers);

  if (onlinePlayerUUIDs.length != 0){
    response = await supabase
        .from('players')
        .select('username, uuid')
        .not('uuid', 'eq', onlinePlayerUUIDs);
  }
  else{
    response = await supabase
      .from('players')
      .select('username, uuid');
  }

  console.log(response);

  // Transform the array into the desired object structure
  if (response.data){
    const transformedPlayers = response.data.reduce((acc, player) => {
      acc[player.username] = player.uuid;
      return acc;
    }, {});

    playerObject.offlinePlayers = transformedPlayers;
  }
  return playerObject;
}

async function getPlayerInventories(rcon, player, uuid) {
  const regexPattern = /has the following entity data: (.*)/;
  let data = {
    enderchest: [],
    inventory: [],
  };

  try {
    let response;

    for (let i = 0; i < 41; i++) {
      response = await rcon.send(commands.playerInventory(player) + "[" + i.toString() + "]");
      const item = response.match(regexPattern);

      if (item) {
        const entityData = item[1].trim();
        data.inventory.push(entityData);
      }
    }

    for (let i = 0; i < 27; i++) {
      response = await rcon.send(commands.playerEnderchest(player) + "[" + i.toString() + "]");
      const item = response.match(regexPattern);

      if (item) {
        const entityData = item[1].trim();
        data.enderchest.push(entityData);
      }
    }

    const jsonData = JSON.stringify(data, null, 2);
    
    console.log(jsonData);

    if (data.inventory.length > 0 || data.enderchest.length > 0) {
      console.log("Retrieving Inventories from In-game");
      await supabase
        .from("inventories")
        .upsert([
          {
            player_uuid: uuid,
            inventory: data.inventory,
            enderchest: data.enderchest,
          },
        ]);
    }

    else {
      console.log("Retrieving Inventories from Database");
      response = await supabase
        .from("inventories")
        .select("enderchest, inventory")
        .eq("player_uuid", uuid);
      return JSON.stringify(response.data[0], null, 2);
    }

    return jsonData;
  } catch (err) {
    console.error('Error:', err);
    throw err;
  }
}
