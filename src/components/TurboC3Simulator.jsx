import { useState, useRef, useEffect } from "react";

// ─── Rendering helpers ────────────────────────────────────────────────────────

/** Parse a string to a finite number, returning 0 if invalid. */
function num(v) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

function drawPixel(ctx, cx, cy, x, y, color = "#00FF00") {
  ctx.fillStyle = color;
  ctx.fillRect(cx + x, cy - y, 2, 2);
}

function ddaLine(ctx, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const steps = Math.max(Math.abs(dx), Math.abs(dy));
  const xInc = dx / steps;
  const yInc = dy / steps;
  let x = x1;
  let y = y1;
  ctx.fillStyle = "#00FF00";
  for (let i = 0; i <= steps; i++) {
    ctx.fillRect(Math.round(x), Math.round(y), 2, 2);
    x += xInc;
    y += yInc;
  }
}

function bresenhamLine(ctx, x1, y1, x2, y2) {
  let dx = Math.abs(x2 - x1);
  let dy = Math.abs(y2 - y1);
  let sx = x1 < x2 ? 1 : -1;
  let sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;
  ctx.fillStyle = "#00FF00";
  while (true) {
    ctx.fillRect(x1, y1, 2, 2);
    if (x1 === x2 && y1 === y2) break;
    const e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x1 += sx; }
    if (e2 < dx) { err += dx; y1 += sy; }
  }
}

function bresenhamCircle(ctx, cx, cy, r) {
  let x = 0, y = r;
  let d = 3 - 2 * r;
  const plot = (px, py) => drawPixel(ctx, cx, cy, px, py);
  const plotAll = (px, py) => {
    plot(px, py); plot(-px, py); plot(px, -py); plot(-px, -py);
    plot(py, px); plot(-py, px); plot(py, -px); plot(-py, -px);
  };
  plotAll(x, y);
  while (y >= x) {
    x++;
    if (d > 0) { y--; d += 4 * (x - y) + 10; }
    else { d += 4 * x + 6; }
    plotAll(x, y);
  }
}

function midpointCircle(ctx, cx, cy, r) {
  let x = r, y = 0;
  let p = 1 - r;
  const plot = (px, py) => drawPixel(ctx, cx, cy, px, py);
  const plotAll = (px, py) => {
    plot(px, py); plot(-px, py); plot(px, -py); plot(-px, -py);
    plot(py, px); plot(-py, px); plot(py, -px); plot(-py, -px);
  };
  plotAll(x, y);
  while (x > y) {
    y++;
    if (p <= 0) p += 2 * y + 1;
    else { x--; p += 2 * y - 2 * x + 1; }
    plotAll(x, y);
  }
}

function midpointEllipse(ctx, cx, cy, rx, ry) {
  let x = 0, y = ry;
  let p1 = ry * ry - rx * rx * ry + 0.25 * rx * rx;
  const plotAll = (px, py) => {
    drawPixel(ctx, cx, cy, px, py);
    drawPixel(ctx, cx, cy, -px, py);
    drawPixel(ctx, cx, cy, px, -py);
    drawPixel(ctx, cx, cy, -px, -py);
  };
  while (2 * ry * ry * x < 2 * rx * rx * y) {
    plotAll(x, y);
    x++;
    if (p1 < 0) p1 += 2 * ry * ry * x + ry * ry;
    else { y--; p1 += 2 * ry * ry * x - 2 * rx * rx * y + ry * ry; }
  }
  let p2 = ry * ry * (x + 0.5) * (x + 0.5) + rx * rx * (y - 1) * (y - 1) - rx * rx * ry * ry;
  while (y >= 0) {
    plotAll(x, y);
    y--;
    if (p2 > 0) p2 -= 2 * rx * rx * y + rx * rx;
    else { x++; p2 += 2 * ry * ry * x - 2 * rx * rx * y + rx * rx; }
  }
}

