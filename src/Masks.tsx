import React, { useRef, useEffect, useMemo, MutableRefObject } from 'react';
import { useThree } from '@react-three/fiber';
import './App.css';
import * as THREE from 'three';
import { useSpring, a, config } from 'react-spring/three';
import { useGesture } from 'react-use-gesture';
import useStore from './Store';

type V3 = [number, number, number];

export function PlaneMask1() {
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

export function PlaneMask2() {
  const { size, viewport } = useThree();
  //const { width, height, factor } = viewport;
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

  let currectScene = useStore((state) => state.scene);
  let transitioning = useStore((state) => state.transition);
  let timeline = useStore((state) => state.timelines);

  const bind = useGesture(
    {
      onDrag: ({ movement: [x, y], direction: [lr, down] }) => {
        const yPos = -(y / aspect);
        //console.log(yPos, y, yRef.current, -divY);
        if (down === 1) {
          if (transitioning) {
            if (yRef.current > -divY) {
              setSpring({
                position: [0, yRef.current, 0],
              });
              useStore.setState({ scrollY: yRef.current + yPos });
            } else if (yRef.current < -divY) {
              if (currectScene !== 1) {
                console.log('current scene 1');
                useStore.setState({ scene: 1 });
              } else {
                console.log('current scene 0');
                useStore.setState({ scene: 0 });
              }
              setSpring({
                position: [0, 0, 0],
              });
              useStore.setState({ scrollY: 0 });
              useStore.setState({ transition: false });
            }
          } else {
            if (yRef.current > -timeline[currectScene]) {
              //set state for y
              useStore.setState({ scrollY: yRef.current + yPos });
            } else {
              useStore.setState({ scrollY: 0 });
              useStore.setState({ transition: true });
            }
          }
        } else if (down === -1) {
          if (transitioning) {
            if (yRef.current < divY) {
              setSpring({
                position: [0, yRef.current, 0],
              });
              useStore.setState({ scrollY: yRef.current + yPos });
            } else if (yRef.current > divY) {
              if (currectScene !== 1) {
                console.log('up current scene 1');
                useStore.setState({ scene: 1 });
              } else {
                console.log('up current scene 0');
                useStore.setState({ scene: 0 });
              }
              setSpring({
                position: [0, 0, 0],
              });
              useStore.setState({ scrollY: 0 });
              useStore.setState({ transition: false });
            }
          } else {
            if (yRef.current > timeline[currectScene]) {
              // set state for y
              useStore.setState({ scrollY: yRef.current + yPos });
            } else {
              useStore.setState({ scrollY: 0 });
              useStore.setState({ transition: true });
            }
          }
        }
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

  //console.log(divX, divY);
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
