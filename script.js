let currentMap = 0;
let scale = 0.7;
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
      { src: "icons/icon4.png", x: 380, y: 250, label: "Симфония" },
      { src: "icons/icon2.png", x: 300, y: 800, label: "Стишок" },
      { src: "icons/icon6.png", x: 420, y: 695, label: "ДУЭЛЬ" },
      { src: "icons/icon8.png", x: 300, y: 375, label: "Цифровой шифр" },
      { src: "icons/icon7.png", x: 2900, y: 600, label: "Здоровый дух" },
      { src: "icons/icon3.png", x: 1800, y: 700, label: "Меткий глаз" }
    ]
  },
  {
    image: "maps/map2.png",
    icons: [
      { src: "icons/icon0.png", x: 1450, y: 420, label: "Эхо эпохи" },
      { src: "icons/icon1.png", x: 410, y: 810, label: "Игра сфинкса " }
    ]
  },
  {
    image: "maps/map3.png",
    icons: [{ src: "icons/icon5.png", x: 280, y: 550, label: "Рисование вслепую" }]
  }
];

function setMap(index) {
  currentMap = index;
  scale = 0.7;
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
    if (icon.x === 0 && icon.y === 0) return;
    const wrapper = document.createElement("div");
    wrapper.className = "icon";
    wrapper.style.left = icon.x + "px";
    wrapper.style.top = icon.y + "px";

    const img = document.createElement("img");
    img.src = icon.src;

    const label = document.createElement("span");
    label.className = "icon-label";
    label.textContent = icon.label || "";

    wrapper.appendChild(img);
    wrapper.appendChild(label);
    iconsLayer.appendChild(wrapper);
  });
}

// применяем трансформации
function updateTransform() {
  // Ограничение перемещения (чтобы не уводили далеко карту)
  const limit = 500; // пиксели
  posX = Math.max(-limit, Math.min(limit, posX));
  posY = Math.max(-limit, Math.min(limit, posY));

  mapWrapper.style.transform = 
    `translate(-80%, -30%) translate(${posX}px, ${posY}px) scale(${scale}) rotate(${rotation}deg)`;

  // Иконки: при отдалении растут, при приближении уменьшаются
  const iconScale = 1 - (scale * 0.6); // подстройка под мягкий эффект
  document.querySelectorAll(".icon").forEach(el => {
    el.style.transform = `scale(${iconScale}) rotate(${-rotation}deg)`;
  });
}

// --- управление жестами ---
// зум (щипок)
let startDist = 0, startAngle = 0, startScale = 1, startRot = 0;

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

    // ограничение масштаба
    scale = Math.min(1, Math.max(0.5, startScale * (dist / startDist)));
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
  scale = Math.min(1, Math.max(0.5, scale + e.deltaY * -0.001));
  updateTransform();
});

// загрузка первой карты
setMap(0);




