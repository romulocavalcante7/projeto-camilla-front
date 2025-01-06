import create from 'zustand';
import {
  Canvas as FabricCanvas,
  IText as FabricText,
  Object as FabricObject
} from 'fabric';

interface CanvasEditorState {
  canvasRef: React.MutableRefObject<FabricCanvas | null>;
  canvasElementRef: React.MutableRefObject<HTMLCanvasElement | null>;
  currentMenu: string;
  isUploading: boolean;
  opacity: number;
  selectedObject: FabricObject[] | null;
  selectedText: FabricText | null;
  isOpacityModalOpen: boolean;
  isIconModalOpen: boolean;
  isColorModalOpen: boolean;
  isSaturationTemperatureModalOpen: boolean;

  setCurrentMenu: (menu: string) => void;
  setIsUploading: (isUploading: boolean) => void;
  setOpacity: (opacity: number) => void;
  setSelectedObject: (objects: FabricObject[] | null) => void;
  setIsColorModalOpen: (isOpen: boolean) => void;
  setIsOpacityModalOpen: (isOpen: boolean) => void;
  setIsIconModalOpen: (isOpen: boolean) => void;
  setIsSaturationTemperatureModalOpen: (isOpen: boolean) => void;
}

export const useCanvasEditorStore = create<CanvasEditorState>((set) => ({
  canvasRef: { current: null },
  canvasElementRef: { current: null },
  currentMenu: 'main',
  isUploading: false,
  opacity: 1,
  previousRotation: 0,
  selectedObject: null,
  selectedText: null,
  isOpacityModalOpen: false,
  isIconModalOpen: false,
  isColorModalOpen: false,
  isSaturationTemperatureModalOpen: false,
  setIsColorModalOpen: (isOpen) => set({ isColorModalOpen: isOpen }),
  setCurrentMenu: (menu) => set({ currentMenu: menu }),
  setIsUploading: (isUploading) => set({ isUploading }),
  setOpacity: (opacity) => set({ opacity }),
  setSelectedObject: (objects) => set({ selectedObject: objects }),
  setIsOpacityModalOpen: (isOpen) => set({ isOpacityModalOpen: isOpen }),
  setIsIconModalOpen: (isOpen) => set({ isIconModalOpen: isOpen }),
  setIsSaturationTemperatureModalOpen: (isOpen) =>
    set({ isSaturationTemperatureModalOpen: isOpen })
}));
