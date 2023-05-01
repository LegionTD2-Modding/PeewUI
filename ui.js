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
  const topMiddle = document.querySelector('.timer');
  const image = document.querySelector(`#wave-${currentWave}`);
  const line1 = document.querySelector('.line-1');
  const line2 = document.querySelector('.line-2');
  const line3 = document.querySelector('.line-3');

  const uiImage = document.querySelector('.ui-image');
  const fontSize = uiImage.clientWidth * 0.025;

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

    line2WrapperA.innerHTML = `&nbsp;<img class='type-icon' src='img/types/${attack}.png' alt='Damage ${attack}' />&nbsp;`
    line2WrapperD.innerHTML = `&nbsp;<img class='type-icon' src='img/types/${defense}.png' alt='Defense ${defense}' />&nbsp;`
    line3WrapperA.innerHTML = ``
    line3WrapperD.innerHTML = ``

    topMiddle.textContent = `${remainingTime}`;
    image.style.border = `${fontSize * 0.2}px solid black`;

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

    line3WrapperA.innerHTML = `&nbsp;<img class='type-icon' src='img/types/${attack}.png' alt='Damage ${attack}' />&nbsp;`
    line3WrapperD.innerHTML = `&nbsp;<img class='type-icon' src='img/types/${defense}.png' alt='Defense ${defense}' />&nbsp;`

    topMiddle.textContent = '';
    image.style.border = `${fontSize * 0.2}px solid red`;
  }
}

function moveImage(wave) {
  const image = document.querySelector(`#wave-${wave}`);
  const middle = document.querySelector('.top-row.mid-col');
  const right = document.querySelector('.top-row.right-col');

  right.removeChild(image);
  middle.appendChild(image);

  image.style.position = 'relative';
  image.style.right = '0';
  image.style.zIndex = '1';
  image.style.transition = `right ${buildPhaseDuration[1]}s linear`;

  setTimeout(() => {
    image.style.right = `calc(100% - ${image.clientWidth}px)`;
  }, 100);
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

  const timerText = document.querySelector('.timer');
  const line1mid = document.querySelector('.line-1');
  const line2mid = document.querySelector('.line-2');
  const line3mid = document.querySelector('.line-3');
  const midText = document.querySelector('.types-line-1');

  const updateDimensions = () => {
    //const containerHeight = uiContainer.clientHeight;
    const containerWidth = uiImage.clientWidth;
    uiContainer.style.width = `${containerWidth}px`;
    const fontSize = containerWidth * 0.025; // Adjust the multiplier to change the font size
    uiText.style.fontSize = `${fontSize}px`;

    timerText.style.fontSize = `${fontSize * 3.0}px`;
    timerText.style.marginBottom = `${fontSize}px`;

    line1mid.style.fontSize = `${fontSize * 1.1}px`;
    line2mid.style.fontSize = `${fontSize * 2.1}px`;
    line3mid.style.fontSize = `${fontSize * 1.1}px`;

    midText.style.marginTop = `${fontSize * 0.5}px`;
  };



  for (let i = 1; i < wavesData.length; i++) {
    const img = document.createElement('img');
    img.src = `img/${i}.png`;
    img.id = `wave-${i}`;
    img.classList.add('wave-icon');
    wavesIcons.appendChild(img);
  }

  updateDimensions();
  window.addEventListener('resize', updateDimensions);

    setTimeout(startUILoop, 100);
});
