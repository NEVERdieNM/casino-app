class BlackjackGame {
    constructor() {
      this.deck = this.createDeck();
      this.playerHand = [];
      this.dealerHand = [];
      this.gameStatus = 'betting'; // betting, playing, dealer-turn, complete
      this.bet = 0;
    }
    
    createDeck() {
      const suits = ['♠', '♥', '♦', '♣'];
      const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
      const deck = [];
      
      for (const suit of suits) {
        for (const value of values) {
          let numericValue;
          
          if (value === 'A') {
            numericValue = 11; // Ace starts as 11
          } else if (['J', 'Q', 'K'].includes(value)) {
            numericValue = 10; // Face cards are 10
          } else {
            numericValue = parseInt(value);
          }
          
          deck.push({
            suit,
            value,
            numericValue
          });
        }
      }
      
      return this.shuffleDeck(deck);
    }
    
    shuffleDeck(deck) {
      const shuffled = [...deck];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }
    
    placeBet(amount) {
      if (this.gameStatus !== 'betting') {
        throw new Error('Betting is only allowed before the game starts');
      }
      
      this.bet = amount;
      this.startGame();
    }
    
    startGame() {
      // Reset hands
      this.playerHand = [];
      this.dealerHand = [];
      
      // Deal initial cards
      this.playerHand.push(this.deck.pop());
      this.dealerHand.push(this.deck.pop());
      this.playerHand.push(this.deck.pop());
      this.dealerHand.push(this.deck.pop());
      
      this.gameStatus = 'playing';
      
      // Check for blackjack
      if (this.calculateHandValue(this.playerHand) === 21) {
        return this.endGame();
      }
      
      return this.getGameState();
    }
    
    hit() {
      if (this.gameStatus !== 'playing') {
        throw new Error('Cannot hit at this stage of the game');
      }
      
      this.playerHand.push(this.deck.pop());
      
      // Check for bust or 21
      const playerValue = this.calculateHandValue(this.playerHand);
      if (playerValue > 21 || playerValue === 21) {
        return this.endGame();
      }
      
      return this.getGameState();
    }
    
    stand() {
      if (this.gameStatus !== 'playing') {
        throw new Error('Cannot stand at this stage of the game');
      }
      
      this.gameStatus = 'dealer-turn';
      
      // Dealer plays
      while (this.calculateHandValue(this.dealerHand) < 17) {
        this.dealerHand.push(this.deck.pop());
      }
      
      return this.endGame();
    }
    
    calculateHandValue(hand) {
      let value = 0;
      let aces = 0;
      
      for (const card of hand) {
        value += card.numericValue;
        if (card.value === 'A') {
          aces++;
        }
      }
      
      // Adjust for aces
      while (value > 21 && aces > 0) {
        value -= 10; // Convert ace from 11 to 1
        aces--;
      }
      
      return value;
    }
    
    endGame() {
      this.gameStatus = 'complete';
      
      const playerValue = this.calculateHandValue(this.playerHand);
      const dealerValue = this.calculateHandValue(this.dealerHand);
      
      let outcome;
      let winnings = 0;
      
      // Player busts
      if (playerValue > 21) {
        outcome = 'player-bust';
      }
      // Dealer busts
      else if (dealerValue > 21) {
        outcome = 'dealer-bust';
        winnings = this.bet * 2;
      }
      // Player blackjack
      else if (playerValue === 21 && this.playerHand.length === 2) {
        outcome = 'blackjack';
        winnings = this.bet * 2.5;
      }
      // Player wins
      else if (playerValue > dealerValue) {
        outcome = 'player-win';
        winnings = this.bet * 2;
      }
      // Dealer wins
      else if (dealerValue > playerValue) {
        outcome = 'dealer-win';
      }
      // Push (tie)
      else {
        outcome = 'push';
        winnings = this.bet;
      }
      
      return {
        ...this.getGameState(),
        outcome,
        winnings
      };
    }
    
    getGameState() {
      return {
        playerHand: this.playerHand,
        dealerHand: this.gameStatus === 'playing' 
          ? [this.dealerHand[0], { hidden: true }] 
          : this.dealerHand,
        playerValue: this.calculateHandValue(this.playerHand),
        dealerValue: this.gameStatus === 'playing'
          ? this.dealerHand[0].numericValue
          : this.calculateHandValue(this.dealerHand),
        gameStatus: this.gameStatus,
        bet: this.bet
      };
    }
  }
  
  module.exports = BlackjackGame;