import './style.css'
import * as THREE from 'three'
import {TWEEN} from '@tweenjs/tween.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import TrackballControlls from 'three-trackballcontrols';
// variables 
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
let Canvas, sphere, pointLight, camera, renderer, scene, controls, mesh
const objects = []
const particlesTotal = 512
const positions = []

// GltfLoader & Canvas & Scene & Debug
const loader = new GLTFLoader();

function onWindowResize(){
    // update size
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    // update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    // update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}
async function init() {
  Canvas = document.querySelector('canvas.webgl')

  // add Object on scence
  scene = new THREE.Scene()

  //Lights init
  pointLight = new THREE.PointLight(0xffffff, .1)
  pointLight.position.x = 2
  pointLight.position.y = 3
  pointLight.position.z = 4

  // base camera  
  camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
  camera.position.x = 0
  camera.position.y = 0
  camera.position.z = 2

  // renderer
  renderer = new THREE.WebGLRenderer({canvas: Canvas})
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  
  //
  controls = new TrackballControlls(camera, renderer.domElement)

  // window init
  window.addEventListener('resize', onWindowResize())



  // Object an Material
  const geometry = new THREE.TorusGeometry(.7, .2, 16, 100)
  const material = new THREE.PointsMaterial({ size: 0.005 })

  loader.load('models/gltf/sphere.glb', (gltf)=>{
    const mesh = gltf.scene.children[0];
    const geometry = mesh.geometry.clone();

    const positions = geometry.attributes.position.array;
    const numParticles = positions.length / 3; // assuming each vertex has three components: x, y, z
    const particlePositions = new Float32Array(numParticles * 3);

    for (let i = 0; i < numParticles; i++) {
      const i3 = i * 3;
      const x = positions[i3 + 0];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];

      // Calculate a random offset from the original vertex position
      const offset = new THREE.Vector3(
        Math.random() * 0.1 - 0.05,
        Math.random() * 0.1 - 0.05,
        Math.random() * 0.1 - 0.05
      );

      // Add the offset to the original vertex position to create a new particle position
      const particlePosition = new THREE.Vector3(x, y, z).add(offset);

      // Update the particle position buffer array
      particlePositions[i3 + 0] = particlePosition.x;
      particlePositions[i3 + 1] = particlePosition.y;
      particlePositions[i3 + 2] = particlePosition.z;
    }

    // Create a new buffer attribute with the particle positions and set it on the geometry
    geometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const material = new THREE.PointsMaterial({
      size: 0.01,
      color: 0xffffff,
      opacity: 0.8,
      transparent: true
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    points.material = material;
    

    // scene.add(gltf.scene);
  })

  // Mesh init
  sphere = new THREE.Points(geometry, material)
  scene.add(sphere)
  scene.add(pointLight)
  scene.add(camera)
}


function animate(){

  requestAnimationFrame( animate );
  controls.update();
  const time = performance.now()
  for(let i = 0, l = objects.length; i < l; i++) {
    const object = objects[i]
    const scale = Math.sin((Math.floor(object.position.x)+time)*0.002)*0.3 + 1
    object.scale.set(scale, scale, scale)
  }
  renderer.render(scene, camera)
}

init()
animate()