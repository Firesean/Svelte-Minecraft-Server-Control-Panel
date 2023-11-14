<script>
    export let player;
</script>

<a href="/user?name={player.username}&uuid={player.uuid}" class="mt-2">
    <h2 class="m-auto w-80">{player.username}</h2>
    <img
      src={`https://mc-heads.net/avatar/${player.uuid}`}
      alt={player.username}
      title={player.username}
      class="m-auto pt-2"
    />
  </a>