import * as THREE from 'three';
import { Room } from './components/Room.js';
import { Desk } from './components/Desk.js';
import { Computer } from './components/Computer.js';
import { GameState } from './GameState.js';
import { HeadlineManager } from './HeadlineManager.js';
import { UserInterface } from './UserInterface.js';
import { PlayerControls } from './PlayerControl.js';

// Create loading overlay
const loadingOverlay = document.createElement('div');
loadingOverlay.id = 'loading-overlay';
loadingOverlay.innerHTML = `
  <div class="loading-container">
    <h2>Loading Game Assets</h2>
    <div class="loading-spinner"></div>
    <p>Preparing your fake news detection workstation...</p>
  </div>
`;
document.body.appendChild(loadingOverlay);

// Add CSS for loading overlay
const style = document.createElement('style');
style.textContent = `
  #loading-overlay {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.85);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .loading-container {
    text-align: center;
    color: white;
    font-family: Arial, sans-serif;
    padding: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
  }
  .loading-spinner {
    margin: 20px auto;
    width: 50px;
    height: 50px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

// Set up scene
const scene = new THREE.Scene();
const listener = new THREE.AudioListener();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.add(listener);

// Define the sound variable
const sound = new THREE.Audio(listener);

const audioLoader = new THREE.AudioLoader();
audioLoader.load('Assets/humm.mp3', function(buffer) {
  console.log("loaded");
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.5);
});

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
document.body.appendChild(renderer.domElement);


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

// Check if models are loaded
let loadingChecks = 0;
const maxChecks = 50; // Will check for 5 seconds max
let modelsLoaded = false;

function checkModelsLoaded() {
  // Check if models are loaded by looking at their children
  if (
    room.children.length > 0 &&
    desk.children.length > 0 &&
    computer.children.length > 0
  ) {
    // Models appear to be loaded
    hideLoadingScreen();
    return;
  }

  // If we've checked too many times, show the UI anyway
  if (loadingChecks >= maxChecks) {
    hideLoadingScreen();
    return;
  }

  loadingChecks++;
  setTimeout(checkModelsLoaded, 100);
}

function hideLoadingScreen() {
  if (!modelsLoaded) {
    modelsLoaded = true;
    document.getElementById('loading-overlay').style.display = 'none';
    // Make sure the start button is visible after loading
    userInterface.startButton.style.display = 'block';
  }
}

// Start checking if models are loaded
setTimeout(checkModelsLoaded, 500);

// Set up game interactions
userInterface.startButton.addEventListener('click', startGame);
userInterface.realButton.addEventListener('click', () => submitAnswer(true));
userInterface.fakeButton.addEventListener('click', () => submitAnswer(false));

function startGame() {
  sound.play();
  userInterface.hideStartButton();

  // Show dialogues in sequence with cumulative delays
  userInterface.showDialogue("I wonder where am I...", 4000, false);

  setTimeout(() => {
    userInterface.showDialogue("Welcome to your new job. Sit down on your desk and sort the truth from the lies. Your survival depends on it.", 4000, true);
  }, 4000); // Starts after the first dialogue finishes

    // Start the game after all dialogues
    setTimeout(() => {
      gameState.startGame();
      userInterface.showGameButtons();
      userInterface.updateMessage("Is this headline real or fake?");
      displayNewHeadline();
    }, 8000); // Starts after the fifth dialogue finishes

  setTimeout(() => {
    userInterface.showDialogue("Why is there news headlines on the screen. What am I doing here?", 4000, false);
  }, 9000); // Starts after the second dialogue finishes

  setTimeout(() => {
    userInterface.showDialogue("Am I training an AI? Am I predicting the future?", 4000, false);
  }, 14000); // Starts after the third dialogue finishes

  setTimeout(() => {
    userInterface.showDialogue("Why am I the only person in this room, also why tf is the floor green?", 4000, false);
  }, 16000); // Starts after the fourth dialogue finishes

}

var headline = null;
function displayNewHeadline() {
  headline = headlineManager.getRandomHeadline();
  computer.displayHeadline(headline.headline);
  userInterface.updateScore(gameState.score, gameState.currentRound);
}


function submitAnswer(playerChoice) {
  if(!headline) return;
  const isCorrect = headlineManager.validateChoice(playerChoice);
  gameState.recordAnswer(isCorrect);

  if (isCorrect) {
    userInterface.updateMessage("Correct! That headline was " + 
      (headlineManager.isCurrentHeadlineReal 
        ? `real. Read more at <a href="${headline.link}" target="_blank">${headline.link}</a>` 
        : "fake"
      ))

  } else {
    userInterface.updateMessage("Wrong! That headline was " + 
      (headlineManager.isCurrentHeadlineReal 
        ? `real. Read more at <a href="${headline.link}" target="_blank">${headline.link}</a>` 
        : "fake"
      ));
  }
  
  // Display score
  userInterface.updateScore(gameState.score, gameState.currentRound);
  
  
  // Wait before starting next round
  userInterface.disableGameButtons();

  setTimeout(() => {
    if (gameState.startNewRound()) {
      userInterface.enableGameButtons();
      userInterface.updateMessage("Is this headline real or fake?");
      displayNewHeadline();
    } else {
      const { finalScore, totalRounds } = gameState.endGame();
      userInterface.showEndGame(finalScore, totalRounds);
    }
  }, 3000);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  playerControls.update();
  renderer.render(scene, camera);
}

animate();