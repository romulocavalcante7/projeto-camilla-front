/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect } from 'react';
import {
  Canvas as FabricCanvas,
  IText as FabricText,
  Shadow as FabricShadow,
  Object as FabricObject,
  Gradient as FabricGradient,
  InteractiveFabricObject
} from 'fabric';
import 'react-toastify/dist/ReactToastify.css';
import Background from '@/app/assets/backgroundPng.png';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Copy, FolderHeart, Redo, Trash2, Undo } from 'lucide-react';
import ImageNext from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import { useCanvasHistoryStore } from '@/store/canvasHistoryStore';
import { FontModal } from '@/components/editor/modals/FontModal';
import { OpacityModal } from '@/components/editor/modals/OpacityModal';
import { ColorModal } from '@/components/editor/modals/ColorModal';
import { OutilineModal } from '@/components/editor/modals/OutlineModal';
import { ShadowModal } from '@/components/editor/modals/ShadowModal';
import { LetterSpacingModal } from '@/components/editor/modals/LetterSpacingModal';
import { SkewModal } from '@/components/editor/modals/SknewModal';
import { RotationModal } from '@/components/editor/modals/RotationModal';
import { LineHeightModal } from '@/components/editor/modals/LineHeightModal';
import { TextBackgroundColorModal } from '@/components/editor/modals/TextBackgroundColorModal';
import { TabBar } from '@/components/editor/TabBar';
import { copyImageToClipboard } from '@/utils/copyImageToClipboard';
import { IconModal } from '@/components/editor/modals/IconModal';
import { CurvedTextModal } from '@/components/editor/modals/CurvedTextModal';
import { UploadConfirmationModal } from '@/components/editor/modals/UploadConfirmationModal';
import { GradientModal } from '@/components/editor/modals/GradientModal';
import { useCanvasEditorStore } from '@/store/canvasEditorStore';

