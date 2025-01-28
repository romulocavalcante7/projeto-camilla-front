/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import {
  ReactCompareSlider,
  ReactCompareSliderImage
} from 'react-compare-slider';
import React, { useEffect, useState } from 'react';
import {
  Canvas as FabricCanvas,
  Object as FabricObject,
  Image as FabricImage,
  InteractiveFabricObject,
  Point,
  TEvent
} from 'fabric';

import 'react-toastify/dist/ReactToastify.css';
import Background from '@/app/assets/perfil.jpg';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, Redo, Trash2, Undo } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import { useCanvasHistoryStore } from '@/store/canvasHistoryStore';
import { OpacityModal } from '@/components/editor/modals/OpacityModal';
import { ColorModal } from '@/components/editor/modals/ColorModal';
import { TabBar } from '@/components/editor/TabBar';
import { copyImageToClipboard } from '@/utils/copyImageToClipboard';
import { EyelashModal } from '@/components/editor/modals/IconModal';
import { useCanvasEditorStore } from '@/store/canvasEditorStore';
import { SaturationTemperatureModal } from '@/components/editor/modals/SaturationTemperatureModal';
import { Modal } from '@/components/ui/modal';
import { FichaModal } from '@/components/editor/modals/Ficha';

const TextEditor = () => {
  const { canvasRef, canvasElementRef, selectedObject, setSelectedObject } =
    useCanvasEditorStore();

  const router = useRouter();
  // const canvasHeight = 560;
  const { history, redoStack, saveState, undo, redo } = useCanvasHistoryStore();
  const [isZoomEnabled, setIsZoomEnabled] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [imageOriginal, setImageOriginal] = useState<string | null>(null);

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
      cornerSize: 20,
      transparentCorners: false,
      borderScaleFactor: 1.5,
      cornerStrokeColor: '#000',
      borderColor: '#000',
      borderOpacityWhenMoving: 1
    };

    const updateCanvasSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight - 180;
      canvasElement.setWidth(width);
      canvasElement.setHeight(height);
    };

    updateCanvasSize();

    const imgElement = new Image();
    imgElement.crossOrigin = 'anonymous';
    imgElement.src = Background.src;
    imgElement.onload = () => {
      const fabricImg = new FabricImage(imgElement, {
        left: canvasElement.width! / 2,
        top: canvasElement.height! / 2,
        originX: 'center',
        originY: 'center'
      });
      setImageOriginal(Background.src);
      const scaleX = canvasElement.width! / fabricImg.width!;
      const scaleY = canvasElement.height! / fabricImg.height!;
      const scale = Math.min(scaleX, scaleY);

      fabricImg.set({
        scaleX: scale,
        scaleY: scale,
        selectable: false,
        evented: false
      });

      canvasElement.backgroundImage = fabricImg;
      canvasElement.renderAll();
      saveState(canvasElement.toJSON());
    };

    canvasElement.renderAll();
    saveState(canvasElement.toJSON());

    canvasElement.on('object:modified', saveChanges); // Modificações gerais
    canvasElement.on('object:added', saveChanges); // Adicionar objeto
    canvasElement.on('object:removed', saveChanges); // Remover objeto

    const handleSelection = (e: any) => {
      const selected = e.selected as FabricObject[];
      setSelectedObject(selected);
      setIsZoomEnabled(false);
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
    if (!canvasRef.current) return;

    let isDragging = false;
    let lastPosX = 0;
    let lastPosY = 0;

    const startPan = (e: TEvent<Event>) => {
      isDragging = true;
      //@ts-ignore
      const pointer = canvasRef.current!.getPointer(e.e);
      lastPosX = pointer.x;
      lastPosY = pointer.y;
      canvasRef.current!.selection = false;
    };

    const pan = (e: TEvent<Event>) => {
      if (isDragging) {
        //@ts-ignore
        const pointer = canvasRef.current!.getPointer(e.e);
        const deltaX = pointer.x - lastPosX;
        const deltaY = pointer.y - lastPosY;
        canvasRef.current!.relativePan(new Point(deltaX, deltaY));
        lastPosX = pointer.x;
        lastPosY = pointer.y;
      }
    };

    const endPan = () => {
      isDragging = false;
      canvasRef.current!.selection = true;
    };

    if (isZoomEnabled) {
      canvasRef.current.on('mouse:down', startPan);
      canvasRef.current.on('mouse:move', pan);
      canvasRef.current.on('mouse:up', endPan);
    } else {
      canvasRef.current.off('mouse:down', startPan);
      canvasRef.current.off('mouse:move', pan);
      canvasRef.current.off('mouse:up', endPan);
      canvasRef.current.selection = true;
    }

    return () => {
      canvasRef.current?.off('mouse:down', startPan);
      canvasRef.current?.off('mouse:move', pan);
      canvasRef.current?.off('mouse:up', endPan);
    };
  }, [isZoomEnabled]);

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
        canvasRef.current!.setViewportTransform([1, 0, 0, 1, 0, 0]);
        dataURL = activeObject.toDataURL({
          format: 'png',
          multiplier: 5
        });
      } else {
        canvasRef.current!.setViewportTransform([1, 0, 0, 1, 0, 0]);
        dataURL = canvasRef.current?.toDataURL({
          format: 'png',
          multiplier: 5
        });
      }

      copyImageToClipboard(
        dataURL,
        () => {
          toast.success('Copiada com sucesso!', {
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
          alert('Erro ao copiar: ' + error.message);
        }
      );
    }
  };

  const downloadCanvas = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    // Salva o estado atual da transformação e reseta para salvar corretamente
    const currentTransform = canvas.viewportTransform;
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

    // Gera o Data URL da imagem
    const dataURL = canvas.toDataURL({
      format: 'png',
      multiplier: 5 // Ajuste para alta resolução
    });

    // Restaura a transformação original
    canvas.viewportTransform = currentTransform;

    // Cria um elemento <a> para download
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'canvas_image.png';
    link.click();
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
    setImageOriginal(imgElement.src);
    imgElement.onload = () => {
      const fabricImg = new FabricImage(imgElement, {
        left: canvas.width! / 2,
        top: canvas.height! / 2,
        originX: 'center',
        originY: 'center'
      });

      const scaleX = canvas.width! / fabricImg.width!;
      const scaleY = canvas.height! / fabricImg.height!;
      const scale = Math.min(scaleX, scaleY);

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

  const zoomCanvas = (factor: number, center?: { x: number; y: number }) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    // Define o ponto de zoom
    const zoomPoint = center || {
      x: canvas.width! / 2,
      y: canvas.height! / 2
    };

    // Calcula o novo nível de zoom
    const zoom = canvas.getZoom() * factor;

    // Limita o zoom entre 0.5x e 3x (ou ajustável)
    const clampedZoom = Math.min(Math.max(zoom, 0.5), 5);

    // Aplica o zoom no ponto especificado
    canvas.zoomToPoint(new Point(zoomPoint.x, zoomPoint.y), clampedZoom);
    canvas.renderAll();
  };

  const handleZoomClick = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
    factor: number
  ) => {
    if (!canvasRef.current || !isZoomEnabled) return;

    // Obtém a posição do clique do mouse no canvas
    const rect = canvasElementRef.current!.getBoundingClientRect();
    const pointer = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    zoomCanvas(factor, pointer);
  };

  const resetZoomAndPan = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]); // Reseta transformações
    canvas.renderAll();
    setIsZoomEnabled(false);
  };

  const openCompareModal = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;

      // Gera o Data URL da imagem editada (tamanho exato do canvas)
      const editedDataURL = canvas.toDataURL({
        format: 'png',
        multiplier: 1 // 1:1 sem escalonamento
      });

      // Atualiza o estado com a imagem editada
      setEditedImage(editedDataURL);
      setIsCompareModalOpen(true);
    }
  };

  const alignOriginalImageToCanvas = async (): Promise<void> => {
    if (canvasRef.current && imageOriginal) {
      const { width, height } = canvasRef.current;

      // Redimensiona a imagem original para coincidir com o canvas
      const resizedImage = await resizeImage(imageOriginal, width, height);
      setImageOriginal(resizedImage);
    }
  };

  const resizeImage = (
    imageSrc: string,
    targetWidth: number,
    targetHeight: number
  ): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = imageSrc;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
          resolve(canvas.toDataURL('image/png'));
        }
      };
    });
  };

  const closeCompareModal = () => {
    setIsCompareModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center bg-black pb-5 pt-3">
      <ToastContainer />
      <div className="justify-betweenp flex w-full items-center px-5 pb-2">
        <ArrowLeft
          className="cursor-pointer text-white"
          size={30}
          onClick={() => router.back()}
        />
        <p className="flex flex-1 items-center justify-center text-center text-lg text-white">
          Editar
        </p>
        <div className="flex gap-2">
          <button
            onClick={openCompareModal}
            className="flex items-center justify-center rounded-full bg-gray-500 p-2 text-white hover:bg-gray-600"
            title="Comparar imagens"
          >
            <Eye size={24} />
          </button>
          <button
            //@ts-ignore
            onClick={() => document.getElementById('imageInput').click()}
            className="cursor-pointer rounded px-4 py-2 text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-image-plus"
            >
              <path d="M16 5h6" />
              <path d="M19 2v6" />
              <path d="M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              <circle cx="9" cy="9" r="2" />
            </svg>
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
              <button
                onClick={downloadCanvas}
                className="cursor-pointer px-2 py-2 text-white"
                title="Download"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-download"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex max-w-xl items-center justify-center">
        <div className="absolute top-[12px] z-10 mx-auto flex w-full max-w-[370px] items-center justify-between rounded-xl border border-white/20 bg-black/60 px-3 py-2 backdrop-blur-[12px] sm:max-w-3xl lg:max-w-xl">
          <div className="flex items-center gap-5">
            <button
              onClick={handleUndo}
              disabled={history.length <= 1}
              className={`${
                history.length <= 1
                  ? 'cursor-not-allowed text-gray-400'
                  : 'cursor-pointer text-white'
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
                  : 'cursor-pointer text-white'
              }`}
            >
              <Redo size={30} />
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsZoomEnabled(!isZoomEnabled)}
                className={`cursor-pointer rounded px-2 py-2 ${
                  isZoomEnabled ? 'bg-white' : 'transparent'
                } text-white`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={isZoomEnabled ? '#000' : '#fff'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-scan-eye"
                >
                  <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                  <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                  <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                  <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                  <circle cx="12" cy="12" r="1" />
                  <path d="M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0" />
                </svg>
              </button>

              <button
                onClick={() => zoomCanvas(1.1)}
                className="cursor-pointer px-2 py-2 text-white"
                title="Zoom In"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-zoom-in"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" x2="16.65" y1="21" y2="16.65" />
                  <line x1="11" x2="11" y1="8" y2="14" />
                  <line x1="8" x2="14" y1="11" y2="11" />
                </svg>
              </button>

              <button
                onClick={() => zoomCanvas(0.9)}
                className="cursor-pointer px-2 py-2 text-white"
                title="Zoom Out"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-zoom-out"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" x2="16.65" y1="21" y2="16.65" />
                  <line x1="8" x2="14" y1="11" y2="11" />
                </svg>
              </button>

              <button
                onClick={resetZoomAndPan}
                className="cursor-pointer px-2 py-2 text-white"
                title="Reset View"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-rotate-ccw"
                >
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
              </button>
            </div>
          </div>

          {selectedObject && (
            <Trash2
              className="cursor-pointer text-white"
              size={25}
              onClick={deleteSelectedObject}
            />
          )}
        </div>
        <div className="- absolute left-0 top-0 " />
        {/* <ImageNext
          src={Background}
          alt="Fundo"
          layout="fill"
          objectFit="cover"
          className="absolute left-0 top-0"
        /> */}
        <canvas
          ref={canvasElementRef}
          onClick={(e) => {
            handleZoomClick(e, 1.1);
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            handleZoomClick(e, 0.9);
          }}
          className="relative mx-auto w-full max-w-xl cursor-crosshair rounded-xl"
        />
      </div>

      <TabBar />
      {isCompareModalOpen && (
        <Modal
          description=""
          isOpen={isCompareModalOpen}
          onClose={closeCompareModal}
          title="Comparar Imagens"
        >
          <div className="backdrop-blur-[20px]">
            <ReactCompareSlider
              itemOne={
                <ReactCompareSliderImage
                  src={imageOriginal || ''}
                  alt="Image one"
                />
              }
              itemTwo={
                <ReactCompareSliderImage
                  src={editedImage || ''}
                  alt="Image two"
                />
              }
            />
          </div>
        </Modal>
      )}
      <FichaModal saveChanges={saveChanges} />
      <ColorModal saveChanges={saveChanges} />
      <SaturationTemperatureModal saveChanges={saveChanges} />
      <EyelashModal />

      <OpacityModal saveChanges={saveChanges} />
    </div>
  );
};

export default TextEditor;
