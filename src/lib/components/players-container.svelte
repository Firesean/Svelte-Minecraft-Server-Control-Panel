<script>
    import Player from "$lib/components/player.svelte";

    export let players;
</script>

<div class="container {players.length > 0 ? "py-4 px-8" : ''}">
  
    <div class="flex flex-wrap justify-start gap-8">
      {#each players as player (player.username)}
        <Player {player}/>
      {/each}
    </div>
</div>
