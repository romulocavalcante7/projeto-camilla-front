import create from 'zustand';
import { Canvas as FabricCanvas } from 'fabric';

interface CanvasHistoryState {
  history: any[];
  redoStack: any[];
  isUndoingOrRedoing: boolean;
  isHistoryDisabled: boolean;
  saveState: (state: any) => void;
  undo: (canvas: FabricCanvas) => void;
  redo: (canvas: FabricCanvas) => void;
  toggleHistory: (disabled: boolean) => void;
}

export const useCanvasHistoryStore = create<CanvasHistoryState>((set, get) => ({
  history: [],
  redoStack: [],
  isUndoingOrRedoing: false,
  isHistoryDisabled: false,

  saveState: (state) => {
    const { history, isHistoryDisabled } = get();
    if (!isHistoryDisabled) {
      set({
        history: [...history, state],
        redoStack: [] // Clear redo stack on new action
      });
    }
  },

  undo: (canvas) => {
    const { history, redoStack } = get();
    if (history.length > 1) {
      set({ isUndoingOrRedoing: true });

      const newHistory = history.slice(0, history.length - 1);
      const lastState = history[history.length - 2];

      set({
        history: newHistory,
        redoStack: [history[history.length - 1], ...redoStack]
      });

      canvas.loadFromJSON(lastState).then(() => {
        canvas.renderAll();
        set({ isUndoingOrRedoing: false });
      });
    }
  },

  redo: (canvas) => {
    const { history, redoStack } = get();
    if (redoStack.length > 0) {
      set({ isUndoingOrRedoing: true });

      const nextState = redoStack[0];

      set({
        history: [...history, nextState],
        redoStack: redoStack.slice(1)
      });

      canvas.loadFromJSON(nextState).then(() => {
        canvas.renderAll();
        set({ isUndoingOrRedoing: false });
      });
    }
  },

  toggleHistory: (disabled) => set(() => ({ isHistoryDisabled: disabled }))
}));
