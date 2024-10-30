import create from 'zustand';
import {
  Canvas as FabricCanvas,
  IText as FabricText,
  Shadow as FabricShadow,
  Image as FabricImage,
  Object as FabricObject,
  Gradient as FabricGradient,
  InteractiveFabricObject
} from 'fabric';

interface CanvasEditorState {
  canvasRef: React.MutableRefObject<FabricCanvas | null>;
  canvasElementRef: React.MutableRefObject<HTMLCanvasElement | null>;
  currentMenu: string;
  isUploadModalOpen: boolean;
  isUploading: boolean;
  fontSize: number;
  fontColor: string;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string[];
  opacity: number;
  textBackgroundColor: string;
  radius: number;
  startAngle: number;
  isAddingText: boolean;
  alignment: string;
  lineHeight: number;
  isLineHeightModalOpen: boolean;
  outlineWidth: number;
  outlineColor: string;
  fontFamily: string;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  letterSpacing: number;
  skewX: number;
  skewY: number;
  rotation: number;
  rotationChanged: boolean;
  previousRotation: number;
  selectedObject: FabricObject[] | null;
  selectedText: FabricText | null;
  isColorModalOpen: boolean;
  isFontModalOpen: boolean;
  isOpacityModalOpen: boolean;
  isOutlineModalOpen: boolean;
  isShadowModalOpen: boolean;
  isLetterSpacingModalOpen: boolean;
  isSkewModalOpen: boolean;
  isRotationModalOpen: boolean;
  isTextBackgroundColorModalOpen: boolean;
  isIconModalOpen: boolean;
  isCurvedTextModalOpen: boolean;
  startColor: string;
  endColor: string;
  direction: number;
  isGradientModalOpen: boolean;

  setCurrentMenu: (menu: string) => void;
  setIsUploadModalOpen: (isOpen: boolean) => void;
  setIsUploading: (isUploading: boolean) => void;
  setFontSize: (size: number) => void;
  setFontColor: (color: string) => void;
  setFontWeight: (weight: string) => void;
  setFontStyle: (style: string) => void;
  setTextDecoration: (decoration: string[]) => void;
  setOpacity: (opacity: number) => void;
  setTextBackgroundColor: (color: string) => void;
  setRadius: (radius: number) => void;
  setStartAngle: (angle: number) => void;
  setIsAddingText: (isAdding: boolean) => void;
  setAlignment: (alignment: string) => void;
  setLineHeight: (lineHeight: number) => void;
  setIsLineHeightModalOpen: (isOpen: boolean) => void;
  setOutlineWidth: (width: number) => void;
  setOutlineColor: (color: string) => void;
  setFontFamily: (family: string) => void;
  setShadowColor: (color: string) => void;
  setShadowBlur: (blur: number) => void;
  setShadowOffsetX: (offsetX: number) => void;
  setShadowOffsetY: (offsetY: number) => void;
  setLetterSpacing: (spacing: number) => void;
  setSkewX: (skewX: number) => void;
  setSkewY: (skewY: number) => void;
  setRotation: (rotation: number) => void;
  setRotationChanged: (changed: boolean) => void;
  setPreviousRotation: (rotation: number) => void;
  setSelectedObject: (objects: FabricObject[] | null) => void;
  setSelectedText: (text: FabricText | null) => void;
  setIsColorModalOpen: (isOpen: boolean) => void;
  setIsFontModalOpen: (isOpen: boolean) => void;
  setIsOpacityModalOpen: (isOpen: boolean) => void;
  setIsOutlineModalOpen: (isOpen: boolean) => void;
  setIsShadowModalOpen: (isOpen: boolean) => void;
  setIsLetterSpacingModalOpen: (isOpen: boolean) => void;
  setIsSkewModalOpen: (isOpen: boolean) => void;
  setIsRotationModalOpen: (isOpen: boolean) => void;
  setIsTextBackgroundColorModalOpen: (isOpen: boolean) => void;
  setIsIconModalOpen: (isOpen: boolean) => void;
  setIsCurvedTextModalOpen: (isOpen: boolean) => void;
  setStartColor: (color: string) => void;
  setEndColor: (color: string) => void;
  setDirection: (direction: number) => void;
  setIsGradientModalOpen: (isOpen: boolean) => void;
}

