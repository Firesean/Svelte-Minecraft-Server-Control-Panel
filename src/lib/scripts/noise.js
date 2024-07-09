export function generateNoise(width, height, intensity=255) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    const imageData = ctx.createImageData(width, height);
    const buffer32 = new Uint32Array(imageData.data.buffer);

    for (let i = 0; i < buffer32.length; i++) {
        buffer32[i] = ((intensity * Math.random()) | 0) << 24;
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
}