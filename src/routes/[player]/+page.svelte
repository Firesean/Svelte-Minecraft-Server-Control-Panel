<script>
  import { onMount } from "svelte";
  import { page } from '$app/stores';

  import NoiseContainer from "$lib/components/noise-container.svelte";
  import ItemContainer from "$lib/components/item-container.svelte";
  import PlayerModel from "$lib/components/player-model.svelte";

  let playerName;
  let uuid;
  let inventory = Array.from({ length: 27 }, () => ({}));
  let enderchest = Array.from({ length: 27 }, () => ({}));
  let hotbar = Array.from({ length: 9 }, () => ({}));
  let equipped = Array.from({ length: 4 }, () => ({}));
  let offhand = Array.from({ length: 1 }, () => ({}));

  onMount(async () => {
    const inventoriesResponse = await fetch(`/api/minecraft-server-controller`, {
      method: "POST",
      body: JSON.stringify({ action: "retrieveInventories", player: $page.data.player.username, uuid: $page.data.player.id }),
    });

    const data = await inventoriesResponse.json();
    console.log(data.data);
    enderchest = data.data.enderchest;
    equipped = data.data.equipped;
    hotbar = data.data.hotbar;
    offhand = data.data.offhand;
    inventory = data.data.inventory;
    playerName = $page.data.player.username;
    uuid = $page.data.player.id;
  });
</script>
  
<!-- https://minecraft-ids.grahamedgecombe.com/ -->

<main class="w-[950px] mx-auto select-none">
  <div class="w-full flex flex-row justify-start p-8 gap-2">
    <div class="flex flex-wrap mx-auto inventory">
      <div class="flex flex-col-reverse gap-2">
        {#each equipped as item}
          <ItemContainer item={item?.id} count={item?.count}/>
        {/each}
      </div>
      {#key uuid}
        <div class="select-none w-[15em] h-full">
          <NoiseContainer bg="#F0F0F0" noise={0}>
            <!-- <PlayerModel bind:uuid/> -->
            <img id="followImage" src={`https://mc-heads.net/body/${uuid}`} alt={playerName} title={playerName} class="px-8 bg-black h-full object-contain min-w-[200px]"/>
          </NoiseContainer>
        </div>
      {/key}

      <div class="flex flex-col gap-2 h-full">
          <ItemContainer item={offhand[0]?.id} count={offhand[0]?.count}/>
      </div>
    </div>
  </div>

  <NoiseContainer bg="#E8AC41" noise={100} size=200> 
    <h1 class="text-white">Inventory</h1>
  </NoiseContainer>
    <div class="inventory grid grid-cols-9">
      {#each inventory as item}
        <ItemContainer item={item?.id} count={item?.count}/>
      {/each}
      <div class="h-[20px] col-span-9 w-full"/>
      {#each hotbar as item}
        <ItemContainer item={item?.id} count={item?.count}/>
      {/each}
    </div>
  <NoiseContainer bg="#3C2E3E" noise={1000} size=200> 
    <h1 class="text-white">Enderchest</h1>
  </NoiseContainer>
  <div class="inventory grid grid-cols-9 w-full">
    {#each enderchest as item}
      <ItemContainer item={item?.id} count={item?.count}/>
    {/each}
  </div>
</main>
