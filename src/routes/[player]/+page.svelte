<script>
  import { onMount } from "svelte";
  import NoiseContainer from "$lib/components/noise-container.svelte";

  let playerName;
  let uuid;
  let inventory = [];
  let enderchest = [];

  async function retrieveInventories() {
  const response = await fetch("../api/minecraft-server-controller", {
      method: "POST",
      body: JSON.stringify({ action: "retrieveInventories", player: playerName, uuid: uuid }),
  });

  if (response.ok) {
      const responseData = await response.json();
      let data = responseData.data;
      data = JSON.parse(data);

      // Parse the Inventory data
      try{
        inventory = data.inventory.map((itemString) => {
            const idMatch = itemString.match(/id: "(.*?)"/);
            const countMatch = itemString.match(/Count: (\d+)/);

            if (idMatch && idMatch[1]) {
                const id = idMatch[1].replace("minecraft:", "");
                const count = countMatch ? parseInt(countMatch[1], 10) : 1;
                return { id, count };
            }
            return null;
        }).filter((item) => item !== null);
      } catch(err){
        console.log(err);
      }
      try {
      enderchest = data.enderchest.map((itemString) => {
          const idMatch = itemString.match(/id: "(.*?)"/);
          const countMatch = itemString.match(/Count: (\d+)/);

          if (idMatch && idMatch[1]) {
              const id = idMatch[1].replace("minecraft:", "");
              const count = countMatch ? parseInt(countMatch[1], 10) : 1;
              return { id, count };
          }
          return null;
      }).filter((item) => item !== null);
      } catch(err){
          console.log(err);
        }
  } else {
      console.error("Error fetching data");
  }
  }

  onMount(async () => {
      const urlParams = new URLSearchParams(window.location.search);
      playerName = urlParams.get("name");
      uuid = urlParams.get("uuid");
      await retrieveInventories();
  });
</script>
  
<!-- https://minecraft-ids.grahamedgecombe.com/ -->
<main>
  <div class="w-full flex flex-row justify-center p-8 gap-2">
    <div class="w-[10em] aspect-square my-auto">
      <NoiseContainer bg="#F0F0F0" noise={0}>
        <div class="p-2">
          <img src={`https://minecraftitemids.com/item/bow.png`} alt={playerName} title={playerName} />
        </div>
    </NoiseContainer>
    </div>
    <div class="w-[10em] flex flex-col gap-8 justify-between">
      <div class="aspect-square">
        <NoiseContainer bg="#F0F0F0" noise={0}>
            <div class="p-2">
              <img src={`https://minecraftitemids.com/item/bow.png`} alt={playerName} title={playerName} />
            </div>
        </NoiseContainer>
      </div>

      <div class="aspect-square">
        <NoiseContainer bg="#F0F0F0" noise={0}>
          <div class="p-2">
            <img src={`https://minecraftitemids.com/item/bow.png`} alt={playerName} title={playerName} />
          </div>
        </NoiseContainer>
      </div>
    </div>

    <div class="">
      <NoiseContainer bg="#F0F0F0" noise={0}>
        <img src={`https://mc-heads.net/body/${uuid}`} alt={playerName} title={playerName} class="px-16 bg-black"/>
      </NoiseContainer>
    </div>

    <div class="w-[10em] flex flex-col gap-8 justify-between">
      <div class="aspect-square">
        <NoiseContainer bg="#F0F0F0" noise={0}>
            <div class="p-2">
              <img src={`https://minecraftitemids.com/item/bow.png`} alt={playerName} title={playerName} />
            </div>
        </NoiseContainer>
      </div>

      <div class="aspect-square">
        <NoiseContainer bg="#F0F0F0" noise={0}>
          <div class="p-2">
            <img src={`https://minecraftitemids.com/item/bow.png`} alt={playerName} title={playerName} />
          </div>
        </NoiseContainer>
      </div>
    </div>
  </div>

  <NoiseContainer bg="#E8AC41" noise={100} size=200> 
    <h1 class="text-white">Inventory</h1>
  </NoiseContainer>
  <ul class="inventory">
    {#each inventory as item}
    <li>
      <img src={`https://minecraftitemids.com/item/${item.id}.png`} alt={item.id} title={item.id} class="minecraft-item"><span class="item-count">{item.count}</span>
    </li>
    {/each}
  </ul>

  <NoiseContainer bg="#3C2E3E" noise={1000} size=200> 
    <h1 class="text-white">Enderchest</h1>
  </NoiseContainer>
  <ul class="inventory">
    {#each enderchest as item}
    <li>
      <img src={`https://minecraftitemids.com/item/${item.id}.png`} alt={item.id} title={item.id} class="minecraft-item"><span class="item-count">{item.count}</span>
    </li>
    {/each}
  </ul>
</main>