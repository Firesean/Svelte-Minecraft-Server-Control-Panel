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

<div class="h-full">
  <div class="mx-auto grid grid-cols-2">
    <div class="grid grid-cols-4 gap-2">
      {#each buttons as button}
        <button class="border-2 border-slate-400 rounded-lg bg-slate-300 h-[4em] m-2 font-bold text-emerald-600" on:click={() => handleButtonClick(button.command)}>
          {button.label}
        </button>
      {/each}
    </div>
  </div>


  <div class="h-[10vh] flex items-center justify-center bg-gradient-to-b from-green-700 to-green-300 ">
    <h1>Online</h1>
  </div>
  <div class="grid grid-cols-4 gap-4 bg-gradient-to-b from-brown-light via-brown-medium to-brown-dark">
    {#each onlinePlayers as player (player.uuid)}
      <Player {player}/>
    {/each}
  </div>

  <div class="h-[10vh] flex items-center justify-center bg-gradient-to-b from-gray-600 to-gray-300">
    <h1>Offline</h1>
  </div>
  <div class="grid grid-cols-4">
    {#each offlinePlayers as player (player.uuid)}
      <Player {player}/>
    {/each}
  </div>
</div>