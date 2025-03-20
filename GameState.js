export class GameState {
    constructor() {
      this.currentRound = 0;
      this.totalRounds = 5;
      this.score = 0;
      this.isGameActive = false;
      this.isRoundActive = false;
    }
    
    startGame() {
      this.currentRound = 0;
      this.score = 0;
      this.isGameActive = true;
      this.startNewRound();
    }
    
    startNewRound() {
      if (this.currentRound < this.totalRounds) {
        this.currentRound++;
        this.isRoundActive = true;
        return true;
      } else {
        this.endGame();
        return false;
      }
    }
    
    recordAnswer(isCorrect) {
      if (isCorrect) {
        this.score++;
      }
      this.isRoundActive = false;
    }
    
    endGame() {
      this.isGameActive = false;
      return {
        finalScore: this.score,
        totalRounds: this.totalRounds
      };
    }
    
    getCurrentState() {
      return {
        currentRound: this.currentRound,
        totalRounds: this.totalRounds,
        score: this.score,
        isGameActive: this.isGameActive,
        isRoundActive: this.isRoundActive
      };
    }
  }