export const useCanvasEditorStore = create<CanvasEditorState>((set) => ({
  canvasRef: { current: null },
  canvasElementRef: { current: null },
  currentMenu: 'main',
  isUploadModalOpen: false,
  isUploading: false,
  fontSize: 24,
  fontColor: '#fff',
  fontWeight: 'normal',
  fontStyle: 'normal',
  textDecoration: [],
  opacity: 1,
  textBackgroundColor: '',
  radius: 100,
  startAngle: -90,
  isAddingText: false,
  alignment: 'center',
  lineHeight: 1.16,
  isLineHeightModalOpen: false,
  outlineWidth: 0,
  outlineColor: '#fff',
  fontFamily: 'Arial',
  shadowColor: '',
  shadowBlur: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  letterSpacing: 0,
  skewX: 0,
  skewY: 0,
  rotation: 0,
  rotationChanged: false,
  previousRotation: 0,
  selectedObject: null,
  selectedText: null,
  isColorModalOpen: false,
  isFontModalOpen: false,
  isOpacityModalOpen: false,
  isOutlineModalOpen: false,
  isShadowModalOpen: false,
  isLetterSpacingModalOpen: false,
  isSkewModalOpen: false,
  isRotationModalOpen: false,
  isTextBackgroundColorModalOpen: false,
  isIconModalOpen: false,
  isCurvedTextModalOpen: false,
  startColor: '#1be770',
  endColor: '#1074f7',
  direction: 0,
  isGradientModalOpen: false,

  setCurrentMenu: (menu) => set({ currentMenu: menu }),
  setIsUploadModalOpen: (isOpen) => set({ isUploadModalOpen: isOpen }),
  setIsUploading: (isUploading) => set({ isUploading }),
  setFontSize: (size) => set({ fontSize: size }),
  setFontColor: (color) => set({ fontColor: color }),
  setFontWeight: (weight) => set({ fontWeight: weight }),
  setFontStyle: (style) => set({ fontStyle: style }),
  setTextDecoration: (decoration) => set({ textDecoration: decoration }),
  setOpacity: (opacity) => set({ opacity }),
  setTextBackgroundColor: (color) => set({ textBackgroundColor: color }),
  setRadius: (radius) => set({ radius }),
  setStartAngle: (angle) => set({ startAngle: angle }),
  setIsAddingText: (isAdding) => set({ isAddingText: isAdding }),
  setAlignment: (alignment) => set({ alignment }),
  setLineHeight: (lineHeight) => set({ lineHeight }),
  setIsLineHeightModalOpen: (isOpen) => set({ isLineHeightModalOpen: isOpen }),
  setOutlineWidth: (width) => set({ outlineWidth: width }),
  setOutlineColor: (color) => set({ outlineColor: color }),
  setFontFamily: (family) => set({ fontFamily: family }),
  setShadowColor: (color) => set({ shadowColor: color }),
  setShadowBlur: (blur) => set({ shadowBlur: blur }),
  setShadowOffsetX: (offsetX) => set({ shadowOffsetX: offsetX }),
  setShadowOffsetY: (offsetY) => set({ shadowOffsetY: offsetY }),
  setLetterSpacing: (spacing) => set({ letterSpacing: spacing }),
  setSkewX: (skewX) => set({ skewX }),
  setSkewY: (skewY) => set({ skewY }),
  setRotation: (rotation) => set({ rotation }),
  setRotationChanged: (changed) => set({ rotationChanged: changed }),
  setPreviousRotation: (rotation) => set({ previousRotation: rotation }),
  setSelectedObject: (objects) => set({ selectedObject: objects }),
  setSelectedText: (text) => set({ selectedText: text }),
  setIsColorModalOpen: (isOpen) => set({ isColorModalOpen: isOpen }),
  setIsFontModalOpen: (isOpen) => set({ isFontModalOpen: isOpen }),
  setIsOpacityModalOpen: (isOpen) => set({ isOpacityModalOpen: isOpen }),
  setIsOutlineModalOpen: (isOpen) => set({ isOutlineModalOpen: isOpen }),
  setIsShadowModalOpen: (isOpen) => set({ isShadowModalOpen: isOpen }),
  setIsLetterSpacingModalOpen: (isOpen) =>
    set({ isLetterSpacingModalOpen: isOpen }),
  setIsSkewModalOpen: (isOpen) => set({ isSkewModalOpen: isOpen }),
  setIsRotationModalOpen: (isOpen) => set({ isRotationModalOpen: isOpen }),
  setIsTextBackgroundColorModalOpen: (isOpen) =>
    set({ isTextBackgroundColorModalOpen: isOpen }),
  setIsIconModalOpen: (isOpen) => set({ isIconModalOpen: isOpen }),
  setIsCurvedTextModalOpen: (isOpen) => set({ isCurvedTextModalOpen: isOpen }),
  setStartColor: (color) => set({ startColor: color }),
  setEndColor: (color) => set({ endColor: color }),
  setDirection: (direction) => set({ direction }),
  setIsGradientModalOpen: (isOpen) => set({ isGradientModalOpen: isOpen })
}));
