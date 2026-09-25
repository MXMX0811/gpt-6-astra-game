# gpt-6-astra-game

3D 网页游戏项目集合。目前包含 **HELLAS · 希腊文明**：一个参考《文明 V》希腊文明机制制作的单人回合制策略游戏。

[游戏项目](#游戏项目) · [提示词原文](#提示词原文) · [在线体验](#在线体验) · [本地构建](#本地构建) · [仓库结构](#仓库结构) · [生成过程与验证](#生成过程与验证)

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
- **战术玩法**：近战、远程攻击、地形防御、驻扎治疗、经验晋升、升级和城市占领。
- **胜利与存档**：征服、科技、文化、外交四种胜利；自动保存、手动保存和存档文件导入导出。
- **交互**：桌面键鼠、触屏、游戏内百科与可选环境音乐；顶部“中 / EN”随时切换中文和英文，并记住语言偏好。
- **地图反馈**：蓝色填充与粗边框标示移动范围，金色标示当前单位，红色标示攻击目标；爱琴海名称固定在三维地图坐标上。

这是独立的浏览器策略游戏。它对部分系统和数值进行了简化，并非《文明 V》的完整移植；未包含多人联机、间谍、世界议会提案和完整宗教传播系统。

## 提示词原文

> 尽可能真实地还原文明5中的希腊文明，我需要一个真实的回合制战棋游戏，包括科技树、政策树、各种单位、建筑设施以及敌对城邦以及游戏的各种机制玩法，生成一个3D页面，尽可能发挥你的所有能力。做完之后上传到CDN上，把链接发给我。

## 在线体验

[打开 HELLAS · 希腊文明](https://hellas-age-of-alexander.z1050014709.chatgpt.site)

**当前部署仅站点所有者账号可访问。** 此仓库包含完整源码，其他人可以按下方步骤本地运行或部署到自己的静态站点服务。

线上版本使用同一套游戏源码；本仓库按下述结构整理，并增加单文件 HTML 构建。向 GitHub 推送代码不会自动更新现有站点。

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

目录组织参考 [riba2534/claude-opus-5-5-demo](https://github.com/riba2534/claude-opus-5-5-demo)，每个游戏放在独立目录中。

```text
.
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

游戏在 Codex 的同一会话内完成规则资料查阅、源代码编写、3D 场景制作、界面操作验证与站点部署。随后根据用户要求，参考上述仓库结构整理了这个 GitHub 项目。

- **14 项规则检查**：覆盖移动、科研、生产、人口增长、工人改良、城邦防御范围、政策、建城、影响力、贸易、战斗、胜利、信仰、伟人与敌军回合。
- **回合模拟**：持续推进游戏，验证状态数值与战争行为；到达胜负结局时正常终止。
- **浏览器验证**：确认 3D 地图、城市工作重心、购买单位、设施建设、回合推进与自动存档恢复。
- **接口验证**：检查 WebMCP 研究切换，前置科技不满足时明确拒绝。
- **修正记录**：修复敌军绕山寻路、城邦开局防御、移动范围辨识度与地图海域文字定位。
- **双语验证**：科技、政策、生产、外交、百科、信仰、伟人及胜利面板均检查英文覆盖；模拟战报逐条验证；切换语言不改变存档。浏览器中验证了研究切换、回合推进及语言切换后保留当前视角。

## 资料与第三方组件

- [《Civilization V》官方手册](https://support.civilization.com/hc/en-us/articles/37707647846803-Civilization-V-Digital-Manual)
- [希腊文明机制参考](https://civilization.fandom.com/wiki/Greek_(Civ5))
- [Three.js](https://threejs.org/)：3D 引擎，MIT 许可。
- [i18next](https://www.i18next.com/)：中英文本地化与插值，MIT 许可。
- [esbuild](https://esbuild.github.io/)：构建工具，MIT 许可。
- 字体与许可说明见 [`civilization-v-hellas/THIRD_PARTY_NOTICES.md`](./civilization-v-hellas/THIRD_PARTY_NOTICES.md)。

原创 3D 场景和模型由代码生成，未复制《文明 V》的游戏素材。本项目与《文明 V》原厂无关。
