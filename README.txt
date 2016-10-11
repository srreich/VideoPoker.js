The following is a Javascript implementation of a handheld video poker game.

To start playing: 
    1. Open a Javascript console in your internet browser.
    2. Copy the entire script and paste it into the console.
    3. Create a variable and set it equal to a new Poker object. e.g. var work = new Poker()

To draw a new hand:
    Run the newHand() method on your variable. e.g. work.newHand()
    Each draw of a new hand costs 2 credits.

To show which cards are in your hand:
    Run the showHand() method on your variable. e.g. work.showHand()
    
To show how many draws you have remaining:
    Run the showDrawsRemaining() method on your variable. e.g. work.showDrawsRemaining()

To show how many credits you have:
    Run the showCredits() method on your variable. e.g. work.showCredits()
    
To replace cards in your hand:
    Run the drawCards() method on your variable. You must pass in a one indexed array
    containing which hand positions you want to swap out. Your new hand will show in
    the console after the cards have been drawn.
    
    e.g. If your hand is as shown:
            4 Hearts
            Ace Diamonds
            Jack Diamonds
            2 Spades
            King Diamonds
        And you want to swap the (4 Hearts) and (2 Spades) cards you would run work.drawCards( [1,4] )

To pass/skip a round for drawing cards:
    Run the pass() method on your variable. e.g. work.pass()

The payout table is as follows:
    Royal Flush: 250 credits
    Straight Flush: 50 credits
    Four of a Kind: 25 credits
    Full House: 9 credits
    Flush: 6 credits
    Straight: 4 credits
    Three of a Kind: 3 credits
    Two Pairs in hand: 2 credits
    Jacks or better in hand: 1 credit