import React from 'react';
import { Canvas } from '@react-three/fiber';
import './App.css';

import Compositor from './Compositor';

function App() {
  return (
    <Canvas
      style={{ background: '#324466' }}
      dpr={1}
      orthographic={true}
      camera={{
        position: [
          0,
          0,
          window.innerWidth /
            ((window.innerWidth / window.innerHeight) * 10 - 1),
        ],
      }}
      shadows
    >
      <Compositor />
    </Canvas>
  );
}

export default App;
