import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

async function App(){

  let mesh1;
  mesh1 = (await loader.loadAsync("models/gltf/cube.glb")).scene
  mesh1.position.x=1
  mesh1.position.y=-4
  mesh1.position.z=-10
  scene.add(mesh1)

    // Objects
    const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );

    // Materials
    const material = new THREE.PointsMaterial({
        size: 0.005,
    })
    // const material = new THREE.MeshBasicMaterial()
    material.color = new THREE.Color(0xa364ff)

    // Mesh
    const sphere = new THREE.Points(geometry, material)
    scene.add(sphere)

    // Lights

    const pointLight = new THREE.PointLight(0xffffff, 0.1)
    pointLight.position.x = 2
    pointLight.position.y = 3
    pointLight.position.z = 4
    scene.add(pointLight)

    /**
     * Sizes
     */
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    window.addEventListener('resize', () =>
    {
        // Update sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        // Update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()

        // Update renderer
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.x = 0
    camera.position.y = 0
    camera.position.z = 2
    scene.add(camera)

    // Controls
    // const controls = new OrbitControls(camera, canvas)
    // controls.enableDamping = true

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    /**
     * Animate
     */


    const clock = new THREE.Clock()

    const tick = () =>
    {

        const elapsedTime = clock.getElapsedTime()

        // Update objects
        sphere.rotation.y = .5 * elapsedTime
        // Update Orbital Controls
        // controls.update()
        // Render
        // update the morph target values over time
      
        
        // Interpolate amount value
        renderer.render(scene, camera);
        window.requestAnimationFrame(tick)
    }

    tick()

}

App()


// // Define the original geometry and its morph targets
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const morphTarget1 = new THREE.BoxGeometry(0.5, 1.5, 1);
// const morphTarget2 = new THREE.BoxGeometry(1.5, 0.5, 1);

// geometry.morphTargets = [
//   { name: 'morphTarget1', vertices: morphTarget1.attributes.position.array },
//   { name: 'morphTarget2', vertices: morphTarget2.attributes.position.array }
// ];

// // Create a mesh with the original geometry
// const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);
// console.log(mesh)
// let morphTargetIndex = 0; // start with the original shape

// function animate() {
//   requestAnimationFrame(animate);

//   // Update the morph target influence
//   mesh.morphTargetInfluences[morphTargetIndex] += 0.01;

//   if (mesh.morphTargetInfluences[morphTargetIndex] > 1) {
//     // Switch to the next morph target
//     morphTargetIndex++;

//     if (morphTargetIndex >= geometry.morphTargets.length) {
//       // Loop back to the start when we reach the end
//       morphTargetIndex = 0;
//     }
//   }

//   // Reset the other morph target influences
//   for (let i = 0; i < geometry.morphTargets.length; i++) {
//     if (i !== morphTargetIndex) {
//       mesh.morphTargetInfluences[i] = 0;
//     }
//   }

//   renderer.render(scene, camera);
// }
// animate();
