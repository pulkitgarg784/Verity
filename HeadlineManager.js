export class HeadlineManager {
  constructor() {
    this.realHeadlines = [
    "Real",
    "Real",
    "Real",
    "Real",
    ];
    
    this.fakeHeadlines = [
      "Fake",
      "Fake",
      "Fake",
      "Fake",
    ];
    
    this.currentHeadline = null;
    this.isCurrentHeadlineReal = false;
  }
  
  getRandomHeadline() {
    // Randomly choose between real and fake
    this.isCurrentHeadlineReal = Math.random() > 0.5;
    
    const sourceArray = this.isCurrentHeadlineReal ? this.realHeadlines : this.fakeHeadlines;
    const randomIndex = Math.floor(Math.random() * sourceArray.length);
    
    this.currentHeadline = sourceArray[randomIndex];
    return {
      headline: this.currentHeadline,
      isReal: this.isCurrentHeadlineReal
    };
  }
  
  validateChoice(playerChoice) {
    return playerChoice === this.isCurrentHeadlineReal;
  }
}