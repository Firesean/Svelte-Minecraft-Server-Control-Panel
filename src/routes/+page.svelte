<script>
  import { onMount } from "svelte";
  import Player from "../components/player.svelte";

  let onlinePlayers = [];
  let offlinePlayers = [];

  let buttons = [
      // { label: "Start", command: "start" },
      // { label: "Stop", command: "stop" },
      // { label: "Restart", command: "restart" },
      // { label: "Kill", command: "kill" },
      { label : "Get Players", command : "retrievePlayers"},
  ];

  async function handleButtonClick(command) {
      // Handle button click logic here
      console.log(`Clicked: ${command}`);

      switch(command){
        case "retrievePlayers":
          await retrievePlayers();
        }
  }

  

  async function retrievePlayers() {
      const response = await fetch("../api/minecraft-server-controller", {
          method: 'POST',
          body: JSON.stringify({ action: "retrievePlayers" }),
      });

      if (response.ok) {
          const responseData = await response.json();
          let data = responseData.data;
          if (data.onlinePlayers){
            onlinePlayers = Object.keys(data.onlinePlayers).map(username => ({
              username,
              uuid: data.onlinePlayers[username],
            }));
          }

          offlinePlayers = Object.keys(data.offlinePlayers).map(username => ({
            username,
            uuid: data.offlinePlayers[username],
          }));
      } else {
          console.error("Error fetching data");
      }
  }
  onMount(async () => {
      await retrievePlayers();
  });
</script>


<div class="mx-auto grid grid-cols-2">
  <img src="https://panel.pebblehost.com/status/579172" width="468" height="60" alt=""/>

  <div class="grid grid-cols-4 gap-2">
    {#each buttons as button}
      <button class="p-6 border-2 border-blue-600 rounded-lg bg-slate-400" on:click={() => handleButtonClick(button.command)}>
        {button.label}
      </button>
    {/each}
  </div>
</div>

<div class="pt-8 bg-gradient-to-b from-green-700 to-green-300">
  <h1>Online</h1>
  <div class="pb-8 grid grid-cols-4 gap-4 bg-gradient-to-b from-brown-light via-brown-medium to-brown-dark">
    {#each onlinePlayers as player (player.uuid)}
      <Player {player}/>
    {/each}
  </div>
</div>

<div class="bg-gradient-to-b from-gray-500 to-gray-400 bg-noise pt-8">
  <h1>Offline</h1>
  <div class="pb-8 grid grid-cols-4 gap-4">
    {#each offlinePlayers as player (player.uuid)}
      <Player {player}/>
    {/each}
  </div>
</div>