/*
VideoPoker.js

Copyright 2016 Stefan Reich

Licensed under the MIT License

*/

/*
    The following is a JavaScript implementation of a handheld video poker game.
    It is meant to be injected into the browser console by means of a variable,
    and played from there.
*/

// Method added to Array object to randomize elements in an array
// Credit to Stackoverflow user 'con' for their answer found at
// http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
Array.prototype.shuffle = function(){
	var i = this.length;
	var j;
	var temp;
	if ( i == 0 ){
		return this;
	}
	while ( --i ) {
		j = Math.floor( Math.random() * ( i + 1 ) );
		temp = this[i];
		this[i] = this[j];
		this[j] = temp;
	}
	return this;
}

// Method added to Array object so that numbers can be sorted properly.
Array.prototype.sortNumbers = function(){
	return this.sort(function(a,b){return a-b});
}

// Card object to be used in a Deck object.
// The 'pointValue' property is so 'face' cards (Jack, Queen, King, Ace) have an integer
// value representation.
var Card = function(faceValue, pointValue, suit) {
	this.faceValue = faceValue;
	this.pointValue = pointValue;
	this.suit = suit;
};

Card.prototype.showValue = function(){
	console.log(this.faceValue + " " + this.suit);
}

// General Deck object to be used in the Poker object.
// Could potentially be used for other card games with slight modifications made to it.
var Deck = function(){

	this.deck = new Array();
	this.offPile = new Array(); //Any card in here is either in hand or discarded

	faceValues = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"];
	suits = ["Spades", "Hearts", "Diamonds", "Clubs"];

	for(var i = 0; i < faceValues.length; i++){
		for(var j = 0; j < suits.length; j++){
			this.deck.push(new Card(faceValues[i], i+2, suits[j]));
		}
	}
};

Deck.prototype.shuffleDeck = function(){
	this.deck = this.deck.concat(this.offPile); // Combine cards left in deck with offpile
    this.offPile = new Array(); // Clear the offpile
	this.deck.shuffle();
	this.deck.shuffle();
	this.deck.shuffle();
};

Deck.prototype.draw = function(){
	var drawnCard = this.deck.pop();
	this.offPile.push(drawnCard);
	return drawnCard;
};

// Poker object to be used to interface with the deck, and manage credits available
var Poker = function(){
	this.drawsRemaining = 0;
	this.hand = new Array();
	this.gameDeck = new Deck();
	this.credits = 100;
};

Poker.prototype.showDrawsRemaining = function(){
    console.log("Draws remaining: " + this.drawsRemaining);
}

Poker.prototype.showHand = function(){
	for (let card of this.hand){
		card.showValue();
	}
};

Poker.prototype.showCredits = function(){
	console.log("Credits available: " + this.credits);
};

// Takes an array containing the card positions the player wants to swap.
// The array is based on an index of one. 
Poker.prototype.drawCards = function(handPositions){
	if(this.drawsRemaining > 0){
		if(handPositions instanceof Array){
            // So players can't replace a single position more than once per call.
            var positionSet = new Set(handPositions);
			for (let position of positionSet){
				this.hand[position-1] = this.gameDeck.draw();
			}
		}
		this.pass(); // Used to drop remaining draws by one.
	}else{
		console.log("Draw a new hand");
	}
};

// Used directly if the player does not want to draw any cards this round
Poker.prototype.pass = function(){
	// Drops draws remaining down by 1 if any remain.
    if(this.drawsRemaining > 0){
		this.drawsRemaining--;
        this.showDrawsRemaining();
		this.showHand();
	}
    // If the previous if statement brought drawsRemaining to zero,
    // the result is determined, and drawsRemaining is set to signal
    // the need for a new hand to be drawn.
	if(this.drawsRemaining == 0){
		this.drawsRemaining = -1;
		console.log( this.determineResult() );
		this.showCredits();
	}
    // Prompts the user to draw a new hand.
	if(this.drawsRemaining == -1){
		console.log("Draw a new hand");
	}
};

// Handles all elements necessary for drawing a new hand
Poker.prototype.newHand = function(){
	this.credits -= 2;
	this.showCredits();
	this.drawsRemaining = 2;
	this.gameDeck.shuffleDeck();
	this.hand = new Array();
	for(var i = 0; i < 5; i++){
		this.hand.push(this.gameDeck.draw());
	}
    this.showDrawsRemaining();
	this.showHand();
};

