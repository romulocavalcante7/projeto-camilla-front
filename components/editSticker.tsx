import { Sticker } from '@/services/stickerService';
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { toast } from 'react-toastify';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer';
import { Slider } from './ui/slider';
import { ClipboardPaste, CopyIcon, Loader2 } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { ClipboardContext } from '@/contexts/ClipboardContext';

const snapshotCreator = (canvasElement: HTMLCanvasElement) => {
  return new Promise<Blob>((resolve, reject) => {
    try {
      canvasElement.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Erro ao criar blob da imagem'));
        }
      }, 'image/png');
    } catch (error) {
      reject(error);
    }
  });
};

const copyImageToClipboard = async (
  canvasElement: HTMLCanvasElement,
  done: () => void,
  failed: (error: Error) => void
) => {
  try {
    const makeImagePromise = async () => {
      const blob = await snapshotCreator(canvasElement);
      //@ts-ignore
      return new Blob([blob], { type: 'image/png' });
    };
    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': makeImagePromise()
      })
    ]);
    done();
  } catch (err: any) {
    failed(err);
  }
};

interface EditStickerProps {
  isOpen: boolean;
  onConfirm: () => void;
  selectedStickerEdit: Sticker | null;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const EditSticker: React.FC<EditStickerProps> = ({
  isOpen,
  onConfirm,
  selectedStickerEdit,
  setIsModalOpen
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { clipboardHexColor, setClipboardHexColor } =
    useContext(ClipboardContext);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [hueRotation, setHueRotation] = useState<number>(0);
  const [shadowColor, setShadowColor] = useState<string>('#000000');
  const [shadowBlur, setShadowBlur] = useState<number>(10);
  const [shadowOffsetX, setShadowOffsetX] = useState<number>(8);
  const [shadowOffsetY, setShadowOffsetY] = useState<number>(8);
  const [isShadowEnabled, setIsShadowEnabled] = useState<boolean>(false);
  const [imageOpacity, setImageOpacity] = useState<number>(1.0);
  const [imageColor, setImageColor] = useState<string>('');
  const [isWhiteImage, setIsWhiteImage] = useState<boolean>(false);
  const [isColorPickerVisible, setIsColorPickerVisible] =
    useState<boolean>(false);
  const [loadingImage, setLoadingImage] = useState(true);

  useEffect(() => {
    if (isOpen && selectedStickerEdit) {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      const onLoad = () => {
        checkIfWhiteImage(img);
        setImage(img);
        setLoadingImage(false);
      };

      const onError = () => {
        console.error('Erro ao carregar a imagem.');
        setLoadingImage(false);
      };

      img.onload = onLoad;
      img.onerror = onError;

      img.src = selectedStickerEdit.attachment.url;

      return () => {
        img.onload = null;
        img.onerror = null;
      };
    } else {
      setLoadingImage(true);
    }
  }, [isOpen, selectedStickerEdit]);

  const checkIfWhiteImage = (img: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);

    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data;
    let whitePixelCount = 0;
    let nearWhitePixelCount = 0;
    let coloredPixelCount = 0;
    const totalPixels = img.width * img.height;
    const whiteThreshold = 240;
    const nearWhiteThreshold = 200;
    const colorThreshold = 50;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      if (r >= whiteThreshold && g >= whiteThreshold && b >= whiteThreshold) {
        whitePixelCount++;
      } else if (
        r >= nearWhiteThreshold &&
        g >= nearWhiteThreshold &&
        b >= nearWhiteThreshold
      ) {
        nearWhitePixelCount++;
      } else if (
        r > colorThreshold ||
        g > colorThreshold ||
        b > colorThreshold
      ) {
        coloredPixelCount++;
      }
    }

    const whitePixelRatio = whitePixelCount / totalPixels;
    const nearWhitePixelRatio = nearWhitePixelCount / totalPixels;
    const coloredPixelRatio = coloredPixelCount / totalPixels;

    setIsWhiteImage(
      (whitePixelRatio > 0.01 || nearWhitePixelRatio > 0.01) &&
        coloredPixelRatio < 0.01
    );
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !image || !ctx) return;

