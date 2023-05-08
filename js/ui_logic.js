const buildPhaseDuration = [13, 7];
const fightPhaseDuration = 5;
const maxWaves = 30;

let soundVolume = 0.1;
let currentPhase = 'build';
let currentWave = 1;
let phaseTimer;
let remainingTime = 0;
let timeReducer = 1.0;
let pauseCycle = false;

const uiText = document.querySelector('.ui-text');
const uiContainer = document.querySelector('.ui-container');
const uiImage = document.querySelector('.ui-image');

const timerText = document.querySelector('.timer');
const line1mid = document.querySelector('.line-1');
const line2mid = document.querySelector('.line-2');
const line3mid = document.querySelector('.line-3');
const midText = document.querySelector('.types-line-1');

/* UTILS */
function endLoopingInterval() {
  clearInterval(phaseTimer);
}

function autoScrollDownChat() {
  const div = document.getElementById('bottom-left-txt');
  div.scrollTop = div.scrollHeight;
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

function ConsolePrintAll(message, error = false) {
  const msg = document.createElement('span');
  const chatTxt = document.getElementById('top-right-txt');

  if (error) {
    msg.innerHTML =  `<span style="color: red;">${message}</span><br/>`;
  } else {
    msg.innerHTML =  `<span style="color: white;">${message}</span><br/>`;
  }
  chatTxt.appendChild(msg)
}

function isPlayerCoolDowned(p_id) {
  const gameTime = new Date().getTime();
  if (gameTime - playersCoolDown[p_id] <= coolDownTime) {
    ChatPrintAll(`<span style="color: red">You are on cool down!</span>`);
    playersCoolDown[p_id] = gameTime;
    return true;
  }
  playersCoolDown[p_id] = gameTime;
  return false;
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

function togglePause() {
  pauseCycle = !pauseCycle;
  if (pauseCycle) {
    endLoopingInterval();
  } else {
    phaseTimer = setInterval(nextSecond, 1000 / timeReducer);
  }
}

function getPlayerAura(p_id) {
  return `linear-gradient(to top, rgba(${playerAuras[p_id]}, 0.75) 50%, rgba(${playerAuras[p_id]}, 0) 100%)`;
}

function setPlayButtonVisibility(visible) {
  if (visible) {
    document.getElementById('start-button').style.display = 'block';
  } else {
    document.getElementById('start-button').style.display = 'none';
 }
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

  if (pauseCycle) {
    return;
  }

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

    if (currentWave === 1) {
      fightBegins();
    }

    hideSubUI();

  } else {
    currentWave++;
    if (currentWave > maxWaves) {
      endLoopingInterval();
      return;
    }
    currentPhase = 'build';
    remainingTime = buildPhaseDuration[1];

    showMostPingedTypeThisWave(currentWave);

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
    line3.textContent = ``; //`Next: WAVE ${currentWave + 1}`;

    let attack = wavesData[Math.min(currentWave + 1, 21)].dmgType;
    let defense = wavesData[Math.min(currentWave + 1, 21)].defType;

    line3WrapperA.innerHTML = ``; //`&nbsp;<img class='type-icon' src='img/types/${attack}.png' alt='Damage ${attack}' />&nbsp;`
    line3WrapperD.innerHTML = ``; //`&nbsp;<img class='type-icon' src='img/types/${defense}.png' alt='Defense ${defense}' />&nbsp;`

    if (topMiddle.textContent !== '   ') {
      //topMiddle.textContent = 'BATTLE';
      topMiddle.innerHTML = '<img src="../img/icons/Mercenary2.png" alt="fight-icon">';
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
    wavesIcons.appendChild(createImageContainer(wave + 8));
  }

  const image = document.querySelector(`#wave-${wave}`);
  const middle = document.querySelector('.top-row.mid-col');
  const right = document.querySelector('.top-row.right-col');

  right.querySelectorAll('.wave-container').forEach(ctn => {

    ctn.style.animation = 'slideLeft 0.5s forwards';
    ctn.addEventListener('animationend', function () {

      ctn.style.animation = '';

      if (ctn === image) {

        middle.appendChild(image);

        /*for (let votes_n = 1; votes_n <= 4; votes_n++) {
          const votesIcon = document.querySelector(`#wave-${wave} #votes-{votes_n}`);
          votesIcon.style.display = 'none';
        }*/

        image.style.pointerEvents = 'none';
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

  /*for (let votes_n = 1; votes_n <= 4; votes_n++) {
    const votesIcon = document.querySelector(`#wave-${wave} #votes-{votes_n}`);
  }*/


  image.style.border = '';
  image.style.zIndex = '0';

  target.querySelectorAll('.wave-container').forEach(ctn => {

    ctn.style.animation = 'slideLeft 0.5s forwards';
    ctn.addEventListener('animationend', function () {

      ctn.style.animation = '';
    });
  });

  image.style.animation = 'slideLeft 0.5s forwards';

  image.addEventListener('animationend', function () {

    image.style.pointerEvents = 'none';
    image.style.animation = '';
    image.style.transition = 'none';
    image.style.border = '';
    image.style.position = 'static';
    image.style.zIndex = '0';
    target.appendChild(image);
  });

}




