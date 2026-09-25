import test from 'node:test';
import assert from 'node:assert/strict';
import {hitShip,segmentCircle,armorHit,captureStep} from '../src/mechanics.js';

const target={x:0,z:0,heading:0,spec:{armor:320,torps:0},mesh:{userData:{L:120,W:18}}};
const attacker={x:0,z:500,spec:{guns:'380 mm',damage:10000}};

test('ship collision follows the hull and heading',()=>{
  assert.equal(hitShip({x:0,z:20},target).hit,true);
  assert.equal(hitShip({x:30,z:20},target).hit,false);
  assert.equal(hitShip({x:45,z:0},{...target,heading:Math.PI/2}).hit,true);
});

test('islands obstruct intersecting trajectories',()=>{
  assert.equal(segmentCircle({x:-100,z:0},{x:100,z:0},{x:0,z:0},20),true);
  assert.equal(segmentCircle({x:-100,z:30},{x:100,z:30},{x:0,z:0},20),false);
});

test('AP models angled armor, citadels and destroyer overpenetration',()=>{
  assert.equal(armorHit(attacker,target,'AP',{localZ:0},()=>0).kind,'跳弹');
  assert.equal(armorHit({...attacker,x:500,z:0},target,'AP',{localZ:0},()=>0).kind,'核心区命中');
  assert.equal(armorHit(attacker,{...target,spec:{armor:19,torps:15}},'AP',{localZ:0},()=>0).damage,1000);
});

test('HE can start a fire',()=>{
  assert.equal(armorHit(attacker,target,'HE',{localZ:0},()=>0).fire,true);
});

test('either team can capture an uncontested zone',()=>{
  for(const team of [0,1]){
    const cap={x:0,z:0,owner:-1,progress:0};
    captureStep(cap,[{x:0,z:0,team,hp:1}],40);
    assert.equal(cap.owner,team);
  }
});

test('contesting a zone freezes capture progress',()=>{
  const cap={x:0,z:0,owner:-1,progress:.5};
  captureStep(cap,[{x:0,z:0,team:0,hp:1},{x:0,z:0,team:1,hp:1}],40);
  assert.equal(cap.progress,.5);
  assert.equal(cap.contested,true);
});
