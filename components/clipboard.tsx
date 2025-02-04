'use client';

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { CopyIcon, Settings } from 'lucide-react';
import Image from 'next/image';
import { Sticker } from '@/services/stickerService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  addFavoriteSticker,
  removeFavoriteSticker
} from '@/services/favoriteSticker';
import { cn } from '@/lib/utils';
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle
} from '@/components/ui/credenza';
import { Button } from './ui/button';
import { fadeIn } from '@/lib/variants';
import { motion } from 'framer-motion';
import { EditSticker } from './editSticker';

interface StickerProps {
  stickers: Sticker[];
  isFavorite?: boolean;
  onFavoriteRemoved?: (stickerId: string) => void;
}

const snapshotCreator = (imgElement: any) => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Contexto do canvas não disponível');

      const scale = window.devicePixelRatio * 2;
      canvas.width = imgElement.width * scale;
      canvas.height = imgElement.height * scale;

      context.scale(scale, scale);
      context.drawImage(imgElement, 0, 0, imgElement.width, imgElement.height);

      canvas.toBlob((blob) => {
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
  imgElement: any,
  done: any,
  failed: any
) => {
  try {
    const makeImagePromise = async () => {
      const blob = await snapshotCreator(imgElement);
      //@ts-ignore
      return new Blob([blob], { type: 'image/png' });
    };

    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': makeImagePromise()
      })
    ]);
    done();
  } catch (err) {
    failed(err);
  }
};