function floodFill(ctx, startX, startY, fillColor, W, H) {
  const imageData = ctx.getImageData(0, 0, W, H);
  const data = imageData.data;
  const idx = (x, y) => (y * W + x) * 4;
  const targetIdx = idx(startX, startY);
  const tR = data[targetIdx], tG = data[targetIdx + 1], tB = data[targetIdx + 2];
  const [fR, fG, fB] = fillColor;
  if (tR === fR && tG === fG && tB === fB) return;
  const stack = [[startX, startY]];
  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || x >= W || y < 0 || y >= H) continue;
    const i = idx(x, y);
    if (data[i] !== tR || data[i + 1] !== tG || data[i + 2] !== tB) continue;
    data[i] = fR; data[i + 1] = fG; data[i + 2] = fB; data[i + 3] = 255;
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  ctx.putImageData(imageData, 0, 0);
}

function boundaryFill(ctx, startX, startY, fillColor, boundaryColor, W, H) {
  const imageData = ctx.getImageData(0, 0, W, H);
  const data = imageData.data;
  const idx = (x, y) => (y * W + x) * 4;
  const [bR, bG, bB] = boundaryColor;
  const [fR, fG, fB] = fillColor;
  const stack = [[startX, startY]];
  const visited = new Set();
  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || x >= W || y < 0 || y >= H) continue;
    const key = `${x},${y}`;
    if (visited.has(key)) continue;
    visited.add(key);
    const i = idx(x, y);
    const isB = data[i] === bR && data[i + 1] === bG && data[i + 2] === bB;
    const isF = data[i] === fR && data[i + 1] === fG && data[i + 2] === fB;
    if (isB || isF) continue;
    data[i] = fR; data[i + 1] = fG; data[i + 2] = fB; data[i + 3] = 255;
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  ctx.putImageData(imageData, 0, 0);
}

function applyTranslation(ctx, cx, cy, px, py, tx, ty) {
  ctx.fillStyle = "#00FF00";
  ctx.fillRect(cx + px - 3, cy - py - 3, 6, 6);
  ctx.fillStyle = "#FFFF00";
  ctx.font = "11px monospace";
  ctx.fillText("Original", cx + px + 5, cy - py);
  ctx.fillStyle = "#FF8800";
  ctx.fillRect(cx + px + tx - 3, cy - py - ty - 3, 6, 6);
  ctx.fillStyle = "#FF8800";
  ctx.fillText("Translated", cx + px + tx + 5, cy - py - ty);
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = "#888";
  ctx.beginPath();
  ctx.moveTo(cx + px, cy - py);
  ctx.lineTo(cx + px + tx, cy - py - ty);
  ctx.stroke();
  ctx.setLineDash([]);
}

function applyRotation(ctx, cx, cy, px, py, angle) {
  const rad = (angle * Math.PI) / 180;
  const rx = Math.round(px * Math.cos(rad) - py * Math.sin(rad));
  const ry = Math.round(px * Math.sin(rad) + py * Math.cos(rad));
  ctx.fillStyle = "#00FF00";
  ctx.fillRect(cx + px - 3, cy - py - 3, 6, 6);
  ctx.fillStyle = "#FFFF00";
  ctx.font = "11px monospace";
  ctx.fillText("Original", cx + px + 5, cy - py);
  ctx.fillStyle = "#FF8800";
  ctx.fillRect(cx + rx - 3, cy - ry - 3, 6, 6);
  ctx.fillStyle = "#FF8800";
  ctx.fillText("Rotated", cx + rx + 5, cy - ry);
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = "#888";
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + px, cy - py);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + rx, cy - ry);
  ctx.stroke();
  ctx.setLineDash([]);
}

function applyScaling(ctx, cx, cy, px, py, sx, sy) {
  const nx = Math.round(px * sx);
  const ny = Math.round(py * sy);
  ctx.fillStyle = "#00FF00";
  ctx.fillRect(cx + px - 3, cy - py - 3, 6, 6);
  ctx.fillStyle = "#FFFF00";
  ctx.font = "11px monospace";
  ctx.fillText("Original", cx + px + 5, cy - py);
  ctx.fillStyle = "#FF8800";
  ctx.fillRect(cx + nx - 3, cy - ny - 3, 6, 6);
  ctx.fillStyle = "#FF8800";
  ctx.fillText("Scaled", cx + nx + 5, cy - ny);
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = "#888";
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + px, cy - py);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + nx, cy - ny);
  ctx.stroke();
  ctx.setLineDash([]);
}

