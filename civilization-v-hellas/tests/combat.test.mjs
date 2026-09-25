import test from 'node:test';
import assert from 'node:assert/strict';
import {Game, distance} from '../src/engine.js';
import {UNITS} from '../src/data.js';

function battlefield(type='hoplite') {
  const g=new Game();
  g.s.units=[];
  g.s.cities=g.owned();
  g.s.wars=['barbarian'];
  for(const t of g.s.tiles) Object.assign(t,{terrain:'grass',owner:null,road:false,ruin:false,camp:false,explored:true});
  const unit=g.addUnit(type,'greece',g.tile(8,5).id);
  const enemy=g.addUnit('warrior','barbarian',g.tile(9,5).id);
  g.reveal();
  return {g,unit,enemy};
}

test('fortified defender survives one enemy action, wakes and retreats on the new turn',()=>{
  const {g,unit,enemy}=battlefield();
  const attacks=[];
  const attack=g.attack.bind(g);
  g.attack=(attacker,...args)=>{attacks.push(attacker.id);return attack(attacker,...args);};
  g.fortify(unit.id);
  assert.equal(unit.moves,0);
  assert(g.endTurn());
  assert.equal(g.s.turn,2);
  assert.deepEqual(attacks,[enemy.id]);
  assert(unit.hp>0&&unit.hp<100);
  assert(enemy.hp>0&&enemy.hp<100);
  assert.equal(unit.moves,UNITS[unit.type].moves);
  assert.equal(unit.attacked,false);
  assert.equal(unit.sleep,true);
  assert(g.wake(unit.id));
  const hp=unit.hp,enemyHp=enemy.hp;
  assert(g.move(unit.id,g.tile(7,5).id));
  assert.equal(unit.moves,1);
  assert.equal(unit.hp,hp);
  assert.equal(enemy.hp,enemyHp);
  assert.equal(g.s.turn,2);
});

test('defending does not spend movement or attack; a ranged unit can reposition then fire',()=>{
  const {g,unit,enemy}=battlefield('archer');
  g.endTurn();
  assert.equal(unit.moves,2);
  assert.equal(unit.attacked,false);
  assert(g.move(unit.id,g.tile(7,5).id));
  assert.equal(distance(g.at(unit.tile),g.at(enemy.tile)),2);
  assert(g.attack(unit,enemy));
  assert.equal(unit.attacked,true);
  assert.equal(g.attack(unit,enemy),false);
});

test('each end-turn call runs one enemy attack and returns control while both sides live',()=>{
  const {g,unit,enemy}=battlefield();
  for(let i=0;i<2;i++) {
    const before=g.s.turn;
    const enemyXp=enemy.xp;
    g.endTurn();
    assert.equal(g.s.turn,before+1);
    assert.equal(enemy.xp,enemyXp+5);
    assert.equal(unit.xp,0,'no unrequested player attack');
    assert.equal(unit.moves,2);
    assert(g.unit(unit.id)&&g.unit(enemy.id));
  }
});

test('waking during the same turn never refunds movement already spent',()=>{
  const {g,unit}=battlefield();
  g.fortify(unit.id);
  g.wake(unit.id);
  assert.equal(unit.moves,0);
  assert.equal(g.move(unit.id,g.tile(7,5).id),false);
});

test('an explicit attack replaces a standing fortify order',()=>{
  const {g,unit,enemy}=battlefield();
  g.fortify(unit.id);
  g.endTurn();
  assert(g.attack(unit,enemy));
  assert.equal(unit.sleep,false);
  assert.equal(unit.fortified,false);
});

test('entering an enemy zone costs normal movement; crossing that same zone ends movement',()=>{
  const {g,unit,enemy}=battlefield();
  unit.tile=g.tile(7,5).id;
  assert(g.move(unit.id,g.tile(8,5).id));
  assert.equal(unit.moves,1);
  const across=g.neighbors(g.at(unit.tile)).find(t=>distance(t,g.at(enemy.tile))===1&&t.id!==enemy.tile);
  unit.moves=2;
  assert.equal(g.reachable(unit).get(across.id),2);
  const hp=enemy.hp;
  assert(g.move(unit.id,across.id));
  assert.equal(unit.moves,0);
  assert.equal(enemy.hp,hp,'zone of control is movement, not automatic combat');
  assert.equal(unit.attacked,false);
});

test('mounted units also stop when crossing the same enemy zone',()=>{
  const {g,unit,enemy}=battlefield('cavalry');
  const across=g.neighbors(g.at(unit.tile)).find(t=>distance(t,g.at(enemy.tile))===1&&t.id!==enemy.tile);
  assert.equal(g.stepCost(unit,g.at(unit.tile),across,unit.moves),5);
});

test('leaving a zone allows continued retreat',()=>{
  const {g,unit}=battlefield();
  assert(g.move(unit.id,g.tile(7,5).id));
  assert.equal(unit.moves,1);
  assert(g.move(unit.id,g.tile(6,5).id));
  assert.equal(unit.moves,0);
});

test('civilians and peaceful armies do not exert enemy control',()=>{
  const {g,unit,enemy}=battlefield();
  const from=g.at(unit.tile),to=g.neighbors(from).find(t=>distance(t,g.at(enemy.tile))===1&&t.id!==enemy.tile);
  enemy.type='worker';
  assert.equal(g.stepCost(unit,from,to,2),1);
  enemy.type='warrior';g.s.wars=[];
  assert.equal(g.stepCost(unit,from,to,2),1);
});

test('any remaining movement permits the last legal step onto expensive terrain',()=>{
  const {g,unit}=battlefield();
  const to=g.tile(7,5);
  to.terrain='hill';unit.moves=.5;
  assert.equal(g.reachable(unit).get(to.id),.5);
  assert(g.move(unit.id,to.id));
  assert.equal(unit.moves,0);
  assert.equal(g.move(unit.id,g.tile(6,5).id),false);
});

test('roads charge each traversed edge, including after leaving an unroaded starting tile',()=>{
  const {g,unit}=battlefield();
  g.s.units=[unit];
  for(const t of g.s.tiles)t.terrain='mountain';
  for(const c of [8,7,6,5]){const t=g.tile(c,5);t.terrain='grass';t.road=c!==8;}
  const costs=g.reachable(unit);
  assert.equal(costs.get(g.tile(7,5).id),1);
  assert.equal(costs.get(g.tile(6,5).id),1.5);
  assert.equal(costs.get(g.tile(5,5).id),2);
  assert(g.move(unit.id,g.tile(5,5).id));
  assert.equal(unit.moves,0);
});

test('active worker improvements keep movement reserved until the work is done',()=>{
  const {g,unit}=battlefield('worker');
  g.s.units=[unit];
  g.at(unit.tile).owner='greece';
  assert(g.build(unit.id,'farm'));
  g.endTurn();
  assert.equal(unit.moves,0);
  assert(unit.job);
  g.endTurn();
  assert.equal(unit.job,null);
  assert.equal(unit.moves,2);
  assert.equal(g.at(unit.tile).improvement,'farm');
});
