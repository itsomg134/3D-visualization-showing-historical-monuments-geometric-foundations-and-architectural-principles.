import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

const MonumentGeometry3D = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const monumentRef = useRef(null);
  const [selectedMonument, setSelectedMonument] = useState('pyramid');
  const [showGrid, setShowGrid] = useState(true);
  const [rotation, setRotation] = useState(0);
  const animationRef = useRef(null);

  const monuments = {
    pyramid: {
      name: 'Egyptian Pyramid (Giza)',
      geometry: 'Tetrahedron',
      description: 'Perfect square base with triangular faces meeting at apex. Golden ratio proportions.',
      facts: 'Base: 230m, Height: 146m, Slope: 51.8°'
    },
    pantheon: {
      name: 'Roman Pantheon Dome',
      geometry: 'Hemisphere',
      description: 'Perfect sphere geometry. Diameter equals height from floor to oculus.',
      facts: 'Diameter: 43.3m, largest unreinforced concrete dome for 1300+ years'
    },
    gothic: {
      name: 'Gothic Cathedral',
      geometry: 'Pointed Arches & Ribbed Vaults',
      description: 'Vertical emphasis using pointed arches, flying buttresses, ribbed vaulting.',
      facts: 'Height optimization through geometric load distribution'
    },
    taj: {
      name: 'Taj Mahal',
      geometry: 'Octagonal Base & Dome',
      description: 'Perfect bilateral symmetry. Central dome surrounded by four minarets.',
      facts: 'Main dome: 35m diameter, Height: 73m, octagonal chamfered corners'
    },
    colosseum: {
      name: 'Roman Colosseum',
      geometry: 'Elliptical Amphitheater',
      description: 'Oval design for optimal viewing. Arched construction for structural stability.',
      facts: 'Major axis: 189m, Minor axis: 156m, 80 arched entrances'
    }
  };

  const createPyramid = () => {
    const group = new THREE.Group();
    
    const pyramidGeom = new THREE.ConeGeometry(2, 3, 4);
    const material = new THREE.MeshPhongMaterial({
      color: 0xD4AF37,
      flatShading: true,
      transparent: true,
      opacity: 0.9
    });
    const pyramid = new THREE.Mesh(pyramidGeom, material);
    pyramid.rotation.y = Math.PI / 4;
    pyramid.position.y = 1.5;
    
    const edges = new THREE.EdgesGeometry(pyramidGeom);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
    const wireframe = new THREE.LineSegments(edges, lineMat);
    wireframe.rotation.y = Math.PI / 4;
    wireframe.position.y = 1.5;
    
    group.add(pyramid);
    group.add(wireframe);
    
    return group;
  };

  const createPantheon = () => {
    const group = new THREE.Group();
    
    const sphereGeom = new THREE.SphereGeometry(1.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const material = new THREE.MeshPhongMaterial({
      color: 0xA0826D,
      transparent: true,
      opacity: 0.9
    });
    const dome = new THREE.Mesh(sphereGeom, material);
    dome.position.y = 1.5;
    
    const edges = new THREE.EdgesGeometry(sphereGeom);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x000000 });
    const wireframe = new THREE.LineSegments(edges, lineMat);
    wireframe.position.y = 1.5;
    
    const cylinderGeom = new THREE.CylinderGeometry(1.5, 1.5, 0.3, 32);
    const cylinder = new THREE.Mesh(cylinderGeom, material);
    cylinder.position.y = 1.35;
    
    const oculusGeom = new THREE.CircleGeometry(0.3, 32);
    const oculusMat = new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.DoubleSide });
    const oculus = new THREE.Mesh(oculusGeom, oculusMat);
    oculus.rotation.x = -Math.PI / 2;
    oculus.position.y = 3;
    
    group.add(dome);
    group.add(wireframe);
    group.add(cylinder);
    group.add(oculus);
    
    return group;
  };

  const createGothic = () => {
    const group = new THREE.Group();
    
    const baseGeom = new THREE.BoxGeometry(2.5, 3, 1.5);
    const material = new THREE.MeshPhongMaterial({
      color: 0x8B7355,
      transparent: true,
      opacity: 0.9
    });
    const base = new THREE.Mesh(baseGeom, material);
    base.position.y = 1.5;
    
    const spireGeom = new THREE.ConeGeometry(0.5, 2, 4);
    const spire = new THREE.Mesh(spireGeom, material);
    spire.position.y = 4;
    
    const pointedArch1 = new THREE.Group();
    const arch1 = new THREE.TorusGeometry(0.4, 0.1, 16, 32, Math.PI);
    const archMesh1 = new THREE.Mesh(arch1, material);
    archMesh1.rotation.x = Math.PI / 2;
    archMesh1.position.set(-0.6, 0.8, 0.76);
    
    const arch2 = arch1.clone();
    const archMesh2 = new THREE.Mesh(arch2, material);
    archMesh2.rotation.x = Math.PI / 2;
    archMesh2.position.set(0.6, 0.8, 0.76);
    
    const edges = new THREE.EdgesGeometry(baseGeom);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x000000 });
    const wireframe = new THREE.LineSegments(edges, lineMat);
    wireframe.position.y = 1.5;
    
    group.add(base);
    group.add(spire);
    group.add(archMesh1);
    group.add(archMesh2);
    group.add(wireframe);
    
    return group;
  };

  const createTaj = () => {
    const group = new THREE.Group();
    
    const baseGeom = new THREE.CylinderGeometry(2, 2, 0.5, 8);
    const material = new THREE.MeshPhongMaterial({
      color: 0xFFFFF0,
      transparent: true,
      opacity: 0.95
    });
    const base = new THREE.Mesh(baseGeom, material);
    base.position.y = 0.25;
    
    const mainGeom = new THREE.CylinderGeometry(1.5, 1.5, 2, 8);
    const main = new THREE.Mesh(mainGeom, material);
    main.position.y = 1.5;
    
    const domeGeom = new THREE.SphereGeometry(1.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeom, material);
    dome.position.y = 2.7;
    
    const spireGeom = new THREE.ConeGeometry(0.2, 0.8, 8);
    const spire = new THREE.Mesh(spireGeom, material);
    spire.position.y = 3.9;
    
    const minaretGeom = new THREE.CylinderGeometry(0.15, 0.15, 3, 8);
    for (let i = 0; i < 4; i++) {
      const minaret = new THREE.Mesh(minaretGeom, material);
      const angle = (i * Math.PI) / 2;
      minaret.position.set(Math.cos(angle) * 2.5, 1.5, Math.sin(angle) * 2.5);
      
      const minaretTop = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), material);
      minaretTop.position.set(Math.cos(angle) * 2.5, 3.2, Math.sin(angle) * 2.5);
      
      group.add(minaret);
      group.add(minaretTop);
    }
    
    const edges = new THREE.EdgesGeometry(mainGeom);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x888888 });
    const wireframe = new THREE.LineSegments(edges, lineMat);
    wireframe.position.y = 1.5;
    
    group.add(base);
    group.add(main);
    group.add(dome);
    group.add(spire);
    group.add(wireframe);
    
    return group;
  };

  const createColosseum = () => {
    const group = new THREE.Group();
    
    const curve = new THREE.EllipseCurve(0, 0, 2, 1.5, 0, 2 * Math.PI, false, 0);
    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    
    const material = new THREE.MeshPhongMaterial({
      color: 0xC19A6B,
      transparent: true,
      opacity: 0.9
    });
    
    for (let level = 0; level < 3; level++) {
      const shape = new THREE.Shape();
      const ellipsePoints = curve.getPoints(50);
      shape.setFromPoints(ellipsePoints);
      
      const extrudeSettings = {
        depth: 0.4,
        bevelEnabled: false
      };
      
      const wallGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      const wall = new THREE.Mesh(wallGeom, material);
      wall.position.y = level * 0.8;
      wall.rotation.x = Math.PI / 2;
      
      const innerShape = new THREE.Shape();
      const innerCurve = new THREE.EllipseCurve(0, 0, 1.7, 1.2, 0, 2 * Math.PI, false, 0);
      const innerPoints = innerCurve.getPoints(50);
      innerShape.setFromPoints(innerPoints);
      shape.holes.push(innerShape);
      
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI * 2) / 12;
        const x = Math.cos(angle) * 1.85;
        const z = Math.sin(angle) * 1.35;
        
        const archGeom = new THREE.BoxGeometry(0.15, 0.6, 0.15);
        const arch = new THREE.Mesh(archGeom, material);
        arch.position.set(x, level * 0.8 + 0.5, z);
        group.add(arch);
      }
    }
    
    const baseGeom = new THREE.CylinderGeometry(2, 2, 0.2, 32);
    const base = new THREE.Mesh(baseGeom, material);
    base.scale.set(1, 1, 0.75);
    base.position.y = 0;
    
    group.add(base);
    
    return group;
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 4, 8);
    camera.lookAt(0, 2, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      antialias: true 
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    const gridHelper = new THREE.GridHelper(10, 10, 0x888888, 0xcccccc);
    gridHelper.visible = showGrid;
    scene.add(gridHelper);

    const animate = () => {
      if (monumentRef.current) {
        monumentRef.current.rotation.y = rotation;
      }
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!canvasRef.current) return;
      camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;

    if (monumentRef.current) {
      sceneRef.current.remove(monumentRef.current);
    }

    let newMonument;
    switch (selectedMonument) {
      case 'pyramid':
        newMonument = createPyramid();
        break;
      case 'pantheon':
        newMonument = createPantheon();
        break;
      case 'gothic':
        newMonument = createGothic();
        break;
      case 'taj':
        newMonument = createTaj();
        break;
      case 'colosseum':
        newMonument = createColosseum();
        break;
      default:
        newMonument = createPyramid();
    }

    monumentRef.current = newMonument;
    sceneRef.current.add(newMonument);
  }, [selectedMonument]);

  useEffect(() => {
    if (sceneRef.current) {
      const grid = sceneRef.current.children.find(child => child.type === 'GridHelper');
      if (grid) grid.visible = showGrid;
    }
  }, [showGrid]);

  const currentMonument = monuments[selectedMonument];

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col">
      <div className="bg-gradient-to-r from-amber-700 to-amber-900 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Historical Monuments: 3D Geometric Analysis</h1>
        <p className="text-amber-100">Explore the mathematical foundations of iconic architecture</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative">
          <canvas 
            ref={canvasRef} 
            className="w-full h-full"
            style={{ display: 'block' }}
          />
          
          <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-md">
            <h3 className="font-bold text-lg text-amber-900 mb-2">{currentMonument.name}</h3>
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-semibold">Geometry:</span> {currentMonument.geometry}
            </p>
            <p className="text-sm text-gray-600 mb-2">{currentMonument.description}</p>
            <p className="text-xs text-gray-500 italic">{currentMonument.facts}</p>
          </div>
        </div>

        <div className="w-80 bg-white shadow-lg p-6 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Monument Selection</h2>
          
          <div className="space-y-2 mb-6">
            {Object.entries(monuments).map(([key, monument]) => (
              <button
                key={key}
                onClick={() => setSelectedMonument(key)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  selectedMonument === key
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-amber-100'
                }`}
              >
                <div className="font-semibold">{monument.name}</div>
                <div className="text-xs opacity-80">{monument.geometry}</div>
              </button>
            ))}
          </div>

          <div className="border-t pt-4">
            <h3 className="font-bold mb-3 text-gray-800">Controls</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Rotation: {Math.round((rotation * 180) / Math.PI)}°
              </label>
              <input
                type="range"
                min="0"
                max={Math.PI * 2}
                step="0.1"
                value={rotation}
                onChange={(e) => setRotation(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="grid"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="grid" className="text-sm text-gray-700">Show Grid</label>
            </div>
          </div>

          <div className="mt-6 p-4 bg-amber-50 rounded-lg text-sm text-gray-700">
            <p className="font-semibold mb-2">Key Geometric Principles:</p>
            <ul className="space-y-1 text-xs">
              <li>• Symmetry and proportion</li>
              <li>• Load distribution through geometry</li>
              <li>• Sacred geometry ratios</li>
              <li>• Structural optimization</li>
              <li>• Aesthetic harmony through math</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonumentGeometry3D;