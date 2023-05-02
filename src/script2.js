import './style.css'
import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'
import { CSS3DRenderer, CSS3DSprite } from 'three/examples/jsm/renderers/CSS3DRenderer.js'

// variables
let camera, scene, renderer;
let controls;
let Cube, Sphere;
let current = 0;

let particlesTotal = 0;
const positions = [];
const objects = [];


async function init() {

  // GltfLoader & Canvas & Scene & Debug
  const loader = new GLTFLoader();

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 5000 );
  camera.position.set( 10, 10, 10 );
  camera.lookAt( 0, 0, 0 );

  scene = new THREE.Scene();

  // init model & particlesTotal

  Cube = (await loader.loadAsync("models/gltf/cube.glb")).scene.children[0]
  // const geometry = Cube.geometry.clone();

  let positionarry = Cube.geometry.attributes.position.array;
  particlesTotal = Cube.geometry.attributes.position.count;
  
  const image = document.createElement( 'img' );
  image.addEventListener( 'load', function () {

    for ( let i = 0; i < particlesTotal; i ++ ) {
      const i3 = i * 3;
      const object = new CSS3DSprite( image.cloneNode() );
      object.position.x = positionarry[i3 + 0];
      object.position.y = positionarry[i3 + 1];
      object.position.z = positionarry[i3 + 2];
      scene.add( object );
      objects.push( object );
    }
    transition();
  } );
  image.src = 'img/sprite.png';

  for (let i = 0; i < particlesTotal; i++) {
    const x = Math.random() * 10;
    const y = Math.random() * 10;
    const z = Math.random() * 10;
    positions.push(x, y, z)
  }

  // renderer
  renderer = new CSS3DRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.getElementById('container').appendChild(renderer.domElement)
  controls = new TrackballControls(camera, renderer.domElement)
  // window init
  window.addEventListener('resize', onWindowResize())
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}


function transition() {

  const offset = current * particlesTotal * 3;
  const duration = 8000;
  
  for (let i = 0, j = offset; i < particlesTotal; i++, j += 3) {
    const object = objects[i]
    new TWEEN.Tween(object.position)
      .to({
        x: positions[j],
        y: positions[j + 1],
        z: positions[j + 2]
      }, Math.random() * duration + duration)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();
  }

  new TWEEN.Tween(this)
    .to({}, duration * 3)
    .onComplete(transition)
    .start();

  current = (current + 1) % 4;
}

function animate() {
  requestAnimationFrame(animate);
  TWEEN.update()
  controls.update()
    for ( let i = 0, l = objects.length; i < l; i ++ ) {
      const object = objects[ i ];
      const scale = 0.0006
      object.scale.set( scale, scale, scale );
    }
  renderer.render(scene, camera);
}

init().then(()=>{
animate()
})
