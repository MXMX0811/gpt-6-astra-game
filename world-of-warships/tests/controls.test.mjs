import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {PointerLockControls} from 'three/addons/controls/PointerLockControls.js';
import {Battle} from '../src/battle.js';

// Exercise the game's control and camera methods without constructing its WebGL scene.
const forward=heading=>new T.Vector3(Math.sin(heading),0,Math.cos(heading));
function fixture(){
  const game=Object.create(Battle.prototype),mesh=new T.Group();
  mesh.userData={L:120,W:18,turrets:[]};
  const spec={knots:25,turn:.08,range:2500,hp:10000};
  const player={player:true,hp:10000,x:0,z:0,heading:0,speed:20,rudder:0,mesh,spec,turretCool:[],torpCool:0,detected:0,immune:0,disabled:0,flood:0,fire:0,heal:0,secCool:100,wake:0,aiPhase:0};
  Object.assign(game,{player,keys:new Set(),lockRudder:0,throttle:5,selected:'yamato',consumables:{boost:{active:0}},islands:[],entities:[player],time:0,aim:new T.Vector3(0,4,1000),effects:{emit(){}},camera:new T.PerspectiveCamera(50,16/9,.4,25000),lookCamera:new T.PerspectiveCamera(),mouseControls:{},pointer:new T.Vector2(),zoom:205,viewYaw:0,scope:false,shells:[],shake:0,isVisible:()=>true,message(){}});
  return game;
}

test('A/D and left/right arrows turn toward the correct screen side at every heading',()=>{
  for(const heading of [0,Math.PI/2,Math.PI,Math.PI*1.5])for(const key of ['a','d','ArrowLeft','ArrowRight']){
    const game=fixture();game.player.heading=heading;game.keys.add(game.inputKey(key));
    const right=forward(heading).cross(new T.Vector3(0,1,0));
    game.updateShip(game.player,.05,0);
    const turn=forward(game.player.heading).dot(right);
    assert.ok(game.inputKey(key)==='a'?turn<0:turn>0,`${key} at ${heading}`);
  }
});

function withDocument(t,doc){
  const original=globalThis.document;globalThis.document=doc;
  t.after(()=>{if(original===undefined)delete globalThis.document;else globalThis.document=original;});
}

test('Q/E, release, opposing keys and reverse retain correct steering',t=>{
  withDocument(t,{querySelector:()=>null});
  for(const [key,sign] of [['q',1],['e',-1]]){
    const game=fixture();game.key(key);game.updateShip(game.player,.05,0);
    assert.equal(Math.sign(game.player.rudder),sign);
    game.key(key==='q'?'d':'a');assert.equal(game.lockRudder,0);
    const before=Math.abs(game.player.rudder);game.updateShip(game.player,.05,0);assert.ok(Math.abs(game.player.rudder)<before);
  }
  const both=fixture();both.keys=new Set(['a','d']);both.updateShip(both.player,.05,0);assert.equal(both.player.rudder,0);
  const reverse=fixture();reverse.player.speed=-10;reverse.throttle=0;reverse.keys.add('a');reverse.updateShip(reverse.player,.05,0);assert.ok(reverse.player.heading<0);
});

test('mouse look rotates right and up without any mouse button and continues beyond a full turn',()=>{
  const doc=new EventTarget(),canvas={ownerDocument:doc},game=fixture();
  const controls=new PointerLockControls(game.lookCamera,canvas);
  doc.pointerLockElement=canvas;doc.dispatchEvent(new Event('pointerlockchange'));
  const move=(x,y)=>{const event=new Event('mousemove');Object.assign(event,{movementX:x,movementY:y,buttons:0});doc.dispatchEvent(event);};
  const before=game.lookCamera.getWorldDirection(new T.Vector3()),right=before.clone().cross(new T.Vector3(0,1,0));
  move(100,-50);const after=game.lookCamera.getWorldDirection(new T.Vector3());assert.ok(after.dot(right)>0);assert.ok(after.y>0);
  for(let i=0;i<40;i++)move(100,0);
  assert.ok(game.lookCamera.getWorldDirection(new T.Vector3()).distanceTo(after)>.5);
  doc.pointerLockElement=null;doc.dispatchEvent(new Event('pointerlockchange'));const stopped=game.lookCamera.quaternion.clone();move(100,100);assert.ok(game.lookCamera.quaternion.equals(stopped));controls.dispose();
});

test('selecting and moving a locked enemy never changes the player view or aim',()=>{
  const game=fixture(),target={x:600,z:900,hp:100,team:1,spec:{name:'enemy'}};
  game.lookCamera.rotation.set(-.1,.4,0,'YXZ');game.updateCamera(1);const direction=game.camera.getWorldDirection(new T.Vector3()),aim=game.aim.clone();
  game.lockTarget(target);assert.ok(game.aim.equals(aim));
  target.x=-1600;for(let i=0;i<100;i++)game.updateCamera(.05);
  assert.ok(game.camera.getWorldDirection(new T.Vector3()).distanceTo(direction)<1e-12);
});

test('the center reticle, aim ray and scope point at the same sea position',t=>{
  withDocument(t,{querySelector:()=>null,body:{classList:{toggle(){}}}});
  const game=fixture();game.lookCamera.rotation.set(-.1,.3,0,'YXZ');game.updateCamera(1);game.computeAim();
  const point=game.aim.clone(),projection=point.clone().project(game.camera);assert.ok(Math.abs(projection.x)<1e-10&&Math.abs(projection.y)<1e-10);
  game.key('shift');game.updateCamera(1);game.computeAim();assert.ok(game.aim.distanceTo(point)<1e-8);
  assert.equal(game.camera.fov,18);game.key('shift');game.updateCamera(1);game.computeAim();assert.ok(game.aim.distanceTo(point)<1e-8);assert.equal(game.camera.fov,50);
});

test('pausing releases the mouse and clears held fire and steering',t=>{
  const game=fixture(),dialog={open:false,showModal(){this.open=true;}},board={hidden:false};let exits=0;
  game.renderer={domElement:{}};game.keys.add('a');game.fireHeld=true;game.touchLook={id:1};
  withDocument(t,{querySelector:s=>s==='#pause-dialog'?dialog:s==='#scoreboard'?board:null,pointerLockElement:game.renderer.domElement,exitPointerLock(){exits++;}});
  game.openDialog('#pause-dialog');assert.equal(exits,1);assert.equal(game.keys.size,0);assert.equal(game.fireHeld,false);assert.equal(game.touchLook,null);assert.equal(game.mouseControls.enabled,false);assert.equal(dialog.open,true);assert.equal(board.hidden,true);
});

test('resuming requests mouse capture while denied capture keeps the game paused',async t=>{
  const game=fixture(),hint={textContent:''};let requests=0,paused=false;
  game.mouseInput=true;game.renderer={domElement:{async requestPointerLock(){requests++;}}};game.openDialog=()=>{paused=true;};
  withDocument(t,{querySelector:s=>s==='#pause-hint'?hint:null});
  await game.startMouseLook();assert.equal(requests,1);assert.equal(game.mouseControls.enabled,true);assert.equal(paused,false);
  game.renderer.domElement.requestPointerLock=async()=>{throw new Error('capture denied');};
  await game.startMouseLook();assert.equal(paused,true);assert.match(hint.textContent,/继续战斗/);
});
