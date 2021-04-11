import React, {
  useRef,
  Suspense,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  Canvas,
  useFrame,
  useLoader,
  createPortal,
  extend,
  useThree,
  ReactThreeFiber,
} from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './App.css';
import { useSpring, config } from '@react-spring/core';
import { a } from '@react-spring/three';
import { useGesture } from 'react-use-gesture';
import { Html } from '@react-three/drei';
import clamp from 'lodash/clamp';
import Fade from './Fade';
//import { lerp } from 'lerp';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { TexturePass } from 'three/examples/jsm/postprocessing/TexturePass';
import { ClearPass } from 'three/examples/jsm/postprocessing/ClearPass';
import {
  MaskPass,
  ClearMaskPass,
} from 'three/examples/jsm/postprocessing/MaskPass';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: ReactThreeFiber.Object3DNode<
        OrbitControls,
        typeof OrbitControls
      >;
      fade: ReactThreeFiber.Object3DNode<Fade, typeof Fade>;
      clearPass: ReactThreeFiber.Object3DNode<ClearPass, typeof ClearPass>;
      maskPass: ReactThreeFiber.Object3DNode<MaskPass, typeof MaskPass>;
      texturePass: ReactThreeFiber.Object3DNode<
        TexturePass,
        typeof TexturePass
      >;
      clearMaskPass: ReactThreeFiber.Object3DNode<
        ClearMaskPass,
        typeof ClearMaskPass
      >;
    }
  }
}

extend({
  OrbitControls,
  EffectComposer,
  ShaderPass,
  TexturePass,
  ClearPass,
  MaskPass,
  ClearMaskPass,
  CopyShader,
  RenderPass,
});

const Loading = () => {
  return <Box />;
};

