/* ============================================================
 * 使用统计：fetch 加载 data.json，ECharts 柱状图
 * 复用课堂六模式：异步取数 → setOption 渲染
 * ============================================================ */

const DATA_URL = 'data/data.json';

const chartMeta = document.querySelector('#chart-meta');
const chartStatus = document.querySelector('#chart-status');

let usageChart = null;   // ECharts 实例，懒初始化

/* ---------- 渲染柱状图 ---------- */
const renderChart = (data) => {
  if (usageChart === null) {
    usageChart = echarts.init(document.querySelector('#usage-chart'));
  }

  usageChart.setOption({
    title: {
      text: data.title,
      subtext: '统计周期：' + data.period,
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const p = params[0];
        return p.name + '<br/>使用量：' + p.value + ' ' + data.unit;
      }
    },
    grid: { left: 60, right: 30, top: 80, bottom: 40 },
    xAxis: {
      type: 'category',
      data: data.rooms,
      axisLabel: { interval: 0, rotate: 30 }
    },
    yAxis: {
      type: 'value',
      name: '单位：' + data.unit,
      minInterval: 100,
      beginAtZero: true   // 数值轴必须从 0 开始，不夸大差异
    },
    series: [{
      name: '使用量',
      type: 'bar',
      data: data.usage,
      barMaxWidth: 42,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#0d6efd' },
          { offset: 1, color: '#6ea8fe' }
        ])
      },
      label: {
        show: true,
        position: 'top',
        fontSize: 11,
        color: '#495057'
      }
    }]
  });
};

/* ---------- 异步加载数据 ---------- */
const loadData = async () => {
  chartStatus.classList.add('d-none');
  chartMeta.textContent = '正在加载数据…';

  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) {
      throw new Error('HTTP 错误：' + response.status);
    }
    const data = await response.json();

    if (!Array.isArray(data.usage) || data.usage.length === 0) {
      throw new Error('数据为空');
    }

    // 标题、单位与数据来源
    chartMeta.textContent =
      '数据来源：' + data.source + '　|　统计周期：' + data.period +
      '　|　单位：' + data.unit;

    renderChart(data);
  } catch (error) {
    // 断网或文件缺失：页面内提示，不白屏
    chartMeta.textContent = '';
    chartStatus.classList.remove('d-none');
    chartStatus.textContent = '统计数据加载失败：' + error.message + '，请检查网络连接后刷新重试。';
    console.error('data.json 加载失败：', error);
  }
};

/* ---------- 窗口变化：图表自适应 ---------- */
window.addEventListener('resize', () => {
  if (usageChart !== null) {
    usageChart.resize();
  }
});

loadData();
