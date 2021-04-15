import React, { Suspense } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function Secondary() {
  return (
    <>
      <ambientLight />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
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
      position={[0, 0, 0]}
      rotateX={[0]}
      scale={[12, 12, 12]}
    >
      <mesh geometry={fbx.nodes.blocka.geometry}>{<meshNormalMaterial />}</mesh>
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

export default Secondary;
