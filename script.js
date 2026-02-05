const contentEl = document.getElementById('content');
const viewportEl = document.getElementById('viewport');
const colophon = document.getElementById('colophon');
const aboutBtn = document.getElementById('aboutBtn');
let maxScroll = 0;
let speed = 40;
let running = false;
let lastFrame = 0;
let rafId;
let currentMode = 'block';
let originalText = '';

// Banned words
const bannedWords = [
  "fuck","shit","bastard","bitch","cunt","whore","slut","cancer",
  "damn","asshole","ass","dick","cock","pussy","prick","bollocks","arse",
  "twat","dyke","faggot","fag","slapper","slag","skank",
  "nigger","spic","chink","gook","kike","yid","hebe","wop","coon","jap","slant",
  "raghead","sandnigger","towelhead","paki","gypsy","gyppo","oriental","dago",
  "shylock","juden","yahudi",
  "tranny","queer","homo","shemale",
  "cum","cumshot","boobs","tits","nips","nipples","vagina","penis",
  "anus","butt","rectum","balls","testicles","orgasm","ejaculate","semen",
  "blowjob","bj","handjob","masturbate","fap","hentai","porn","sex","fetish","kink","violated",
  "breast","boob","incel","lover","bondage","kill","murder","racist","abortion","marijuana",

  "motherfucker","motherfuck","motherfucking","goddamn","goddamned","dammit",
  "dumbass","jackass","smartass","wiseass","asshat","asswipe","assclown","assmunch","asslick","asslicker","asskisser",
  "shithead","shitbag","shitlord","shitshow","shitface","shitfaced","shitpile","shitheel","shitstain",
  "fuckface","fuckhead","fuckboy","fuckboi","fucktard","clusterfuck",
  "dickhead","dickwad","dickweed","dickbag","dickface","dickhole","dickless",
  "cocksucker","cocksucking","cocklicker","cockgobbler","cockmongler","cockwhore",
  "ballsack","ballbag","scrotum","sack","boner","hardon",
  "wank","wanking","wanker","tosser","git","bugger","bloody","wiener","weiner","dildo","buttplug",
  "buttfuck","buttfucker","buttfucking","buttsex","anal","pegging","fisting","rimming","rimjob","deepthroat","gspot","g spot",
  "clit","clitoris","labia","vulva","areola","areolae","taint","perineum",
  "titty","titties","boobies","booby","nipple","nip",
  "cumslut","cumdump","cumdumpster","creampie","cream pie","bukkake","bukakke","bukake","facial","snowballing","snowball",
  "jizz","spunk","splooge","smegma","sperm",
  "horny","aroused","wet","hard","erection","ejaculation","humping","dryhump","dry hump","hump",
  "camgirl","camwhore","sext","sexting","threesome","foursome","gangbang","gang bang","hookup","hook up",

  "rape","raped","rapist","raping","molest","molested","molester","molestation",
  "groom","groomer","grooming","predator","sexual predator",
  "pedophile","paedophile","pedo","paedo","hebephile","ephebophile",
  "incest","bestiality","zoophilia","necrophilia","nonconsensual","non consensual",
  "prostitute","prostitution","hooker","escort","call girl","harlot","streetwalker","john","pimp","pimping","madam",

  "retard","retarded","tard","spaz","spastic","mong","mongoloid","downie",
  "cripple","crippled","gimp","gimpy","lame","moron","idiot","imbecile","psycho","schizo","autist",
  "midget","dwarf","dwarfy","shortbus","short bus","windowlicker","window licker",

  "beaner","beaners","wetback","wetbacks","greaser","mojado","cholo","spick","spik",
  "porchmonkey","porch monkey","jigaboo","jiggaboo","sambo","pickaninny","spearchucker","zipperhead","zipper head","chinaman","slope",
  "yellowperil","yellow peril","slant eye","slant eyes","slitty eyes",
  "coolie","dothead","dot head","curry muncher","curry munchers","curry nigger","curry nigga",
  "camel jockey","cameljockey","sand monkey","sand ape","muzzie","muzrat","haji","hajji",
  "oven dodger","christ killer","jewboy","jew boy",
  "pikey","tinker","mick","paddy","guido","polack","frog","kraut","limey",
  "abo","boong","boonga","hori","redskin","injun","squaw",
  "yank","yankee","hillbilly","redneck","white trash","cracker",

  "terrorist","terrorism","genocide","lynch","lynching","ethnic cleansing","ethniccleaning",
  "gas chamber","gas the","gas the jews","final solution",

  "queerbait","no homo","poof","poofta","poofter","fairy","nancy","sissy","ladyboy","he she","he him","she male","trannie",
  "homophobic","transphobic","biphobic",

  "fatass","fatso","lardass","lard arse","ugly","uggo","cow","cowface","hamplanet","landwhale","whale",
  "skinny bitch","anorexic","anorexia","bulimic","bulimia",

  "slattern","hussy","bimbo","gold digger","goldigger","sidepiece","side piece","homewrecker","home wrecker","thot","e girl","egirl","simp",

  "suicide","suicidal","kill yourself","kys","kms","hang yourself","drink bleach","go die","die in a fire",
  "selfharm","self harm","selfharming","cutting","cut myself","cut myself up",

  "stab","stabbing","shoot","shooting","massacre","execute","execution","behead","beheading","decapitate","decapitation","strangle","strangling","choke","choking",
  "bomb","bombing","arson","mutilate","mutilation","torture","torturing","assault","battery","abuse","abusive","kidnap","kidnapping","extort","extortion",

  "weed","pot","cannabis","hash","hashish","coke","cocaine","crack","heroin","meth","methamphetamine","ice","lsd","acid","ecstasy","mdma","molly","ketamine","ket","opioid","opiate",
  "oxycodone","oxy","fentanyl","xanax","adderall","benzos","benzodiazepine","dope","smack","speed","uppers","downers",

  "shemale","lady boy","crossdresser","cross dresser","transvestite",
  "gayboy","gay boy","gaylord","lez","lesbo","lesbian","dykey","dykes",
  "hetero","heteronormative","heteronormativity",

  "coonery","coonish","coontown","wog","abolover","race traitor","racetraitor","race mixing","racemixing","race mixer","racemixer",
  "whigger","wigga","oreo","banana","apple","coconut",

  "ching chong","chingchong","ghetto","thug","hoodrat","hood rat","trash","trashy","mud","mudblood","half breed","halfbreed",

  "puta","puto","cabron","pendejo","pendeja","maricon","mierda","zorra","perra","cojones","cojon","verga","chingar","chingado","chingada","chingadera",
  "caralho","porra","merda","vadia","bicha","boiola",
  "merde","connard","con","salope","pute","encule","enculer","batard",
  "scheisse","scheiße","arsch","fotze","hure","schlampe","wichser","schwuchtel",
  "cazzo","stronzo","puttana","troia","frocio","negro",
  "kurwa","chuj","pierdol","pierdolony","pizda","skurwysyn",
  "orospu","sik","amcik","got","gavat","ibne",
  "chutiya","madarchod","bhenchod","randi","gandu","lund","kuttiya","saala",
  "sharmuta","ibn al kalb","ibn alkalb","kalb","kafir","kaffir",
  "koskesh","koskeshy",
  "putang ina","putangina","bobo","tanga",
  "anjing","bangsat","kontol","memek",
  "blyat","suka","pidor",
  "kuso","baka",
  "ssibal","gaesaekki","gaesekki",

  "zoophile","zoophile lover","animal abuser","animal rapist","dogfuck","dogfucker","dog fucker","goatfuck","goatfucker",
  "scat","coprophagia","coprophagy","watersports","water sports","golden shower","golden showers","urophagia","urolagnia","urinate","urination","pee","piss","pissing",

  "violent","violence","abusive language","hate speech","hatespeech","homophobia","transphobia","racism","sexism","misogyny","misandry",
  "misogynist","misandrist","bigot","bigotry","xenophobe","xenophobia",

  "pedo ring","pedoring","child porn","kiddie porn","child sexual abuse","child abuse","child exploiter","child exploitation","csam","child rape","rape play",
  "statutory rape","date rape","drugging","roofies","rohypnol",

  "white power","white pride","white lives matter","blood and soil","great replacement","white genocide",

  "nazi","nazism","neo nazi","neo fascist","fascist","fascism","gas all","gas em","gas them",
  "kill the","murder the","lynch the","hang the","beat the","burn the","shoot the","stab the", "sexual", "deviance","fetish",
  "gay","fucking","death","strip","striptease","bang","crap", "fuckfuckfuck","fuuck","fuuuck","fuuuuck","fuuuuuck","lube","latex","thigh","suck","sucks"
];

