const buildPhaseDuration = [13, 7];
const fightPhaseDuration = 5;
const maxWaves = 30;

let soundVolume = 0.1;
let currentPhase = 'build';
let currentWave = 1;
let phaseTimer;
let remainingTime = 0;
let timeReducer = 1.0;

const uiText = document.querySelector('.ui-text');
const uiContainer = document.querySelector('.ui-container');
const uiImage = document.querySelector('.ui-image');
//const wavesIcons = document.querySelector('.ui-container .ui-text .grid-item.top-row.right-col');

const timerText = document.querySelector('.timer');
const line1mid = document.querySelector('.line-1');
const line2mid = document.querySelector('.line-2');
const line3mid = document.querySelector('.line-3');
const midText = document.querySelector('.types-line-1');

/* UI UTILS */
function endLoopingInterval() {
  clearInterval(phaseTimer);
}

function ChatPrintAll(textToPrint) {
  const msg = document.createElement('span');
  msg.innerHTML = `${textToPrint}<br/>`;
  document.getElementById('bottom-left-txt').appendChild(msg);
}

function ChatPrint(p_id, textToPrint) {
  const msg = document.createElement('span');
  msg.innerHTML = `<span style='color: ${playerColors[p_id]}'>player_${p_id}</span>${textToPrint}<br/>`;
  document.getElementById('bottom-left-txt').appendChild(msg);
}

function playOggSound(url, volume = soundVolume) {
  const audio = new Audio(url);
  audio.volume = Math.max(0, Math.min(1, volume));
  audio.addEventListener('canplaythrough', () => {
    audio.play().then(promise => console.info('Played (v=' + volume + '): ' + url));
  });
  audio.addEventListener('error', () => {
    console.error('Error occurred while loading the sound:', audio.error);
  });
}

/* */

function startUILoop() {
  playOggSound('snd/welcome.ogg');
  console.info('WELCOME TO NOVA');
  remainingTime = buildPhaseDuration[0];
  updateUI();
  phaseTimer = setInterval(nextSecond, 1000 / timeReducer);
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
      endLoopingInterval();
      return;
    }
    currentPhase = 'build';
    remainingTime = buildPhaseDuration[1];

    const topMiddle = document.querySelector('.timer');
    topMiddle.contentText = remainingTime;
    setTimeout(fightBegins, remainingTime * 1000 / timeReducer);
  }
  updateUI();
}

function fightBegins() {
  playOggSound('snd/battle-begin.ogg');
}

function resetGame() {
  endLoopingInterval();

  currentPhase = 'build';
  currentWave = 1;
  remainingTime = 0;

  clearPings();

  document.querySelector('.ui-container').innerHTML =
      ' <img class="ui-image" src="img/ui.png" alt="UI">' +
      ' <div class="ui-text">' +
      '    <div class="grid-item top-row left-col"></div>' +
      '    <div class="grid-item top-row mid-col">' +
      '      <span class="timer">0</span>' +
      '    </div>' +
      '    <div class="grid-item top-row right-col"></div>' +
      '    <div class="grid-item mid-row left-col"></div>' +
      '    <div class="grid-item mid-row mid-col">' +
      '      <p class="types-line-1">' +
      '        <span class="image-wrapper-attack"></span>' +
      '        <span class="line-1"></span>' +
      '        <span class="image-wrapper-defense"></span>' +
      '      </p>' +
      '      <p class="types-line-2">' +
      '        <span class="image-wrapper-attack"></span>' +
      '        <span class="line-2"></span>' +
      '        <span class="image-wrapper-defense"></span>' +
      '      </p>' +
      '      <p class="types-line-3">' +
      '        <span class="image-wrapper-attack"></span>' +
      '        <span class="line-3"></span>' +
      '        <span class="image-wrapper-defense"></span>' +
      '      </p>' +
      '    </div>' +
      '    <div class="grid-item mid-row right-col"></div>' +
      '    <div class="grid-item bot-row left-col"></div>' +
      '    <div class="grid-item bot-row mid-col">' +
      '      <img src="img/unpause.png" style="opacity: 1" alt="Unpause" id="start-button">' +
      '    </div>' +
      '    <div class="grid-item bot-row right-col"></div>' +
      '  </div>';

  setupPage(true);
  remainingTime = buildPhaseDuration[0];
}


