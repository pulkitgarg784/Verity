export class UserInterface {
  constructor() {
    this.container = this.createUIContainer();
    this.messageElement = this.createMessageElement();
    this.scoreElement = this.createScoreElement();
    this.buttonContainer = this.createButtonContainer();
    this.realButton = this.createButton("Real", "real-btn");
    this.fakeButton = this.createButton("Fake", "fake-btn");
    this.startButton = this.createButton("Start Game", "start-btn");
    this.dialogueBox = this.createDialogueBox();

    this.container.appendChild(this.messageElement);
    this.container.appendChild(this.scoreElement);
    this.buttonContainer.appendChild(this.realButton);
    this.buttonContainer.appendChild(this.fakeButton);
    this.container.appendChild(this.buttonContainer);
    this.container.appendChild(this.startButton);
    document.body.appendChild(this.dialogueBox);
    document.body.appendChild(this.container);

    this.hideGameButtons();
  }

  createUIContainer() {
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.bottom = "20px";
    container.style.left = "50%";
    container.style.transform = "translateX(-50%)";
    container.style.padding = "15px";
    container.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    container.style.borderRadius = "10px";
    container.style.color = "white";
    container.style.fontFamily = "Arial, sans-serif";
    container.style.textAlign = "center";
    container.style.width = "80%";
    container.style.maxWidth = "600px";
    return container;
  }

  createMessageElement() {
    const element = document.createElement("div");
    element.style.marginBottom = "15px";
    element.style.fontSize = "18px";
    element.textContent = "Welcome to the Fake News Detector Game!";
    return element;
  }

  createScoreElement() {
    const element = document.createElement("div");
    element.style.marginBottom = "15px";
    element.style.fontSize = "16px";
    element.textContent = "Score: 0 / 0";
    return element;
  }

  createButtonContainer() {
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.justifyContent = "center";
    container.style.gap = "20px";
    container.style.marginBottom = "15px";
    return container;
  }

  createButton(text, id) {
    const button = document.createElement("button");
    button.id = id;
    button.textContent = text;
    button.style.padding = "10px 20px";
    button.style.fontSize = "16px";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.style.border = "none";

    if (id === "real-btn") {
      button.style.backgroundColor = "#4CAF50";
    } else if (id === "fake-btn") {
      button.style.backgroundColor = "#f44336";
    } else {
      button.style.backgroundColor = "#2196F3";
    }

    button.style.color = "white";
    return button;
  }

  createDialogueBox() {
    const dialogueBox = document.createElement("div");
    dialogueBox.id = "dialogue-box";
    dialogueBox.style.position = "absolute";
    dialogueBox.style.top = "10px";
    dialogueBox.style.left = "50%";
    dialogueBox.style.transform = "translateX(-50%)";
    dialogueBox.style.padding = "10px 20px";
    dialogueBox.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    dialogueBox.style.color = "white";
    dialogueBox.style.fontFamily = "Arial, sans-serif";
    dialogueBox.style.fontSize = "16px";
    dialogueBox.style.borderRadius = "5px";
    dialogueBox.style.textAlign = "center";
    dialogueBox.style.display = "none";
    return dialogueBox;
  }

  showDialogue(message, duration = 3000, italics = false) {
    console.log(message);
    if (italics) {
      message = `<i>${message}</i>`;
      this.dialogueBox.style.color = "blue";
    } else {
      this.dialogueBox.style.color = "white";
    }
    this.dialogueBox.style.display = "block";
    this.dialogueBox.innerHTML = message;
    setTimeout(() => {
      this.dialogueBox.style.display = "none";
    }, duration);
  }

  hideStartButton() {
    this.startButton.style.display = "none";
  }

  showGameButtons() {
    this.realButton.style.display = "block";
    this.fakeButton.style.display = "block";
    this.startButton.style.display = "none";
  }

  hideGameButtons() {
    this.realButton.style.display = "none";
    this.fakeButton.style.display = "none";
    this.startButton.style.display = "block";
  }

  disableGameButtons() {
    this.realButton.style.display = "none";
    this.fakeButton.style.display = "none";
  }

  enableGameButtons() {
    this.realButton.style.display = "block";
    this.fakeButton.style.display = "block";
  }

  updateScore(score, round) {
    this.scoreElement.textContent = `Score: ${score} / ${round}`;
  }

  updateMessage(message) {
    this.messageElement.innerHTML = message;
  }

  showEndGame(score, total) {
    this.updateMessage(`Game Over! Your final score: ${score} out of ${total}`);
    this.hideGameButtons();
    this.startButton.textContent = "Play Again";
    this.startButton.style.display = "block";
  }
}
