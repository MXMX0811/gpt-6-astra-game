import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {SHIPS,SPEED_PER_KNOT} from '../src/ships.js';
import {Battle} from '../src/battle.js';
import {ISLANDS,MAP_HALF_SIZE,CAPTURE_ZONES,fleetDeployment,hullTouchesLand,battleCourse} from '../src/battlefield.js';
import {captureStep,distance,angleDiff} from '../src/mechanics.js';

function fleet(selected='yamato'){
  const game=Object.create(Battle.prototype);
  Object.assign(game,{group:new T.Group(),entities:[],smokes:[],islands:ISLANDS,caps:CAPTURE_ZONES.map(c=>({...c,owner:-1,progress:0})),consumables:{boost:{active:0}},selected,keys:new Set(),time:0,difficulty:'normal',effects:{emit(){}},message(){},damageShip(){},fire(){},fireTorpedoes(){}});
  for(const entry of fleetDeployment(selected)){
    const e=game.spawn(entry.id,entry.team,entry.x,entry.z,entry.heading,entry.player);e.lane=entry.lane;e.flank=entry.flank;
    if(entry.player)game.player=e;
  }
  game.player.torpBanks=[0,0,0];game.player.torpCool=0;
  return game;
}

test('every ship choice deploys both fleets in open water with clear approach corridors',()=>{
  for(const selected of Object.keys(SHIPS)){
    const game=fleet(selected);
    for(const ship of game.entities){
      assert.equal(hullTouchesLand(ship,ISLANDS),false,`${selected}/${ship.id} spawned ashore`);
      for(const island of ISLANDS)assert.ok(distance(ship,island)>island.r+ship.mesh.userData.L*.5+300);
      for(let travelled=0;travelled<=350;travelled+=25)
        assert.equal(hullTouchesLand({...ship,x:ship.x+Math.sin(ship.heading)*travelled,z:ship.z+Math.cos(ship.heading)*travelled},ISLANDS),false);
      for(const other of game.entities){if(other===ship)continue;
        if(ship.team!==other.team)assert.ok(distance(ship,other)>=3100);
        else assert.ok(distance(ship,other)>(ship.mesh.userData.L+other.mesh.userData.L)*1.5);
      }
    }
  }
});

test('coastline collision covers the whole hull and respects its heading',()=>{
  const ship=fleet().player,island={x:0,z:0,r:100};
  ship.x=0;ship.z=145;ship.heading=0;
  assert.equal(hullTouchesLand(ship,[island]),true,'bow should collide while center is outside the island');
  ship.heading=Math.PI/2;assert.equal(hullTouchesLand(ship,[island]),false);
  ship.z=170;ship.heading=0;assert.equal(hullTouchesLand(ship,[island]),false);
});

test('ships stop before driving or rotating their hull into land',()=>{
  const game=fleet(),ship=game.player;game.islands=[{x:0,z:0,r:100}];
  Object.assign(ship,{x:0,z:166,heading:Math.PI,speed:15});ship.mesh.rotation.y=Math.PI;
  game.throttle=5;game.lockRudder=0;game.aim=new T.Vector3(0,4,-1000);
  for(let i=0;i<100;i++){game.time+=.05;game.updateShip(ship,.05,game.time);assert.equal(hullTouchesLand(ship,game.islands),false);}
});

test('battleships disengage before close combat and destroyers keep torpedo distance',()=>{
  for(const ship of fleet().entities){
    const target={x:ship.x,z:ship.z-ship.spec.engagementRange*.6};
    const course=battleCourse(ship,target,{x:0,z:0});
    const toTarget=Math.atan2(target.x-ship.x,target.z-ship.z);
    assert.ok(Math.cos(angleDiff(course.heading,toTarget))<-.8,ship.id+' should turn away');
    if(ship.spec.torps)assert.ok(ship.spec.engagementRange<ship.spec.torpedo.range);
    else assert.ok(ship.spec.engagementRange>=1450);
  }
});

test('movement per reload and torpedo warning time leave room for reaction',()=>{
  for(const spec of Object.values(SHIPS)){
    const distancePerReload=spec.knots*SPEED_PER_KNOT*spec.reload;
    assert.ok(distancePerReload<115);
    if(!spec.torps)assert.ok(spec.reload>=8&&spec.reload<=10);
  }
  const torpedo=SHIPS.shimakaze.torpedo;
  const warning=torpedo.warningRange/(torpedo.speed+SHIPS.shimakaze.knots*SPEED_PER_KNOT);
  assert.ok(warning>10);assert.ok(torpedo.armingDistance/torpedo.speed>=3);
  assert.ok(torpedo.range<Math.min(...Object.values(SHIPS).filter(s=>!s.torps).map(s=>s.range)));
});

