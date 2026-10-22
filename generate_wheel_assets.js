const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const srcPath = path.join(__dirname, 'assets', 'ae86_cruising_clean.png');
const buf = fs.readFileSync(srcPath);

let offset = 8;
const idatChunks = [];
let width = 0, height = 0;
while (offset < buf.length) {
    const len = buf.readUInt32BE(offset);
    const type = buf.toString('ascii', offset + 4, offset + 8);
    if (type === 'IHDR') {
        width = buf.readUInt32BE(offset + 8);
        height = buf.readUInt32BE(offset + 12);
    } else if (type === 'IDAT') idatChunks.push(buf.slice(offset + 8, offset + 8 + len));
    offset += 12 + len;
}
const idat = Buffer.concat(idatChunks);
const raw = zlib.inflateSync(idat);
const stride = 1 + width * 4;
const pixels = Buffer.alloc(width * height * 4);
function paeth(a, b, c) {
    const p = a + b - c;
    const pa = Math.abs(p - a);
    const pb = Math.abs(p - b);
    const pc = Math.abs(p - c);
    if (pa <= pb && pa <= pc) return a;
    if (pb <= pc) return b;
    return c;
}
for (let y = 0; y < height; y++) {
    const filter = raw[y * stride];
    const rowOffset = y * stride + 1;
    for (let x = 0; x < width; x++) {
        const pxOffset = (y * width + x) * 4;
        for (let c = 0; c < 4; c++) {
            const rawByte = raw[rowOffset + x * 4 + c];
            const a = x > 0 ? pixels[pxOffset - 4 + c] : 0;
            const b = y > 0 ? pixels[pxOffset - width * 4 + c] : 0;
            const cVal = (x > 0 && y > 0) ? pixels[pxOffset - width * 4 - 4 + c] : 0;
            let val = rawByte;
            if (filter === 1) val = (rawByte + a) & 0xff;
            else if (filter === 2) val = (rawByte + b) & 0xff;
            else if (filter === 3) val = (rawByte + Math.floor((a + b) / 2)) & 0xff;
            else if (filter === 4) val = (rawByte + paeth(a, b, cVal)) & 0xff;
            pixels[pxOffset + c] = val;
        }
    }
}

function makePng(w, h, rgba) {
    const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(w, 0);
    ihdr.writeUInt32BE(h, 4);
    ihdr[8] = 8;
    ihdr[9] = 6;
    ihdr[10] = 0;
    ihdr[11] = 0;
    ihdr[12] = 0;
    function chunk(type, data) {
        const len = Buffer.alloc(4);
        len.writeUInt32BE(data.length, 0);
        const typeB = Buffer.from(type, 'ascii');
        const crcB = Buffer.alloc(4);
        const crcVal = crc32(Buffer.concat([typeB, data]));
        crcB.writeUInt32BE(crcVal >>> 0, 0);
        return Buffer.concat([len, typeB, data, crcB]);
    }
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
        let c = i;
        for (let k = 0; k < 8; k++) c = ((c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1));
        table[i] = c;
    }
    function crc32(buf) {
        let c = 0xffffffff;
        for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
        return c ^ 0xffffffff;
    }
    const scanline = 1 + w * 4;
    const rawData = Buffer.alloc(h * scanline);
    for (let y = 0; y < h; y++) {
        rawData[y * scanline] = 0;
        rgba.copy(rawData, y * scanline + 1, y * w * 4, (y + 1) * w * 4);
    }
    const compressed = zlib.deflateSync(rawData, { level: 9 });
    return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', compressed), chunk('IEND', Buffer.alloc(0))]);
}

// True geometric axle centers:
// Rear:  cx = 232, cy = 267
// Front: cx = 865, cy = 267
const REAR_CX = 232, REAR_CY = 267;
const FRONT_CX = 865, FRONT_CY = 267;
const RADIUS = 66; // 133x133 circle covering the entire tire & rim

// 1. Crop perfectly centered circular wheels
function cropCircular(cx, cy, radius) {
    const size = radius * 2 + 1;
    const cropBuf = Buffer.alloc(size * size * 4);
    for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
            const destX = dx + radius;
            const destY = dy + radius;
            const destIdx = (destY * size + destX) * 4;
            const srcX = Math.round(cx + dx);
            const srcY = Math.round(cy + dy);
            const dist = Math.hypot(dx, dy);
            if (dist <= radius && srcX >= 0 && srcX < width && srcY >= 0 && srcY < height) {
                const srcIdx = (srcY * width + srcX) * 4;
                cropBuf[destIdx] = pixels[srcIdx];
                cropBuf[destIdx + 1] = pixels[srcIdx + 1];
                cropBuf[destIdx + 2] = pixels[srcIdx + 2];
                cropBuf[destIdx + 3] = pixels[srcIdx + 3];
            } else {
                cropBuf[destIdx + 3] = 0;
            }
        }
    }
    return makePng(size, size, cropBuf);
}

// 2. Clear wheel wells in body (fill with dark wheel well interior)
const bodyPixels = Buffer.from(pixels);
function clearWheel(cx, cy, radius) {
    for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
            const dist = Math.hypot(dx, dy);
            if (dist <= radius) {
                const x = Math.round(cx + dx);
                const y = Math.round(cy + dy);
                if (x >= 0 && x < width && y >= 0 && y < height) {
                    const idx = (y * width + x) * 4;
                    bodyPixels[idx] = 18;
                    bodyPixels[idx + 1] = 18;
                    bodyPixels[idx + 2] = 22;
                    bodyPixels[idx + 3] = 255;
                }
            }
        }
    }
}

clearWheel(REAR_CX, REAR_CY, RADIUS - 1);
clearWheel(FRONT_CX, FRONT_CY, RADIUS - 1);

const bodyPng = makePng(width, height, bodyPixels);
const rearWheelPng = cropCircular(REAR_CX, REAR_CY, RADIUS);
const frontWheelPng = cropCircular(FRONT_CX, FRONT_CY, RADIUS);

fs.writeFileSync(path.join(__dirname, 'assets', 'ae86_cruising_body.png'), bodyPng);
fs.writeFileSync(path.join(__dirname, 'assets', 'ae86_wheel_rear.png'), rearWheelPng);
fs.writeFileSync(path.join(__dirname, 'assets', 'ae86_wheel_front.png'), frontWheelPng);

console.log('Regenerated concentric wheel assets:');
console.log(`- Rear wheel center: (${REAR_CX}, ${REAR_CY}), size: ${RADIUS*2+1}x${RADIUS*2+1}`);
console.log(`- Front wheel center: (${FRONT_CX}, ${FRONT_CY}), size: ${RADIUS*2+1}x${RADIUS*2+1}`);
