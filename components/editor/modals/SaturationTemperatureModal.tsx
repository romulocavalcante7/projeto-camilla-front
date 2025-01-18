import React, { useEffect, useState } from 'react';
import { Drawer } from 'rsuite';
import { Slider } from '@/components/ui/slider';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useCanvasEditorStore } from '@/store/canvasEditorStore';
import { FabricImage, filters } from 'fabric';

interface SaturationTemperatureModalProps {
  saveChanges: () => void;
}

export const SaturationTemperatureModal = ({
  saveChanges
}: SaturationTemperatureModalProps) => {
  const {
    canvasRef,
    isSaturationTemperatureModalOpen: isOpen,
    setIsSaturationTemperatureModalOpen: onClose
  } = useCanvasEditorStore();

  const [intensity, setIntensity] = useState(0.5);
  const [red, setRed] = useState(1.2);
  const [green, setGreen] = useState(0);
  const [blue, setBlue] = useState(0);

  const applyFilters = (
    intensity: number,
    red: number,
    green: number,
    blue: number
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const activeObjects = canvas.getActiveObjects();

    activeObjects.forEach((obj) => {
      if (obj && obj.type === 'image') {
        const image = obj as FabricImage;

        // Matriz ajustada para controle separado
        const brownMatrix = [
          red * (0.4 + 0.6 * intensity),
          green * 0.3 * intensity,
          blue * 0.1 * (1 - intensity),
          0,
          0,
          red * 0.3 * intensity,
          green * (0.4 + 0.5 * intensity),
          blue * 0.2 * (1 - intensity),
          0,
          0,
          red * 0.2 * (1 - intensity),
          green * 0.2 * (1 - intensity),
          blue * (0.3 + 0.7 * intensity),
          0,
          0,
          0,
          0,
          0,
          1,
          0
        ];

        const colorMatrixFilter = new filters.ColorMatrix({
          matrix: brownMatrix
        });

        // Substituir o filtro na imagem
        image.filters = [colorMatrixFilter];

        // Aplicar os filtros
        image.applyFilters?.();
        canvas.renderAll();
      }
    });
  };

  useEffect(() => {
    if (isOpen) {
      applyFilters(intensity, red, green, blue);
    }
  }, [intensity, red, green, blue, isOpen]);

  const handleClose = () => {
    onClose(false);
    saveChanges();
  };

  return (
    <Drawer
      size={220}
      placement="bottom"
      open={isOpen}
      onClose={handleClose}
      dialogClassName="relative rounded-2xl backdrop-blur-[20px] bg-[#000000c6]"
      closeButton={false}
    >
      <div className="py-5">
        <Cross2Icon
          onClick={handleClose}
          className="absolute right-4 top-4 h-8 w-8 cursor-pointer text-white"
        />
        <p className="text-center text-2xl font-semibold text-white">
          Efeito de tonalizadade
        </p>
      </div>

      <div className="max-h-[200px] overflow-y-auto p-4">
        {/* Intensidade */}
        <div className="mb-6 flex flex-col gap-4">
          <p className="text-center text-lg text-white">Intensidade Marrom</p>
          <Slider
            value={[intensity]}
            onValueChange={(value) => setIntensity(Number(value[0]))}
            min={0}
            max={10}
            step={0.01}
          />
        </div>
      </div>
    </Drawer>
  );
};
