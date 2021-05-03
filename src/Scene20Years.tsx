import React, { Suspense } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function Scene20Years() {
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
  const fbx = useLoader<any, string>(GLTFLoader, './20fill.gltf');
  return (
    <group
      {...props}
      dispose={null}
      position={[0, 0, -75]}
      rotateX={-90}
      scale={[18, 18, 18]}
    >
      <mesh geometry={fbx.nodes.blocka.geometry} rotation-z={0.2}>
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

export default Scene20Years;
