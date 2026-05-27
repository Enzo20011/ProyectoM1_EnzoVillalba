const paletteContainer = document.getElementById('palette-container');
const generateBtn = document.getElementById('generate-btn');
const btnHex = document.getElementById('btn-hex');
const btnHsl = document.getElementById('btn-hsl');
const sizeSelect = document.getElementById('palette-size');
const toastContainer = document.getElementById('toast-container');
const toastMessage = document.getElementById('toast-message');

let currentPalette = [];
let paletteSize = 6;
let activeFormat = 'hex';

function init() {
    const savedPalette = localStorage.getItem('colorfly_palette_v2');
    const savedSize = localStorage.getItem('colorfly_size_v2');

    if (savedSize) {
        paletteSize = parseInt(savedSize);
        sizeSelect.value = paletteSize;
    }

    if (savedPalette) {
        currentPalette = JSON.parse(savedPalette);
        if (currentPalette.length !== paletteSize) {
            generateNewPalette();
        } else {
            renderPalette();
        }
    } else {
        generateNewPalette();
    }

    setupEventListeners();
}

function setupEventListeners() {
    generateBtn.addEventListener('click', generateNewPalette);
    btnHex.addEventListener('click', () => setActiveFormat('hex'));
    btnHsl.addEventListener('click', () => setActiveFormat('hsl'));

    sizeSelect.addEventListener('change', (e) => {
        const newSize = parseInt(e.target.value);
        if (newSize > paletteSize) {
            const toAdd = newSize - paletteSize;
            for(let i=0; i<toAdd; i++) {
                currentPalette.push(createRandomColorObj());
            }
        } else if (newSize < paletteSize) {
            currentPalette = currentPalette.slice(0, newSize);
        }
        
        paletteSize = newSize;
        localStorage.setItem('colorfly_size_v2', paletteSize);
        saveAndRender();
    });
}

function setActiveFormat(format) {
    activeFormat = format;

    btnHex.classList.toggle('active', format === 'hex');
    btnHex.setAttribute('aria-pressed', format === 'hex');
    btnHsl.classList.toggle('active', format === 'hsl');
    btnHsl.setAttribute('aria-pressed', format === 'hsl');
}

function generateRandomHex() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function hexToHsl(hex) {
    let r = 0, g = 0, b = 0;
    if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
    }
    
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; 
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    const hValue = Math.round(h * 360);
    const sValue = Math.round(s * 100);
    const lValue = Math.round(l * 100);
    
    return `hsl(${hValue}, ${sValue}%, ${lValue}%)`;
}

function createRandomColorObj() {
    const hex = generateRandomHex();
    return {
        hex: hex,
        hsl: hexToHsl(hex),
        locked: false
    };
}

function generateNewPalette() {
    if (currentPalette.length === 0 || currentPalette.length !== paletteSize) {
        currentPalette = [];
        for (let i = 0; i < paletteSize; i++) {
            currentPalette.push(createRandomColorObj());
        }
    } else {
        currentPalette = currentPalette.map(color => {
            if (color.locked) return color;
            return createRandomColorObj();
        });
    }
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem('colorfly_palette_v2', JSON.stringify(currentPalette));
    renderPalette();
}

function renderPalette() {
    paletteContainer.innerHTML = '';
    
    paletteContainer.style.setProperty('--palette-size', paletteSize);

    currentPalette.forEach((color, index) => {
        const card = document.createElement('div');
        card.className = 'color-card';
        card.style.backgroundColor = color.hex;
        
        const infoDiv = document.createElement('div');
        infoDiv.className = 'color-info';
        
        const lockBtn = document.createElement('button');
        lockBtn.className = `lock-btn ${color.locked ? 'locked' : ''}`;
        lockBtn.innerHTML = color.locked ? '<i class="ph-fill ph-lock-key"></i>' : '<i class="ph ph-lock-key-open"></i>';
        lockBtn.setAttribute('aria-label', color.locked ? 'Desbloquear color' : 'Bloquear color');
        lockBtn.onclick = () => toggleLock(index);
        
        const primaryValue = activeFormat === 'hex' ? color.hex : color.hsl;
        const secondaryValue = activeFormat === 'hex' ? color.hsl : color.hex;

        const primaryText = document.createElement('span');
        primaryText.className = activeFormat === 'hsl' ? 'color-hsl-primary' : 'color-hex';
        primaryText.textContent = primaryValue;
        primaryText.setAttribute('aria-label', `Color ${activeFormat.toUpperCase()}: ${primaryValue}. Haz clic para copiar.`);
        primaryText.onclick = () => copyToClipboard(primaryValue);

        const secondaryText = document.createElement('span');
        secondaryText.className = 'color-hsl';
        secondaryText.textContent = secondaryValue;

        infoDiv.appendChild(lockBtn);
        infoDiv.appendChild(primaryText);
        infoDiv.appendChild(secondaryText);
        card.appendChild(infoDiv);
        
        paletteContainer.appendChild(card);
    });
}

function toggleLock(index) {
    currentPalette[index].locked = !currentPalette[index].locked;
    localStorage.setItem('colorfly_palette_v2', JSON.stringify(currentPalette));
    
    const card = paletteContainer.children[index];
    if (card) {
        const lockBtn = card.querySelector('.lock-btn');
        if (lockBtn) {
            const isLocked = currentPalette[index].locked;
            lockBtn.className = `lock-btn ${isLocked ? 'locked' : ''}`;
            lockBtn.innerHTML = isLocked ? '<i class="ph-fill ph-lock-key"></i>' : '<i class="ph ph-lock-key-open"></i>';
            lockBtn.setAttribute('aria-label', isLocked ? 'Desbloquear color' : 'Bloquear color');
        }
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(`Copiado: ${text}`);
    }).catch(err => {
        console.error('Error al copiar al portapapeles: ', err);
    });
}

let toastTimeout;
function showToast(message) {
    toastMessage.textContent = message;
    toastContainer.classList.add('show');
    toastContainer.setAttribute('aria-hidden', 'false');
    
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toastContainer.classList.remove('show');
        toastContainer.setAttribute('aria-hidden', 'true');
    }, 2500);
}

window.addEventListener('DOMContentLoaded', init);
