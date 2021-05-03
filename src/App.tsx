import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import './App.css';

import Compositor from './Compositor';

function App() {
  const sceneCamera = useMemo(() => {
    return new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      10000,
    );
  }, []);
  const maskCamera = useMemo(() => {
    return new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      10000,
    );
  }, []);
  sceneCamera.position.set(0, 0, 200);
  maskCamera.position.set(
    0,
    0,
    window.innerWidth / ((window.innerWidth / window.innerHeight) * 10 - 1),
  );
  return (
    <Canvas
      style={{ background: '#324466' }}
      orthographic={true}
      camera={{ position: [0, 0, 500] }}
      shadows
    >
      <directionalLight
        color={new THREE.Color().setHSL(1, 1, 1)}
        intensity={2}
        position={[0, 1, 1]}
      />
      <ambientLight intensity={10} />
      <Compositor sceneCamera={sceneCamera} maskCamera={maskCamera} />
    </Canvas>
  );
}

export default App;
