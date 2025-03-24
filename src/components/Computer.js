import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export class Computer extends THREE.Group {
  constructor() {
    super();

    this.name = "computer";

    const loader = new GLTFLoader();
    const computerPath = "./computer.gltf";

    loader.load(
      computerPath,
      (gltf) => {
        const computerModel = gltf.scene;
        computerModel.scale.set(0.25, 0.25, 0.25);
        computerModel.position.set(-0.25, 0.8, -1.2);
        computerModel.rotation.set(0, 135, 0);
        this.add(computerModel);

        this.paperSurface = this.createPaperForHeadline();
        this.add(this.paperSurface);
      },
      (xhr) => {
        console.log(`Computer model loading: ${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      (error) => {
        console.error("An error occurred while loading the computer model:", error);
      }
    );
  }

  createPaperForHeadline() {
    const paperGeometry = new THREE.PlaneGeometry(0.45, 0.425);
    const paperMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });

    const paperMesh = new THREE.Mesh(paperGeometry, paperMaterial);
    paperMesh.position.set(-0.275, 1.25, -0.9);
    paperMesh.rotation.y = Math.PI * -0.035;

    return paperMesh;
  }

  loadWebsiteToScreen(url) {
    const iframe = document.createElement("iframe");
    iframe.style.width = "800px";
    iframe.style.height = "600px";
    iframe.style.position = "absolute";
    iframe.style.top = "-9999px";
    iframe.style.left = "-9999px";
    iframe.src = url;

    document.body.appendChild(iframe);

    iframe.onload = () => {
      setTimeout(() => {
        html2canvas(iframe.contentDocument.body)
          .then((canvas) => {
            const texture = new THREE.CanvasTexture(canvas);

            if (this.displaySurface) {
              this.displaySurface.material.map = texture;
              this.displaySurface.material.color.set(0xffffff);
              this.displaySurface.material.needsUpdate = true;
            }

            document.body.removeChild(iframe);
          })
          .catch((error) => {
            console.error("Couldn't capture website content:", error);
            document.body.removeChild(iframe);
          });
      }, 2000);
    };
  }

  displayHeadline(headline) {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = "48px Arial";
    context.fillStyle = "black";
    context.textAlign = "center";
    context.textBaseline = "middle";

    const maxWidth = 980;
    const words = headline.split(" ");
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const testLine = currentLine + " " + words[i];
      const metrics = context.measureText(testLine);

      if (metrics.width > maxWidth) {
        lines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);

    const lineHeight = 40;
    const startY = canvas.height / 2 - ((lines.length - 1) * lineHeight) / 2;

    lines.forEach((line, i) => {
      context.fillText(line, canvas.width / 2, startY + i * lineHeight);
    });

    const texture = new THREE.CanvasTexture(canvas);
    this.paperSurface.material.map = texture;
    this.paperSurface.material.needsUpdate = true;
  }
}
