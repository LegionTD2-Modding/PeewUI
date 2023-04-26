const buildPhaseDuration = [13, 7];
const fightPhaseDuration = 5;
const maxWaves = 21;

let currentPhase = 'build';
let currentWave = 1;
let phaseTimer;
let remainingTime;

function startGame() {
  remainingTime = buildPhaseDuration[0];
  updateUI();
  phaseTimer = setInterval(nextSecond, 1000);
}

function nextSecond() {
  remainingTime--;

  if (remainingTime <= 0) {
    nextPhase();
  } else {
    updateUI();
  }
}

function nextPhase() {
  if (currentPhase === 'build') {
    currentPhase = 'fight';
    remainingTime = fightPhaseDuration;
  } else {
    currentWave++;
    if (currentWave > maxWaves) {
      gameOver();
      return;
    }
    currentPhase = 'build';
    remainingTime = buildPhaseDuration[1];
  }
  updateUI();
}


function updateUI() {
  const bottomMiddle = document.querySelector('.bottom-middle');
  const topMiddle = document.querySelector('.top-middle > .timer');
  const image = document.querySelector(`#wave-${currentWave}`);
  const line1 = document.querySelector('.line-1');
  const line2 = document.querySelector('.line-2');
  const line3 = document.querySelector('.line-3');

  const line1WrapperA = document.querySelector('.types-line-1 .image-wrapper-attack');
  const line1WrapperD = document.querySelector('.types-line-1 .image-wrapper-defense');
  const line2WrapperA = document.querySelector('.types-line-2 .image-wrapper-attack');
  const line2WrapperD = document.querySelector('.types-line-2 .image-wrapper-defense');
  const line3WrapperA = document.querySelector('.types-line-3 .image-wrapper-attack');
  const line3WrapperD = document.querySelector('.types-line-3 .image-wrapper-defense');

  if (currentPhase === 'build') {
    line1.textContent = `Prepare for`;
    line2.textContent = `WAVE ${currentWave}`;
    line3.textContent = ``;

    let attack = wavesData[Math.min(currentWave, 21)].dmgType;
    let defense = wavesData[Math.min(currentWave, 21)].defType;

    line2WrapperA.innerHTML = ` <img style="margin-right: 10px;" class="img" src='img/types/${attack}.png' alt='Damage ${attack}' /> `
    line2WrapperD.innerHTML = ` <img style="margin-left: 10px;" class="img" src='img/types/${defense}.png' alt='Defense ${defense}' /> `
    line3WrapperA.innerHTML = ``
    line3WrapperD.innerHTML = ``

    topMiddle.textContent = `${remainingTime}`;
    image.style.border = '4px solid black';

    if ((currentWave === 1 && remainingTime === buildPhaseDuration[0]) || (currentWave > 1 && remainingTime === buildPhaseDuration[1])) {
      moveImage(currentWave);
      if (currentWave > 1) {
        moveToTopLeft(currentWave - 1);
      }
    }
  } else {
    line1.textContent = ``;
    line2.textContent = `WAVE ${currentWave}`;
    line3.textContent = `Next: WAVE ${currentWave + 1}`;

    let attack = wavesData[Math.min(currentWave + 1, 21)].dmgType;
    let defense = wavesData[Math.min(currentWave + 1, 21)].defType;

    line3WrapperA.innerHTML = ` <img style="width: 16px; height: 16px; margin-right: 5px;" src='img/types/${attack}.png' alt='Damage ${attack}' /> `
    line3WrapperD.innerHTML = ` <img style="width: 16px; height: 16px; margin-left: 5px;" src='img/types/${defense}.png' alt='Defense ${defense}' /> `

    topMiddle.textContent = '';
    image.style.border = '4px solid red';
  }
}

function moveImage(wave) {
  const image = document.querySelector(`#wave-${wave}`);
  const middle = document.querySelector('.top-middle');
  
  middle.appendChild(image);
  image.style.position = 'absolute';
  image.style.right = '0';
  image.style.transition = `right ${buildPhaseDuration[1]}s`;

  setTimeout(() => {
    image.style.right = 'calc(100% - 32px)';
  }, 0);
}

function moveToTopLeft(wave) {
  const image = document.querySelector(`#wave-${wave}`);
  const target = document.querySelector('.top-left');
  image.style.transition = 'none';
  image.style.border = '';
  image.style.position = 'static';
  target.appendChild(image);
  applyFadingEffect();
}


function gameOver() {
  clearInterval(phaseTimer);
  const bottomMiddle = document.querySelector('.bottom-middle');
  bottomMiddle.textContent = 'Game Over';
}

function applyFadingEffect() {
  const topRightImages = document.querySelectorAll('.top-right > img');
  const topLeftImages = document.querySelectorAll('.top-left > img');

  [topRightImages, topLeftImages].forEach((images) => {
    images.forEach((image, index) => {
      image.classList.remove('opacity-75', 'opacity-50', 'opacity-25', 'hidden');

      if (index >= 3) {
        if (index === 3) {
          image.classList.add('opacity-75');
        } else if (index === 4) {
          image.classList.add('opacity-50');
        } else if (index === 5) {
          image.classList.add('opacity-25');
        } else {
          image.classList.add('hidden');
        }
      }
    });
  });
}

window.addEventListener('DOMContentLoaded', startGame);
