import * as THREE from 'three';
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
  createPortal,
  extend,
  useThree,
  ReactThreeFiber,
} from 'react-three-fiber';

const transitionParams = {
  useTexture: true,
  transition: 0.5,
  transitionSpeed: 2.0,
  texture: 5,
  loopTexture: true,
  animateTransition: true,
  textureThreshold: 0.3,
};

export default function Transition() {
  //this.scene = new THREE.Scene();
  const [scene] = useState(() => new THREE.Scene());
  /*
  cameraOrtho = new THREE.OrthographicCamera(
    window.innerWidth / -2,
    window.innerWidth / 2,
    window.innerHeight / 2,
    window.innerHeight / -2,
    -10,
    10,
  );
*/

  const textures = [];

  const loader = new THREE.TextureLoader();

  for (let i = 0; i < 6; i++)
    textures[i] = loader.load('images/transition' + (i + 1) + '.png');

  const quadmaterial = new THREE.ShaderMaterial({
    uniforms: {
      tDiffuse1: {
        value: null,
      },
      tDiffuse2: {
        value: null,
      },
      mixRatio: {
        value: 0.0,
      },
      threshold: {
        value: 0.1,
      },
      useTexture: {
        value: 1,
      },
      tMixTexture: {
        value: this.textures[0],
      },
    },
    vertexShader: [
      'varying vec2 vUv;',
      'void main() {',
      'vUv = vec2( uv.x, uv.y );',
      'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
      '}',
    ].join('\n'),
    fragmentShader: [
      'uniform float mixRatio;',
      'uniform sampler2D tDiffuse1;',
      'uniform sampler2D tDiffuse2;',
      'uniform sampler2D tMixTexture;',
      'uniform int useTexture;',
      'uniform float threshold;',
      'varying vec2 vUv;',

      'void main() {',
      '	vec4 texel1 = texture2D( tDiffuse1, vUv );',
      '	vec4 texel2 = texture2D( tDiffuse2, vUv );',
      '	if (useTexture==1) {',
      '		vec4 transitionTexel = texture2D( tMixTexture, vUv );',
      '		float r = mixRatio * (1.0 + threshold * 2.0) - threshold;',
      '		float mixf=clamp((transitionTexel.r - r)*(1.0/threshold), 0.0, 1.0);',
      '		gl_FragColor = mix( texel1, texel2, mixf );',
      '	} else {',
      '		gl_FragColor = mix( texel2, texel1, mixRatio );',
      '	}',
      '}',
    ].join('\n'),
  });

  const quadgeometry = new THREE.PlaneBufferGeometry(
    window.innerWidth,
    window.innerHeight,
  );

  const quad = new THREE.Mesh(quadgeometry, this.quadmaterial);
  scene.add(this.quad);

  // Link both scenes and their FBOs
  //sceneA = sceneA;
  //sceneB = sceneB;

  //quadmaterial.uniforms.tDiffuse1.value = sceneA.fbo.texture;
  //quadmaterial.uniforms.tDiffuse2.value = sceneB.fbo.texture;

  let needChange = false;

  const setTextureThreshold = function (value) {
    this.quadmaterial.uniforms.threshold.value = value;
  };

  const useTexture = function (value) {
    this.quadmaterial.uniforms.useTexture.value = value ? 1 : 0;
  };

  const setTexture = function (i) {
    this.quadmaterial.uniforms.tMixTexture.value = this.textures[i];
  };

  render = function (delta) {
    /*
    // Transition animation
    if (transitionParams.animateTransition) {
      const t =
        (1 +
          Math.sin(
            (transitionParams.transitionSpeed * clock.getElapsedTime()) /
              Math.PI,
          )) /
        2;
      transitionParams.transition = THREE.MathUtils.smoothstep(t, 0.3, 0.7);

      // Change the current alpha texture after each transition
      if (
        transitionParams.loopTexture &&
        (transitionParams.transition === 0 || transitionParams.transition === 1)
      ) {
        if (this.needChange) {
          transitionParams.texture =
            (transitionParams.texture + 1) % this.textures.length;
          this.quadmaterial.uniforms.tMixTexture.value = this.textures[
            transitionParams.texture
          ];
          this.needChange = false;
        }
      } else this.needChange = true;
    }
    */

    // Transition this on scroll
    //transitionParams.transition = THREE.MathUtils.smoothstep(t, 0.3, 0.7);
    quadmaterial.uniforms.mixRatio.value = transitionParams.transition;

    // Prevent render both scenes when it's not necessary
    if (transitionParams.transition === 0) {
      sceneB.render(delta, false);
    } else if (transitionParams.transition === 1) {
      sceneA.render(delta, false);
    } else {
      // When 0<transition<1 render transition between two scenes

      sceneA.render(delta, true);
      sceneB.render(delta, true);
      //renderer.setRenderTarget(null);
      //renderer.clear();
      //renderer.render(this.scene, this.cameraOrtho);
    }
  };
}
