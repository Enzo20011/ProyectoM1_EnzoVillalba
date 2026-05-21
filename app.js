// Variables del DOM
const paletteContainer = document.getElementById('palette-container');
const generateBtn = document.getElementById('generate-btn');
const btnHex = document.getElementById('btn-hex');
const btnHsl = document.getElementById('btn-hsl');
const sizeSelect = document.getElementById('palette-size');
const toastContainer = document.getElementById('toast-container');
const toastMessage = document.getElementById('toast-message');

// Estado de la aplicación
let currentPalette = [];
let paletteSize = 6;
let activeFormat = 'hex'; // 'hex' | 'hsl'

// Inicialización
function init() {
    // Intentar cargar de localStorage
    const savedPalette = localStorage.getItem('colorfly_palette_v2');
    const savedSize = localStorage.getItem('colorfly_size_v2');

    if (savedSize) {
        paletteSize = parseInt(savedSize);
        sizeSelect.value = paletteSize;
    }

    if (savedPalette) {
        currentPalette = JSON.parse(savedPalette);
        // Validar si el tamaño guardado coincide con el actual, si no, regenerar
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

// Configurar Event Listeners
function setupEventListeners() {
    generateBtn.addEventListener('click', generateNewPalette);
    btnHex.addEventListener('click', () => setActiveFormat('hex'));
    btnHsl.addEventListener('click', () => setActiveFormat('hsl'));

    sizeSelect.addEventListener('change', (e) => {
        const newSize = parseInt(e.target.value);
        if (newSize > paletteSize) {
            // Añadir colores nuevos pero mantener los bloqueados si es posible
            const toAdd = newSize - paletteSize;
            for(let i=0; i<toAdd; i++) {
                currentPalette.push(createRandomColorObj());
            }
        } else if (newSize < paletteSize) {
            // Recortar el array (incluso si están bloqueados, se quitan los últimos)
            currentPalette = currentPalette.slice(0, newSize);
        }
        
        paletteSize = newSize;
        localStorage.setItem('colorfly_size_v2', paletteSize);
        saveAndRender();
    });
}

// Solo actualiza el botón activo - NO toca la paleta en pantalla
function setActiveFormat(format) {
    activeFormat = format;

    // Actualizar clases y aria-pressed de ambos botones
    btnHex.classList.toggle('active', format === 'hex');
    btnHex.setAttribute('aria-pressed', format === 'hex');
    btnHsl.classList.toggle('active', format === 'hsl');
    btnHsl.setAttribute('aria-pressed', format === 'hsl');

    // NO renderiza ni regenera - los colores cambian recién con "Generar Paleta"
}

// Generadores
function generateRandomHex() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Convertir HEX a HSL (para mostrar el segundo formato requerido)
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
    // Si currentPalette está vacío, lo llenamos
    if (currentPalette.length === 0 || currentPalette.length !== paletteSize) {
        currentPalette = [];
        for (let i = 0; i < paletteSize; i++) {
            currentPalette.push(createRandomColorObj());
        }
    } else {
        // Solo actualizamos los NO bloqueados
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

// Renderizado del DOM
function renderPalette() {
    paletteContainer.innerHTML = '';
    
    // Ajustar columnas del grid según la cantidad
    paletteContainer.style.gridTemplateColumns = `repeat(${paletteSize}, 1fr)`;

    currentPalette.forEach((color, index) => {
        const card = document.createElement('div');
        card.className = 'color-card';
        card.style.backgroundColor = color.hex;
        
        // Contenedor de info
        const infoDiv = document.createElement('div');
        infoDiv.className = 'color-info';
        
        // Bloqueo
        const lockBtn = document.createElement('button');
        lockBtn.className = `lock-btn ${color.locked ? 'locked' : ''}`;
        lockBtn.innerHTML = color.locked ? '<i class="ph-fill ph-lock-key"></i>' : '<i class="ph ph-lock-key-open"></i>';
        lockBtn.setAttribute('aria-label', color.locked ? 'Desbloquear color' : 'Bloquear color');
        lockBtn.onclick = () => toggleLock(index);
        
        // Texto primario (el formato activo) y secundario
        const primaryValue = activeFormat === 'hex' ? color.hex : color.hsl;
        const secondaryValue = activeFormat === 'hex' ? color.hsl : color.hex;

        const primaryText = document.createElement('span');
        // Si el formato primario es HSL, usamos fuente más chica porque el string es más largo
        primaryText.className = activeFormat === 'hsl' ? 'color-hsl-primary' : 'color-hex';
        primaryText.textContent = primaryValue;
        primaryText.setAttribute('aria-label', `Color ${activeFormat.toUpperCase()}: ${primaryValue}. Haz clic para copiar.`);
        primaryText.onclick = () => copyToClipboard(primaryValue);

        const secondaryText = document.createElement('span');
        secondaryText.className = 'color-hsl'; // estilo secundario pequeño
        secondaryText.textContent = secondaryValue;

        infoDiv.appendChild(lockBtn);
        infoDiv.appendChild(primaryText);
        infoDiv.appendChild(secondaryText);
        card.appendChild(infoDiv);
        
        paletteContainer.appendChild(card);
    });
}

// Funciones Auxiliares
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

// Iniciar app al cargar la página
window.addEventListener('DOMContentLoaded', init);
