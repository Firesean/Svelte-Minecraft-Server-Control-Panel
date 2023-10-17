import { Rcon } from 'rcon-client';
import { mkdir, writeFile } from "fs/promises";
import { json } from '@sveltejs/kit';

import { RCON_HOST, RCON_PORT, RCON_PASSWORD } from '$env/static/private';

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
          console.log(players);
          return json({status: 200, message: "Players retrieved successfully", data: players});
      case "retrieveInventories":
        const inventories = await getPlayerInventories(rcon, data.player, data.uuid);
        console.log(inventories);
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
  const playerObject = {};

  if (match) {
    const playerNames = match[3].split(', ');

    playerNames.forEach((name) => {
      // Use a regular expression to match the username and UUID
      const match = name.match(/^(.*?) \((.*?)\)$/);

      if (match) {
        // Extract the username and UUID from the match
        const username = match[1];
        const uuid = match[2];

        // Add the entry to the playerObject
        playerObject[username] = uuid;
      }
    });
  }

  return playerObject;
}

async function getPlayerInventories(rcon, player, uuid) {
  const regexPattern = /has the following entity data: (.*)/;
  let data = {
    "Inventory" : [],
    "Enderchest" : [],
  };

  try {
    // Create a folder for the player's name, including parent directories
    // await mkdir(`./src/players/${player}-${uuid}`, { recursive: true });

    // Get the player's inventory data
    let response, item, entityData;
    for (let i = 0; i < 41; i++) {
      response = await rcon.send(commands.playerInventory(player) + "[" + i.toString() + "]");
      item = response.match(regexPattern);

      if (item) {
        entityData = item[1].trim(); // Extracted entity data
        data.Inventory.push(entityData);
      }
    }

    // Get the player's enderchest data
    for (let i = 0; i < 27; i++) {
      response = await rcon.send(commands.playerEnderchest(player) + "[" + i.toString() + "]");
      item = response.match(regexPattern);

      if (item) {
        entityData = item[1].trim(); // Extracted entity data
        // console.log(entityData);
        data.Enderchest.push(entityData);
      }
    }

    let jsonData = JSON.stringify(data, null, 2);

    // Write the data to a file named storage.json
    // await writeFile(`./src/players/${player}-${uuid}/storage.json`, jsonData, "utf-8"); // Join the data array with newlines
    // console.log(`Inventory data for ${player} saved successfully.`);
    return jsonData;
  } catch (err) {
    console.error('Error:', err);
    throw Error;
  }
}

