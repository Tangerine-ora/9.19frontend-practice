/* ============================================================
 * 人物图鉴：阵营筛选 + 关键词搜索
 * 复用课堂五「状态在数组，界面只是投影」模式
 * ============================================================ */

/* ---------- 数据：写死在 JS 数组 ---------- */
const characters = [
  {
    name: 'Vash the Stampede',
    epithet: '人形台风',
    faction: 'protagonist',
    factionName: '主角一行',
    desc: '沙星第一大通缉犯，悬赏600亿双元，失落七月的罪魁祸首。真身是独立种PLANT，信奉爱与和平，从不杀人。',
    image: 'images/trimax11.jpg'
  },
  {
    name: 'Nicholas D. Wolfwood',
    epithet: ' Punisher',
    faction: 'protagonist',
    factionName: '主角一行',
    desc: '牧师，武器是巨大的十字架型枪械，黑色西装墨镜，现实主义者。米迦勒之眼培养的改造杀手，为人形台风的盟友。',
    image: 'images/trimax10.jpg'
  },
  {
    name: 'Million Knives',
    epithet: '独立种',
    faction: 'gunho',
    factionName: 'GUN-HO-GUN',
    desc: '独立种PLANT，Vash的胞兄。因目睹人类对Tessla的暴行而引发大坠落，GUN-HO-GUN的首领，决心毁灭人类。',
    image: 'images/trimax04.jpg'
  },
  {
    name: 'Legato Bluesummers',
    epithet: 'GUN-HO-GUN',
    faction: 'gunho',
    factionName: 'GUN-HO-GUN',
    desc: 'Knives的忠实部下，操纵GUN-HO-GUN追杀Vash，拥有以丝线操控他人身体的能力。',
    image: null,
    color: '#922b21'
  },
  {
    name: 'Livio / Razlo',
    epithet: 'Double Fang',
    faction: 'eye',
    factionName: '米迦勒之眼',
    desc: 'Wolfwood在孤儿院的挚友，双重人格：温和的Livio与杀人魔Razlo，使用双管十字枪。',
    image: null,
    color: '#5b2a9e'
  },
  {
    name: 'Chapel the Evergreen',
    epithet: 'Master C',
    faction: 'eye',
    factionName: '米迦勒之眼',
    desc: '米迦勒之眼的杀手、Wolfwood的师父，使用双枪与GUN-HO-GUN成员，被组织当作棋子。',
    image: null,
    color: '#7d3c98'
  },
  {
    name: 'Rem Saverem',
    epithet: 'SEEDS船员',
    faction: 'crew',
    factionName: 'SEEDS船员',
    desc: '移民飞船SEEDS上的船员，Vash与Knives的养母。大坠落时牺牲自己救下两兄弟与一艘飞船。',
    image: null,
    color: '#2e6b27'
  }
];

/* ---------- 状态 ---------- */
let currentFaction = 'all';
let currentKeyword = '';

const listEl = document.querySelector('#char-list');
const countEl = document.querySelector('#char-count');
const factionBar = document.querySelector('.filter-bar');
const searchEl = document.querySelector('#char-search');

/* ---------- 统一渲染 ---------- */
const render = () => {
  listEl.innerHTML = '';

  const shown = characters.filter(c => {
    const factionOk = currentFaction === 'all' || c.faction === currentFaction;
    const kw = currentKeyword.toLowerCase();
    const keywordOk =
      kw === '' ||
      c.name.toLowerCase().includes(kw) ||
      c.epithet.toLowerCase().includes(kw) ||
      c.desc.toLowerCase().includes(kw);
    return factionOk && keywordOk;
  });

  countEl.textContent = '共 ' + shown.length + ' 位人物';

  if (shown.length === 0) {
    listEl.innerHTML =
      '<div class="col-12"><p class="text-center text-muted py-5 mb-0">没有匹配的人物，换个阵营或关键词试试</p></div>';
    return;
  }

  shown.forEach(c => {
    const portrait = c.image
      ? '<img src="' + c.image + '" alt="' + c.name + '" class="char-portrait">'
      : '<div class="char-avatar" style="background:' + c.color + '">' + c.name.charAt(0) + '</div>';

    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';
    col.innerHTML =
      '<div class="card char-card h-100">' +
        portrait +
        '<div class="card-body">' +
          '<div class="d-flex justify-content-between align-items-center">' +
            '<h2 class="h6 card-title mb-0">' + c.name + '</h2>' +
            '<span class="char-faction fac-' + c.faction + '">' + c.factionName + '</span>' +
          '</div>' +
          '<p class="small text-muted mt-1 mb-2">「' + c.epithet + '」</p>' +
          '<p class="small text-muted mb-0">' + c.desc + '</p>' +
        '</div>' +
      '</div>';
    listEl.appendChild(col);
  });
};

/* ---------- 阵营按钮（事件委托） ---------- */
factionBar.addEventListener('click', (e) => {
  if (e.target.tagName !== 'BUTTON') return;
  currentFaction = e.target.dataset.faction;
  factionBar.querySelectorAll('button').forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');
  render();
});

/* ---------- 搜索：输入即过滤 ---------- */
searchEl.addEventListener('input', (e) => {
  currentKeyword = e.target.value.trim();
  render();
});

render();
