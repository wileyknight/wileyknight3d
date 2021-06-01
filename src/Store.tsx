import create from 'zustand';

type State = {
  scrollY: number;
  currentScene: number;
  nextScene: number;
  transitioning: boolean;
  timelines: [number, number, number, number];
  bounds: string;
};

const useStore = create<State>((set) => ({
  scrollY: 1,
  currentScene: 0,
  nextScene: 0,
  active: 'bg',
  transitioning: false,
  timelines: [
    window.innerHeight,
    window.innerHeight,
    window.innerHeight,
    window.innerHeight,
  ],
  bounds: '',
}));

export default useStore;
