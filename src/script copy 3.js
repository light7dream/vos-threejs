import './style.css'
import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import TrackballControlls from 'three-trackballcontrols';

// variables 
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
let Canvas, pointLight, camera, renderer, scene, controls, mesh, points, refer_points = new Float32Array();
let current = 0
let particlesTotal = 0
const objects = []
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

  await CreateCube()
  for ( let i = 0; i < particlesTotal; i ++ ) {

    positions.push(
      Math.random() * 4000 - 2000,
      Math.random() * 4000 - 2000,
      Math.random() * 4000 - 2000
    );
  }
  transition();
  scene.add(pointLight)
  scene.add(camera)
}

function transition() {

  const offset = current * particlesTotal * 3;
  const duration = 2000;  

  for ( let i = 0, j = offset; i < particlesTotal; i ++, j += 3 ) {

    new TWEEN.Tween( points.geometry.attributes.position )
      .to( {
        array: refer_points
      }, Math.random() * duration + duration )
      .easing( TWEEN.Easing.Exponential.InOut )
      .start();
  }

  new TWEEN.Tween( this )
    .to( {}, duration * 3 )
    .onComplete( transition )
    .start();

  current = ( current + 1 ) % 4;

}

function animate(){

  requestAnimationFrame( animate );
  TWEEN.update()
  controls.update();
  const time = performance.now()
  for(let i = 0, l = objects.length; i < l; i++) {
    const object = mesh
    const scale = Math.sin((Math.floor(object.position.x)+time)*0.002)*0.3 + 1
    object.scale.set(scale, scale, scale)
  }
  renderer.render(scene, camera)
}
init()

animate()


async function CreateCube(){
  
  mesh = (await loader.loadAsync("models/gltf/cube.glb")).scene.children[0]
  const geometry = mesh.geometry.clone();

  const positionarry = geometry.attributes.position.array;
  particlesTotal = geometry.attributes.position.count
  const numParticles = positionarry.length / 3; // assuming each vertex has three components: x, y, z
  const particlePositions = new Float32Array(numParticles * 3);

  for (let i = 0; i < numParticles; i++) {
    const i3 = i * 3;
    const x = positionarry[i3 + 0];
    const y = positionarry[i3 + 1];
    const z = positionarry[i3 + 2];
    positions.push(x,y,z)


    // Add the offset to the original vertex position to create a new particle position
    const particlePosition = new THREE.Vector3(x, y, z);
    // Update the particle position buffer array
    particlePositions[i3 + 0] = particlePosition.x;
    particlePositions[i3 + 1] = particlePosition.y;
    particlePositions[i3 + 2] = particlePosition.z;
    refer_points[i3 + 0] = Math.random() * 0.2 - 0.05;
    refer_points[i3 + 1] = Math.random() * 0.2 - 0.05;
    refer_points[i3 + 2] = Math.random() * 0.2 - 0.05;
  }

  // Create a new buffer attribute with the particle positions and set it on the geometry
  geometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const material = new THREE.PointsMaterial({
    size: 0.01,
    color: 0xffffff,
    opacity: 0.8,
    transparent: true
  });
  points = new THREE.Points(geometry, material);
  scene.add(points);
  objects.push( mesh );

  points.material = material;
  
}
