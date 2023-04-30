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

  mesh = (await loader.loadAsync("models/gltf/cube.glb")).scene.getObjectByName('mesh')
  loader.load('models/gltf/cube.glb', (gltf)=>{
    const Cube = gltf.scene.getObjectByName('Cube')
    
    Cube.material = new THREE.PointsMaterial({  size: 0.005,
      color: 0xfffff });
    Cube.position.set(0, 0, 0);
    Cube.scale.set(.1, .1, .1);
    const geometry = new THREE.BufferGeometry().setFromPoints(Cube.geometry.attributes.position);
    const points = new THREE.Points(geometry, material);

    scene.add(points);
  })
  mesh = (await loader.loadAsync("models/gltf/cube.glb")).scene
  const Cube = mesh.getObjectByName('Cube')
  // Mesh init
  sphere = new THREE.Points(geometry, material)

  scene.add(sphere)
  scene.add(mesh)
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