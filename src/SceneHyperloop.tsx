import React, { Suspense } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function SceneHyperloop() {
  return (
    <>
      <ambientLight />
      <Suspense fallback={<Loading />}>
        <FullScene />
      </Suspense>
    </>
  );
}

const FullScene = (props) => {
  const fbx = useLoader<any, string>(GLTFLoader, './hyperloop_train.gltf');
  return (
    <group
      {...props}
      dispose={null}
      position={[0, -20, 0]}
      rotation={[0, -1, 0]}
      scale={[12, 12, 12]}
    >
      <mesh geometry={fbx.nodes.tubePIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color={0xccccff}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      <mesh geometry={fbx.nodes.trainPIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color={0xccccff}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      <mesh geometry={fbx.nodes.ringsPIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color={0xccccff}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      <mesh geometry={fbx.nodes.carPIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color={0xccccff}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      <mesh geometry={fbx.nodes.pillarPIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color={0xccccff}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      <mesh geometry={fbx.nodes.lockPIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color={0xccccff}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      <mesh geometry={fbx.nodes.pipeglassPIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color={0xccccff}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      <mesh geometry={fbx.nodes.railPIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color={0xccccff}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
};

function Box(props) {
  return (
    <mesh>
      <boxBufferGeometry args={[60, 60, 60]} />
      <meshNormalMaterial />
    </mesh>
  );
}

const Loading = () => {
  return <Box />;
};

export default SceneHyperloop;