const TextEditor = () => {
  const {
    canvasRef,
    canvasElementRef,
    setIsUploadModalOpen,
    fontSize,
    setFontSize,
    fontColor,
    setFontColor,
    opacity,
    setOpacity,
    fontWeight,
    setFontWeight,
    fontStyle,
    setFontStyle,
    alignment,
    setAlignment,
    setLineHeight,
    setOutlineWidth,
    setOutlineColor,
    fontFamily,
    setFontFamily,
    setShadowColor,
    setShadowBlur,
    setShadowOffsetX,
    setShadowOffsetY,
    setLetterSpacing,
    setSkewX,
    setSkewY,
    setRotation,
    setTextBackgroundColor,
    setStartColor,
    setEndColor,
    setDirection,
    isAddingText,
    setIsAddingText,
    selectedObject,
    setSelectedObject,
    textDecoration,
    setTextDecoration
  } = useCanvasEditorStore();

  const router = useRouter();
  const canvasHeight = 560;
  const { history, redoStack, saveState, undo, redo } = useCanvasHistoryStore();

  const updateTextProperties = () => {
    if (!canvasRef.current) return;

    const activeObjects =
      canvasRef.current.getActiveObjects() as FabricObject[];

    activeObjects.forEach((obj) => {
      if (obj.type === 'i-text') {
        const textObj = obj as FabricText;
        const updatedProps: Partial<FabricText> = {};

        if (textObj.underline !== undefined) {
          updatedProps.underline = textObj.underline;
        }

        if (
          fontWeight !== null &&
          fontWeight !== undefined &&
          fontWeight !== '' &&
          fontWeight !== textObj.fontWeight
        ) {
          updatedProps.fontWeight = fontWeight;
        }

        if (
          fontStyle !== null &&
          fontStyle !== undefined &&
          fontStyle !== '' &&
          fontStyle !== textObj.fontStyle
        ) {
          updatedProps.fontStyle = fontStyle;
        }

        if (
          alignment !== null &&
          alignment !== undefined &&
          alignment !== '' &&
          alignment !== textObj.textAlign
        ) {
          updatedProps.textAlign = alignment;
        }
        textObj.set(updatedProps);
      }
    });

    canvasRef.current.renderAll();
    saveChanges();
  };

  useEffect(() => {
    const canvasElement = new FabricCanvas(
      canvasElementRef.current as HTMLCanvasElement,
      {
        controlsAboveOverlay: true,
        preserveObjectStacking: true
      }
    );
    canvasRef.current = canvasElement;

    InteractiveFabricObject.ownDefaults = {
      ...InteractiveFabricObject.ownDefaults,
      cornerStyle: 'circle',
      cornerColor: '#FFF',
      padding: 10,
      transparentCorners: false,
      borderScaleFactor: 1.5,
      cornerStrokeColor: '#3b82f6',
      borderColor: '#3b82f6',
      borderOpacityWhenMoving: 1
    };

    const updateCanvasSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight - 180;
      canvasElement.setWidth(width);
      canvasElement.setHeight(height);
    };

    updateCanvasSize();

    canvasElement.renderAll();
    saveState(canvasElement.toJSON());

    canvasElement.on('object:modified', saveChanges); // Modificações gerais
    canvasElement.on('object:added', saveChanges); // Adicionar objeto
    canvasElement.on('object:removed', saveChanges); // Remover objeto

    const text = new FabricText('Clique aqui para editar', {
      fontSize,
      fill: fontColor,
      opacity,
      textAlign: alignment,
      fontFamily,
      originX: 'center',
      originY: 'center',
      left: canvasElement.width! / 2,
      top: canvasHeight / 2,
      strokeWidth: 0
    });
    canvasElement.add(text);

    const handleSelection = (e: any) => {
      const selected = e.selected as FabricObject[];
      setSelectedObject(selected);

      if (selected.length === 1 && selected[0].type === 'i-text') {
        const textObj = selected[0] as FabricText;

        setFontFamily(textObj.fontFamily);
        setFontSize(textObj.fontSize || 24);
        setFontColor(textObj.fill?.toString() || '#fff');
        setOpacity(textObj.opacity || 1);
        setTextBackgroundColor(textObj.textBackgroundColor || '');
        setFontWeight(textObj.fontWeight.toString() || 'normal');
        setFontStyle(textObj.fontStyle || 'normal');
        setLineHeight(textObj.lineHeight || 1.16);
        setTextDecoration(
          [
            textObj.underline ? 'underline' : '',
            textObj.linethrough ? 'line-through' : '',
            textObj.overline ? 'overline' : ''
          ].filter(Boolean)
        );
        setAlignment(textObj.textAlign || 'center');
        setOutlineColor(textObj.stroke?.toString() || '#fff');
        setOutlineWidth(textObj.strokeWidth || 0);
        setShadowColor(textObj.shadow?.color?.toString() || '#000000');
        setShadowBlur(textObj.shadow?.blur || 0);
        setShadowOffsetX(textObj.shadow?.offsetX || 0);
        setShadowOffsetY(textObj.shadow?.offsetY || 0);
        setLetterSpacing(textObj.charSpacing || 0);
        setSkewX(textObj.skewX || 0);
        setSkewY(textObj.skewY || 0);
        setRotation(textObj.angle || 0);

        //@ts-ignore
        if (textObj.fill && textObj.fill.type === 'linear') {
          //@ts-ignore
          const gradient = textObj.fill as FabricGradient;

          setStartColor(gradient.colorStops[0].color);
          setEndColor(gradient.colorStops[1].color);

          const dx = gradient.coords.x2 - gradient.coords.x1;
          const dy = gradient.coords.y2 - gradient.coords.y1;
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          setDirection(angle);
        }
      }
    };

    canvasElement.on('selection:created', handleSelection);
    canvasElement.on('selection:updated', handleSelection);

    canvasElement.on('selection:cleared', () => {
      setSelectedObject(null);
    });

    window.addEventListener('resize', updateCanvasSize);

    return () => {
      canvasElement.dispose();
      window.removeEventListener('resize', updateCanvasSize);
      canvasElement?.off('object:modified', saveChanges);
      canvasElement?.off('object:added', saveChanges);
      canvasElement?.off('object:removed', saveChanges);
      canvasElement.off('selection:created', handleSelection);
      canvasElement.off('selection:updated', handleSelection);
      canvasElement.off('selection:cleared');
    };
  }, []);

  useEffect(() => {
    const handleMouseDown = (event: any) => {
      if (isAddingText) {
        const pointer = canvasRef.current?.getPointer(event.e);

        const newShadow = new FabricShadow({
          color: '#000',
          blur: 0,
          offsetX: 0,
          offsetY: 0
        });

        const text = new FabricText('Novo Texto', {
          left: pointer?.x,
          top: pointer?.y,
          fontSize: 24,
          fill: '#ffffff',
          originX: 'center',
          originY: 'center',
          strokeWidth: 0,
          shadow: newShadow
        });
        canvasRef.current?.add(text);
        canvasRef.current?.setActiveObject(text);
        canvasRef.current?.renderAll();
        resetTextProperties();
        setIsAddingText(false);
      }
    };

    if (canvasRef.current && isAddingText) {
      canvasRef.current.on('mouse:down', handleMouseDown);
    }

    return () => {
      if (canvasRef.current) {
        canvasRef.current.off('mouse:down', handleMouseDown);
      }
    };
  }, [isAddingText]);

  useEffect(() => {
    updateTextProperties();
  }, [fontWeight, fontStyle, textDecoration, alignment]);

  const saveChanges = () => {
    const { isUndoingOrRedoing } = useCanvasHistoryStore.getState();
    if (!canvasRef.current) return;
    if (!isUndoingOrRedoing) {
      saveState(canvasRef.current.toJSON());
    }
  };

  const resetTextProperties = () => {
    setFontFamily('Arial');
    setFontSize(24);
    setFontColor('#fff');
    setFontWeight('normal');
    setFontStyle('normal');
    setTextDecoration([]);
    setOpacity(1);
    setAlignment('center');
    setLineHeight(1.16);
    setOutlineWidth(0);
    setOutlineColor('#fff');
    setShadowColor('#000000');
    setShadowBlur(0);
    setShadowOffsetX(0);
    setShadowOffsetY(0);
    setLetterSpacing(0);
    setSkewX(0);
    setSkewY(0);
    setRotation(0);
    setTextBackgroundColor('');
    setStartColor('');
    setEndColor('');
    setDirection(0);
  };

  const deleteSelectedObject = () => {
    if (canvasRef.current && selectedObject) {
      selectedObject.forEach((object) => {
        canvasRef.current!.remove(object);
      });
      canvasRef.current.discardActiveObject();
      canvasRef.current.renderAll();
      setSelectedObject(null);
      saveChanges();
    }
  };

  const handleCopyCanvas = async () => {
    if (canvasElementRef.current) {
      const activeObject = canvasRef.current?.getActiveObject();
      let dataURL;

      if (activeObject) {
        dataURL = activeObject.toDataURL({
          format: 'png',
          multiplier: 5
        });
      } else {
        dataURL = canvasRef.current?.toDataURL({
          format: 'png',
          multiplier: 5
        });
      }

      copyImageToClipboard(
        dataURL,
        () => {
          toast.success('Figurinha copiada com sucesso!', {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: 'light'
          });
        },
        (error: { message: string }) => {
          alert('Erro ao copiar a figurinha: ' + error.message);
        }
      );
    }
  };

  const handleUndo = () => {
    if (canvasRef.current && history.length > 1) {
      undo(canvasRef.current);
    }
  };

  const handleRedo = () => {
    if (canvasRef.current && redoStack.length > 0) {
      redo(canvasRef.current);
    }
  };

  const handleUploadStickerByUser = () => {
    setIsUploadModalOpen(true);
  };

  return (
    <div className="flex flex-col items-center px-5 pb-5 pt-3">
      <ToastContainer />
      <div className="flex w-full items-center justify-between pb-4">
        <ArrowLeft
          className="cursor-pointer"
          size={30}
          onClick={() => router.back()}
        />
        <p className="flex flex-1 items-center justify-center text-center">
          Crie sua figurinha
        </p>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <FolderHeart
              className="cursor-pointer"
              onClick={handleUploadStickerByUser}
              size={24}
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <Copy
              className="cursor-pointer"
              onClick={handleCopyCanvas}
              size={23}
            />
          </div>
        </div>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="absolute top-[12px] z-10 mx-auto flex w-full max-w-[370px] items-center justify-between rounded-xl border border-white/20 bg-white px-3 py-2 sm:max-w-3xl lg:max-w-7xl dark:bg-[#2E2B2B]">
          <div className="flex items-center gap-5">
            <button
              onClick={handleUndo}
              disabled={history.length <= 1}
              className={`${
                history.length <= 1
                  ? 'cursor-not-allowed text-gray-400'
                  : 'cursor-pointer'
              }`}
            >
              <Undo size={30} />
            </button>
            <button
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              className={`${
                redoStack.length === 0
                  ? 'cursor-not-allowed text-gray-400'
                  : 'cursor-pointer'
              }`}
            >
              <Redo size={30} />
            </button>
          </div>

          {selectedObject && (
            <Trash2
              className="cursor-pointer"
              size={25}
              onClick={deleteSelectedObject}
            />
          )}
        </div>
        <div className="- absolute left-0 top-0 bg-black opacity-60" />
        <ImageNext
          src={Background}
          alt="Fundo"
          layout="fill"
          objectFit="cover"
          className="absolute left-0 top-0 opacity-60"
        />
        <canvas
          ref={canvasElementRef}
          className="relative cursor-crosshair rounded-xl"
        />
      </div>

      <UploadConfirmationModal />

      <TabBar />

      <ColorModal saveChanges={saveChanges} />

      <CurvedTextModal saveChanges={saveChanges} />

      <FontModal saveChanges={saveChanges} />

      <IconModal />

      <OpacityModal saveChanges={saveChanges} />

      <GradientModal saveChanges={saveChanges} />

      <OutilineModal saveChanges={saveChanges} />

      <ShadowModal saveChanges={saveChanges} />

      <LetterSpacingModal saveChanges={saveChanges} />

      <SkewModal saveChanges={saveChanges} />

      <RotationModal saveChanges={saveChanges} />

      <LineHeightModal saveChanges={saveChanges} />

      <TextBackgroundColorModal saveChanges={saveChanges} />
    </div>
  );
};

export default TextEditor;
