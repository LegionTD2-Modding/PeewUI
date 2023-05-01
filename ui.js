const buildPhaseDuration = [13, 7];
const fightPhaseDuration = 5;
const maxWaves = 21;

let currentPhase = 'build';
let currentWave = 1;
let phaseTimer;
let remainingTime;

function startUILoop() {
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
      loopDone();
      return;
    }
    currentPhase = 'build';
    remainingTime = buildPhaseDuration[1];
  }
  updateUI();
}


function updateUI() {
  //const bottomMiddle = document.querySelector('.bottom-middle');
  const topMiddle = document.querySelector('.timer');
  const image = document.querySelector(`#wave-${currentWave}`);
  const line1 = document.querySelector('.line-1');
  const line2 = document.querySelector('.line-2');
  const line3 = document.querySelector('.line-3');

  //const line1WrapperA = document.querySelector('.types-line-1 .image-wrapper-attack');
  //const line1WrapperD = document.querySelector('.types-line-1 .image-wrapper-defense');
  //const line2WrapperA = document.querySelector('.types-line-2 .image-wrapper-attack');
  //const line2WrapperD = document.querySelector('.types-line-2 .image-wrapper-defense');
  //const line3WrapperA = document.querySelector('.types-line-3 .image-wrapper-attack');
  //const line3WrapperD = document.querySelector('.types-line-3 .image-wrapper-defense');

  if (currentPhase === 'build') {
    line1.textContent = `Prepare for`;
    line2.textContent = `WAVE ${currentWave}`;
    line3.textContent = ``;
/*
    let attack = wavesData[Math.min(currentWave, 21)].dmgType;
    let defense = wavesData[Math.min(currentWave, 21)].defType;

    line2WrapperA.innerHTML = ` <img style="margin-right: 0.6vw;" class="img" src='img/types/${attack}.png' alt='Damage ${attack}' /> `
    line2WrapperD.innerHTML = ` <img style="margin-left: 0.6vw;" class="img" src='img/types/${defense}.png' alt='Defense ${defense}' /> `
    line3WrapperA.innerHTML = ``
    line3WrapperD.innerHTML = ``
*/
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
/*
    let attack = wavesData[Math.min(currentWave + 1, 21)].dmgType;
    let defense = wavesData[Math.min(currentWave + 1, 21)].defType;

    line3WrapperA.innerHTML = ` <img style="width: 1vw; height: 1vw; margin-right: 0.3vw;" src='img/types/${attack}.png' alt='Damage ${attack}' /> `
    line3WrapperD.innerHTML = ` <img style="width: 1vw; height: 1vw; margin-left: 0.3vw;" src='img/types/${defense}.png' alt='Defense ${defense}' /> `
*/
    topMiddle.textContent = '';
    image.style.border = '4px solid red';
  }
}

function moveImage(wave) {
  const image = document.querySelector(`#wave-${wave}`);
  const middle = document.querySelector('.top-row.mid-col');
  
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
  const target = document.querySelector('.top-row.left-col');
  image.style.transition = 'none';
  image.style.border = '';
  image.style.position = 'static';
  target.appendChild(image);
}


function loopDone() {
  clearInterval(phaseTimer);
}


document.addEventListener('DOMContentLoaded', () => {
  const uiText = document.querySelector('.ui-text');
  const uiContainer = document.querySelector('.ui-container');
  const uiImage = document.querySelector('.ui-image');
  const wavesIcons = document.querySelector('.ui-container .ui-text .grid-item.top-row.right-col');
  //const pastWavesIcons = document.querySelector('.ui-container .ui-text .grid-item.top-row.left-col');

  const timerText = document.querySelector('.timer');

  const updateDimensions = () => {
    //const containerHeight = uiContainer.clientHeight;
    const containerWidth = uiImage.clientWidth;
    uiContainer.style.width = `${containerWidth}px`;
    const fontSize = containerWidth * 0.025; // Adjust the multiplier to change the font size
    uiText.style.fontSize = `${fontSize}px`;
    timerText.style.fontSize = `${fontSize * 2.5}px`;
  };



  for (let i = 1; i < wavesData.length; i++) {
    const img = document.createElement('img');
    img.src = `img/${i}.png`;
    img.id = `wave-${i}`;
    img.classList.add('wave-icon');
    wavesIcons.appendChild(img);

    /*
    const img2 = document.createElement('img');
    img2.src = `img/${i}.png`;
    img2.id = `wave--${i}`;
    img2.classList.add('wave-icon');
    pastWavesIcons.appendChild(img2);*/
  }

  updateDimensions();
  window.addEventListener('resize', updateDimensions);

  startUILoop();
});
