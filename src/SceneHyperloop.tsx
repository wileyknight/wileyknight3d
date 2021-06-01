import React, { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { useLoader, useFrame } from '@react-three/fiber';
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
  const fbx = useLoader<GLTFLoader, string>(
    GLTFLoader,
    './hyperloop_train_export.gltf',
  );
  console.log(fbx);
  const tubes = new Array(36);
  tubes.fill(0);
  const pedestals = new Array(12);
  pedestals.fill(0);

  let setRotation = 0;
  let pedestalRotation = 0;
  const rotationLimit = 0.17455;

  const trainRef = useRef();

  useFrame(() => {
    if (trainRef.current !== (undefined || null)) {
      trainRef.current.rotation.y += 0.01;
    }
  }, 1);

  return (
    <group
      {...props}
      dispose={null}
      position={[-600, -60, -800]}
      rotation={[0, -1, 0]}
      scale={[12, 12, 12]}
    >
      <group rotation-y={3.24}>
        <mesh
          geometry={fbx.nodes.trainPIV.geometry}
          material={fbx.materials.trainColor}
        />
        <mesh
          geometry={fbx.nodes.carPIV.geometry}
          material={fbx.materials.trainColor}
        />
        <mesh
          rotation-y={0.104}
          geometry={fbx.nodes.carPIV.geometry}
          material={fbx.materials.trainColor}
        />
        <mesh
          rotation-y={0.208}
          geometry={fbx.nodes.carPIV.geometry}
          material={fbx.materials.trainColor}
        />
        <mesh
          rotation-y={0.312}
          geometry={fbx.nodes.carPIV.geometry}
          material={fbx.materials.trainColor}
        />
        <mesh
          rotation-y={0.416}
          geometry={fbx.nodes.carPIV.geometry}
          material={fbx.materials.trainColor}
        />
      </group>
      <group ref={trainRef}>
        {tubes.map((value, index) => {
          setRotation += rotationLimit;
          return (
            <>
              <mesh
                geometry={fbx.nodes.tubePIV.geometry}
                rotation-y={setRotation}
                key={`t${index}`}
              >
                <meshStandardMaterial
                  attach="material"
                  color={0xccccff}
                  roughness={0.8}
                  metalness={0.2}
                />
              </mesh>
              <mesh
                geometry={fbx.nodes.railPIV.geometry}
                rotation-y={setRotation}
                key={`r${index}`}
              >
                <meshStandardMaterial
                  attach="material"
                  color={0x363531}
                  roughness={0.3}
                  metalness={0.9}
                />
              </mesh>
              <mesh
                geometry={fbx.nodes.glassPIV.geometry}
                material={fbx.materials.glassColor}
                rotation-y={setRotation}
                key={`g${index}`}
              />
            </>
          );
        })}
        {pedestals.map((value, index) => {
          pedestalRotation += rotationLimit * 4;
          return (
            <>
              <mesh
                geometry={fbx.nodes.lockRingsPIV.geometry}
                rotation-y={pedestalRotation}
                key={`g${index}`}
              >
                <meshStandardMaterial
                  attach="material"
                  color={0xdecb88}
                  roughness={0.1}
                  metalness={1}
                />
              </mesh>
              <mesh
                geometry={fbx.nodes.pedestalPIV.geometry}
                rotation-y={pedestalRotation}
                key={`g${index}`}
              >
                <meshStandardMaterial
                  attach="material"
                  color={0xccccff}
                  roughness={0.8}
                  metalness={0.2}
                />
              </mesh>
              <mesh
                geometry={fbx.nodes.couplingPIV.geometry}
                rotation-y={pedestalRotation}
                key={`g${index}`}
              >
                <meshStandardMaterial
                  attach="material"
                  color={0xccccff}
                  roughness={0.8}
                  metalness={0.2}
                />
              </mesh>
            </>
          );
        })}
      </group>
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
