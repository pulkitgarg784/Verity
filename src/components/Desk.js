import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export class Desk extends THREE.Group {
  constructor() {
    super();

    const loader = new GLTFLoader();
    const deskPath = "./desk.gltf";

    loader.load(
      deskPath,
      (gltf) => {
        const deskModel = gltf.scene;
        deskModel.scale.set(0.25, 0.25, 0.25);
        deskModel.position.set(0, 0, 0);
        deskModel.rotation.set(0, 180, 0);
        this.add(deskModel);
      },
      (xhr) => {
        console.log(`Desk model loading: ${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      (error) => {
        console.error("An error occurred while loading the desk model:", error);
      }
    );
  }
}
