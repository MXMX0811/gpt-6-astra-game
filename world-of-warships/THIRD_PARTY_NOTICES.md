# Third-party notices

## Three.js 0.180.0

The renderer, Water, Sky and BufferGeometryUtils are provided by [Three.js](https://github.com/mrdoob/three.js/tree/r180), licensed under MIT. Copyright © 2010–2025 three.js authors. The complete license is in [licenses/THREE-LICENSE.txt](./licenses/THREE-LICENSE.txt) and included in the generated HTML.

`assets/waternormals.jpg` is the water normal texture supplied with the original game from the [Three.js examples](https://threejs.org/examples/textures/waternormals.jpg). It is retained as a source asset and embedded by esbuild; it is not downloaded at runtime. Three.js repository license: [MIT](https://github.com/mrdoob/three.js/blob/r180/LICENSE).

## esbuild 0.28.2

[esbuild](https://github.com/evanw/esbuild) is the build-time bundler, licensed under MIT. See [licenses/ESBUILD-LICENSE.txt](./licenses/ESBUILD-LICENSE.txt).

## Fonts

The stylesheet requests Noto Sans SC and Rajdhani from Google Fonts. These font families use the SIL Open Font License:

- [Noto Sans SC](https://github.com/google/fonts/tree/main/ofl/notosanssc)
- [Rajdhani](https://github.com/google/fonts/tree/main/ofl/rajdhani)

Font files are not included in this repository. The game makes these external font requests even though its game code and water texture are bundled.

## Original game content

Ship models, islands, interface graphics, effects and synthesized sounds are created in code. The README teaser is a screenshot of the running game. No World of Warships game models, textures or audio are included. This independent project is not affiliated with Wargaming.
