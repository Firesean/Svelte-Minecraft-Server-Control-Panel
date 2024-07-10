<script>
    import NoiseContainer from "$lib/components/noise-container.svelte";

    export let item = "";
    export let count = "";
</script>

<div class="w-[6em] aspect-square my-auto select-none item" draggable="false">
    <NoiseContainer bg="#F0F0F0" noise={0}>
      <div class="p-2">
        {#if item}
            <img src={`https://minecraftitemids.com/item/${item}.png`} alt={item} title={item} class="w-full h-full aspect-square object-contain"/>
            <p class="absolute bottom-1 right-1 text-4xl text-white" style="text-shadow: 2px 2px 4px rgb(0, 0, 0);">{count > 1 ? count : ""}</p>
        {/if}
      </div>
  </NoiseContainer>
</div>