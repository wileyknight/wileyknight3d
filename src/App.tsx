import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Canvas,
  useFrame,
  createPortal,
  extend,
  useThree,
  ReactThreeFiber,
} from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './App.css';
import { useSpring, a, config } from 'react-spring/three';
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
import create from 'zustand';

import Main from './Main';
import Secondary from './Secondary';

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

type State = {
  scrollY: number;
  scene: number;
  transition: boolean;
  yUp: (by: number) => void;
  yDown: (by: number) => void;
};

const useStore = create<State>((set) => ({
  scrollY: 0,
  scene: 0,
  transition: false,
  yUp: (springPos: number) => set((state) => ({ scrollY: springPos })),
  yDown: () => set((state) => ({ scrollY: state.scrollY - 1 })),
  resetY: () => set({ scrollY: 0 }),
}));

//const unsub1 = useStore.subscribe(console.log);

type V3 = [number, number, number];

function PlaneMask1() {
  const divX = window.innerWidth / 10;
  const divY = window.innerHeight / 10;
  const maskShape = useMemo(() => {
    const maskPts = [];
    maskPts.push(new THREE.Vector2(0, 0));
    maskPts.push(new THREE.Vector2(0, divY));
    maskPts.push(new THREE.Vector2(divX, divY / 4 + divY));
    maskPts.push(new THREE.Vector2(divX, 0));
    maskPts.push(new THREE.Vector2(0, -divY / 4));
    maskPts.push(new THREE.Vector2(0, 0));
    return new THREE.Shape(maskPts);
  }, [divX, divY]);

  return (
    <a.group>
      <mesh position={[-(divX / 2), -(divY / 2), 0]}>
        <shapeGeometry args={[maskShape]} />
        <meshBasicMaterial attach="material" color={'#FF0000'} />
      </mesh>
    </a.group>
  );
}

function PlaneMask2() {
  const { size, viewport } = useThree();
  const { width, height, factor } = viewport;
  const aspect = size.width / viewport.width;
  const divX = window.innerWidth / 10;
  const divY = window.innerHeight / 10;

  const [spring, setSpring] = useSpring(() => ({
    position: [0, 0, 0] as V3,
    config: {
      mass: 1,
      friction: 10,
      tension: 100,
    },
  }));

  const yRef = useRef<number>(useStore.getState().scrollY);

  useEffect(
    () =>
      useStore.subscribe(
        (scrollY: number) => (yRef.current = scrollY),
        (state) => state.scrollY,
      ),
    [],
  );

  const bind = useGesture(
    {
      onDrag: ({ offset: [x, y] }) => {
        const yPos = -(y / aspect) * 5;
        console.log(yPos, y);
        if (yPos > -divY) {
          setSpring({
            position: [0, -(y / aspect) * 5, 0],
          });
        } else if (yPos < -divY) {
          useStore.setState({ scene: 1 });
          setSpring({
            position: [0, 0, 0],
          });
        }

        useStore.setState({ scrollY: -(y / aspect) * 5 });
      },
      onWheel: ({ offset: [x, y] }) => {
        setSpring({
          position: [0, -(y / aspect) * 2, 0],
        });
      },
    },
    {
      domTarget: window,
    },
  );

  console.log(divX, divY);
  const maskShape = useMemo(() => {
    const maskPts = [];
    maskPts.push(new THREE.Vector2(0, 0));
    maskPts.push(new THREE.Vector2(0, divY));
    maskPts.push(new THREE.Vector2(divX, divY));
    maskPts.push(new THREE.Vector2(divX, 0));
    maskPts.push(new THREE.Vector2((divX / 4) * 3, -(divY / 4)));
    maskPts.push(new THREE.Vector2(0, 0));
    return new THREE.Shape(maskPts);
  }, [divX, divY]);

  return (
    <a.group {...spring}>
      <mesh position={[-(divX / 2), divY / 2, 0]}>
        <shapeGeometry args={[maskShape]} />
        <meshBasicMaterial attach="material" color={'#FF0000'} />
      </mesh>
    </a.group>
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
  maskCamera.position.set(
    0,
    0,
    window.innerWidth / ((window.innerWidth / window.innerHeight) * 10 - 1),
  );
  return (
    <Canvas
      style={{ background: '#324466' }}
      orthographic={true}
      camera={{ position: [0, 0, 500] }}
      shadows
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

  const bgMask = useMemo(() => {
    const maskScene = new THREE.Scene();
    return maskScene;
  }, []);

  const fgMask = useMemo(() => {
    const maskScene = new THREE.Scene();
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
      maskComposer.current.render(bgMask, maskCamera);
    }
    if (maskComposer.current) {
      maskComposer.current.render(fgMask, maskCamera);
    }
    if (bgComposer.current) {
      bgComposer.current.render(bgScene, sceneCamera);
    }
  });

  const sceneSelectors = [
    {
      environment: <Main />,
      scene: fgScene,
      mask: <PlaneMask1 />,
      mScene: bgMask,
    },
    {
      environment: <Secondary />,
      scene: bgScene,
      mask: <PlaneMask2 />,
      mScene: fgMask,
    },
  ];

  let currectScene = useStore.getState().scene;
  let nextScene = 0;

  if (currectScene + 1 < sceneSelectors.length) {
    nextScene = currectScene + 1;
  } else {
    nextScene = 0;
    currectScene = 1;
  }

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
      {createPortal(sceneSelectors[nextScene].mask, fgMask)}
      {createPortal(sceneSelectors[nextScene].environment, fgScene)}
      {createPortal(sceneSelectors[currectScene].mask, bgMask)}
      {createPortal(sceneSelectors[currectScene].environment, bgScene)}

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
        <maskPass attachArray="passes" args={[bgMask, maskCamera]} />
        <texturePass attachArray="passes" args={[bgRenderTarget.texture]} />
        <clearMaskPass attachArray="passes" />
        {/** FOREGROUND */}
        <maskPass attachArray="passes" args={[fgMask, maskCamera]} />
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
