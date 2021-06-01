import React, { useRef, useEffect, useMemo } from 'react';
import {
  useFrame,
  createPortal,
  extend,
  useThree,
  ReactThreeFiber,
} from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './App.css';
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
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import useStore from './Store';
import SceneCircuit from './SceneCircuit';
import Scene20Years from './Scene20Years';
import SceneHyperloop from './SceneHyperloop';
import SceneQuantum from './SceneQuantum';
import { MaskPlane } from './Masks';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: ReactThreeFiber.Object3DNode<
        OrbitControls,
        typeof OrbitControls
      >;
      effectComposer: ReactThreeFiber.Object3DNode<
        EffectComposer,
        typeof EffectComposer
      >;
      shaderPass: ReactThreeFiber.Object3DNode<ShaderPass, typeof ShaderPass>;
      renderPass: ReactThreeFiber.Object3DNode<RenderPass, typeof RenderPass>;
      bokehPass: ReactThreeFiber.Object3DNode<BokehPass, typeof BokehPass>;
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
  BokehPass,
  ClearPass,
  MaskPass,
  ClearMaskPass,
  CopyShader,
  RenderPass,
});

function Compositor() {
  const { gl, size, camera } = useThree();

  const circuitCamera = useMemo(() => {
    return new THREE.PerspectiveCamera(45, size.width / size.height, 1, 10000);
  }, [size.width, size.height]);
  circuitCamera.position.set(0, 0, 200);

  const yearCamera = useMemo(() => {
    return new THREE.PerspectiveCamera(45, size.width / size.height, 1, 10000);
  }, [size.width, size.height]);
  yearCamera.position.set(0, 0, 200);

  const quantumCamera = useMemo(() => {
    return new THREE.PerspectiveCamera(45, size.width / size.height, 1, 10000);
  }, [size.width, size.height]);
  quantumCamera.position.set(0, 0, 75);

  const hyperCamera = useMemo(() => {
    return new THREE.PerspectiveCamera(45, size.width / size.height, 1, 10000);
  }, [size.width, size.height]);
  hyperCamera.position.set(0, 0, 200);

  const controls = useRef<OrbitControls>();
  //const controls2 = useRef<OrbitControls>();

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

  const fgMask = useMemo(() => {
    const maskScene = new THREE.Scene();
    return maskScene;
  }, []);

  const fgScene = useMemo(() => {
    const fgScene = new THREE.Scene();
    return fgScene;
  }, []);

  const bgScene = useMemo(() => {
    const bgScene = new THREE.Scene();
    return bgScene;
  }, []);

  useEffect(() => {
    fgComposer.current.setSize(size.width, size.height);
    bgComposer.current.setSize(size.width, size.height);
    maskComposer.current.setSize(size.width, size.height);
  }, [size]);

  const sceneSelectors = useMemo(() => {
    bgScene.background = new THREE.Color(0xbabed8);
    fgScene.background = new THREE.Color(0x000d2c);

    const near = 100;
    const far = 1000;
    const color = 0x000d2c;
    fgScene.fog = new THREE.Fog(color, near, far);

    const pmremGenerator = new THREE.PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();

    new RGBELoader()
      .setDataType(THREE.UnsignedByteType)
      //.setPath('textures/equirectangular/')
      .load('skySphere.hdr', function (hdrEquirect) {
        const hdrCubeRenderTarget = pmremGenerator.fromEquirectangular(
          hdrEquirect,
        );
        hdrEquirect.dispose();

        bgScene.environment = hdrCubeRenderTarget.texture;
        fgScene.environment = hdrCubeRenderTarget.texture;
      });

    return [
      {
        environment: <SceneCircuit />,
        mask: <MaskPlane />,
        camera: circuitCamera,
      },
      {
        environment: <Scene20Years />,
        mask: <MaskPlane />,
        camera: yearCamera,
      },
      {
        environment: <SceneQuantum />,
        mask: <MaskPlane />,
        camera: quantumCamera,
      },
      {
        environment: <SceneHyperloop />,
        mask: <MaskPlane />,
        camera: hyperCamera,
      },
    ];
  }, [
    fgScene,
    circuitCamera,
    bgScene,
    yearCamera,
    quantumCamera,
    hyperCamera,
    gl,
  ]);

  let transitioning = useStore((state) => state.transitioning);
  let currentScene = useStore((state) => state.currentScene);
  let nextScene = useStore((state) => state.nextScene);

  useFrame((state) => {
    if (controls.current) {
      controls.current.update();
    }

    state.gl.autoClear = false;
    state.gl.clear();

    if (bgComposer.current) {
      bgComposer.current.render(fgScene, sceneSelectors[currentScene].camera);
    }
    if (fgComposer.current) {
      if (transitioning) {
        fgComposer.current.render(bgScene, sceneSelectors[nextScene].camera);
      }
    }
    if (maskComposer.current) {
      maskComposer.current.render(fgMask, camera);
    }
  }, 2);

  //const params = useMemo(
  //  () => ({ focus: 50, aperture: 0.005, maxblur: 0.018 }),
  //  [],
  //);

  return (
    <>
      <orbitControls
        ref={controls}
        args={[sceneSelectors[currentScene].camera, gl.domElement]}
        enableDamping={true}
        enableZoom={false}
        maxAzimuthAngle={Math.PI / 4}
        minAzimuthAngle={-Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
        enablePan={false}
      />

      {/** PORTALS */}
      {createPortal(<MaskPlane />, fgMask)}
      {createPortal(sceneSelectors[nextScene].environment, bgScene)}
      {createPortal(sceneSelectors[currentScene].environment, fgScene)}

      {/** FOREGROUND PORTAL EFFECTS */}
      <effectComposer
        ref={fgComposer}
        args={[gl, fgRenderTarget]}
        renderToScreen={false}
      >
        <renderPass
          attachArray="passes"
          args={[bgScene, sceneSelectors[nextScene].camera]}
        />
        <shaderPass attachArray="passes" args={[CopyShader]} />
        {/*<bokehPass
          attachArray="passes"
          args={[
            bgScene,
            sceneSelectors[nextScene].camera,
            params,
          ]}
        />*/}
      </effectComposer>

      {/** BACKGROUND PORTAL EFFECTS */}
      <effectComposer
        ref={bgComposer}
        args={[gl, bgRenderTarget]}
        renderToScreen={false}
      >
        <renderPass
          attachArray="passes"
          args={[fgScene, sceneSelectors[currentScene].camera]}
        />

        <shaderPass attachArray="passes" args={[CopyShader]} />
        {/*<bokehPass
          attachArray="passes"
          args={[
            fgScene,
            sceneSelectors[currentScene].camera,
            params,
          ]}
        />*/}
      </effectComposer>

      {/** COMPOSIT THE SCENE */}
      <effectComposer ref={maskComposer} args={[gl, maskRenderTarget]}>
        <clearPass attachArray="passes" />
        {/** BACKGROUND */}
        <texturePass attachArray="passes" args={[bgRenderTarget.texture]} />
        {/** FOREGROUND */}
        <maskPass attachArray="passes" args={[fgMask, camera]} />
        <texturePass attachArray="passes" args={[fgRenderTarget.texture]} />
        <clearMaskPass attachArray="passes" />
        <shaderPass attachArray="passes" args={[CopyShader]} renderToScreen />
      </effectComposer>
    </>
  );
}

export default Compositor;
