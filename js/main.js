export const canvas = document.querySelector('#canvas');
export const c = canvas.getContext('2d');

canvas.width = 1424;
canvas.height = 676;

const delay = 200;

c.fillRect(0, 0, canvas.width, canvas.height);

let { points, center } = calculateRectPoint(100, 100, 200, 200);

async function animate() {
  await sleep(delay);
  window.requestAnimationFrame(animate);
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);
  points = rotation(points, center, 90);
  drawPoints(c, points);
  drawEdges(c, points);
}

animate();

function calculateRectPoint(width, height, x, y) {
  return {
    center: [x + width / 2, y + height / 2],
    points: [
      [x, y],
      [x + width, y],
      [x + width, y + height],
      [x, y + height],
    ],
  };
}

function drawPoints(context, matrixArray) {
  for (let i = 0; i < matrixArray.length; i++) {
    drawPoint(context, matrixArray[i][0], matrixArray[i][1]);
  }
}

function drawEdges(context, matrixArray) {
  for (let i = 0; i < matrixArray.length; i++) {
    context.beginPath();
    if (i === matrixArray.length - 1) {
      context.moveTo(
        matrixArray[matrixArray.length - 1][0],
        matrixArray[matrixArray.length - 1][1]
      );
      context.lineTo(matrixArray[0][0], matrixArray[0][1]);
    } else {
      context.moveTo(matrixArray[i][0], matrixArray[i][1]);
      context.lineTo(matrixArray[i + 1][0], matrixArray[i + 1][1]);
    }
    context.strokeStyle = 'white';
    context.stroke();
  }
}

function rotation(matrixArray, center, angle = 90) {
  let rotationMatrix = [
    [Math.cos(angle), -Math.sin(angle)],
    [Math.sin(angle), Math.cos(angle)],
  ];

  for (let i = 0; i < matrixArray.length; i++) {
    let [oldX, oldY] = matrixArray[i];

    // new X
    matrixArray[i][0] =
      center[0] +
      (oldX - center[0]) * rotationMatrix[0][0] +
      (oldY - center[1]) * rotationMatrix[0][1];

    // new Y
    matrixArray[i][1] =
      center[1] +
      (oldX - center[0]) * rotationMatrix[1][0] +
      (oldY - center[1]) * rotationMatrix[1][1];
  }

  return matrixArray;
}

function drawPoint(context, x, y, label, color = 'white', size = 2) {
  if (color == null) {
    color = '#000';
  }
  if (size == null) {
    size = 5;
  }

  var radius = 0.5 * size;

  // to increase smoothing for numbers with decimal part
  var pointX = Math.round(x - radius);
  var pointY = Math.round(y - radius);

  context.beginPath();
  context.fillStyle = color;
  context.arc(pointX, pointY, size, 0 * Math.PI, 2 * Math.PI);
  context.fill();

  if (label) {
    var textX = pointX;
    var textY = Math.round(pointY - size - 3);

    context.font = 'Italic 14px Arial';
    context.fillStyle = color;
    context.textAlign = 'center';
    context.fillText(label, textX, textY);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
