import {angleDiff,clamp,distance,segmentCircle} from './mechanics.js';

export const MAP_HALF_SIZE=3200;
export const ISLANDS=[
  [-1250,-600,200,145],[-1250,600,200,145],
  [1250,-600,200,145],[1250,600,200,145],
  [-2450,0,310,190],[2450,0,310,190],
  [-600,0,170,110],[600,0,170,110]
].map(([x,z,radius,height])=>({x,z,radius,height,r:radius*1.26}));
export const CAPTURE_ZONES=[{x:-1800,z:0},{x:0,z:0},{x:1800,z:0}];

// The deployment rows are open water, with room for every hull and its approach.
const slots=[{x:0,z:1550,lane:1},{x:-900,z:1700,lane:0},{x:900,z:1700,lane:2},{x:-1800,z:1850,lane:0},{x:1800,z:1850,lane:2}];
export function fleetDeployment(selected){
  return [[selected,'bismarck','iowa','shimakaze','yamato'],['iowa','bismarck','yamato','shimakaze','bismarck']].flatMap((fleet,team)=>fleet.map((id,index)=>{
    const slot=slots[index],side=team===0?1:-1;
    return {id,team,x:slot.x,z:slot.z*side,heading:team===0?Math.PI:0,player:team===0&&index===0,lane:slot.lane,flank:(slot.x<0?1:-1)*side};
  }));
}

export function hullTouchesLand(ship,islands){
  const radius=ship.mesh.userData.W*.54,half=ship.mesh.userData.L*.5-radius;
  const dx=Math.sin(ship.heading)*half,dz=Math.cos(ship.heading)*half;
  const bow={x:ship.x+dx,z:ship.z+dz},stern={x:ship.x-dx,z:ship.z-dz};
  return islands.some(island=>segmentCircle(stern,bow,island,island.r+radius));
}

// Keep a firing distance; close ships disengage instead of pursuing the cap.
export function battleCourse(ship,target,cap){
  if(!target)return {heading:Math.atan2(cap.x-ship.x,cap.z-ship.z),throttle:distance(ship,cap)<170?.25:.85};
  const bearing=Math.atan2(target.x-ship.x,target.z-ship.z),d=distance(ship,target),range=ship.spec.engagementRange;
  if(d>range*1.18)return {heading:bearing,throttle:.85};
  if(d<range*.82)return {heading:bearing+Math.PI-ship.flank*.3,throttle:1};
  const radial=clamp((d-range)/range,-.5,.5);
  return {heading:bearing+ship.flank*(Math.PI/2-radial*2),throttle:.65};
}

// Look ahead by sailing time, then steer around the nearest coastline and brake.
export function navigate(ship,course,islands){
  // Back away from a close shoreline until there is enough room to turn.
  if(ship.reversingFrom){
    if(distance(ship,ship.reversingFrom)<ship.reversingFrom.r+ship.mesh.userData.L*.5+200)
      return {heading:ship.heading,throttle:-.45};
    ship.reversingFrom=null;
  }
  for(const island of islands){
    const bearing=Math.atan2(island.x-ship.x,island.z-ship.z);
    if(distance(ship,island)<island.r+ship.mesh.userData.L*.5+120&&Math.cos(angleDiff(bearing,ship.heading))>.5){
      ship.reversingFrom=island;
      return {heading:ship.heading,throttle:-.45};
    }
  }
  const hull=ship.mesh.userData.L*.5+180,lookAhead=Math.max(450,Math.abs(ship.speed)*40);
  const ahead={x:ship.x+Math.sin(course.heading)*lookAhead,z:ship.z+Math.cos(course.heading)*lookAhead};
  if(Math.max(Math.abs(ahead.x),Math.abs(ahead.z))>MAP_HALF_SIZE-180)
    course={heading:Math.atan2(-ship.x,-ship.z),throttle:.65};
  let threat=null,nearest=Infinity;
  for(const island of islands){
    const current={x:ship.x+Math.sin(ship.heading)*lookAhead,z:ship.z+Math.cos(ship.heading)*lookAhead};
    const intended={x:ship.x+Math.sin(course.heading)*lookAhead,z:ship.z+Math.cos(course.heading)*lookAhead};
    if(!segmentCircle(ship,current,island,island.r+hull)&&!segmentCircle(ship,intended,island,island.r+hull))continue;
    const d=distance(ship,island);if(d<nearest){nearest=d;threat=island;}
  }
  if(threat){
    const bearing=Math.atan2(threat.x-ship.x,threat.z-ship.z),delta=angleDiff(course.heading,bearing);
    if(ship.avoidIsland!==threat){ship.avoidIsland=threat;ship.avoidSide=Math.abs(delta)>.12?Math.sign(delta):ship.flank;}
    const side=ship.avoidSide;
    const tangent=Math.asin(Math.min(1,(threat.r+hull)/nearest));
    course={heading:bearing+side*(tangent+.3),throttle:Math.min(course.throttle,.5)};
  }else ship.avoidIsland=null;
  return course;
}
