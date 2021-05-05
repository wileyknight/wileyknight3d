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
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader';
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

function Compositor({ sceneCamera, maskCamera }) {
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

  const fgMask = useMemo(() => {
    const maskScene = new THREE.Scene();
    return maskScene;
  }, []);

  const circuitScene = useMemo(() => {
    const circuitScene = new THREE.Scene();
    return circuitScene;
  }, []);

  const yearsScene = useMemo(() => {
    const yearsScene = new THREE.Scene();
    return yearsScene;
  }, []);

  const quantumScene = useMemo(() => {
    const maskScene = new THREE.Scene();
    return maskScene;
  }, []);

  const hyperloopScene = useMemo(() => {
    const maskScene = new THREE.Scene();
    return maskScene;
  }, []);

  useEffect(() => {
    fgComposer.current.setSize(size.width, size.height);
    bgComposer.current.setSize(size.width, size.height);
    maskComposer.current.setSize(size.width, size.height);
  }, [size]);

  const sceneSelectors = [
    {
      environment: <SceneCircuit />,
      mask: <MaskPlane />,
      scene: circuitScene,
      color: 0xbabed8,
    },
    {
      environment: <Scene20Years />,
      mask: <MaskPlane />,
      scene: yearsScene,
      color: 0x000d2c,
    },
    {
      environment: <SceneQuantum />,
      mask: <MaskPlane />,
      scene: quantumScene,
      color: 0x06101b,
    },
    {
      environment: <SceneHyperloop />,
      mask: <MaskPlane />,
      scene: hyperloopScene,
      color: 0x9bcafa,
    },
  ];

  let transitioning = useStore((state) => state.transitioning);
  let currentScene = useStore((state) => state.currentScene);
  let nextScene = useStore((state) => state.nextScene);

  yearsScene.background = new THREE.Color(sceneSelectors[0].color);
  circuitScene.background = new THREE.Color(sceneSelectors[1].color);
  quantumScene.background = new THREE.Color(sceneSelectors[2].color);
  hyperloopScene.background = new THREE.Color(sceneSelectors[3].color);

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

      yearsScene.environment = hdrCubeRenderTarget.texture;
      circuitScene.environment = hdrCubeRenderTarget.texture;
      quantumScene.environment = hdrCubeRenderTarget.texture;
      hyperloopScene.environment = hdrCubeRenderTarget.texture;
    });

  useFrame((state) => {
    if (controls.current) {
      controls.current.update();
    }

    state.gl.autoClear = false;
    state.gl.clear();

    if (bgComposer.current) {
      bgComposer.current.render(
        sceneSelectors[currentScene].scene,
        sceneCamera,
      );
    }
    if (fgComposer.current) {
      if (transitioning) {
        fgComposer.current.render(sceneSelectors[nextScene].scene, sceneCamera);
      }
    }
    if (maskComposer.current) {
      maskComposer.current.render(fgMask, maskCamera);
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
      {createPortal(<MaskPlane />, fgMask)}
      {createPortal(
        sceneSelectors[nextScene].environment,
        sceneSelectors[nextScene].scene,
      )}
      {createPortal(
        sceneSelectors[currentScene].environment,
        sceneSelectors[currentScene].scene,
      )}

      {/** FOREGROUND PORTAL EFFECTS */}
      <effectComposer
        ref={fgComposer}
        args={[gl, fgRenderTarget]}
        renderToScreen={false}
      >
        <renderPass
          attachArray="passes"
          args={[sceneSelectors[nextScene].scene, sceneCamera]}
        />
        <shaderPass attachArray="passes" args={[CopyShader]} />
      </effectComposer>

      {/** BACKGROUND PORTAL EFFECTS */}
      <effectComposer
        ref={bgComposer}
        args={[gl, bgRenderTarget]}
        renderToScreen={false}
      >
        <renderPass
          attachArray="passes"
          args={[sceneSelectors[currentScene].scene, sceneCamera]}
        />
        <shaderPass attachArray="passes" args={[CopyShader]} />
      </effectComposer>

      {/** COMPOSIT THE SCENE */}
      <effectComposer ref={maskComposer} args={[gl, maskRenderTarget]}>
        <clearPass attachArray="passes" />
        {/** BACKGROUND */}
        <texturePass attachArray="passes" args={[bgRenderTarget.texture]} />\
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

export default Compositor;
