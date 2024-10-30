'use client';

import { useEffect, useRef, useState } from 'react';
import { CopyIcon, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Sticker } from '@/services/userStickerService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { cn } from '@/lib/utils';
import { fadeIn } from '@/lib/variants';
import { motion } from 'framer-motion';
import { copyImageToClipboard } from '@/utils/copyImageToClipboard';
import { DeleteStickerUserModal } from './editor/modals/DeleteStickerUserModal';
import { EditStickerUser } from './editStickerUser';

interface StickerProps {
  stickers: Sticker[];
}

const UserClipboard = ({ stickers }: StickerProps) => {
  const [copiedImageURL, setCopiedImageURL] = useState('');
  const [isCopyingImage, setIsCopyingImage] = useState<{
    [key: number]: boolean;
  }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [stickerList, setStickerList] = useState<Sticker[]>([]);
  const [stickerId, setStickerId] = useState<string | null>(null);
  const [selectedStickerEdit, setSelectedStickerEdit] =
    useState<Sticker | null>(null);

  const handleCopyImage = async (index: number) => {
    setIsCopyingImage((prev) => ({ ...prev, [index]: true }));
    const imgElement = imageRefs.current[index];
    imgElement?.src;
    if (imgElement) {
      copyImageToClipboard(
        imgElement?.src,
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

  useEffect(() => {
    setStickerList(stickers);
  }, [stickers]);

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

  const confirmRemoveFavoriteSticker = (stickerId: string) => {
    setStickerId(stickerId);
    setIsModalOpen(true);
  };

  const handleTransformDataTransferIntoURL = (
    dataTransfer: DataTransfer
  ): string => {
    //@ts-ignore
    const [firstItem] = dataTransfer.items;
    const blob = firstItem.getAsFile();
    return URL.createObjectURL(blob);
  };

  const removeStickerFromList = (stickerId: string) => {
    setStickerList((prevStickers) =>
      prevStickers.filter((sticker) => sticker.id !== stickerId)
    );
  };

  return (
    <motion.div
      initial={'hidden'}
      whileInView={'show'}
      viewport={{ once: true }}
      variants={fadeIn('up', 0.3)}
      className={cn(
        'grid w-full grid-cols-2 gap-5 sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] sm:gap-10',
        stickers.length === 1 && 'w-fit self-start'
      )}
    >
      {stickerList.map((sticker, index) => (
        <motion.div
          // initial={'hidden'}
          // whileInView={'show'}
          // viewport={{ once: true }}
          // variants={fadeIn('up', -0.3)}
          key={index}
          className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-[#3F3F3F] text-2xl font-bold text-white"
          style={{ minHeight: '150px', minWidth: '150px' }}
        >
          <div className="relative w-full" style={{ paddingBottom: '100%' }}>
            <Image
              className="scale-115 absolute left-0 top-0 h-full w-full object-cover object-center"
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
              alt="Editar figurinha"
            />
          </div>

          <div className="absolute right-4 top-4 cursor-pointer transition-all">
            <Trash2
              size={20}
              onClick={() => confirmRemoveFavoriteSticker(sticker.id)}
            />
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
      {selectedStickerEdit && (
        <EditStickerUser
          isOpen={isModalEditOpen}
          //@ts-ignore
          selectedStickerEdit={selectedStickerEdit}
          onConfirm={() => {
            setIsModalEditOpen(false);
          }}
          setIsModalOpen={setIsModalEditOpen}
        />
      )}
      <ToastContainer />
      <DeleteStickerUserModal
        isOpen={isModalOpen}
        onClose={setIsModalOpen}
        stickerId={stickerId}
        onDeleteConfirmed={removeStickerFromList}
      />
    </motion.div>
  );
};

export default UserClipboard;
