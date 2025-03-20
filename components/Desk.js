import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class Desk extends THREE.Group {
  constructor() {
    super();

    // Load the GLTF model
    const loader = new GLTFLoader();
    const deskPath = './Assets/Desk/desk.gltf'; // Path to the GLTF file

    loader.load(
      deskPath,
      (gltf) => {
        // Add the loaded model to the group
        const deskModel = gltf.scene;
        deskModel.scale.set(0.25, 0.25, 0.25); // Scale the model if needed
        deskModel.position.set(0, 0, 0); // Adjust position if needed
        deskModel.rotation.set(0, 180, 0); // Adjust rotation if needed
        this.add(deskModel);
      },
      (xhr) => {
        console.log(`Desk model loading: ${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      (error) => {
        console.error('An error occurred while loading the desk model:', error);
      }
    );
  }
}