function escapeRegex(w) { return w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }

function zalgoize(word){
  const up = '̡̧̛̍̎̄̅̿̑̐̇̈̉̊̋̓̔̽͂̓̈́͊͋͌̃̂̌̕';
  const mid = '̨̢̢̡̨̨̨̢̛̕';
  const down = '̖̗̘̙̜̝̞̟̠̤̥̦̩̪̚';
  return word.split('').map(c => c +
      up[Math.floor(Math.random()*up.length)] +
      mid[Math.floor(Math.random()*mid.length)] +
      down[Math.floor(Math.random()*down.length)]
  ).join('');
}

function dotify(word){ return '•'.repeat(word.length); }

function processText(text){
  const escaped = [...new Set(bannedWords)].map(escapeRegex);
  const rx = new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi');

  return text.replace(rx, word => {
    switch(currentMode){
      case 'blur': return `<span class="blur">${word}</span>`;
      case 'dots': return `<span class="dots">${dotify(word)}</span>`;
      case 'zalgo': return `<span class="zalgo">${zalgoize(word)}</span>`;
      default: return '█'.repeat(word.length);
    }
  });
}

function applyObscure(rawText){
  contentEl.innerHTML = processText(rawText);
}

document.querySelectorAll('#obscureControls button').forEach(btn => {
  btn.addEventListener('click', () => {
    currentMode = btn.dataset.mode;
    document.querySelectorAll('#obscureControls button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if(originalText) applyObscure(originalText);
  });
});

aboutBtn.onclick = () => colophon.classList.add('open');
document.getElementById('closeColophon').onclick = () => colophon.classList.remove('open');

async function loadText(){
  try {
    const resp = await fetch('full.txt');
    if(!resp.ok) throw new Error('Could not load full.txt');
    originalText = await resp.text();
    applyObscure(originalText);

    requestAnimationFrame(()=> {
      maxScroll = contentEl.scrollHeight - viewportEl.clientHeight;
      if(maxScroll < 0) maxScroll = 0;
      start();
    });
  } catch(err) {
    contentEl.textContent = 'Error loading full.txt — ' + err.message;
  }
}

function start(){
  if(running) return;
  running = true;
  lastFrame = performance.now();
  rafId = requestAnimationFrame(tick);
}

function tick(now){
  const dt = (now - lastFrame)/1000;
  viewportEl.scrollTop += speed*dt;
  if(viewportEl.scrollTop >= maxScroll) viewportEl.scrollTop = 0;
  lastFrame = now;
  rafId = requestAnimationFrame(tick);
}

window.addEventListener('load', loadText);