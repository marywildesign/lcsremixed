const contentEl = document.getElementById('content');
const viewportEl = document.getElementById('viewport');
const colophon = document.getElementById('colophon');
const aboutBtn = document.getElementById('aboutBtn');
const closeBtn = document.getElementById('closeColophon');

let maxScroll = 0;
let speed = 40;
let running = false;
let lastFrame = 0;
let rafId;
let currentMode = 'block';
let originalText = '';
let processedHTML = {}; // Cache processed HTML for each mode
let bannedSet = new Set();
let tokens = []; // Tokenized text cache

// Zalgo Diacritics
const upDiac = '̡̧̢̛̤̪̫̬̭̮̯̰̱̲̳̍̎̄̅̿̑̐̇̈̉̊̋̓̔̽͂̆̚';
const midDiac = '̡̢̧̨̨̢̡̨̨̨̢̛̛̙̜̝̞̤̥̩̪̫̬̭̮̯̰̱̕̚';
const downDiac = '̖̗̘̙̜̝̞̟̠̤̥̦̩̪̫̬̭̮̯̰̱̲̳̖̗̘̙̍̎̏̿̑̐̇̈̉̊̋̌̓̔̚̕̚';

// Load files asynchronously
async function loadAssets() {
  const [textResp, bannedResp] = await Promise.all([
    fetch('full.txt').catch(err => { throw new Error('Failed to load full.txt: ' + err); }),
    fetch('../bannedWords.txt').catch(err => { throw new Error('Failed to load bannedWords.txt: ' + err); })
  ]);

  originalText = await textResp.text();
  const bannedText = await bannedResp.text();
  
  bannedSet = new Set(bannedText.trim().split('\n').map(word => word.trim().toLowerCase()));

  return true;
}

async function loadText(){
  try {
    await loadAssets();

    // Tokenize text once
    tokenizeText();

    // Start with quick lo-fi
    contentEl.innerHTML = 'Loading censored content...';

    // Apply default censored content and start autoscroll
    setTimeout(() => applyDefaultCensored(), 200);

    // Background precompute other modes lazily
    setTimeout(() => {
      ['blur', 'dots', 'zalgo'].forEach(mode => {
        if (!processedHTML[mode]) processedHTML[mode] = render(mode);
      });
    }, 1000);

  } catch(err) {
    contentEl.textContent = 'Error loading: ' + err.message;
  }
}

function tokenizeText() {
  const parts = originalText.split(/\b/);
  tokens = parts.map(part => {
    const clean = part.replace(/[^a-zA-Z]/g, '').toLowerCase();
    return {
      raw: part,
      clean,
      banned: bannedSet.has(clean)
    };
  });
}

function render(mode) {
  return tokens.map(t => {
    if (!t.banned) return t.raw;

    switch (mode) {
      case 'blur':
        return `<span class="blur">${t.raw}</span>`;
      case 'dots':
        return `<span class="dots">${dotify(t.clean)}</span>`;
      case 'zalgo':
        return `<span class="zalgo">${zalgoize(t.clean)}</span>`;
      default:
        return `<span class="blocked">${'█'.repeat(t.clean.length)}</span>`;
    }
  }).join('');
}

function applyDefaultCensored() {
  processedHTML['block'] = render('block');
  contentEl.innerHTML = processedHTML['block'];

  // Now calculate height and start scroll with proper timing
  requestAnimationFrame(() => {
    maxScroll = contentEl.scrollHeight - viewportEl.clientHeight;
    if (maxScroll < 0) maxScroll = 0;
    start();
  });
}

function dotify(word){
  const maxLen = 30;
  const dotGlyphs = [
    '·', '.', '∙', '‧', '․', '‥', '…', '·', '•', '‣', '⁃', '⋅', '⋆', '⋮', '⋯', '⋰', '⋱',
    '𐄁', '࠰', '܁', '܂', '۔', '・', '･', '。', '⁘', '⁙', '◌̇', '◌̣', '◌⃛', '◌⃜', ':', '⠇'
  ];

  let result = '';
  for(let i = 0; i < Math.min(word.length * 3, maxLen); i++){
    result += Math.random() > 0.5 ? dotGlyphs[Math.floor(Math.random() * dotGlyphs.length)] : '';
  }
  return result;
}

function zalgoize(word){
  let result = '';
  const maxDiac = 10;
  word.split('').forEach(char => {
    let zalgoChar = char;
    for(let i = 0; i < Math.min(Math.floor(Math.random() * 3) + 2, maxDiac); i++) zalgoChar += upDiac[Math.floor(Math.random() * upDiac.length)];
    for(let i = 0; i < Math.min(Math.floor(Math.random() * 2) + 1, maxDiac); i++) zalgoChar += midDiac[Math.floor(Math.random() * midDiac.length)];
    for(let i = 0; i < Math.min(Math.floor(Math.random() * 3) + 3, maxDiac); i++) zalgoChar += downDiac[Math.floor(Math.random() * downDiac.length)];
    result += zalgoChar;
  });
  return result;
}

document.querySelectorAll('#obscureControls button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    currentMode = btn.dataset.mode;
    document.querySelectorAll('#obscureControls button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    if (processedHTML[currentMode]) {
      contentEl.innerHTML = processedHTML[currentMode];
    } else {
      processedHTML[currentMode] = render(currentMode);
      contentEl.innerHTML = processedHTML[currentMode];
    }
  });
});

aboutBtn.onclick = ()=> colophon.classList.add('open');
closeBtn.onclick = ()=> colophon.classList.remove('open');

document.addEventListener('click',(e)=>{
  if(!colophon.contains(e.target) && !aboutBtn.contains(e.target)){
    colophon.classList.remove('open');
  }
});

function start(){
  if(running) return;
  running=true;
  lastFrame=performance.now();
  rafId=requestAnimationFrame(tick);
}

function tick(now){
  const dt=(now-lastFrame)/1000;
  viewportEl.scrollTop+=speed*dt;
  if(viewportEl.scrollTop>=maxScroll) viewportEl.scrollTop=0;
  lastFrame=now;
  rafId=requestAnimationFrame(tick);
}

window.addEventListener('load', loadText);