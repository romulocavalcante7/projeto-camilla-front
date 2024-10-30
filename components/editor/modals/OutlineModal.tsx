/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Drawer } from 'rsuite';
import { Slider } from '@/components/ui/slider';
import { Cross2Icon } from '@radix-ui/react-icons';
import { HexColorPicker } from 'react-colorful';
import { useCanvasEditorStore } from '@/store/canvasEditorStore';
import { Object as FabricObject, IText as FabricText } from 'fabric';

interface OutilineModalProps {
  saveChanges: () => void;
}

export const OutilineModal = ({ saveChanges }: OutilineModalProps) => {
  const {
    isOutlineModalOpen: isOpen,
    setIsOutlineModalOpen: onClose,
    outlineColor,
    outlineWidth,
    canvasRef,
    setOutlineWidth,
    setOutlineColor
  } = useCanvasEditorStore();

  const [tempOutlineColor, setTempOutlineColor] = useState(outlineColor);
  const [tempOutlineWidth, setTempOutlineWidth] = useState(outlineWidth);

  const updateOutline = (color: string, width: number) => {
    if (!canvasRef.current) return;

    const activeObjects =
      canvasRef.current.getActiveObjects() as FabricObject[];

    activeObjects.forEach((obj) => {
      if (obj.type === 'i-text') {
        const textObj = obj as FabricText;
        textObj.set('stroke', color);
        textObj.set('strokeWidth', width);
      }
    });

    canvasRef.current.renderAll();
  };

  useEffect(() => {
    if (isOpen) {
      updateOutline(tempOutlineColor, tempOutlineWidth);
    }
  }, [tempOutlineColor, tempOutlineWidth, isOpen]);

  return (
    <Drawer
      size="xs"
      placement="bottom"
      open={isOpen}
      onClose={() => onClose(false)}
      dialogClassName="bg-white rounded-2xl dark:bg-[#2a292a]"
      closeButton={false}
    >
      <div className="relative py-5">
        <Cross2Icon
          onClick={() => onClose(false)}
          className="absolute right-4 top-4 h-8 w-8 cursor-pointer"
        />
        <p className="text-center text-2xl">Ajustar Contorno</p>
      </div>
      <div className="mb-10 max-h-full overflow-y-auto px-8 pb-28 pt-2">
        <HexColorPicker
          color={tempOutlineColor}
          onChange={setTempOutlineColor}
          onMouseUp={() => {
            setOutlineColor(tempOutlineColor);
            saveChanges();
          }}
        />
        <div className="mt-5">
          <label className="mb-2 block text-sm">Largura do Contorno:</label>
          <Slider
            value={[tempOutlineWidth]}
            min={0}
            max={10}
            step={0.1}
            onValueChange={(value) => setTempOutlineWidth(value[0])}
            onMouseUp={() => {
              setOutlineWidth(tempOutlineWidth);
              saveChanges();
            }}
          />
        </div>
      </div>
    </Drawer>
  );
};