test('torpedoes have finite range, require arming, and use the same speed as the lead marker',t=>{
  const game=fleet('shimakaze'),owner=game.player;let damage=0;
  Object.assign(game,{shells:[],torpedoes:[],aim:new T.Vector3(owner.x,4,owner.z-1000),ammo:'TORP',damageShip(){damage++;}});
  const target={...game.entities[5],x:owner.x,z:owner.z-250,speed:0};game.entities=[owner,target];
  const originalDocument=globalThis.document;globalThis.document={querySelector:()=>null};t.after(()=>{if(originalDocument===undefined)delete globalThis.document;else globalThis.document=originalDocument;});
  Battle.prototype.fireTorpedoes.call(game,owner);
  assert.equal(game.torpedoes.length,5);assert.equal(owner.torpBanks[0],45);
  const start=game.torpedoes[2].mesh.position.clone();game.updateProjectiles(1);
  assert.ok(Math.abs(start.distanceTo(game.torpedoes[2].mesh.position)-32)<1e-8);
  target.z=owner.z-70;game.updateProjectiles(.05);assert.equal(damage,0,'unarmed impacts must not explode');
  target.z=owner.z-250;owner.torpBanks=[0,0,0];owner.torpCool=0;Battle.prototype.fireTorpedoes.call(game,owner);for(let i=0;i<1000;i++)game.updateProjectiles(.05);
  assert.ok(damage>0);assert.equal(game.torpedoes.length,0,'torpedoes expire at their range');
  owner.torpBanks=[0,0,0];owner.torpCool=0;game.aim.z=owner.z-2000;Battle.prototype.fireTorpedoes.call(game,owner);assert.equal(game.torpedoes.length,0);
});

test('ten-minute fleet simulations preserve navigable water and ranged battles',t=>{
  for(const selected of Object.keys(SHIPS)){
    const game=fleet(selected);for(const e of game.entities)e.player=false;
    let firstShot=Infinity,minBattleshipDistance=Infinity,closeSamples=0,samples=0,maxGrounded=0;
    const lastPositions=new Map(),stuck=new Map();
    game.fire=()=>{firstShot=Math.min(firstShot,game.time);};
    for(let frame=0;frame<6000;frame++){
      game.time=frame*.1;
      for(const e of game.entities){game.updateShip(e,.1,game.time);assert.equal(hullTouchesLand(e,ISLANDS),false,`${selected}/${e.id} grounded at ${game.time}`);assert.ok(Math.abs(e.x)<MAP_HALF_SIZE&&Math.abs(e.z)<MAP_HALF_SIZE);}
      for(const cap of game.caps)captureStep(cap,game.entities,.1);
      if(frame%10===0)for(const e of game.entities){
        const prev=lastPositions.get(e),idle=prev&&distance(e,prev)<.1?(stuck.get(e)||0)+1:0;stuck.set(e,idle);maxGrounded=Math.max(maxGrounded,idle);lastPositions.set(e,{x:e.x,z:e.z});
        if(!e.spec.torps){const d=Math.min(...game.entities.filter(o=>o.team!==e.team).map(o=>distance(e,o)));minBattleshipDistance=Math.min(minBattleshipDistance,d);samples++;if(d<700)closeSamples++;}
      }
    }
    t.diagnostic(`${selected}: first fire ${firstShot.toFixed(1)}s, minimum BB distance ${(minBattleshipDistance/100).toFixed(1)}km, close encounters ${(closeSamples/samples*100).toFixed(1)}%, longest standstill ${maxGrounded}s`);
    assert.ok(firstShot<85,'opening must reach gun range without a long wait');
    assert.ok(closeSamples/samples<.04,'fleets should not settle into point-blank combat');
    if(maxGrounded>=15)t.diagnostic(JSON.stringify(game.entities.filter(e=>(stuck.get(e)||0)>15).map(e=>({id:e.id,team:e.team,x:e.x,z:e.z,heading:e.heading,speed:e.speed,rudder:e.rudder,flank:e.flank}))));
    assert.ok(maxGrounded<15,'AI should steer around islands, not remain stuck');
  }
});

test('ranged fleets still fire loaded batteries and land hits during the opening engagement',t=>{
  let seed=7331;t.mock.method(Math,'random',()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;});
  const originalDocument=globalThis.document;globalThis.document={querySelector:()=>null};t.after(()=>{if(originalDocument===undefined)delete globalThis.document;else globalThis.document=originalDocument;});
  const game=fleet();let hits=0,shots=0,firstShell=Infinity;
  Object.assign(game,{shells:[],torpedoes:[],fire:Battle.prototype.fire,fireTorpedoes:Battle.prototype.fireTorpedoes,damageShip(e,amount){if(amount>0)hits++;}});
  game.makeShell=function(...args){shots++;firstShell=Math.min(firstShell,this.time);return Battle.prototype.makeShell.apply(this,args);};
  for(const e of game.entities)e.player=false;
  for(let frame=0;frame<2400;frame++){
    game.time=frame*.1;for(const e of game.entities)game.updateShip(e,.1,game.time);
    game.updateProjectiles(.1);
    for(const cap of game.caps)captureStep(cap,game.entities,.1);
  }
  assert.ok(firstShell<60,'first real salvo should happen in the opening minute');
  assert.ok(shots>80&&hits>5,'ranged AI must engage, not simply sail in circles');
  t.diagnostic(`opening 4 minutes: first shell ${firstShell.toFixed(1)}s, ${shots} shells, ${hits} damaging impacts`);
});
