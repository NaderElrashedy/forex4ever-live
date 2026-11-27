import * as THREE from "three";
import { DISTRICTS } from "../data/missionData";

const ROAD_WIDTH = 17;
const CITY_LENGTH = 640;

const BUILDING_COLORS = [
  0x071521,
  0x091d2c,
  0x0d2333,
  0x101b2d,
  0x071a25,
  0x111827,
];

const NEON_COLORS = [
  0x31d7ff,
  0x56efb1,
  0x9c8cff,
  0xffbd59,
  0x5ae6ff,
];

function seededRandom(seed) {
  const value = Math.sin(seed * 999.91) * 43758.5453;
  return value - Math.floor(value);
}

function createTextTexture(title, subtitle, accent = "#31d7ff") {
  if (typeof document === "undefined") {
    return null;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 420;

  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, "rgba(2, 10, 18, 0.96)");
  gradient.addColorStop(0.5, "rgba(8, 27, 41, 0.98)");
  gradient.addColorStop(1, "rgba(2, 10, 18, 0.96)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = accent;
  context.lineWidth = 12;
  context.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);

  context.shadowColor = accent;
  context.shadowBlur = 30;
  context.strokeStyle = accent;
  context.lineWidth = 4;
  context.strokeRect(34, 34, canvas.width - 68, canvas.height - 68);

  context.shadowBlur = 0;
  context.textAlign = "center";
  context.textBaseline = "middle";

  context.fillStyle = "#ffffff";
  context.font = "800 70px Arial, sans-serif";
  context.fillText(title, canvas.width / 2, 155);

  context.fillStyle = accent;
  context.font = "700 34px Arial, sans-serif";
  context.fillText(subtitle, canvas.width / 2, 255);

  context.fillStyle = "rgba(255,255,255,0.65)";
  context.font = "500 24px Arial, sans-serif";
  context.fillText("TMGM MARKET CITY", canvas.width / 2, 330);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

function createDistrictSign(district) {
  const group = new THREE.Group();

  const accent = district.color || "#31d7ff";
  const texture = createTextTexture(
    district.name,
    district.shortName || "TRADING DISTRICT",
    accent
  );

  const signMaterial = new THREE.MeshStandardMaterial({
    map: texture,
    color: 0xffffff,
    emissive: new THREE.Color(accent),
    emissiveIntensity: 0.25,
    roughness: 0.34,
    metalness: 0.45,
    transparent: true,
  });

  const board = new THREE.Mesh(
    new THREE.BoxGeometry(11, 4.4, 0.35),
    signMaterial
  );

  board.position.y = 6.8;
  board.castShadow = false;
  board.receiveShadow = false;
  group.add(board);

  const poleMaterial = new THREE.MeshStandardMaterial({
    color: 0x132536,
    metalness: 0.85,
    roughness: 0.22,
  });

  const leftPole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.22, 5, 10),
    poleMaterial
  );

  leftPole.position.set(-4.4, 3.1, 0);
  leftPole.castShadow = true;
  group.add(leftPole);

  const rightPole = leftPole.clone();
  rightPole.position.x = 4.4;
  group.add(rightPole);

  const glowMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(accent),
    transparent: true,
    opacity: 0.24,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(13.5, 6.5),
    glowMaterial
  );

  glow.position.set(0, 6.8, 0.28);
  group.add(glow);

  group.userData.texture = texture;
  group.userData.glow = glow;

  return group;
}

function createEnergyGate(district) {
  const gate = new THREE.Group();
  const color = new THREE.Color(district.color || "#31d7ff");

  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x12293a,
    emissive: color,
    emissiveIntensity: 0.32,
    metalness: 0.9,
    roughness: 0.2,
  });

  const beamMaterial = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.48,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const leftTower = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 7.5, 0.8),
    frameMaterial
  );

  leftTower.position.set(-7.6, 3.75, 0);
  leftTower.castShadow = true;
  gate.add(leftTower);

  const rightTower = leftTower.clone();
  rightTower.position.x = 7.6;
  gate.add(rightTower);

  const topBeam = new THREE.Mesh(
    new THREE.BoxGeometry(16, 0.7, 0.8),
    frameMaterial
  );

  topBeam.position.set(0, 7.2, 0);
  topBeam.castShadow = true;
  gate.add(topBeam);

  const portal = new THREE.Mesh(
    new THREE.PlaneGeometry(14.4, 6.2),
    beamMaterial
  );

  portal.position.set(0, 3.65, 0.08);
  gate.add(portal);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(3.2, 0.08, 8, 64),
    beamMaterial
  );

  ring.position.set(0, 3.8, 0.25);
  gate.add(ring);

  gate.userData.portal = portal;
  gate.userData.ring = ring;
  gate.userData.districtId = district.id;

  return gate;
}

