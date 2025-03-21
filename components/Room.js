import * as THREE from 'three';

export class Room extends THREE.Group {
  constructor() {
    super();
    
    // Room dimensions
    const width = 20;
    const height = 5;
    const depth = 20;
    
    // Create white walls
    const wallGeometry = new THREE.BoxGeometry(width, height, depth);
    const wallMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      side: THREE.BackSide // Render inside face of the cube
    });
    
    // Remove bottom face from walls 
    const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
    wallMesh.position.set(0, height/2, 0);
    this.add(wallMesh);
    
    // Create green floor
    const floorGeometry = new THREE.PlaneGeometry(width, depth);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x5DB761, // Green color
      side: THREE.DoubleSide
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = Math.PI / 2;
    floor.position.y = 0.01; // Slightly above to prevent z-fighting
    this.add(floor);
    
    // Add ceiling lights
    this.addCeilingLights(width, height, depth);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.add(ambientLight);
  }
  
  addCeilingLights(width, height, depth) {
    // Create 4 ceiling lights in a grid pattern
    const lightPositions = [
      [-width/4, height-0.1, -depth/4],
      [width/4, height-0.1, -depth/4],
      [-width/4, height-0.1, depth/4],
      [width/4, height-0.1, depth/4]
    ];
    
    // Create each ceiling light
    lightPositions.forEach(position => {
      // Light fixture (white square)
      const fixtureGeometry = new THREE.BoxGeometry(2, 0.1, 2);
      const fixtureMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 3
      });
      
      const fixture = new THREE.Mesh(fixtureGeometry, fixtureMaterial);
      fixture.position.set(...position);
      this.add(fixture);
      
      // Add point light inside each fixture
      const light = new THREE.PointLight(0xffffff, 1, 10);
      light.position.set(position[0], position[1] - 0.2, position[2]);
      this.add(light);
    });
  }
}