// ─── Topic definitions ────────────────────────────────────────────────────────

const TOPICS = [
  {
    id: "dda",
    label: "DDA Line Drawing Algorithm",
    prompts: [
      { key: "x1", text: "Enter x1: ", label: 'printf("Enter x1: ");', placeholder: "0" },
      { key: "y1", text: "Enter y1: ", label: 'printf("Enter y1: ");', placeholder: "0" },
      { key: "x2", text: "Enter x2: ", label: 'printf("Enter x2: ");', placeholder: "200" },
      { key: "y2", text: "Enter y2: ", label: 'printf("Enter y2: ");', placeholder: "150" },
    ],
    render(ctx, inputs, W, H) {
      const cx = W / 2, cy = H / 2;
      const x1 = num(inputs.x1), y1 = num(inputs.y1);
      const x2 = num(inputs.x2), y2 = num(inputs.y2);
      drawAxes(ctx, cx, cy, W, H);
      ddaLine(ctx, cx + x1, cy - y1, cx + x2, cy - y2);
      addLabel(ctx, W, H, `DDA Line: (${x1},${y1}) → (${x2},${y2})`);
    },
  },
  {
    id: "bresenham_line",
    label: "Bresenham's Line Drawing Algorithm",
    prompts: [
      { key: "x1", text: "Enter x1: ", label: 'printf("Enter x1: ");', placeholder: "0" },
      { key: "y1", text: "Enter y1: ", label: 'printf("Enter y1: ");', placeholder: "0" },
      { key: "x2", text: "Enter x2: ", label: 'printf("Enter x2: ");', placeholder: "180" },
      { key: "y2", text: "Enter y2: ", label: 'printf("Enter y2: ");', placeholder: "120" },
    ],
    render(ctx, inputs, W, H) {
      const cx = W / 2, cy = H / 2;
      const x1 = num(inputs.x1), y1 = num(inputs.y1);
      const x2 = num(inputs.x2), y2 = num(inputs.y2);
      drawAxes(ctx, cx, cy, W, H);
      bresenhamLine(ctx, cx + x1, cy - y1, cx + x2, cy - y2);
      addLabel(ctx, W, H, `Bresenham Line: (${x1},${y1}) → (${x2},${y2})`);
    },
  },
  {
    id: "bresenham_circle",
    label: "Bresenham's Circle Drawing Algorithm",
    prompts: [
      { key: "cx", text: "Enter center x: ", label: 'printf("Enter center x: ");', placeholder: "0" },
      { key: "cy", text: "Enter center y: ", label: 'printf("Enter center y: ");', placeholder: "0" },
      { key: "r",  text: "Enter radius: ",   label: 'printf("Enter radius: ");',   placeholder: "80" },
    ],
    render(ctx, inputs, W, H) {
      const ox = W / 2, oy = H / 2;
      const cx = num(inputs.cx), cy = num(inputs.cy), r = Math.abs(num(inputs.r));
      drawAxes(ctx, ox, oy, W, H);
      bresenhamCircle(ctx, ox + cx, oy - cy, r);
      addLabel(ctx, W, H, `Bresenham Circle: center=(${cx},${cy}), r=${r}`);
    },
  },
  {
    id: "midpoint_circle",
    label: "Midpoint Circle Algorithm",
    prompts: [
      { key: "cx", text: "Enter center x: ", label: 'printf("Enter center x: ");', placeholder: "0" },
      { key: "cy", text: "Enter center y: ", label: 'printf("Enter center y: ");', placeholder: "0" },
      { key: "r",  text: "Enter radius: ",   label: 'printf("Enter radius: ");',   placeholder: "90" },
    ],
    render(ctx, inputs, W, H) {
      const ox = W / 2, oy = H / 2;
      const cx = num(inputs.cx), cy = num(inputs.cy), r = Math.abs(num(inputs.r));
      drawAxes(ctx, ox, oy, W, H);
      midpointCircle(ctx, ox + cx, oy - cy, r);
      addLabel(ctx, W, H, `Midpoint Circle: center=(${cx},${cy}), r=${r}`);
    },
  },
  {
    id: "ellipse",
    label: "Midpoint Ellipse Algorithm",
    prompts: [
      { key: "cx", text: "Enter center x: ",  label: 'printf("Enter center x: ");',  placeholder: "0" },
      { key: "cy", text: "Enter center y: ",  label: 'printf("Enter center y: ");',  placeholder: "0" },
      { key: "rx", text: "Enter x-radius: ",  label: 'printf("Enter x-radius: ");',  placeholder: "120" },
      { key: "ry", text: "Enter y-radius: ",  label: 'printf("Enter y-radius: ");',  placeholder: "70" },
    ],
    render(ctx, inputs, W, H) {
      const ox = W / 2, oy = H / 2;
      const cx = num(inputs.cx), cy = num(inputs.cy);
      const rx = Math.abs(num(inputs.rx)), ry = Math.abs(num(inputs.ry));
      drawAxes(ctx, ox, oy, W, H);
      midpointEllipse(ctx, ox + cx, oy - cy, rx, ry);
      addLabel(ctx, W, H, `Ellipse: center=(${cx},${cy}), rx=${rx}, ry=${ry}`);
    },
  },
  {
    id: "flood_fill",
    label: "Flood Fill Algorithm",
    prompts: [
      { key: "cx", text: "Enter circle center x: ", label: 'printf("Enter circle center x: ");', placeholder: "0" },
      { key: "cy", text: "Enter circle center y: ", label: 'printf("Enter circle center y: ");', placeholder: "0" },
      { key: "r",  text: "Enter radius: ",          label: 'printf("Enter radius: ");',          placeholder: "80" },
      { key: "sx", text: "Enter seed x: ",          label: 'printf("Enter seed x: ");',          placeholder: "10" },
      { key: "sy", text: "Enter seed y: ",          label: 'printf("Enter seed y: ");',          placeholder: "10" },
    ],
    render(ctx, inputs, W, H) {
      const ox = W / 2, oy = H / 2;
      const cx = num(inputs.cx), cy = num(inputs.cy), r = Math.abs(num(inputs.r));
      const sx = num(inputs.sx), sy = num(inputs.sy);
      drawAxes(ctx, ox, oy, W, H);
      bresenhamCircle(ctx, ox + cx, oy - cy, r);
      const seedX = ox + cx + sx;
      const seedY = oy - cy - sy;
      if (seedX > 0 && seedX < W && seedY > 0 && seedY < H)
        floodFill(ctx, Math.round(seedX), Math.round(seedY), [0, 180, 0], W, H);
      addLabel(ctx, W, H, `Flood Fill: seed=(${sx},${sy}) inside circle r=${r}`);
    },
  },
  {
    id: "boundary_fill",
    label: "Boundary Fill Algorithm",
    prompts: [
      { key: "cx", text: "Enter rect center x: ", label: 'printf("Enter rect center x: ");', placeholder: "0" },
      { key: "cy", text: "Enter rect center y: ", label: 'printf("Enter rect center y: ");', placeholder: "0" },
      { key: "w",  text: "Enter rect width: ",    label: 'printf("Enter rect width: ");',    placeholder: "140" },
      { key: "h",  text: "Enter rect height: ",   label: 'printf("Enter rect height: ");',   placeholder: "100" },
      { key: "sx", text: "Enter seed x: ",        label: 'printf("Enter seed x: ");',        placeholder: "10" },
      { key: "sy", text: "Enter seed y: ",        label: 'printf("Enter seed y: ");',        placeholder: "10" },
    ],
    render(ctx, inputs, W, H) {
      const ox = W / 2, oy = H / 2;
      const cx = num(inputs.cx), cy = num(inputs.cy);
      const w = num(inputs.w), h = num(inputs.h);
      const sx = num(inputs.sx), sy = num(inputs.sy);
      drawAxes(ctx, ox, oy, W, H);
      const rx = ox + cx - w / 2;
      const ry = oy - cy - h / 2;
      ctx.strokeStyle = "#00FF00";
      ctx.lineWidth = 2;
      ctx.strokeRect(rx, ry, w, h);
      const seedX = ox + cx + sx;
      const seedY = oy - cy - sy;
      if (seedX > 0 && seedX < W && seedY > 0 && seedY < H)
        boundaryFill(ctx, Math.round(seedX), Math.round(seedY), [255, 165, 0], [0, 255, 0], W, H);
      addLabel(ctx, W, H, `Boundary Fill: seed=(${sx},${sy}) inside rect ${w}×${h}`);
    },
  },
  {
    id: "translation",
    label: "2D Translation",
    prompts: [
      { key: "px", text: "Enter point x: ", label: 'printf("Enter point x: ");', placeholder: "60" },
      { key: "py", text: "Enter point y: ", label: 'printf("Enter point y: ");', placeholder: "60" },
      { key: "tx", text: "Enter tx: ",      label: 'printf("Enter tx: ");',      placeholder: "80" },
      { key: "ty", text: "Enter ty: ",      label: 'printf("Enter ty: ");',      placeholder: "50" },
    ],
    render(ctx, inputs, W, H) {
      const ox = W / 2, oy = H / 2;
      const px = num(inputs.px), py = num(inputs.py);
      const tx = num(inputs.tx), ty = num(inputs.ty);
      drawAxes(ctx, ox, oy, W, H);
      applyTranslation(ctx, ox, oy, px, py, tx, ty);
      addLabel(ctx, W, H, `Translation: P(${px},${py}) → P'(${px + tx},${py + ty})`);
    },
  },
  {
    id: "rotation",
    label: "2D Rotation",
    prompts: [
      { key: "px",    text: "Enter point x: ",       label: 'printf("Enter point x: ");',       placeholder: "100" },
      { key: "py",    text: "Enter point y: ",       label: 'printf("Enter point y: ");',       placeholder: "0" },
      { key: "angle", text: "Enter angle (degrees): ", label: 'printf("Enter angle (degrees): ");', placeholder: "45" },
    ],
    render(ctx, inputs, W, H) {
      const ox = W / 2, oy = H / 2;
      const px = num(inputs.px), py = num(inputs.py), angle = num(inputs.angle);
      drawAxes(ctx, ox, oy, W, H);
      applyRotation(ctx, ox, oy, px, py, angle);
      addLabel(ctx, W, H, `Rotation: P(${px},${py}) rotated by ${angle}°`);
    },
  },
  {
    id: "scaling",
    label: "2D Scaling",
    prompts: [
      { key: "px", text: "Enter point x: ",     label: 'printf("Enter point x: ");',     placeholder: "80" },
      { key: "py", text: "Enter point y: ",     label: 'printf("Enter point y: ");',     placeholder: "60" },
      { key: "sx", text: "Enter scale x (sx): ", label: 'printf("Enter scale x (sx): ");', placeholder: "1.5" },
      { key: "sy", text: "Enter scale y (sy): ", label: 'printf("Enter scale y (sy): ");', placeholder: "1.5" },
    ],
    render(ctx, inputs, W, H) {
      const ox = W / 2, oy = H / 2;
      const px = num(inputs.px), py = num(inputs.py);
      const sx = num(inputs.sx), sy = num(inputs.sy);
      drawAxes(ctx, ox, oy, W, H);
      applyScaling(ctx, ox, oy, px, py, sx, sy);
      addLabel(ctx, W, H, `Scaling: P(${px},${py}) → P'(${(px * sx).toFixed(1)},${(py * sy).toFixed(1)})`);
    },
  },
];

