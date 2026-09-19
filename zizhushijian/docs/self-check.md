# 质量自查记录

自查日期：2026-09-19　方式：Playwright 自动化实测（Chromium）

## 一、三档宽度

| 页面 | 手机 375px | 平板 768px | 桌面 1280px |
|------|-----------|-----------|------------|
| index.html | 导航四入口完整，折叠钮可见且点击可展开菜单 | 导航正常 | 导航正常 |
| characters.html | 同上，卡片单列堆叠 | 两列 | 三列 |
| data.html | 同上，图表随容器缩放 | 正常 | 正常 |
| three-d/scene.html | 同上，画布满屏 | 正常 | 正常 |

三档宽度下 Console 均为 0 错误。

## 二、断网提示

将 `data/data.json` 请求置为失败后刷新 `data.html`：
页面显示黄色警示条「悬赏档案加载失败：Failed to fetch。请检查网络连接后刷新重试
（本页需通过 http:// 本地服务器访问）」，页面其余部分正常显示，不白屏。

## 三、空数据

将 `data.json` 的 `items` 置为空数组后刷新 `data.html`：
显示「档案暂无在榜通缉记录（空数据）。」，无 JS 异常。

## 四、Console 检查

四个页面在桌面宽度下逐一加载：Console error 均为 0。

## 五、发现并修复的问题

1. **手机宽度下 scene.html 导航折叠钮点击无反应**
   原因：编写时漏引 `bootstrap.bundle.min.js`，Collapse 组件未加载。
   修复：补回 script 标签后复测，可正常展开。
2. **首次联调时所有页面 Bootstrap 样式丢失（404）**
   原因：库文件位于 `../school/libs/` 而页面写的是 `../libs/`。
   修复：统一改为 `../school/libs/` 路径后复测通过。
