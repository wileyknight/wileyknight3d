import React, { Suspense } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function SceneQuantum() {
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
  const fbx = useLoader<any, string>(
    GLTFLoader,
    './quantumComputer_export.gltf',
  );

  return (
    <group
      {...props}
      dispose={null}
      position={[0, -40, 0]}
      rotateX={-90}
      scale={[5, 5, 5]}
    >
      <mesh geometry={fbx.nodes.blockCore.geometry}>
        <meshStandardMaterial
          attach="material"
          color={0xccccff}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      <mesh geometry={fbx.nodes.junctionBlock.geometry}>
        <meshStandardMaterial
          attach="material"
          color={0xccccff}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      <mesh geometry={fbx.nodes.headPIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color={0xccccff}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      <mesh geometry={fbx.nodes.secondPlatePIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color={0xccccff}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      <mesh geometry={fbx.nodes.mainBasePIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color={0xccccff}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      <mesh geometry={fbx.nodes.mainCylPIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color={0xccccff}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      <mesh geometry={fbx.nodes.topCylPIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color={0xccccff}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      <mesh geometry={fbx.nodes.mainPlatePIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color={0xccccff}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      <mesh geometry={fbx.nodes.mHelixPIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color={0xccccff}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      <mesh geometry={fbx.nodes.sHelixPIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color={0xccccff}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      <mesh geometry={fbx.nodes.boltsPIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color={0xccccff}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      <mesh geometry={fbx.nodes.mainRodsPIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color={0xccccff}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      <mesh geometry={fbx.nodes.structurePIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color={0xccccff}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      <mesh geometry={fbx.nodes.pipesBottomPIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color={0xccccff}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      <mesh geometry={fbx.nodes.structureSupportsPIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color={0xccccff}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      <mesh geometry={fbx.nodes.pipesPIV.geometry}>
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
      <sphereBufferGeometry args={[60, 60, 60]} />
      <meshNormalMaterial />
    </mesh>
  );
}

const Loading = () => {
  return <Box />;
};

export default SceneQuantum;
