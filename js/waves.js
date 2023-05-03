const coolDownTime = 1000;
const wavesIcons = document.querySelector('.ui-container .ui-text .grid-item.top-row.right-col');


// playersPings[player_id][ping_type] = wave_id (if < 0 => thinking about)
let playersPings = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
let playersCoolDown = [0, 0, 0, 0];

function onLeftClickWaveIcon(event, wave_id) {
    if (event.ctrlKey) {
        playOggSound('snd/ping-thinking-about.ogg');
        ChatPrint(playerIndex, ` is thinking about sending <span style="color: green">wave ${wave_id}</span>`);
    } else {
        playOggSound('snd/save.ogg');
        ChatPrint(playerIndex, ` wants to send <span style="color: green">wave ${wave_id}</span>`);
    }
    pingWaveFor(wave_id, playerIndex, 0, event.ctrlKey);
    event.preventDefault();
}

function onMiddleClickWaveIcon(event, wave_id) {
    if (event.ctrlKey) {
        playOggSound('snd/ping-thinking-about.ogg');
        ChatPrint(playerIndex, ` is thinking about saving from <span style="color: green">wave ${wave_id}</span>`);
    } else {
        playOggSound('snd/save.ogg');
        ChatPrint(playerIndex, ` wants to start saving <span style="color: green">wave ${wave_id}</span>`);
    }
    pingWaveFor(wave_id, playerIndex, 1, event.ctrlKey);
    event.preventDefault();
}

function onRightClickWaveIcon(event, wave_id) {
    if (event.ctrlKey) {
        playOggSound('snd/ping-thinking-about.ogg');
        ChatPrint(playerIndex, ` thinks he may get sent <span style="color: green">wave ${wave_id}</span>`);
    } else {
        playOggSound('snd/expecting-send.ogg');
        ChatPrint(playerIndex, ` expects the ennemy to send at <span style="color: green">wave ${wave_id}</span>`);
    }
    pingWaveFor(wave_id, playerIndex, 2, event.ctrlKey);
    event.preventDefault();
}

function createImageContainer(index) {
    // Container
    const container = document.createElement('div');

    container.id = `wave-${index}`;
    container.className = 'wave-container';

    container.addEventListener('mousedown', event => {

        if (isPlayerCoolDowned(playerIndex)) {
            return;
        }

        if (event.buttons & 1) {
            onLeftClickWaveIcon(event, index);
        } else if (event.buttons & 2) {
            onRightClickWaveIcon(event, index);
        } else if (event.buttons & 4) {
            onMiddleClickWaveIcon(event, index);
        } else {
            console.log('Unknown click type detected.');
        }
    });

    // Main image
    const mainImage = document.createElement('img');
    mainImage.src = `/img/${index}.png`;
    mainImage.className = 'wave-main-image';

    container.appendChild(mainImage);

    // Corner images
    const cornersClasses = ['wave-corner-0', 'wave-corner-1', 'wave-corner-2', 'wave-corner-3'];
    cornersClasses.forEach((corner, corner_id) => {
        const detailImage = document.createElement('img');
        detailImage.src = '/img/icons/1.png';
        detailImage.classList.add('wave-corner-image', corner);

        // Tint the image
        detailImage.style.filter = `hue-rotate(${playerColorsHueRotateFromYellow[corner_id]});`;
        detailImage.style.display = 'none';

        container.appendChild(detailImage);
    });
    return container;
}

function initializeWaveInfoContainers() {
    for (let wave_id = 1; wave_id < wavesData.length; wave_id++) {
        wavesIcons.appendChild(createImageContainer(wave_id));
    }
}

function clearPings() {
    document.querySelectorAll(`.wave-corner-image`).forEach(img => {
        img.style.display = 'none';
    });
}

function pingWaveFor(wave_id, player_id, ping_type, is_ctrl) {
    let absLastValue = Math.abs(playersPings[player_id][ping_type]);
    playersPings[player_id][ping_type] = (is_ctrl ? -wave_id : wave_id);

    if (absLastValue !== 0) {
        const oldCorner = document.querySelector(`#wave-${absLastValue} .wave-corner-${player_id}`);
        oldCorner.style.display = 'none';
    }

    const cornerImg = document.querySelector(`#wave-${wave_id} .wave-corner-${player_id}`);
    cornerImg.style.display = 'block';
}
