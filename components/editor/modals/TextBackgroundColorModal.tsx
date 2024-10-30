/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Drawer } from 'rsuite';
import { Cross2Icon } from '@radix-ui/react-icons';
import { HexColorPicker } from 'react-colorful';
import { useCanvasEditorStore } from '@/store/canvasEditorStore';
import { Object as FabricObject, IText as FabricText } from 'fabric';

interface TextBackgroundColorProps {
  saveChanges: () => void;
}

export const TextBackgroundColorModal = ({
  saveChanges
}: TextBackgroundColorProps) => {
  const {
    isTextBackgroundColorModalOpen: isOpen,
    setIsTextBackgroundColorModalOpen: onClose,
    textBackgroundColor,
    canvasRef,
    setTextBackgroundColor
  } = useCanvasEditorStore();

  const [tempTextBackgroundColor, setTempTextBackgroundColor] =
    useState(textBackgroundColor);

  const updateTextBackgroundColor = (color: string) => {
    if (!canvasRef.current) return;

    const activeObjects =
      canvasRef.current.getActiveObjects() as FabricObject[];

    activeObjects.forEach((obj) => {
      if (obj.type === 'i-text') {
        const textObj = obj as FabricText;
        textObj.set('textBackgroundColor', color);
      }
    });

    canvasRef.current.renderAll();
  };

  useEffect(() => {
    if (isOpen) {
      updateTextBackgroundColor(tempTextBackgroundColor);
    }
  }, [tempTextBackgroundColor, isOpen]);

  return (
    <Drawer
      size="xs"
      placement="bottom"
      open={isOpen}
      onClose={() => onClose(false)}
      dialogClassName="bg-white relative rounded-2xl dark:bg-[#2a292a]"
      closeButton={false}
    >
      <div className="relative py-5">
        <Cross2Icon
          onClick={() => onClose(false)}
          className="absolute right-4 top-4 h-8 w-8 cursor-pointer"
        />
        <p className="text-center text-2xl">Cor de Fundo do Texto</p>
      </div>
      <div className="flex flex-col items-center px-8 pt-10">
        <HexColorPicker
          color={tempTextBackgroundColor}
          onChange={setTempTextBackgroundColor}
          onMouseUp={() => {
            setTextBackgroundColor(tempTextBackgroundColor);
            saveChanges();
          }}
        />
        <div className="mt-5 flex w-full justify-between">
          <button
            className="w-full rounded bg-red-500 px-4 py-2 text-white"
            onClick={() => {
              setTempTextBackgroundColor('');
              setTextBackgroundColor('');
              saveChanges();
            }}
          >
            Remover Cor de Fundo
          </button>
        </div>
      </div>
    </Drawer>
  );
};
