<script>

    import { afterUpdate } from "svelte";
    import NoiseContainer from "$lib/components/noise-container.svelte";
    import ToolTip from "$lib/components/tool-tip.svelte";

    export let item = "";
    export let count = "";

    let name = "";
    afterUpdate(() => {
      if(item){
        name = item.replaceAll("_", " ");
      }
    });
</script>

<div class="w-[6em] h-[6em] aspect-square my-auto select-none item" draggable="false">
  <ToolTip text={name}>
    <NoiseContainer bg="#F0F0F0" noise={0}>
      <div class="p-2 w-[6em] h-[6em] aspect-square">
          {#if item}
              <img src={`https://minecraftitemids.com/item/${item}.png`} alt={name} title={name} class="w-full h-full aspect-square object-contain"/>
              <p class="absolute bottom-1 right-1 text-4xl text-white" style="text-shadow: 2px 2px 4px rgb(0, 0, 0);">{count > 1 ? count : ""}</p>
          {/if}
        </div>
    </NoiseContainer>
  </ToolTip>
</div>