const Clipboard = ({
  stickers,
  isFavorite,
  onFavoriteRemoved
}: StickerProps) => {
  const [copiedImageURL, setCopiedImageURL] = useState('');
  const [isCopyingImage, setIsCopyingImage] = useState<{
    [key: number]: boolean;
  }>({});
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const [favorites, setFavorites] = useState<{
    [key: string]: boolean;
  }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [selectedStickerEdit, setSelectedStickerEdit] =
    useState<Sticker | null>(null);
  const [stickerToRemove, setStickerToRemove] = useState<string | null>(null);

  useEffect(() => {
    const initialFavorites = stickers.reduce((acc, sticker) => {
      //@ts-ignore
      acc[sticker.id] = sticker.isFavorite;
      return acc;
    }, {});
    setFavorites(initialFavorites);
  }, [stickers]);

  const handleCopyImage = async (index: number) => {
    setIsCopyingImage((prev) => ({ ...prev, [index]: true }));
    const imgElement = imageRefs.current[index];
    if (imgElement) {
      copyImageToClipboard(
        imgElement,
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
          setIsCopyingImage((prev) => ({ ...prev, [index]: false }));
        },
        (error: { message: string }) => {
          alert('Erro ao copiar a imagem: ' + error.message);
          setIsCopyingImage((prev) => ({ ...prev, [index]: false }));
        }
      );
    }
  };

  const handleTransformDataTransferIntoURL = (
    dataTransfer: DataTransfer
  ): string => {
    //@ts-ignore
    const [firstItem] = dataTransfer.items;
    const blob = firstItem.getAsFile();
    return URL.createObjectURL(blob);
  };

  const confirmRemoveFavoriteSticker = (stickerId: string) => {
    setStickerToRemove(stickerId);
    setIsModalOpen(true);
  };

  const handleRemoveFavoriteSticker = async () => {
    if (stickerToRemove) {
      try {
        await removeFavoriteSticker(stickerToRemove);
        toast.success('Figurinha removida dos favoritos!', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light'
        });
        setFavorites((prev) => ({
          ...prev,
          [stickerToRemove]: false
        }));
        if (onFavoriteRemoved) {
          onFavoriteRemoved(stickerToRemove);
        }
      } catch (e: any) {
        if (e?.message) {
          alert(e.message);
        }
      } finally {
        setIsModalOpen(false);
        setStickerToRemove(null);
      }
    }
  };

  const handleFavoriteSticker = async (stickerId: string) => {
    try {
      if (favorites[stickerId]) {
        await removeFavoriteSticker(stickerId);
        toast.success('Figurinha removida dos favoritos!', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light'
        });
      } else {
        await addFavoriteSticker({ stickerId });
        toast.success('Figurinha adicionada aos favoritos!', {
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
      setFavorites((prev) => ({
        ...prev,
        [stickerId]: !prev[stickerId]
      }));
    } catch (e: any) {
      if (e?.message) {
        alert(e.message);
      }
    }
  };

  useEffect(() => {
    const handlePasteOnDocument = (e: ClipboardEvent) => {
      if (e.clipboardData) {
        const url = handleTransformDataTransferIntoURL(e.clipboardData);
        setCopiedImageURL(url);
      }
    };

    document.addEventListener('paste', handlePasteOnDocument);

    return () => {
      document.removeEventListener('paste', handlePasteOnDocument);
    };
  }, []);

  return (
    <div
      className={cn(
        'grid w-full grid-cols-2 gap-5 sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] sm:gap-10',
        stickers.length === 1 && 'w-fit self-start'
      )}
    >
      {stickers.map((sticker, index) => (
        <motion.div
          initial={'hidden'}
          whileInView={'show'}
          viewport={{ once: true }}
          variants={fadeIn('up', -0.3)}
          key={index}
          className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-[#3F3F3F] text-2xl font-bold text-white"
          style={{ minHeight: '150px', minWidth: '150px' }}
        >
          <div className="relative w-full" style={{ paddingBottom: '100%' }}>
            <Image
              className="scale-115 absolute left-0 top-0 w-full object-cover"
              ref={(el) => (imageRefs.current[index] = el)}
              width={600}
              height={600}
              quality={100}
              src={sticker.attachment.url}
              draggable={false}
              alt={sticker.name}
            />
          </div>
          <div
            onClick={() => {
              setSelectedStickerEdit(sticker);
              setIsModalEditOpen(true);
            }}
            className="absolute left-4 top-4 cursor-pointer transition-all"
          >
            <Image
              className="h-5 w-5 sm:h-6 sm:w-6"
              src="/icons/roda-de-cores.png"
              width={25}
              height={25}
              alt="color picker icone"
            />
          </div>

          <div className="absolute right-4 top-4 cursor-pointer transition-all">
            {isFavorite ? (
              <svg
                onClick={() => confirmRemoveFavoriteSticker(sticker.id)}
                width="25"
                height="21"
                viewBox="0 0 25 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  className="transition-all"
                  d="M18.4951 15.8562C15.7327 18.2276 12.9069 19.7723 12.5 19.9882C12.0931 19.7723 9.26728 18.2276 6.50488 15.8562C3.57328 13.3396 1.0003 10.1359 1 6.78343C1.00191 5.25666 1.62131 3.78882 2.72901 2.70302C3.8374 1.61654 5.3443 1.00188 6.92021 1C8.94028 1.00016 10.6534 1.84727 11.7061 3.22167L12.5 4.25809L13.2939 3.22167C14.3466 1.84727 16.0597 1.00016 18.0798 1C19.6557 1.00188 21.1626 1.61654 22.271 2.70302C23.3788 3.78896 23.9982 5.25703 24 6.784C23.9994 10.1363 21.4266 13.3397 18.4951 15.8562Z"
                  fill="red"
                  stroke="red"
                  strokeWidth="2"
                />
              </svg>
            ) : (
              <svg
                onClick={() => handleFavoriteSticker(sticker.id)}
                width="25"
                height="21"
                viewBox="0 0 25 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  className="transition-all"
                  d="M18.4951 15.8562C15.7327 18.2276 12.9069 19.7723 12.5 19.9882C12.0931 19.7723 9.26728 18.2276 6.50488 15.8562C3.57328 13.3396 1.0003 10.1359 1 6.78343C1.00191 5.25666 1.62131 3.78882 2.72901 2.70302C3.8374 1.61654 5.3443 1.00188 6.92021 1C8.94028 1.00016 10.6534 1.84727 11.7061 3.22167L12.5 4.25809L13.2939 3.22167C14.3466 1.84727 16.0597 1.00016 18.0798 1C19.6557 1.00188 21.1626 1.61654 22.271 2.70302C23.3788 3.78896 23.9982 5.25703 24 6.784C23.9994 10.1363 21.4266 13.3397 18.4951 15.8562Z"
                  fill={favorites[sticker.id] ? 'red' : 'none'}
                  stroke={favorites[sticker.id] ? 'red' : '#fff'}
                  strokeWidth="2"
                />
              </svg>
            )}
          </div>

          <div
            className="absolute bottom-0 left-1/2 flex w-fit -translate-x-1/2 transform cursor-pointer items-center gap-2 rounded-lg px-4 py-4"
            onClick={() => handleCopyImage(index)}
          >
            <CopyIcon className="w-10 sm:h-10" />
            <span className="text-lg font-normal sm:text-2xl">Copiar</span>
          </div>
        </motion.div>
      ))}
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleRemoveFavoriteSticker}
        setIsModalOpen={setIsModalOpen}
      />
      <EditSticker
        isOpen={isModalEditOpen}
        selectedStickerEdit={selectedStickerEdit}
        onConfirm={handleRemoveFavoriteSticker}
        setIsModalOpen={setIsModalEditOpen}
      />
      <ToastContainer />
    </div>
  );
};

export default Clipboard;

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  setIsModalOpen
}) => {
  if (!isOpen) return null;

  return (
    <Credenza onOpenChange={setIsModalOpen} open={isOpen}>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle className="text-xl">Deseja remover?</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody className="mb-5 text-center text-lg">
          Ao deletar essa figurinha será removida dos favoritos
        </CredenzaBody>
        <CredenzaFooter className="gap-5">
          <Button
            onClick={onConfirm}
            variant="destructive"
            size="lg"
            className="text-xl"
          >
            Deletar
          </Button>
          <CredenzaClose asChild>
            <Button variant="outline" size="lg" className="text-xl">
              Fechar
            </Button>
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};
