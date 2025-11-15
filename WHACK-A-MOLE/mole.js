const menu = document.getElementById("menu");
const gameArea = document.getElementById("gameArea");
const buttons = document.querySelectorAll(".mode");
const endBtn = document.getElementById("endBtn");
const holes = document.querySelectorAll(".hole");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");

let lastHole;
let score = 0;
let popUpTime = 1000;
let peepTimeout;
let countdown;
let timeLeft = 20;

// pick random hole
function randomHole(holes) {
  const idx = Math.floor(Math.random() * holes.length);
  const hole = holes[idx];
  if (hole === lastHole) return randomHole(holes);
  lastHole = hole;
  return hole;
}

// random time for each pop
function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

// bunny pop logic
function peep() {
  const time = randomTime(popUpTime * 0.9, popUpTime * 1.0);
  const hole = randomHole(holes);
  const bunny = hole.querySelector(".bunny");

  bunny.classList.add("show");

  peepTimeout = setTimeout(() => {
    bunny.classList.remove("show");
    peep(); // keep going
  }, time);
}

// start timer
function startTimer() {
  timeDisplay.textContent = timeLeft;
  countdown = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(countdown);
      stopGame();
      alert(`Time’s up! Final Score: ${score}`);
    }
  }, 1000);
}

// start game
function startGame() {
  score = 0;
  scoreDisplay.textContent = score;
  peep();
}

function stopGame() {
  clearTimeout(peepTimeout);
  clearInterval(countdown); // make sure timer stops
  holes.forEach(h => h.querySelector(".bunny").classList.remove("show"));
  gameArea.classList.add("hidden");
  menu.classList.remove("hidden");
}


// clicking bunnies
holes.forEach(hole => {
  const bunny = hole.querySelector(".bunny");
  bunny.addEventListener("click", e => {
    score++;
    scoreDisplay.textContent = score;
    bunny.classList.remove("show"); // hide on click
  });
});

// difficulty buttons
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    menu.classList.add("hidden");
    gameArea.classList.remove("hidden");

    // set difficulty
    if (btn.classList.contains("easy")) popUpTime = 1500;
    if (btn.classList.contains("normal")) popUpTime = 1200;
    if (btn.classList.contains("hard")) popUpTime = 800;

    // reset score and timer
    score = 0;
    scoreDisplay.textContent = score;
    
    // CLEAR old countdown first
    clearInterval(countdown);
    timeLeft = 20; 
    timeDisplay.textContent = timeLeft;

    startTimer();  // start fresh countdown
    startGame();
  });
});


// end button
endBtn.addEventListener("click", () => stopGame());
