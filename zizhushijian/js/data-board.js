/* ============================================================
 * 悬赏数据看板：fetch 加载 data.json + ECharts 柱状图
 * 复用课堂六模式：加载失败页面内提示不白屏，空数据有明确文案
 * ============================================================ */

const chartEl = document.querySelector('#usage-chart');
const statusEl = document.querySelector('#chart-status');
const metaEl = document.querySelector('#chart-meta');
const statEl = document.querySelector('#stat-cards');

const showStatus = (msg) => {
  statusEl.textContent = msg;
  statusEl.classList.remove('d-none');
};

/* ---------- 概览卡片 ---------- */
const renderStats = (items, unit) => {
  const total = items.reduce((s, it) => s + it.bounty, 0);
  const max = items.reduce((a, b) => (a.bounty >= b.bounty ? a : b));
  const cards = [
    { label: '在榜通缉人数', value: items.length + ' 人', cls: 'bg-ep' },
    { label: '悬赏总额', value: total.toLocaleString() + ' ' + unit, cls: 'bg-vol' },
    { label: '最高单项悬赏', value: max.bounty.toLocaleString() + ' ' + unit, cls: 'bg-award' }
  ];
  statEl.innerHTML = cards.map(c =>
    '<div class="col-12 col-md-4"><div class="card stat-card ' + c.cls + '">' +
    '<div class="card-body py-3">' +
    '<div class="stat-value">' + c.value + '</div>' +
    '<div class="stat-label">' + c.label + '</div>' +
    '</div></div></div>'
  ).join('');
};

/* ---------- 图表 ---------- */
const renderChart = (data) => {
  const meta = data.meta;
  const items = data.items;

  renderStats(items, meta.unit);

  const names = items.map(it => it.name);
  const values = items.map(it => it.bounty);

  const chart = echarts.init(chartEl);
  chart.setOption({
    title: {
      text: meta.title,
      subtext: meta.source,
      left: 'center',
      textStyle: { color: '#2b1d12' }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params) => {
        const p = params[0];
        const it = items[p.dataIndex];
        return it.name + '<br/>' + it.faction + '<br/>悬赏：' +
          it.bounty.toLocaleString() + ' ' + meta.unit +
          '<br/><span style="opacity:.7">' + it.note + '</span>';
      }
    },
    grid: { left: 60, right: 24, top: 90, bottom: 90 },
    xAxis: {
      type: 'category',
      data: names,
      axisLabel: { rotate: 30, color: '#5a4632' }
    },
    yAxis: {
      type: 'value',
      name: '悬赏（' + meta.unit + '）',
      axisLabel: { color: '#5a4632' }
    },
    series: [{
      name: '悬赏金额',
      type: 'bar',
      data: values,
      barMaxWidth: 46,
      itemStyle: {
        borderRadius: [6, 6, 0, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#e08a3c' },
          { offset: 1, color: '#c0392b' }
        ])
      },
      label: { show: true, position: 'top', color: '#922b21' }
    }]
  });

  metaEl.textContent =
    '数据来源：' + meta.source + '　|　统计口径：' + meta.period +
    '　|　单位：' + meta.unit;

  window.addEventListener('resize', () => chart.resize());
};

/* ---------- fetch 加载（file:// 或断网时走失败分支） ---------- */
fetch('data/data.json')
  .then(r => {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  })
  .then(data => {
    if (!data.items || data.items.length === 0) {
      showStatus('档案暂无在榜通缉记录（空数据）。');
      metaEl.textContent = '数据来源：' + data.meta.source;
      return;
    }
    renderChart(data);
  })
  .catch(err => {
    chartEl.innerHTML = '';
    showStatus('悬赏档案加载失败：' + err.message +
      '。请检查网络连接后刷新重试（本页需通过 http:// 本地服务器访问）。');
  });