const Circuit = (props) => {
  const fbx = useLoader<any, string>(GLTFLoader, './circuit.gltf');
  return (
    <group {...props} dispose={null} position={[0, -160, 120]}>
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
      <mesh visible geometry={fbx.nodes.blocka.geometry}>
        {<meshNormalMaterial />}
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

function PlainMask() {
  const maskPts = [];
  maskPts.push(new THREE.Vector2(0, 0));
  maskPts.push(new THREE.Vector2(0, 320));
  maskPts.push(new THREE.Vector2(320, 420));
  maskPts.push(new THREE.Vector2(320, 100));
  maskPts.push(new THREE.Vector2(0, 0));

  const maskShape: any = new THREE.Shape(maskPts);

  const [y]: any = Scroll([-window.innerHeight, window.innerHeight], {
    domTarget: window,
  });

  return (
    <a.group position-y={y.to((y) => (-y / (window.innerHeight / 1)) * 500)}>
      <mesh position-x={-160} position-y={-210}>
        <shapeBufferGeometry attach="geometry" args={maskShape} />
        <meshBasicMaterial attach="material" color={'#FF0000'} />
      </mesh>
    </a.group>
  );
}

function Hud() {
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

function App() {
  return (
    <Canvas
      style={{ background: '#324466' }}
      orthographic={true}
      camera={{ position: [0, 0, 500] }}
    >
      <directionalLight
        color={new THREE.Color().setHSL(1, 1, 1)}
        intensity={1}
        position={[0, 1, 1]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={1000}
        shadow-camera-left={-1000}
        shadow-camera-right={1000}
        shadow-camera-top={1000}
        shadow-camera-bottom={-1000}
      />

      <Plane />
    </Canvas>
  );
}

function Plane() {
  const { gl, size } = useThree();
  const sceneCamera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    10000,
  );
  const maskCamera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    10000,
  );
  const controls = useRef<OrbitControls>();

  const fgComposer = useRef<THREE.WebGL1Renderer>();
  const bgComposer = useRef<THREE.WebGL1Renderer>();
  const maskComposer = useRef<THREE.WebGL1Renderer>();

  const fgRenderTarget = useMemo(
    () =>
      new THREE.WebGLRenderTarget(size.width, size.height, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        stencilBuffer: false,
      }),
    [size.width, size.height],
  );

  const bgRenderTarget = useMemo(
    () =>
      new THREE.WebGLRenderTarget(size.width, size.height, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        stencilBuffer: false,
      }),
    [size.width, size.height],
  );

  const maskRenderTarget = useMemo(
    () =>
      new THREE.WebGLRenderTarget(size.width, size.height, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        stencilBuffer: true,
      }),
    [size.width, size.height],
  );

  const fgScene = useMemo(() => {
    const fgScene = new THREE.Scene();
    fgScene.background = new THREE.Color('orange');
    return fgScene;
  }, []);

  const bgScene = useMemo(() => {
    const bgScene = new THREE.Scene();
    bgScene.background = new THREE.Color('purple');
    return bgScene;
  }, []);

  const maskScene = useMemo(() => {
    const maskScene = new THREE.Scene();
    maskScene.background = new THREE.Color('green');
    return maskScene;
  }, []);

  sceneCamera.position.set(0, 0, 200);
  maskCamera.position.set(0, 0, 200);

  useEffect(() => {
    fgComposer.current.setSize(size.width, size.height);
    bgComposer.current.setSize(size.width, size.height);
    maskComposer.current.setSize(size.width, size.height);
  }, [size]);

  useFrame((state) => {
    controls.current.update();
    state.gl.autoClear = false;
    state.gl.clear();
    fgComposer.current.render(fgScene, sceneCamera);
    maskComposer.current.render(maskScene, maskCamera);
    bgComposer.current.render(bgScene, sceneCamera);
  });

  return (
    <>
      <orbitControls
        ref={controls}
        args={[sceneCamera, gl.domElement]}
        enableDamping={true}
        enableZoom={false}
        maxAzimuthAngle={Math.PI / 4}
        minAzimuthAngle={-Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
        enablePan={false}
      />

      {/** PORTALS */}
      {createPortal(<Main />, fgScene)}
      {createPortal(<Hud />, bgScene)}
      {createPortal(<PlainMask />, maskScene)}

      {/** FOREGROUND PORTAL EFFECTS */}
      <effectComposer
        ref={fgComposer}
        args={[gl, fgRenderTarget]}
        renderToScreen={false}
      >
        <renderPass attachArray="passes" args={[fgScene, sceneCamera]} />
        <shaderPass attachArray="passes" args={[CopyShader]} />
      </effectComposer>

      {/** BACKGROUND PORTAL EFFECTS */}
      <effectComposer
        ref={bgComposer}
        args={[gl, bgRenderTarget]}
        renderToScreen={false}
      >
        <renderPass attachArray="passes" args={[bgScene, sceneCamera]} />
        <shaderPass attachArray="passes" args={[CopyShader]} />
      </effectComposer>

      {/** COMPOSIT THE SCENE */}
      <effectComposer ref={maskComposer} args={[gl, maskRenderTarget]}>
        <clearPass attachArray="passes" />
        {/** BACKGROUND */}
        <texturePass attachArray="passes" args={[bgRenderTarget.texture]} />
        {/** FOREGROUND MASK */}
        <maskPass attachArray="passes" args={[maskScene, maskCamera]} />
        {/** FOREGROUND */}
        <texturePass attachArray="passes" args={[fgRenderTarget.texture]} />
        <clearMaskPass attachArray="passes" />
        <shaderPass attachArray="passes" args={[CopyShader]} renderToScreen />
      </effectComposer>
    </>
  );
}

export default App;

function Box(props) {
  const [y]: any = Scroll([-1500, 1500], {
    domTarget: window,
  });
  return (
    <a.mesh position-y={y.to((y) => (-y / (window.innerHeight / 2)) * 50)}>
      <boxBufferGeometry args={[60, 60, 60]} />
      <meshNormalMaterial />
    </a.mesh>
  );
}

function Scroll(bounds: number[], props: any) {
  const [{ y }, set] = useSpring<any>(() => ({ y: 0, config: config.slow }));
  const fn = useCallback(
    ({ xy: [, cy], previous: [, py], memo = y.get() }) => {
      console.log(memo, cy, py);
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
