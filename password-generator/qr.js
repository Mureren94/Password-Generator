var QR = (function() {
  var gf = { exp: new Array(512), log: new Array(256) };
  for (var i = 0, x = 1; i < 255; i++) { gf.exp[i] = x; gf.log[x] = i; x = (x << 1) ^ (x & 0x80 ? 0x11d : 0); }
  for (var i = 255; i < 512; i++) gf.exp[i] = gf.exp[i - 255];
  function gfMul(a, b) { if (a === 0 || b === 0) return 0; return gf.exp[gf.log[a] + gf.log[b]]; }
  function genPoly(deg) { var p = [1]; for (var i = 0; i < deg; i++) { p.push(0); for (var j = p.length - 1; j > 0; j--) p[j] = p[j - 1] ^ gfMul(p[j], gf.exp[i]); p[0] = gfMul(p[0], gf.exp[i]); } return p; }
  var EC_BLOCKS = {1:{M:[16,10,0]},2:{M:[28,16,0]},3:{M:[44,26,0]},4:{M:[64,36,0]},5:{M:[86,48,0]},6:{M:[108,64,0]}};
  var ALIGN = {1:[],2:[6,18],3:[6,22],4:[6,26],5:[6,30],6:[6,34]};
  function getVersion(dataLen) { for (var v = 1; v <= 6; v++) { if (dataLen <= EC_BLOCKS[v].M[0]) return v; } return 6; }
  function encode(data) {
    var bytes = []; for (var i = 0; i < data.length; i++) bytes.push(data.charCodeAt(i) & 0xff);
    var ver = getVersion(bytes.length);
    var cap = EC_BLOCKS[ver].M;
    var total = cap[0], ecWords = cap[1], dataWords = total - ecWords;
    var bits = []; bits.push(0,1,0,0); var len = bytes.length; for (var i = 7; i >= 0; i--) bits.push((len >> i) & 1);
    for (var i = 0; i < bytes.length; i++) for (var j = 7; j >= 0; j--) bits.push((bytes[i] >> j) & 1);
    bits.push(0,0,0,0); while (bits.length % 8 !== 0) bits.push(0);
    var pad = [0xec,0x11]; var pi = 0; while (bits.length / 8 < total) { for (var j = 7; j >= 0; j--) bits.push((pad[pi] >> j) & 1); pi = (pi + 1) % 2; }
    var msg = []; for (var i = 0; i < bits.length; i += 8) { var b = 0; for (var j = 0; j < 8; j++) b = (b << 1) | bits[i + j]; msg.push(b); }
    var gp = genPoly(ecWords);
    var ec = new Array(ecWords).fill(0);
    for (var i = 0; i < msg.length; i++) { var fb = msg[i] ^ ec[0]; ec.shift(); ec.push(0); if (fb !== 0) for (var j = 0; j < ec.length; j++) ec[j] ^= gfMul(gp[j], fb); }
    return { version: ver, codewords: msg.concat(ec), size: ver * 4 + 17 };
  }
  function makeMatrix(size) { var m = []; for (var i = 0; i < size; i++) { m[i] = []; for (var j = 0; j < size; j++) m[i][j] = -1; } return m; }
  function placeFinder(m, r, c) { for (var i = -1; i <= 7; i++) for (var j = -1; j <= 7; j++) { if (r + i < 0 || c + j < 0 || r + i >= m.length || c + j >= m.length) continue; m[r + i][c + j] = (i >= 0 && i <= 6 && j >= 0 && j <= 6 && (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4))) ? 1 : 0; } }
  function placeAlign(m, r, c) { for (var i = -2; i <= 2; i++) for (var j = -2; j <= 2; j++) { if (r + i < 0 || c + j < 0 || r + i >= m.length || c + j >= m.length) continue; m[r + i][c + j] = (i === -2 || i === 2 || j === -2 || j === 2 || (i === 0 && j === 0)) ? 1 : 0; } }
  function generate(data) {
    var enc = encode(data);
    var size = enc.size, ver = enc.version;
    var m = makeMatrix(size);
    placeFinder(m, 0, 0); placeFinder(m, 0, size - 7); placeFinder(m, size - 7, 0);
    var aligns = ALIGN[ver];
    for (var ai = 0; ai < aligns.length; ai++) for (var aj = 0; aj < aligns.length; aj++) {
      var ar = aligns[ai], ac = aligns[aj];
      if (!((ar === 6 && ac === 6) || (ar === 6 && ac === size - 7) || (ar === size - 7 && ac === 6))) placeAlign(m, ar, ac);
    }
    for (var i = 8; i < size - 8; i++) m[i][6] = m[6][i] = (i % 2 === 0) ? 1 : 0;
    m[size - 8][8] = 1;
    var bits = []; for (var i = 0; i < enc.codewords.length; i++) for (var j = 7; j >= 0; j--) bits.push((enc.codewords[i] >> j) & 1);
    var bi = 0, up = true;
    for (var col = size - 1; col >= 0; col -= 2) {
      if (col === 6) col = 5;
      for (var row = up ? size - 1 : 0; up ? row >= 0 : row < size; row += up ? -1 : 1) {
        for (var k = 0; k < 2; k++) {
          var c = col - k;
          if (c < 0 || row < 0 || row >= size) continue;
          if (m[row][c] === -1) { m[row][c] = bi < bits.length ? bits[bi] : 0; bi++; }
        }
      }
      up = !up;
    }
    var masks = [function(r,c){return(r+c)%2===0;},function(r,c){return r%2===0;},function(r,c){return c%3===0;},function(r,c){return(r+c)%3===0;},function(r,c){return(Math.floor(r/2)+Math.floor(c/3))%2===0;},function(r,c){return((r*c)%2)+((r*c)%3)===0;},function(r,c){return(((r*c)%2)+((r*c)%3))%2===0;},function(r,c){return(((r+c)%2)+((r*c)%3))%2===0;}];
    var bestMask = 0, bestScore = Infinity;
    for (var mi = 0; mi < 8; mi++) {
      var test = []; for (var r = 0; r < size; r++) { test[r] = []; for (var c = 0; c < size; c++) test[r][c] = m[r][c]; }
      for (var r = 0; r < size; r++) for (var c = 0; c < size; c++) if (test[r][c] >= 0) test[r][c] = test[r][c] ^ (masks[mi](r, c) ? 1 : 0);
      var score = 0;
      for (var r = 0; r < size; r++) { var run = 0; for (var c = 0; c < size; c++) { if (test[r][c] === 1) run++; else { if (run >= 5) score += 3 + (run - 5); run = 0; } } if (run >= 5) score += 3 + (run - 5); }
      for (var c = 0; c < size; c++) { var run = 0; for (var r = 0; r < size; r++) { if (test[r][c] === 1) run++; else { if (run >= 5) score += 3 + (run - 5); run = 0; } } if (run >= 5) score += 3 + (run - 5); }
      for (var r = 0; r < size - 1; r++) for (var c = 0; c < size - 1; c++) { var b1 = test[r][c], b2 = test[r][c+1], b3 = test[r+1][c], b4 = test[r+1][c+1]; if (b1 === b2 && b2 === b3 && b3 === b4) score += 3; }
      for (var r = 0; r < size; r++) for (var c = 0; c < size - 10; c++) { var pat = true; for (var k = 0; k < 11; k++) if (test[r][c+k] !== [1,0,1,1,1,0,1,0,0,0,0][k]) { pat = false; break; } if (pat) score += 40; }
      for (var c = 0; c < size; c++) for (var r = 0; r < size - 10; r++) { var pat = true; for (var k = 0; k < 11; k++) if (test[r+k][c] !== [1,0,1,1,1,0,1,0,0,0,0][k]) { pat = false; break; } if (pat) score += 40; }
      var dark = 0; for (var r = 0; r < size; r++) for (var c = 0; c < size; c++) if (test[r][c] === 1) dark++;
      var pct = dark / (size * size) * 100;
      score += Math.abs(Math.floor(pct / 5) - 10) * 10;
      if (score < bestScore) { bestScore = score; bestMask = mi; }
    }
    for (var r = 0; r < size; r++) for (var c = 0; c < size; c++) if (m[r][c] >= 0) m[r][c] = m[r][c] ^ (masks[bestMask](r, c) ? 1 : 0);
    var fmt = (1 << 14) | (bestMask << 13);
    var fmtBits = []; for (var i = 14; i >= 0; i--) fmtBits.push((fmt >> i) & 1);
    var fmtPoly = [1,0,1,0,0,1,1,0,1,1,1];
    var fmtEc = fmtBits.slice();
    for (var i = 0; i <= 14 - 10; i++) { if (fmtEc[i] === 1) for (var j = 0; j < 11; j++) fmtEc[i + j] ^= fmtPoly[j]; }
    var finalFmt = fmtBits.slice(0, 5).concat(fmtEc.slice(5, 15));
    var fmtPos = [[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,7],[8,8],[7,8],[5,8],[4,8],[3,8],[2,8],[1,8],[0,8]];
    for (var i = 0; i < 15; i++) { var r = fmtPos[i][0], c = fmtPos[i][1]; m[r][c] = finalFmt[i]; }
    var fmtPos2 = [[size-1,8],[size-2,8],[size-3,8],[size-4,8],[size-5,8],[size-6,8],[size-7,8],[size-8,8],[8,size-8],[8,size-7],[8,size-6],[8,size-5],[8,size-4],[8,size-3],[8,size-2]];
    for (var i = 0; i < 15; i++) { var r = fmtPos2[i][0], c = fmtPos2[i][1]; m[r][c] = finalFmt[i]; }
    return { matrix: m, size: size };
  }
  function toSVG(matrix, size, moduleSize, margin) {
    moduleSize = moduleSize || 4; margin = margin || 2;
    var total = (size + 2 * margin) * moduleSize;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + total + '" height="' + total + '" viewBox="0 0 ' + total + ' ' + total + '"><rect width="' + total + '" height="' + total + '" fill="#fff"/>';
    for (var r = 0; r < size; r++) {
      for (var c = 0; c < size; c++) {
        if (matrix[r][c] === 1) {
          var x = (c + margin) * moduleSize, y = (r + margin) * moduleSize;
          svg += '<rect x="' + x + '" y="' + y + '" width="' + moduleSize + '" height="' + moduleSize + '" fill="#000"/>';
        }
      }
    }
    svg += '</svg>';
    return svg;
  }
  function svgToPngDataUrl(svgString, width, height, callback) {
    var canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    var ctx = canvas.getContext('2d');
    var img = new Image();
    img.onload = function() { ctx.drawImage(img, 0, 0); callback(canvas.toDataURL('image/png')); };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
  }
  function downloadBlob(content, filename, mime) {
    var blob = new Blob([content], { type: mime });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  function downloadSVG(svgString, filename) { downloadBlob(svgString, filename, 'image/svg+xml'); }
  function downloadPNG(svgString, filename) {
    var total = 200;
    svgToPngDataUrl(svgString, total, total, function(dataUrl) {
      var a = document.createElement('a');
      a.href = dataUrl; a.download = filename;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a);
    });
  }
  function downloadPDF(svgString, filename) {
    var total = 200;
    svgToPngDataUrl(svgString, total, total, function(dataUrl) {
      var pngData = dataUrl.split(',')[1];
      var pdf = '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 ' + total + ' ' + total + ']\n/Contents 4 0 R\n/Resources << /XObject << /Img 5 0 R >> >>\n>>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nq\n' + total + ' 0 0 ' + total + ' 0 0 cm\n/Img Do\nQ\nendstream\nendobj\n5 0 obj\n<<\n/Type /XObject\n/Subtype /Image\n/Width ' + total + '\n/Height ' + total + '\n/ColorSpace /DeviceRGB\n/BitsPerComponent 8\n/Filter /DCTDecode\n/Length ' + pngData.length + '\n>>\nstream\n' + pngData + '\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000266 00000 n \n0000000360 00000 n \ntrailer\n<<\n/Size 6\n/Root 1 0 R\n>>\nstartxref\n' + (500 + pngData.length) + '\n%%EOF';
      downloadBlob(pdf, filename, 'application/pdf');
    });
  }
  return { generate: generate, toSVG: toSVG, downloadSVG: downloadSVG, downloadPNG: downloadPNG, downloadPDF: downloadPDF };
})();