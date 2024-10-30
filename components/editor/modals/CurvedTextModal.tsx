/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { Drawer } from 'rsuite';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Slider } from '@/components/ui/slider';
import { useCanvasEditorStore } from '@/store/canvasEditorStore';
import { useCanvasHistoryStore } from '@/store/canvasHistoryStore';
import { IText as FabricText, Object as FabricObject } from 'fabric';

interface CurvedTextModalProps {
  saveChanges: () => void;
}

export const CurvedTextModal = ({ saveChanges }: CurvedTextModalProps) => {
  const {
    isCurvedTextModalOpen: isOpen,
    setIsCurvedTextModalOpen: onClose,
    canvasRef,
    radius,
    startAngle,
    setRadius,
    setStartAngle,
    selectedText
  } = useCanvasEditorStore();

  const { toggleHistory } = useCanvasHistoryStore();

  // Desativa o histórico ao abrir o modal e ativa ao fechar
  useEffect(() => {
    if (isOpen) {
      toggleHistory(true);
    } else {
      toggleHistory(false);
    }
  }, [isOpen]);

  const updateCurvedText = () => {
    if (!canvasRef.current || !selectedText) return;

    const textObj = selectedText as FabricText;
    const chars = textObj.text?.replace(/\s+/g, '').split('') || [];
    const angleStep = 360 / chars.length;
    let currentAngle = startAngle;

    // Armazena o ID do texto curvado para identificar objetos anteriores
    //@ts-ignore
    if (!textObj.data) textObj.data = { id: Date.now() };
    //@ts-ignore
    const curvedTextId = textObj.data.id;
    const existingCurvedText = canvasRef.current.getObjects().filter((obj) => {
      const objWithData = obj as FabricObject & {
        data?: { parentId?: number };
      };
      return objWithData.data?.parentId === curvedTextId;
    });

    // Remove objetos curvados antigos e recria com novas configurações
    existingCurvedText.forEach((obj) => canvasRef.current?.remove(obj));
    canvasRef.current.remove(textObj);
    chars.forEach((char) => {
      const radians = (currentAngle * Math.PI) / 180;
      const x = textObj.left! + radius * Math.cos(radians);
      const y = textObj.top! + radius * Math.sin(radians);

      const charObj = new FabricText(char, {
        left: x,
        top: y,
        angle: currentAngle + 90,
        originX: 'center',
        originY: 'center',
        fontSize: textObj.fontSize,
        fill: textObj.fill,
        fontFamily: textObj.fontFamily,
        fontWeight: textObj.fontWeight,
        fontStyle: textObj.fontStyle,
        opacity: textObj.opacity,
        name: 'curved-text',
        data: { parentId: curvedTextId }
      });

      canvasRef.current!.add(charObj);
      currentAngle += angleStep;
    });

    canvasRef.current.renderAll();
  };

  // Atualiza o texto curvado ao modificar o raio ou o ângulo
  useEffect(() => {
    if (isOpen) {
      updateCurvedText();
      saveChanges(); // Atualiza o histórico ao modificar o texto curvado
    }
  }, [radius, startAngle, isOpen]);

  return (
    <Drawer
      size="xs"
      placement="bottom"
      open={isOpen}
      onClose={() => {
        onClose(false);
        toggleHistory(false);
        saveChanges();
      }}
      dialogClassName="bg-white relative rounded-2xl dark:bg-[#2a292a]"
      closeButton={false}
    >
      <div className="py-3">
        <Cross2Icon
          onClick={() => {
            onClose(false);
            toggleHistory(false);
            saveChanges();
          }}
          className="absolute right-4 top-4 h-6 w-6 cursor-pointer"
        />
        <p className="text-center text-2xl font-semibold">
          Ajustar texto curvado
        </p>
      </div>

      <div className="flex flex-col gap-5 p-4 pt-6">
        <div className="flex w-full flex-col gap-4">
          <p className="font-medium">Raio</p>
          <Slider
            value={[radius]}
            onValueChange={(value) => setRadius(value[0])}
            onMouseUp={() => {
              saveChanges();
            }}
            max={200}
            min={50}
            step={1}
          />
        </div>

        <div className="flex w-full flex-col gap-4">
          <p className="font-medium">Ângulo</p>
          <Slider
            value={[startAngle]}
            onValueChange={(value) => setStartAngle(value[0])}
            onMouseUp={() => {
              saveChanges();
            }}
            max={180}
            min={-180}
            step={1}
          />
        </div>
      </div>
    </Drawer>
  );
};