/*Handles hand value logic once draws remaining hits zero.
  Payout table used is as follows:
    Royal Flush: 250 credits
    Straight Flush: 50 credits
    Four of a Kind: 25 credits
    Full House: 9 credits
    Flush: 6 credits
    Straight: 4 credits
    Three of a Kind: 3 credits
    Two Pairs in hand: 2 credits
    Jacks or better in hand: 1 credit
*/
Poker.prototype.determineResult = function(){
	
    var flushTest = new Set(); // Size of one for suits means flush
	var pointValues = [];

    // Check each cards suit and point value
	for(var card of this.hand){
		flushTest.add(card.suit);
		pointValues.push(card.pointValue);
	}
	pointValues.sortNumbers(); // Sort values for easier testing
    
    var straightTest = new Set();
    
    // Since all values are sorted in ascending order, we can check for a straight by
    // using a for loop to add 4 minus the iteration count.
    // e.g., 10+(4-0) == Jack(11)+(4-1) == Queen(12)+(4-2) == King(13)+(4-3) == Ace(14)+(4-4)
	for(var i = 0; i < pointValues.length; i++){
		straightTest.add( pointValues[i] + (4-i) );
	}

    // If there is only one value in the flushTest set, all suits are the same.
	var isFlush = (flushTest.size == 1) ? true : false;
    // If there is only one value in the straightTest set, the hand is a straight.
	var isStraight = (straightTest.size == 1) ? true : false;
    // If the hand is both a straight and a flush, it is a straight flush.
	var isStraightFlush = (isFlush && isStraight) ? true : false;
    // If the highest card in the straight flush is an Ace, it is a Royal flush.
	var isRoyalFlush = (isStraightFlush && ( straightTest.has(14) ) ) ? true : false;

    // Payout at this point if a hand has been detected
	if(isRoyalFlush){
		this.credits += 250;
		return "Royal Flush in hand";
	}else if(isStraightFlush){
		this.credits += 50;
		return "Straight Flush in hand";
	}else if(isFlush){
		this.credits += 6;
		return "Flush in hand";
	}else if(isStraight){
		this.credits += 4;
		return "Straight in hand";
	}

    // Check the first four values, and then the last four values of the hand.
    // If either only repeat the same value four times, it is a four of a kind.
	for(var i = 0; i < 2; i++){
		var fourTest = new Set(pointValues.slice(i, i+4));
		if(fourTest.size == 1){
			this.credits += 25;
			return "Four of a kind in hand";
		}
	}

    // Same kind of logic behind four of a kind test, but splitting array into
    // a group of two and three, and then vice versa to check for a full house.
	for(var i = 0; i < 2; i++){
		var pairTest = new Set( pointValues.slice(0, 2+i) );
		var threeTest = new Set( pointValues.slice(2+i, 6) );
		if( (pairTest.size == 1) && (threeTest.size == 1) ){
			this.credits += 9;
			return "Full House in hand";
		}
	}

    // At this point since we know that a four of a kind does not exist, we
    // check to see if three values are the same, using similar logic to the
    // four of a kind test.
	for(var i = 0; i < 3; i++){
		var threeTest = new Set( pointValues.slice(i, i+3) );
		if( threeTest.size == 1 ){
			this.credits += 3;
			return "Three of a kind in hand";
		}
	}

    // At this point, since we know that the hand is not a three of a kind, we
    // can check to see if two pairs exist in the hand.
    // e.g. Set[4, 6, 8] at this point can have originated as:
    //      Array[4, 4, 6, 6, 8], Array[4, 4, 6, 8, 8], or Array[4, 6, 6, 8, 8].
    //      But not: 
    //      Array[4, 4, 4, 6, 8], Array[4, 6, 6, 6, 8], or Array[4, 6, 8, 8, 8].
	var twoPairTest = new Set(pointValues);
	if(twoPairTest.size == 3){
		this.credits += 2;
		return "Two pair in hand";
	}

    // At this point, the only other winning hand it could be is one with at least
    // one face card in it.
	var jacksOrHigherTest = new Set(pointValues.filter(function(value){return value >= 11;}))
	if(jacksOrHigherTest.size){
		this.credits += 1;
		return "Jacks or higher in hand";
	}

    // At this point if nothing has been found, there is nothing in the hand.
	return "Nothing in hand";
};