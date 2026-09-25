<h1 align="center">gpt-6-astra-game</h1>

<p align="center">
  <b>一句话生成 · 两款可玩的 3D 网页游戏</b><br/>
  GPT-6 在 Codex 中开发的两款游戏：希腊文明回合制策略与钢铁潮汐实时海战。<br/>
  每款游戏只用一句话描述需求，由模型完成规则、场景、交互与可玩页面。
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Prompt-One%20Sentence-8A2BE2?style=for-the-badge" alt="一句话生成" />
  <img src="https://img.shields.io/badge/Games-2-D1B27A?style=for-the-badge" alt="2 Games" />
  <img src="https://img.shields.io/badge/Three.js-r180-049EF4?style=for-the-badge&logo=threedotjs&logoColor=white" alt="Three.js r180" />
  <img src="https://img.shields.io/badge/Build-esbuild-FFCF00?style=for-the-badge" alt="esbuild" />
  <img src="https://img.shields.io/badge/Output-Single_HTML-213C48?style=for-the-badge" alt="Single HTML" />
</p>

<table>
  <tr>
    <td width="50%" align="center"><a href="./civilization-v-hellas/"><img src="./assets/hellas-teaser.jpg" alt="HELLAS 实机画面：雅典与 3D 六角地图" width="100%" /></a><br/><b>HELLAS · 希腊文明</b><br/><sub>建设城市，探索爱琴海，带领希腊走向胜利。</sub></td>
    <td width="50%" align="center"><a href="./world-of-warships/"><img src="./assets/iron-tide-teaser.jpg" alt="IRON TIDE 实机画面：大和号与母港舰队选择" width="100%" /></a><br/><b>IRON TIDE · 钢铁潮汐</b><br/><sub>指挥传奇战舰，在群岛之间争夺制海权。</sub></td>
  </tr>
</table>

<p align="center">
  <a href="#这个仓库是什么">介绍</a> ·
  <a href="#两个游戏">两个游戏</a> ·
  <a href="#提示词原文">提示词原文</a> ·
  <a href="#在线体验">在线体验</a> ·
  <a href="#本地构建">本地构建</a> ·
  <a href="#仓库结构">仓库结构</a> ·
  <a href="#验证">验证</a> ·
  <a href="#致谢">致谢</a>
</p>

---

## 这个仓库是什么

用 GPT-6 在 Codex 中进行的一次游戏生成实践：**每款游戏以一句自然语言需求生成完整的 3D 网页游戏。** 从资料查阅、规则实现、程序化建模到界面、测试和部署，由模型自主完成。

- **一句话生成**：一句话表达完整游戏构想，包含玩法、3D 画面与上线目标，无需逐项编写实现方案。
- **完整游戏工程**：每款游戏使用独立目录，包含模块化源码、素材、构建脚本、锁定依赖和说明文档。
- **可复现构建**：使用 Three.js r180 与 esbuild，各自输出单文件 `dist/index.html`，无需后端。
- **实机展示**：上方 teaser 来自运行中的游戏；在线入口与访问范围列在下方。

## 两个游戏

