/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect } from 'react';
import {
  Canvas as FabricCanvas,
  Object as FabricObject,
  Image as FabricImage,
  InteractiveFabricObject
} from 'fabric';
import 'react-toastify/dist/ReactToastify.css';
import Background from '@/app/assets/backgroundPng.png';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Copy, Redo, Trash2, Undo } from 'lucide-react';
import ImageNext from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import { useCanvasHistoryStore } from '@/store/canvasHistoryStore';
import { OpacityModal } from '@/components/editor/modals/OpacityModal';
import { ColorModal } from '@/components/editor/modals/ColorModal';
import { TabBar } from '@/components/editor/TabBar';
import { copyImageToClipboard } from '@/utils/copyImageToClipboard';
import { IconModal } from '@/components/editor/modals/IconModal';
import { useCanvasEditorStore } from '@/store/canvasEditorStore';
import { SaturationTemperatureModal } from '@/components/editor/modals/SaturationTemperatureModal';

const TextEditor = () => {
  const { canvasRef, canvasElementRef, selectedObject, setSelectedObject } =
    useCanvasEditorStore();

  const router = useRouter();
  // const canvasHeight = 560;
  const { history, redoStack, saveState, undo, redo } = useCanvasHistoryStore();

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

    const handleSelection = (e: any) => {
      const selected = e.selected as FabricObject[];
      setSelectedObject(selected);
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

  const saveChanges = () => {
    const { isUndoingOrRedoing } = useCanvasHistoryStore.getState();
    if (!canvasRef.current) return;
    if (!isUndoingOrRedoing) {
      saveState(canvasRef.current.toJSON());
    }
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

  const setCanvasBackground = (imageUrl: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imgElement = new Image();
    imgElement.crossOrigin = 'anonymous';
    imgElement.src = imageUrl;

    imgElement.onload = () => {
      const fabricImg = new FabricImage(imgElement, {
        left: canvas.width! / 2,
        top: canvas.height! / 2,
        originX: 'center',
        originY: 'center'
      });

      const scaleX = canvas.width! / fabricImg.width!;
      const scaleY = canvas.height! / fabricImg.height!;
      const scale = Math.max(scaleX, scaleY);

      fabricImg.set({
        scaleX: scale,
        scaleY: scale,
        selectable: false, // Tornar o fundo não interativo
        evented: false // Desativar eventos no fundo
      });

      canvas.backgroundImage = fabricImg;
      // canvas.setActiveObject(fabricImg);
      canvas.renderAll();
      saveState(canvas.toJSON());
    };
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCanvasBackground(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center pb-5 pt-3">
      <ToastContainer />
      <div className="flex w-full items-center justify-between pb-4">
        <ArrowLeft
          className="cursor-pointer"
          size={30}
          onClick={() => router.back()}
        />
        <p className="flex flex-1 items-center justify-center text-center">
          Editar
        </p>

        <button
          //@ts-ignore
          onClick={() => document.getElementById('imageInput').click()}
          className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white"
        >
          Inserir Imagem
        </button>
        <input
          type="file"
          id="imageInput"
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleImageUpload}
        />

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <Copy
              className="cursor-pointer"
              onClick={handleCopyCanvas}
              size={23}
            />
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex max-w-xl items-center justify-center">
        <div className="absolute top-[12px] z-10 mx-auto flex w-full max-w-[370px] items-center justify-between rounded-xl border border-white/20 bg-white px-3 py-2 sm:max-w-3xl lg:max-w-xl dark:bg-[#2E2B2B]">
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
        <div className="- absolute left-0 top-0 " />
        <ImageNext
          src={Background}
          alt="Fundo"
          layout="fill"
          objectFit="cover"
          className="absolute left-0 top-0"
        />
        <canvas
          ref={canvasElementRef}
          className="relative mx-auto w-full max-w-xl cursor-crosshair rounded-xl"
        />
      </div>

      <TabBar />

      <ColorModal saveChanges={saveChanges} />
      <SaturationTemperatureModal saveChanges={saveChanges} />
      <IconModal />

      <OpacityModal saveChanges={saveChanges} />
    </div>
  );
};

export default TextEditor;
