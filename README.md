<h1 align="center">gpt-6-astra-game</h1>

<p align="center">
  <b>自然语言需求 · 可玩的 3D 网页游戏</b><br/>
  GPT-6 在 Codex 中完成开发与迭代，从规则、场景到可直接游玩的网页。<br/>
  当前收录 HELLAS · 希腊文明：以《文明 V》希腊文明为灵感的回合制策略游戏。
</p>

<p align="center">
  <a href="https://hellas-age-of-alexander.z1050014709.chatgpt.site"><b>▶ 在线游玩 HELLAS</b></a> · 中文 / English · 桌面与触屏
</p>

<p align="center">
  <a href="https://hellas-age-of-alexander.z1050014709.chatgpt.site"><img src="./assets/hellas-teaser.jpg" alt="HELLAS 实机画面：雅典、3D 六角地图、蓝色移动范围与文明管理界面" width="100%" /></a><br/>
  <sub>游戏实机截图 · 率领亚历山大的希腊，探索爱琴海，建设城市并书写文明的命运。</sub>
</p>

<p align="center">
  <a href="#这个仓库是什么">介绍</a> ·
  <a href="#游戏项目">游戏</a> ·
  <a href="#提示词原文">提示词</a> ·
  <a href="#在线体验">在线体验</a> ·
  <a href="#本地构建">本地构建</a> ·
  <a href="#生成过程与验证">验证</a> ·
  <a href="#致谢">致谢</a>
</p>

---

## 这个仓库是什么

这里收录由自然语言需求驱动开发的网页游戏及完整源码。HELLAS 从初始需求开始，经过移动范围、地图文字、中英双语、回合与战斗规则等多轮调整；不是未经修改的一次生成结果。

- 浏览器中直接游玩，提供公开在线版本。
- 各游戏使用独立目录，当前项目为 [`civilization-v-hellas/`](./civilization-v-hellas/)。
- 源码、构建方法、规则测试和双语验证一并提供。

## 游戏项目

| 游戏 | 类型 | 源码目录 | 内容 |
| --- | --- | --- | --- |
| HELLAS · 希腊文明 | 3D 六角格回合制策略 | [`civilization-v-hellas/`](./civilization-v-hellas/) | 探索、城市建设、科技、政策、战斗与城邦外交 |

### HELLAS · 希腊文明

率领亚历山大的希腊，从雅典出发，在地中海风格的六角地图上发展文明。

- **世界与探索**：28 × 20 六角格地图、可旋转 3D 视角、战争迷雾、古代遗迹、野蛮人营地与领土边界。
- **文明发展**：6 个时代、39 项科技、6 条政策分支、30 项政策、20 种单位、22 种建筑、6 座奇观和 6 类地块改良。
- **希腊特色**：希腊同盟、重装步兵、伙伴骑兵；城邦影响力衰减减半、负值恢复速度加倍。
- **城市与经济**：人口与粮食、生产与建筑、科研、文化、金币、幸福度、信仰、战略资源与奢侈资源。
- **外交与战争**：4 个城邦、波斯帝国、野蛮人；赠礼、委托、贸易、议和、宣战、敌军寻路与增援。
- **战术玩法**：近战、远程攻击、地形防御、驻扎治疗、经验晋升、升级和城市占领；控制区、地形与道路影响移动，防守后可在新回合调整位置或撤退。
- **胜利与存档**：征服、科技、文化、外交四种胜利；自动保存、手动保存和存档文件导入导出。
- **交互**：桌面键鼠、触屏、游戏内百科与可选环境音乐；顶部“中 / EN”随时切换中文和英文，并记住语言偏好。
- **地图反馈**：蓝色填充与粗边框标示移动范围，金色标示当前单位，红色标示攻击目标；爱琴海名称固定在三维地图坐标上。

这是独立的浏览器策略游戏。它对部分系统和数值进行了简化，并非《文明 V》的完整移植；未包含多人联机、间谍、世界议会提案和完整宗教传播系统。

## 提示词原文

> 尽可能真实地还原文明5中的希腊文明，我需要一个真实的回合制战棋游戏，包括科技树、政策树、各种单位、建筑设施以及敌对城邦以及游戏的各种机制玩法，生成一个3D页面，尽可能发挥你的所有能力。做完之后上传到CDN上，把链接发给我。

## 在线体验

