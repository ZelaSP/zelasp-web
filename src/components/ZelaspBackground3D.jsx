import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function calcularEtapaPorProgresso(progresso) {
  if (progresso < 0.2) return 0;
  if (progresso < 0.4) return 1;
  if (progresso < 0.6) return 2;
  if (progresso < 0.8) return 3;
  return 4;
}

export function ZelaspBackground3D({ triggerRef, onStageChange }) {
  const canvasRef = useRef(null);
  const onStageChangeRef = useRef(onStageChange);

  useEffect(() => {
    onStageChangeRef.current = onStageChange;
  }, [onStageChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
      });
    } catch {
      canvas.style.backgroundColor = '#dce9ff';
      return undefined;
    }

    let animationFrameId = null;
    let disposed = false;
    let lastStage = -1;

    /* =========================================================================
       1. SCENE, ELEVATED 3/4 PERSPECTIVE CAMERA (FOV 34°) & RENDERER
    ========================================================================= */
    const SKY_COLOR = 0xdce9ff;
    const INK_BLACK = 0x1a1a24;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(SKY_COLOR);
    scene.fog = new THREE.Fog(SKY_COLOR, 28, 56);

    const camera = new THREE.PerspectiveCamera(
      34,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;

    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    /* =========================================================================
       2. LIGHTING FOR CRISP CEL-SHADED BANDS & SOFT CARTOON SHADOWS
    ========================================================================= */
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x9fb4d6, 0.72);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfff6e5, 1.05);
    sunLight.position.set(12, 18, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 2;
    sunLight.shadow.camera.far = 45;
    const d = 14;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    /* =========================================================================
       3. STEPPED 3-TONE TOON SHADER & INVERTED-HULL CARTOON INK OUTLINES
    ========================================================================= */
    function createThreeToneGradientMap() {
      const colors = new Uint8Array([
        120, 124, 140, 255,
        198, 202, 215, 255,
        255, 255, 255, 255,
      ]);
      const gradientMap = new THREE.DataTexture(colors, 3, 1, THREE.RGBAFormat);
      gradientMap.minFilter = THREE.NearestFilter;
      gradientMap.magFilter = THREE.NearestFilter;
      gradientMap.generateMipmaps = false;
      gradientMap.needsUpdate = true;
      return gradientMap;
    }

    const TOON_GRADIENT = createThreeToneGradientMap();

    function createToonMaterial(colorHex, options = {}) {
      return new THREE.MeshToonMaterial({
        color: colorHex,
        gradientMap: TOON_GRADIENT,
        ...options,
      });
    }

    function addCartoonOutline(mesh, thickness = 0.045) {
      if (!mesh.geometry) return mesh;
      const outlineGeo = mesh.geometry.clone();
      const pos = outlineGeo.attributes.position;
      const norm = outlineGeo.attributes.normal;

      if (pos && norm) {
        const normalMap = new Map();
        for (let i = 0; i < pos.count; i++) {
          const key =
            pos.getX(i).toFixed(4) +
            '_' +
            pos.getY(i).toFixed(4) +
            '_' +
            pos.getZ(i).toFixed(4);
          if (!normalMap.has(key)) {
            normalMap.set(key, new THREE.Vector3());
          }
          normalMap
            .get(key)
            .add(new THREE.Vector3(norm.getX(i), norm.getY(i), norm.getZ(i)));
        }
        for (let i = 0; i < pos.count; i++) {
          const key =
            pos.getX(i).toFixed(4) +
            '_' +
            pos.getY(i).toFixed(4) +
            '_' +
            pos.getZ(i).toFixed(4);
          const avgNorm = normalMap.get(key).clone().normalize();
          pos.setXYZ(
            i,
            pos.getX(i) + avgNorm.x * thickness,
            pos.getY(i) + avgNorm.y * thickness,
            pos.getZ(i) + avgNorm.z * thickness
          );
        }
        pos.needsUpdate = true;
      }

      const outlineMat = new THREE.MeshBasicMaterial({
        color: INK_BLACK,
        side: THREE.BackSide,
      });
      const outlineMesh = new THREE.Mesh(outlineGeo, outlineMat);
      mesh.add(outlineMesh);
      return mesh;
    }

    function createCartoonMesh(
      geometry,
      colorHex,
      outlineThickness = 0.045,
      matOptions = {}
    ) {
      const mesh = new THREE.Mesh(geometry, createToonMaterial(colorHex, matOptions));
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      if (outlineThickness > 0) {
        addCartoonOutline(mesh, outlineThickness);
      }
      return mesh;
    }

    /* =========================================================================
       4. PROCEDURAL SÃO PAULO WAVY SIDEWALK CANVAS TEXTURE
    ========================================================================= */
    function createSaoPauloSidewalkTexture() {
      const size = 512;
      const texCanvas = document.createElement('canvas');
      texCanvas.width = size;
      texCanvas.height = size;
      const ctx = texCanvas.getContext('2d');

      ctx.fillStyle = '#f5f5f7';
      ctx.fillRect(0, 0, size, size);

      const waves = 4;
      const waveHeight = size / waves;

      for (let row = -1; row <= waves; row++) {
        const yBase = row * waveHeight;
        ctx.beginPath();
        ctx.moveTo(0, yBase);

        for (let x = 0; x <= size; x += 8) {
          const t = (x / size) * Math.PI * 2;
          const y = yBase + Math.sin(t) * (waveHeight * 0.28);
          ctx.lineTo(x, y);
        }
        for (let x = size; x >= 0; x -= 8) {
          const t = (x / size) * Math.PI * 2;
          const y = yBase + waveHeight * 0.48 + Math.sin(t) * (waveHeight * 0.28);
          ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = '#242633';
        ctx.fill();
      }

      // Subtle stone tile grid lines for cartoon crispness
      ctx.strokeStyle = 'rgba(26, 26, 36, 0.14)';
      ctx.lineWidth = 2;
      const step = size / 16;
      for (let i = 0; i <= size; i += step) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, size);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(size, i);
        ctx.stroke();
      }

      const texture = new THREE.CanvasTexture(texCanvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4, 4);
      texture.anisotropy = 4;
      return texture;
    }

    /* =========================================================================
       5. OPEN-STAGE SÃO PAULO CORNER BLOCK DIORAMA
    ========================================================================= */
    const diorama = new THREE.Group();
    worldGroup.add(diorama);

    // Base floating diorama plinth
    const plinth = createCartoonMesh(
      new THREE.BoxGeometry(16.4, 0.7, 16.4),
      0x4f596e,
      0.06
    );
    plinth.position.set(0, -0.55, 0);
    diorama.add(plinth);

    // Asphalt street deck (foreground +Z and +X)
    const roadDeck = createCartoonMesh(
      new THREE.BoxGeometry(16, 0.25, 16),
      0x363b4a,
      0.05
    );
    roadDeck.position.set(0, -0.125, 0);
    diorama.add(roadDeck);

    // Crosswalk stripes on both intersecting streets
    const stripeGeo = new THREE.BoxGeometry(0.55, 0.03, 2.2);
    for (let i = 0; i < 5; i++) {
      const stripeZ = createCartoonMesh(stripeGeo, 0xf8fafc, 0.02);
      stripeZ.position.set(-2.6 + i * 1.15, 0.015, 4.7);
      diorama.add(stripeZ);

      const stripeX = createCartoonMesh(
        new THREE.BoxGeometry(2.2, 0.03, 0.55),
        0xf8fafc,
        0.02
      );
      stripeX.position.set(4.7, 0.015, -2.6 + i * 1.15);
      diorama.add(stripeX);
    }

    // Elevated L-shaped São Paulo Sidewalk (back-left quadrant)
    const sidewalkTex = createSaoPauloSidewalkTexture();
    const sidewalkMat = new THREE.MeshToonMaterial({
      map: sidewalkTex,
      gradientMap: TOON_GRADIENT,
    });

    const sidewalkMain = new THREE.Mesh(
      new THREE.BoxGeometry(11.2, 0.24, 11.2),
      sidewalkMat
    );
    sidewalkMain.position.set(-2.4, 0.12, -2.4);
    sidewalkMain.receiveShadow = true;
    sidewalkMain.castShadow = true;
    addCartoonOutline(sidewalkMain, 0.045);
    diorama.add(sidewalkMain);

    // Chunky cartoon curb border stones
    const curbFront = createCartoonMesh(
      new THREE.BoxGeometry(11.35, 0.26, 0.34),
      0xd0d7e5,
      0.035
    );
    curbFront.position.set(-2.35, 0.13, 3.22);
    diorama.add(curbFront);

    const curbRight = createCartoonMesh(
      new THREE.BoxGeometry(0.34, 0.26, 11.35),
      0xd0d7e5,
      0.035
    );
    curbRight.position.set(3.22, 0.13, -2.35);
    diorama.add(curbRight);

    // Charming Cartoon São Paulo Corner Building (back-left so camera never clips)
    const buildingGroup = new THREE.Group();
    buildingGroup.position.set(-4.3, 0.24, -4.3);
    diorama.add(buildingGroup);

    const mainBody = createCartoonMesh(
      new THREE.BoxGeometry(5.6, 5.4, 5.6),
      0xf6bd60,
      0.06
    );
    mainBody.position.y = 2.7;
    buildingGroup.add(mainBody);

    // Terracotta ground-floor café facade trim
    const groundTrim = createCartoonMesh(
      new THREE.BoxGeometry(5.76, 1.85, 5.76),
      0xe07a5f,
      0.05
    );
    groundTrim.position.y = 0.925;
    buildingGroup.add(groundTrim);

    // Roof cornice & rooftop water tank (Caixa d'água)
    const cornice = createCartoonMesh(
      new THREE.BoxGeometry(5.95, 0.35, 5.95),
      0xf7ede2,
      0.05
    );
    cornice.position.y = 5.52;
    buildingGroup.add(cornice);

    const waterTank = createCartoonMesh(
      new THREE.CylinderGeometry(0.65, 0.58, 0.95, 14),
      0x4ea8de,
      0.045
    );
    waterTank.position.set(-1.3, 6.15, -1.3);
    buildingGroup.add(waterTank);

    const waterTankLid = createCartoonMesh(
      new THREE.ConeGeometry(0.72, 0.32, 14),
      0x3a86ff,
      0.04
    );
    waterTankLid.position.set(-1.3, 6.76, -1.3);
    buildingGroup.add(waterTankLid);

    // Striped cartoon awning over corner entrance
    for (let i = 0; i < 6; i++) {
      const awningColor = i % 2 === 0 ? 0x2ec4b6 : 0xffffff;
      const strip = createCartoonMesh(
        new THREE.BoxGeometry(0.55, 0.16, 1.05),
        awningColor,
        0.03
      );
      strip.position.set(-1.38 + i * 0.55, 1.92, 3.25);
      strip.rotation.x = 0.28;
      buildingGroup.add(strip);
    }

    // Cartoon upper-floor windows
    const winPositions = [
      [-1.5, 3.8, 2.84],
      [0.0, 3.8, 2.84],
      [1.5, 3.8, 2.84],
      [2.84, 3.8, -1.5],
      [2.84, 3.8, 0.0],
      [2.84, 3.8, 1.5],
    ];
    winPositions.forEach((pos, idx) => {
      const isSide = idx >= 3;
      const frame = createCartoonMesh(
        new THREE.BoxGeometry(isSide ? 0.16 : 0.85, 1.1, isSide ? 0.85 : 0.16),
        0xffffff,
        0.035
      );
      frame.position.set(pos[0], pos[1], pos[2]);
      buildingGroup.add(frame);

      const glass = new THREE.Mesh(
        new THREE.BoxGeometry(isSide ? 0.18 : 0.65, 0.88, isSide ? 0.65 : 0.18),
        createToonMaterial(0x90e0ef)
      );
      glass.position.set(pos[0], pos[1], pos[2]);
      buildingGroup.add(glass);
    });

    // Fluffy Cartoon Trees
    const animatedTrees = [];
    function createCartoonTree(x, z, foliageColor, scale = 1) {
      const tree = new THREE.Group();
      tree.position.set(x, 0.24, z);
      tree.scale.setScalar(scale);

      const trunk = createCartoonMesh(
        new THREE.CylinderGeometry(0.18, 0.28, 1.65, 10),
        0x8d5b4c,
        0.04
      );
      trunk.position.y = 0.825;
      tree.add(trunk);

      const canopyGroup = new THREE.Group();
      canopyGroup.position.y = 1.95;

      const puffs = [
        [0, 0.35, 0, 0.95],
        [-0.58, 0.0, 0.35, 0.72],
        [0.58, 0.05, 0.3, 0.74],
        [0, 0.05, -0.55, 0.76],
        [0.15, 0.78, -0.1, 0.65],
      ];
      puffs.forEach((p) => {
        const puff = createCartoonMesh(
          new THREE.IcosahedronGeometry(p[3], 2),
          foliageColor,
          0.045
        );
        puff.position.set(p[0], p[1], p[2]);
        canopyGroup.add(puff);
      });

      tree.add(canopyGroup);
      animatedTrees.push(canopyGroup);
      diorama.add(tree);
      return tree;
    }

    createCartoonTree(-6.2, 1.5, 0x4cc970, 0.95);
    createCartoonTree(1.6, -6.1, 0xffbe0b, 1.0); // Iconic São Paulo Ipê-Amarelo!

    // Concrete Utility Pole & Street Lamp (Left foreground corner)
    const poleGroup = new THREE.Group();
    poleGroup.position.set(-4.3, 0.24, 2.35);
    diorama.add(poleGroup);

    const poleShaft = createCartoonMesh(
      new THREE.CylinderGeometry(0.14, 0.21, 5.2, 10),
      0xb8c0cc,
      0.045
    );
    poleShaft.position.y = 2.6;
    poleGroup.add(poleShaft);

    const crossArm = createCartoonMesh(
      new THREE.BoxGeometry(1.5, 0.14, 0.14),
      0x8d99ae,
      0.035
    );
    crossArm.position.set(0, 4.85, 0);
    poleGroup.add(crossArm);

    // Curved cartoon street lamp arm
    const lampArm = createCartoonMesh(
      new THREE.BoxGeometry(0.1, 0.1, 1.25),
      0x4a5568,
      0.035
    );
    lampArm.position.set(0, 4.15, 0.55);
    lampArm.rotation.x = -0.18;
    poleGroup.add(lampArm);

    const lampHead = createCartoonMesh(
      new THREE.BoxGeometry(0.38, 0.16, 0.55),
      0x2b2d42,
      0.04
    );
    lampHead.position.set(0, 4.24, 1.12);
    poleGroup.add(lampHead);

    const lampBulbMat = new THREE.MeshBasicMaterial({ color: 0x64748b });
    const lampBulb = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.08, 0.42),
      lampBulbMat
    );
    lampBulb.position.set(0, 4.15, 1.12);
    poleGroup.add(lampBulb);

    const streetLampLight = new THREE.PointLight(0xffd166, 0, 11);
    streetLampLight.position.set(-4.3, 4.0, 3.5);
    diorama.add(streetLampLight);

    // Intact overhead power wire (visible in State 5)
    const intactWireCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4.95, 5.08, 2.35),
      new THREE.Vector3(-2.5, 4.55, 2.35),
      new THREE.Vector3(0.2, 4.95, 2.35),
    ]);
    const intactWire = createCartoonMesh(
      new THREE.TubeGeometry(intactWireCurve, 16, 0.04, 8, false),
      0x2b2d42,
      0.02
    );
    intactWire.scale.setScalar(0.001);
    diorama.add(intactWire);

    /* =========================================================================
       6. THE 4 CARTOON HAZARDS & REVITALIZED PROPS
    ========================================================================= */
    // --- HAZARD 1: Fio Elétrico Partido (Snapped sparking cable) ---
    const hazard1Group = new THREE.Group();
    diorama.add(hazard1Group);

    const snappedCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4.95, 5.08, 2.35),
      new THREE.Vector3(-5.35, 3.1, 2.65),
      new THREE.Vector3(-5.05, 1.35, 2.95),
      new THREE.Vector3(-4.75, 0.34, 3.05),
    ]);
    const snappedWire = createCartoonMesh(
      new THREE.TubeGeometry(snappedCurve, 20, 0.048, 8, false),
      0x2b2d42,
      0.025
    );
    hazard1Group.add(snappedWire);

    // Cartoon electric spark bolts at the wire tip
    const sparkGroup = new THREE.Group();
    sparkGroup.position.set(-4.75, 0.48, 3.05);
    hazard1Group.add(sparkGroup);

    const sparkSpikes = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const spikeColor = i % 2 === 0 ? 0xffbe0b : 0xff3b30;
      const spike = createCartoonMesh(
        new THREE.ConeGeometry(0.11, 0.45, 5),
        spikeColor,
        0.025
      );
      spike.rotation.z = angle;
      spike.position.set(Math.cos(angle) * 0.22, Math.sin(angle) * 0.22, 0);
      sparkGroup.add(spike);
      sparkSpikes.push(spike);
    }

    // --- HAZARD 2: Bueiro Aberto (Open storm drain + cartoon cones) ---
    // Permanent manhole rim on sidewalk-curb edge
    const manholeRim = createCartoonMesh(
      new THREE.CylinderGeometry(0.68, 0.72, 0.08, 18),
      0x6c757d,
      0.035
    );
    manholeRim.position.set(-1.35, 0.26, 2.25);
    diorama.add(manholeRim);

    const manholeHole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.56, 0.56, 0.09, 18),
      new THREE.MeshBasicMaterial({ color: 0x12131a })
    );
    manholeHole.position.set(-1.35, 0.265, 2.25);
    diorama.add(manholeHole);

    // Animated manhole lid (slid aside in State 2, slides closed in State 5)
    const manholeLid = createCartoonMesh(
      new THREE.CylinderGeometry(0.56, 0.56, 0.08, 18),
      0x495057,
      0.035
    );
    manholeLid.position.set(-0.45, 0.29, 2.05);
    diorama.add(manholeLid);

    const hazard2Group = new THREE.Group();
    diorama.add(hazard2Group);

    function createCartoonCone(x, z) {
      const cone = new THREE.Group();
      cone.position.set(x, 0.24, z);

      const base = createCartoonMesh(
        new THREE.BoxGeometry(0.46, 0.08, 0.46),
        0xff6b00,
        0.03
      );
      base.position.y = 0.04;
      cone.add(base);

      const body = createCartoonMesh(
        new THREE.ConeGeometry(0.18, 0.62, 12),
        0xff6b00,
        0.035
      );
      body.position.y = 0.36;
      cone.add(body);

      const stripe = createCartoonMesh(
        new THREE.CylinderGeometry(0.085, 0.125, 0.16, 12),
        0xffffff,
        0.025
      );
      stripe.position.y = 0.36;
      cone.add(stripe);

      hazard2Group.add(cone);
    }

    createCartoonCone(-2.05, 2.55);
    createCartoonCone(-0.85, 2.65);

    // --- HAZARD 3: Entulho na Calçada (Construction rubble pile) ---
    const hazard3Group = new THREE.Group();
    hazard3Group.position.set(1.35, 0.24, 1.35);
    diorama.add(hazard3Group);

    const rubbleMound = createCartoonMesh(
      new THREE.DodecahedronGeometry(0.72, 0),
      0x9e9589,
      0.045
    );
    rubbleMound.scale.set(1.4, 0.68, 1.15);
    rubbleMound.position.set(0, 0.28, 0);
    hazard3Group.add(rubbleMound);

    // Chunky cartoon red bricks & wooden planks
    const brickPositions = [
      [-0.45, 0.16, 0.42, 0.2],
      [0.35, 0.18, 0.48, -0.35],
      [-0.15, 0.56, 0.12, 0.5],
      [0.48, 0.22, -0.25, 0.15],
    ];
    brickPositions.forEach((b) => {
      const brick = createCartoonMesh(
        new THREE.BoxGeometry(0.36, 0.18, 0.22),
        0xd9534f,
        0.03
      );
      brick.position.set(b[0], b[1], b[2]);
      brick.rotation.set(0.2, b[3], 0.15);
      hazard3Group.add(brick);
    });

    const plank1 = createCartoonMesh(
      new THREE.BoxGeometry(1.35, 0.09, 0.24),
      0xd4a373,
      0.035
    );
    plank1.position.set(0.1, 0.48, 0.22);
    plank1.rotation.set(0.25, 0.45, -0.32);
    hazard3Group.add(plank1);

    // --- HAZARD 4: Carro Abandonado (Chunky cartoon rusted car on right curb) ---
    const hazard4Group = new THREE.Group();
    hazard4Group.position.set(4.55, 0.0, 0.35);
    diorama.add(hazard4Group);

    const carBodyGroup = new THREE.Group();
    carBodyGroup.position.y = 0.52;
    carBodyGroup.rotation.z = 0.06; // Tilted on flat tire
    hazard4Group.add(carBodyGroup);

    const chassis = createCartoonMesh(
      new THREE.BoxGeometry(1.45, 0.58, 2.75),
      0xc86d51,
      0.045
    );
    carBodyGroup.add(chassis);

    const cabin = createCartoonMesh(
      new THREE.BoxGeometry(1.22, 0.52, 1.45),
      0xd88c75,
      0.045
    );
    cabin.position.set(0, 0.5, -0.15);
    carBodyGroup.add(cabin);

    // Broken windshield
    const windshield = createCartoonMesh(
      new THREE.BoxGeometry(1.06, 0.36, 1.5),
      0x6c757d,
      0.025
    );
    windshield.position.set(0, 0.48, -0.15);
    carBodyGroup.add(windshield);

    // Cartoon wheels (one crooked)
    const wheelOffsets = [
      [-0.72, 0.26, 0.85, 0],
      [0.72, 0.26, 0.85, 0],
      [-0.72, 0.26, -0.85, 0],
      [0.76, 0.22, -0.85, 0.28],
    ];
    wheelOffsets.forEach((w) => {
      const wheel = createCartoonMesh(
        new THREE.CylinderGeometry(0.28, 0.28, 0.22, 14),
        0x2b2d42,
        0.035
      );
      wheel.rotation.z = Math.PI / 2 + w[3];
      wheel.position.set(w[0], w[1], w[2]);
      hazard4Group.add(wheel);
    });

    // Cartoon smoke puffs rising from hood
    const smokePuffs = [];
    for (let i = 0; i < 3; i++) {
      const puff = createCartoonMesh(
        new THREE.SphereGeometry(0.18 + i * 0.05, 10, 10),
        0xe2e8f0,
        0.03
      );
      puff.position.set(0.1, 1.0 + i * 0.35, 0.85);
      hazard4Group.add(puff);
      smokePuffs.push(puff);
    }

    // --- REVITALIZED STATE 5 PROPS (Pop in when hazards clear) ---
    const cleanPropsGroup = new THREE.Group();
    cleanPropsGroup.scale.setScalar(0.001);
    diorama.add(cleanPropsGroup);

    // Clean wooden & teal park bench on sidewalk
    const bench = new THREE.Group();
    bench.position.set(1.25, 0.24, 1.25);
    bench.rotation.y = -Math.PI / 4;
    const benchSeat = createCartoonMesh(
      new THREE.BoxGeometry(1.45, 0.12, 0.52),
      0xf4a261,
      0.035
    );
    benchSeat.position.y = 0.42;
    bench.add(benchSeat);

    const benchBack = createCartoonMesh(
      new THREE.BoxGeometry(1.45, 0.42, 0.1),
      0x2ec4b6,
      0.035
    );
    benchBack.position.set(0, 0.68, -0.22);
    benchBack.rotation.x = -0.15;
    bench.add(benchBack);

    [-0.55, 0.55].forEach((lx) => {
      const leg = createCartoonMesh(
        new THREE.BoxGeometry(0.12, 0.42, 0.44),
        0x2b2d42,
        0.03
      );
      leg.position.set(lx, 0.21, 0);
      bench.add(leg);
    });
    cleanPropsGroup.add(bench);

    // Bike racks (Paraciclos) where the abandoned car stood
    for (let i = 0; i < 2; i++) {
      const rack = createCartoonMesh(
        new THREE.TorusGeometry(0.32, 0.055, 8, 16, Math.PI),
        0x2ec4b6,
        0.03
      );
      rack.position.set(4.35, 0.02, -0.1 + i * 0.9);
      rack.rotation.y = Math.PI / 2;
      cleanPropsGroup.add(rack);
    }

    /* =========================================================================
       7. ELEVATED 3/4 CAMERA CHOREOGRAPHY & GSAP SCROLLTRIGGER (0% -> 100%)
    ========================================================================= */
    const waypoints = [
      // 0% - 20%: State 1 - Fio Elétrico Partido
      {
        t: 0.0,
        pos: new THREE.Vector3(2.8, 8.2, 11.8),
        target: new THREE.Vector3(-4.6, 1.6, 2.6),
        hazards: 1.0,
        clean: 0.0,
      },
      {
        t: 0.18,
        pos: new THREE.Vector3(3.2, 8.0, 11.4),
        target: new THREE.Vector3(-4.5, 1.4, 2.7),
        hazards: 1.0,
        clean: 0.0,
      },
      // 20% - 40%: State 2 - Bueiro Aberto
      {
        t: 0.32,
        pos: new THREE.Vector3(5.6, 7.6, 10.6),
        target: new THREE.Vector3(-1.35, 0.35, 2.25),
        hazards: 1.0,
        clean: 0.0,
      },
      // 40% - 60%: State 3 - Entulho na Calçada
      {
        t: 0.54,
        pos: new THREE.Vector3(8.2, 8.0, 9.8),
        target: new THREE.Vector3(1.35, 0.55, 1.35),
        hazards: 1.0,
        clean: 0.0,
      },
      // 60% - 80%: State 4 - Carro Abandonado
      {
        t: 0.74,
        pos: new THREE.Vector3(11.4, 8.2, 8.2),
        target: new THREE.Vector3(4.5, 0.65, 0.35),
        hazards: 1.0,
        clean: 0.0,
      },
      // 80% - 100%: State 5 - Rua de SP Revitalizada (Wide 3/4 Hero Diorama)
      {
        t: 0.9,
        pos: new THREE.Vector3(13.8, 12.6, 14.2),
        target: new THREE.Vector3(-0.4, 1.35, -0.4),
        hazards: 0.0,
        clean: 1.0,
      },
      {
        t: 1.0,
        pos: new THREE.Vector3(14.2, 13.0, 14.6),
        target: new THREE.Vector3(-0.4, 1.4, -0.4),
        hazards: 0.0,
        clean: 1.0,
      },
    ];

    const scrollState = { progress: 0 };
    const triggerElement = triggerRef?.current || document.body;

    const scrollTween = gsap.to(scrollState, {
      progress: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: triggerElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          const etapaAtual = calcularEtapaPorProgresso(self.progress);
          if (etapaAtual !== lastStage) {
            lastStage = etapaAtual;
            onStageChangeRef.current?.(etapaAtual);
          }
        },
      },
    });

    function sampleWaypoints(p) {
      const clamped = Math.max(0, Math.min(1, p));
      for (let i = 0; i < waypoints.length - 1; i++) {
        const a = waypoints[i];
        const b = waypoints[i + 1];
        if (clamped >= a.t && clamped <= b.t) {
          const span = b.t - a.t || 1;
          const localT = (clamped - a.t) / span;
          const smoothT = localT * localT * (3 - 2 * localT);
          return {
            pos: new THREE.Vector3().lerpVectors(a.pos, b.pos, smoothT),
            target: new THREE.Vector3().lerpVectors(a.target, b.target, smoothT),
            hazards: THREE.MathUtils.lerp(a.hazards, b.hazards, smoothT),
            clean: THREE.MathUtils.lerp(a.clean, b.clean, smoothT),
          };
        }
      }
      const last = waypoints[waypoints.length - 1];
      return {
        pos: last.pos.clone(),
        target: last.target.clone(),
        hazards: last.hazards,
        clean: last.clean,
      };
    }

    // Subtle mouse parallax
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleResize = () => {
      if (disposed) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      ScrollTrigger.refresh();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    /* =========================================================================
       8. ANIMATION LOOP (60+ FPS INERTIA LERP & CARTOON MICRO-ANIMATIONS)
    ========================================================================= */
    const currentCamPos = waypoints[0].pos.clone();
    const currentLookAt = waypoints[0].target.clone();
    camera.position.copy(currentCamPos);
    camera.lookAt(currentLookAt);

    const clock = new THREE.Clock();

    function animate() {
      if (disposed) return;
      animationFrameId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      const state = sampleWaypoints(scrollState.progress);

      // Smooth mouse parallax
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      const desiredPos = state.pos.clone();
      desiredPos.x += mouse.x * 0.65;
      desiredPos.y += -mouse.y * 0.45;

      currentCamPos.lerp(desiredPos, 0.1);
      currentLookAt.lerp(state.target, 0.1);

      camera.position.copy(currentCamPos);
      camera.lookAt(currentLookAt);

      // Bouncy cartoon transitions for hazards vs. revitalized state
      const hScale = Math.max(0.001, state.hazards);
      const cScale = Math.max(0.001, state.clean);

      hazard1Group.scale.setScalar(hScale);
      hazard2Group.scale.setScalar(hScale);
      hazard3Group.scale.setScalar(hScale);
      hazard4Group.scale.setScalar(hScale);

      intactWire.scale.setScalar(cScale);
      cleanPropsGroup.scale.setScalar(cScale);

      // Slide manhole lid closed in State 5
      manholeLid.position.x = THREE.MathUtils.lerp(-0.45, -1.35, state.clean);
      manholeLid.position.z = THREE.MathUtils.lerp(2.05, 2.25, state.clean);

      // Warm street lamp glow in State 5
      streetLampLight.intensity = state.clean * 1.6;
      lampBulbMat.color.setHex(state.clean > 0.5 ? 0xffe066 : 0x64748b);

      // Spark star animation on snapped cable
      sparkGroup.rotation.z = elapsed * 5.0;
      sparkSpikes.forEach((spike, i) => {
        const pulse = 0.75 + Math.sin(elapsed * 18 + i * 1.5) * 0.35;
        spike.scale.setScalar(pulse);
      });

      // Cartoon smoke puffs rising from abandoned car
      smokePuffs.forEach((puff, i) => {
        const cycle = (elapsed * 0.7 + i * 0.33) % 1;
        puff.position.y = 0.95 + cycle * 1.15;
        puff.position.x = 0.1 + Math.sin(elapsed * 2 + i) * 0.12;
        const s = Math.sin(cycle * Math.PI) * 1.1;
        puff.scale.setScalar(Math.max(0.01, s));
      });

      // Gentle breeze sway on cartoon tree canopies
      animatedTrees.forEach((canopy, idx) => {
        canopy.rotation.z = Math.sin(elapsed * 1.6 + idx * 1.4) * 0.035;
        canopy.rotation.x = Math.cos(elapsed * 1.3 + idx * 1.1) * 0.025;
      });

      renderer.render(scene, camera);
    }

    ScrollTrigger.refresh();
    animate();

    return () => {
      disposed = true;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      scrollTween.scrollTrigger?.kill();
      scrollTween.kill();

      scene.traverse((obj) => {
        if (obj.geometry) {
          obj.geometry.dispose();
        }
        if (obj.material) {
          const materials = Array.isArray(obj.material)
            ? obj.material
            : [obj.material];
          materials.forEach((mat) => {
            if (mat.map) mat.map.dispose();
            mat.dispose();
          });
        }
      });
      TOON_GRADIENT.dispose();
      sidewalkTex.dispose();
      renderer.dispose();
    };
  }, [triggerRef]);

  return <canvas id="zelasp-bg" ref={canvasRef} aria-hidden="true" />;
}
