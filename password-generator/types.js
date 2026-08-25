var TYPES = {
  alfanumerisk: {
    id: 'alfanumerisk', nameKey: 'typeAlfanumerisk', icon: '\uD83D\uDD24', categoryKey: 'catUserPasswords', popupKey: 'popupAlfanumerisk',
    settings: [
      { key: 'length', labelKey: 'labelLength', type: 'number', min: 8, max: 128, default: 16 },
      { key: 'specialChars', labelKey: 'labelSpecialChars', type: 'toggle', default: true },
      { key: 'dockerSafe', labelKey: 'labelDockerSafe', type: 'toggle', default: false }
    ],
    generate: function(s) {
      var len = s.length || 16; var upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; var lower = 'abcdefghijklmnopqrstuvwxyz'; var digits = '0123456789';
      var special = '!@#$%^&*()_+-=[]{}|;:,.<>?'; var dockerSafeSpecial = '-_./+@%^~';
      var charset = upper + lower + digits;
      if (s.specialChars) charset += s.dockerSafe ? dockerSafeSpecial : special;
      var arr = new Uint32Array(len); crypto.getRandomValues(arr);
      var result = ''; for (var i = 0; i < len; i++) result += charset[arr[i] % charset.length];
      return [result];
    }
  },
  passphrase: {
    id: 'passphrase', nameKey: 'typePassphrase', icon: '\uD83D\uDCDD', categoryKey: 'catUserPasswords', popupKey: 'popupPassphrase',
    settings: [
      { key: 'wordCount', labelKey: 'labelWordCount', type: 'number', min: 3, max: 12, default: 5 },
      { key: 'separator', labelKey: 'labelSeparator', type: 'select', options: ['-', '.', '_', ' '], default: '-' },
      { key: 'language', labelKey: 'labelWordlist', type: 'select', options: ['optDanish', 'optEnglish', 'optCustom'], default: 'optDanish' }
    ],
    generate: function(s) {
      var count = s.wordCount || 5; var sep = s.separator || '-';
      var list;
      if (s.language === 'optCustom' && state.customWordlist) list = state.customWordlist;
      else if (s.language === 'optEnglish') list = WORDLIST_EN;
      else list = WORDLIST_DA;
      var arr = new Uint32Array(count); crypto.getRandomValues(arr);
      var words = []; for (var i = 0; i < count; i++) words.push(list[arr[i] % list.length]);
      return [words.join(sep)];
    }
  },
  pinkode: {
    id: 'pinkode', nameKey: 'typePinkode', icon: '\uD83D\uDD22', categoryKey: 'catUserPasswords', popupKey: 'popupPinkode',
    settings: [{ key: 'length', labelKey: 'labelLength', type: 'number', min: 4, max: 8, default: 4 }],
    generate: function(s) { var len = s.length || 4; var arr = new Uint32Array(len); crypto.getRandomValues(arr); var result = ''; for (var i = 0; i < len; i++) result += String(arr[i] % 10); return [result]; }
  },
  udtalevenligt: {
    id: 'udtalevenligt', nameKey: 'typeUdtalevenligt', icon: '\uD83D\uDDE3\uFE0F', categoryKey: 'catUserPasswords', popupKey: 'popupUdtalevenligt',
    settings: [{ key: 'syllables', labelKey: 'labelSyllables', type: 'number', min: 3, max: 8, default: 5 }],
    generate: function(s) { var count = s.syllables || 5; var cons = 'bcdfghjklmnpqrstvwxyz'; var vows = 'aeiouy'; var arr = new Uint32Array(count * 2); crypto.getRandomValues(arr); var result = ''; for (var i = 0; i < count; i++) { result += cons[arr[i * 2] % cons.length]; result += vows[arr[i * 2 + 1] % vows.length]; } return [result]; }
  },
  otp: {
    id: 'otp', nameKey: 'typeOtp', icon: '\u23F1\uFE0F', categoryKey: 'catUserPasswords', popupKey: 'popupOtp',
    settings: [{ key: 'length', labelKey: 'labelLength', type: 'select', options: ['16', '32'], default: '32' }],
    generate: function(s) { var len = parseInt(s.length || '32'); var base32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'; var arr = new Uint8Array(len); crypto.getRandomValues(arr); var result = ''; for (var i = 0; i < len; i++) result += base32[arr[i] % 32]; return [result]; },
    supportsQR: true,
    getQRData: function(val) { return 'otpauth://totp/PasswordGenerator?secret=' + val + '&issuer=PasswordGenerator'; }
  },
  salt: {
    id: 'salt', nameKey: 'typeSalt', icon: '\uD83E\uDDC2', categoryKey: 'catCryptoNoise', popupKey: 'popupSalt',
    settings: [
      { key: 'bytes', labelKey: 'labelBytes', type: 'select', options: ['16', '32', '64'], default: '32' },
      { key: 'format', labelKey: 'labelFormat', type: 'select', options: ['optHex', 'optBase64'], default: 'optHex' }
    ],
    generate: function(s) { var bytes = parseInt(s.bytes || '32'); var arr = new Uint8Array(bytes); crypto.getRandomValues(arr); if (s.format === 'optBase64') return [btoa(String.fromCharCode.apply(null, arr))]; var hex = ''; for (var i = 0; i < arr.length; i++) hex += arr[i].toString(16).padStart(2, '0'); return [hex]; }
  },
  pepper: {
    id: 'pepper', nameKey: 'typePepper', icon: '\uD83C\uDF36\uFE0F', categoryKey: 'catCryptoNoise', popupKey: 'popupPepper',
    settings: [
      { key: 'bytes', labelKey: 'labelBytes', type: 'select', options: ['32', '64', '128'], default: '32' },
      { key: 'format', labelKey: 'labelFormat', type: 'select', options: ['optHex', 'optBase64'], default: 'optHex' }
    ],
    generate: function(s) { var bytes = parseInt(s.bytes || '32'); var arr = new Uint8Array(bytes); crypto.getRandomValues(arr); if (s.format === 'optBase64') return [btoa(String.fromCharCode.apply(null, arr))]; var hex = ''; for (var i = 0; i < arr.length; i++) hex += arr[i].toString(16).padStart(2, '0'); return [hex]; }
  },
  nonce: {
    id: 'nonce', nameKey: 'typeNonce', icon: '\uD83C\uDFB2', categoryKey: 'catCryptoNoise', popupKey: 'popupNonce',
    settings: [
      { key: 'bytes', labelKey: 'labelBytes', type: 'select', options: ['12', '16'], default: '12' },
      { key: 'format', labelKey: 'labelFormat', type: 'select', options: ['optHex', 'optBase64'], default: 'optHex' }
    ],
    generate: function(s) { var bytes = parseInt(s.bytes || '12'); var arr = new Uint8Array(bytes); crypto.getRandomValues(arr); if (s.format === 'optBase64') return [btoa(String.fromCharCode.apply(null, arr))]; var hex = ''; for (var i = 0; i < arr.length; i++) hex += arr[i].toString(16).padStart(2, '0'); return [hex]; }
  },
  krypteringsnogle: {
    id: 'krypteringsnogle', nameKey: 'typeKrypteringsnogle', icon: '\uD83D\uDD11', categoryKey: 'catCryptoNoise', popupKey: 'popupKrypteringsnogle',
    settings: [{ key: 'format', labelKey: 'labelFormat', type: 'select', options: ['optHex', 'optBase64', 'optAes256Cbc', 'optAes256Gcm'], default: 'optHex' }],
    generate: function(s) {
      var key = new Uint8Array(32); crypto.getRandomValues(key);
      if (s.format === 'optBase64') return [btoa(String.fromCharCode.apply(null, key))];
      if (s.format === 'optAes256Cbc') {
        var iv = new Uint8Array(16); crypto.getRandomValues(iv);
        var keyHex = ''; for (var i = 0; i < key.length; i++) keyHex += key[i].toString(16).padStart(2, '0');
        var ivHex = ''; for (var i = 0; i < iv.length; i++) ivHex += iv[i].toString(16).padStart(2, '0');
        return ['KEY=' + keyHex, 'IV=' + ivHex];
      }
      if (s.format === 'optAes256Gcm') {
        var nonce = new Uint8Array(12); crypto.getRandomValues(nonce);
        var keyHex = ''; for (var i = 0; i < key.length; i++) keyHex += key[i].toString(16).padStart(2, '0');
        var nonceHex = ''; for (var i = 0; i < nonce.length; i++) nonceHex += nonce[i].toString(16).padStart(2, '0');
        return ['KEY=' + keyHex, 'NONCE=' + nonceHex];
      }
      var hex = ''; for (var i = 0; i < key.length; i++) hex += key[i].toString(16).padStart(2, '0'); return [hex];
    }
  },
  apikey: {
    id: 'apikey', nameKey: 'typeApikey', icon: '\uD83D\uDD17', categoryKey: 'catApiSecrets', popupKey: 'popupApikey',
    settings: [
      { key: 'prefix', labelKey: 'labelPrefix', type: 'text', default: '' },
      { key: 'length', labelKey: 'labelLength', type: 'select', options: ['32', '48', '64'], default: '48' },
      { key: 'format', labelKey: 'labelFormat', type: 'select', options: ['optAlphanumeric', 'optHex'], default: 'optAlphanumeric' }
    ],
    generate: function(s) { var len = parseInt(s.length || '48'); var arr = new Uint8Array(len); crypto.getRandomValues(arr); var value; if (s.format === 'optHex') { value = ''; for (var i = 0; i < arr.length; i++) value += arr[i].toString(16).padStart(2, '0'); } else { var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; value = ''; for (var i = 0; i < arr.length; i++) value += chars[arr[i] % chars.length]; } return [(s.prefix || '') + value]; }
  },
  bearertoken: {
    id: 'bearertoken', nameKey: 'typeBearertoken', icon: '\uD83C\uDFAB', categoryKey: 'catApiSecrets', popupKey: 'popupBearertoken',
    settings: [
      { key: 'length', labelKey: 'labelLength', type: 'select', options: ['32', '64', '128'], default: '64' },
      { key: 'format', labelKey: 'labelFormat', type: 'select', options: ['optHex', 'optBase64URL'], default: 'optBase64URL' }
    ],
    generate: function(s) { var len = parseInt(s.length || '64'); var arr = new Uint8Array(len); crypto.getRandomValues(arr); if (s.format === 'optBase64URL') { var b64 = btoa(String.fromCharCode.apply(null, arr)); return [b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')]; } var hex = ''; for (var i = 0; i < arr.length; i++) hex += arr[i].toString(16).padStart(2, '0'); return [hex]; }
  },
  jwtsecret: {
    id: 'jwtsecret', nameKey: 'typeJwtsecret', icon: '\u270D\uFE0F', categoryKey: 'catApiSecrets', popupKey: 'popupJwtsecret',
    settings: [
      { key: 'bits', labelKey: 'labelBits', type: 'select', options: ['opt256bit', 'opt512bit'], default: 'opt256bit' },
      { key: 'format', labelKey: 'labelFormat', type: 'select', options: ['optHex', 'optBase64'], default: 'optHex' }
    ],
    generate: function(s) { var bytes = s.bits === 'opt512bit' ? 64 : 32; var arr = new Uint8Array(bytes); crypto.getRandomValues(arr); if (s.format === 'optBase64') return [btoa(String.fromCharCode.apply(null, arr))]; var hex = ''; for (var i = 0; i < arr.length; i++) hex += arr[i].toString(16).padStart(2, '0'); return [hex]; }
  },
  oauthsecret: {
    id: 'oauthsecret', nameKey: 'typeOauthsecret', icon: '\uD83D\uDD10', categoryKey: 'catApiSecrets', popupKey: 'popupOauthsecret',
    settings: [{ key: 'length', labelKey: 'labelLength', type: 'select', options: ['32', '48', '64'], default: '48' }],
    generate: function(s) { var len = parseInt(s.length || '48'); var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; var arr = new Uint8Array(len); crypto.getRandomValues(arr); var value = ''; for (var i = 0; i < arr.length; i++) value += chars[arr[i] % chars.length]; return [value]; }
  },
  webhooksecret: {
    id: 'webhooksecret', nameKey: 'typeWebhooksecret', icon: '\uD83E\uDE9D', categoryKey: 'catApiSecrets', popupKey: 'popupWebhooksecret',
    settings: [
      { key: 'length', labelKey: 'labelLength', type: 'select', options: ['32', '64'], default: '32' },
      { key: 'format', labelKey: 'labelFormat', type: 'select', options: ['optHex', 'optBase64'], default: 'optHex' }
    ],
    generate: function(s) { var len = parseInt(s.length || '32'); var arr = new Uint8Array(len); crypto.getRandomValues(arr); if (s.format === 'optBase64') return [btoa(String.fromCharCode.apply(null, arr))]; var hex = ''; for (var i = 0; i < arr.length; i++) hex += arr[i].toString(16).padStart(2, '0'); return [hex]; }
  },
  uuidv4: {
    id: 'uuidv4', nameKey: 'typeUuidv4', icon: '\uD83C\uDD94', categoryKey: 'catIdentifiers', popupKey: 'popupUuidv4',
    settings: [{ key: 'format', labelKey: 'labelFormat', type: 'select', options: ['optStandard', 'optNoDashes', 'optUppercase'], default: 'optStandard' }],
    generate: function(s) { var arr = new Uint8Array(16); crypto.getRandomValues(arr); arr[6] = (arr[6] & 0x0f) | 0x40; arr[8] = (arr[8] & 0x3f) | 0x80; var hex = ''; for (var i = 0; i < arr.length; i++) hex += arr[i].toString(16).padStart(2, '0'); if (s.format === 'optNoDashes') return [hex]; var uuid = hex.slice(0,8) + '-' + hex.slice(8,12) + '-' + hex.slice(12,16) + '-' + hex.slice(16,20) + '-' + hex.slice(20); if (s.format === 'optUppercase') return [uuid.toUpperCase()]; return [uuid]; }
  },
  magiclink: {
    id: 'magiclink', nameKey: 'typeMagiclink', icon: '\uD83D\uDD2E', categoryKey: 'catIdentifiers', popupKey: 'popupMagiclink',
    settings: [
      { key: 'length', labelKey: 'labelLength', type: 'select', options: ['32', '64', '128'], default: '64' },
      { key: 'format', labelKey: 'labelFormat', type: 'select', options: ['optHex', 'optBase64URL'], default: 'optBase64URL' }
    ],
    generate: function(s) { var len = parseInt(s.length || '64'); var arr = new Uint8Array(len); crypto.getRandomValues(arr); if (s.format === 'optBase64URL') { var b64 = btoa(String.fromCharCode.apply(null, arr)); return [b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')]; } var hex = ''; for (var i = 0; i < arr.length; i++) hex += arr[i].toString(16).padStart(2, '0'); return [hex]; }
  },
  recoverycode: {
    id: 'recoverycode', nameKey: 'typeRecoverycode', icon: '\uD83D\uDEF1', categoryKey: 'catIdentifiers', popupKey: 'popupRecoverycode',
    settings: [
      { key: 'count', labelKey: 'labelCount', type: 'number', min: 5, max: 20, default: 10 },
      { key: 'format', labelKey: 'labelFormat', type: 'select', options: ['optDashFormat', 'optNoDashFormat'], default: 'optDashFormat' }
    ],
    generate: function(s) { var count = s.count || 10; var codes = []; var chars = '0123456789abcdef'; for (var c = 0; c < count; c++) { var arr = new Uint8Array(12); crypto.getRandomValues(arr); var hex = ''; for (var i = 0; i < arr.length; i++) hex += chars[arr[i] % 16]; if (s.format === 'optNoDashFormat') codes.push(hex); else codes.push(hex.slice(0,4) + '-' + hex.slice(4,8) + '-' + hex.slice(8,12)); } return codes; }
  }
};

var CATEGORIES = [
  { nameKey: 'catUserPasswords', types: ['alfanumerisk', 'passphrase', 'pinkode', 'udtalevenligt', 'otp'] },
  { nameKey: 'catCryptoNoise', types: ['salt', 'pepper', 'nonce', 'krypteringsnogle'] },
  { nameKey: 'catApiSecrets', types: ['apikey', 'bearertoken', 'jwtsecret', 'oauthsecret', 'webhooksecret'] },
  { nameKey: 'catIdentifiers', types: ['uuidv4', 'magiclink', 'recoverycode'] }
];