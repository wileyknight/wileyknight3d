import React, { Suspense } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import './App.css';

const Loading = () => {
  return <Box />;
};

const Circuit = (props) => {
  const fbx = useLoader<any, string>(GLTFLoader, './wileyknight_circuit.gltf');
  return (
    <group {...props} dispose={null} position={[0, -160, 120]}>
      <mesh geometry={fbx.nodes.circuitsShape.geometry}>
        <meshStandardMaterial
          attach="material"
          color="yellow"
          roughness={0.2}
          metalness={1}
        />
      </mesh>
      <mesh geometry={fbx.nodes.pcbPIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color="white"
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      <mesh geometry={fbx.nodes.heatShieldPIV.geometry} rotation-z={360}>
        <meshStandardMaterial
          attach="material"
          color="white"
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      <mesh geometry={fbx.nodes.wileyknightPIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color="white"
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      <mesh geometry={fbx.nodes.solderPIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color={0x333333}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      <mesh geometry={fbx.nodes.textPIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color="white"
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      <mesh geometry={fbx.nodes.pcie_slotPIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color="white"
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      <mesh geometry={fbx.nodes.cpubackplatePIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color="white"
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      <mesh geometry={fbx.nodes.chipsPIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color={0x777777}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>
      <mesh geometry={fbx.nodes.capsPIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color={0x333333}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      <mesh geometry={fbx.nodes.bifrostLiquid1Mesh24.geometry}>
        <meshStandardMaterial
          attach="material"
          color="white"
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      <mesh geometry={fbx.nodes.glowsurfacePIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color="white"
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
    </group>
  );
};

function Main() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Suspense fallback={<Loading />}>
        <Circuit />
      </Suspense>
    </>
  );
}

function Box(props) {
  return (
    <mesh>
      <boxBufferGeometry args={[60, 60, 60]} />
      <meshNormalMaterial />
    </mesh>
  );
}

export default Main;
