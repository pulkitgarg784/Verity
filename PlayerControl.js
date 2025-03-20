import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

export class PlayerControls {
  constructor(camera, scene) {
    this.camera = camera;
    this.scene = scene;
    
    // Movement settings
    this.moveSpeed = 100.0;
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    
    // Control states
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    
    // Computer interaction states
    this.isSittingAtComputer = false;
    this.cameraHeight = 1.6; // Standing eye level
    this.sittingHeight = 1.3; // Sitting eye level
    
    // Collision detection
    this.playerCollider = new THREE.Sphere(camera.position.clone(), 0.5);
    
    // Raycasting
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    
    // Original position storage for computer interaction
    this.originalPosition = new THREE.Vector3();
    this.originalRotation = new THREE.Euler();
    
    // Initialize pointer lock controls
    this.controls = new PointerLockControls(this.camera, document.body);
    scene.add(this.controls.object);
    
    // Setup all event handlers
    this.initControls();
    
    // Track time for movement calculations
    this.prevTime = performance.now();
    
    // Auto-lock controls at start (since we're not using blocker UI)
      this.controls.lock();
  }
  
  initControls() {
    const crosshair = document.getElementById('crosshair');

    // Handle clicking to lock pointer
    document.addEventListener('click', () => {
      if (!this.controls.isLocked && !this.isSittingAtComputer) {
        this.controls.lock();
      }
    });

    // Show crosshair when pointer is locked
    this.controls.addEventListener('lock', () => {
      if (crosshair) crosshair.style.display = 'block';
    });

    // Hide crosshair when pointer is unlocked
    this.controls.addEventListener('unlock', () => {
      if (crosshair) crosshair.style.display = 'none';
    });

    // Keyboard controls
    document.addEventListener('keydown', (event) => {
      if (this.isSittingAtComputer) {
        // When sitting, only process Escape key
        if (event.code === 'Escape') {
          this.standUp();
        }
        return;
      }
      
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          this.moveForward = true;
          break;
          
        case 'ArrowLeft':
        case 'KeyA':
          this.moveLeft = true;
          break;
          
        case 'ArrowDown':
        case 'KeyS':
          this.moveBackward = true;
          break;
          
        case 'ArrowRight':
        case 'KeyD':
          this.moveRight = true;
          break;
      }
    });
    
    document.addEventListener('keyup', (event) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          this.moveForward = false;
          break;
          
        case 'ArrowLeft':
        case 'KeyA':
          this.moveLeft = false;
          break;
          
        case 'ArrowDown':
        case 'KeyS':
          this.moveBackward = false;
          break;
          
        case 'ArrowRight':
        case 'KeyD':
          this.moveRight = false;
          break;
      }
    });
    
    // Handle clicking on objects
    document.addEventListener('click', (event) => {
      if (!this.controls.isLocked && !this.isSittingAtComputer) {
        return; // Don't process clicks unless controls are locked or we're sitting
      }
      
      // If we're already locked (in FPS mode), use center of screen for raycasting
      if (this.controls.isLocked) {
        this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
      } else {
        // Otherwise use mouse coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);
      }
      
      // Check for intersections
      const intersects = this.raycaster.intersectObjects(this.scene.children, true);
      
      // Check if we clicked on the computer
      for (let i = 0; i < intersects.length; i++) {
        let object = intersects[i].object;
        
        // Try to find the Computer object
        while (object && object.parent) {
          if (object.parent.name === 'computer' || object.name === 'computer') {
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
    
    // Save current position and rotation
    this.originalPosition.copy(this.controls.object.position);
    this.originalRotation.copy(this.camera.rotation);
    
    // Exit pointer lock
    this.controls.unlock();
    
    // Calculate position in front of computer
    const targetPosition = new THREE.Vector3(0, this.sittingHeight, 0.5);
    
    // Transition to sitting position
    this.transitionToPosition(targetPosition, () => {
      this.isSittingAtComputer = true;
      this.camera.lookAt(0, 1.2, 0); // Look at computer screen
    });
  }
  
  standUp() {
    if (!this.isSittingAtComputer) return;
    
    // Return to original position
    this.transitionToPosition(this.originalPosition, () => {
      this.camera.rotation.copy(this.originalRotation);
      this.isSittingAtComputer = false;
      
      // After standing up, re-enable controls
      setTimeout(() => {
        if (!this.isSittingAtComputer) {
          this.controls.lock();
        }
      }, 100);
    });
  }
  
  transitionToPosition(targetPosition, onComplete) {
    const startPosition = new THREE.Vector3();
    startPosition.copy(this.isSittingAtComputer ? 
      this.camera.position : 
      this.controls.object.position);
      
    const duration = 1000; // milliseconds
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing function
      const eased = this.easeInOutQuad(progress);
      
      // Calculate interpolated position
      const newPosition = new THREE.Vector3();
      newPosition.lerpVectors(startPosition, targetPosition, eased);
      
      // Apply the new position
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
    // Don't process movement when sitting at computer
    if (this.isSittingAtComputer) return;
    
    const time = performance.now();
    const delta = (time - this.prevTime) / 1000; // Convert to seconds
    
    // Apply drag/friction
    this.velocity.x -= this.velocity.x * 10.0 * delta;
    this.velocity.z -= this.velocity.z * 10.0 * delta;
    
    // Set direction based on keys
    this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
    this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
    this.direction.normalize(); // Ensure consistent movement speed in all directions
    
    // Apply movement to velocity
    if (this.moveForward || this.moveBackward) {
      this.velocity.z -= this.direction.z * this.moveSpeed * delta;
    }
    if (this.moveLeft || this.moveRight) {
      this.velocity.x -= this.direction.x * this.moveSpeed * delta;
    }
    
    // Apply movement to controls
    this.controls.moveRight(-this.velocity.x * delta);
    this.controls.moveForward(-this.velocity.z * delta);
    
    // Update player collider position
    this.playerCollider.center.copy(this.controls.object.position);
    
    this.prevTime = time;
  }
}