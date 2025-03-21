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
        //this.displaySurface = this.createDisplaySurface();
        //computerModel.add(this.displaySurface);

        this.paperSurface = this.createPaperForHeadline();
        this.add(this.paperSurface);
      },
      (xhr) => {
        console.log(`Computer model loading: ${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      (error) => {
        console.error('An error occurred while loading the computer model:', error);
      }
    );
  }

  // createDisplaySurface() {
  //   // Create a plane slightly in front of the screen to display headlines
  //   const displayGeometry = new THREE.PlaneGeometry(1.8, 2);
  //   const displayMaterial = new THREE.MeshBasicMaterial({
  //     color: 0x3a86ff,
  //     side: THREE.DoubleSide,
  //   });

  //   const displayMesh = new THREE.Mesh(displayGeometry, displayMaterial);
  //   displayMesh.position.set(0, 1.55, -1.175); // Adjust position to align with the screen

  //   // Rotate the plane 180 degrees around the Y-axis to fix the flipped text
  //   displayMesh.rotation.y = Math.PI;

  //   // Add method to display iframe
  //   this.loadWebsiteToScreen('http://www.example.com');

  //   return displayMesh;
  // }

  createPaperForHeadline() {
    const paperGeometry = new THREE.PlaneGeometry(0.45, 0.425);
    const paperMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });

    const paperMesh = new THREE.Mesh(paperGeometry, paperMaterial);
    paperMesh.position.set(-0.275, 1.25, -0.9); // Place it near the computer
    paperMesh.rotation.y = Math.PI * -0.035;    // Face it properly

    return paperMesh;
  }

  loadWebsiteToScreen(url) {
    // Create temporary iframe to capture
    const iframe = document.createElement('iframe');
    iframe.style.width = '800px';
    iframe.style.height = '600px';
    iframe.style.position = 'absolute';
    iframe.style.top = '-9999px';
    iframe.style.left = '-9999px';
    iframe.src = url;
    
    document.body.appendChild(iframe);
    
    // Give the iframe time to load content, then capture it
    iframe.onload = () => {
      setTimeout(() => {
        // Note: This might not work with Google due to X-Frame-Options
        html2canvas(iframe.contentDocument.body).then(canvas => {
          // Create texture from canvas
          const texture = new THREE.CanvasTexture(canvas);
          
          // Apply to display surface
          if (this.displaySurface) {
            this.displaySurface.material.map = texture;
            this.displaySurface.material.color.set(0xffffff); // Reset color to white
            this.displaySurface.material.needsUpdate = true;
          }
          
          // Remove temporary iframe
          document.body.removeChild(iframe);
        }).catch(error => {
          console.error("Couldn't capture website content:", error);
          document.body.removeChild(iframe);
        });
      }, 2000); // Give it 2 seconds to load
    };
  }

  displayHeadline(headline) {
    // Create a canvas texture for the headline
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const context = canvas.getContext('2d');

    // Clear canvas
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Format and draw headline
    context.font = '24px Arial';
    context.fillStyle = 'black';
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
    this.paperSurface.material.map = texture;
    this.paperSurface.material.needsUpdate = true;
  }
}