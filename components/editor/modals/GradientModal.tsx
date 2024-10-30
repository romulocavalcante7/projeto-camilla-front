/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  Gradient as FabricGradient,
  Object as FabricObject,
  IText as FabricText
} from 'fabric';
import { Drawer } from 'rsuite';
import { Cross2Icon } from '@radix-ui/react-icons';
import { HexColorPicker } from 'react-colorful';
import { Slider } from '@/components/ui/slider';
import { useCanvasEditorStore } from '@/store/canvasEditorStore';
interface GradientModalProps {
  saveChanges: () => void;
}

export const GradientModal = ({ saveChanges }: GradientModalProps) => {
  const {
    canvasRef,
    isGradientModalOpen: isOpen,
    setIsGradientModalOpen: onClose,
    startColor,
    endColor,
    direction,
    setStartColor,
    setEndColor,
    setDirection
  } = useCanvasEditorStore();

  const [tempStartColor, setTempStartColor] = useState(startColor);
  const [tempEndColor, setTempEndColor] = useState(endColor);
  const [tempDirection, setTempDirection] = useState(direction);

  const updateGradient = (start: string, end: string, angle: number) => {
    if (!canvasRef.current) return;

    const activeObjects =
      canvasRef.current.getActiveObjects() as FabricObject[];

    activeObjects.forEach((obj) => {
      if (obj.type === 'i-text') {
        const textObj = obj as FabricText;

        if (!start && !end) {
          return textObj.set('fill', '#fff');
        }
        if (start && end) {
          const gradient = new FabricGradient({
            type: 'linear',
            gradientUnits: 'percentage',
            coords: {
              x1: 0,
              y1: 0,
              x2: Math.cos((angle * Math.PI) / 180),
              y2: Math.sin((angle * Math.PI) / 180)
            },
            colorStops: [
              { offset: 0, color: start },
              { offset: 1, color: end }
            ]
          });
          textObj.set('fill', gradient);
        }
      }
    });

    canvasRef?.current?.renderAll();
  };

  useEffect(() => {
    if (isOpen) {
      updateGradient(tempStartColor, tempEndColor, tempDirection);
    }
  }, [tempStartColor, tempEndColor, tempDirection]);

  return (
    <Drawer
      size={320}
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
        <p className="text-center text-2xl font-semibold">Ajustar Gradiente</p>
      </div>
      <div className="flex max-h-[240px] flex-col gap-4 overflow-y-auto px-4 pb-4">
        <div className="flex w-full items-center gap-5">
          <div className="w-1/2 text-center">
            <p className="mb-2">Cor Inicial</p>
            <HexColorPicker
              color={tempStartColor}
              onChange={setTempStartColor}
              onMouseUp={() => {
                setStartColor(tempStartColor);
                saveChanges();
              }}
            />
          </div>
          <div className="w-1/2 text-center">
            <p className="mb-2">Cor Final</p>
            <HexColorPicker
              color={tempEndColor}
              onChange={setTempEndColor}
              onMouseUp={() => {
                setEndColor(tempEndColor);
                saveChanges();
              }}
            />
          </div>
        </div>
        <div className="mt-4 text-center">
          <label className="mb-2 block text-sm">
            Direção: {tempDirection}°
          </label>
          <Slider
            value={[tempDirection]}
            onValueChange={(value) => setTempDirection(value[0])}
            onMouseUp={() => {
              setDirection(tempDirection);
              saveChanges();
            }}
            max={360}
            step={1}
          />
        </div>
        <div className="mt-5 flex w-full justify-between">
          <button
            className="w-full rounded bg-red-500 px-4 py-2 text-white"
            onClick={() => {
              setTempStartColor('');
              setTempEndColor('');
              setTempDirection(0);
              setStartColor('');
              setEndColor('');
              setDirection(0);
              updateGradient('', '', 0);
              saveChanges();
            }}
          >
            Remover Gradiente
          </button>
        </div>
      </div>
    </Drawer>
  );
};
