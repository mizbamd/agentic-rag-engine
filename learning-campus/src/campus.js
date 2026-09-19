import * as THREE from "three";

const BLOCK = 1;

export function createCampus(canvas, { onZone, onInteract }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = false;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#cfe4ea");
  scene.fog = new THREE.Fog("#cfe4ea", 28, 72);

  const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 120);
  camera.position.set(0, 1.6, 8);

  scene.add(new THREE.HemisphereLight("#f4f0e6", "#8f9e86", 1.05));
  const sun = new THREE.DirectionalLight("#fff6e8", 0.55);
  sun.position.set(12, 22, 8);
  scene.add(sun);

  const textures = {};
  function tex(hex) {
    if (textures[hex]) return textures[hex];
    const c = document.createElement("canvas");
    c.width = c.height = 16;
    const ctx = c.getContext("2d");
    ctx.fillStyle = hex;
    ctx.fillRect(0, 0, 16, 16);
    for (let i = 0; i < 28; i++) {
      const n = (i * 17) % 16;
      const m = (i * 9) % 16;
      ctx.fillStyle = shade(hex, ((i % 5) - 2) * 6);
      ctx.fillRect(n, m, 1, 1);
    }
    const t = new THREE.CanvasTexture(c);
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestFilter;
    t.colorSpace = THREE.SRGBColorSpace;
    textures[hex] = t;
    return t;
  }

  const geo = new THREE.BoxGeometry(BLOCK, BLOCK, BLOCK);
  const mats = {};
  function mat(hex) {
    if (!mats[hex]) mats[hex] = new THREE.MeshLambertMaterial({ map: tex(hex) });
    return mats[hex];
  }

  const colliders = [];
  const world = new THREE.Group();
  scene.add(world);

  function block(x, y, z, hex) {
    const m = new THREE.Mesh(geo, mat(hex));
    m.position.set(x + 0.5, y + 0.5, z + 0.5);
    world.add(m);
    return m;
  }

  function boxFill(x0, y0, z0, x1, y1, z1, hex, { hollow = false, door } = {}) {
    for (let x = x0; x <= x1; x++) {
      for (let y = y0; y <= y1; y++) {
        for (let z = z0; z <= z1; z++) {
          const edge = x === x0 || x === x1 || z === z0 || z === z1 || y === y0 || y === y1;
          if (hollow && !edge) continue;
          if (hollow && y === y0) continue;
          if (
            door &&
            y >= door.y0 &&
            y <= door.y1 &&
            x >= door.x0 &&
            x <= door.x1 &&
            z >= door.z0 &&
            z <= door.z1
          ) {
            continue;
          }
          block(x, y, z, hex);
        }
      }
    }
    colliders.push({
      minX: x0,
      maxX: x1 + 1,
      minZ: z0,
      maxZ: z1 + 1,
      minY: y0,
      maxY: y1 + 1,
      door,
    });
  }

  function groundPatch(cx, cz, r, hex, y = 0) {
    for (let x = cx - r; x <= cx + r; x++) {
      for (let z = cz - r; z <= cz + r; z++) {
        if ((x - cx) * (x - cx) + (z - cz) * (z - cz) <= r * r + 2) block(x, y, z, hex);
      }
    }
  }

  function tree(x, z, trunk, leaves) {
    block(x, 1, z, trunk);
    block(x, 2, z, trunk);
    for (const [dx, dy, dz] of [
      [0, 3, 0],
      [1, 3, 0],
      [-1, 3, 0],
      [0, 3, 1],
      [0, 3, -1],
      [0, 4, 0],
    ]) {
      block(x + dx, dy, z + dz, leaves);
    }
  }

  function cactus(x, z) {
    block(x, 1, z, "#8fb58a");
    block(x, 2, z, "#8fb58a");
    block(x, 3, z, "#9cc496");
  }

  groundPatch(0, 0, 8, "#d8cbb4");
  groundPatch(0, 14, 10, "#b7d4a6");
  groundPatch(-16, 0, 10, "#8fbf88");
  groundPatch(16, 0, 10, "#e4d3a4");
  groundPatch(0, -14, 8, "#cfc4b6");
  for (let x = -28; x <= 28; x++) {
    for (let z = -24; z <= 24; z++) {
      if (Math.abs(x) < 9 && Math.abs(z) < 9) continue;
      if (z > 6 && Math.abs(x) < 11) continue;
      if (z < -6 && Math.abs(x) < 9) continue;
      if (x < -8 && Math.abs(z) < 10) continue;
      if (x > 8 && Math.abs(z) < 10) continue;
      if ((x + z) % 7 === 0) block(x, 0, z, "#c5d5b8");
      else block(x, 0, z, "#d7e0c8");
    }
  }

  for (let i = -3; i <= 3; i++) {
    block(i, 1, 0, "#c9b89a");
    block(0, 1, i, "#c9b89a");
  }
  block(0, 1, 0, "#b9cfd4");
  block(0, 2, 0, "#d5e6ea");

  boxFill(-4, 1, 12, 4, 5, 19, "#e8d9b8", {
    hollow: true,
    door: { x0: -1, x1: 1, y0: 1, y1: 3, z0: 12, z1: 12 },
  });
  for (let x = -5; x <= 5; x++) for (let z = 11; z <= 20; z++) block(x, 6, z, "#d4a574");

  boxFill(-22, 1, -4, -12, 5, 5, "#cfe0d4", {
    hollow: true,
    door: { x0: -12, x1: -12, y0: 1, y1: 3, z0: -1, z1: 1 },
  });
  for (let x = -23; x <= -11; x++) for (let z = -5; z <= 6; z++) block(x, 6, z, "#8fbf88");

  boxFill(12, 1, -4, 22, 5, 5, "#ead9b2", {
    hollow: true,
    door: { x0: 12, x1: 12, y0: 1, y1: 3, z0: -1, z1: 1 },
  });
  for (let x = 11; x <= 23; x++) for (let z = -5; z <= 6; z++) block(x, 6, z, "#c4a36a");

  tree(-6, 10, "#b08968", "#8fbf88");
  tree(6, 16, "#b08968", "#8fbf88");
  tree(-18, 8, "#a67c52", "#6ea078");
  tree(-14, -8, "#a67c52", "#6ea078");
  cactus(18, 8);
  cactus(20, -6);
  cactus(14, 7);
  block(-2, 1, -12, "#cfc4b6");
  block(2, 1, -12, "#cfc4b6");
  block(0, 1, -16, "#b9a48a");
  block(0, 2, -16, "#b9a48a");

  const verity = makeVerity();
  verity.position.set(2, 0, 3);
  scene.add(verity);

  const zones = [
    { id: "plaza", biome: "plaza", subject: null, label: "Press E — talk with Verity", x: 0, z: 2, r: 3.2 },
    { id: "math", biome: "meadow", subject: "math", label: "Press E — Number Lodge", x: 0, z: 12.5, r: 3.4 },
    { id: "science", biome: "forest", subject: "science", label: "Press E — Greenhouse Lab", x: -12.2, z: 0, r: 3.4 },
    { id: "geography", biome: "desert", subject: "geography", label: "Press E — Lookout Mesa", x: 12.2, z: 0, r: 3.4 },
  ];

  const keys = Object.create(null);
  const look = { yaw: 0, pitch: 0 };
  let locked = false;
  let walkTarget = null;
  let speaking = false;
  let activeZone = null;
  const pos = new THREE.Vector3(0, 1.6, 7);
  const euler = new THREE.Euler(0, 0, 0, "YXZ");
  const clock = new THREE.Clock();

  addEventListener("keydown", (e) => {
    keys[e.code] = true;
    if (e.code === "KeyE") {
      const z = currentZone();
      if (z) onInteract?.(z);
    }
  });
  addEventListener("keyup", (e) => {
    keys[e.code] = false;
  });
  addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
  canvas.addEventListener("click", (e) => {
    if (e.target !== canvas) return;
    canvas.requestPointerLock?.();
  });
  document.addEventListener("pointerlockchange", () => {
    locked = document.pointerLockElement === canvas;
    canvas.classList.toggle("looking", locked);
  });
  document.addEventListener("mousemove", (e) => {
    if (!locked) return;
    look.yaw -= e.movementX * 0.0022;
    look.pitch -= e.movementY * 0.0022;
    look.pitch = Math.max(-1.2, Math.min(1.2, look.pitch));
  });
  canvas.addEventListener("pointerdown", (e) => {
    if (locked) return;
    const ndc = new THREE.Vector2((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    const ray = new THREE.Raycaster();
    ray.setFromCamera(ndc, camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const hit = new THREE.Vector3();
    if (ray.ray.intersectPlane(plane, hit)) walkTarget = hit;
  });

  function blocked(nx, nz) {
    const r = 0.32;
    for (const c of colliders) {
      if (c.door) {
        const d = c.door;
        const inDoor =
          nx > d.x0 - r && nx < d.x1 + 1 + r && nz > d.z0 - r && nz < d.z1 + 1 + r;
        if (inDoor) continue;
      }
      const overlapX = nx + r > c.minX && nx - r < c.maxX;
      const overlapZ = nz + r > c.minZ && nz - r < c.maxZ;
      if (overlapX && overlapZ) return true;
    }
    return Math.abs(nx) > 30 || Math.abs(nz) > 26;
  }

  function currentZone() {
    for (const z of zones) {
      const dx = pos.x - z.x;
      const dz = pos.z - z.z;
      if (dx * dx + dz * dz <= z.r * z.r) return z;
    }
    return null;
  }

  function tick() {
    const dt = Math.min(clock.getDelta(), 0.05);
    euler.set(look.pitch, look.yaw, 0);
    camera.quaternion.setFromEuler(euler);
    const speed = (keys.ShiftLeft ? 8 : 5) * dt;
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    forward.y = 0;
    forward.normalize();
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    right.y = 0;
    right.normalize();
    let mx = 0;
    let mz = 0;
    if (keys.KeyW || keys.ArrowUp) {
      mx += forward.x;
      mz += forward.z;
    }
    if (keys.KeyS || keys.ArrowDown) {
      mx -= forward.x;
      mz -= forward.z;
    }
    if (keys.KeyD || keys.ArrowRight) {
      mx += right.x;
      mz += right.z;
    }
    if (keys.KeyA || keys.ArrowLeft) {
      mx -= right.x;
      mz -= right.z;
    }
    if (walkTarget && mx === 0 && mz === 0) {
      const dx = walkTarget.x - pos.x;
      const dz = walkTarget.z - pos.z;
      const len = Math.hypot(dx, dz);
      if (len < 0.35) walkTarget = null;
      else {
        mx = dx / len;
        mz = dz / len;
      }
    }
    const len = Math.hypot(mx, mz) || 1;
    const nx = pos.x + (mx / len) * speed;
    const nz = pos.z + (mz / len) * speed;
    if (!blocked(nx, pos.z)) pos.x = nx;
    if (!blocked(pos.x, nz)) pos.z = nz;
    pos.y = 1.6;
    camera.position.copy(pos);

    const target = new THREE.Vector3(pos.x + 1.2, 0, pos.z + 0.4);
    verity.position.x += (target.x - verity.position.x) * 0.02;
    verity.position.z += (target.z - verity.position.z) * 0.02;
    verity.position.y = Math.sin(performance.now() / 280) * (speaking ? 0.08 : 0.03);
    verity.lookAt(pos.x, 0.4, pos.z);

    const z = currentZone();
    if (z?.id !== activeZone?.id) {
      activeZone = z;
      onZone?.(z);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();

  return {
    setSpeaking(v) {
      speaking = v;
    },
  };
}

function makeVerity() {
  const g = new THREE.Group();
  const box = (w, h, d, color, x, y, z) => {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshLambertMaterial({ color })
    );
    m.position.set(x, y, z);
    g.add(m);
  };
  box(0.22, 0.22, 0.22, "#6b5344", -0.12, 0.12, 0);
  box(0.22, 0.22, 0.22, "#6b5344", 0.12, 0.12, 0);
  box(0.38, 0.55, 0.28, "#7aa392", 0, 0.52, 0);
  box(0.16, 0.42, 0.16, "#e7c4b0", -0.28, 0.5, 0);
  box(0.16, 0.42, 0.16, "#e7c4b0", 0.28, 0.5, 0);
  box(0.42, 0.42, 0.42, "#f0d0c0", 0, 1.05, 0);
  box(0.46, 0.16, 0.46, "#6b5344", 0, 1.28, 0);
  box(0.08, 0.08, 0.06, "#3d3a36", -0.1, 1.08, 0.2);
  box(0.08, 0.08, 0.06, "#3d3a36", 0.1, 1.08, 0.2);
  box(0.18, 0.05, 0.05, "#c9897a", 0, 0.94, 0.2);
  return g;
}

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, ((n >> 16) & 255) + amt));
  const g = Math.min(255, Math.max(0, ((n >> 8) & 255) + amt));
  const b = Math.min(255, Math.max(0, (n & 255) + amt));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
