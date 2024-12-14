const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const socket = io();

// Resize the canvas to match the container size
function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

// Resize the canvas initially and on window resize
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Variables for drawing
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Start drawing
canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener("touchstart", (e) => {
  isDrawing = true;
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  [lastX, lastY] = [touch.clientX - rect.left, touch.clientY - rect.top];
});

// Stop drawing
canvas.addEventListener("mouseup", () => (isDrawing = false));
canvas.addEventListener("mouseout", () => (isDrawing = false));
canvas.addEventListener("touchend", () => (isDrawing = false));

// Draw on the canvas
canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;

  const x = e.offsetX;
  const y = e.offsetY;

  drawLine(lastX, lastY, x, y, "black");
  [lastX, lastY] = [x, y];

  socket.emit("draw", { x, y, lastX, lastY });
});

canvas.addEventListener("touchmove", (e) => {
  if (!isDrawing) return;

  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;

  drawLine(lastX, lastY, x, y, "black");
  [lastX, lastY] = [x, y];

  socket.emit("draw", { x, y, lastX, lastY });
});

// Drawing function
function drawLine(x1, y1, x2, y2, color) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();
}

// Listen for drawing data from server
socket.on("draw", (data) => {
  drawLine(data.lastX, data.lastY, data.x, data.y, "black");
});
