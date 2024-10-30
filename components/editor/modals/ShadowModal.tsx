import { Drawer } from 'rsuite';
import { Slider } from '@/components/ui/slider';
import { Cross2Icon } from '@radix-ui/react-icons';
import { HexColorPicker } from 'react-colorful';
import { useCanvasEditorStore } from '@/store/canvasEditorStore';
import { useRef } from 'react';

interface ShadowModalProps {
  saveChanges: () => void;
}

export const ShadowModal = ({ saveChanges }: ShadowModalProps) => {
  const {
    isShadowModalOpen: isOpen,
    setIsShadowModalOpen: onClose,
    shadowColor,
    shadowOffsetX,
    shadowOffsetY,
    shadowBlur,
    setShadowColor,
    setShadowOffsetX,
    setShadowOffsetY,
    setShadowBlur,
    canvasRef
  } = useCanvasEditorStore();

  const tempShadowColor = useRef(shadowColor);
  const tempShadowOffsetX = useRef(shadowOffsetX);
  const tempShadowOffsetY = useRef(shadowOffsetY);
  const tempShadowBlur = useRef(shadowBlur);

  const applyShadowProperties = () => {
    const activeObjects = canvasRef?.current?.getActiveObjects();
    if (!activeObjects) return;

    activeObjects.forEach((obj) => {
      if (obj.type === 'i-text') {
        const updatedShadow = {
          color: tempShadowColor.current,
          offsetX: tempShadowOffsetX.current,
          offsetY: tempShadowOffsetY.current,
          blur: tempShadowBlur.current
        };
        //@ts-ignore
        obj.set('shadow', updatedShadow);
      }
    });
    canvasRef.current?.renderAll();
  };

  return (
    <Drawer
      size="xs"
      placement="bottom"
      open={isOpen}
      onClose={() => {
        onClose(false);
        saveChanges(); // Salva mudanças ao fechar
      }}
      dialogClassName="bg-white relative rounded-2xl dark:bg-[#2a292a]"
      closeButton={false}
    >
      <div className="relative py-5">
        <Cross2Icon
          onClick={() => {
            onClose(false);
            saveChanges(); // Salva mudanças ao fechar
          }}
          className="absolute right-4 top-4 h-8 w-8 cursor-pointer"
        />
        <p className="text-center text-2xl">Ajustar Sombra</p>
      </div>
      <div className="max-h-full overflow-y-auto px-8 pb-32 pt-2">
        <label className="mb-2 block">Cor da Sombra:</label>
        <HexColorPicker
          color={shadowColor}
          onChange={(color) => {
            tempShadowColor.current = color;
            applyShadowProperties();
          }}
          onMouseUp={() => {
            setShadowColor(tempShadowColor.current);
            saveChanges();
          }}
        />
        <div className="mt-5">
          <label className="mb-2 block">Deslocamento X:</label>
          <Slider
            value={[shadowOffsetX]}
            min={-50}
            max={50}
            step={1}
            onValueChange={(value) => {
              tempShadowOffsetX.current = value[0];
              applyShadowProperties();
            }}
            onMouseUp={() => {
              setShadowOffsetX(tempShadowOffsetX.current);
              saveChanges();
            }}
          />
        </div>
        <div className="mt-5">
          <label className="mb-2 block">Deslocamento Y:</label>
          <Slider
            value={[shadowOffsetY]}
            min={-50}
            max={50}
            step={1}
            onValueChange={(value) => {
              tempShadowOffsetY.current = value[0];
              applyShadowProperties();
            }}
            onMouseUp={() => {
              setShadowOffsetY(tempShadowOffsetY.current);
              saveChanges();
            }}
          />
        </div>
        <div className="mt-5">
          <label className="mb-2 block">Desfoque:</label>
          <Slider
            value={[shadowBlur]}
            min={0}
            max={50}
            step={1}
            onValueChange={(value) => {
              tempShadowBlur.current = value[0];
              applyShadowProperties();
            }}
            onMouseUp={() => {
              setShadowBlur(tempShadowBlur.current);
              saveChanges();
            }}
          />
        </div>
        <div className="mt-5 flex w-full justify-between">
          <button
            className="w-full rounded bg-red-500 px-4 py-2 text-white"
            onClick={() => {
              setShadowColor('');
              setShadowOffsetX(0);
              setShadowOffsetY(0);
              setShadowBlur(0);
              tempShadowColor.current = '';
              tempShadowOffsetX.current = 0;
              tempShadowOffsetY.current = 0;
              tempShadowBlur.current = 0;
              applyShadowProperties();
              saveChanges();
            }}
          >
            Remover Sombra
          </button>
        </div>
      </div>
    </Drawer>
  );
};
