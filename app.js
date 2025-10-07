// Tabs behavior
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.tab-panel');

function setActiveTab(targetId) {
  tabs.forEach(t => {
    if (t.dataset.target === targetId) t.classList.add('active');
    else t.classList.remove('active');
  });
  panels.forEach(p => {
    if (p.id === targetId) p.removeAttribute('hidden');
    else p.setAttribute('hidden', 'true');
  });
  const activePanel = document.getElementById(targetId);
  if (activePanel) {
    const focusable = activePanel.querySelector('button, a, input, [tabindex]');
    if (focusable) focusable.focus();
  }
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    setActiveTab(tab.dataset.target);
  });
});

// default
setActiveTab('home');

// Executors download logic
const localFileInput = document.getElementById('localFileInput');
const selectedFileName = document.getElementById('selectedFileName');
const clearFileBtn = document.getElementById('clearFileBtn');
const downloadBtn = document.getElementById('downloadExecBtn');

let selectedFile = null;
let tempObjectUrl = null;

localFileInput.addEventListener('change', (e) => {
  const f = e.target.files && e.target.files[0];
  if (!f) {
    selectedFileName.textContent = '';
    selectedFile = null;
    return;
  }
  selectedFile = f;
  selectedFileName.textContent = `Selected: ${f.name} (${Math.round(f.size/1024)} KB)`;
  if (tempObjectUrl) { URL.revokeObjectURL(tempObjectUrl); tempObjectUrl = null; }
  tempObjectUrl = URL.createObjectURL(selectedFile);
});

clearFileBtn.addEventListener('click', () => {
  localFileInput.value = '';
  selectedFile = null;
  selectedFileName.textContent = '';
  if (tempObjectUrl) { URL.revokeObjectURL(tempObjectUrl); tempObjectUrl = null; }
});

downloadBtn.addEventListener('click', (ev) => {
  if (selectedFile && tempObjectUrl) {
    triggerDownload(tempObjectUrl, selectedFile.name);
    return;
  }

  const hosted = downloadBtn.dataset.fileUrl;
  if (!hosted) {
    alert('Nenhum arquivo selecionado nem URL definida. Selecione um arquivo local ou hospede o arquivo e coloque sua URL no atributo data-file-url.');
    return;
  }

  // Create an anchor and click it to download
  const a = document.createElement('a');
  a.href = hosted;
  // a.download = ''; // opcional: se quiser forçar nome, coloque a.download = 'nome.zip';
  document.body.appendChild(a);
  a.click();
  a.remove();
});

function triggerDownload(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || '';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

window.addEventListener('beforeunload', () => {
  if (tempObjectUrl) URL.revokeObjectURL(tempObjectUrl);
});

// Utility to add script cards dynamically (opcional)
function addScriptCard(title, desc, code) {
  const list = document.getElementById('scriptsList');
  const article = document.createElement('article');
  article.className = 'script-card';
  article.innerHTML = `
    <div class="script-title">${escapeHtml(title)}</div>
    <div class="script-desc">${escapeHtml(desc)}</div>
    <div class="code-window">
      <div class="window-header">
        <div class="dots"><div class="circle red"></div><div class="circle yellow"></div><div class="circle green"></div></div>
      </div>
      <pre class="code-block">${escapeHtml(code)}</pre>
    </div>
  `;
  list.appendChild(article);
}

function escapeHtml(s) {
  return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
}
