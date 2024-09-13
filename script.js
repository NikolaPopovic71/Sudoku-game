const text = "Welcome to our Sudoku Game!";
let index = 0;

function type() {
  const char = text.charAt(index);
  if (char === " ") {
    document.getElementById("typewriter").innerHTML += "&nbsp;";
  } else {
    document.getElementById("typewriter").innerHTML += char;
  }
  index++;
  if (index < text.length) {
    setTimeout(type, 110);
  } else {
    // Once the typewriter effect finishes, start the h2 animation
    setTimeout(() => {
      document.querySelector("h2").style.opacity = "1"; // Fade in h2
      document.querySelector("h2").style.transform = "scale(1)"; // Scale h2 from 0 to 1
    }, 100); // Small delay after typewriter completes before starting h2 animation
  }
}

// Start the typewriter effect
type();

// Sudoku grid 9x9 with all zeros initially.
let currentSudoku = [];
let currentSolution = [];

// Helper functions for valid Sudoku generation
function isValidMove(grid, row, col, num) {
  if (grid[row].includes(num)) return false;

  for (let r = 0; r < 9; r++) {
    if (grid[r][col] === num) return false;
  }

  const subgridRowStart = Math.floor(row / 3) * 3;
  const subgridColStart = Math.floor(col / 3) * 3;

  for (let r = subgridRowStart; r < subgridRowStart + 3; r++) {
    for (let c = subgridColStart; c < subgridColStart + 3; c++) {
      if (grid[r][c] === num) return false;
    }
  }

  return true;
}

function solveSudoku(grid) {
  const emptyPosition = findEmptyPosition(grid);
  if (!emptyPosition) return true;
  const [row, col] = emptyPosition;

  for (let num = 1; num <= 9; num++) {
    if (isValidMove(grid, row, col, num)) {
      grid[row][col] = num;
      if (solveSudoku(grid)) return true;
      grid[row][col] = 0;
    }
  }
  return false;
}

function findEmptyPosition(grid) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] === 0) return [r, c];
    }
  }
  return null;
}

function fillDiagonalSubgrids(grid) {
  for (let i = 0; i < 9; i += 3) {
    const nums = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    let idx = 0;
    for (let r = i; r < i + 3; r++) {
      for (let c = i; c < i + 3; c++) {
        grid[r][c] = nums[idx++];
      }
    }
  }
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateValidSudoku() {
  currentSolution = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillDiagonalSubgrids(currentSolution);
  solveSudoku(currentSolution);
  currentSudoku = JSON.parse(JSON.stringify(currentSolution));
}

function removeNumbers(difficulty) {
  let minCellsToKeep, maxCellsToKeep;

  if (difficulty === "basic") {
    minCellsToKeep = 4;
    maxCellsToKeep = 7; // Range 4-7 fields filled per subgrid
  } else if (difficulty === "intermediate") {
    minCellsToKeep = 3;
    maxCellsToKeep = 5; // Range 3-5 fields filled per subgrid
  } else {
    minCellsToKeep = 2;
    maxCellsToKeep = 4; // Range 2-4 fields filled per subgrid
  }

  for (let rowStart = 0; rowStart < 9; rowStart += 3) {
    for (let colStart = 0; colStart < 9; colStart += 3) {
      let availableCells = [];
      for (let row = rowStart; row < rowStart + 3; row++) {
        for (let col = colStart; col < colStart + 3; col++) {
          availableCells.push({ row, col });
        }
      }

      availableCells = shuffleArray(availableCells);
      const filledCells =
        minCellsToKeep +
        Math.floor(Math.random() * (maxCellsToKeep - minCellsToKeep + 1));

      while (availableCells.length > filledCells) {
        const { row, col } = availableCells.pop();
        currentSudoku[row][col] = 0;
      }
    }
  }
}

function generateSudokuGrid() {
  const table = document.getElementById("sudoku-grid");
  table.innerHTML = "";

  for (let row = 0; row < 9; row++) {
    const tr = document.createElement("tr");
    for (let col = 0; col < 9; col++) {
      const td = document.createElement("td");
      if (currentSudoku[row][col] !== 0) {
        td.innerHTML = `<input type="text" value="${currentSudoku[row][col]}" disabled>`;
      } else {
        td.innerHTML = `<input type="text" maxlength="1" pattern="[1-9]">`;
      }
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
}

function checkSolution() {
  const table = document.getElementById("sudoku-grid");
  const inputs = table.querySelectorAll("input");
  let isCorrect = true;

  inputs.forEach((input, index) => {
    const row = Math.floor(index / 9);
    const col = index % 9;

    input.style.backgroundColor = "";

    if (!input.disabled) {
      const userValue = Number(input.value);
      if (userValue !== currentSolution[row][col]) {
        isCorrect = false;
        input.style.backgroundColor = "#ec605e"; // Red for wrong
      } else {
        input.style.backgroundColor = "#4c7766"; // Green for correct
      }
    }
  });

  if (isCorrect) {
    alert("Congratulations! You solved the Sudoku.");
  } else {
    alert("There are mistakes in the puzzle.");
  }
}

function revealSolution() {
  const table = document.getElementById("sudoku-grid");
  table.innerHTML = "";

  for (let row = 0; row < 9; row++) {
    const tr = document.createElement("tr");
    for (let col = 0; col < 9; col++) {
      const td = document.createElement("td");
      td.innerHTML = `<input type="text" value="${currentSolution[row][col]}" disabled>`;
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
}

// Event listener for "Check Solution" button
document
  .getElementById("check-solution")
  .addEventListener("click", checkSolution);

// Event listener for "Reveal Solution" button
document
  .getElementById("reveal-solution")
  .addEventListener("click", revealSolution);

// Event listener for difficulty level radio buttons
document.querySelectorAll('input[name="difficulty"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    const difficulty = document.querySelector(
      'input[name="difficulty"]:checked'
    ).value;
    generateValidSudoku();
    removeNumbers(difficulty);
    generateSudokuGrid();
    document.getElementById("check-solution").disabled = false;
    document.getElementById("reveal-solution").disabled = false; // Enable reveal button
  });
});

// Reset the game to the starting point
document.getElementById("new-game").addEventListener("click", () => {
  document.getElementById("sudoku-grid").innerHTML = "";
  document
    .querySelectorAll('input[name="difficulty"]')
    .forEach((radio) => (radio.checked = false));
  document.getElementById("check-solution").disabled = true;
  document.getElementById("reveal-solution").disabled = true; // Disable reveal button
});

const shareButton = document.getElementById("share-button");
const hint = document.getElementById("click-hint");
const socialsWrapper = document.querySelector(".socials-wrapper");
const socialsMenu = document.querySelector(".socials-menu"); // Ensure this selects the correct element

const toggleSocials = () => {
  socialsWrapper.classList.toggle("active");

  // Hide the hint text once the image is clicked
  hint.style.display = "none";

  const shareButtonImage = shareButton.querySelector("img");
  if (
    shareButtonImage.src.includes("ponITech%20-%20shorten%20logo_without_n.svg")
  ) {
    shareButtonImage.src = "images/close.svg";
  } else {
    shareButtonImage.src = "images/ponITech%20-%20shorten%20logo_without_n.svg";
  }
};

shareButton.addEventListener("click", toggleSocials);
