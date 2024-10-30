/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Drawer } from 'rsuite';
import { Slider } from '@/components/ui/slider';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useCanvasEditorStore } from '@/store/canvasEditorStore';
import { Object as FabricObject, IText as FabricText } from 'fabric';

interface LetterSpacingModalProps {
  saveChanges: () => void;
}

export const LetterSpacingModal = ({
  saveChanges
}: LetterSpacingModalProps) => {
  const {
    isLetterSpacingModalOpen: isOpen,
    setIsLetterSpacingModalOpen: onClose,
    letterSpacing,
    canvasRef,
    setLetterSpacing
  } = useCanvasEditorStore();

  const [tempLetterSpacing, setTempLetterSpacing] = useState(letterSpacing);

  const updateLetterSpacing = (spacing: number) => {
    if (!canvasRef.current) return;

    const activeObjects =
      canvasRef.current.getActiveObjects() as FabricObject[];

    activeObjects.forEach((obj) => {
      if (obj.type === 'i-text') {
        const textObj = obj as FabricText;
        textObj.set('charSpacing', spacing);
      }
    });

    canvasRef.current.renderAll();
  };

  useEffect(() => {
    if (isOpen) {
      updateLetterSpacing(tempLetterSpacing);
    }
  }, [tempLetterSpacing, isOpen]);

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
        <p className="text-center text-2xl">Espaçamento entre Letras</p>
      </div>
      <div className="px-8 pt-10">
        <label className="mb-2 block">Espaçamento:</label>
        <Slider
          value={[tempLetterSpacing]}
          min={-1000}
          max={1000}
          step={10}
          onValueChange={(value) => setTempLetterSpacing(value[0])}
          onMouseUp={() => {
            setLetterSpacing(tempLetterSpacing);
            saveChanges();
          }}
        />
      </div>
    </Drawer>
  );
};
