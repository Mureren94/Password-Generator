var I18N = {
  da: {
    appTitle: 'Password Generator', selectType: 'Vælg en type', history: 'Seneste', clearHistory: 'Ryd',
    clearClipboard: 'Ryd udklipsholder', noHistory: 'Ingen historik endnu', settings: 'Indstillinger',
    generate: 'Generér', results: 'Genererede værdier', copy: 'Kopiér', copied: 'Kopieret!',
    emptyText: 'Vælg en password-type i menuen til venstre',
    emptyHint: 'Alle passwords genereres kryptografisk sikkert med crypto.getRandomValues()',
    favorites: 'Favoritter', language: 'Sprog', importLang: 'Importér sprog', exportTemplate: 'Eksportér skabelon',
    bulkLabel: 'Antal:', downloadTxt: '.txt', downloadCsv: '.csv', downloadSvg: 'SVG', downloadPng: 'PNG', downloadPdf: 'PDF',
    uploadWordlist: 'Upload ordliste (.txt)', customWordlist: 'Brugerdefineret', qrCode: 'QR kode',
    catUserPasswords: 'Brugerrettede kodeord', catCryptoNoise: 'Kryptografisk støj & hashes',
    catApiSecrets: 'API- & systemhemmeligheder', catIdentifiers: 'Identifikatorer & tokens',
    typeAlfanumerisk: 'Alfanumerisk', typePassphrase: 'Passphrase / Diceware', typePinkode: 'PIN-kode',
    typeUdtalevenligt: 'Udtalevenligt', typeOtp: 'OTP / TOTP', typeSalt: 'Salt', typePepper: 'Pepper',
    typeNonce: 'Nonce / IV', typeKrypteringsnogle: 'Krypteringsnøgle', typeApikey: 'API Key/Secret',
    typeBearertoken: 'Bearer/Session Token', typeJwtsecret: 'JWT HMAC Secret', typeOauthsecret: 'OAuth Client Secret',
    typeWebhooksecret: 'Webhook Secret', typeUuidv4: 'UUID v4', typeMagiclink: 'Magic Link / Reset Token',
    typeRecoverycode: 'Recovery / Backup koder',
    popupAlfanumerisk: 'Tilfældige tegn (a-z, A-Z, 0-9). Brug til generelle adgangskoder og service-logins.',
    popupPassphrase: 'Sammensatte ord. Lettere at huske end tilfældige tegn. God til hovedadgangskoder.',
    popupPinkode: 'Kun tal. Bruges til hurtig adgang, f.eks. skærmlås eller betalingskort.',
    popupUdtalevenligt: 'Fonetiske stavelser der kan udtales. God når passwords skal kommunikeres mundtligt.',
    popupOtp: 'Base32 nøgle til engangskoder (Google Authenticator, Authy). 16-32 tegn.',
    popupSalt: 'Kryptografisk tilfældig værdi tilføjet før hashing for at forhindre rainbow table-angreb.',
    popupPepper: 'Hemmelig systemværdi tilføjet under hashing. Adskilt fra databasen.',
    popupNonce: 'Engangsværdi brugt i kryptering. Må aldrig genbruges med samme nøgle.',
    popupKrypteringsnogle: '256-bit AES nøgle til symmetrisk kryptering. Holdes absolut hemmelig.',
    popupApikey: 'Nøgle til API-adgang. Holdes hemmelig. Sendes typisk i HTTP headers.',
    popupBearertoken: 'Session-token til autentificering. URL-sikker. Har typisk begrænset levetid.',
    popupJwtsecret: 'Hemmelighed til signering af JSON Web Tokens. Beskytter mod forfalskning.',
    popupOauthsecret: 'Klienthemmelighed til OAuth 2.0 flows. Aldrig eksponeret i frontend-kode.',
    popupWebhooksecret: 'HMAC-nøgle til at verificere at webhook-requests kommer fra den rigtige afsender.',
    popupUuidv4: 'Universelt unik identifikator. Tilfældig. Bruges til database-ID\'er, sporingsnumre.',
    popupMagiclink: 'Engangstoken sendt via email til adgangskodefri login. Udløber typisk efter 15-60 min.',
    popupRecoverycode: 'Backup-kode til kontogendannelse. Printes og opbevares sikkert offline.',
    labelLength: 'Længde', labelSpecialChars: 'Specialtegn', labelDockerSafe: 'Docker/.env-safe',
    labelWordCount: 'Antal ord', labelSeparator: 'Separator', labelWordlist: 'Ordliste',
    labelSyllables: 'Antal stavelser', labelBytes: 'Længde (bytes)', labelFormat: 'Format',
    labelPrefix: 'Prefix', labelBits: 'Størrelse', labelCount: 'Antal koder',
    optDanish: 'Dansk', optEnglish: 'Engelsk', optStandard: 'Standard', optNoDashes: 'Uden bindestreger',
    optUppercase: 'Uppercase', optAlphanumeric: 'Alfanumerisk', optHex: 'Hex', optBase64: 'Base64',
    optBase64URL: 'Base64URL', opt256bit: '256 bit', opt512bit: '512 bit',
    optDashFormat: 'xxxx-xxxx-xxxx', optNoDashFormat: 'xxxxxxxxxxxx',
    optAes256Cbc: 'AES-256-CBC', optAes256Gcm: 'AES-256-GCM',
    wordlistLoaded: 'Indlæst: ', wordlistNone: 'Standard', clipboardCleared: 'Udklipsholder ryddet!',
    optCustom: 'Brugerdefineret'
  },
  en: {
    appTitle: 'Password Generator', selectType: 'Select a type', history: 'Recent', clearHistory: 'Clear',
    clearClipboard: 'Clear clipboard', noHistory: 'No history yet', settings: 'Settings',
    generate: 'Generate', results: 'Generated Values', copy: 'Copy', copied: 'Copied!',
    emptyText: 'Select a password type from the menu',
    emptyHint: 'All passwords are generated cryptographically secure with crypto.getRandomValues()',
    favorites: 'Favorites', language: 'Language', importLang: 'Import language', exportTemplate: 'Export template',
    bulkLabel: 'Count:', downloadTxt: '.txt', downloadCsv: '.csv', downloadSvg: 'SVG', downloadPng: 'PNG', downloadPdf: 'PDF',
    uploadWordlist: 'Upload wordlist (.txt)', customWordlist: 'Custom', qrCode: 'QR Code',
    catUserPasswords: 'User-facing Passwords', catCryptoNoise: 'Cryptographic Noise & Hashes',
    catApiSecrets: 'API & System Secrets', catIdentifiers: 'Identifiers & Tokens',
    typeAlfanumerisk: 'Alphanumeric', typePassphrase: 'Passphrase / Diceware', typePinkode: 'PIN Code',
    typeUdtalevenligt: 'Pronounceable', typeOtp: 'OTP / TOTP', typeSalt: 'Salt', typePepper: 'Pepper',
    typeNonce: 'Nonce / IV', typeKrypteringsnogle: 'Encryption Key', typeApikey: 'API Key/Secret',
    typeBearertoken: 'Bearer/Session Token', typeJwtsecret: 'JWT HMAC Secret', typeOauthsecret: 'OAuth Client Secret',
    typeWebhooksecret: 'Webhook Secret', typeUuidv4: 'UUID v4', typeMagiclink: 'Magic Link / Reset Token',
    typeRecoverycode: 'Recovery / Backup Codes',
    popupAlfanumerisk: 'Random characters (a-z, A-Z, 0-9). Use for general passwords and service logins.',
    popupPassphrase: 'Combined words. Easier to remember than random characters. Good for master passwords.',
    popupPinkode: 'Numbers only. Used for quick access, e.g. screen lock or payment cards.',
    popupUdtalevenligt: 'Phonetic syllables that can be pronounced. Good when passwords need to be communicated verbally.',
    popupOtp: 'Base32 key for one-time codes (Google Authenticator, Authy). 16-32 characters.',
    popupSalt: 'Cryptographically random value added before hashing to prevent rainbow table attacks.',
    popupPepper: 'Secret system value added during hashing. Separate from the database.',
    popupNonce: 'One-time value used in encryption. Must never be reused with the same key.',
    popupKrypteringsnogle: '256-bit AES key for symmetric encryption. Keep absolutely secret.',
    popupApikey: 'Key for API access. Keep secret. Typically sent in HTTP headers.',
    popupBearertoken: 'Session token for authentication. URL-safe. Typically has limited lifetime.',
    popupJwtsecret: 'Secret for signing JSON Web Tokens. Protects against forgery.',
    popupOauthsecret: 'Client secret for OAuth 2.0 flows. Never exposed in frontend code.',
    popupWebhooksecret: 'HMAC key to verify that webhook requests come from the right sender.',
    popupUuidv4: 'Universally unique identifier. Random. Used for database IDs, tracking numbers.',
    popupMagiclink: 'One-time token sent via email for passwordless login. Typically expires after 15-60 min.',
    popupRecoverycode: 'Backup code for account recovery. Print and store safely offline.',
    labelLength: 'Length', labelSpecialChars: 'Special characters', labelDockerSafe: 'Docker/.env-safe',
    labelWordCount: 'Word count', labelSeparator: 'Separator', labelWordlist: 'Word list',
    labelSyllables: 'Syllable count', labelBytes: 'Length (bytes)', labelFormat: 'Format',
    labelPrefix: 'Prefix', labelBits: 'Size', labelCount: 'Code count',
    optDanish: 'Danish', optEnglish: 'English', optStandard: 'Standard', optNoDashes: 'Without dashes',
    optUppercase: 'Uppercase', optAlphanumeric: 'Alphanumeric', optHex: 'Hex', optBase64: 'Base64',
    optBase64URL: 'Base64URL', opt256bit: '256 bit', opt512bit: '512 bit',
    optDashFormat: 'xxxx-xxxx-xxxx', optNoDashFormat: 'xxxxxxxxxxxx',
    optAes256Cbc: 'AES-256-CBC', optAes256Gcm: 'AES-256-GCM',
    wordlistLoaded: 'Loaded: ', wordlistNone: 'Default', clipboardCleared: 'Clipboard cleared!',
    optCustom: 'Custom'
  }
};

