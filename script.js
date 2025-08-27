let currentMap = 0;
let scale = 0.5;
let rotation = 0;
let posX = 0;
let posY = 0;

const mapWrapper = document.getElementById("map-wrapper");
const mapImage = document.getElementById("map-image");
const iconsLayer = document.getElementById("icons-layer");

// --- карты и иконки ---
const maps = [
  {
    image: "maps/map1.png",
    icons: [
      { src: "icons/icon4.png", x: 2600, y: 800 },
      { src: "icons/icon2.png", x: 1300, y: 1000 },
      { src: "icons/icon6.png", x: 1550, y: 1300 },
      { src: "icons/icon8.png", x: 2280, y: 1000 }
    ]
  },
  {
    image: "maps/map2.png",
    icons: [
      { src: "icons/icon0.png", x: 100, y: 100 },
      { src: "icons/icon1.png", x: 500, y: 200 }
    ]
  },
  {
    image: "maps/map3.png",
    icons: [{ src: "icons/icon5.png", x: 500, y: 200 }]
  },
  {
    image: "maps/map4.png",
    icons: [
      { src: "icons/icon7.png", x: 250, y: 300 },
      { src: "icons/icon3.png", x: 550, y: 700 }
    ]
  }
];

function setMap(index) {
  currentMap = index;
  scale = 0.5;
  rotation = 0;
  posX = 0;
  posY = 0;

  mapImage.src = maps[index].image;
  renderIcons();
  updateTransform();
}

function renderIcons() {
  iconsLayer.innerHTML = "";
  maps[currentMap].icons.forEach(icon => {
    if (icon.x === 0 && icon.y === 0) return; // скрыть иконку
    const el = document.createElement("img");
    el.src = icon.src;
    el.className = "icon";
    el.style.left = icon.x + "px";
    el.style.top = icon.y + "px";
    iconsLayer.appendChild(el);
  });
}

// применяем трансформации
function updateTransform() {
  mapImage.style.transform = `translate(${posX}px, ${posY}px) scale(${scale}) rotate(${rotation}deg)`;

  // обновляем каждую иконку
  document.querySelectorAll(".map-icon").forEach(icon => {
    // позиция учитывает зум
    const x = parseFloat(icon.dataset.x) * scale + posX + mapImage.offsetWidth / 2;
    const y = parseFloat(icon.dataset.y) * scale + posY + mapImage.offsetHeight / 2;

    icon.style.left = x + "px";
    icon.style.top = y + "px";

    // масштаб иконок — слабее (чтобы они не исчезали при отдалении)
    const iconScale = Math.max(0.7, scale * 0.8); 
    icon.style.transform = `translate(-50%, -50%) scale(${iconScale})`;
  });
}


// --- управление жестами ---
// зум (щипок)
let startDist = 0, startAngle = 0, startScale = 3, startRot = 0;

mapWrapper.addEventListener("touchstart", e => {
  if (e.touches.length === 2) {
    e.preventDefault();
    const dx = e.touches[1].clientX - e.touches[0].clientX;
    const dy = e.touches[1].clientY - e.touches[0].clientY;
    startDist = Math.hypot(dx, dy);
    startAngle = Math.atan2(dy, dx);
    startScale = scale;
    startRot = rotation;
  }
}, { passive: false });

mapWrapper.addEventListener("touchmove", e => {
  if (e.touches.length === 2) {
    e.preventDefault();
    const dx = e.touches[1].clientX - e.touches[0].clientX;
    const dy = e.touches[1].clientY - e.touches[0].clientY;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);

    scale = Math.min(2, Math.max(0.1, startScale * (dist / startDist)));
    rotation = startRot + (angle - startAngle) * (180 / Math.PI);

    updateTransform();
  }
}, { passive: false });

// перемещение одним пальцем
let lastX = 0, lastY = 0;
mapWrapper.addEventListener("touchstart", e => {
  if (e.touches.length === 1) {
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
  }
});
mapWrapper.addEventListener("touchmove", e => {
  if (e.touches.length === 1) {
    const dx = e.touches[0].clientX - lastX;
    const dy = e.touches[0].clientY - lastY;
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
    posX += dx;
    posY += dy;
    updateTransform();
  }
});

// --- мышь для ПК ---
let dragging = false;
mapWrapper.addEventListener("mousedown", e => {
  dragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
});
window.addEventListener("mouseup", () => dragging = false);
window.addEventListener("mousemove", e => {
  if (dragging) {
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    posX += dx;
    posY += dy;
    updateTransform();
  }
});
window.addEventListener("wheel", e => {
  scale = Math.min(4, Math.max(0.5, scale + e.deltaY * -0.001));
  updateTransform();
});

// загрузка первой карты
setMap(0);





