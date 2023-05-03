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

    container.id = `wave-$(index)`;
    container.className = 'wave-icons-container';
    container.zIndex = '1';

    container.style.position = 'relative';
    container.style.display = 'inline-block';

    container.addEventListener('mousedown', event => {
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
    mainImage.className = 'wave-icon';

    container.appendChild(mainImage);

    // Corner images
    const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    const displayCornerImages = [false, false, false, false]; // Change this to control the display of corner images

    corners.forEach((corner, i) => {
        if (displayCornerImages[i]) {
            const detailImage = document.createElement('img');
            detailImage.src = '/img/icons/1_yellow.png';

            // Tint the image
            detailImage.style.filter = `hue-rotate(${playerColorsHueRotateFromYellow[i]});`;

            // Set corner positions
            if (corner.includes('top')) {
                detailImage.style.top = '0';
            } else {
                detailImage.style.bottom = '0';
            }

            if (corner.includes('left')) {
                detailImage.style.left = '0';
            } else {
                detailImage.style.right = '0';
            }

            detailImage.className = `wave-icon-${corners[i]}`;

            container.appendChild(detailImage);
        }
    });

    return container;
}

function initializeWaveInfoContainers() {
    const wavesIcons = document.querySelector('.ui-container .ui-text .grid-item.top-row.right-col');

    for (let wave_id = 1; wave_id < wavesData.length; wave_id++) {
        const ctn = createImageContainer(wave_id);
        wavesIcons.appendChild(ctn);
    }
}

function clearPings() {

}

function pingWaveFor(wave_id, player_id, ping_type, is_ctrl) {

}
