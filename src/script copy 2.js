loader.load('models/gltf/cube.glb', (gltf)=>{
  const Cube = gltf.scene.children[0]
  const geometry = Cube.geometry.clone();

  const positions = geometry.attributes.position.array;
  const positionsnum = geometry.attributes.position.count;
  console.log(positionsnum)
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
  
})