function createBuilding(seed, side, zPosition) {
  const randomA = seededRandom(seed + 1);
  const randomB = seededRandom(seed + 2);
  const randomC = seededRandom(seed + 3);

  const width = 5 + randomA * 8;
  const height = 8 + randomB * 28;
  const depth = 5 + randomC * 9;

  const color =
    BUILDING_COLORS[Math.floor(randomA * BUILDING_COLORS.length)] ||
    BUILDING_COLORS[0];

  const neon =
    NEON_COLORS[Math.floor(randomC * NEON_COLORS.length)] ||
    NEON_COLORS[0];

  const group = new THREE.Group();

  const bodyMaterial = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.55,
    metalness: 0.5,
  });

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    bodyMaterial
  );

  body.position.y = height / 2;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  const trimMaterial = new THREE.MeshBasicMaterial({
    color: neon,
    transparent: true,
    opacity: 0.72,
  });

  const trim = new THREE.Mesh(
    new THREE.BoxGeometry(width + 0.08, 0.13, depth + 0.1),
    trimMaterial
  );

  trim.position.y = height * 0.75;
  group.add(trim);

  const topTrim = trim.clone();
  topTrim.position.y = height - 0.35;
  group.add(topTrim);

  const windowMaterial = new THREE.MeshBasicMaterial({
    color: neon,
    transparent: true,
    opacity: 0.35 + randomB * 0.35,
  });

  const windowRows = Math.max(2, Math.floor(height / 4));

  for (let row = 0; row < windowRows; row += 1) {
    const windowStrip = new THREE.Mesh(
      new THREE.PlaneGeometry(width * 0.72, 0.28),
      windowMaterial
    );

    windowStrip.position.set(
      0,
      2.1 + row * 3.1,
      side < 0 ? depth / 2 + 0.01 : -depth / 2 - 0.01
    );

    if (side > 0) {
      windowStrip.rotation.y = Math.PI;
    }

    group.add(windowStrip);
  }

  const antenna = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.08, 2 + randomA * 4, 8),
    trimMaterial
  );

  antenna.position.y = height + 1;
  group.add(antenna);

  const xBase = ROAD_WIDTH / 2 + 5;
  const extraDistance = randomB * 11;

  group.position.set(
    side * (xBase + extraDistance),
    0,
    zPosition + (randomC - 0.5) * 8
  );

  return group;
}

function createStreetLight(side, zPosition, color = 0x31d7ff) {
  const group = new THREE.Group();

  const poleMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a2935,
    metalness: 0.9,
    roughness: 0.24,
  });

  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.12, 4.8, 8),
    poleMaterial
  );

  pole.position.y = 2.4;
  group.add(pole);

  const lampMaterial = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.95,
  });

  const lamp = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 12, 12),
    lampMaterial
  );

  lamp.position.set(-side * 0.45, 4.7, 0);
  group.add(lamp);

  const arm = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.08, 0.08),
    poleMaterial
  );

  arm.position.set(-side * 0.22, 4.65, 0);
  group.add(arm);

  group.position.set(side * (ROAD_WIDTH / 2 + 1.1), 0, zPosition);

  return group;
}

function createRoad() {
  const roadGroup = new THREE.Group();

  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x02060a,
    roughness: 0.95,
    metalness: 0.05,
  });

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(180, CITY_LENGTH + 160),
    groundMaterial
  );

  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, -0.1, -CITY_LENGTH / 2 + 40);
  ground.receiveShadow = true;
  roadGroup.add(ground);

  const roadMaterial = new THREE.MeshStandardMaterial({
    color: 0x080d13,
    roughness: 0.72,
    metalness: 0.2,
  });

  const road = new THREE.Mesh(
    new THREE.PlaneGeometry(ROAD_WIDTH, CITY_LENGTH + 120),
    roadMaterial
  );

  road.rotation.x = -Math.PI / 2;
  road.position.set(0, 0.015, -CITY_LENGTH / 2 + 35);
  road.receiveShadow = true;
  roadGroup.add(road);

  const sidewalkMaterial = new THREE.MeshStandardMaterial({
    color: 0x111923,
    roughness: 0.7,
    metalness: 0.45,
  });

  [-1, 1].forEach((side) => {
    const sidewalk = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.28, CITY_LENGTH + 120),
      sidewalkMaterial
    );

    sidewalk.position.set(
      side * (ROAD_WIDTH / 2 + 1.6),
      0.13,
      -CITY_LENGTH / 2 + 35
    );

    sidewalk.receiveShadow = true;
    roadGroup.add(sidewalk);
  });

  const laneMaterial = new THREE.MeshBasicMaterial({
    color: 0x31d7ff,
    transparent: true,
    opacity: 0.58,
  });

  for (let z = 55; z > -CITY_LENGTH; z -= 10) {
    const lane = new THREE.Mesh(
      new THREE.PlaneGeometry(0.16, 4.3),
      laneMaterial
    );

    lane.rotation.x = -Math.PI / 2;
    lane.position.set(0, 0.035, z);
    roadGroup.add(lane);
  }

  const edgeMaterial = new THREE.MeshBasicMaterial({
    color: 0x56efb1,
    transparent: true,
    opacity: 0.35,
  });

  [-1, 1].forEach((side) => {
    const edgeLine = new THREE.Mesh(
      new THREE.PlaneGeometry(0.12, CITY_LENGTH + 110),
      edgeMaterial
    );

    edgeLine.rotation.x = -Math.PI / 2;
    edgeLine.position.set(
      side * (ROAD_WIDTH / 2 - 0.65),
      0.04,
      -CITY_LENGTH / 2 + 35
    );

    roadGroup.add(edgeLine);
  });

  return roadGroup;
}

