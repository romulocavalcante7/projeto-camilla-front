import { Drawer } from 'rsuite';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { uploadFile } from '@/services/uploadService';
import { createUserSticker } from '@/services/userStickerService';
import { useCanvasEditorStore } from '@/store/canvasEditorStore';
import { toast } from 'react-toastify';

export const UploadConfirmationModal = () => {
  const {
    canvasRef,
    isUploadModalOpen: isOpen,
    setIsUploadModalOpen: onClose,
    setIsUploadModalOpen,
    setIsUploading,
    isUploading
  } = useCanvasEditorStore();

  function dataURLToBlob(dataUrl: string) {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : '';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  const confirmUploadSticker = async () => {
    if (canvasRef.current) {
      const imageDataUrl = canvasRef.current?.toDataURL({
        format: 'png',
        multiplier: 2
      });
      const blob = dataURLToBlob(imageDataUrl);
      const file = new File([blob], 'sticker.png', { type: 'image/png' });

      try {
        setIsUploading(true);
        const uploadResponse = await uploadFile({
          file
        });
        const { id } = uploadResponse || {};

        await createUserSticker({
          attachmentId: id
        });

        toast.success('Figurinha salva com sucesso!', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: 'light'
        });
      } catch (error) {
        console.error('Error uploading sticker:', error);
        toast.error('Erro ao salvar figurinha', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: 'light'
        });
      } finally {
        setIsUploading(false);
        setIsUploadModalOpen(false);
      }
    }
  };

  return (
    <Drawer
      size={220}
      placement="bottom"
      open={isOpen}
      onClose={() => onClose(false)}
      dialogClassName="bg-white relative rounded-2xl dark:bg-[#2a292a]"
      closeButton={false}
    >
      <div className="py-5">
        <Cross2Icon
          onClick={() => onClose(false)}
          className="absolute right-4 top-4 h-8 w-8 cursor-pointer"
        />
        <p className="text-center text-2xl font-semibold">Confirmar</p>
      </div>
      <div className="overflow-y-auto p-4">
        <p className="mb-5 text-center text-xl">
          Deseja salvar essa figurinha?
        </p>
        <div className="flex justify-center gap-5">
          <Button
            onClick={confirmUploadSticker}
            variant="default"
            size="lg"
            className="bg-[#B743D0] text-xl hover:bg-[#b351c9]"
            disabled={isUploading}
          >
            {isUploading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {isUploading ? 'Criando...' : 'Confirmar'}
          </Button>
          <Button
            onClick={() => onClose(false)}
            variant="outline"
            size="lg"
            className="border-white/40 text-xl"
            disabled={isUploading}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </Drawer>
  );
};
