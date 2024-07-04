<script>
  export let player;
</script>

<style>
.squared-image {
  @apply rounded-xl;
}

.username {
  @apply text-lg text-ellipsis overflow-hidden;
}
</style>

<div class="flex bg-slate-200 px-4 rounded-lg hover:border-blue-500 border-4 border-transparent min-w-[150px] w-[150px] bg-opacity-90">
  <a href={`/user?name=${player.username}&uuid=${player.uuid}`} class="justify-center text-center flex flex-col w-full py-2 gap-2">
    <h2 class="username">{player.username}</h2>
    <img
      src={`https://mc-heads.net/avatar/${player.uuid}`}
      alt={player.username}
      title={player.username}
      class="m-auto object-cover squared-image shadow-lg"
    />
  </a>
</div>