var LANG = localStorage.getItem('pwgen_lang') || 'da';
function t(k) { return (I18N[LANG] && I18N[LANG][k]) || (I18N.en && I18N.en[k]) || k; }
function setLang(lang) { LANG = lang; localStorage.setItem('pwgen_lang', lang); renderAll(); }

function loadCustomLang(jsonStr) {
  try {
    var data = JSON.parse(jsonStr);
    var langCode = data._lang || 'custom';
    if (!I18N[langCode]) I18N[langCode] = {};
    var enKeys = Object.keys(I18N.en);
    var missing = [];
    for (var i = 0; i < enKeys.length; i++) {
      if (data[enKeys[i]]) I18N[langCode][enKeys[i]] = data[enKeys[i]];
      else missing.push(enKeys[i]);
    }
    if (missing.length > 0) { alert('Manglende nøgler: ' + missing.join(', ')); return false; }
    localStorage.setItem('pwgen_custom_lang_' + langCode, jsonStr);
    return langCode;
  } catch(e) { alert('Ugyldig JSON: ' + e.message); return false; }
}

function getCustomLangs() {
  var langs = [];
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    if (key.indexOf('pwgen_custom_lang_') === 0) langs.push(key.replace('pwgen_custom_lang_', ''));
  }
  return langs;
}

function loadAllCustomLangs() {
  var langs = getCustomLangs();
  for (var i = 0; i < langs.length; i++) {
    var data = JSON.parse(localStorage.getItem('pwgen_custom_lang_' + langs[i]));
    if (!I18N[langs[i]]) I18N[langs[i]] = data;
  }
}
loadAllCustomLangs();