var state = {
  selectedType: null,
  settings: {},
  history: JSON.parse(localStorage.getItem('pwgen_history') || '[]'),
  results: [],
  favorites: JSON.parse(localStorage.getItem('pwgen_favorites') || '[]'),
  customWordlist: null,
  customWordlistName: null
};

function saveHistory() { localStorage.setItem('pwgen_history', JSON.stringify(state.history)); }
function saveFavorites() { localStorage.setItem('pwgen_favorites', JSON.stringify(state.favorites)); }

function addToHistory(typeId, values) {
  var entry = { typeId: typeId, typeName: t(TYPES[typeId].nameKey), values: values, settings: JSON.parse(JSON.stringify(state.settings)), timestamp: Date.now() };
  state.history.unshift(entry);
  if (state.history.length > 5) state.history = state.history.slice(0, 5);
  saveHistory();
  renderHistory();
}

function clearHistory() { state.history = []; saveHistory(); renderHistory(); }

function clearClipboard() {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText('').then(function() {
      var btn = document.getElementById('clearClipboardBtn');
      btn.textContent = t('clipboardCleared');
      setTimeout(function() { btn.textContent = t('clearClipboard'); }, 2000);
    }).catch(function() {});
  }
}

function toggleFavorite(typeId) {
  var idx = state.favorites.indexOf(typeId);
  if (idx >= 0) state.favorites.splice(idx, 1);
  else state.favorites.push(typeId);
  saveFavorites();
  renderTypeList();
}

function selectType(typeId, presetSettings) {
  state.selectedType = typeId;
  state.settings = {};
  var type = TYPES[typeId];
  type.settings.forEach(function(s) { state.settings[s.key] = s.default; });
  if (presetSettings) {
    Object.keys(presetSettings).forEach(function(k) { state.settings[k] = presetSettings[k]; });
  }
  state.results = [];
  renderAll();
}

function generate() {
  if (!state.selectedType) return;
  var type = TYPES[state.selectedType];
  var bulkCount = parseInt(document.getElementById('bulkCount').value) || 1;
  state.results = [];
  for (var i = 0; i < bulkCount; i++) {
    var vals = type.generate(state.settings);
    for (var j = 0; j < vals.length; j++) state.results.push(vals[j]);
  }
  addToHistory(state.selectedType, state.results);
  renderResults();
}

function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(function() {
    btn.textContent = t('copied');
    btn.classList.add('copied');
    setTimeout(function() { btn.textContent = t('copy'); btn.classList.remove('copied'); }, 2000);
  }).catch(function() {
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
    btn.textContent = t('copied'); btn.classList.add('copied');
    setTimeout(function() { btn.textContent = t('copy'); btn.classList.remove('copied'); }, 2000);
  });
}

