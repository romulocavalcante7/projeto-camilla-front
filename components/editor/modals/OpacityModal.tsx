/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Drawer } from 'rsuite';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Slider } from '@/components/ui/slider';
import { Object as FabricObject } from 'fabric';
import { useCanvasEditorStore } from '@/store/canvasEditorStore';

interface OpacityModalProps {
  saveChanges: () => void;
}

export const OpacityModal = ({ saveChanges }: OpacityModalProps) => {
  const {
    isOpacityModalOpen: isOpen,
    setIsOpacityModalOpen: onClose,
    opacity,
    setOpacity,
    canvasRef
  } = useCanvasEditorStore();
  const [tempOpacity, setTempOpacity] = useState(opacity);

  // Função para atualizar temporariamente a opacidade do texto no canvas
  const updateTextOpacity = (opacity: number) => {
    if (!canvasRef.current) return;

    const activeObjects =
      canvasRef.current.getActiveObjects() as FabricObject[];

    activeObjects.forEach((obj) => {
      if (obj.type === 'i-text' || obj.type === 'image') {
        obj.set('opacity', opacity);
      }
    });

    canvasRef.current.renderAll();
  };

  useEffect(() => {
    if (isOpen) {
      updateTextOpacity(tempOpacity);
    }
  }, [tempOpacity, isOpen]);

  return (
    <Drawer
      size={220}
      placement="bottom"
      open={isOpen}
      onClose={() => onClose(false)}
      dialogClassName="relative rounded-2xl backdrop-blur-[20px] bg-[#000000c6]"
      closeButton={false}
    >
      <div className="py-5">
        <Cross2Icon
          onClick={() => onClose(false)}
          className="absolute right-4 top-4  h-8 w-8 cursor-pointer text-white"
        />
        <p className="text-center text-2xl font-semibold text-white">
          Opacidade
        </p>
      </div>

      <div className="max-h-[240px] overflow-y-auto p-4 pt-20">
        <Slider
          value={[tempOpacity]}
          onValueChange={(value) => setTempOpacity(Number(value[0]))}
          max={1}
          step={0.01}
          onMouseUp={() => {
            setOpacity(tempOpacity);
            saveChanges();
          }}
        />
      </div>
    </Drawer>
  );
};