    const containerWidth = Math.min(window.innerWidth - 40, 270); // Ajustar o valor de 40 conforme necessário
    const scale = window.devicePixelRatio;
    canvas.width = containerWidth * scale;
    canvas.height = containerWidth * scale;
    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${containerWidth}px`;

    ctx.scale(scale, scale);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isShadowEnabled) {
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = shadowBlur;
      ctx.shadowOffsetX = shadowOffsetX;
      ctx.shadowOffsetY = shadowOffsetY;
    } else {
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    ctx.filter = `hue-rotate(${hueRotation}deg)`;
    ctx.globalAlpha = imageOpacity;

    ctx.drawImage(image, 0, 0, canvas.width / scale, canvas.height / scale);

    if (isWhiteImage && imageColor) {
      ctx.globalCompositeOperation = 'source-in';
      ctx.fillStyle = imageColor;
      ctx.fillRect(0, 0, canvas.width / scale, canvas.height / scale);
    }

    ctx.filter = 'none';
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = 'source-over';
  }, [
    image,
    shadowColor,
    shadowBlur,
    shadowOffsetX,
    shadowOffsetY,
    isShadowEnabled,
    imageOpacity,
    hueRotation,
    imageColor,
    isWhiteImage
  ]);

  useEffect(() => {
    if (!isOpen) {
      setImage(null);
      setHueRotation(0);
      setShadowColor('#000000');
      setShadowBlur(10);
      setShadowOffsetX(8);
      setShadowOffsetY(8);
      setIsShadowEnabled(false);
      setImageOpacity(1.0);
      setImageColor('');
      setIsWhiteImage(false);
      setIsColorPickerVisible(false);
    }
  }, [isOpen]);

  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    try {
      await copyImageToClipboard(
        canvasRef.current,
        () => {
          toast.success('Figurinha copiada com sucesso!', {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light'
          });
        },
        (error) => {
          console.error('Erro ao copiar a imagem:', error);
          toast.error('Erro ao copiar a imagem', {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light'
          });
        }
      );
    } catch (error) {
      console.error('Erro ao copiar a imagem:', error);
      toast.error('Erro ao copiar a imagem', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light'
      });
    }
  };

  const resetImageColor = () => {
    setImageColor('');
  };

  const handleCopyHexColor = async () => {
    if (!imageColor) return;
    try {
      setClipboardHexColor(imageColor);
      toast.success('Código de cor copiado com sucesso!', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light'
      });
    } catch (error) {
      console.error('Erro ao copiar o código de cor:', error);
      toast.error('Erro ao copiar o código de cor', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light'
      });
    }
  };

  const handlePasteHexColor = async () => {
    try {
      if (/^#[0-9A-F]{6}$/i.test(clipboardHexColor)) {
        setImageColor(clipboardHexColor);
      } else {
        throw new Error('Clipboard does not contain a valid hex color');
      }
    } catch (error) {
      console.error('Erro ao colar a cor:', error);
      toast.error('Erro ao colar a cor da área de transferência', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    }
  };

  return (
    <Drawer onOpenChange={setIsModalOpen} open={isOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-center text-2xl">Editar</DrawerTitle>
        </DrawerHeader>
        <div className="mb-5 flex max-h-[800px] flex-col items-center justify-center gap-5 overflow-y-auto text-center text-lg sm:flex-row sm:gap-16">
          <div className="relative">
            {!loadingImage && image ? (
              <>
                <div className="overflow-hidden rounded-2xl bg-[#3F3F3F]">
                  <canvas ref={canvasRef} width={100} height={100} />
                </div>
                <div
                  className="absolute bottom-0 left-1/2 flex w-fit -translate-x-1/2 transform cursor-pointer items-center gap-2 rounded-lg px-4 py-4"
                  onClick={() => handleCopyImage()}
                >
                  <CopyIcon className="h-8 w-16 text-white sm:h-10" />
                  <span className="text-xl font-normal text-white sm:text-2xl">
                    Copiar
                  </span>
                </div>
              </>
            ) : (
              <Loader2 className="my-4 h-8 w-8 animate-spin" />
            )}
          </div>
          <div className="mb-8 flex w-full flex-col items-center justify-center gap-5 sm:w-fit">
            <div className="flex w-full max-w-[280px] flex-col items-center gap-3">
              <label className="text-2xl font-semibold">Opacidade</label>
              <Slider
                value={[imageOpacity]}
                onValueChange={(value) => {
                  setImageOpacity(Number(value[0]));
                }}
                max={1}
                step={0.01}
              />
            </div>
            {/* <div className="flex w-full max-w-[280px] flex-col items-center gap-3">
              <label className="text-2xl font-semibold">Hue Rotation</label>
              <Slider
                value={[hueRotation]}
                onValueChange={(value) => {
                  setHueRotation(Number(value[0]));
                }}
                max={360}
                step={1}
              />
            </div>
            <div className="flex w-full max-w-[280px] flex-col items-center gap-3">
              <label className="text-2xl font-semibold">Cor da Sombra</label>
              <input
                type="color"
                value={shadowColor}
                onChange={(e) => setShadowColor(e.target.value)}
              />
            </div>
            <div className="flex w-full max-w-[280px] flex-col items-center gap-3">
              <label className="text-2xl font-semibold">Blur da Sombra</label>
              <Slider
                value={[shadowBlur]}
                onValueChange={(value) => setShadowBlur(Number(value[0]))}
                max={50}
                step={1}
              />
            </div>
            <div className="flex w-full max-w-[280px] flex-col items-center gap-3">
              <label className="text-2xl font-semibold">
                Offset X da Sombra
              </label>
              <Slider
                value={[shadowOffsetX]}
                onValueChange={(value) => setShadowOffsetX(Number(value[0]))}
                max={50}
                step={1}
              />
            </div>
            <div className="flex w-full max-w-[280px] flex-col items-center gap-3">
              <label className="text-2xl font-semibold">
                Offset Y da Sombra
              </label>
              <Slider
                value={[shadowOffsetY]}
                onValueChange={(value) => setShadowOffsetY(Number(value[0]))}
                max={50}
                step={1}
              />
            </div>
            <div className="flex w-full max-w-[280px] flex-col items-center gap-3">
              <label className="text-2xl font-semibold">Habilitar Sombra</label>
              <input
                type="checkbox"
                checked={isShadowEnabled}
                onChange={(e) => setIsShadowEnabled(e.target.checked)}
              />
            </div> */}
            {isWhiteImage && !loadingImage && (
              <div className="flex w-full max-w-[280px] flex-col items-center gap-3">
                <label className="text-2xl font-semibold">
                  Cor da figurinha
                </label>
                <div className="flex w-full gap-1">
                  <button
                    className="relative w-full rounded-md border-2 border-gray-300 px-2 py-1 text-center"
                    style={{ backgroundColor: imageColor }}
                    onClick={() =>
                      setIsColorPickerVisible(!isColorPickerVisible)
                    }
                  >
                    {imageColor || 'Selecione uma cor'}
                  </button>
                  <div className="flex flex-1 items-center gap-1">
                    {imageColor && (
                      <div
                        onClick={handleCopyHexColor}
                        className="flex h-full items-center justify-center rounded-md bg-purple-500 px-2"
                      >
                        <CopyIcon color="#fff" size={20} />
                      </div>
                    )}
                    {clipboardHexColor && (
                      <div
                        onClick={handlePasteHexColor}
                        className="flex h-full w-full flex-1 items-center justify-center rounded-md bg-purple-500 px-2"
                      >
                        <ClipboardPaste color="#fff" size={20} />
                      </div>
                    )}
                  </div>
                </div>

                {isColorPickerVisible && (
                  <HexColorPicker color={imageColor} onChange={setImageColor} />
                )}
                {imageColor && (
                  <button
                    className="mt-2 w-full rounded-md border-2 border-gray-300 px-2 py-1 text-center"
                    onClick={resetImageColor}
                  >
                    Resetar Cor
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