[打开 HELLAS · 希腊文明](https://hellas-age-of-alexander.z1050014709.chatgpt.site)

**公开访问，无需站点所有者账号。** 点击链接即可游玩，使用顶部“中 / EN”切换语言。

线上版本与仓库使用同一套游戏源码。游戏进度保存在浏览器中；菜单支持导出、导入存档。向 GitHub 推送代码不会自动更新现有站点。

## 本地构建

需要 Node.js 20 或更高版本。

```sh
git clone https://github.com/MXMX0811/gpt-6-astra-game.git
cd gpt-6-astra-game/civilization-v-hellas
npm ci
npm test
npm run build
```

构建产物为 `civilization-v-hellas/dist/index.html`。JavaScript、CSS 与 Three.js 打包在同一个 HTML 中；字体样式仍会请求 Google Fonts，因此不声称完全没有外部请求。

使用静态 HTTP 服务运行，例如：

```sh
python3 -m http.server 4173 --directory dist
```

打开 [本地游戏](http://localhost:4173)。需要支持 WebGL 2 的现代浏览器。

部署时上传整个 `civilization-v-hellas/dist/` 目录即可。无需数据库、服务端、API 密钥或运行时环境变量。

## 仓库结构

```text
.
├── assets/hellas-teaser.jpg    # 实机预览
├── civilization-v-hellas/
│   ├── src/
│   │   ├── app.js              # 界面控制、存档、输入与 WebMCP
│   │   ├── data.js             # 科技、政策、单位、建筑与资源
│   │   ├── engine.js           # 回合规则、经济、战斗与敌军决策
│   │   ├── world.js            # 3D 地图、城市、单位与交互
│   │   ├── panels.js           # 科技树、政策、城市、外交与百科
│   │   ├── i18n.js             # 中英文切换、格式化与战报翻译
│   │   ├── locales/en.js       # 英文文案
│   │   ├── icons.js            # 界面图标
│   │   ├── sound.js            # 环境音乐
│   │   └── style.css           # 桌面与触屏界面
│   ├── tests/
│   │   ├── engine.test.mjs     # 游戏规则验证
│   │   ├── combat.test.mjs     # 防守、撤退、控制区与移动回归
│   │   └── i18n.test.mjs       # 文案、面板和战报双语验证
│   ├── index.template.html    # 页面模板
│   ├── build.mjs              # esbuild 单文件构建
│   ├── package.json
│   ├── package-lock.json
│   ├── THIRD_PARTY_NOTICES.md
│   └── README.md
├── .gitignore
└── README.md
```

`node_modules/`、`dist/`、本地存档、临时文件和托管平台账号配置均不入库。

## 生成过程与验证

游戏在 Codex 会话中完成规则资料查阅、源码编写、3D 场景制作、界面验证与站点部署，并根据实际游玩反馈持续修正。

- **26 项规则测试**：14 项基础检查与 12 项战斗回归，覆盖科研、城市、外交、胜利，以及驻扎受击后唤醒撤退、移动后攻击、单次敌方行动、控制区、地形和道路计费。
- **回合模拟**：最多推进 80 回合；若先达成胜负结局，则正常结束并检查状态。
- **双语验证**：检查文案插值、科技、政策、生产、外交、百科、信仰、伟人、胜利面板与模拟战报，确认语言切换不改变存档。
- **浏览器验证**：检查实际 3D 画面、回合推进、驻扎与唤醒、移动、双语切换及新增规则说明。顶部 teaser 来自实机截图。

每次结束回合只执行一轮敌方行动。敌军可以在自己的回合攻击，己方近战防守会造成反击伤害；新回合恢复行动点，玩家可以重新选择行动。沿同一敌军控制区横移会耗尽剩余移动力，离开其控制区则正常计费。按住 Enter 不会连续推进回合。

## 资料与第三方组件

- [《Civilization V》官方手册](https://support.civilization.com/hc/en-us/articles/37707647846803-Civilization-V-Digital-Manual)
- [希腊文明机制参考](https://civilization.fandom.com/wiki/Greek_(Civ5))
- [Three.js](https://threejs.org/)：3D 引擎，MIT 许可。
- [i18next](https://www.i18next.com/)：中英文本地化与插值，MIT 许可。
- [esbuild](https://esbuild.github.io/)：构建工具，MIT 许可。
- 字体与许可说明见 [`civilization-v-hellas/THIRD_PARTY_NOTICES.md`](./civilization-v-hellas/THIRD_PARTY_NOTICES.md)。

原创 3D 场景和模型由代码生成，未复制《文明 V》的游戏素材。本项目与《文明 V》原厂无关。

## 致谢

感谢 [riba2534/claude-opus-5-5-demo](https://github.com/riba2534/claude-opus-5-5-demo) 对 AI 网页游戏创作与展示的启发。
