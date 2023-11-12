<script>
  import { onMount } from "svelte";

  let onlinePlayers = [];
  let offlinePlayers = [];

  let buttons = [
      { label: "Start", command: "start" },
      { label: "Stop", command: "stop" },
      { label: "Restart", command: "restart" },
      { label: "Kill", command: "kill" },
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
      console.log(`Requesting Players Online`);
      const response = await fetch("../api/minecraft-server-controller", {
          method: 'POST',
          body: JSON.stringify({ action: "retrievePlayers" }),
      });

      if (response.ok) {
          const responseData = await response.json();
          let data = responseData.data;
          console.log(data);
          if (data.onlinePlayers){
            console.log("Players Online");
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


<h1>Online</h1>
<div class="grid grid-cols-4 gap-4">
  {#each onlinePlayers as player (player.uuid)}
  <a href="/user?name={player.username}&uuid={player.uuid}">
    <h2>{player.username}</h2>
    <img
      src={`https://mc-heads.net/avatar/${player.uuid}`}
      alt={player.username}
      title={player.username}
    />
  </a>
  {/each}
</div>

<h1>Offline</h1>
<div class="grid grid-cols-4 gap-4">
  {#each offlinePlayers as player (player.uuid)}
  <a href="/user?name={player.username}&uuid={player.uuid}">
    <h2>{player.username}</h2>
    <img
      src={`https://mc-heads.net/avatar/${player.uuid}`}
      alt={player.username}
      title={player.username}
    />
  </a>
  {/each}
</div>