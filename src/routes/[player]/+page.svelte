<script>
  import { onMount } from "svelte";
  import NoiseContainer from "$lib/components/noise-container.svelte";
  import ItemContainer from "$lib/components/item-container.svelte";
  import { page } from '$app/stores';

  let playerName;
  let uuid;
  let inventory = [];
  let enderchest = [];

  onMount(async () => {
    const inventoriesResponse = await fetch(`./api/minecraft-server-controller`, {
        method: "POST",
        body: JSON.stringify({ action: "retrieveInventories", player: $page.data.player.username, uuid: $page.data.player.id }),
    });

    console.log("Response : ", await inventoriesResponse.json());

    inventory = $page.data.inventory || [];
    enderchest = $page.data.enderchest || [];
    playerName = $page.data.player.username;
    uuid = $page.data.player.id;
  });
</script>
  
<!-- https://minecraft-ids.grahamedgecombe.com/ -->
<main class="w-[950px] mx-auto select-none">
  <div class="w-full flex flex-row justify-start p-8 gap-2">
    <div class="flex flex-wrap mx-auto inventory">
      <div class="flex flex-col gap-2">
        <ItemContainer item="bow"/>
        <ItemContainer item="bow"/>
        <ItemContainer item="bow"/>
        <ItemContainer item="bow" count="10"/>
      </div>
      {#key uuid}
        <div class="select-none">
          <NoiseContainer bg="#F0F0F0" noise={0}>
            <img src={`https://mc-heads.net/body/${uuid}`} alt={playerName} title={playerName} class="px-8 bg-black h-full object-contain min-w-[200px]"/>
          </NoiseContainer>
        </div>
      {/key}

      <div class="flex flex-col gap-2 h-full">
          <ItemContainer item="bow"/>
      </div>
    </div>
  </div>

  <NoiseContainer bg="#E8AC41" noise={100} size=200> 
    <h1 class="text-white">Inventory</h1>
  </NoiseContainer>
  <div class="inventory grid grid-cols-9">
    {#each inventory as item}
      <ItemContainer item={item.id} count={item.count}/>
    {/each}

    {#each Array(27) as __}
      <ItemContainer />
    {/each}
    <div class="h-[20px] col-span-9"/>
    {#each Array(9) as __, i}
      <ItemContainer />
    {/each}
  </div>

  <NoiseContainer bg="#3C2E3E" noise={1000} size=200> 
    <h1 class="text-white">Enderchest</h1>
  </NoiseContainer>
  <div class="inventory grid grid-cols-9">
    {#each enderchest as item}
      <ItemContainer item={item.id} count={item.count}/>
    {/each}

    {#each Array(27) as __}
      <ItemContainer />
    {/each}

  </div>
</main>