<script>
    import { onMount } from 'svelte';
    import { generateNoise } from '$lib/scripts/noise.js';

    export let bg = "#FFF";
    export let classes = '';
    export let noise = 80;
    export let size = 500;
    let noiseTexture = '';

    onMount(() => {
        noiseTexture = generateNoise(size, size, noise);
    });
</script>

<style>
    .noise-container {
        width: 100%;
        height: 100%;
        background-size: cover;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        border: 3px solid transparent;
        background: linear-gradient(
            140deg,
            rgba(50, 50, 50, 0.5),
            rgba(150, 150, 150, 0.5)
        );
        background-clip: border-box;
    }

    .noise-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        opacity: 0.2;
    }
</style>

<div class="noise-container {classes}" style="background-color: {bg};">
    <slot />
    <div class="noise-overlay" style="background-image: url({noiseTexture});"></div>
</div>
