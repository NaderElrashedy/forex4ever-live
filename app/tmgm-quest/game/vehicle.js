import * as THREE from "three";

const DEFAULT_POSITION = new THREE.Vector3(0, 0.45, 34);

function createWheel() {
  const tireMaterial = new THREE.MeshStandardMaterial({
    color: 0x050607,
    roughness: 0.78,
    metalness: 0.2,
  });

  const rimMaterial = new THREE.MeshStandardMaterial({
    color: 0xaedbea,
    roughness: 0.22,
    metalness: 0.95,
    emissive: 0x174257,
    emissiveIntensity: 0.22,
  });

  const wheel = new THREE.Group();

  const tire = new THREE.Mesh(
    new THREE.CylinderGeometry(0.43, 0.43, 0.33, 18),
    tireMaterial
  );

  tire.rotation.z = Math.PI / 2;
  tire.castShadow = true;
  wheel.add(tire);

  const rim = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.22, 0.35, 12),
    rimMaterial
  );

  rim.rotation.z = Math.PI / 2;
  wheel.add(rim);

  wheel.userData.tire = tire;
  wheel.userData.rim = rim;

  return wheel;
}

function createHeadlight(color = 0xdaf8ff) {
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.96,
  });

  return new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.17, 0.08),
    material
  );
}

function createRearLight() {
  const material = new THREE.MeshBasicMaterial({
    color: 0xff335f,
    transparent: true,
    opacity: 0.8,
  });

  return new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.15, 0.08),
    material
  );
}

