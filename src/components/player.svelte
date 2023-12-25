<script>
    export let player;
</script>

<div>
  <a href="/user?name={player.username}&uuid={player.uuid}" class="mt-2">
    <h2 class="m-auto w-80">{player.username}</h2>
    <img
      src={`https://mc-heads.net/avatar/${player.uuid}`}
      alt={player.username}
      title={player.username}
      class="m-auto p-6 bg-slate-200"
    />
  </a>
</div>