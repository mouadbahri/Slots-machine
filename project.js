
const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
}

const SYMBOL_VALUES = {
  A: 10,
  B: 5,
  C: 3,
  D: 2,
}

const deposit = () => {
  while (true) {
    const depositAmount = prompt("Enter a deposit amount: ");
    const nubmerDepositAmount = parseFloat(depositAmount);

    if(isNaN(nubmerDepositAmount) || nubmerDepositAmount <= 0) {
      console.log("Invalid deposit amount, please try again");
    } else {
      return nubmerDepositAmount;
    }
  }
};

const getNumberOfLines = () => {
  while (true) {
    const lines = prompt("Enter the number of lines you want to bet on (1-3): ");
    const nubmerOfLines = parseFloat(lines);

    if (isNaN(nubmerOfLines) || nubmerOfLines <= 0 || nubmerOfLines > 3) {
      console.log("Invalid number of lines, please insert a valid number.");
    } else {
      return nubmerOfLines;
    }
  }
};

const getBet = (balance, lines) => {
  while (true) {
    const bet = prompt("Enter your bet (per line): ");
    const nubmerBet = parseFloat(bet);

    if (isNaN(nubmerBet) || nubmerBet <= 0 || nubmerBet > (balance / lines)) {
      console.log("Invalid bet, please insert a valid bet.");
    } else {
      return nubmerBet;
    }
  }  
};

const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }
  
  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1);
    }
  }
  return reels;
};

const transpose = (reels) => {
  const rows = [];

  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }

  return rows
};

const printRows = (rows) => {
  for (const row of rows) {
    let rowString = "";
    for (const [i, symbol] of row.entries()) {
      rowString += symbol
      if (i != row.lengh - 1) {
        rowString += " | "
      }
    }

    console.log(rowString)
  }
};

const getWinnings = (rows, bet, lines) => {
  let winnings = 0;

  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = true;

    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        allSame = false;
        break;
      }
    }

    if (allSame) {
      winnings += bet * SYMBOL_VALUES[symbols[0]]
    }
  }

  return winnings;
};


const game = () => {
  let balance = deposit();

  while (true) {
    const nubmerOfLines = getNumberOfLines();
    const bet = getBet(balance, nubmerOfLines);
    balance -= bet * nubmerOfLines;
    const reels = spin();
    const rows = transpose(reels);
    printRows(rows);
    const winnings = getWinnings(rows, bet, nubmerOfLines);
    balance += winnings;
    console.log("you won, $" + winnings.toString());
    console.log("You have $" + balance + " in your balance");

    if (balance <= 0) {
      console.log("You ran out of money!");
      break;
    }

    const playAgain = prompt("Wanna go for another round (y/n)? ");
    if (playAgain != "y") break;
  }
};

game();
