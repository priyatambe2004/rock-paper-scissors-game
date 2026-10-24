const CHOICES = ['rock', 'paper', 'scissors'];
const ICON = { rock: '✊', paper: '✋', scissors: '✌️' };
const BEATS = { rock: 'scissors', paper: 'rock', scissors: 'paper' }; // key beats value
const $ = id => document.getElementById(id);

// ---- game state ----
let score, round, streak, locked, over, playerCounts, rounds;
function newMatch() {
  score = { you: 0, cpu: 0, draw: 0 };
  round = 1; streak = 0; locked = false; over = false;
  playerCounts = { rock: 0, paper: 0, scissors: 0 };
  rounds = [];
  $('banner').hidden = true;
  $('handYou').textContent = '❔';
  $('handCpu').textContent = '❔';
  $('arena').className = 'arena';
  setMessage('Pick your move to start.', '');
  render();
  setButtons(true);
}

// ---- storage (wrapped, because it can be blocked) ----
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
let all = store.get('rps-stats', { w: 0, l: 0, d: 0, best: 0 });

// ---- core logic ----
// Compare two choices: returns 'draw', 'win' (for player) or 'lose'
function getResult(player, computer) {
  if (player === computer) return 'draw';
  return BEATS[player] === computer ? 'win' : 'lose';
}

// Computer's pick: random index into the array, or a counter-move in adaptive mode
function computerPick() {
  const randomPick = () => CHOICES[Math.floor(Math.random() * CHOICES.length)];
  if ($('mode').value === 'adaptive' && round > 3 && Math.random() < 0.6) {
    const favourite = CHOICES.reduce((a, b) => (playerCounts[b] > playerCounts[a] ? b : a));
    return CHOICES.find(c => BEATS[c] === favourite); // the move that beats their favourite
  }
  return randomPick();
}

// ---- playing a round ----
function play(choice) {
  if (locked || over) return;
  locked = true;
  setButtons(false);
  $('arena').className = 'arena';
  setMessage('Rock… paper… scissors…', '');
  ['handYou', 'handCpu'].forEach(id => { $(id).textContent = '✊'; $(id).classList.add('shake'); });

  setTimeout(() => {
    const cpu = computerPick();
    const result = getResult(choice, cpu);
    ['handYou', 'handCpu'].forEach(id => $(id).classList.remove('shake'));
    $('handYou').textContent = ICON[choice];
    $('handCpu').textContent = ICON[cpu];
    finishRound(choice, cpu, result);
  }, 800);
}

function finishRound(choice, cpu, result) {
  playerCounts[choice]++;
  if (result === 'win') { score.you++; streak++; all.w++; all.best = Math.max(all.best, streak); }
  else if (result === 'lose') { score.cpu++; streak = 0; all.l++; }
  else { score.draw++; all.d++; }
  store.set('rps-stats', all);

  const text = { win: 'You win!', lose: 'You lose.', draw: "It's a draw." }[result];
  const detail = result === 'draw' ? `Both chose ${choice}.` : result === 'win' ? `${cap(choice)} beats ${cpu}.` : `${cap(cpu)} beats ${choice}.`;
  setMessage(`${text} ${detail}`, result);
  $('arena').className = 'arena ' + result;

  rounds.unshift({ n: round, you: choice, cpu, result });
  rounds = rounds.slice(0, 8);
  round++;
  render();

  const target = Number($('target').value);
  if (target && (score.you === target || score.cpu === target)) return endMatch(score.you === target);
  locked = false;
  setButtons(true);
}

function endMatch(won) {
  over = true;
  $('bannerTitle').textContent = won ? 'You won the match!' : 'Computer wins the match';
  $('bannerText').textContent = `Final score ${score.you} to ${score.cpu}. ${won ? 'Nice reads.' : 'Rematch?'}`;
  $('banner').hidden = false;
  $('again').focus();
}

// ---- UI helpers ----
const cap = s => s[0].toUpperCase() + s.slice(1);
function setMessage(t, cls) { const m = $('message'); m.textContent = t; m.className = 'message ' + cls; }
function setButtons(on) { document.querySelectorAll('.choice').forEach(b => (b.disabled = !on)); }

function render() {
  $('sYou').textContent = score.you;
  $('sCpu').textContent = score.cpu;
  $('sDraw').textContent = score.draw;
  $('round').textContent = 'Round ' + round;
  $('streak').textContent = 'Streak ' + streak;
  const t = Number($('target').value);
  $('goal').textContent = t ? `First to ${t}` : 'Endless';
  $('aW').textContent = all.w; $('aL').textContent = all.l; $('aD').textContent = all.d; $('aB').textContent = all.best;

  const list = $('log');
  list.innerHTML = '';
  if (!rounds.length) { list.innerHTML = '<li class="empty">Nothing yet.</li>'; return; }
  rounds.forEach(r => {
    const li = document.createElement('li');
    const left = document.createElement('span');
    left.textContent = `#${r.n}  ${ICON[r.you]} vs ${ICON[r.cpu]}`;
    const right = document.createElement('b');
    right.className = r.result;
    right.textContent = { win: 'Win', lose: 'Loss', draw: 'Draw' }[r.result];
    li.append(left, right);
    list.appendChild(li);
  });
}

// ---- events ----
$('choices').addEventListener('click', e => { const b = e.target.closest('.choice'); if (b) play(b.dataset.choice); });
document.addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey || e.altKey || /INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) return;
  const map = { r: 'rock', p: 'paper', s: 'scissors' };
  if (map[e.key.toLowerCase()]) play(map[e.key.toLowerCase()]);
});
$('reset').addEventListener('click', newMatch);   // reset the running score
$('again').addEventListener('click', newMatch);
$('target').addEventListener('change', newMatch);
$('mode').addEventListener('change', () => setMessage('Computer mode changed.', ''));
$('clearStats').addEventListener('click', () => { all = { w: 0, l: 0, d: 0, best: 0 }; store.set('rps-stats', all); render(); });

// ---- theme ----
const tb = $('theme');
function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  tb.textContent = t === 'dark' ? '☀' : '☾';
  tb.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}
tb.addEventListener('click', () => {
  const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(t); store.set('rps-theme', t);
});
applyTheme(store.get('rps-theme', 'dark'));

newMatch();
