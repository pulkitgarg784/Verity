import * as THREE from 'three';
import { Room } from './components/Room.js';
import { Desk } from './components/Desk.js';
import { Computer } from './components/Computer.js';
import { GameState } from './GameState.js';
import { HeadlineManager } from './HeadlineManager.js';
import { UserInterface } from './UserInterface.js';
import { PlayerControls } from './PlayerControl.js';
import { CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';

// Set up scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
document.body.appendChild(renderer.domElement);

const cssRenderer = new CSS3DRenderer();
cssRenderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(cssRenderer.domElement);

// Create game components
const room = new Room();
const desk = new Desk();
const computer = new Computer();
const gameState = new GameState();
const headlineManager = new HeadlineManager();
const userInterface = new UserInterface();
const playerControls = new PlayerControls(camera, scene);

// Add objects to scene
scene.add(room);
scene.add(desk);
scene.add(computer);
computer.position.set(0, 0, 0);
// Set up camera
camera.position.set(0, 1.5, 3);
camera.lookAt(0, 1.2, 0);

// Handle window resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Set up game interactions
userInterface.startButton.addEventListener('click', startGame);
userInterface.realButton.addEventListener('click', () => submitAnswer(true));
userInterface.fakeButton.addEventListener('click', () => submitAnswer(false));

function startGame() {
  gameState.startGame();
  userInterface.showGameButtons();
  userInterface.updateMessage("Is this headline real or fake?");
  displayNewHeadline();
}

function displayNewHeadline() {
  const { headline, isReal } = headlineManager.getRandomHeadline();
  computer.displayHeadline(headline);
  userInterface.updateScore(gameState.score, gameState.currentRound);
}

function submitAnswer(playerChoice) {
  const isCorrect = headlineManager.validateChoice(playerChoice);
  gameState.recordAnswer(isCorrect);
  
  if (isCorrect) {
    userInterface.updateMessage("Correct!");
  } else {
    userInterface.updateMessage("Wrong! That headline was " + 
      (headlineManager.isCurrentHeadlineReal ? "real" : "fake"));
  }
  
  // Display score
  userInterface.updateScore(gameState.score, gameState.currentRound);
  
  // Wait before starting next round
  setTimeout(() => {
    if (gameState.startNewRound()) {
      userInterface.updateMessage("Is this headline real or fake?");
      displayNewHeadline();
    } else {
      const { finalScore, totalRounds } = gameState.endGame();
      userInterface.showEndGame(finalScore, totalRounds);
    }
  }, 2000);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  playerControls.update();
  renderer.render(scene, camera);
  cssRenderer.render(scene, camera);
}

animate();