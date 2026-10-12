import type { Orientation, TarotCard } from "../data/cards";

export interface ExportCard {
  card: TarotCard;
  orientation: Orientation;
  label: string;
}

function loadCardImage(card: TarotCard): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = `/cards/${card.index}.jpg`;
  });
}

const PAPER = "#f7f5f0";
const INK = "#1b1a17";
const FAINT = "#817a70";
const LINE = "rgba(27, 26, 23, 0.16)";

export async function renderReadingImage(cards: ExportCard[], seed: string, createdAt: string): Promise<Blob> {
  const cardW = 300;
  const cardH = 450;
  const gap = 48;
  const marginX = 80;
  const topMargin = 110;
  const labelHeight = 70;
  const bottomMargin = 90;

  const width = cards.length * cardW + (cards.length - 1) * gap + marginX * 2;
  const height = topMargin + cardH + labelHeight + bottomMargin;

  const canvas = document.createElement("canvas");
  const scale = 2;
  canvas.width = width * scale;
  canvas.height = height * scale;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);

  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = INK;
  ctx.font = "500 22px Georgia, 'Times New Roman', serif";
  ctx.textAlign = "center";
  ctx.fillText("A Tarot Reading", width / 2, 52);

  ctx.fillStyle = FAINT;
  ctx.font = "13px Georgia, serif";
  const dateLabel = new Date(createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  ctx.fillText(dateLabel, width / 2, 76);

  const images = await Promise.all(cards.map((c) => loadCardImage(c.card)));

  cards.forEach((c, i) => {
    const x = marginX + i * (cardW + gap);
    const y = topMargin;
    const cx = x + cardW / 2;
    const cy = y + cardH / 2;

    const img = images[i];
    const fitScale = Math.min(cardW / img.width, cardH / img.height);
    const drawW = img.width * fitScale;
    const drawH = img.height * fitScale;

    ctx.fillStyle = PAPER;
    ctx.fillRect(x, y, cardW, cardH);

    ctx.save();
    ctx.translate(cx, cy);
    if (c.orientation === "reversed") ctx.rotate(Math.PI);
    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    ctx.strokeStyle = LINE;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, cardW, cardH);

    ctx.fillStyle = FAINT;
    ctx.font = "600 12px -apple-system, Segoe UI, sans-serif";
    ctx.textAlign = "center";
    wrapText(ctx, c.label.toUpperCase(), cx, y + cardH + 30, cardW + 20, 16);
  });

  ctx.fillStyle = FAINT;
  ctx.font = "13px 'SF Mono', Consolas, monospace";
  ctx.textAlign = "center";
  ctx.fillText(seed, width / 2, height - 40);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to render image"));
    }, "image/png");
  });
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(" ");
  let line = "";
  let lines: string[] = [];
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  lines = lines.slice(0, 2);
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((l, i) => ctx.fillText(l, x, startY + i * lineHeight));
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
