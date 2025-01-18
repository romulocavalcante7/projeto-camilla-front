/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Drawer } from 'rsuite';
import { Cross2Icon } from '@radix-ui/react-icons';
import { HexColorPicker } from 'react-colorful';
import { useCanvasEditorStore } from '@/store/canvasEditorStore';
interface ColorModalProps {
  saveChanges: () => void;
}

export const ColorModal = ({ saveChanges }: ColorModalProps) => {
  const {
    isColorModalOpen: isOpen,
    setIsColorModalOpen: onClose,
    canvasRef
  } = useCanvasEditorStore();
  const [tempColor, setTempColor] = useState('#fff');

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
        <p className="text-center text-2xl">Selecione a cor</p>
      </div>
      <div className="px-8 pt-10">
        <HexColorPicker
          color={tempColor}
          onChange={(newColor) => setTempColor(newColor)}
          onMouseUp={() => {
            // setFontColor(tempColor);
            saveChanges();
          }}
        />
      </div>
    </Drawer>
  );
};
