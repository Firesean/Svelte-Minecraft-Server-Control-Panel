<script>
  export let player;
</script>

<div class="flex bg-slate-200 px-4 rounded-lg hover:border-blue-500 border-4 border-transparent min-w-[150px] w-[150px] bg-opacity-90">
  <a href={`/${player.username}`} class="justify-center text-center flex flex-col w-full py-2 gap-2">
    <h2 class="username">{player.username}</h2>
    <img
      src={`https://mc-heads.net/avatar/${player.uuid}`}
      alt={player.username}
      title={player.username}
      class="m-auto object-cover squared-image shadow-lg"
    />
  </a>
</div>
