"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createCity } from "../game/city";
import { createVehicle } from "../game/vehicle";
import styles from "../tmgm-quest.module.css";

const CONTROL_EVENT = "tmgm-mobile-control";

const INITIAL_CONTROLS = {
  accelerate: false,
  brake: false,
  left: false,
  right: false,
  handbrake: false,
};

function isMobileDevice() {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.innerWidth <= 820 ||
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
  );
}

function prefersReducedMotion() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isWeakDevice() {
  if (typeof window === "undefined") {
    return false;
  }

  const memory = Number(navigator.deviceMemory || 8);
  const cores = Number(navigator.hardwareConcurrency || 8);

  return memory <= 4 || cores <= 4 || isMobileDevice();
}

function createSky() {
  const geometry = new THREE.SphereGeometry(420, 32, 24);

  const material = new THREE.MeshBasicMaterial({
    color: 0x01050a,
    side: THREE.BackSide,
    fog: false,
  });

  return new THREE.Mesh(geometry, material);
}

function createStars(lowQuality) {
  const count = lowQuality ? 180 : 560;
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const offset = index * 3;

    positions[offset] = (Math.random() - 0.5) * 460;
    positions[offset + 1] = 30 + Math.random() * 140;
    positions[offset + 2] = 80 - Math.random() * 760;
  }

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  const material = new THREE.PointsMaterial({
    color: 0xcaf7ff,
    size: lowQuality ? 0.45 : 0.65,
    transparent: true,
    opacity: 0.78,
    depthWrite: false,
  });

  return new THREE.Points(geometry, material);
}

function getCameraTarget(vehicle, target, lowMotion) {
  const forward = new THREE.Vector3(
    Math.sin(vehicle.state.heading),
    0,
    -Math.cos(vehicle.state.heading)
  );

  const right = new THREE.Vector3(
    Math.cos(vehicle.state.heading),
    0,
    Math.sin(vehicle.state.heading)
  );

  const speedRatio = THREE.MathUtils.clamp(
    Math.abs(vehicle.state.speed) / 20,
    0,
    1
  );

  const cameraDistance = lowMotion ? 9.4 : 9.4 + speedRatio * 1.8;

  target
    .copy(vehicle.root.position)
    .addScaledVector(forward, -cameraDistance)
    .addScaledVector(right, -vehicle.state.steering * speedRatio * 0.7);

  target.y += 5.4 + speedRatio * 0.5;

  return target;
}