export function createVehicle({ lowQuality = false } = {}) {
  const root = new THREE.Group();
  root.name = "TMGMVehicle";

  const visual = new THREE.Group();
  visual.rotation.y = Math.PI;
  root.add(visual);

  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x069fd0,
    emissive: 0x063b50,
    emissiveIntensity: 0.35,
    roughness: 0.22,
    metalness: 0.82,
  });

  const darkMaterial = new THREE.MeshStandardMaterial({
    color: 0x061019,
    emissive: 0x072536,
    emissiveIntensity: 0.18,
    roughness: 0.3,
    metalness: 0.8,
  });

  const glassMaterial = new THREE.MeshStandardMaterial({
    color: 0x8cecff,
    emissive: 0x123b48,
    emissiveIntensity: 0.28,
    roughness: 0.08,
    metalness: 0.35,
    transparent: true,
    opacity: 0.58,
  });

  const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xf6cf66,
    emissive: 0x6c4b0e,
    emissiveIntensity: 0.35,
    roughness: 0.2,
    metalness: 0.92,
  });

  const lowerBody = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.58, 4.25),
    bodyMaterial
  );

  lowerBody.position.y = 0.62;
  lowerBody.castShadow = true;
  lowerBody.receiveShadow = true;
  visual.add(lowerBody);

  const hood = new THREE.Mesh(
    new THREE.BoxGeometry(2.04, 0.28, 1.35),
    bodyMaterial
  );

  hood.position.set(0, 0.94, -1.25);
  hood.rotation.x = -0.05;
  hood.castShadow = true;
  visual.add(hood);

  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(1.78, 0.78, 1.85),
    glassMaterial
  );

  cabin.position.set(0, 1.22, 0.25);
  cabin.castShadow = true;
  visual.add(cabin);

  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(1.62, 0.15, 1.5),
    darkMaterial
  );

  roof.position.set(0, 1.66, 0.28);
  roof.castShadow = true;
  visual.add(roof);

  const frontBumper = new THREE.Mesh(
    new THREE.BoxGeometry(2.12, 0.22, 0.22),
    darkMaterial
  );

  frontBumper.position.set(0, 0.47, -2.12);
  visual.add(frontBumper);

  const rearBumper = frontBumper.clone();
  rearBumper.position.z = 2.12;
  visual.add(rearBumper);

  const centerStripe = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.04, 3.85),
    goldMaterial
  );

  centerStripe.position.set(0, 0.94, -0.06);
  visual.add(centerStripe);

  const spoilerStandLeft = new THREE.Mesh(
    new THREE.BoxGeometry(0.09, 0.42, 0.1),
    darkMaterial
  );

  spoilerStandLeft.position.set(-0.68, 1.04, 1.75);
  visual.add(spoilerStandLeft);

  const spoilerStandRight = spoilerStandLeft.clone();
  spoilerStandRight.position.x = 0.68;
  visual.add(spoilerStandRight);

  const spoiler = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.1, 0.35),
    darkMaterial
  );

  spoiler.position.set(0, 1.25, 1.75);
  visual.add(spoiler);

  const wheelPositions = [
    [-1.08, 0.46, -1.35],
    [1.08, 0.46, -1.35],
    [-1.08, 0.46, 1.35],
    [1.08, 0.46, 1.35],
  ];

  const wheels = wheelPositions.map(([x, y, z]) => {
    const wheel = createWheel();
    wheel.position.set(x, y, z);
    visual.add(wheel);
    return wheel;
  });

  const leftHeadlight = createHeadlight();
  leftHeadlight.position.set(-0.67, 0.76, -2.15);
  visual.add(leftHeadlight);

  const rightHeadlight = createHeadlight();
  rightHeadlight.position.set(0.67, 0.76, -2.15);
  visual.add(rightHeadlight);

  const leftRearLight = createRearLight();
  leftRearLight.position.set(-0.65, 0.72, 2.15);
  visual.add(leftRearLight);

  const rightRearLight = createRearLight();
  rightRearLight.position.set(0.65, 0.72, 2.15);
  visual.add(rightRearLight);

  const underGlowMaterial = new THREE.MeshBasicMaterial({
    color: 0x31d7ff,
    transparent: true,
    opacity: 0.32,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const underGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 5.1),
    underGlowMaterial
  );

  underGlow.rotation.x = -Math.PI / 2;
  underGlow.position.y = 0.12;
  visual.add(underGlow);

  let frontLight = null;

  if (!lowQuality) {
    frontLight = new THREE.SpotLight(
      0xbcefff,
      13,
      28,
      Math.PI / 7,
      0.65,
      1.6
    );

    frontLight.position.set(0, 1, -1.65);
    frontLight.target.position.set(0, 0, -16);

    visual.add(frontLight);
    visual.add(frontLight.target);
  }

  root.position.copy(DEFAULT_POSITION);

  const state = {
    speed: 0,
    steering: 0,
    heading: 0,
    distance: 0,
    riskFromCollisions: 0,
    collisionCooldown: 0,
    braking: false,
    handbrake: false,
  };

  function reset(position = DEFAULT_POSITION) {
    root.position.copy(position);
    root.rotation.set(0, 0, 0);

    state.speed = 0;
    state.steering = 0;
    state.heading = 0;
    state.collisionCooldown = 0;
    state.braking = false;
    state.handbrake = false;
  }

  function update(delta, controls, upgrades = {}) {
    const safeDelta = Math.min(delta, 0.05);

    const engineLevel = Number(upgrades.engine || 0);
    const handlingLevel = Number(upgrades.handling || 0);

    const maxForwardSpeed = 18 + engineLevel * 2.8;
    const maxReverseSpeed = -7;
    const acceleration = 12 + engineLevel * 1.7;
    const reverseAcceleration = 8;
    const brakePower = 22;
    const rollingResistance = controls.handbrake ? 8.8 : 3.2;
    const steeringPower = 1.75 + handlingLevel * 0.17;

    state.braking = Boolean(controls.brake);
    state.handbrake = Boolean(controls.handbrake);

    if (controls.accelerate) {
      if (state.speed < 0) {
        state.speed += brakePower * safeDelta;
      } else {
        state.speed += acceleration * safeDelta;
      }
    } else if (controls.brake) {
      if (state.speed > 0) {
        state.speed -= brakePower * safeDelta;
      } else {
        state.speed -= reverseAcceleration * safeDelta;
      }
    } else if (state.speed > 0) {
      state.speed = Math.max(
        0,
        state.speed - rollingResistance * safeDelta
      );
    } else if (state.speed < 0) {
      state.speed = Math.min(
        0,
        state.speed + rollingResistance * safeDelta
      );
    }

    state.speed = THREE.MathUtils.clamp(
      state.speed,
      maxReverseSpeed,
      maxForwardSpeed
    );

    const targetSteering =
      (controls.left ? 1 : 0) - (controls.right ? 1 : 0);

    state.steering = THREE.MathUtils.lerp(
      state.steering,
      targetSteering,
      1 - Math.pow(0.0005, safeDelta)
    );

    const speedRatio = THREE.MathUtils.clamp(
      Math.abs(state.speed) / maxForwardSpeed,
      0,
      1
    );

    if (Math.abs(state.speed) > 0.12) {
      const reverseDirection = state.speed >= 0 ? 1 : -1;
      const handbrakeMultiplier = controls.handbrake ? 1.45 : 1;

      state.heading +=
        state.steering *
        steeringPower *
        (0.18 + speedRatio * 0.82) *
        safeDelta *
        reverseDirection *
        handbrakeMultiplier;
    }

    const forwardX = Math.sin(state.heading);
    const forwardZ = -Math.cos(state.heading);

    root.position.x += forwardX * state.speed * safeDelta;
    root.position.z += forwardZ * state.speed * safeDelta;

    state.distance += Math.abs(state.speed * safeDelta);

    const roadLimit = 7.15;
    let collided = false;

    if (root.position.x < -roadLimit) {
      root.position.x = -roadLimit;
      collided = true;
    }

    if (root.position.x > roadLimit) {
      root.position.x = roadLimit;
      collided = true;
    }

    if (root.position.z > 43) {
      root.position.z = 43;
      collided = true;
    }

    if (root.position.z < -575) {
      root.position.z = -575;
      state.speed = 0;
    }

    if (collided) {
      state.speed *= -0.22;

      if (state.collisionCooldown <= 0) {
        state.riskFromCollisions += 1;
        state.collisionCooldown = 1.1;
      }
    }

    state.collisionCooldown = Math.max(
      0,
      state.collisionCooldown - safeDelta
    );

    root.rotation.y = state.heading;

    const bodyLean =
      -state.steering * speedRatio * (controls.handbrake ? 0.1 : 0.045);

    visual.rotation.z = THREE.MathUtils.lerp(
      visual.rotation.z,
      bodyLean,
      0.12
    );

    visual.position.y =
      Math.sin(state.distance * 2.7) * Math.min(speedRatio * 0.025, 0.025);

    const wheelRotation = state.speed * safeDelta * 1.7;

    wheels.forEach((wheel, index) => {
      wheel.userData.tire.rotation.x -= wheelRotation;
      wheel.userData.rim.rotation.x -= wheelRotation;

      if (index < 2) {
        wheel.rotation.y = -state.steering * 0.34;
      }
    });

    const rearOpacity =
      controls.brake || controls.handbrake ? 1 : 0.58;

    leftRearLight.material.opacity = rearOpacity;
    rightRearLight.material.opacity = rearOpacity;

    underGlow.material.opacity =
      0.24 + Math.sin(performance.now() * 0.004) * 0.06;

    return {
      ...state,
      maxSpeed: maxForwardSpeed,
      speedKmh: Math.round(Math.abs(state.speed) * 8.4),
      position: root.position.clone(),
    };
  }

  function dispose() {
    root.traverse((object) => {
      if (object.geometry) {
        object.geometry.dispose();
      }

      if (object.material) {
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];

        materials.forEach((material) => material.dispose());
      }
    });
  }

  return {
    root,
    state,
    update,
    reset,
    dispose,
  };
}