function downloadFile(content, filename, mime) {
  var blob = new Blob([content], { type: mime });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadTxt() {
  if (state.results.length === 0) return;
  var content = state.results.join('\n');
  downloadFile(content, 'passwords.txt', 'text/plain');
}

function downloadCsv() {
  if (state.results.length === 0) return;
  var content = 'index,value\n';
  state.results.forEach(function(v, i) { content += (i + 1) + ',"' + v.replace(/"/g, '""') + '"\n'; });
  downloadFile(content, 'passwords.csv', 'text/csv');
}

function renderTypeList() {
  var html = '';
  var favs = state.favorites.filter(function(f) { return TYPES[f]; });
  if (favs.length > 0) {
    html += '<div class="fav-section"><div class="category-header">\u2B50 ' + t('favorites') + '</div>';
    favs.forEach(function(typeId) {
      var t2 = TYPES[typeId];
      var active = state.selectedType === typeId ? ' active' : '';
      html += '<div class="type-item' + active + '" data-type="' + typeId + '" data-popup="' + t(t2.popupKey).replace(/"/g, '&quot;') + '"><span class="type-icon">' + t2.icon + '</span><span class="type-name">' + t(t2.nameKey) + '</span><span class="fav-star active" data-fav="' + typeId + '">\u2605</span></div>';
    });
    html += '</div>';
  }
  CATEGORIES.forEach(function(cat) {
    html += '<div class="category"><div class="category-header">' + t(cat.nameKey) + '</div>';
    cat.types.forEach(function(typeId) {
      if (state.favorites.indexOf(typeId) >= 0) return;
      var t2 = TYPES[typeId];
      var active = state.selectedType === typeId ? ' active' : '';
      html += '<div class="type-item' + active + '" data-type="' + typeId + '" data-popup="' + t(t2.popupKey).replace(/"/g, '&quot;') + '"><span class="type-icon">' + t2.icon + '</span><span class="type-name">' + t(t2.nameKey) + '</span><span class="fav-star" data-fav="' + typeId + '">\u2606</span></div>';
    });
    html += '</div>';
  });
  document.getElementById('typeList').innerHTML = html;

  var items = document.querySelectorAll('.type-item');
  var popup = document.getElementById('hoverPopup');
  items.forEach(function(item) {
    item.addEventListener('click', function(e) {
      if (e.target.classList.contains('fav-star')) return;
      selectType(this.dataset.type);
    });
    item.addEventListener('mouseenter', function(e) {
      popup.textContent = this.dataset.popup;
      popup.classList.add('visible');
    });
    item.addEventListener('mousemove', function(e) {
      var x = e.clientX + 12, y = e.clientY + 12;
      if (x + 280 > window.innerWidth) x = e.clientX - 292;
      if (y + 80 > window.innerHeight) y = e.clientY - 90;
      popup.style.left = x + 'px'; popup.style.top = y + 'px';
    });
    item.addEventListener('mouseleave', function() { popup.classList.remove('visible'); });
  });

  var stars = document.querySelectorAll('.fav-star');
  stars.forEach(function(star) {
    star.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleFavorite(this.dataset.fav);
    });
  });
}

function renderSettings() {
  var section = document.getElementById('settingsSection');
  var grid = document.getElementById('settingsGrid');
  if (!state.selectedType) { section.style.display = 'none'; return; }
  section.style.display = 'block';
  var type = TYPES[state.selectedType];
  var html = '';
  type.settings.forEach(function(s) {
    html += '<div class="setting-group">';
    if (s.type === 'toggle') {
      html += '<div class="toggle-group">';
      html += '<input type="checkbox" id="set_' + s.key + '"' + (state.settings[s.key] ? ' checked' : '') + ' data-key="' + s.key + '">';
      html += '<label for="set_' + s.key + '">' + t(s.labelKey) + '</label>';
      html += '</div>';
    } else if (s.type === 'select') {
      html += '<label>' + t(s.labelKey) + '</label>';
      html += '<select id="set_' + s.key + '" data-key="' + s.key + '">';
      s.options.forEach(function(opt) {
        var sel = state.settings[s.key] == opt ? ' selected' : '';
        html += '<option value="' + opt + '"' + sel + '>' + t(opt) + '</option>';
      });
      html += '</select>';
    } else if (s.type === 'number') {
      html += '<label>' + t(s.labelKey) + '</label>';
      html += '<input type="number" id="set_' + s.key + '" data-key="' + s.key + '" min="' + s.min + '" max="' + s.max + '" value="' + state.settings[s.key] + '">';
    } else if (s.type === 'text') {
      html += '<label>' + t(s.labelKey) + '</label>';
      html += '<input type="text" id="set_' + s.key + '" data-key="' + s.key + '" value="' + (state.settings[s.key] || '') + '">';
    }
    html += '</div>';
  });
  if (type.id === 'passphrase') {
    html += '<div class="setting-group"><div class="wordlist-upload"><button class="tool-btn" id="uploadWordlistBtn">\uD83D\uDCC1 ' + t('uploadWordlist') + '</button><span class="wordlist-status" id="wordlistStatus">' + (state.customWordlist ? t('wordlistLoaded') + state.customWordlistName : t('wordlistNone')) + '</span></div><input type="file" id="wordlistFileInput" accept=".txt" style="display:none;"></div>';
  }
  grid.innerHTML = html;

  var inputs = grid.querySelectorAll('input, select');
  inputs.forEach(function(input) {
    input.addEventListener('change', function() {
      var key = this.dataset.key;
      if (this.type === 'checkbox') state.settings[key] = this.checked;
      else if (this.type === 'number') state.settings[key] = parseInt(this.value) || type.settings.find(function(s2) { return s2.key === key; }).default;
      else state.settings[key] = this.value;
    });
  });

  var wlBtn = document.getElementById('uploadWordlistBtn');
  if (wlBtn) {
    wlBtn.addEventListener('click', function() { document.getElementById('wordlistFileInput').click(); });
    var wlInput = document.getElementById('wordlistFileInput');
    wlInput.addEventListener('change', function() {
      var file = this.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function(e) {
        var lines = e.target.result.split(/[\r\n]+/).filter(function(l) { return l.trim().length > 0; });
        state.customWordlist = lines;
        state.customWordlistName = file.name;
        document.getElementById('wordlistStatus').textContent = t('wordlistLoaded') + file.name;
        if (state.settings.language !== 'optCustom') {
          state.settings.language = 'optCustom';
          var sel = document.getElementById('set_language');
          if (sel) sel.value = 'optCustom';
        }
      };
      reader.readAsText(file);
    });
  }
}

function renderResults() {
  var section = document.getElementById('resultSection');
  var list = document.getElementById('resultList');
  var qrContainer = document.getElementById('qrContainer');
  if (state.results.length === 0) { section.style.display = 'none'; return; }
  section.style.display = 'block';
  var html = '';
  state.results.forEach(function(val, idx) {
    html += '<div class="result-item"><span class="result-value">' + val.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</span><button class="copy-btn" data-value="' + val.replace(/"/g, '&quot;') + '">' + t('copy') + '</button></div>';
  });
  list.innerHTML = html;

  var buttons = list.querySelectorAll('.copy-btn');
  buttons.forEach(function(btn) {
    btn.addEventListener('click', function() { copyToClipboard(this.dataset.value, this); });
  });

  qrContainer.style.display = 'none';
  qrContainer.innerHTML = '';
  if (state.selectedType && TYPES[state.selectedType].supportsQR && state.results.length > 0) {
    var type = TYPES[state.selectedType];
    var qrData = type.getQRData(state.results[0]);
    var qr = QR.generate(qrData);
    var svg = QR.toSVG(qr.matrix, qr.size, 3, 2);
    qrContainer.style.display = 'block';
    qrContainer.innerHTML = '<h4 style="margin-bottom:8px;color:var(--text-secondary);font-size:12px;">' + t('qrCode') + '</h4><div>' + svg + '</div><div class="qr-dl-btns"><button class="qr-dl-btn" id="qrSvgBtn">' + t('downloadSvg') + '</button><button class="qr-dl-btn" id="qrPngBtn">' + t('downloadPng') + '</button><button class="qr-dl-btn" id="qrPdfBtn">' + t('downloadPdf') + '</button></div>';
    document.getElementById('qrSvgBtn').addEventListener('click', function() { QR.downloadSVG(svg, 'otp-qr.svg'); });
    document.getElementById('qrPngBtn').addEventListener('click', function() { QR.downloadPNG(svg, 'otp-qr.png'); });
    document.getElementById('qrPdfBtn').addEventListener('click', function() { QR.downloadPDF(svg, 'otp-qr.pdf'); });
  }
}

function renderHistory() {
  var list = document.getElementById('historyList');
  if (state.history.length === 0) {
    list.innerHTML = '<div class="history-empty">' + t('noHistory') + '</div>';
    return;
  }
  var html = '';
  state.history.forEach(function(entry) {
    var val = entry.values[0] || '';
    if (val.length > 60) val = val.substring(0, 60) + '...';
    html += '<div class="history-item" data-type="' + entry.typeId + '" data-settings="' + encodeURIComponent(JSON.stringify(entry.settings)) + '"><span class="history-type">' + entry.typeName + '</span><span class="history-value">' + val.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</span></div>';
  });
  list.innerHTML = html;

  var items = list.querySelectorAll('.history-item');
  items.forEach(function(item) {
    item.addEventListener('click', function() {
      var typeId = this.dataset.type;
      var settings = JSON.parse(decodeURIComponent(this.dataset.settings));
      selectType(typeId, settings);
    });
  });
}

function updateLangSelect() {
  var sel = document.getElementById('langSelect');
  sel.innerHTML = '<option value="da">Dansk</option><option value="en">English</option>';
  var customLangs = getCustomLangs();
  customLangs.forEach(function(lc) { sel.innerHTML += '<option value="' + lc + '">' + lc + '</option>'; });
  sel.value = LANG;
}

function renderAll() {
  updateLangSelect();
  renderTypeList();
  renderSettings();
  renderResults();
  renderHistory();
  var title = document.getElementById('mainTitle');
  var empty = document.getElementById('emptyState');
  if (state.selectedType) { title.textContent = t(TYPES[state.selectedType].nameKey); empty.style.display = 'none'; }
  else { title.textContent = t('selectType'); empty.style.display = 'block'; }
  document.getElementById('sidebarTitle').textContent = t('appTitle');
  document.getElementById('historyTitle').innerHTML = '\uD83D\uDCCB ' + t('history');
  document.getElementById('settingsTitle').innerHTML = '\u2699\uFE0F ' + t('settings');
  document.getElementById('resultsTitle').innerHTML = '\u2728 ' + t('results');
  document.getElementById('generateBtn').textContent = t('generate');
  document.getElementById('bulkLabel').textContent = t('bulkLabel');
  document.getElementById('clearHistoryBtn').textContent = t('clearHistory');
  document.getElementById('clearClipboardBtn').textContent = t('clearClipboard');
  document.getElementById('emptyText').textContent = t('emptyText');
  document.getElementById('emptyHint').textContent = t('emptyHint');
  document.getElementById('downloadTxtBtn').innerHTML = '\uD83D\uDCC4 ' + t('downloadTxt');
  document.getElementById('downloadCsvBtn').innerHTML = '\uD83D\uDCCA ' + t('downloadCsv');
  document.querySelector('.ilbl').textContent = t('importLang');
  document.querySelector('.elbl').textContent = t('exportTemplate');
  if (state.history.length === 0) document.getElementById('historyList').innerHTML = '<div class="history-empty">' + t('noHistory') + '</div>';
}

document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);
document.getElementById('clearClipboardBtn').addEventListener('click', clearClipboard);
document.getElementById('generateBtn').addEventListener('click', generate);
document.getElementById('downloadTxtBtn').addEventListener('click', downloadTxt);
document.getElementById('downloadCsvBtn').addEventListener('click', downloadCsv);

document.getElementById('langSelect').addEventListener('change', function() { setLang(this.value); });

document.getElementById('exportTemplateBtn').addEventListener('click', function() {
  var template = JSON.parse(JSON.stringify(I18N.en));
  template._lang = '';
  downloadFile(JSON.stringify(template, null, 2), 'pwgen-template.json', 'application/json');
});

document.getElementById('importLangBtn').addEventListener('click', function() { document.getElementById('langFileInput').click(); });
document.getElementById('langFileInput').addEventListener('change', function() {
  var file = this.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    var langCode = loadCustomLang(e.target.result);
    if (langCode) { setLang(langCode); }
  };
  reader.readAsText(file);
  this.value = '';
});

document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); generate(); }
});

renderAll();