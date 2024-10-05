import { create } from 'zustand';

interface UserStore {
  activeUsers: number;
  setActiveUsers: (count: number) => void;
}

const useUserStore = create<UserStore>((set) => ({
  activeUsers: 0,
  setActiveUsers: (count) => set(() => ({ activeUsers: count }))
}));

export default useUserStore;
