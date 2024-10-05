import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface SocketStore {
  socket: Socket | null;
  connectToSocket: () => void;
  listenToEvent: (event: string, callback: (data: any) => void) => void;
  disconnectSocket: () => void;
}

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_API || '';

const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,

  connectToSocket: () => {
    if (!get().socket) {
      const newSocket = io(WEBSOCKET_URL);
      set({ socket: newSocket });
    }
  },

  listenToEvent: (event, callback) => {
    const socket = get().socket;
    if (socket) {
      socket.on(event, callback);
    }
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  }
}));

export default useSocketStore;
