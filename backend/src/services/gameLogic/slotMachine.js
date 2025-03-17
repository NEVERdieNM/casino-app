class SlotMachine {
    constructor(config = {}) {
      this.reels = config.reels || 3;
      this.symbols = config.symbols || ['🍒', '🍋', '🍊', '🍇', '🔔', '💎', '7️⃣'];
      this.payLines = config.payLines || [
        [0, 0, 0], // Middle row
        [1, 1, 1], // Top row
        [2, 2, 2], // Bottom row
        [0, 1, 2], // Diagonal \
        [2, 1, 0]  // Diagonal /
      ];
      this.payTable = config.payTable || {
        '🍒🍒🍒': 10,
        '🍋🍋🍋': 15,
        '🍊🍊🍊': 20,
        '🍇🍇🍇': 25,
        '🔔🔔🔔': 40,
        '💎💎💎': 100,
        '7️⃣7️⃣7️⃣': 300
      };
    }
    
    spin() {
      const result = [];
      
      // Generate random symbols for each reel
      for (let i = 0; i < this.reels; i++) {
        const reelResult = [];
        for (let j = 0; j < 3; j++) {
          const randomIndex = Math.floor(Math.random() * this.symbols.length);
          reelResult.push(this.symbols[randomIndex]);
        }
        result.push(reelResult);
      }
      
      // Calculate winnings
      const wins = this.calculateWins(result);
      
      return {
        reels: result,
        wins
      };
    }
    
    calculateWins(reels) {
      const wins = [];
      
      // Transpose the reels to make it easier to check paylines
      const transposed = [];
      for (let i = 0; i < 3; i++) {
        const row = [];
        for (let j = 0; j < this.reels; j++) {
          row.push(reels[j][i]);
        }
        transposed.push(row);
      }
      
      // Check each payline
      this.payLines.forEach((payLine, index) => {
        const line = [];
        for (let i = 0; i < this.reels; i++) {
          line.push(transposed[payLine[i]][i]);
        }
        
        const lineString = line.join('');
        const multiplier = this.payTable[lineString];
        
        if (multiplier) {
          wins.push({
            payLine: index + 1,
            symbols: line,
            multiplier
          });
        }
      });
      
      return wins;
    }
  }
  
  module.exports = SlotMachine;