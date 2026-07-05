// make_zip.js
// Creates a proper Linux-compatible zip file for AWS Elastic Beanstalk

const fs = require('fs');
const path = require('path');

// Use Node's built-in zlib + manual zip construction
// We'll use the 'archiver' package approach via a simple zip format

function readDirRecursive(dirPath, baseZipPath, fileList) {
  const entries = fs.readdirSync(dirPath);
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry);
    // Always use forward slashes for zip paths
    const zipPath = baseZipPath ? baseZipPath + '/' + entry : entry;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      readDirRecursive(fullPath, zipPath, fileList);
    } else {
      fileList.push({ fullPath, zipPath });
    }
  }
}

// Collect all files
const base = 'server';
const items = ['server.js', 'package.json', 'package-lock.json', 'models', 'routes', 'public'];
const fileList = [];

for (const item of items) {
  const fullPath = path.join(base, item);
  const stat = fs.statSync(fullPath);
  if (stat.isDirectory()) {
    readDirRecursive(fullPath, item, fileList);
  } else {
    fileList.push({ fullPath, zipPath: item });
  }
}

console.log('Files to zip:');
fileList.forEach(f => console.log(' ', f.zipPath));

// Build a ZIP file manually using the ZIP spec
// ZIP uses forward slashes in the spec
const { deflateRawSync } = require('zlib');

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  const table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

const localHeaders = [];
const centralHeaders = [];
let offset = 0;

const parts = [];

for (const { fullPath, zipPath } of fileList) {
  const data = fs.readFileSync(fullPath);
  const compressed = deflateRawSync(data, { level: 6 });
  const crc = crc32(data);
  const nameBytes = Buffer.from(zipPath, 'utf8'); // forward slashes preserved

  const localHeader = Buffer.alloc(30 + nameBytes.length);
  localHeader.writeUInt32LE(0x04034b50, 0); // signature
  localHeader.writeUInt16LE(20, 4); // version needed
  localHeader.writeUInt16LE(0, 6); // flags
  localHeader.writeUInt16LE(8, 8); // compression: deflate
  localHeader.writeUInt16LE(0, 10); // mod time
  localHeader.writeUInt16LE(0, 12); // mod date
  localHeader.writeUInt32LE(crc, 14); // crc32
  localHeader.writeUInt32LE(compressed.length, 18); // compressed size
  localHeader.writeUInt32LE(data.length, 22); // uncompressed size
  localHeader.writeUInt16LE(nameBytes.length, 26); // name length
  localHeader.writeUInt16LE(0, 28); // extra length
  nameBytes.copy(localHeader, 30);

  const centralHeader = Buffer.alloc(46 + nameBytes.length);
  centralHeader.writeUInt32LE(0x02014b50, 0); // signature
  centralHeader.writeUInt16LE(20, 4); // version made by
  centralHeader.writeUInt16LE(20, 6); // version needed
  centralHeader.writeUInt16LE(0, 8); // flags
  centralHeader.writeUInt16LE(8, 10); // compression
  centralHeader.writeUInt16LE(0, 12); // mod time
  centralHeader.writeUInt16LE(0, 14); // mod date
  centralHeader.writeUInt32LE(crc, 16); // crc32
  centralHeader.writeUInt32LE(compressed.length, 20); // compressed size
  centralHeader.writeUInt32LE(data.length, 24); // uncompressed size
  centralHeader.writeUInt16LE(nameBytes.length, 28); // name length
  centralHeader.writeUInt16LE(0, 30); // extra length
  centralHeader.writeUInt16LE(0, 32); // comment length
  centralHeader.writeUInt16LE(0, 34); // disk start
  centralHeader.writeUInt16LE(0, 36); // int attr
  centralHeader.writeUInt32LE(0, 38); // ext attr
  centralHeader.writeUInt32LE(offset, 42); // local header offset
  nameBytes.copy(centralHeader, 46);

  parts.push(localHeader, compressed);
  centralHeaders.push(centralHeader);
  offset += localHeader.length + compressed.length;
}

const centralDir = Buffer.concat(centralHeaders);
const endRecord = Buffer.alloc(22);
endRecord.writeUInt32LE(0x06054b50, 0); // signature
endRecord.writeUInt16LE(0, 4); // disk number
endRecord.writeUInt16LE(0, 6); // disk with central dir
endRecord.writeUInt16LE(fileList.length, 8); // entries on disk
endRecord.writeUInt16LE(fileList.length, 10); // total entries
endRecord.writeUInt32LE(centralDir.length, 12); // central dir size
endRecord.writeUInt32LE(offset, 16); // central dir offset
endRecord.writeUInt16LE(0, 20); // comment length

const zipBuffer = Buffer.concat([...parts, centralDir, endRecord]);
fs.writeFileSync('server-deploy.zip', zipBuffer);
console.log('ZIP created successfully! Size:', zipBuffer.length, 'bytes');