function createParticles(isLowQuality = false) {
  const count = isLowQuality ? 90 : 240;
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const offset = index * 3;

    positions[offset] = (Math.random() - 0.5) * 120;
    positions[offset + 1] = 2 + Math.random() * 36;
    positions[offset + 2] = 50 - Math.random() * 660;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  const material = new THREE.PointsMaterial({
    color: 0x31d7ff,
    size: isLowQuality ? 0.12 : 0.17,
    transparent: true,
    opacity: 0.6,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  points.userData.basePositions = positions.slice();

  return points;
}

export function createCity({ lowQuality = false } = {}) {
  const root = new THREE.Group();
  root.name = "TMGMMarketCity";

  const animatedObjects = [];
  const districtGates = [];
  const disposableTextures = [];

  root.add(createRoad());

  const buildingSpacing = lowQuality ? 22 : 14;
  let buildingSeed = 1;

  for (let z = 55; z > -CITY_LENGTH; z -= buildingSpacing) {
    [-1, 1].forEach((side) => {
      const building = createBuilding(buildingSeed, side, z);
      root.add(building);
      buildingSeed += 1;
    });
  }

  const lightSpacing = lowQuality ? 30 : 20;

  for (let z = 50; z > -CITY_LENGTH; z -= lightSpacing) {
    root.add(createStreetLight(-1, z, 0x31d7ff));
    root.add(createStreetLight(1, z - lightSpacing / 2, 0x56efb1));
  }

  DISTRICTS.forEach((district, districtIndex) => {
    const gate = createEnergyGate(district);
    gate.position.set(0, 0, district.position);
    root.add(gate);

    districtGates.push({
      id: district.id,
      name: district.name,
      shortName: district.shortName,
      position: district.position,
      group: gate,
    });

    animatedObjects.push({
      type: "gate",
      object: gate,
      phase: districtIndex * 0.75,
    });

    const sign = createDistrictSign(district);
    sign.position.set(
      districtIndex % 2 === 0 ? -14 : 14,
      0,
      district.position - 13
    );

    sign.rotation.y =
      districtIndex % 2 === 0 ? Math.PI / 8 : -Math.PI / 8;

    if (sign.userData.texture) {
      disposableTextures.push(sign.userData.texture);
    }

    root.add(sign);

    animatedObjects.push({
      type: "sign",
      object: sign,
      phase: districtIndex * 0.55,
    });
  });

  const particles = createParticles(lowQuality);
  root.add(particles);

  animatedObjects.push({
    type: "particles",
    object: particles,
    phase: 0,
  });

  function update(elapsedTime, vehiclePosition) {
    animatedObjects.forEach((item) => {
      if (item.type === "gate") {
        const portal = item.object.userData.portal;
        const ring = item.object.userData.ring;

        if (portal?.material) {
          portal.material.opacity =
            0.32 +
            Math.sin(elapsedTime * 2.2 + item.phase) * 0.13;
        }

        if (ring) {
          ring.rotation.z = elapsedTime * 0.45 + item.phase;
          const scale =
            1 + Math.sin(elapsedTime * 1.7 + item.phase) * 0.05;
          ring.scale.setScalar(scale);
        }
      }

      if (item.type === "sign") {
        const glow = item.object.userData.glow;

        if (glow?.material) {
          glow.material.opacity =
            0.16 +
            Math.sin(elapsedTime * 1.8 + item.phase) * 0.07;
        }
      }

      if (item.type === "particles") {
        item.object.rotation.y = elapsedTime * 0.015;

        if (vehiclePosition) {
          item.object.position.z = vehiclePosition.z * 0.02;
        }
      }
    });
  }

  function getNearestDistrict(zPosition) {
    let nearest = districtGates[0];
    let nearestDistance = Number.POSITIVE_INFINITY;

    districtGates.forEach((district) => {
      const distance = Math.abs(zPosition - district.position);

      if (distance < nearestDistance) {
        nearest = district;
        nearestDistance = distance;
      }
    });

    return {
      ...nearest,
      distance: nearestDistance,
    };
  }

  function dispose() {
    disposableTextures.forEach((texture) => texture?.dispose());

    root.traverse((object) => {
      if (object.geometry) {
        object.geometry.dispose();
      }

      if (object.material) {
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];

        materials.forEach((material) => {
          if (material.map) {
            material.map.dispose();
          }

          material.dispose();
        });
      }
    });
  }

  return {
    root,
    update,
    dispose,
    districtGates,
    getNearestDistrict,
    roadWidth: ROAD_WIDTH,
    cityLength: CITY_LENGTH,
  };
}
