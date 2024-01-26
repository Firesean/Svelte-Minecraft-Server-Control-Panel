<script>
  export let player;
</script>

<style>
.squared-image {
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1; /* Set the aspect ratio to 1:1 for a squared image */
}
</style>

<div class="transform scale-125 sm:scale-[.65]">
  <h2 class="m-auto w-80">{player.username}</h2>
  <a href={`/user?name=${player.username}&uuid=${player.uuid}`} class="mt-2">
    <img
      src={`https://mc-heads.net/avatar/${player.uuid}`}
      alt={player.username}
      title={player.username}
      class="m-auto p-4 bg-slate-200 border-4 border-transparent hover:border-blue-500 block w-full object-cover squared-image"
    />
  </a>
</div>
