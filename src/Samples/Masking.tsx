import * as THREE from 'three';
import { render } from 'react-dom';
import React, { useEffect, useRef, useMemo, Suspense } from 'react';
import {
  Canvas,
  useThree,
  useFrame,
  extend,
  useLoader,
} from 'react-three-fiber';
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
import './styles.css';

extend({
  EffectComposer,
  ShaderPass,
  TexturePass,
  ClearPass,
  MaskPass,
  ClearMaskPass,
  CopyShader,
  RenderPass,
});

function Torus() {
  const ref = useRef();
  useFrame(({ clock }) => {
    ref.current.position.x = Math.cos(clock.getElapsedTime()) * 2;
    ref.current.position.y = Math.sin(clock.getElapsedTime() / 1.5) * 2;
    ref.current.rotation.x = clock.getElapsedTime();
    ref.current.rotation.y = clock.getElapsedTime() / 2;
  });
  return (
    <mesh ref={ref}>
      <torusBufferGeometry attach="geometry" args={[3, 1, 16, 32]} />
    </mesh>
  );
}

function Box() {
  const ref = useRef();
  useFrame(({ clock }) => {
    ref.current.position.x = Math.cos(clock.getElapsedTime() / 1.5) * 2;
    ref.current.position.y = Math.sin(clock.getElapsedTime()) * 2;
    ref.current.rotation.x = clock.getElapsedTime();
    ref.current.rotation.y = clock.getElapsedTime() / 2;
  });
  return (
    <mesh ref={ref}>
      <boxBufferGeometry attach="geometry" args={[4, 4, 4]} />
      <meshStandardMaterial
        attach="material"
        color="blue"
        roughness={0.3}
        metalness={0.5}
      />
    </mesh>
  );
}

function Effects({ scene1, scene2 }) {
  const { gl, camera, size } = useThree();
  const [texture1, texture2] = useLoader(THREE.TextureLoader, [
    'https://threejs.org/examples/textures/758px-Canestra_di_frutta_(Caravaggio).jpg',
    'https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg',
  ]);
  const occlusionRenderTarget = useMemo(
    () => new THREE.WebGLRenderTarget(),
    [],
  );
  const occlusionComposer = useRef();
  texture1.minFilter = THREE.LinearFilter;
  const renderTarget = useMemo(
    () =>
      new THREE.WebGLRenderTarget(size.height, size.width, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat,
        stencilBuffer: true,
      }),
    [size.height, size.width],
  );
  const composer = useRef();
  useEffect(() => {
    occlusionComposer.current.setSize(size.width, size.height);
    composer.current.setSize(size.width, size.height);
  }, [size]);

  useFrame(() => {
    gl.autoClear = false;
    gl.clear();
    occlusionComposer.current.render();
    composer.current.render();
  });

  return (
    <>
      <effectComposer
        ref={occlusionComposer}
        args={[gl, occlusionRenderTarget]}
        renderToScreen={true}
      >
        <renderPass attachArray="passes" args={[scene1.current, camera]} />
        <shaderPass attachArray="passes" args={[CopyShader]} />
      </effectComposer>
      <effectComposer ref={composer} args={[gl, renderTarget]}>
        <clearPass attachArray="passes" />

        <maskPass attachArray="passes" args={[scene1.current, camera]} />
        <texturePass attachArray="passes" args={[texture2]} />
        <clearMaskPass attachArray="passes" />
        <maskPass attachArray="passes" args={[scene2.current, camera]} />
        <texturePass
          attachArray="passes"
          args={[occlusionRenderTarget.texture]}
        />
        <clearMaskPass attachArray="passes" />
        <shaderPass attachArray="passes" args={[CopyShader]} />
      </effectComposer>
    </>
  );
}

function App() {
  const scene1 = useRef();
  const scene2 = useRef();
  return (
    <Canvas camera={{ position: [0, 0, 10] }}>
      <scene ref={scene1}>
        <directionalLight
          color={new THREE.Color().setHSL(1, 1, 1)}
          intensity={1}
          position={[0, 1, 1]}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={100}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
        />
        <Box />
      </scene>
      <scene ref={scene2}>
        <Torus />
      </scene>
      <Suspense fallback={<Box />}>
        <Effects scene1={scene1} scene2={scene2} />
      </Suspense>
    </Canvas>
  );
}

render(<App />, document.querySelector('#root'));