// ─── Canvas helpers ───────────────────────────────────────────────────────────

function drawAxes(ctx, cx, cy, W, H) {
  ctx.strokeStyle = "#444";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, cy); ctx.lineTo(W, cy);
  ctx.moveTo(cx, 0); ctx.lineTo(cx, H);
  ctx.stroke();
  ctx.fillStyle = "#555";
  ctx.font = "10px monospace";
  for (let x = cx % 50; x < W; x += 50) {
    ctx.fillText(Math.round(x - cx), x + 2, cy - 2);
  }
  for (let y = cy % 50; y < H; y += 50) {
    if (Math.abs(y - cy) > 5)
      ctx.fillText(Math.round(cy - y), cx + 2, y + 10);
  }
}

function addLabel(ctx, W, H, text) {
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(0, H - 24, W, 24);
  ctx.fillStyle = "#FFFF00";
  ctx.font = "12px monospace";
  ctx.fillText(text, 8, H - 8);
}

// ─── Main Component ───────────────────────────────────────────────────────────

const defaultInputsFor = (t) => {
  const defaults = {};
  t.prompts.forEach((p) => { defaults[p.key] = p.placeholder; });
  return defaults;
};

const TurboC3Simulator = () => {
  const [topicId, setTopicId] = useState(TOPICS[0].id);
  const [inputs, setInputs] = useState(() => defaultInputsFor(TOPICS[0]));
  const [outputLines, setOutputLines] = useState([]);
  const [ran, setRan] = useState(false);
  const canvasRef = useRef(null);

  const topic = TOPICS.find((t) => t.id === topicId);

  // Change topic and reset inputs/output together
  const handleTopicChange = (newId) => {
    const newTopic = TOPICS.find((t) => t.id === newId);
    setTopicId(newId);
    setInputs(defaultInputsFor(newTopic));
    setOutputLines([]);
    setRan(false);
  };

  const handleChange = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const runProgram = () => {
    const lines = topic.prompts.map(
      (p) => `${p.text}${inputs[p.key] ?? ""}`
    );
    setOutputLines(lines);
    setRan(true);
  };

  // Draw on canvas when ran
  useEffect(() => {
    if (!ran) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    ctx.fillStyle = "#000033";
    ctx.fillRect(0, 0, W, H);
    topic.render(ctx, inputs, W, H);
  }, [ran, topic, inputs]);

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 font-mono p-4">
      {/* Title bar */}
      <div className="bg-blue-900 border border-gray-500 rounded-t-md px-4 py-2 flex items-center gap-3 mb-0">
        <span className="text-white font-bold text-sm">
          Turbo C++ 3.0 ─ Computer Graphics Simulator
        </span>
      </div>

      <div className="border border-gray-600 rounded-b-md bg-black p-4 mb-4">
        {/* Topic selector */}
        <div className="mb-3">
          <span className="text-yellow-300">Topic: </span>
          <select
            className="bg-black text-green-300 border border-green-700 rounded px-2 py-1 text-sm w-full sm:w-auto"
            value={topicId}
            onChange={(e) => handleTopicChange(e.target.value)}
          >
            {TOPICS.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Input prompts */}
        <div className="mb-4 space-y-2">
          {topic.prompts.map((p) => (
            <div key={p.key} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span className="text-cyan-400 text-sm min-w-max">{p.label}</span>
              <input
                type="number"
                className="bg-black text-green-300 border border-green-800 rounded px-2 py-0.5 text-sm w-28 focus:outline-none focus:border-green-400"
                value={inputs[p.key] ?? p.placeholder}
                onChange={(e) => handleChange(p.key, e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Run button */}
        <button
          className="bg-blue-800 hover:bg-blue-600 border border-blue-400 text-white px-6 py-1.5 rounded text-sm font-bold transition"
          onClick={runProgram}
        >
          ▶ Run (F9)
        </button>

        {/* Terminal output echo */}
        {outputLines.length > 0 && (
          <div className="mt-4 bg-black border border-gray-700 rounded p-3 text-sm leading-relaxed">
            <div className="text-gray-500 mb-1 text-xs">─── Program Output ───</div>
            {outputLines.map((line, i) => (
              <div key={i} className="text-green-300">{line}</div>
            ))}
            <div className="text-gray-500 mt-2 text-xs">─── Graphics window below ───</div>
          </div>
        )}
      </div>

      {/* Graphics canvas — mimics TurboC3 BGI window */}
      <div className="border-2 border-gray-600 rounded bg-black">
        <div className="bg-gray-800 text-gray-300 text-xs px-3 py-1 border-b border-gray-600">
          BGI Graphics Output – 640×400
        </div>
        <canvas
          ref={canvasRef}
          width={640}
          height={400}
          className="block w-full"
          style={{ background: "#000033", imageRendering: "pixelated" }}
        />
      </div>

      <div className="mt-2 text-gray-600 text-xs text-right">
        Press <span className="text-gray-400">▶ Run</span> to execute the program.
      </div>
    </div>
  );
};

export default TurboC3Simulator;
