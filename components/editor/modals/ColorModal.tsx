/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Drawer } from 'rsuite';
import { Cross2Icon } from '@radix-ui/react-icons';
import { HexColorPicker } from 'react-colorful';
import { Object as FabricObject, IText as FabricText } from 'fabric';
import { useCanvasEditorStore } from '@/store/canvasEditorStore';
interface ColorModalProps {
  saveChanges: () => void;
}

export const ColorModal = ({ saveChanges }: ColorModalProps) => {
  const {
    isColorModalOpen: isOpen,
    setIsColorModalOpen: onClose,
    fontColor,
    canvasRef,
    setFontColor
  } = useCanvasEditorStore();
  const [tempColor, setTempColor] = useState(fontColor);

  const updateTextColor = (color: string) => {
    if (!canvasRef.current) return;

    const activeObjects =
      canvasRef.current.getActiveObjects() as FabricObject[];

    activeObjects.forEach((obj) => {
      if (obj.type === 'i-text') {
        const textObj = obj as FabricText;

        if (
          textObj.fill &&
          //@ts-ignore
          textObj.fill.type === 'linear' &&
          !isOpen
        ) {
          // Mantém gradiente
          textObj.set('fill', textObj.fill);
        } else if (color !== textObj.fill?.toString()) {
          textObj.set('fill', color);
        }
      }
    });

    canvasRef.current.renderAll();
  };

  useEffect(() => {
    if (isOpen) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const activeObject = canvas.getActiveObject() as FabricText;
      if (activeObject && activeObject.type === 'i-text' && activeObject.fill) {
        setTempColor(activeObject.fill.toString());
      } else {
        if (activeObject.fill) {
          setTempColor(fontColor);
        }
      }
    }
  }, [isOpen, canvasRef]);

  useEffect(() => {
    if (isOpen) {
      updateTextColor(tempColor);
    }
  }, [tempColor, isOpen]);

  useEffect(() => {
    return () => {
      setTempColor(fontColor);
    };
  }, [isOpen]);

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
          color={fontColor}
          onChange={(newColor) => setTempColor(newColor)}
          onMouseUp={() => {
            setFontColor(tempColor);
            saveChanges();
          }}
        />
      </div>
    </Drawer>
  );
};
