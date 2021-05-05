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
    // DOWN
    if (!transitioning) {
      if (yRef < timeline[currentScene]) {
        // set y position
        useStore.setState({ scrollY: yRef + y });
        if (maskPosition !== -divY) {
          maskPosition = -divY;
        }
      } else {
        // end of scroll down boundry
        useStore.setState({ scrollY: 1 });
        useStore.setState({ transitioning: true });
        if (currentScene + 1 !== timeline.length) {
          if (bounds !== 'low') {
            useStore.setState({ nextScene: currentScene });
            useStore.setState({ currentScene: currentScene + 1 });
          }
        } else {
          if (bounds !== 'high') {
            useStore.setState({ nextScene: currentScene });
            useStore.setState({ currentScene: 0 });
          }
        }
        useStore.setState({ bounds: 'low' });
      }
    } else {
      // transitioning down
      if (bounds === 'low') {
        // top of screen
        if (yRef < divY / 4 + divY && yRef > 0) {
          // set y position
          useStore.setState({ scrollY: yRef + y });
          return [0, -yRef, 0];
        } else {
          // end of scroll
          useStore.setState({ scrollY: 1 });
          useStore.setState({ transitioning: false });
          useStore.setState({ bounds: '' });
          return [0, 1, 0];
        }
      } else {
        // reverse direction
        if (yRef > -(divY / 4 + divY) && yRef < 0) {
          // set y position
          useStore.setState({ scrollY: yRef + y });
          return [0, -yRef, 0];
        } else {
          // end of scroll
          useStore.setState({ scrollY: 1 });
          useStore.setState({ transitioning: false });
          useStore.setState({ bounds: '' });
          return [0, 1, 0];
        }
      }
    }
  } else if (down === -1) {
    // UP
    if (!transitioning) {
      if (yRef > 0) {
        // set y position
        useStore.setState({ scrollY: yRef + y });
        if (maskPosition !== divY) {
          maskPosition = divY;
        }
      } else {
        // end of scroll up boundry
        useStore.setState({ scrollY: 1 });
        useStore.setState({ transitioning: true });
        if (currentScene - 1 !== -1) {
          if (bounds !== 'high') {
            useStore.setState({ nextScene: currentScene });
            useStore.setState({ currentScene: currentScene - 1 });
          }
        } else {
          if (bounds !== 'low') {
            useStore.setState({ nextScene: currentScene });
            useStore.setState({ currentScene: timeline.length - 1 });
          }
        }
        useStore.setState({ bounds: 'high' });
      }
      // transitioning up
    } else {
      if (bounds === 'low') {
        // top of screen
        if (yRef < divY / 4 + divY && yRef > 0) {
          // set y position
          useStore.setState({ scrollY: yRef + y });
          useStore.setState({ bounds: '' });
          return [0, -yRef, 0];
        } else {
          // end of scroll
          useStore.setState({ scrollY: timeline[currentScene] });
          useStore.setState({ transitioning: false });
          return [0, 1, 0];
        }
      } else {
        // reverse direction
        if (yRef > -(divY / 4 + divY)) {
          //set y position
          useStore.setState({ scrollY: yRef + y });
          return [0, -yRef, 0];
        } else {
          // end of scroll
          useStore.setState({ scrollY: timeline[currentScene] });
          useStore.setState({ transitioning: false });
          useStore.setState({ bounds: '' });
          return [0, 1, 0];
        }
      }
    }
  }
};

export default ScrollHandler;
