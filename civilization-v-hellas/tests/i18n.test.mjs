import assert from 'node:assert/strict';
import {Game} from '../src/engine.js';
import * as data from '../src/data.js';
import * as panels from '../src/panels.js';
import {L,setLanguage,eventText} from '../src/i18n.js';
import {en} from '../src/locales/en.js';

setLanguage('en');
let checks=0;
const english=(text,context)=>{assert.equal(/[\u3400-\u9fff]/.test(text),false,context+': '+text.match(/.{0,30}[\u3400-\u9fff].{0,30}/)?.[0]);checks++;};
for(const[key,value]of Object.entries(en)){
 english(value,key);
 assert.deepEqual([...key.matchAll(/\{\{(\w+)\}\}/g)].map(m=>m[1]).sort(),[...value.matchAll(/\{\{(\w+)\}\}/g)].map(m=>m[1]).sort(),key);
}
function definitions(value){if(typeof value==='string'&&/[\u3400-\u9fff]/.test(value))english(L(value),'data');else if(value&&typeof value==='object')Object.values(value).forEach(definitions);}
Object.values(data).forEach(definitions);
const g=new Game(),state=g.serialize();
const city=g.owned()[0],worker=g.s.units.find(u=>u.type==='worker'),warrior=g.s.units.find(u=>u.type==='warrior');
function renderAll(){
 for(const tab of ['unit','building','wonder'])english(panels.cityPanel(g,city.id,tab),'city '+tab);
 for(const c of g.s.cities.filter(c=>c.owner!=='greece'))english(panels.cityPanel(g,c.id),'foreign city');
 for(const name of ['techPanel','policyPanel','diplomacyPanel','empirePanel','faithPanel','greatPanel'])english(panels[name](g),name);
 english(panels.improvePanel(g,worker.id),'improvements');
 english(panels.promotePanel(g,warrior.id),'promotions');
 english(panels.helpPanel(),'guide');
 english(panels.menuPanel(true,true).replace('中文',''),'menu');
 for(const e of g.s.log)english(eventText(e.text),'chronicle');
}
renderAll();
setLanguage('zh');assert.equal(L('勇士'),'勇士');assert.equal(g.serialize(),state,'Switching languages does not change the save');
setLanguage('en');
g.s.techs=data.TECHS.map(t=>t.id);g.s.policies=Object.keys(data.POLICY);g.s.pantheon='wisdom';g.s.religion='learning';g.s.greatPeople=2;g.s.routes=[{owner:'knossos',gold:4,science:2,left:20}];g.s.influence.knossos=70;g.s.gold=5000;g.s.culture=1000;
renderAll();
g.win('科技胜利','阿波罗计划完成。希腊的求知精神抵达了群星。');english(panels.victoryPanel(g),'victory');
const simulation=new Game();
for(let i=0;i<80&&!simulation.s.victory;i++){
 if(!simulation.s.research){const available=data.TECHS.find(t=>simulation.techAvailable(t.id));if(available)simulation.research(available.id);}
 simulation.endTurn();
 for(const e of simulation.s.log)english(eventText(e.text),'simulated chronicle');
}
if(simulation.s.victory)english(panels.victoryPanel(simulation),'simulation ending');
assert.equal(eventText('勇士击败重装步兵。'),'Warrior defeated Hoplite.');
assert.equal(eventText('研究完成：青铜器。请选择下一项科技。'),'Research complete: Bronze Working. Choose your next technology.');
assert.equal(eventText('缔结和约需要 150 金币。'),'A peace treaty costs 150 Gold.');
console.log(`PASS bilingual coverage: ${checks} translations and rendered views; save unchanged; 80-turn chronicle or game ending`);
