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

import { ArrowLeft, Redo, Trash2, Undo } from 'lucide-react';
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

    // const updateCanvasSize = () => {
    //   const screenWidth = window.innerWidth;

    //   const width = screenWidth > 700 ? 620 : 400;
    //   const height = window.innerHeight - 170;

    //   canvasElement.setWidth(width);
    //   canvasElement.setHeight(height);
    // };

    // updateCanvasSize();

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
      const imgRatio = fabricImg.width! / fabricImg.height!;
      const canvasRatio = canvasElement.width! / canvasElement.height!;
      let scaleX = canvasElement.width! / fabricImg.width!;
      let scaleY = canvasElement.height! / fabricImg.height!;

      // Mantém a proporção e cobre toda a tela sem distorcer
      const scale = imgRatio > canvasRatio ? scaleX : scaleY;
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

    // window.addEventListener('resize', updateCanvasSize);

    return () => {
      canvasElement.dispose();
      // window.removeEventListener('resize', updateCanvasSize);
      canvasElement?.off('object:modified', saveChanges);
      canvasElement?.off('object:added', saveChanges);
      canvasElement?.off('object:removed', saveChanges);
      canvasElement.off('selection:created', handleSelection);
      canvasElement.off('selection:updated', handleSelection);
      canvasElement.off('selection:cleared');
    };
  }, []);

  useEffect(() => {
    const updateCanvasSize = () => {
      if (!canvasRef.current || !canvasElementRef.current) return;

      const parentElement = canvasElementRef.current.parentElement;
      if (!parentElement) return;

      const width = parentElement.clientWidth;
      const height = parentElement.clientHeight;

      canvasRef.current.setWidth(width);
      canvasRef.current.setHeight(height);
      canvasRef.current.renderAll();
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
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

      const imgRatio = fabricImg.width! / fabricImg.height!;
      const canvasRatio = canvas.width! / canvas.height!;
      let scaleX = canvas.width! / fabricImg.width!;
      let scaleY = canvas.height! / fabricImg.height!;

      // Mantém a proporção e cobre toda a tela sem distorcer
      const scale = imgRatio > canvasRatio ? scaleX : scaleY;

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
      resetZoomAndPan();
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
    <div className="flex h-screen flex-col items-center bg-black/40 pb-5 pt-3 backdrop-blur-lg sm:bg-transparent">
      <ToastContainer />
      <div className="flex w-full items-center justify-between px-5 pb-2">
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
            className="flex items-center justify-center rounded-full  p-2 text-white hover:bg-gray-600"
            title="Comparar imagens"
          >
            {/* <Eye size={24} /> */}
            <svg
              width="26"
              height="26"
              viewBox="0 0 55 55"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M27.5 0.000899062C27.7904 -0.00984505 28.0915 0.0761078 28.3496 0.237269C28.5755 0.376943 28.8443 0.667034 28.9411 0.881916C29.081 1.16126 29.1347 1.53731 29.1347 2.99851L51.7736 3.05223L52.4189 3.31008C52.8921 3.50348 53.2577 3.76134 53.774 4.27706C54.2902 4.79277 54.5483 5.15807 55 6.27546V48.7147L54.7419 49.3593C54.5483 49.8321 54.2902 50.1974 53.774 50.7131C53.2577 51.2288 52.8921 51.4867 51.7736 51.9379L29.1347 51.9916V52.8512C29.1347 53.4528 29.081 53.8289 28.9411 54.1082C28.8443 54.3231 28.5755 54.6132 28.3496 54.7529C28.113 54.9033 27.7796 55 27.5215 55C27.2634 55 26.93 54.9033 26.6826 54.7529C26.4245 54.5917 26.2202 54.3446 26.0911 54.0545C25.919 53.6355 25.9083 52.8512 25.9083 32.2762L25.2845 32.0076C24.8758 31.8285 24.4385 31.5062 23.9724 31.0406C23.4992 30.5786 23.1766 30.1381 22.7356 29.1067H17.5733L18.9822 30.5249C20.1975 31.7497 20.4126 32.0183 20.4771 32.3836C20.5201 32.6845 20.4986 32.9423 20.3803 33.2109C20.2835 33.4366 20.0792 33.7374 19.9071 33.8878C19.7458 34.0382 19.4447 34.1887 19.2403 34.2209C19.036 34.2639 18.6918 34.2531 18.4875 34.2101C18.1756 34.1564 17.5948 33.63 15.2826 31.3307C13.7231 29.7836 12.3788 28.3868 12.2927 28.2149C12.2067 28.0538 12.1422 27.7314 12.1422 27.4951C12.1422 27.2587 12.2067 26.9364 12.2927 26.7645C12.3788 26.6033 13.7016 25.2388 15.2288 23.7239C16.756 22.209 18.1111 20.9089 18.2401 20.8445C18.3799 20.78 18.6703 20.7263 18.8854 20.7263C19.1113 20.7263 19.4662 20.8122 19.6705 20.9304C19.8964 21.0486 20.1437 21.3172 20.2943 21.5966C20.4986 21.9834 20.5309 22.1553 20.4771 22.5528C20.4018 22.9933 20.2728 23.1652 17.5733 25.8835H22.7356L23.0045 25.2603C23.1837 24.852 23.5064 24.4151 23.9724 23.9495C24.4349 23.4768 24.8758 23.1545 25.9083 22.7139V12.045C25.9083 2.13898 25.919 1.35466 26.0911 0.935637C26.2094 0.667034 26.4353 0.387687 26.6611 0.248014C26.8977 0.0975961 27.2096 0.000899062 27.4892 0.000899062H27.5ZM29.1455 22.6602C30.1887 23.1867 30.7479 23.5842 31.0598 23.8851C31.3932 24.1966 31.7912 24.7446 31.9955 25.1529L32.3719 25.8835H37.4804C35.0606 23.4445 34.738 23.047 34.6412 22.7139C34.5659 22.4131 34.5551 22.166 34.6304 21.9081C34.695 21.704 34.8455 21.4139 34.9853 21.285C35.1144 21.1453 35.351 20.9627 35.5123 20.8767C35.6844 20.7908 35.9855 20.7263 36.1899 20.7263C36.3942 20.7263 36.6953 20.7908 36.8567 20.8767C37.0287 20.9627 38.4269 22.3057 39.9756 23.8636C42.3416 26.238 42.8041 26.7537 42.8901 27.119C42.9654 27.4091 42.9654 27.667 42.8901 27.9248C42.8148 28.2042 42.0727 29.01 39.9756 31.1266C38.4269 32.6845 37.0287 34.0275 36.8567 34.1134C36.6953 34.1994 36.3942 34.2639 36.1899 34.2639C35.9855 34.2639 35.6844 34.1994 35.5123 34.1134C35.351 34.0275 35.1144 33.8448 34.9853 33.7052C34.8455 33.5762 34.695 33.2862 34.6304 33.082C34.5551 32.8242 34.5659 32.577 34.6412 32.2762C34.738 31.9431 35.0606 31.5456 36.1146 30.4712L37.4804 29.1067H32.3719C31.7051 30.3745 31.361 30.8365 30.9738 31.1803C30.6512 31.4704 30.1027 31.8572 29.7585 32.0183L29.1455 32.3299V48.7684L51.3219 48.7147L51.8381 48.1238V6.86639L51.3219 6.27546L29.1455 6.22174V22.6602ZM25.9513 26.6355C25.8115 26.8934 25.704 27.2802 25.704 27.4951C25.704 27.6992 25.8115 28.086 25.9513 28.3439C26.1234 28.6769 26.3277 28.8918 26.6719 29.0637C26.9623 29.2141 27.3387 29.3216 27.586 29.3216C27.8334 29.3216 28.2098 29.2034 28.4464 29.0745C28.683 28.9455 28.9734 28.6447 29.1132 28.4083C29.2745 28.129 29.3606 27.7959 29.3606 27.4951C29.3606 27.1942 29.2638 26.8504 29.124 26.5818C28.9627 26.2917 28.7153 26.0661 28.3926 25.9049C28.1345 25.776 27.7474 25.6686 27.5323 25.6686C27.3279 25.6686 26.9408 25.776 26.6719 25.9049C26.317 26.0876 26.1234 26.2702 25.9513 26.6355ZM4.01154 3.00925C4.22663 2.99851 4.61381 3.08446 4.86117 3.18116C5.10853 3.2886 5.38815 3.49273 5.4957 3.64315C5.60325 3.78283 5.72155 4.05143 5.76457 4.23408C5.80759 4.40598 5.80759 4.73905 5.76457 4.95393C5.7323 5.17956 5.57098 5.51263 5.40966 5.68453C5.24834 5.86718 4.96871 6.06058 4.78588 6.1143C4.61381 6.15727 4.28041 6.23248 4.06531 6.26472C3.77493 6.30769 3.60286 6.41513 3.4738 6.61927C3.377 6.78043 3.24795 7.13499 3.20493 7.40359C3.15115 7.66145 3.04361 7.99452 2.95757 8.12345C2.87153 8.26312 2.64568 8.46726 2.45209 8.58544C2.25851 8.70363 1.91435 8.80033 1.69926 8.80033C1.47341 8.80033 1.1185 8.71437 0.903402 8.60693C0.677552 8.51023 0.387172 8.24163 0.258115 8.01601C0.0967931 7.75815 0 7.44657 0 7.15648C0 6.90936 0.0752835 6.43662 0.172077 6.1143C0.26887 5.78123 0.505475 5.27626 0.699061 4.98617C0.881893 4.68533 1.25831 4.25557 1.51643 4.02994C1.77454 3.80431 2.17247 3.52497 2.39832 3.41753C2.61341 3.29934 2.97908 3.17041 3.20493 3.11669C3.42002 3.06297 3.78569 3.00925 4.01154 3.00925ZM1.74228 11.7227C2.21549 11.7442 2.41983 11.8087 2.63492 12.0236C2.79625 12.1632 2.98983 12.4211 3.07587 12.5823C3.18342 12.7971 3.22644 13.3343 3.23719 14.5699C3.23719 16.16 3.21568 16.289 2.98983 16.6328C2.86077 16.8369 2.61341 17.0948 2.44134 17.2237C2.24775 17.3741 1.97888 17.4493 1.6885 17.4386C1.44114 17.4386 1.07548 17.3419 0.860383 17.2237C0.656042 17.1055 0.376418 16.8369 0.236605 16.6328C0.0107548 16.289 0 16.16 0 14.5162C0 12.8938 0.0215096 12.7542 0.236605 12.4426C0.365663 12.2599 0.623778 12.0128 0.806609 11.8946C1.05397 11.7335 1.27982 11.6905 1.74228 11.7227ZM1.77454 20.3395C2.07567 20.361 2.44134 20.4792 2.58115 20.5866C2.73172 20.7048 2.93606 20.9627 3.04361 21.1561C3.21568 21.4784 3.23719 21.7685 3.20493 23.3049C3.17266 24.938 3.16191 25.0991 2.93606 25.4215C2.78549 25.6256 2.50587 25.8405 2.237 25.9479C1.92511 26.0661 1.63473 26.0983 1.34435 26.0446C1.03246 25.9909 0.795855 25.8405 0 25.0239V23.2512C0 21.5214 0.0107548 21.4676 0.279625 21.0594C0.430192 20.8337 0.709816 20.5651 0.903402 20.4684C1.14001 20.3395 1.39812 20.2965 1.77454 20.3395ZM1.61322 28.8918C1.76379 28.8918 2.09718 28.9993 2.36605 29.1282C2.65643 29.2786 2.91455 29.515 3.03285 29.7513C3.19417 30.0629 3.22644 30.3852 3.22644 31.7927C3.22644 33.1572 3.19417 33.5225 3.04361 33.8234C2.93606 34.0275 2.73172 34.2854 2.58115 34.3928C2.44134 34.5002 2.09718 34.6292 1.82831 34.6614C1.48416 34.7044 1.2368 34.6614 0.924912 34.5217C0.688307 34.4035 0.397927 34.1457 0.258115 33.9093C0.0215096 33.5333 0 33.4043 0 31.7927C0 30.1918 0.0215096 30.0414 0.24736 29.6976C0.376418 29.4827 0.677552 29.2249 0.914157 29.1067C1.15076 28.9885 1.47341 28.8918 1.61322 28.8918ZM1.69926 37.5945C2.16171 37.5945 2.32303 37.6483 2.60266 37.8846C2.78549 38.0458 3.00059 38.3144 3.08662 38.4756C3.18342 38.6904 3.22644 39.2491 3.22644 40.4417C3.22644 41.6558 3.19417 42.1823 3.07587 42.3972C2.98983 42.5583 2.79625 42.8162 2.63492 42.9666C2.41983 43.1707 2.21549 43.2352 1.74228 43.2674C1.26907 43.2889 1.05397 43.2459 0.7851 43.074C0.591514 42.9559 0.333399 42.698 0.215096 42.5046C0.0322644 42.193 0 41.9674 0 40.4095C0 38.7871 0.0215096 38.6475 0.236605 38.3359C0.365663 38.1532 0.623778 37.9061 0.806609 37.7987C1.02171 37.659 1.33359 37.5945 1.69926 37.5945ZM1.66699 46.1898C1.91435 46.1898 2.24775 46.2758 2.45209 46.4047C2.64568 46.5229 2.87153 46.727 2.95757 46.856C3.04361 46.9956 3.16191 47.3609 3.22644 47.694C3.29097 48.0163 3.38776 48.3279 3.43078 48.3924C3.48455 48.4461 3.66738 48.5535 3.82871 48.618C4.00078 48.6932 4.32343 48.7792 4.54928 48.8114C4.76437 48.8436 5.09777 49.0048 5.2806 49.1659C5.46343 49.3271 5.65702 49.6279 5.72155 49.8428C5.78608 50.047 5.81834 50.38 5.78608 50.5949C5.76457 50.7991 5.63551 51.1214 5.50645 51.3148C5.34872 51.5511 5.10136 51.7266 4.76437 51.8412C4.42022 51.963 4.08682 52.0024 3.76418 51.9594C3.50606 51.9272 3.0221 51.7983 2.6887 51.6801C2.33379 51.5404 1.84982 51.2288 1.47341 50.8957C1.01095 50.4767 0.731326 50.1007 0.451701 49.5205C0.161322 48.9403 0.0430192 48.5428 0.0107548 48.07C-0.0215096 47.5114 0.0107548 47.3609 0.26887 46.9849C0.430192 46.7485 0.709816 46.4692 0.903402 46.3725C1.08623 46.2758 1.43039 46.1898 1.66699 46.1898ZM11.7335 3.03074C13.1101 3.04148 13.4542 3.08446 13.6908 3.23488C13.8522 3.34232 14.0888 3.57869 14.2071 3.77208C14.3792 4.04068 14.4222 4.26631 14.3899 4.72831C14.3684 5.20105 14.3039 5.40519 14.0888 5.63081C13.949 5.79197 13.6908 5.98537 13.5295 6.07132C13.3144 6.17876 12.7874 6.22174 11.5614 6.22174C10.3676 6.22174 9.80837 6.17876 9.60403 6.07132C9.44271 5.99611 9.17384 5.77049 9.01252 5.58784C8.77591 5.31923 8.71138 5.14733 8.71138 4.71756C8.71138 4.41673 8.78666 4.04068 8.86195 3.87952C8.94799 3.71836 9.10931 3.50348 9.21686 3.39604C9.3244 3.29934 9.56101 3.17041 9.73309 3.10595C9.91592 3.05223 10.8086 3.01999 11.7335 3.03074ZM20.1975 2.99851C21.2192 2.99851 21.843 3.04148 22.0796 3.13818C22.2732 3.21339 22.5528 3.42827 22.7034 3.60018C22.8647 3.77208 23.0153 4.11589 23.0583 4.39524C23.1228 4.79277 23.0905 4.96468 22.8862 5.35147C22.7356 5.6523 22.499 5.89942 22.2624 6.02835C21.9505 6.18951 21.6279 6.22174 20.219 6.22174C18.8531 6.22174 18.4875 6.18951 18.1756 6.02835C17.9713 5.93165 17.6916 5.67379 17.5626 5.46965C17.4013 5.23328 17.3152 4.93245 17.3152 4.66384C17.3152 4.42747 17.4013 4.06217 17.5088 3.85803C17.6379 3.62166 17.8852 3.38529 18.1864 3.23488C18.6165 3.01999 18.8101 2.99851 20.1975 2.99851ZM11.5399 48.7684C12.7767 48.7684 13.3144 48.8006 13.5295 48.9188C13.6908 49.0048 13.949 49.1982 14.0888 49.3593C14.3039 49.5742 14.3684 49.7784 14.3899 50.2511C14.4222 50.7238 14.3792 50.9387 14.2071 51.2073C14.0888 51.4007 13.8522 51.6478 13.6908 51.7445C13.4435 51.9057 13.1316 51.9379 11.5614 51.9379C10.002 51.9379 9.67931 51.9057 9.43195 51.7445C9.27063 51.6478 9.04478 51.4007 8.92648 51.2073C8.79742 50.9817 8.71138 50.6701 8.71138 50.3263C8.71138 49.9503 8.77591 49.6924 8.92648 49.4775C9.04478 49.3056 9.30289 49.08 9.49648 48.9726C9.79761 48.7899 10.0772 48.7684 11.5399 48.7684ZM20.1652 48.7684C21.6279 48.7684 21.9505 48.7899 22.2624 48.9618C22.499 49.08 22.7356 49.3379 22.8862 49.6279C23.0905 50.0255 23.1228 50.1974 23.0583 50.5949C23.0153 50.8635 22.8647 51.2073 22.7034 51.39C22.5528 51.5619 22.2732 51.766 22.0796 51.8412C21.843 51.9379 21.2192 51.9916 20.1975 51.9916C18.8101 51.9916 18.6165 51.9702 18.1864 51.7445C17.8852 51.5941 17.6379 51.3685 17.5088 51.1321C17.4013 50.9172 17.3152 50.5627 17.3152 50.3263C17.3152 50.0792 17.412 49.7354 17.5303 49.542C17.6486 49.3486 17.9067 49.1015 18.1003 48.9833C18.4122 48.7899 18.6381 48.7684 20.1652 48.7684Z"
                fill="white"
              />
            </svg>
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

      <div className="relative flex h-full w-full flex-1 items-center justify-center">
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
          className="absolute left-0 top-0 h-full w-full cursor-crosshair rounded-xl"
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
          <div className="h-full backdrop-blur-[20px]">
            <ReactCompareSlider
              className="h-full"
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
