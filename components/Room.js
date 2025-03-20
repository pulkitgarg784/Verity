import * as THREE from 'three';

export class Room extends THREE.Group {
  constructor() {
    super();
    
    // Room dimensions
    const width = 10;
    const height = 3;
    const depth = 10;
    
    // Create room walls
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0xeeeeee,
      side: THREE.BackSide // Render inside face of the cube
    });
    
    const roomMesh = new THREE.Mesh(geometry, material);
    roomMesh.position.set(0, height/2, 0);
    this.add(roomMesh);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 2, 2);
    this.add(directionalLight);
  }
}