/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Drawer } from 'rsuite';
import { Slider } from '@/components/ui/slider';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useCanvasEditorStore } from '@/store/canvasEditorStore';
import { Object as FabricObject, IText as FabricText } from 'fabric';

interface RotationModalProps {
  saveChanges: () => void;
}

export const RotationModal = ({ saveChanges }: RotationModalProps) => {
  const {
    isRotationModalOpen: isOpen,
    setIsRotationModalOpen: onClose,
    rotation,
    canvasRef,
    setRotation,
    setRotationChanged
  } = useCanvasEditorStore();

  const [tempRotation, setTempRotation] = useState(rotation);

  const updateRotation = (angle: number) => {
    if (!canvasRef.current) return;

    const activeObjects =
      canvasRef.current.getActiveObjects() as FabricObject[];

    activeObjects.forEach((obj) => {
      if (obj.type === 'i-text') {
        const textObj = obj as FabricText;
        textObj.set('angle', angle);
      }
    });

    canvasRef.current.renderAll();
  };

  useEffect(() => {
    if (isOpen) {
      updateRotation(tempRotation);
    }
  }, [tempRotation, isOpen]);

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
        <p className="text-center text-2xl">Rotação</p>
      </div>
      <div className="px-8 pt-10">
        <label className="mb-2 block">Ângulo de Rotação:</label>
        <Slider
          value={[tempRotation]}
          min={0}
          max={360}
          step={1}
          onValueChange={(value) => setTempRotation(value[0])}
          onMouseUp={() => {
            setRotation(tempRotation);
            setRotationChanged(true);
            saveChanges();
          }}
        />
        <div className="mt-10 flex w-full justify-between">
          <button
            className="w-full rounded bg-red-500 px-4 py-2 text-white"
            onClick={() => {
              setRotationChanged(false);
              setRotation(0);
              saveChanges();
            }}
          >
            Remover rotação
          </button>
        </div>
      </div>
    </Drawer>
  );
};
