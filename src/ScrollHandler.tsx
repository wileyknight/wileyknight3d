import { useRef } from 'react';
import useStore from './Store';

type V3 = [number, number, number];

export const ScrollHandler = (
  y: number,
  down: number,
  currentScene: number,
  transitioning: boolean,
  timeline: [number, number, number, number],
  yRef: number,
  bounds: string,
): V3 => {
  const divY = window.innerHeight / 10;
  let maskPosition = 0;

  if (down === 1) {
    if (!transitioning) {
      if (yRef < timeline[currentScene]) {
        //set state for y
        useStore.setState({ scrollY: yRef + y });
        if (maskPosition !== -divY) {
          maskPosition = -divY;
        }
      } else {
        useStore.setState({ scrollY: 1 });
        useStore.setState({ transitioning: true });
        useStore.setState({ bounds: 'low' });
        if (currentScene + 1 !== timeline.length - 1) {
          useStore.setState({ nextScene: currentScene });
          useStore.setState({ currentScene: currentScene + 1 });
        } else {
          useStore.setState({ nextScene: currentScene });
          useStore.setState({ currentScene: 0 });
        }
      }
    } else {
      // transitioning
      if (bounds === 'low') {
        if (yRef < divY / 4 + divY && yRef > 0) {
          useStore.setState({ scrollY: yRef + y });
          //setSpring({
          //  position: [0, -yRef, 0],
          //});
          return [0, -yRef, 0];
        } else {
          useStore.setState({ scrollY: 1 });
          useStore.setState({ transitioning: false });
          //setSpring({
          //  position: [0, 1, 0],
          //});
          return [0, 1, 0];
        }
      } else {
        if (yRef > -(divY / 4 + divY) && yRef < 0) {
          console.log(
            `dn y: ${y}, yRef: ${yRef} | ${divY / 4 + divY}`,
            transitioning,
            bounds,
          );
          useStore.setState({ scrollY: yRef + y });
          //setSpring({
          //  position: [0, -yRef, 0],
          //});
          return [0, -yRef, 0];
        } else {
          useStore.setState({ scrollY: 1 });
          useStore.setState({ transitioning: false });
          //setSpring({
          //  position: [0, 1, 0],
          //});
          return [0, 1, 0];
        }
      }
    }
  } else if (down === -1) {
    // UP
    if (!transitioning) {
      if (yRef > 0) {
        // set state for y
        useStore.setState({ scrollY: yRef + y });
        if (maskPosition !== divY) {
          maskPosition = divY;
        }
      } else {
        useStore.setState({ scrollY: 1 });
        useStore.setState({ transitioning: true });
        useStore.setState({ bounds: 'high' });
        if (currentScene - 1 !== -1) {
          useStore.setState({ nextScene: currentScene });
          useStore.setState({ currentScene: currentScene - 1 });
        } else {
          useStore.setState({ nextScene: currentScene });
          useStore.setState({ currentScene: timeline.length - 1 });
        }
      }
      // transitioning
    } else {
      if (bounds === 'low') {
        if (yRef < divY / 4 + divY && yRef > 0) {
          useStore.setState({ scrollY: yRef + y });
          //setSpring({
          //  position: [0, -yRef, 0],
          //});
          return [0, -yRef, 0];
        } else {
          useStore.setState({ scrollY: timeline[currentScene] });
          useStore.setState({ transitioning: false });
          //setSpring({
          //  position: [0, 1, 0],
          //});
          return [0, 1, 0];
        }
      } else {
        if (yRef > -(divY / 4 + divY)) {
          useStore.setState({ scrollY: yRef + y });
          //setSpring({
          //  position: [0, -yRef, 0],
          //});
          return [0, -yRef, 0];
        } else {
          useStore.setState({ scrollY: timeline[currentScene] });
          useStore.setState({ transitioning: false });
          //setSpring({
          //  position: [0, 1, 0],
          //});
          return [0, 1, 0];
        }
      }
    }
  }
};

export default ScrollHandler;
