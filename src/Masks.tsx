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
  //const { size, viewport } = useThree();
  //const aspect = size.width / viewport.width;
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
  let currentScene = useStore((state) => state.currentScene);
  let transitioning = useStore((state) => state.transitioning);
  let timeline = useStore((state) => state.timelines);
  let bounds = useRef<string>(useStore.getState().bounds);

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

  let maskPosition = 0;

  useGesture(
    {
      onDrag: ({ delta: [, y], direction: [, down] }) => {
        setSpring({
          position: ScrollHandler(
            y,
            down,
            currentScene,
            transitioning,
            timeline,
            yRef.current,
            bounds.current,
          ),
        });
      },
      onWheel: ({ delta: [, y], direction: [, down] }) => {
        setSpring({
          position: ScrollHandler(
            y,
            down,
            currentScene,
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

  return (
    <a.group {...spring} visible={transitioning}>
      <mesh position-y={maskPosition}>
        <shapeGeometry args={[maskShape]} />
        <meshBasicMaterial attach="material" color={'#FF0000'} />
      </mesh>
    </a.group>
  );
}
