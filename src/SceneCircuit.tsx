import React, { Suspense, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import useStore from './Store';

const Loading = () => {
  return <Box />;
};

const Circuit = (props) => {
  const fbx = useLoader<any, string>(GLTFLoader, './wileyknight_circuit.gltf');
  const fanL = useRef<THREE.geometry>();
  const fanR = useRef<THREE.geometry>();

  const yRef = useRef<number>(useStore.getState().scrollY);
  const yPrev = useRef<number>(1);
  let transitioning = useStore((state) => state.transitioning);

  useEffect(
    () =>
      useStore.subscribe(
        (scrollY: number, previousScroll: number) => {
          yRef.current = scrollY;
          yPrev.current = previousScroll;
        },
        (state) => state.scrollY,
      ),
    [],
  );

  const urls = ['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'];

  const textureCube = new THREE.CubeTextureLoader().load(urls);
  textureCube.mapping = THREE.CubeRefractionMapping;

  const liquidArray: object[] = [];
  const liquidRefs = [];

  for (let i: number = 1; i < 86; i++) {
    liquidArray.push(fbx.nodes[`bifrostLiquid1Mesh${i}PIV`].geometry);
    liquidRefs[i] = React.createRef();
  }

  useFrame(() => {
    if (
      fanL.current !== (undefined || null) &&
      fanR.current !== (undefined || null)
    ) {
      fanL.current.rotation.z -= 0.3;
      fanR.current.rotation.z += 0.3;
      if (!transitioning) {
        if (yRef.current > 0 && yRef.current < 85) {
          if (liquidRefs[yPrev.current] !== undefined) {
            liquidRefs[yPrev.current].current.position.z = 400;
          }
          liquidRefs[yRef.current].current.position.z = 0;
        }
      }
    }
  }, 1);

  return (
    <group {...props} dispose={null} position={[0, -160, 120]}>
      <mesh geometry={fbx.nodes.circuitsShape.geometry}>
        <meshStandardMaterial
          attach="material"
          color={0xdecb88}
          roughness={0.1}
          metalness={1}
        />
      </mesh>
      <mesh geometry={fbx.nodes.pcbPIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color={0x333435}
          roughness={0}
          metalness={0.8}
        />
      </mesh>
      <mesh
        geometry={fbx.nodes.heatShieldPIV.geometry}
        rotation-z={0}
        position={[-114, 140, 0]}
      >
        <meshStandardMaterial
          attach="material"
          color={0xcccccc}
          roughness={0}
          metalness={1}
        />
      </mesh>
      <mesh
        geometry={fbx.nodes.heatShieldPIV.geometry}
        position={[-114, 198, 0]}
        scale-y={-1}
      >
        <meshStandardMaterial
          attach="material"
          color={0xcccccc}
          roughness={0}
          metalness={1}
        />
      </mesh>
      <mesh
        geometry={fbx.nodes.heatShieldPIV.geometry}
        rotation-z={3.14}
        position={[114, 198, 0]}
      >
        <meshStandardMaterial
          attach="material"
          color={0xcccccc}
          roughness={0}
          metalness={1}
        />
      </mesh>
      <mesh
        geometry={fbx.nodes.heatShieldPIV.geometry}
        rotation-z={3.14}
        position={[114, 140, 0]}
        scale-y={-1}
      >
        <meshStandardMaterial
          attach="material"
          color={0xcccccc}
          roughness={0}
          metalness={1}
        />
      </mesh>
      <mesh geometry={fbx.nodes.wileyknightPIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color={0xdecb88}
          roughness={0.1}
          metalness={1}
        />
      </mesh>
      <mesh geometry={fbx.nodes.solderPIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color={0xcccccc}
          roughness={0.1}
          metalness={1}
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
          color={0x363531}
          roughness={0.3}
          metalness={0.9}
        />
      </mesh>
      <mesh geometry={fbx.nodes.cpubackplatePIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color={0x948a78}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      <mesh geometry={fbx.nodes.chipsPIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color={0x222222}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>
      <mesh geometry={fbx.nodes.capsPIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color={0x111111}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      <mesh geometry={fbx.nodes.glowsurfacePIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color={0xffff00}
          roughness={0.2}
          metalness={1}
          emissive={new THREE.Color(0xffff00)}
          emissiveIntensity={2}
        />
      </mesh>
      <mesh
        geometry={fbx.nodes.fan_low_shieldPIV.geometry}
        position={[-110, 169, 0]}
      >
        <meshStandardMaterial
          attach="material"
          color={0x363531}
          roughness={0.3}
          metalness={0.9}
        />
      </mesh>
      <mesh
        ref={fanL}
        geometry={fbx.nodes.fan_low_fanPIV.geometry}
        position={[-110, 169, 0]}
      >
        <meshStandardMaterial
          attach="material"
          color={0x1f2327}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      <mesh
        geometry={fbx.nodes.fan_low_shieldPIV.geometry}
        position={[110, 169, 0]}
        scale-x={-1}
      >
        <meshStandardMaterial
          attach="material"
          color={0x363531}
          roughness={0.3}
          metalness={0.9}
        />
      </mesh>
      <mesh
        ref={fanR}
        geometry={fbx.nodes.fan_low_fanPIV.geometry}
        position={[110, 169, 0]}
        scale-x={-1}
      >
        <meshStandardMaterial
          attach="material"
          color={0x1f2327}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      <mesh geometry={fbx.nodes.waterCouplesPIV.geometry}>
        <meshStandardMaterial
          attach="material"
          color={0xdecb88}
          roughness={0.1}
          metalness={1}
        />
      </mesh>
      {liquidArray.map((liquidMesh, index) => {
        return (
          <mesh
            ref={liquidRefs[index + 1]}
            geometry={liquidMesh}
            position-z={400}
            key={'liquid' + index}
          >
            <meshPhongMaterial
              color={0x007eff}
              emissive={new THREE.Color(0x002b58)}
              emissiveIntensity={1}
              refractionRatio={0.98}
              reflectivity={0.9}
              opacity={0.5}
              transparent={true}
              envMap={textureCube}
            />
          </mesh>
        );
      })}
    </group>
  );
};

//FRONT END DEVELOPER
//Powerful React driven interactions utilizing cutting-edge technologies.
function SceneCircuit() {
  return (
    <>
      <ambientLight intensity={7} />
      <pointLight position={[-10, 140, 0]} intensity={35} />
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

export default SceneCircuit;
