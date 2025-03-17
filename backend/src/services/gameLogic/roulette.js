class RouletteGame {
    constructor() {
      this.numbers = Array.from({ length: 37 }, (_, i) => i); // 0-36
      this.colors = {
        0: 'green',
        1: 'red', 2: 'black', 3: 'red', 4: 'black', 5: 'red', 6: 'black',
        7: 'red', 8: 'black', 9: 'red', 10: 'black', 11: 'black', 12: 'red',
        13: 'black', 14: 'red', 15: 'black', 16: 'red', 17: 'black', 18: 'red',
        19: 'red', 20: 'black', 21: 'red', 22: 'black', 23: 'red', 24: 'black',
        25: 'red', 26: 'black', 27: 'red', 28: 'black', 29: 'black', 30: 'red',
        31: 'black', 32: 'red', 33: 'black', 34: 'red', 35: 'black', 36: 'red'
      };
      this.payouts = {
        straight: 35,      // Single number
        split: 17,         // Two adjacent numbers
        street: 11,        // Three numbers in a row
        corner: 8,         // Four numbers in a square
        fiveNumber: 6,     // 0, 00, 1, 2, 3
        sixLine: 5,        // Six numbers in two rows
        dozen: 2,          // 12 numbers (1-12, 13-24, 25-36)
        column: 2,         // 12 numbers (vertical column)
        even: 1,           // Even numbers
        odd: 1,            // Odd numbers
        red: 1,            // Red numbers
        black: 1,          // Black numbers
        low: 1,            // 1-18
        high: 1            // 19-36
      };
    }
    
    spin() {
      const winningNumber = this.numbers[Math.floor(Math.random() * this.numbers.length)];
      const winningColor = this.colors[winningNumber];
      
      return {
        number: winningNumber,
        color: winningColor,
        isEven: winningNumber !== 0 && winningNumber % 2 === 0,
        isOdd: winningNumber % 2 === 1,
        isLow: winningNumber >= 1 && winningNumber <= 18,
        isHigh: winningNumber >= 19 && winningNumber <= 36,
        dozen: winningNumber === 0 ? null : 
               winningNumber <= 12 ? 1 :
               winningNumber <= 24 ? 2 : 3,
        column: winningNumber === 0 ? null :
                winningNumber % 3 === 1 ? 1 :
                winningNumber % 3 === 2 ? 2 : 3
      };
    }
    
    calculateWinnings(bets, result) {
      let totalWinnings = 0;
      
      bets.forEach(bet => {
        let win = false;
        
        switch (bet.type) {
          case 'straight':
            win = result.number === bet.number;
            break;
          case 'split':
            win = bet.numbers.includes(result.number);
            break;
          case 'street':
            win = bet.numbers.includes(result.number);
            break;
          case 'corner':
            win = bet.numbers.includes(result.number);
            break;
          case 'fiveNumber':
            win = [0, 1, 2, 3].includes(result.number);
            break;
          case 'sixLine':
            win = bet.numbers.includes(result.number);
            break;
          case 'dozen':
            win = result.dozen === bet.dozen;
            break;
          case 'column':
            win = result.column === bet.column;
            break;
          case 'red':
            win = result.color === 'red';
            break;
          case 'black':
            win = result.color === 'black';
            break;
          case 'even':
            win = result.isEven;
            break;
          case 'odd':
            win = result.isOdd;
            break;
          case 'low':
            win = result.isLow;
            break;
          case 'high':
            win = result.isHigh;
            break;
        }
        
        if (win) {
          totalWinnings += bet.amount * (this.payouts[bet.type] + 1);
        }
      });
      
      return totalWinnings;
    }
  }
  
  module.exports = RouletteGame;