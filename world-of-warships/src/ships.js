import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
export const SPEED_PER_KNOT=.38;
export const SHIPS={
 yamato:{name:'大和',en:'YAMATO',nation:'日本',tier:'X',type:'战列舰',year:1941,length:263,beam:38.9,hp:97200,knots:27,guns:'460 mm',battery:'3 × 3',reload:10,damage:8600,range:2600,engagementRange:1850,armor:410,turn:.055,torps:0,description:'九门 460 毫米主炮。远距离重击，厚重装甲。',accent:'#c5a879'},
 bismarck:{name:'俾斯麦',en:'BISMARCK',nation:'德国',tier:'VIII',type:'战列舰',year:1940,length:251,beam:36,hp:69200,knots:30,guns:'380 mm',battery:'4 × 2',reload:8,damage:6800,range:2300,engagementRange:1450,armor:320,turn:.065,torps:0,description:'八门 380 毫米主炮。近距离副炮，坚固装甲。',accent:'#a6bbc3'},
 iowa:{name:'衣阿华',en:'IOWA',nation:'美国',tier:'IX',type:'战列舰',year:1943,length:270,beam:33,hp:79000,knots:33,guns:'406 mm',battery:'3 × 3',reload:9,damage:7800,range:2500,engagementRange:1750,armor:307,turn:.06,torps:0,description:'九门 406 毫米主炮。高速航行，精准火力。',accent:'#94b9c3'},
 shimakaze:{name:'岛风',en:'SHIMAKAZE',nation:'日本',tier:'X',type:'驱逐舰',year:1943,length:129,beam:11.2,hp:17900,knots:39,guns:'127 mm',battery:'3 × 2',reload:3,damage:1600,range:1500,engagementRange:1050,armor:19,turn:.14,torps:15,torpedo:{speed:32,range:1400,armingDistance:120,reload:45,damage:13000,warningRange:520},description:'十五具鱼雷发射管。高速隐蔽，烟幕掩护。',accent:'#aab9a5'}
};
const mat={hull:new T.MeshStandardMaterial({color:0x69757b,roughness:.67,metalness:.4}),deck:new T.MeshStandardMaterial({color:0x9c8b69,roughness:.93}),dark:new T.MeshStandardMaterial({color:0x29343c,roughness:.55,metalness:.5}),steel:new T.MeshStandardMaterial({color:0x8d9699,roughness:.5,metalness:.5}),glass:new T.MeshStandardMaterial({color:0x17282f,roughness:.25,metalness:.7}),red:new T.MeshStandardMaterial({color:0x532c2b,roughness:.9}),white:new T.MeshStandardMaterial({color:0xd6d3bd,roughness:.7})};
function box(g,x,y,z,w,h,d,m='hull'){const a=new T.Mesh(new T.BoxGeometry(w,h,d),mat[m]);a.position.set(x,y,z);g.add(a);return a;}
function cyl(g,x,y,z,r,h,m='hull',n=12,r2=r){const a=new T.Mesh(new T.CylinderGeometry(r2,r,h,n),mat[m]);a.position.set(x,y,z);g.add(a);return a;}
function rod(g,a,b,r=.12,m='steel'){const va=new T.Vector3(...a),vb=new T.Vector3(...b),d=vb.clone().sub(va);const o=new T.Mesh(new T.CylinderGeometry(r,r,d.length(),6),mat[m]);o.position.copy(va.add(vb).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());g.add(o);return o;}
function merge(g){g.updateMatrixWorld(true);const sets=new Map();for(const c of [...g.children])if(c.isMesh){let geo=c.geometry.clone().applyMatrix4(c.matrix);if(geo.index)geo=geo.toNonIndexed();const arr=sets.get(c.material)||[];arr.push(geo);sets.set(c.material,arr);g.remove(c);c.geometry.dispose();}for(const [m,gs] of sets){const o=new T.Mesh(mergeGeometries(gs),m);o.castShadow=true;o.receiveShadow=true;g.add(o);gs.forEach(a=>a.dispose());}}
export function buildShip(id){const s=SHIPS[id],g=new T.Group(),body=new T.Group();g.add(body);const L=s.length*.48,W=s.beam*.48,dd=id==='shimakaze';
 // Sections create the ship's fine bow, fuller amidships and rounded stern.
 const sections=[[-.5,.02],[-.46,.48],[-.36,.84],[-.18,1],[.18,1],[.35,.79],[.45,.43],[.5,0]];
 const hull=new T.Shape();for(let i=0;i<sections.length;i++){const [z,w]=sections[i];i?hull.lineTo(w*W/2,z*L):hull.moveTo(w*W/2,z*L);}for(let i=sections.length-1;i>=0;i--){const [z,w]=sections[i];hull.lineTo(-w*W/2,z*L);}hull.closePath();
 const geo=new T.ExtrudeGeometry(hull,{depth:dd?3.1:5.3,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:dd?.45:1.1,bevelThickness:.1});geo.rotateX(Math.PI/2);geo.translate(0,dd?3.7:5.9,0);const hm=new T.Mesh(geo,mat.hull);body.add(hm);
 const dg=new T.ShapeGeometry(hull);dg.rotateX(Math.PI/2);const deck=new T.Mesh(dg,mat.deck);deck.rotation.z=Math.PI;deck.position.y=dd?3.83:6.03;body.add(deck);
 const y=dd?4:6.1;
 for(let z=-L*.43;z<L*.42;z+=dd?3:4){let wf=W/2*(Math.abs(z)>L*.32?.72:.98);for(const side of [-1,1]){rod(body,[side*wf,y,z],[side*wf,y+.8,z],.065);if(z+4<L*.42)rod(body,[side*wf,y+.8,z],[side*wf,y+.8,z+3],.045);}}
 for(let z=-L*.4;z<L*.4;z+=2.8)box(body,0,y+.025,z,W*.6,.04,.04,'dark');
 box(body,0,y+1.2,0,W*.68,2.4,L*.35);box(body,0,y+3,-L*.035,W*.45,2.3,L*.18);
 const bridgeZ=L*.08;box(body,0,y+5,bridgeZ,W*.43,5,L*.07);box(body,0,y+8,bridgeZ,W*.51,1.4,L*.065);box(body,0,y+8.8,bridgeZ+.5,W*.44,.8,L*.062,'glass');box(body,0,y+10,bridgeZ,W*.39,1.5,L*.047);
 if(id==='yamato'){cyl(body,0,y+12,bridgeZ,2.4,3,'hull',8);box(body,0,y+14.1,bridgeZ,9,1.5,2);box(body,0,y+15.8,bridgeZ,4,1.5,2.8);}
 else{box(body,0,y+12,bridgeZ,W*.28,2,L*.035);box(body,0,y+13.6,bridgeZ,W*.65,.8,1.2);}
 for(const fz of (id==='iowa'||dd?[-L*.06,-L*.2]:[-L*.085])){cyl(body,0,y+7,fz,dd?1.45:3,8,'hull',16);cyl(body,0,y+11.1,fz,dd?1.55:3.15,.8,'dark',16);}
 rod(body,[0,y+9,bridgeZ],[0,y+24,bridgeZ],.22);rod(body,[-W*.21,y+6,bridgeZ-3],[0,y+19,bridgeZ],.15);rod(body,[W*.21,y+6,bridgeZ-3],[0,y+19,bridgeZ],.15);rod(body,[-5,y+20,bridgeZ],[5,y+20,bridgeZ],.12);box(body,0,y+23,bridgeZ,5,1.4,.15,'dark');
 rod(body,[0,y+6,-L*.28],[0,y+17,-L*.25],.15);rod(body,[0,y+23,bridgeZ],[0,y+17,-L*.25],.025);rod(body,[0,y+17,-L*.25],[0,y+3,-L*.45],.025);
 const turrets=[];const layout=id==='bismarck'?[.32,.21,-.26,-.38]:dd?[.31,-.25,-.38]:[.32,.21,-.32];
 layout.forEach((p,i)=>{const t=new T.Group();t.position.set(0,y+(i===1&&!dd?2.5:.6),p*L);body.add(t);cyl(t,0,.2,0,dd?1.8:4.1,1.3);box(t,0,1.3,0,dd?3.5:8,dd?2:3,dd?3:7);box(t,0,2.9,-.8,dd?3.4:7.4,.5,dd?2.8:5.8);const count=id==='bismarck'||dd?2:3;for(let j=0;j<count;j++){const x=(j-(count-1)/2)*(dd?1:2.3);const b=rod(t,[x,1.8,2],[x,2.5,dd?8:19],dd?.23:.53,'dark');rod(t,[x,1.8,2],[x,2.1,dd?5:10],dd?.32:.75);}t.rotation.y=p<0?Math.PI:0;merge(t);turrets.push(t);});
 for(const side of [-1,1])for(let i=0;i<(dd?2:6);i++){const z=(-.19+i*.056)*L,x=side*W*.4;const t=new T.Group();t.position.set(x,y+1.1,z);cyl(t,0,0,0,dd?.8:1.7,1);box(t,0,1,0,dd?1.2:3,1.5,2.7);for(let j=0;j<2;j++)rod(t,[side*.4,.9,j*.6],[side*(dd?3:5),1.3,j*.6],.16,'dark');merge(t);body.add(t);}
 for(const side of [-1,1])for(let i=0;i<(dd?3:10);i++){const z=(-.33+i*.065)*L,x=side*W*.32;box(body,x,y+.5,z,1.3,.8,1.5);rod(body,[x,y+1,z],[x+side*1.4,y+2,z+1],.09,'dark');rod(body,[x+.4,y+1,z],[x+side*1.4+.4,y+2,z+1],.09,'dark');}
 if(dd)for(const z of [-L*.13,0,L*.15]){cyl(body,0,y+2,z,1.4,1.2);for(let i=0;i<5;i++){const tube=new T.Mesh(new T.CylinderGeometry(.33,.33,5.8,8),mat.dark);tube.rotation.x=Math.PI/2;tube.position.set((i-2)*.7,y+2.6,z);body.add(tube);}}
 for(const side of [-1,1]){box(body,side*W*.23,y+3,-L*.14,dd?.8:1.7,1,dd?3:7,'white');rod(body,[side*W*.2,y+4,-L*.17],[side*W*.42,y+7,-L*.2],.14);}
 rod(body,[0,y,-L*.475],[0,y+5,-L*.475],.08);box(body,1,y+4,-L*.475,2,.9,.05,'white');
 // Merge fixed details per material; rotating main batteries stay separate.
 const ts=turrets.map(t=>{body.remove(t);return t;});merge(body);ts.forEach(t=>body.add(t));g.userData={id,spec:s,turrets,L,W,body};return g;
}
