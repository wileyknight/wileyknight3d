import create from 'zustand';

type State = {
  scrollY: number;
  scene: number;
  transition: boolean;
  timelines: [number, number];
  yUp: (by: number) => void;
  yDown: (by: number) => void;
};

const useStore = create<State>((set) => ({
  scrollY: 0,
  scene: 0,
  transition: true,
  timelines: [window.innerHeight, window.innerHeight],
  yUp: (springPos: number) => set((state) => ({ scrollY: springPos })),
  yDown: () => set((state) => ({ scrollY: state.scrollY - 1 })),
  resetY: () => set({ scrollY: 0 }),
}));

export default useStore;
