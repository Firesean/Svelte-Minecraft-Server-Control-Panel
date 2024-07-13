<script>
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

  export let uuid;
  let container;

  onMount(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Adjust camera position
    camera.position.set(0, 2, 5);

    // Variables to store mouse position
    let mouseX = 0, mouseY = 0;

    // Load the Minecraft player model
    const loader = new GLTFLoader();
    loader.load(
      '../src/lib/models/model.gltf',
      (gltf) => {
        const model = gltf.scene;

        // Find the head object in the model hierarchy (adjust name as per your model)
        let head, body, leftArm, rightArm, leftLeg, rightLeg, rightArmLayer, leftArmLayer;
        model.traverse((child) => {
          switch (child.name) {
            case "blockbench_export":
              console.log(child.uuid);
              break;
            case 'Head':
              head = child;
              break;
            case 'Body':
              body = child;
              break;
            case 'Left_Arm':
              leftArm = child;
              break;
            case 'Right_Arm':
              rightArm = child;
              break;
            case 'Left_Arm_Layer':
              leftArmLayer = child;
              break;
            case 'Right_Arm_Layer':
              rightArmLayer = child;
              break;
            case 'Left_Leg':
              leftLeg = child;
              break;
            case 'Right_Leg':
              rightLeg = child;
              break;
            default:
              break;
          }
        });

        const textureLoader = new THREE.TextureLoader();
        const newTexture = textureLoader.load(`https://mc-heads.net/body/${uuid}`); // Path to your new texture image

        model.traverse((child) => {
          if (child.isMesh) {
            console.log('UVs:', child.geometry.attributes.uv);
            child.material.map = newTexture;
            child.material.needsUpdate = true;
          }
        });

        if (head && body && leftArm && leftLeg && rightArm && rightLeg && rightArmLayer && leftArmLayer) {
          model.rotation.y = Math.PI; // Rotate 180 degrees around Y-axis if it's backwards
          model.position.set(0, 1, 3); // Adjust position as needed

          scene.add(model);

          // Mouse movement event listener
          window.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

            const targetRotationY = mouseX * Math.PI;
            const targetRotationX = mouseY * Math.PI / 2;

            // Damping factor to smooth out rotation
            const dampingFactor = 0.1;

            // Apply rotation with damping
            head.rotation.y += (targetRotationY - head.rotation.y) * dampingFactor;
            head.rotation.x += (targetRotationX - head.rotation.x) * dampingFactor;
            body.rotation.y += (targetRotationY - body.rotation.y) * dampingFactor;
            leftArm.rotation.y += (targetRotationY - leftArm.rotation.y) * dampingFactor;
            leftLeg.rotation.y += (targetRotationY - leftLeg.rotation.y) * dampingFactor;
            rightArm.rotation.y += (targetRotationY - rightArm.rotation.y) * dampingFactor;
            rightLeg.rotation.y += (targetRotationY - rightLeg.rotation.y) * dampingFactor;
            rightArmLayer.rotation.y += (targetRotationY - rightArmLayer.rotation.y) * dampingFactor;
            leftArmLayer.rotation.y += (targetRotationY - leftArmLayer.rotation.y) * dampingFactor;

            // Rotation limits (optional)
            const maxRotationX = Math.PI / 4; // 45 degrees
            const minRotationX = -Math.PI / 4; // -45 degrees

            // Cap rotation within limits
            head.rotation.x = THREE.MathUtils.clamp(head.rotation.x, minRotationX, maxRotationX);
            body.rotation.x = THREE.MathUtils.clamp(body.rotation.x, minRotationX, maxRotationX);
            leftArm.rotation.x = THREE.MathUtils.clamp(leftArm.rotation.x, minRotationX, maxRotationX);
            rightArm.rotation.x = THREE.MathUtils.clamp(rightArm.rotation.x, minRotationX, maxRotationX);
            leftLeg.rotation.x = THREE.MathUtils.clamp(leftLeg.rotation.x, minRotationX, maxRotationX);
            rightLeg.rotation.x = THREE.MathUtils.clamp(rightLeg.rotation.x, minRotationX, maxRotationX);
            rightArmLayer.rotation.x = THREE.MathUtils.clamp(rightArmLayer.rotation.x, minRotationX, maxRotationX);
            leftArmLayer.rotation.x = THREE.MathUtils.clamp(leftArmLayer.rotation.x, minRotationX, maxRotationX);
          });
        }
      },
      undefined,
      (error) => {
        console.error('Error loading Minecraft player model', error);
      }
    );

    // Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // // Cleanup on component unmount (optional)
    // return () => {
    //   window.removeEventListener('resize');
    //   window.removeEventListener('mousemove');
    // };
  });
</script>

<div bind:this={container} class="canvas-container"></div>

<style>
  .canvas-container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
