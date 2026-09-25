import i18next from 'i18next';
import {en} from './locales/en.js';

export let language = 'zh';
const i18n = i18next.createInstance();
i18n.init({
  lng: language,
  supportedLngs: ['zh', 'en'],
  fallbackLng: false,
  initAsync: false,
  keySeparator: false,
  nsSeparator: false,
  resources: {
    zh: {translation: Object.fromEntries(Object.keys(en).map(key => [key, key]))},
    en: {translation: en},
  },
  interpolation: {escapeValue: false},
});

export function setLanguage(next) {
  if (next !== 'zh' && next !== 'en') throw new Error('Unsupported language');
  language = next;
  i18n.changeLanguage(next);
}

// Source phrases are translation keys. Gameplay data stays language independent.
export function L(key, values = {}) {
  if (key === undefined || key === null) return key;
  if (!/[\u3400-\u9fff]/.test(key)) return key;
  if (!Object.hasOwn(en, key)) throw new Error(`Missing translation: ${key}`);
  return i18n.t(key, values);
}

// Saved chronicles retain their original text. Match complete event sentences,
// then translate their names and numbers without modifying the save format.
const eventKeys = [
  '采纳政策：{{v0}}。', '完成城邦委托：{{v0}}影响力 +45。',
  '{{v0}}被{{v1}}占领！', '{{v0}}击败{{v1}}。', '{{v0}}在战斗中阵亡。',
  '{{v0}}建成。新的城邦加入希腊！', '工人完成{{v0}}。', '{{v0}}完成{{v1}}。',
  '你向{{v0}}宣战。', '缔结和约需要 {{v0}} 金币。',
  '{{v0}}的守军发动远程攻击。', '研究完成：{{v0}}。请选择下一项科技。',
  '{{v0}}人口增长至 {{v1}}。', '{{v0}}发生饥荒，失去 1 人口。',
  '200 回合结束。希腊的最终文明评分为 {{v0}}。',
];
const patterns = [...eventKeys].sort((a,b) => b.replace(/\{\{v\d+\}\}/g, "").length - a.replace(/\{\{v\d+\}\}/g, "").length).map(key => ({
  key,
  regex: new RegExp('^' + key.split(/\{\{v\d+\}\}/)
    .map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('(.+?)') + '$'),
}));

export function eventText(text) {
  if (language === 'zh' || !/[\u3400-\u9fff]/.test(text)) return text;
  if (Object.hasOwn(en, text)) return L(text);
  for (const {key, regex} of patterns) {
    const match = text.match(regex);
    if (match) return L(key, Object.fromEntries(match.slice(1).map((value, i) => [`v${i}`, eventText(value)])));
  }
  throw new Error(`Unknown game message: ${text}`);
}
