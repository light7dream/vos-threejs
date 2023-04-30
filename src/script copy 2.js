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
let Canvas, sphere, pointLight, camera, renderer, scene, controls, current
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

  // Object an Material
  const geometry = new THREE.TorusGeometry(.7, .2, 16, 100)
  const material = new THREE.PointsMaterial({ size: 0.005 })

  // Mesh init
  sphere = new THREE.Points(geometry, material)
  objects.push(sphere)

  // Cube

  const amount = 8;
  const separationCube = 150;
  const offset = ( ( amount - 1 ) * separationCube ) / 2;

  for ( let i = 0; i < particlesTotal; i ++ ) {

    const x = ( i % amount ) * separationCube;
    const y = Math.floor( ( i / amount ) % amount ) * separationCube;
    const z = Math.floor( i / ( amount * amount ) ) * separationCube;

    positions.push( x - offset, y - offset, z - offset );

  }
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

  // add Object on scence
  scene = new THREE.Scene()
  scene.add(sphere)
  scene.add(pointLight)
  scene.add(camera)
}
function transition(){
  const offset  = current * particlesTotal *3
  const duration = 2000
  for (let  i = 0, j = offset; i < particlesTotal; i++, j+=3) {
    const object = objects[i]
    new TWEEN.Tween(object.position).to({
      x:positions[j],
      y:positions[j+1],
      z:positions[j+2]
    }, Math.random() * duration + duration)
    .easing(TWEEN.Easing.Exponential.InOut)
    .start()
  }

}
function animate(){

  requestAnimationFrame( animate );
  const TWEEN = new Tween()
  TWEEN.update()
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
transition()
animate()