/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Drawer } from 'rsuite';
import { Slider } from '@/components/ui/slider';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useCanvasEditorStore } from '@/store/canvasEditorStore';
import { Object as FabricObject, IText as FabricText } from 'fabric';

interface LineHeightModalProps {
  saveChanges: () => void;
}

export const LineHeightModal = ({ saveChanges }: LineHeightModalProps) => {
  const {
    isLineHeightModalOpen: isOpen,
    setIsLineHeightModalOpen: onClose,
    lineHeight,
    canvasRef,
    setLineHeight
  } = useCanvasEditorStore();

  const [tempLineHeight, setTempLineHeight] = useState(lineHeight);

  const updateLineHeight = (height: number) => {
    if (!canvasRef.current) return;

    const activeObjects =
      canvasRef.current.getActiveObjects() as FabricObject[];

    activeObjects.forEach((obj) => {
      if (obj.type === 'i-text') {
        const textObj = obj as FabricText;
        textObj.set('lineHeight', height);
      }
    });

    canvasRef.current.renderAll();
  };

  useEffect(() => {
    if (isOpen) {
      updateLineHeight(tempLineHeight);
    }
  }, [tempLineHeight, isOpen]);

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
        <p className="text-center text-2xl">Altura da Linha</p>
      </div>
      <div className="px-8 pt-10">
        <label className="mb-2 block">Altura da Linha:</label>
        <Slider
          value={[tempLineHeight]}
          min={0.5}
          max={3}
          step={0.1}
          onValueChange={(value) => setTempLineHeight(value[0])}
          onMouseUp={() => {
            setLineHeight(tempLineHeight);
            saveChanges();
          }}
        />
      </div>
    </Drawer>
  );
};