| 游戏 | 类型 | 源码目录 | JS 模块 | 构建产物 | 在线体验 |
| --- | --- | --- | --- | --- | --- |
| HELLAS · 希腊文明 | 六角格回合制策略 | [`civilization-v-hellas/`](./civilization-v-hellas/) | 9 | 约 785 KB | [公开游玩](https://hellas-age-of-alexander.z1050014709.chatgpt.site) |
| IRON TIDE · 钢铁潮汐 | 5v5 实时海战 | [`world-of-warships/`](./world-of-warships/) | 5 | 约 958 KB | [公开游玩](https://iron-tide-naval-0925.z1050014709.chatgpt.site) |

模块数不含第三方库与测试；大小为当前压缩构建的 HTML 文件大小，未计 HTTP 传输压缩。

### HELLAS · 希腊文明

率领亚历山大的希腊，从雅典出发探索 28 × 20 六角地图。发展人口与经济、研究科技、制定政策，在 4 个城邦、波斯帝国与野蛮人之间运用战争和外交。

6 个时代、39 项科技、30 项政策、20 种单位、22 种建筑与 6 座奇观。希腊拥有重装步兵、伙伴骑兵与城邦影响力加成；支持征服、科技、文化、外交四条胜利路线。战斗包含近战反击、远程攻击、地形防御、控制区、驻扎、晋升与城市占领。

支持中英切换、桌面与触屏、战争迷雾、移动与攻击范围提示，以及自动存档和导入导出。

[玩法、操作与构建说明 →](./civilization-v-hellas/README.md)

### IRON TIDE · 钢铁潮汐

在可旋转的 3D 母港中选择大和、俾斯麦、衣阿华或岛风，驶入北太平洋群岛，参与 5v5 AI 舰队战。舰船具有航行惯性、独立炮塔转向与装填、舰炮弹道、装甲角度、AP / HE 弹种，以及岛风的三组鱼雷发射管。

使用损害管制处理火灾和进水，通过维修、烟幕、水听、侦察机或引擎增压发挥舰船特点。占领 A / B / C 海域持续得分，或击沉敌舰赢得战斗。提供三档难度、战术海图、目标锁定、望远镜、炮弹跟随镜头、合成音效与胜负结算。

推荐电脑键鼠，按 **F1** 查看完整操作；提供基础触屏控制。海面使用 Three.js Water / Sky 与随仓库提供的水面法线贴图。

[舰船、键位与构建说明 →](./world-of-warships/README.md)

## 提示词原文

每款游戏均由下面的一句话需求生成，提示词保留原文。

### HELLAS · 希腊文明

> 尽可能真实地还原文明5中的希腊文明，我需要一个真实的回合制战棋游戏，包括科技树、政策树、各种单位、建筑设施以及敌对城邦以及游戏的各种机制玩法，生成一个3D页面，尽可能发挥你的所有能力。做完之后上传到CDN上，把链接发给我。

### IRON TIDE · 钢铁潮汐

> 尽可能真实地还原战舰世界，我需要一个真实的海战游戏，包括标志性的战舰、游戏的各种键位以及机制玩法，生成一个3D页面，尽可能发挥你的所有能力。做完之后上传到CDN上，把链接发给我。

## 在线体验

| 游戏 | 入口 | 访问范围 |
| --- | --- | --- |
| HELLAS · 希腊文明 | [开始游玩](https://hellas-age-of-alexander.z1050014709.chatgpt.site) | 公开，无需站点所有者账号 |
| IRON TIDE · 钢铁潮汐 | [打开海战](https://iron-tide-naval-0925.z1050014709.chatgpt.site) | 公开，无需站点所有者账号 |

两个游戏均可通过下述方式本地运行。游戏运行不需要 API 密钥、数据库或服务端；字体样式会请求 Google Fonts。

## 本地构建

需要 Node.js 20 或更高版本，以及支持 WebGL 2 的现代浏览器。

```sh
git clone https://github.com/MXMX0811/gpt-6-astra-game.git
cd gpt-6-astra-game

# 选择一个游戏目录
cd civilization-v-hellas
# 或：cd world-of-warships

npm ci
npm test
npm run build

# 在当前游戏目录启动静态服务
python3 -m http.server 4173 --directory dist
```

访问 [本地游戏](http://localhost:4173)。部署到静态托管服务时，上传所选游戏的 `dist/` 即可。

- 每个目录都有独立的 `package.json` 与锁文件，安装和构建互不依赖。
- `node build.mjs --dev` 生成便于调试的不压缩版本。
- 脚本、样式、Three.js 和游戏所需贴图会打包进 HTML；Google Fonts 仍单独加载。

## 仓库结构

```text
.
├── assets/                       # README 的实机 teaser
│   ├── hellas-teaser.jpg
│   └── iron-tide-teaser.jpg
├── civilization-v-hellas/         # HELLAS · 希腊文明
│   ├── src/                      # 规则、数据、3D 世界、界面、双语与音效
│   ├── tests/                    # 回合、战斗与本地化检查
│   ├── index.template.html
│   ├── build.mjs
│   ├── package.json
│   ├── package-lock.json
│   ├── THIRD_PARTY_NOTICES.md
│   └── README.md
├── world-of-warships/             # IRON TIDE · 钢铁潮汐
│   ├── src/                      # main / battle / ships / mechanics / effects
│   ├── assets/                   # 水面法线贴图与图标
│   ├── licenses/                 # 随附第三方许可证
│   ├── tests/                    # 碰撞、装甲、弹种与占点检查
│   ├── index.template.html
│   ├── build.mjs
│   ├── package.json
│   ├── package-lock.json
│   ├── THIRD_PARTY_NOTICES.md
│   └── README.md
├── .gitignore
└── README.md
```

仓库提供完整源码、素材与文档，克隆后按上述步骤构建即可运行。

## 验证

- **HELLAS**：26 项规则测试覆盖文明发展、外交、战斗、移动与胜利；另有中英文本地化检查和最多 80 回合的游戏模拟。
- **钢铁潮汐**：13 项测试覆盖鼠标视角、瞄准、左右转舵、暂停恢复、船体碰撞、岛屿遮挡、AP / HE 装甲与占点。
- **独立构建**：两款游戏均可在各自目录运行 `npm test` 和 `npm run build`。

## 说明

两款游戏都是独立的浏览器致敬作品，与《文明 V》《战舰世界》原厂无关。舰模、场景和部分机制按浏览器体验简化，并非完整移植；不含联网多人。具体范围、规则来源和第三方许可见各游戏目录的 README 与 `THIRD_PARTY_NOTICES.md`。

## 致谢

感谢 [riba2534/claude-opus-5-5-demo](https://github.com/riba2534/claude-opus-5-5-demo) 对 AI 网页游戏创作与展示的启发。
