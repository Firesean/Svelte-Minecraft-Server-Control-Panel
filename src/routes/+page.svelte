<script>
  import { onMount } from "svelte";
  import Player from "$lib/components/player.svelte";
  import PlayersContainer from "$lib/components/players-container.svelte";


  let onlinePlayers = [];
  let offlinePlayers = [];
  const maxPlayers = 100;

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

<div class="w-full h-full m-auto">
  <div class="mx-auto flex">
    <div class="flex gap-2">
      {#each buttons as button}
        <button class="border-2 border-slate-400 rounded-lg bg-slate-300 h-[4em] m-2 font-bold text-emerald-600" on:click={() => handleButtonClick(button.command)}>
          {button.label}
        </button>
      {/each}
    </div>
  </div>

  <div class="mx-auto justify-center items-center">
    <div class="h-[10vh]">
      <div class="h-[30%] flex items-center justify-center bg-gradient-to-b from-green-700 to-green-300">
      </div>
      <div class="h-[70%] flex justify-center flex-wrap gap-8 bg-gradient-to-b from-brown-light via-brown-medium to-brown-dark">
        <h1 class="absolute">Online - {onlinePlayers?.length}/{maxPlayers}</h1>
      </div>
    </div>
    <PlayersContainer players={onlinePlayers}/>
    <div class="h-[10vh] flex items-center justify-center bg-gradient-to-b from-gray-600 to-gray-300">
      <h1>Offline</h1>
    </div>
    <PlayersContainer players={offlinePlayers}/>
  </div>
</div>