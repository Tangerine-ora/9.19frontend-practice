/* ============================================================
 * 自习室查询：楼层 / 开放状态即时筛选
 * 复用课堂五模式：状态在数组，界面只是投影
 * ============================================================ */

/* ---------- 数据：写死在 JS 数组 ---------- */
const rooms = [
  { name: '图书馆一楼大厅自习区', floor: 1, open: true,  seats: 120, occupied: 78,  hours: '07:30 - 22:30' },
  { name: '图书馆二楼安静自习室', floor: 2, open: true,  seats: 80,  occupied: 80,  hours: '08:00 - 22:00' },
  { name: '图书馆三楼电子阅览室', floor: 3, open: true,  seats: 60,  occupied: 35,  hours: '08:30 - 21:30' },
  { name: '教学楼A101自习室',     floor: 1, open: true,  seats: 50,  occupied: 22,  hours: '08:00 - 22:00' },
  { name: '教学楼A203自习室',     floor: 2, open: false, seats: 45,  occupied: 0,   hours: '维护中，暂停开放' },
  { name: '厚德书院三楼自习室',   floor: 3, open: true,  seats: 72,  occupied: 61,  hours: '07:00 - 23:00' },
  { name: '厚德书院四楼研讨区',   floor: 4, open: true,  seats: 40,  occupied: 18,  hours: '09:00 - 22:00' },
  { name: '理科楼B401自习室',     floor: 4, open: false, seats: 55,  occupied: 0,   hours: '周末闭馆' },
  { name: '文科楼C302自习室',     floor: 3, open: true,  seats: 64,  occupied: 40,  hours: '08:00 - 22:00' }
];

/* ---------- 筛选状态 ---------- */
let currentFloor = 'all';    // all / 1 / 2 / 3 / 4
let currentStatus = 'all';   // all / open / closed

/* ---------- DOM 引用 ---------- */
const listEl = document.querySelector('#room-list');
const countEl = document.querySelector('#room-count');
const floorFilters = document.querySelector('#floor-filters');
const statusFilters = document.querySelector('#status-filters');

/* ---------- 统一渲染：数组 → 界面 ---------- */
const render = () => {
  listEl.innerHTML = '';

  // 按当前两个条件过滤
  const shown = rooms.filter(room => {
    const floorOk = currentFloor === 'all' || String(room.floor) === currentFloor;
    const statusOk =
      currentStatus === 'all' ? true :
      currentStatus === 'open' ? room.open : !room.open;
    return floorOk && statusOk;
  });

  countEl.textContent = '共找到 ' + shown.length + ' 间自习室';

  // 空状态
  if (shown.length === 0) {
    listEl.innerHTML =
      '<div class="col-12"><p class="text-center text-muted py-4 mb-0">没有符合条件的自习室，换个筛选条件试试</p></div>';
    return;
  }

  shown.forEach(room => {
    const free = room.seats - room.occupied;
    const badge = room.open
      ? '<span class="badge text-bg-success">开放中</span>'
      : '<span class="badge text-bg-secondary">已闭馆</span>';
    const seatBar = room.open
      ? '<div class="progress my-2" style="height: 6px;">' +
          '<div class="progress-bar ' + (free === 0 ? 'bg-danger' : '') + '" ' +
          'style="width: ' + Math.round((room.occupied / room.seats) * 100) + '%"></div>' +
        '</div>'
      : '';
    const seatText = room.open
      ? '<span class="' + (free === 0 ? 'text-danger' : 'text-success') + '">剩余座位 ' + free + '</span> / ' + room.seats
      : '<span class="text-muted">—</span>';

    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';
    col.innerHTML =
      '<div class="card h-100 room-card">' +
        '<div class="card-body">' +
          '<div class="d-flex justify-content-between align-items-start">' +
            '<h3 class="h6 card-title mb-0">' + room.name + '</h3>' + badge +
          '</div>' +
          '<p class="small text-muted mb-1 mt-2">' + room.floor + '楼 · ' + room.hours + '</p>' +
          seatBar +
          '<p class="small mb-0">' + seatText + ' 个座位</p>' +
        '</div>' +
      '</div>';
    listEl.appendChild(col);
  });
};

/* ---------- 事件委托：楼层按钮 ---------- */
floorFilters.addEventListener('click', (e) => {
  if (e.target.tagName !== 'BUTTON') return;
  currentFloor = e.target.dataset.floor;
  // 切换 active 样式
  floorFilters.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
  e.target.classList.add('active');
  render();   // 改状态 → 重新投影
});

/* ---------- 事件委托：开放状态按钮 ---------- */
statusFilters.addEventListener('click', (e) => {
  if (e.target.tagName !== 'BUTTON') return;
  currentStatus = e.target.dataset.status;
  statusFilters.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
  e.target.classList.add('active');
  render();
});

/* 首次渲染 */
render();