function updateUI() {
  const topMiddle = document.querySelector('.timer');
  const image = document.querySelector(`#wave-${currentWave}`);
  const uiImage = document.querySelector('.ui-image');
  const fontSize = uiImage.clientWidth * fontSizeRatio;

  if (currentPhase === 'build') {
    if (remainingTime <= 3) {
      image.style.border = `solid red`;
      topMiddle.style.color = 'red';
      image.style.borderStyle = 'outset';
      image.style.borderWidth = `${fontSize * 0.2}px`
      image.style.animation = `breathingBorder 0.5s infinite linear`;

      if (remainingTime === 3) {
        playOggSound('snd/tick-tock.ogg');
      }
    }
    if (remainingTime === 5) {
      playOggSound('snd/windgust.ogg');
    }
  }

  const line1 = document.querySelector('.line-1');
  const line2 = document.querySelector('.line-2');
  const line3 = document.querySelector('.line-3');

  //const line1WrapperA = document.querySelector('.types-line-1 .image-wrapper-attack');
  //const line1WrapperD = document.querySelector('.types-line-1 .image-wrapper-defense');
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

    if (remainingTime > 3) {
      image.style.border = `solid white`;
      image.style.borderStyle = 'outset';
      image.style.borderWidth = `${fontSize * 0.2}px`
      image.style.animation = '';
    }

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

    if (topMiddle.textContent !== '   ') {
      topMiddle.textContent = 'BATTLE';
      topMiddle.classList.add('fade-out');
      topMiddle.addEventListener('animationend', function() {
        topMiddle.textContent = '   ';
        topMiddle.style.opacity = '1';
        topMiddle.style.color = 'white';
        topMiddle.classList.remove('fade-out');
      });
    }

    image.style.border = `solid red`;
    image.style.borderStyle = 'outset';
    image.style.borderWidth = `${fontSize * 0.2}px`
    image.style.animation = '';
  }
}

function moveImage(wave) {

  if (wave >= 14) {
    const container = wavesIconscreateImageContainer(wave + 8);
  }

  const image = document.querySelector(`#wave-${wave}`);
  const middle = document.querySelector('.top-row.mid-col');
  const right = document.querySelector('.top-row.right-col');

  right.querySelectorAll('.image-container').forEach(t_img => {

    t_img.style.animation = 'slideLeft 0.5s forwards';
    t_img.addEventListener('animationend', function () {

      t_img.style.animation = '';

      if (t_img === image) {

        middle.appendChild(image);

        image.style.position = 'relative';
        image.style.right = '0';
        image.style.zIndex = '1';
        image.style.transition = `right ${remainingTime - 0.5}s linear`;

        setTimeout(() => {
          image.style.right = `calc(100% - ${image.clientWidth}px)`;
        }, 0);

      }
    });
  });

}

function moveToTopLeft(wave) {

  const image = document.querySelector(`#wave-${wave}`);
  const target = document.querySelector('.top-row.left-col');

  image.style.border = '';
  image.style.zIndex = '0';

  target.querySelectorAll('img').forEach(t_img => {

    t_img.style.animation = 'slideLeft 0.5s forwards';
    t_img.addEventListener('animationend', function () {

      t_img.style.animation = '';
    });
  });

  image.style.animation = 'slideLeft 0.5s forwards';

  image.addEventListener('animationend', function () {

    image.style.animation = '';
    image.style.transition = 'none';
    image.style.border = '';
    image.style.position = 'static';
    image.style.zIndex = '0';
    target.appendChild(image);
  });

}




