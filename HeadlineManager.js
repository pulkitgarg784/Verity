export class HeadlineManager {
  constructor() {
    this.realHeadlines = [
      "Voter says he doesn't regret choice despite wife's ICE arrest",
      "U.S. officials cracking down on people trying to bring valuable eggs across the border",
      "Egg interceptions up 116% so far this year, while seizures of fentanyl down 32%",
      "New cancer cure 'disguises' tumors as pork to trigger immune attack",
      "Bleed for Weed blood drive coming to Freeport",
      "Prisoner Fakes Medical Emergency, Escapes Van on Busy Motorway Like a Movie Villain",
      "Big pharma’s plea to punish Australia for cheaper medicines",
      "'Segregated facilities' are no longer explicitly banned in federal contracts",
      "Antarctic scientist accused of threatening to kill colleagues at research base apologises",
      "Church daycare shut down after worker gave toddlers Benadryl for nap: Authorities",
      "Pet pig stolen at local hiking trail",
    ];
    
    this.fakeHeadlines = [
      "Local Woman Sues Bakery for Using 'Too Much' Cinnamon in Her Apple Pie",
      "Government Plans to Implement ‘Nap Time’ in Schools to Improve Test Scores",
      "Famous Actor Claims He Can Predict the Future Using Only His Left Shoe",
      "Texas Billboards Tease Enron's Return, Sparking Mixed Reactions Amidst State",
      "Humpback Whale Briefly Engulfs Kayaker Off Chile's Coast; Experts Confirm Swallowing Impossible",
      "Canada Offers to Host Global Summit in ‘Northern Lights Viewing’ Rooms to Boost International Unity",
      "Russia Bans Use of All Western Brands Except for McDonald’s, Citing ‘Cultural Importance'",
      "Mexico Plans to Build a ‘Cultural Wall’ Between Itself and the U.S. to Promote Traditional Art",
      "Town Bans Snowball Fights After Series of ‘Snowball-Based’ Injuries",
      "Woman Claims Her Pet Goldfish Can Predict Stock Market Trends",
      "Government Considering ‘Mandatory Screen Time’ for Adults to Boost Mental Health",
      "Study Finds That People Who Eat Pizza for Breakfast Are More Likely to Be Successful CEOs",
      "Local Cafe Introduces ‘Air-Flavored Coffee’ to Cater to New ‘Breath-Based’ Diet Trends",
      "President Announces Plan to Replace All National Holidays with ‘Random Act of Kindness Day’",
      "Scientists Discover That Wearing Socks While Sleeping Improves Dream Quality",
      "Local Restaurant Bans All Green Foods, Declaring Them ‘Too Controversial’",
      "Man Builds House Out of Pizza Boxes to Protest Global Housing Crisis",
      "City Implements ‘Quiet Hours’ for Social Media to Reduce Online Arguments",
      "New App Lets Users Rent Friends for Group Photos to Boost Social Media Credibility",
      "Luxury Brand Sells $500 ‘Pre-Distressed’ Sneakers That Look Like They’ve Been Through a War Zone",
      "City Introduces ‘Walking Tax’ to Fund Sidewalk Repairs, Sparking Public Outrage",
      "New Dating App Matches Users Based on Their Grocery Shopping Habits",
      "Major Airline Announces New Fee for Passengers Who Want to Recline Their Seats",
      "Local School Replaces Detention with Mandatory Meditation Sessions",
      "Luxury Hotel Offers ‘Digital Detox’ Package That Costs More Than a New Smartphone",
    ];
    
    this.usedHeadlines = new Set();
    this.currentHeadline = null;
    this.isCurrentHeadlineReal = false;
  }
  
  getRandomHeadline() {
    // Randomly choose between real and fake
    this.isCurrentHeadlineReal = Math.random() > 0.5;
    
    const sourceArray = this.isCurrentHeadlineReal ? this.realHeadlines : this.fakeHeadlines;
    const availableHeadlines = sourceArray.filter(headline => !this.usedHeadlines.has(headline));
    
    if (availableHeadlines.length === 0) {
      console.warn("No more headlines available in this category.");
      return null; // No more headlines available
    }
    
    const randomIndex = Math.floor(Math.random() * availableHeadlines.length);
    this.currentHeadline = availableHeadlines[randomIndex];
    this.usedHeadlines.add(this.currentHeadline);
    
    return {
      headline: this.currentHeadline,
      isReal: this.isCurrentHeadlineReal
    };
  }
  
  validateChoice(playerChoice) {
    return playerChoice === this.isCurrentHeadlineReal;
  }
  
  resetHeadlines() {
    this.usedHeadlines.clear();
  }
}