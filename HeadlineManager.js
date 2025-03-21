export class HeadlineManager {
  constructor() {
    this.realHeadlines = [
      {
        text: "Voter says he doesn't regret choice despite wife's ICE arrest",
        link: "https://www.newsweek.com/trump-voter-regret-choice-wife-ice-bradley-bartell-camila-munoz-2046988",
      },
      {
        text: "U.S. officials cracking down on people trying to bring valuable eggs across the border",
        link: "https://www.cbc.ca/news/world/us-border-fentanyl-eggs-1.7486369",
      },
      {
        text: "New cancer cure 'disguises' tumors as pork to trigger immune attack",
        link: "https://interestingengineering.com/health/new-cancer-therapy-disguises-tumors-as-pork-to-trigger-immune-attack-90-effective",
      },
      {
        text: "Bleed for Weed blood drive coming to Freeport",
        link: "https://www.wifr.com/2025/03/19/bleed-weed-blood-drive-coming-freeport/",
      },
      {
        text: "Prisoner Fakes Medical Emergency, Escapes Van on Busy Motorway Like a Movie Villain",
        link: "https://insidenewshub.com/prisoner-fakes-medical-emergency-escapes-van-on-busy-motorway-like-a-movie-villain/",
      },
      {
        text: "Big pharma's plea to punish Australia for cheaper medicines",
        link: "https://www.theage.com.au/politics/federal/big-pharma-plea-to-trump-to-punish-australia-for-cheaper-medicines-20250319-p5lko1.html",
      },
      {
        text: "'Segregated facilities' are no longer explicitly banned in federal contracts",
        link: "https://www.npr.org/sections/shots-health-news/2025/03/18/nx-s1-5326118/segregation-federal-contracts-far-regulation-trump",
      },
      {
        text: "Antarctic scientist accused of threatening to kill colleagues at research base apologises",
        link: "https://www.independent.co.uk/news/world/crime/antarctic-scientist-threat-sanae-south-africa-b2717167.html",
      },
      {
        text: "Church daycare shut down after worker gave toddlers Benadryl for nap",
        link: "https://www.the-independent.com/news/world/americas/crime/church-daycare-shut-down-benadryl-georgia-b2717534.html",
      },
      {
        text: "Pet pig stolen at local hiking trail",
        link: "https://kesq.com/news/2025/03/19/pet-pig-stolen-at-local-hiking-trail/",
      },
    ];

    this.fakeHeadlines = [
      "Local Woman Sues Bakery for Using 'Too Much' Cinnamon in Her Apple Pie",
      "Government Plans to Implement 'Nap Time' in Schools to Improve Test Scores",
      "Famous Actor Claims He Can Predict the Future Using Only His Left Shoe",
      "Texas Billboards Tease Enron's Return, Sparking Mixed Reactions Amidst State",
      "Humpback Whale Briefly Engulfs Kayaker Off Chile's Coast; Experts Confirm Swallowing Impossible",
      "Canada Offers to Host Global Summit in 'Northern Lights Viewing' Rooms to Boost International Unity",
      "Russia Bans Use of All Western Brands Except for McDonald's, Citing 'Cultural Importance'",
      "Mexico Plans to Build a 'Cultural Wall' Between Itself and the U.S. to Promote Traditional Art",
      "Town Bans Snowball Fights After Series of 'Snowball-Based' Injuries",
      "Woman Claims Her Pet Goldfish Can Predict Stock Market Trends",
      "Government Considering 'Mandatory Screen Time' for Adults to Boost Mental Health",
      "Study Finds That People Who Eat Pizza for Breakfast Are More Likely to Be Successful CEOs",
      "Local Cafe Introduces 'Air-Flavored Coffee' to Cater to New 'Breath-Based' Diet Trends",
      "President Announces Plan to Replace All National Holidays with 'Random Act of Kindness Day'",
      "Scientists Discover That Wearing Socks While Sleeping Improves Dream Quality",
      "Local Restaurant Bans All Green Foods, Declaring Them 'Too Controversial'",
      "Man Builds House Out of Pizza Boxes to Protest Global Housing Crisis",
      "City Implements 'Quiet Hours' for Social Media to Reduce Online Arguments",
      "New App Lets Users Rent Friends for Group Photos to Boost Social Media Credibility",
      "Luxury Brand Sells $500 'Pre-Distressed' Sneakers That Look Like They've Been Through a War Zone",
      "City Introduces 'Walking Tax' to Fund Sidewalk Repairs, Sparking Public Outrage",
      "New Dating App Matches Users Based on Their Grocery Shopping Habits",
      "Major Airline Announces New Fee for Passengers Who Want to Recline Their Seats",
      "Local School Replaces Detention with Mandatory Meditation Sessions",
      "Luxury Hotel Offers 'Digital Detox' Package That Costs More Than a New Smartphone",
    ];

    this.usedHeadlines = new Set();
    this.currentHeadline = null;
    this.isCurrentHeadlineReal = false;
  }

  getRandomHeadline() {
    this.isCurrentHeadlineReal = Math.random() > 0.5;

    const sourceArray = this.isCurrentHeadlineReal ? this.realHeadlines : this.fakeHeadlines;
    const availableHeadlines = sourceArray.filter((item) => {
      const text = typeof item === "string" ? item : item.text;
      return !this.usedHeadlines.has(text);
    });

    if (availableHeadlines.length === 0) {
      console.warn("No more headlines available in this category.");
      return null;
    }

    const randomIndex = Math.floor(Math.random() * availableHeadlines.length);
    const chosenItem = availableHeadlines[randomIndex];
    const chosenText = typeof chosenItem === "string" ? chosenItem : chosenItem.text;
    const chosenLink = chosenItem.link || null;

    this.currentHeadline = chosenText;
    this.usedHeadlines.add(chosenText);

    return {
      headline: chosenText,
      link: chosenLink,
      isReal: this.isCurrentHeadlineReal,
    };
  }

  validateChoice(playerChoice) {
    return playerChoice === this.isCurrentHeadlineReal;
  }

  resetHeadlines() {
    this.usedHeadlines.clear();
  }
}
