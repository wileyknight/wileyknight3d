import React, {
  useRef,
  useState,
  Suspense,
  useEffect,
  useCallback,
} from 'react';
import {
  Canvas,
  useFrame,
  useLoader,
  extend,
  useThree,
  ReactThreeFiber,
} from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
//import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './App.css';
import { useSpring, config } from '@react-spring/core';
import { a } from '@react-spring/three';
import { useGesture } from 'react-use-gesture';
import clamp from 'lodash/clamp';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: ReactThreeFiber.Object3DNode<
        OrbitControls,
        typeof OrbitControls
      >;
    }
  }
}

// Extend will make OrbitControls available as a JSX element called orbitControls for us to use.
extend({ OrbitControls });

function Camera(props) {
  const ref = useRef<any>();
  const { setDefaultCamera } = useThree();
  useEffect(() => void setDefaultCamera(ref.current), []);
  useFrame(() => {
    if (ref.current) {
      ref.current.updateMatrixWorld();
    }
  });
  return <a.perspectiveCamera ref={ref} {...props} />;
}

const CameraControls = () => {
  // Get a reference to the Three.js Camera, and the canvas html element.
  // We need these to setup the OrbitControls component.
  // https://threejs.org/docs/#examples/en/controls/OrbitControls
  const {
    camera,
    gl: { domElement },
  } = useThree();
  // Ref to the controls, so that we can update them on every frame using useFrame
  const controls = useRef<OrbitControls>();
  useFrame((state) => controls.current.update());
  return (
    <orbitControls
      ref={controls}
      args={[camera, domElement]}
      enableZoom={false}
      maxAzimuthAngle={Math.PI / 4}
      minAzimuthAngle={-Math.PI / 4}
      maxPolarAngle={Math.PI / 2}
      minPolarAngle={Math.PI / 2}
      enablePan={false}
      enableDamping={true}
    />
  );
};

const Loading = () => {
  return (
    <mesh visible position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <sphereGeometry attach="geometry" args={[1, 16, 16]} />
      <meshStandardMaterial
        attach="material"
        color="white"
        transparent
        opacity={0.6}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
};
/*
const FullScene = (props) => {
  const fbx = useLoader<any>(GLTFLoader, './circuit.gltf');
  console.log(fbx);
  return (
    <group {...props} dispose={null} position={[0, -150, 120]}>
      <mesh visible geometry={fbx.nodes.circuitShape.geometry}>
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
*/

const FullScene = (props) => {
  const fbx = useLoader<any>(GLTFLoader, './20years.gltf');
  console.log(fbx);
  return (
    <group {...props} dispose={null} position={[0, 0, 0]} rotateX={[90]}>
      <mesh visible geometry={fbx.nodes.YearsShape.geometry}>
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

function App() {
  const [scrollPos, setScrollPos] = useState<number>(0);
  const [y]: any = Scroll([-100, 100], { domTarget: window });

  useEffect(() => {
    window.addEventListener('keydown', function (t) {
      //if (!N.state.scrollBlocked) {
      //  var n = Math.max(40, (80 / 930) * N.state.viewport.height);
      //  38 === t.keyCode
      //    ? (e.velocity -= n)
      //    : 40 === t.keyCode && (e.velocity += n);
      //}
    });
    window.addEventListener(
      'resize',
      function () {},
      //this.resize.bind(this),
    );
  }, []);

  return (
    <div className="App">
      <Canvas
        style={{ background: '#324444' }}
        camera={{ position: [0, 0, 0] }}
      >
        <Camera position={[0, 0, 150]} />
        <CameraControls />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />

        <a.group position-y={y.to((y) => (-y / 500) * 25)}>
          <Box />
          <Box position={[0, 2, 0]} />
          <Suspense fallback={<Loading />}>
            <FullScene />
          </Suspense>
        </a.group>
      </Canvas>
    </div>
  );
}

export default App;

function Box(props) {
  return (
    <mesh {...props}>
      <boxBufferGeometry />
      <meshNormalMaterial />
    </mesh>
  );
}

function Scroll(bounds: number[], props: any) {
  const [{ y }, set] = useSpring<any>(() => ({ y: 0, config: config.slow }));
  const fn = useCallback(
    ({ xy: [, cy], previous: [, py], memo = y.get() }) => {
      const newY = clamp(memo + cy - py, bounds[0], bounds[1]);
      set({ y: newY });
      return newY;
    },
    [bounds, y, set],
  );
  const bind = useGesture({ onWheel: fn, onDrag: fn }, props);

  useEffect(() => {
    props && props.domTarget && bind();
  }, [props, bind]);
  return [y, bind];
}
