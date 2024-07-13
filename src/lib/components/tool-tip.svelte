<script>
export let text = '';
</script>
  
<div class="relative group">
<slot />
{#if text.trim() !== ''}
    <div class="absolute top-[30%] left-[65%] mb-2 hidden w-max px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:block group-hover:opacity-80 transition-opacity duration-300 capitalize z-30">
    {text}
    </div>
{/if}
</div>
  