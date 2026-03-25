const { createCanvas, loadImage } = require('canvas');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const W = 1200;
const H = 630;

const cards = [
  {
    file: 'og-main.png',
    title: 'かぶていログ',
    subtitle: '株式投資・仮想通貨の情報ブログ',
    grad: ['#0f1923', '#162a3e', '#1a3550'],
  },
  {
    file: 'og-sofi.png',
    title: 'SoFi 完全解説',
    subtitle: 'フィンテック革命を牽引する注目企業',
    grad: ['#0f1923', '#162a3e', '#1a3a5c'],
    tag: '株式投資',
    tagColor: '#2d6a4f',
  },
  {
    file: 'og-exchange.png',
    title: '海外仮想通貨取引所3選',
    subtitle: 'Binance・MEXC・Bitget を徹底比較',
    grad: ['#0f1923', '#1a3050', '#2a4a6a'],
    tag: '取引所比較',
    tagColor: '#3a5a8c',
  },
  {
    file: 'og-books.png',
    title: 'おすすめ書籍2選',
    subtitle: '投資力と生成AI活用力を高める',
    grad: ['#1a1028', '#2d1b3d', '#4a2d5c'],
    tag: 'おすすめ本',
    tagColor: '#7c5c8a',
  },
  {
    file: 'og-crypto.png',
    title: '仮想通貨',
    subtitle: '取引所比較・アルトコイン情報',
    grad: ['#1a1a0e', '#1e2a1a', '#2a3a2a'],
    tag: '仮想通貨',
    tagColor: '#b08d2a',
  },
  {
    file: 'og-about.png',
    title: 'かぶてい',
    subtitle: '高校生から投資を始めた投資歴8年のブログ',
    grad: ['#0f1923', '#1a2a3e', '#2a3a4e'],
    tag: 'プロフィール',
    tagColor: '#c45d3e',
  },
  {
    file: 'og-buying-dips.png',
    title: '買い増しと余剰資金',
    subtitle: '暴落をチャンスに変える方法',
    grad: ['#0f1a15', '#1a2e24', '#2d4a3f'],
    tag: '株式投資',
    tagColor: '#2d6a4f',
  },
  {
    file: 'og-xr-vr-ar.png',
    title: 'XR/VR/AR市場のすべて',
    subtitle: '初心者でもわかる業界の全体像',
    grad: ['#1a1028', '#2a1540', '#3a0ca3'],
    tag: '株式投資',
    tagColor: '#2d6a4f',
  },
  {
    file: 'og-stocks.png',
    title: '株式投資の記事一覧',
    subtitle: '注目銘柄の分析・投資戦略',
    grad: ['#0f1a15', '#1a2e24', '#2d4a3f'],
  },
];

async function generateCard(card, iconImg) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, card.grad[0]);
  grad.addColorStop(0.5, card.grad[1]);
  grad.addColorStop(1, card.grad[2]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Subtle grid
  ctx.strokeStyle = 'rgba(255,255,255,0.03)';
  ctx.lineWidth = 1;
  for (let i = 0; i < W; i += 80) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke();
  }
  for (let j = 0; j < H; j += 80) {
    ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(W, j); ctx.stroke();
  }

  // Glow circle behind icon
  const glowGrad = ctx.createRadialGradient(160, H / 2, 0, 160, H / 2, 250);
  glowGrad.addColorStop(0, 'rgba(196,93,62,0.15)');
  glowGrad.addColorStop(1, 'rgba(196,93,62,0)');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, W, H);

  // Bottom accent bar
  ctx.fillStyle = '#c45d3e';
  ctx.fillRect(0, H - 5, W, 5);

  // Left accent bar
  ctx.fillStyle = '#c45d3e';
  ctx.fillRect(0, 0, 5, H);

  // Icon
  const iconSize = 120;
  const iconX = 80;
  const iconY = H / 2 - iconSize / 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(iconX + iconSize / 2, iconY + iconSize / 2, iconSize / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(iconImg, iconX, iconY, iconSize, iconSize);
  ctx.restore();

  // Icon border
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(iconX + iconSize / 2, iconY + iconSize / 2, iconSize / 2, 0, Math.PI * 2);
  ctx.stroke();

  const textX = iconX + iconSize + 50;
  let titleY = H / 2;

  // Tag
  if (card.tag) {
    const tagY = titleY - 70;
    ctx.font = 'bold 18px sans-serif';
    const tagW = ctx.measureText(card.tag).width + 28;
    // Tag background
    ctx.fillStyle = card.tagColor || '#c45d3e';
    ctx.beginPath();
    const r = 4;
    ctx.moveTo(textX + r, tagY);
    ctx.lineTo(textX + tagW - r, tagY);
    ctx.quadraticCurveTo(textX + tagW, tagY, textX + tagW, tagY + r);
    ctx.lineTo(textX + tagW, tagY + 28 - r);
    ctx.quadraticCurveTo(textX + tagW, tagY + 28, textX + tagW - r, tagY + 28);
    ctx.lineTo(textX + r, tagY + 28);
    ctx.quadraticCurveTo(textX, tagY + 28, textX, tagY + 28 - r);
    ctx.lineTo(textX, tagY + r);
    ctx.quadraticCurveTo(textX, tagY, textX + r, tagY);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillText(card.tag, textX + 14, tagY + 20);
  }

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText(card.title, textX, titleY - 10);

  // Subtitle
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = '26px sans-serif';
  ctx.fillText(card.subtitle, textX, titleY + 40);

  // Site URL bottom right
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '18px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('kabutei-blog.vercel.app', W - 40, H - 28);
  ctx.textAlign = 'left';

  // Site name bottom left
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('かぶていログ', 20, H - 28);

  // Save
  const outDir = path.join(__dirname, '..', 'images');
  const outPath = path.join(outDir, card.file);
  const buf = canvas.toBuffer('image/png');
  fs.writeFileSync(outPath, buf);
  console.log('OK: ' + card.file);
}

async function main() {
  const iconPath = path.join(__dirname, '..', 'images', 'profile-icon.webp');
  const iconBuf = fs.readFileSync(iconPath);
  const pngBuf = await sharp(iconBuf).png().toBuffer();
  const iconImg = await loadImage(pngBuf);

  for (const card of cards) {
    await generateCard(card, iconImg);
  }
  console.log('\nDone! OG images saved to images/');
}

main().catch(console.error);
