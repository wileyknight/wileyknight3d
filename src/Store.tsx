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
  transitioning: false,
  timelines: [
    window.innerHeight / 2,
    window.innerHeight / 2,
    window.innerHeight / 2,
    window.innerHeight / 2,
  ],
  bounds: '',
}));

export default useStore;