export default function GameCanvas({
  progress,
  gamePaused = false,
  onDistrictChange,
  onVehicleUpdate,
  onMissionRequest,
  onTogglePhone,
  onToggleMap,
  onReady,
}) {
  const containerRef = useRef(null);
  const callbacksRef = useRef({});
  const progressRef = useRef(progress);
  const pausedRef = useRef(gamePaused);

  useEffect(() => {
    callbacksRef.current = {
      onDistrictChange,
      onVehicleUpdate,
      onMissionRequest,
      onTogglePhone,
      onToggleMap,
      onReady,
    };
  }, [
    onDistrictChange,
    onVehicleUpdate,
    onMissionRequest,
    onTogglePhone,
    onToggleMap,
    onReady,
  ]);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    pausedRef.current = gamePaused;
  }, [gamePaused]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return undefined;
    }

    const lowQuality = isWeakDevice();
    const reducedMotion = prefersReducedMotion();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x01050a);
    scene.fog = new THREE.FogExp2(
      lowQuality ? 0x06101a : 0x030b13,
      lowQuality ? 0.018 : 0.014
    );

    const camera = new THREE.PerspectiveCamera(
      58,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      760
    );

    camera.position.set(0, 6, 44);

    const renderer = new THREE.WebGLRenderer({
      antialias: !lowQuality,
      alpha: false,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio || 1,
        lowQuality ? 1.2 : 1.75
      )
    );

    renderer.setSize(
      container.clientWidth,
      container.clientHeight,
      false
    );

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = lowQuality ? 1.02 : 1.15;

    renderer.shadowMap.enabled = !lowQuality;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    const sky = createSky();
    scene.add(sky);

    const stars = createStars(lowQuality);
    scene.add(stars);

    const hemisphereLight = new THREE.HemisphereLight(
      0x65dcff,
      0x020306,
      lowQuality ? 1.2 : 1.55
    );

    scene.add(hemisphereLight);

    const moonLight = new THREE.DirectionalLight(
      0xbceeff,
      lowQuality ? 1.4 : 2.2
    );

    moonLight.position.set(-18, 35, 20);

    if (!lowQuality) {
      moonLight.castShadow = true;
      moonLight.shadow.mapSize.set(1024, 1024);
      moonLight.shadow.camera.left = -26;
      moonLight.shadow.camera.right = 26;
      moonLight.shadow.camera.top = 30;
      moonLight.shadow.camera.bottom = -15;
    }

    scene.add(moonLight);

    const cyanLight = new THREE.PointLight(
      0x31d7ff,
      lowQuality ? 12 : 22,
      85,
      1.7
    );

    cyanLight.position.set(-15, 10, -90);
    scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(
      0x9c8cff,
      lowQuality ? 10 : 18,
      90,
      1.8
    );

    purpleLight.position.set(18, 11, -205);
    scene.add(purpleLight);

    const goldenLight = new THREE.PointLight(
      0xf6cf66,
      lowQuality ? 13 : 24,
      105,
      1.6
    );

    goldenLight.position.set(0, 15, -525);
    scene.add(goldenLight);

    const city = createCity({ lowQuality });
    scene.add(city.root);

    const vehicle = createVehicle({ lowQuality });
    scene.add(vehicle.root);

    const controls = { ...INITIAL_CONTROLS };
    const cameraTarget = new THREE.Vector3();
    const lookTarget = new THREE.Vector3();

    let animationFrame = 0;
    let lastTime = performance.now();
    let lastHudUpdate = 0;
    let currentDistrictId = null;
    let disposed = false;

    function setControl(control, active) {
      if (Object.prototype.hasOwnProperty.call(controls, control)) {
        controls[control] = Boolean(active);
      }
    }

    function releaseAllControls() {
      Object.keys(controls).forEach((control) => {
        controls[control] = false;
      });
    }

    function handleKeyDown(event) {
      const tagName = event.target?.tagName?.toLowerCase();

      if (
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select"
      ) {
        return;
      }

      if (
        [
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "Space",
        ].includes(event.code)
      ) {
        event.preventDefault();
      }

      switch (event.code) {
        case "KeyW":
        case "ArrowUp":
          setControl("accelerate", true);
          break;

        case "KeyS":
        case "ArrowDown":
          setControl("brake", true);
          break;

        case "KeyA":
        case "ArrowLeft":
          setControl("left", true);
          break;

        case "KeyD":
        case "ArrowRight":
          setControl("right", true);
          break;

        case "Space":
          setControl("handbrake", true);
          break;

        case "KeyE":
          if (!event.repeat) {
            const nearest = city.getNearestDistrict(
              vehicle.root.position.z
            );

            callbacksRef.current.onMissionRequest?.(nearest);
          }
          break;

        case "KeyP":
          if (!event.repeat) {
            callbacksRef.current.onTogglePhone?.();
          }
          break;

        case "KeyM":
          if (!event.repeat) {
            callbacksRef.current.onToggleMap?.();
          }
          break;

        case "KeyR":
          if (!event.repeat) {
            vehicle.reset();
          }
          break;

        default:
          break;
      }
    }

    function handleKeyUp(event) {
      switch (event.code) {
        case "KeyW":
        case "ArrowUp":
          setControl("accelerate", false);
          break;

        case "KeyS":
        case "ArrowDown":
          setControl("brake", false);
          break;

        case "KeyA":
        case "ArrowLeft":
          setControl("left", false);
          break;

        case "KeyD":
        case "ArrowRight":
          setControl("right", false);
          break;

        case "Space":
          setControl("handbrake", false);
          break;

        default:
          break;
      }
    }

    function handleMobileControl(event) {
      const detail = event.detail || {};

      if (detail.action === "mission") {
        const nearest = city.getNearestDistrict(vehicle.root.position.z);
        callbacksRef.current.onMissionRequest?.(nearest);
        return;
      }

      if (detail.action === "phone") {
        callbacksRef.current.onTogglePhone?.();
        return;
      }

      if (detail.action === "map") {
        callbacksRef.current.onToggleMap?.();
        return;
      }

      if (detail.action === "reset") {
        vehicle.reset();
        return;
      }

      if (detail.control) {
        setControl(detail.control, detail.active);
      }
    }

    function handleResize() {
      if (!container || disposed) {
        return;
      }

      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height, false);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", releaseAllControls);
    window.addEventListener("resize", handleResize);
    window.addEventListener(CONTROL_EVENT, handleMobileControl);

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(handleResize)
        : null;

    resizeObserver?.observe(container);

    callbacksRef.current.onReady?.({
      lowQuality,
      reducedMotion,
    });

    function animate(now) {
      if (disposed) {
        return;
      }

      animationFrame = window.requestAnimationFrame(animate);

      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const isPaused = pausedRef.current;

      if (!isPaused) {
        const upgrades = progressRef.current?.upgrades || {};

        const vehicleState = vehicle.update(
          delta,
          controls,
          upgrades
        );

        city.update(now / 1000, vehicle.root.position);

        stars.rotation.y += delta * 0.002;

        const nearestDistrict = city.getNearestDistrict(
          vehicle.root.position.z
        );

        if (nearestDistrict.id !== currentDistrictId) {
          currentDistrictId = nearestDistrict.id;

          callbacksRef.current.onDistrictChange?.({
            id: nearestDistrict.id,
            name: nearestDistrict.name,
            shortName: nearestDistrict.shortName,
            distance: nearestDistrict.distance,
          });
        }

        if (now - lastHudUpdate >= 100) {
          lastHudUpdate = now;

          callbacksRef.current.onVehicleUpdate?.({
            speed: vehicleState.speedKmh,
            rawSpeed: vehicleState.speed,
            distance: vehicleState.distance,
            position: {
              x: vehicleState.position.x,
              y: vehicleState.position.y,
              z: vehicleState.position.z,
            },
            steering: vehicleState.steering,
            braking: vehicleState.braking,
            handbrake: vehicleState.handbrake,
            collisionCount: vehicleState.riskFromCollisions,
            district: {
              id: nearestDistrict.id,
              name: nearestDistrict.name,
              shortName: nearestDistrict.shortName,
              distance: nearestDistrict.distance,
            },
            canEnterMission: nearestDistrict.distance <= 14,
            journeyProgress: THREE.MathUtils.clamp(
              Math.round(
                ((34 - vehicle.root.position.z) / 565) * 100
              ),
              0,
              100
            ),
          });
        }
      }

      getCameraTarget(
        vehicle,
        cameraTarget,
        reducedMotion
      );

      const cameraLerp = reducedMotion ? 0.2 : 0.075;

      camera.position.lerp(cameraTarget, cameraLerp);

      const forward = new THREE.Vector3(
        Math.sin(vehicle.state.heading),
        0,
        -Math.cos(vehicle.state.heading)
      );

      lookTarget
        .copy(vehicle.root.position)
        .addScaledVector(forward, 7);

      lookTarget.y += 1.1;

      camera.lookAt(lookTarget);

      renderer.render(scene, camera);
    }

    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      disposed = true;

      window.cancelAnimationFrame(animationFrame);

      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", releaseAllControls);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener(
        CONTROL_EVENT,
        handleMobileControl
      );

      resizeObserver?.disconnect();

      city.dispose();
      vehicle.dispose();

      stars.geometry.dispose();
      stars.material.dispose();

      sky.geometry.dispose();
      sky.material.dispose();

      scene.clear();
      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={styles.gameCanvas}
      aria-label="TMGM Market City 3D game world"
    />
  );
}
