/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Drawer } from 'rsuite';
import { Slider } from '@/components/ui/slider';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useCanvasEditorStore } from '@/store/canvasEditorStore';
import { Object as FabricObject, IText as FabricText } from 'fabric';

interface SkewModalProps {
  saveChanges: () => void;
}

export const SkewModal = ({ saveChanges }: SkewModalProps) => {
  const {
    isSkewModalOpen: isOpen,
    setIsSkewModalOpen: onClose,
    skewX,
    skewY,
    canvasRef,
    setSkewX,
    setSkewY
  } = useCanvasEditorStore();

  const [tempSkewX, setTempSkewX] = useState(skewX);
  const [tempSkewY, setTempSkewY] = useState(skewY);

  const updateSkew = (x: number, y: number) => {
    if (!canvasRef.current) return;

    const activeObjects =
      canvasRef.current.getActiveObjects() as FabricObject[];

    activeObjects.forEach((obj) => {
      if (obj.type === 'i-text') {
        const textObj = obj as FabricText;
        textObj.set('skewX', x);
        textObj.set('skewY', y);
      }
    });

    canvasRef.current.renderAll();
  };

  useEffect(() => {
    if (isOpen) {
      updateSkew(tempSkewX, tempSkewY);
    }
  }, [tempSkewX, tempSkewY, isOpen]);

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
        <p className="text-center text-2xl">Inclinação (Skew)</p>
      </div>
      <div className="px-8 pt-10">
        <label className="mb-2 block">Inclinação Horizontal (SkewX):</label>
        <Slider
          value={[tempSkewX]}
          min={-60}
          max={60}
          step={1}
          onValueChange={(value) => setTempSkewX(value[0])}
          onMouseUp={() => {
            setSkewX(tempSkewX);
            saveChanges();
          }}
        />
        <label className="mb-2 mt-4 block">Inclinação Vertical (SkewY):</label>
        <Slider
          value={[tempSkewY]}
          min={-60}
          max={60}
          step={1}
          onValueChange={(value) => setTempSkewY(value[0])}
          onMouseUp={() => {
            setSkewY(tempSkewY);
            saveChanges();
          }}
        />
      </div>
    </Drawer>
  );
};
