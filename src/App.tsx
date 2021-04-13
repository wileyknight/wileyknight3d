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
} from '@react-three/fiber';
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
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';

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
      <mesh geometry={fbx.nodes.circuitShape.geometry}>
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
      <mesh geometry={fbx.nodes.blocka.geometry}>{<meshNormalMaterial />}</mesh>
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

function PlaneMask1() {
  const maskShape = useMemo(() => {
    const maskPts = [];
    maskPts.push(new THREE.Vector2(0, 0));
    maskPts.push(new THREE.Vector2(0, 320));
    maskPts.push(new THREE.Vector2(320, 420));
    maskPts.push(new THREE.Vector2(320, 100));
    maskPts.push(new THREE.Vector2(0, 0));
    return new THREE.Shape(maskPts);
  }, []);

  const [y]: any = Scroll([-window.innerHeight, window.innerHeight], {
    domTarget: window,
  });

  return (
    <a.group position-y={y.to((y) => (-y / (window.innerHeight / 1)) * 50)}>
      <mesh position={[-160, -210, 0]}>
        <shapeGeometry args={[maskShape]} />
        <meshBasicMaterial attach="material" color={'#FF0000'} />
      </mesh>
    </a.group>
  );
}

function PlaneMask2() {
  const maskShape = useMemo(() => {
    const maskPts = [];
    maskPts.push(new THREE.Vector2(0, 0));
    maskPts.push(new THREE.Vector2(0, 320));
    maskPts.push(new THREE.Vector2(320, 320));
    maskPts.push(new THREE.Vector2(320, 0));
    maskPts.push(new THREE.Vector2(240, -80));
    maskPts.push(new THREE.Vector2(0, 0));
    return new THREE.Shape(maskPts);
  }, []);

  const [y]: any = Scroll([-window.innerHeight, window.innerHeight], {
    domTarget: window,
  });

  return (
    <a.group position-y={y.to((y) => (-y / (window.innerHeight / 1)) * 500)}>
      <mesh position={[-160, 0, 0]}>
        <shapeGeometry args={[maskShape]} />
        <meshBasicMaterial attach="material" color={'#FF0000'} />
      </mesh>
    </a.group>
  );
}

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

function App() {
  const sceneCamera = useMemo(() => {
    return new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      10000,
    );
  }, []);
  const maskCamera = useMemo(() => {
    return new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      10000,
    );
  }, []);
  sceneCamera.position.set(0, 0, 200);
  maskCamera.position.set(0, 0, 200);
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
      <Plane sceneCamera={sceneCamera} maskCamera={maskCamera} />
    </Canvas>
  );
}

function Plane({ sceneCamera, maskCamera }) {
  const { gl, size } = useThree();

  const controls = useRef<OrbitControls>();

  const fgComposer = useRef<THREE.WebGL1Renderer>();
  const bgComposer = useRef<THREE.WebGL1Renderer>();
  const maskComposer = useRef<THREE.WebGL1Renderer>();

  const svgRef = useRef();

  const fgRenderTarget = useMemo(
    () =>
      new THREE.WebGLRenderTarget(size.width, size.height, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat,
        stencilBuffer: false,
      }),
    [size.width, size.height],
  );

  const bgRenderTarget = useMemo(
    () =>
      new THREE.WebGLRenderTarget(size.width, size.height, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat,
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

  const maskScene1 = useMemo(() => {
    const maskScene = new THREE.Scene();
    maskScene.background = new THREE.Color('green');
    return maskScene;
  }, []);

  const maskScene2 = useMemo(() => {
    const maskScene = new THREE.Scene();
    maskScene.background = new THREE.Color('green');
    return maskScene;
  }, []);

  useEffect(() => {
    fgComposer.current.setSize(size.width, size.height);
    bgComposer.current.setSize(size.width, size.height);
    maskComposer.current.setSize(size.width, size.height);
  }, [size]);

  useFrame((state) => {
    if (controls.current) {
      controls.current.update();
    }

    state.gl.autoClear = false;
    state.gl.clear();
    if (fgComposer.current) {
      fgComposer.current.render(fgScene, sceneCamera);
    }
    if (maskComposer.current) {
      maskComposer.current.render(maskScene1, maskCamera);
    }
    if (maskComposer.current) {
      maskComposer.current.render(maskScene2, maskCamera);
    }

    if (bgComposer.current) {
      bgComposer.current.render(bgScene, sceneCamera);
    }
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
      {createPortal(<Secondary />, bgScene)}
      {createPortal(<PlaneMask1 />, maskScene1)}
      {createPortal(<PlaneMask2 />, maskScene2)}

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
        <maskPass attachArray="passes" args={[maskScene1, maskCamera]} />
        <texturePass attachArray="passes" args={[bgRenderTarget.texture]} />
        <clearMaskPass attachArray="passes" />
        {/** FOREGROUND MASK */}
        <maskPass attachArray="passes" args={[maskScene2, maskCamera]} />
        {/** FOREGROUND */}
        <texturePass attachArray="passes" args={[fgRenderTarget.texture]} />
        <clearMaskPass attachArray="passes" />
        <shaderPass
          attachArray="passes"
          args={[FXAAShader]}
          uniforms-resolution-value={[1 / size.width, 1 / size.height]}
          renderToScreen
        />
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
