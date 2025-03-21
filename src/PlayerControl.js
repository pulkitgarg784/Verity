import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";

export class PlayerControls {
  constructor(camera, scene) {
    this.camera = camera;
    this.scene = scene;

    this.moveSpeed = 100.0;
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;

    this.isSittingAtComputer = false;
    this.cameraHeight = 1.6;
    this.sittingHeight = 1.3;

    this.playerCollider = new THREE.Sphere(camera.position.clone(), 0.5);

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.originalPosition = new THREE.Vector3();
    this.originalRotation = new THREE.Euler();

    this.controls = new PointerLockControls(this.camera, document.body);
    scene.add(this.controls.object);

    this.initControls();

    this.prevTime = performance.now();

    this.controls.lock();
  }

  initControls() {
    const crosshair = document.getElementById("crosshair");

    document.addEventListener("click", () => {
      if (!this.controls.isLocked && !this.isSittingAtComputer) {
        this.controls.lock();
      }
    });

    this.controls.addEventListener("lock", () => {
      if (crosshair) crosshair.style.display = "block";
    });

    this.controls.addEventListener("unlock", () => {
      if (crosshair) crosshair.style.display = "none";
    });

    document.addEventListener("keydown", (event) => {
      if (this.isSittingAtComputer) {
        if (event.code === "Escape") {
          this.standUp();
        }
        return;
      }

      switch (event.code) {
        case "ArrowUp":
        case "KeyW":
          this.moveForward = true;
          break;

        case "ArrowLeft":
        case "KeyA":
          this.moveLeft = true;
          break;

        case "ArrowDown":
        case "KeyS":
          this.moveBackward = true;
          break;

        case "ArrowRight":
        case "KeyD":
          this.moveRight = true;
          break;
      }
    });

    document.addEventListener("keyup", (event) => {
      switch (event.code) {
        case "ArrowUp":
        case "KeyW":
          this.moveForward = false;
          break;

        case "ArrowLeft":
        case "KeyA":
          this.moveLeft = false;
          break;

        case "ArrowDown":
        case "KeyS":
          this.moveBackward = false;
          break;

        case "ArrowRight":
        case "KeyD":
          this.moveRight = false;
          break;
      }
    });

    document.addEventListener("click", (event) => {
      if (!this.controls.isLocked && !this.isSittingAtComputer) {
        return;
      }

      if (this.controls.isLocked) {
        this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
      } else {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);
      }

      const intersects = this.raycaster.intersectObjects(this.scene.children, true);

      for (let i = 0; i < intersects.length; i++) {
        let object = intersects[i].object;

        while (object && object.parent) {
          if (object.parent.name === "computer" || object.name === "computer") {
            this.sitAtComputer(object.parent || object);
            break;
          }
          object = object.parent;
        }
      }
    });
  }

  sitAtComputer(computer) {
    if (this.isSittingAtComputer) return;

    this.originalPosition.copy(this.controls.object.position);
    this.originalRotation.copy(this.camera.rotation);

    this.controls.unlock();

    const targetPosition = new THREE.Vector3(0, this.sittingHeight, 0.5);

    this.transitionToPosition(targetPosition, () => {
      this.isSittingAtComputer = true;
      this.camera.lookAt(0, 1.2, 0);
    });
  }

  standUp() {
    if (!this.isSittingAtComputer) return;

    this.transitionToPosition(this.originalPosition, () => {
      this.camera.rotation.copy(this.originalRotation);
      this.isSittingAtComputer = false;

      setTimeout(() => {
        if (!this.isSittingAtComputer) {
          this.controls.lock();
        }
      }, 100);
    });
  }

  transitionToPosition(targetPosition, onComplete) {
    const startPosition = new THREE.Vector3();
    startPosition.copy(
      this.isSittingAtComputer ? this.camera.position : this.controls.object.position
    );

    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      const eased = this.easeInOutQuad(progress);

      const newPosition = new THREE.Vector3();
      newPosition.lerpVectors(startPosition, targetPosition, eased);

      if (this.isSittingAtComputer) {
        this.camera.position.copy(newPosition);
      } else {
        this.controls.object.position.copy(newPosition);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else if (onComplete) {
        onComplete();
      }
    };

    requestAnimationFrame(animate);
  }

  easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  update() {
    if (this.isSittingAtComputer) return;

    const time = performance.now();
    const delta = (time - this.prevTime) / 1000;

    this.velocity.x -= this.velocity.x * 10.0 * delta;
    this.velocity.z -= this.velocity.z * 10.0 * delta;

    this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
    this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
    this.direction.normalize();

    if (this.moveForward || this.moveBackward) {
      this.velocity.z -= this.direction.z * this.moveSpeed * delta;
    }
    if (this.moveLeft || this.moveRight) {
      this.velocity.x -= this.direction.x * this.moveSpeed * delta;
    }

    this.controls.moveRight(-this.velocity.x * delta);
    this.controls.moveForward(-this.velocity.z * delta);

    this.playerCollider.center.copy(this.controls.object.position);

    this.prevTime = time;
  }
}
