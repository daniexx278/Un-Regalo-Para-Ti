import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { HeartData } from '../types';
import { Heart, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface GalaxyUniverseProps {
  hearts: HeartData[];
  onSelectHeart: (id: number) => void;
  onUnlockFinal: () => void;
  isFinalUnlocked: boolean;
}

export default function GalaxyUniverse({ hearts, onSelectHeart, onUnlockFinal, isFinalUnlocked }: GalaxyUniverseProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredHeart, setHoveredHeart] = useState<HeartData | null>(null);
  const [showProgressHint, setShowProgressHint] = useState(true);

  // Calculate opened hearts progress
  const openedCount = hearts.filter((h) => h.opened).length;
  const allOpened = openedCount === 6;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    // Add dark stellar space fog
    scene.fog = new THREE.FogExp2(0x0a0522, 0.015);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 10, 16);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 35;
    controls.minDistance = 4;
    controls.autoRotate = false; // user can navigate, but scene rotating particles handles the movement!

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 2, 50);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    const dirLight1 = new THREE.DirectionalLight(0xff69b4, 1.2);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x9a5de5, 1);
    dirLight2.position.set(-5, -5, -5);
    scene.add(dirLight2);

    // 6. Nucleus (Glowing core Sphere)
    const nucleusGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    // Mesh basic / emission setup
    const nucleusMaterial = new THREE.MeshBasicMaterial({
      color: 0xffd700, // Shiny gold core
      transparent: true,
      opacity: 0.9,
    });
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
    scene.add(nucleus);

    // Sub-glowing outline sphere for nucleus
    const glowGeometry = new THREE.SphereGeometry(1.8, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xff4da6,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    });
    const nucleusGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(nucleusGlow);

    // 7. Rotating Spiral Galaxy Points
    const galaxyParticlesCount = 5000;
    const galaxyGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(galaxyParticlesCount * 3);
    const colors = new Float32Array(galaxyParticlesCount * 3);

    const galaxyArms = 3;
    const galaxyRadius = 15;
    const coreColor = new THREE.Color('#ffe259'); // Gold inside
    const outerColor = new THREE.Color('#ffa751'); // Orange / Pink outside
    const purpleColor = new THREE.Color('#9400d3'); // Deep purple outside

    for (let i = 0; i < galaxyParticlesCount; i++) {
      const r = Math.random() * galaxyRadius;
      // Stagger arms
      const armAngle = ((i % galaxyArms) * 2 * Math.PI) / galaxyArms;
      const spinAngle = r * 1.8; // spiral winding effect

      // Normal random dispersion
      const spreadX = Math.pow(Math.random(), 3) * (Math.random() > 0.5 ? 1 : -1) * 1.5;
      const spreadY = Math.pow(Math.random(), 3) * (Math.random() > 0.5 ? 1 : -1) * 0.4;
      const spreadZ = Math.pow(Math.random(), 3) * (Math.random() > 0.5 ? 1 : -1) * 1.5;

      const x = Math.cos(armAngle + spinAngle) * r + spreadX;
      const y = spreadY;
      const z = Math.sin(armAngle + spinAngle) * r + spreadZ;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color interpolation
      const mixRatio = r / galaxyRadius;
      let finalCol = coreColor.clone();
      if (mixRatio < 0.4) {
        finalCol.lerp(outerColor, mixRatio / 0.4);
      } else {
        finalCol = outerColor.clone().lerp(purpleColor, (mixRatio - 0.4) / 0.6);
      }

      colors[i * 3] = finalCol.r;
      colors[i * 3 + 1] = finalCol.g;
      colors[i * 3 + 2] = finalCol.b;
    }

    galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom textured points or round points
    const galaxyMaterial = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const galaxyPoints = new THREE.Points(galaxyGeometry, galaxyMaterial);
    scene.add(galaxyPoints);

    // 8. 3D Heart Meshes
    // Helper to generate a nice extruded 3D heart shape
    const heartShape = new THREE.Shape();
    // Heart coordinates centered and shaped beautifully
    heartShape.moveTo(0, 0.4);
    heartShape.bezierCurveTo(0, 0.45, 0.15, 0.8, 0.6, 0.8);
    heartShape.bezierCurveTo(0.95, 0.8, 0.95, 0.45, 0.95, 0.45);
    heartShape.bezierCurveTo(0.95, 0.15, 0.55, -0.25, 0, -0.65);
    heartShape.bezierCurveTo(-0.55, -0.25, -0.95, 0.15, -0.95, 0.45);
    heartShape.bezierCurveTo(-0.95, 0.45, -0.95, 0.8, -0.6, 0.8);
    heartShape.bezierCurveTo(-0.15, 0.8, 0, 0.45, 0, 0.4);

    const extrudeSettings = {
      depth: 0.25,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.06,
    };

    const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    heartGeometry.center(); // Center local pivot coordinates

    interface HeartMeshWrapper {
      data: HeartData;
      mesh: THREE.Mesh;
      initialScale: number;
      orbitSpeed: number;
      orbitRadius: number;
      orbitHeight: number;
      orbitAngle: number;
    }

    const heartMeshes: HeartMeshWrapper[] = [];

    // Orbits configurations for the 6 hearts
    const orbitConfigs = [
      { radius: 5.2, height: 1.0, speed: 0.015, angle: 0 },
      { radius: 6.8, height: -0.6, speed: -0.012, angle: Math.PI / 3 },
      { radius: 8.5, height: 1.5, speed: 0.009, angle: (Math.PI * 2) / 3 },
      { radius: 10.0, height: -1.2, speed: 0.011, angle: Math.PI },
      { radius: 11.5, height: 0.5, speed: -0.008, angle: (Math.PI * 4) / 3 },
      { radius: 13.0, height: -0.2, speed: 0.007, angle: (Math.PI * 5) / 3 },
    ];

    hearts.forEach((heartData, index) => {
      const config = orbitConfigs[index];
      
      // Materials corresponding to whether it's completed (sparkling gold edges) or untouched
      const meshColor = heartData.coordinateColor;
      const isOpened = heartData.opened;
      
      const heartMat = new THREE.MeshStandardMaterial({
        color: meshColor,
        roughness: 0.1,
        metalness: 0.5,
        emissive: meshColor,
        emissiveIntensity: isOpened ? 0.4 : 0.15,
        transparent: true,
        opacity: 0.95,
      });

      const hMesh = new THREE.Mesh(heartGeometry, heartMat);
      
      // Store heart ID in userData for raycaster click identification
      hMesh.userData = { heartId: heartData.id };
      
      // Scale down standard size to fit nicely
      // Already read hearts can get a subtle crown or larger presence
      const baseScale = isOpened ? 1.1 : 0.9;
      hMesh.scale.set(baseScale, baseScale, baseScale);

      scene.add(hMesh);

      heartMeshes.push({
        data: heartData,
        mesh: hMesh,
        initialScale: baseScale,
        orbitSpeed: config.speed,
        orbitRadius: config.radius,
        orbitHeight: config.height,
        orbitAngle: config.angle,
      });

      // If already opened, spawn a small glowing helper orbit ring around it
      if (isOpened) {
        const ringGeo = new THREE.RingGeometry(1.2, 1.25, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xffd700,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.25,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        hMesh.add(ringMesh);
      }
    });

    // 9. Floating Star Dust around the hearts
    const heartDustCount = 80;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(heartDustCount * 3);
    for (let i = 0; i < heartDustCount * 3; i += 3) {
      dustPos[i] = (Math.random() - 0.5) * 28;
      dustPos[i + 1] = (Math.random() - 0.5) * 8;
      dustPos[i + 2] = (Math.random() - 0.5) * 28;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMaterial = new THREE.PointsMaterial({
      color: 0xfcb0c3,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
    });
    const heartAmbientDust = new THREE.Points(dustGeo, dustMaterial);
    scene.add(heartAmbientDust);

    // 10. Pointer Interactions (Raycasting)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let currentHoverMesh: THREE.Mesh | null = null;
    let clickSelectedMesh: THREE.Mesh | null = null;
    let cameraMovingToTarget = false;
    let targetCameraPosition = new THREE.Vector3();
    let targetLookAt = new THREE.Vector3(0, 0, 0);

    const onPointerMove = (e: MouseEvent) => {
      // Get relative coordinates on container parent
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(heartMeshes.map(hm => hm.mesh));

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object as THREE.Mesh;
        if (currentHoverMesh !== hitMesh) {
          // Reset old
          if (currentHoverMesh) {
            const wrap = heartMeshes.find(hm => hm.mesh === currentHoverMesh);
            if (wrap) {
              currentHoverMesh.scale.set(wrap.initialScale, wrap.initialScale, wrap.initialScale);
              const mat = currentHoverMesh.material as THREE.MeshStandardMaterial;
              mat.emissiveIntensity = wrap.data.opened ? 0.4 : 0.15;
            }
          }
          // Highlight new
          currentHoverMesh = hitMesh;
          const wrap = heartMeshes.find(hm => hm.mesh === hitMesh);
          if (wrap) {
            hitMesh.scale.set(wrap.initialScale * 1.35, wrap.initialScale * 1.35, wrap.initialScale * 1.35);
            const mat = hitMesh.material as THREE.MeshStandardMaterial;
            mat.emissiveIntensity = 0.8; // intense glowing highlight
            setHoveredHeart(wrap.data);
          }
        }
      } else {
        if (currentHoverMesh) {
          const wrap = heartMeshes.find(hm => hm.mesh === currentHoverMesh);
          if (wrap) {
            currentHoverMesh.scale.set(wrap.initialScale, wrap.initialScale, wrap.initialScale);
            const mat = currentHoverMesh.material as THREE.MeshStandardMaterial;
            mat.emissiveIntensity = wrap.data.opened ? 0.4 : 0.15;
          }
          currentHoverMesh = null;
          setHoveredHeart(null);
        }
      }
    };

    const onCanvasClick = () => {
      if (!currentHoverMesh || cameraMovingToTarget) return;

      const hitId = currentHoverMesh.userData.heartId;
      const wrap = heartMeshes.find(hm => hm.mesh === currentHoverMesh);
      if (!wrap) return;

      clickSelectedMesh = currentHoverMesh;
      cameraMovingToTarget = true;
      controls.enabled = false; // block user drag during fly-in zoom

      // Zoom vectors
      const heartWorldPos = new THREE.Vector3();
      wrap.mesh.getWorldPosition(heartWorldPos);

      // Back off camera slightly so heart displays centrally
      targetLookAt.copy(heartWorldPos);
      targetCameraPosition.copy(heartWorldPos).add(new THREE.Vector3(0, 0, 2.5));

      // Trigger callback after smooth animation window
      setTimeout(() => {
        onSelectHeart(hitId);
      }, 1000);
    };

    renderer.domElement.addEventListener('mousemove', onPointerMove);
    renderer.domElement.addEventListener('click', onCanvasClick);

    // 11. Animation Frame Rendering Loop
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Slowly rotate galaxy points
      galaxyPoints.rotation.y = elapsed * 0.05;
      
      // Pulse nucleus
      const nucleusPulse = 1.0 + Math.sin(elapsed * 2.5) * 0.055;
      nucleus.scale.set(nucleusPulse, nucleusPulse, nucleusPulse);
      nucleusGlow.scale.set(nucleusPulse * 1.2, nucleusPulse * 1.2, nucleusPulse * 1.2);

      // Heart Orbits & Rotations
      heartMeshes.forEach((hm) => {
        // Stop individual orbits if we are clicking and zooming in
        if (clickSelectedMesh && clickSelectedMesh === hm.mesh) {
          // Slow pulse
          hm.mesh.rotation.y += delta * 1.5;
        } else {
          hm.orbitAngle += hm.orbitSpeed;
          hm.mesh.position.x = Math.cos(hm.orbitAngle) * hm.orbitRadius;
          hm.mesh.position.z = Math.sin(hm.orbitAngle) * hm.orbitRadius;
          hm.mesh.position.y = hm.orbitHeight + Math.sin(elapsed + hm.data.id) * 0.25; // Gentle wave-bounce

          // Gentle rotation
          hm.mesh.rotation.y = elapsed * 0.4 + hm.data.id;
          hm.mesh.rotation.x = Math.sin(elapsed * 0.5 + hm.data.id) * 0.15;
        }
      });

      // Slowly drift ambient starry sparkles at bottom
      heartAmbientDust.rotation.y = elapsed * -0.02;

      // Handle custom camera zoom interpolations
      if (cameraMovingToTarget) {
        camera.position.lerp(targetCameraPosition, 0.1);
        controls.target.lerp(targetLookAt, 0.1);
      } else {
        controls.update();
      }

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    let animationId = requestAnimationFrame(animate);

    // 12. Handle window size responsive resizing
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      width = container.clientWidth;
      height = container.clientHeight || window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      cancelAnimationFrame(animationId);
    };
  }, [hearts, onSelectHeart]);

  return (
    <div className="relative w-full h-full flex flex-col items-center">
      
      {/* Absolute Header Overlay */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 text-center w-full max-w-lg px-4 pointer-events-none">
        <h3 className="font-display text-2xl tracking-[0.2em] text-pink-300 font-bold uppercase drop-shadow-[0_2px_10px_rgba(236,72,153,0.3)]">
          El Universo De Tus Logros
        </h3>
        <p className="font-sans text-xs text-purple-300/80 tracking-wide mt-1">
          Gira para explorar la galaxia y haz clic en cada uno de los 6 corazones
        </p>
      </div>

      {/* Primary 3D Rendering Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing z-20" />

      {/* Floating Center Nucleus Label overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none text-center transform -mt-4">
        <motion.div
          animate={{ scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="bg-black/40 backdrop-blur-md px-5 py-2 rounded-full border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]"
        >
          <span className="font-display text-xs tracking-wider text-amber-200 font-bold flex items-center gap-1">
            NÚCLEO MÁGICO ❤️
          </span>
        </motion.div>
      </div>

      {/* Orbit Interactive Status Card (Left Bottom) */}
      <div className="absolute bottom-6 left-6 z-30 pointer-events-auto flex flex-col gap-1.5 font-sans">
        <div className="bg-slate-950/70 backdrop-blur-md border border-purple-500/20 rounded-2xl px-5 py-4 max-w-xs shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2 text-pink-300 font-display font-bold text-sm tracking-widest uppercase mb-2">
            <Heart size={15} fill="currentColor" className="animate-pulse text-pink-500" />
            TU PROGRESO
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-purple-950/60 rounded-full h-2 mb-2 p-[1px]">
            <div 
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_#ec4899]"
              style={{ width: `${(openedCount / 6) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center text-xs text-purple-200 font-mono mt-1">
            <span>CORAZONES LEÍDOS:</span>
            <span className="font-bold text-pink-400">{openedCount} / 6</span>
          </div>

          <p className="text-[11px] text-purple-300/80 leading-relaxed mt-2.5 border-t border-purple-900/40 pt-2.5">
            Lee los 6 mensajes interactivos para desbloquear el trofeo especial del semestre.
          </p>
        </div>
      </div>

      {/* Floating Hover Indicator tooltip near bottom center */}
      {hoveredHeart && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-40 bg-[#140b35]/95 border-b-2 border-pink-500 backdrop-blur-lg rounded-2xl px-6 py-3 shadow-[0_10px_30px_rgba(236,72,153,0.15)] flex flex-col items-center gap-0.5 text-center transition-all duration-300 scale-105 pointer-events-none">
          <span className="font-display font-bold text-pink-400 text-sm tracking-widest uppercase flex items-center gap-1">
            <Sparkles size={13} fill="currentColor" className="text-pink-400" />
            {hoveredHeart.title}
          </span>
          <span className="text-purple-200 text-xs tracking-wide">
            {hoveredHeart.subtitle} — <em className="text-[10px] text-amber-200 italic font-mono uppercase">Haz clic para leer</em>
          </span>
        </div>
      )}

      {/* Unlock Trophy Button if all opened (Bottom right corner) */}
      {allOpened && (
        <div className="absolute bottom-6 right-6 z-30 pointer-events-auto flex flex-col items-center">
          <motion.button
            onClick={onUnlockFinal}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, y: [0, -4, 0] }}
            transition={{
              scale: { duration: 0.5 },
              opacity: { duration: 0.5 },
              y: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
            }}
            whileHover={{ scale: 1.08 }}
            className={`px-8 py-4 rounded-full font-display font-black text-xs md:text-sm tracking-widest shadow-[0_0_35px_rgba(234,179,8,0.7)] ${
              isFinalUnlocked 
                ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-[#13072e] border-2 border-yellow-300'
                : 'bg-[#18113e] border border-amber-500/40 text-amber-300 hover:border-amber-400'
            } cursor-pointer`}
          >
            <span className="flex items-center gap-2">
              🏆 RECLAMAR RECOMPENSA 🏆
            </span>
          </motion.button>
        </div>
      )}

      {/* Guide Help Overlay */}
      {showProgressHint && (
        <div className="absolute top-24 right-6 z-30 max-w-[210px] bg-slate-950/65 backdrop-blur-md p-3.5 rounded-2xl border border-blue-500/20 text-slate-300 text-[11px] leading-relaxed transition-opacity">
          <div className="flex justify-between items-center mb-1 font-bold text-blue-300 uppercase font-display text-[10px] tracking-wider">
            <span>💡 CONTROLES 3D</span>
            <button onClick={() => setShowProgressHint(false)} className="text-gray-400 hover:text-white pointer-events-auto px-1">✕</button>
          </div>
          • <strong>Arrastrar:</strong> Rotar galaxia<br/>
          • <strong>Rueda / Pellizcar:</strong> Zoom<br/>
          • <strong>Clic Corazón:</strong> Ver mensaje
        </div>
      )}
    </div>
  );
}
