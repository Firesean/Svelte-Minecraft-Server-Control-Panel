<script>
  import { onMount } from "svelte";
  import NoiseContainer from "$lib/components/noise-container.svelte";
  import ItemContainer from "$lib/components/item-container.svelte";
  import { page } from '$app/stores';

  let playerName;
  let uuid;
  let inventory = Array.from({ length: 27 }, () => ({}));
  let enderchest = Array.from({ length: 27 }, () => ({}));
  let hotbar = Array.from({ length: 9 }, () => ({}));
  let equipped = Array.from({ length: 4 }, () => ({}));

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
    inventory = data.data.inventory;
    playerName = $page.data.player.username;
    uuid = $page.data.player.id;
  });

</script>
  
<!-- https://minecraft-ids.grahamedgecombe.com/ -->
<main class="w-[950px] mx-auto select-none">
  <div class="absolute left-0 top-10 z-20 flex flex-col justify-center gap-8 w-full" style="text-shadow: 2px 0 #fff, -2px 0 #fff, 0 2px #fff, 0 -2px #fff,
               1px 1px #fff, -1px -1px #fff, 1px -1px #fff, -1px 1px #fff;">
    <h1>Data is inside of the client side console</h1>
    <h2>Hold CMD/CTRL + SHIFT + I and Click Console</h2>
    <h2>Parsing is fun!</h2>
  </div>
  <div class="w-full flex flex-row justify-start p-8 gap-2">
    <div class="flex flex-wrap mx-auto inventory">
      <div class="flex flex-col gap-2">
        {#each equipped as item}
          <ItemContainer item={item?.id} count={item?.count}/>
        {/each}
      </div>
      {#key uuid}
        <div class="select-none">
          <NoiseContainer bg="#F0F0F0" noise={0}>
            <img src={`https://mc-heads.net/body/${uuid}`} alt={playerName} title={playerName} class="px-8 bg-black h-full object-contain min-w-[200px]"/>
          </NoiseContainer>
        </div>
      {/key}

      <div class="flex flex-col gap-2 h-full">
          <ItemContainer/>
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