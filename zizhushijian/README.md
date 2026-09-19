# TRIGUN 星尘导览 · 个人技术整合练习

期末大作业原型。主题：漫画《TRIGUN / TRIGUN MAXIMUM》介绍站点，
延续个人科幻西部风格（沙色 × 锈红配色），整合四个模块。

## 运行说明

必须通过 HTTP 本地服务器访问（`data.html` 用 `fetch` 加载 JSON，
直接双击以 `file://` 打开会因浏览器同源策略取数失败）：

```bash
# 在本仓库根目录（zizhushijian 的上一级）执行
python -m http.server 8765
```

浏览器访问：`http://localhost:8765/zizhushijian/index.html`

## 模块结构

| 模块 | 页面 | 技术 | 说明 |
|------|------|------|------|
| 统一入口 | `index.html` | Bootstrap 5 | 四模块共用导航栏、Hero、模块卡片 |
| 人物图鉴 | `characters.html` | 原生 JS | 阵营按钮 + 关键词搜索即时过滤，含空状态 |
| 悬赏数据 | `data.html` | fetch + ECharts | 柱状图含标题/单位/来源，断网与空数据页面内提示 |
| 沙星三维 | `three-d/scene.html` | Three.js + OrbitControls | 双子太阳、红岩台地、PLANT 营养罐、Punisher 十字架、风车小镇 |

模块衔接：首页文案链接到其余三模块；数据页的人物与图鉴共用同一套设定；
三维沙盘是图鉴中世界观的立体呈现，导航栏与页脚全站一致。

## 资源来源说明

- **图片**：`images/` 下 4 张漫画图（trimax01/04/10/11.jpg）来自本人早期作业
  `D:\vsc\作业\26w\8.31\Mangaintro`，为个人扫描收藏，仅作课程练习使用。
- **文案**：作品背景与人物介绍整理自本人旧页面，事实性信息参考百度百科
  「枪神Trigun」词条与漫画单行本卷首资料。
- **数据**：`data/data.json` 悬赏数值为课程模拟数据（部分取自原作公开设定
  如 Vash 600 亿双元，其余为估值），来源已在页面上标注。
- **第三方库**（均使用本地文件，位于 `../school/libs/`）：
  Bootstrap 5.3（MIT License）、ECharts 5（Apache-2.0）、
  Three.js r128（MIT）、OrbitControls（Three.js examples）。

## Git 提交说明

1. `统一入口与主题样式，人物图鉴筛选交互` —— 页面骨架 + 主题 css + 交互模块
2. `悬赏数据看板，fetch+ECharts柱状图` —— 数据与可视化模块
3. `沙星三维沙盘，README与自查记录` —— 进阶模块 + 文档与记录
