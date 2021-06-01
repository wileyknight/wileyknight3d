import React, { useRef, useEffect, useMemo } from 'react';
//import { useThree } from '@react-three/fiber';
import './App.css';
import * as THREE from 'three';
import { useSpring, a } from 'react-spring/three';
import { useGesture } from 'react-use-gesture';
import useStore from './Store';
import ScrollHandler from './ScrollHandler';

type V3 = [number, number, number];

export function MaskPlane() {
  const divX = window.innerWidth;
  const divY = window.innerHeight;

  const [spring, api] = useSpring(() => ({
    position: [0, 0, 0] as V3,
    config: {
      mass: 1,
      friction: 10,
      tension: 50,
      velocity: 100,
    },
  }));

  const yRef = useRef<number>(useStore.getState().scrollY);
  const currentScene = useRef<number>(useStore.getState().currentScene);
  const bounds = useRef<string>(useStore.getState().bounds);
  const transitioning = useStore((state) => state.transitioning);
  const timeline = useStore((state) => state.timelines);

  useEffect(
    () =>
      useStore.subscribe(
        (theScene: number) => (currentScene.current = theScene),
        (state) => state.currentScene,
      ),
    [],
  );

  useEffect(
    () =>
      useStore.subscribe(
        (scrollY: number) => (yRef.current = scrollY),
        (state) => state.scrollY,
      ),
    [],
  );

  useEffect(
    () =>
      useStore.subscribe(
        (direction: string) => (bounds.current = direction),
        (state) => state.bounds,
      ),
    [],
  );

  useGesture(
    {
      onDrag: ({ delta: [, y], direction: [, down] }) => {
        api.start({
          position: ScrollHandler(
            Math.floor(y * 2),
            down,
            currentScene.current,
            transitioning,
            timeline,
            yRef.current,
            bounds.current,
          ),
        });
      },
      onWheel: ({ delta: [, y], direction: [, down] }) => {
        api.start({
          position: ScrollHandler(
            Math.floor(y / 4),
            down,
            currentScene.current,
            transitioning,
            timeline,
            yRef.current,
            bounds.current,
          ),
        });
      },
    },
    {
      domTarget: window,
    },
  );

  const maskShape = useMemo(() => {
    const maskPts = [];
    const hX = divX / 2;
    const hY = divY / 2;
    maskPts.push(new THREE.Vector2(-hX, hY));
    maskPts.push(new THREE.Vector2(hX, hY / 4 + hY));
    maskPts.push(new THREE.Vector2(hX, -hY));
    maskPts.push(new THREE.Vector2(hX / 2, -(hY / 2) - hY));
    maskPts.push(new THREE.Vector2(-hX, -hY));
    maskPts.push(new THREE.Vector2(-hX, hY));
    return new THREE.Shape(maskPts);
  }, [divX, divY]);

  /*
  const maskShape2 = useMemo(() => {
    const maskPts = [];
    const hX = divX / 2;
    const hY = divY / 2;
    maskPts.push(new THREE.Vector2(-hX, hY / 4 + hY));
    maskPts.push(new THREE.Vector2(hX / 2, hY));
    maskPts.push(new THREE.Vector2(hX, hY / 4 + hY));
    maskPts.push(new THREE.Vector2(hX, -hY));
    maskPts.push(new THREE.Vector2(-hX, -(hY / 2) - hY));
    maskPts.push(new THREE.Vector2(-hX, hY));
    return new THREE.Shape(maskPts);
  }, [divX, divY]);
*/
  return (
    <a.group {...spring} visible={transitioning}>
      <mesh scale={0.9}>
        <shapeGeometry args={[maskShape]} />
        <meshBasicMaterial attach="material" color={'#FF0000'} />
      </mesh>
    </a.group>
  );
}
