# HELLAS · 希腊文明

单人 3D 回合制策略游戏。功能、提示词和在线体验见[仓库总览](../README.md)。

## 安装、验证与构建

```sh
npm ci
npm test
npm run build
python3 -m http.server 4173 --directory dist
```

访问 `http://localhost:4173`。`npm run build` 将源码和 Three.js 打包进 `dist/index.html`，不需要后端。

调试构建可以使用 `node build.mjs --dev`，生成不压缩的单文件产物。

## 操作

| 操作 | 方法 |
| --- | --- |
| 选择、移动或攻击 | 点击单位，再点击高亮地块或敌军 |
| 城市管理 | 点击城市名称 |
| 平移地图 | 鼠标拖动；触屏单指拖动 |
| 缩放 | 滚轮；触屏双指缩放 |
| 旋转 | 鼠标右键拖动；Q / E；触屏双指旋转 |
| 结束回合 | Enter 或右下角按钮 |
| 下一单位 | Tab |
| 科技 / 政策 | T / P |
| 驻扎 / 网格 | F / G |
| 指南 / 菜单 | H / Esc |
| 中英文切换 | 顶部“中 / EN”或游戏菜单中的语言按钮 |

蓝色填充与粗边框表示可移动地块，金色表示选中单位，红色表示可攻击目标。“爱琴海”位于固定的三维海域坐标，平移、缩放和旋转地图时与地形一起变化。

语言偏好自动记忆；切换语言保留回合、选中单位、研究和视角。

存档保存在当前浏览器，使用菜单中的导出和导入功能可在设备之间转移。

## 代码职责

`data.js` 定义内容；`engine.js` 处理游戏规则；`world.js` 绘制 3D 场景；`panels.js` 生成管理界面；`app.js` 连接输入、规则、画面与存档；`i18n.js` 使用 i18next 处理双语，`locales/en.js` 保存英文文案。游戏规则与存档中的名称保持稳定，在显示时翻译。

修改源码后重新执行 `npm test` 和 `npm run build`。`dist/` 是构建产物，不直接编辑或提交。

## 已知范围

本作参考《文明 V》的希腊机制，并为浏览器体验调整规则和数值。未实现多人联机、间谍、完整宗教传播、世界议会提案，以及原版的完整科技与兵种列表。

## English

HELLAS is a single-player 3D turn-based strategy game inspired by Greece in Civilization V. Choose **EN** in the top bar or **English** in the game menu. Your language preference is remembered; switching languages keeps your campaign and camera position.

Blue tiles are reachable, gold marks the selected unit, and red marks attack targets. The Aegean Sea label is anchored to the 3D map. Drag to pan, scroll to zoom and right-drag to rotate. Click a unit, then a highlighted tile to move. Use **Enter** to end a turn, **T** for research, **P** for policies and **H** for the guide.

Run `npm ci`, `npm test`, then `npm run build`. Serve `dist/` with a static HTTP server. The generated `dist/index.html` contains the game, Three.js and both languages. Google Fonts is requested separately.
