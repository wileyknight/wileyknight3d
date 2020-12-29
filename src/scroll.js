/*import { useCallback, useEffect } from 'react';
import { useSpring, config } from 'react-spring';
import { useGesture } from 'react-use-gesture';
import clamp from 'lodash';

export default function Scroll(bounds: any, props: any) {
  const [{ y }, set] = useSpring(() => ({ y: 0, config: config.slow }));
  const fn = useCallback(
    ({ xy: [, cy], previous: [, py], memo = y.get() }) => {
      const newY = clamp(memo + cy - py, ...bounds);
      set({ y: newY });
      return newY;
    },
    [bounds, y, set]
  );
  const bind = useGesture({ onWheel: fn, onDrag: fn }, props);
  useEffect(() => props && props.domTarget && bind(), [props, bind]);
  return [y, bind];
}
*/