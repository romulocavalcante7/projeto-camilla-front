'use client';
import { useState } from 'react';
import { Drawer } from 'rsuite';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { deleteUserSticker } from '@/services/userStickerService';
import { Loader2 } from 'lucide-react';

interface DeleteStickerUserModalProps {
  isOpen: boolean;
  onClose: (value: boolean) => void;
  stickerId: string | null;
  onDeleteConfirmed: (stickerId: string) => void;
}

export const DeleteStickerUserModal = ({
  isOpen,
  onClose,
  stickerId,
  onDeleteConfirmed
}: DeleteStickerUserModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRemoveStickerUser = async (stickerId: string | null) => {
    if (!stickerId) return;
    setIsLoading(true);
    try {
      await deleteUserSticker(stickerId);
      onDeleteConfirmed(stickerId);
      onClose(false);
    } catch (error) {
      console.error('Erro ao deletar a figurinha:', error);
    } finally {
      setIsLoading(false);
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
        <p className="text-center text-2xl font-semibold">Deletar</p>
      </div>

      <div className="overflow-y-auto p-4">
        <p className="mb-5 text-center text-xl">
          Deseja remover essa figurinha?
        </p>
        <div className="flex justify-center gap-5">
          <Button
            onClick={() => handleRemoveStickerUser(stickerId)}
            variant="default"
            size="lg"
            className="bg-[#B743D0] text-xl hover:bg-[#b351c9]"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Deletando
              </span>
            ) : (
              'Deletar'
            )}
          </Button>

          <Button
            onClick={() => onClose(false)}
            variant="outline"
            size="lg"
            className="border-white/40 text-xl"
            disabled={isLoading}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </Drawer>
  );
};
