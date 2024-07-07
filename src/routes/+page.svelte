<script>
  import { onMount } from "svelte";
  import PlayersContainer from "$lib/components/players-container.svelte";
  import NoiseContainer from "$lib/components/noise-container.svelte";

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

  <div class="mx-auto flex flex-col justify-center items-center">
    <div class="h-[10vh] w-full">
      <div class="h-[30%] flex items-center justify-center">
        <NoiseContainer bg="#71A92C" noise={2000} size=200/>
      </div>

      
      <div class="h-[70%] flex justify-center flex-wrap gap-8">
        <NoiseContainer bg="#653818" noise={2000} size=200> 
          <h1 class="text-white">Online {onlinePlayers?.length}/{maxPlayers}</h1>
        </NoiseContainer>
      </div>
    </div>

    <PlayersContainer players={onlinePlayers}/>
    <div class="h-[10vh] w-full flex items-center justify-center text-white">
      <NoiseContainer bg="#4b5563" noise={2000} size=200>
        <h1>Offline</h1>
      </NoiseContainer>

    </div>
    <PlayersContainer players={offlinePlayers}/>
  </div>
</div>