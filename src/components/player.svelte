<script>
  export let player;
</script>

<style>
.squared-image {
  @apply w-full h-full aspect-square flex-shrink;
}

.username {
  @apply overflow-hidden text-ellipsis text-xl;
}
</style>

<div class="flex flex-shrink justify-center aspect-square md:w-1/3 lg:w-1/5"> <!-- Adjusted width for smaller screens -->
  <a href={`/user?name=${player.username}&uuid=${player.uuid}`} class="mt-2 justify-center text-center">
    <h2 class="username">{player.username}</h2>
    <img
      src={`https://mc-heads.net/avatar/${player.uuid}`}
      alt={player.username}
      title={player.username}
      class="m-auto p-8 bg-slate-200 border-8 border-transparent hover:border-blue-500 object-cover squared-image"
    />
  </a>
</div>
