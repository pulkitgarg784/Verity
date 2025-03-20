import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class Computer extends THREE.Group {
  constructor() {
    super();

    // Set name for identification when clicking
    this.name = 'computer';

    // Load the GLTF model
    const loader = new GLTFLoader();
    const computerPath = './Assets/Computer/computer.gltf'; // Path to the GLTF file

    loader.load(
      computerPath,
      (gltf) => {
        // Add the loaded model to the group
        const computerModel = gltf.scene;
        computerModel.scale.set(0.25, 0.25, 0.25); // Scale the model if needed
        computerModel.position.set(-0.25, 0.8, -1.2); // Adjust position if needed
        computerModel.rotation.set(0, 135, 0); // Adjust rotation if needed
        this.add(computerModel);

        // Add display surface for headlines
        this.displaySurface = this.createDisplaySurface();
        computerModel.add(this.displaySurface);
      },
      (xhr) => {
        console.log(`Computer model loading: ${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      (error) => {
        console.error('An error occurred while loading the computer model:', error);
      }
    );
  }

createDisplaySurface() {
  // Create a plane slightly in front of the screen to display headlines
  const displayGeometry = new THREE.PlaneGeometry(1.8, 2);
  const displayMaterial = new THREE.MeshBasicMaterial({
    color: 0x3a86ff,
    side: THREE.DoubleSide,
  });

  const displayMesh = new THREE.Mesh(displayGeometry, displayMaterial);
  displayMesh.position.set(0, 1.55, -1.175); // Adjust position to align with the screen

  // Rotate the plane 180 degrees around the Y-axis to fix the flipped text
  displayMesh.rotation.y = Math.PI;

  return displayMesh;
}

  displayHeadline(headline) {
    // Create a canvas texture for the headline
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const context = canvas.getContext('2d');

    // Clear canvas
    context.fillStyle = '#3a86ff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Format and draw headline
    context.font = '24px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Word wrap headline
    const maxWidth = 480;
    const words = headline.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const testLine = currentLine + ' ' + words[i];
      const metrics = context.measureText(testLine);

      if (metrics.width > maxWidth) {
        lines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);

    // Draw each line
    const lineHeight = 30;
    const startY = canvas.height / 2 - (lines.length - 1) * lineHeight / 2;

    lines.forEach((line, i) => {
      context.fillText(line, canvas.width / 2, startY + i * lineHeight);
    });

    // Apply canvas as texture
    const texture = new THREE.CanvasTexture(canvas);
    this.displaySurface.material.map = texture;
    this.displaySurface.material.needsUpdate = true;
  }
}