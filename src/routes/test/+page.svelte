<script>
  import NoiseContainer from "$lib/components/noise-container.svelte";
</script>


<div class="w-1/3 mx-auto flex flex-wrap gap-2">
    <button class="text-white w-full h-[40px] border-black border-[3px]" style="text-shadow: #000 2px 2px 2px;">
      <NoiseContainer bg="#A5A5A5" noise={500}>
          Normal Button
      </NoiseContainer>
    </button>
    <div class="flex flex-row w-full gap-3">
      <button class="text-white text-lg w-full h-[40px] border-black border-[3px]" style="text-shadow: #000 2px 2px 2px;">
        <NoiseContainer bg="#FF0000" noise={200}>
            Warning Button
        </NoiseContainer>
      </button>
  
      <button class="text-white w-full h-[40px] border-black border-[3px]" style="text-shadow: #000 2px 2px 2px;">
        <NoiseContainer bg="#00FF00" noise={200}>
            Good Button
        </NoiseContainer>
      </button>
    </div>
  
    <button class="text-white w-full h-[40px] border-black border-[3px]" style="text-shadow: #000 2px 2px 2px;">
      <NoiseContainer bg="#0000FF" noise={200}>
          Information Button
      </NoiseContainer>
    </button>
  
    <button class="text-white w-full h-[40px] border-black border-[3px]" style="text-shadow: #000 2px 2px 2px;">
      <NoiseContainer bg="#FFFF00" noise={200}>
          Wait Button
      </NoiseContainer>
    </button>
  
    <div class="flex flex-row w-full gap-3">
      <button class="text-white text-lg w-full h-[40px] border-black border-[3px]" style="text-shadow: #000 2px 2px 2px;">
        <NoiseContainer bg="#6B298C" noise={200}>
            End Button
        </NoiseContainer>
      </button>
  
      <button class="text-white w-full h-[40px] border-black border-[3px]" style="text-shadow: #000 2px 2px 2px;">
        <NoiseContainer bg="#BB0000" noise={200}>
            Nether Button
        </NoiseContainer>
      </button>
    </div>
  </div>
  
  <style>
    button:hover {
      border-color: white;
    }
  </style>