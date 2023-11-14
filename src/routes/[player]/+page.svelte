<script>
    import { onMount } from "svelte";
  
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
          }).filter((item) => item !== null); // Remove any null entries
        } catch(err){
          console.log(err);
        }
        // Parse the Enderchest data
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
        }).filter((item) => item !== null); // Remove any null entries
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
  
  <main>
    <img src={`https://mc-heads.net/avatar/${uuid}`} alt={playerName} title={playerName} />
    <h1>Inventory</h1>
    <ul class="inventory">
      {#each inventory as item}
      <li>
        <img src={`https://minecraftitemids.com/item/${item.id}.png`} alt={item.id} title={item.id} class="minecraft-item"><span class="item-count">{item.count}</span>
      </li>
      {/each}
    </ul>
  
    <h1>Enderchest</h1>
    <ul class="inventory">
      {#each enderchest as item}
      <li>
        <img src={`https://minecraftitemids.com/item/${item.id}.png`} alt={item.id} title={item.id} class="minecraft-item"><span class="item-count">{item.count}</span>
      </li>
      {/each}
    </ul>
  </main>