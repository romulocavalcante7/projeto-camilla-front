'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Tutorial,
  deleteTutorial,
  markTutorialAsImportant,
  removeTutorialImportant
} from '@/services/tutorialServices';
import { deleteFile } from '@/services/uploadService';
import { Edit, MoreHorizontal, Star, StarOff, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import React from 'react';

interface CellActionProps {
  data: Tutorial;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    try {
      setLoading(true);
      if (data?.attachment?.id) {
        await deleteFile(data.attachment.id);
      }
      await deleteTutorial(data.id);
      toast.success('Tutorial deletado.');
      router.push(`/dashboard/tutorial`);
      window.location.reload();
    } catch (error: any) {
      console.log('error', error);
      toast.error(
        'Certifique-se de remover todas as dependências que usam este tutorial primeiro.'
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const markImportant = async () => {
    try {
      setLoading(true);
      await markTutorialAsImportant(data.id);
      toast.success('Tutorial marcado como importante.');
      window.location.reload();
    } catch (error: any) {
      console.log('error', error);
      toast.error('Ocorreu algum erro ao marcar como importante.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const handleRemoveImportant = async () => {
    try {
      await removeTutorialImportant(data.id);
      toast.success('Importância do tutorial removida.');
      window.location.reload();
    } catch (error) {
      console.error('Erro ao remover status importante do tutorial:', error);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              data.isImportant ? handleRemoveImportant() : markImportant();
            }}
          >
            {!data.isImportant ? (
              <>
                <Star className="mr-2 h-4 w-4 cursor-pointer" /> Marcar como
                Importante
              </>
            ) : (
              <>
                <StarOff className="mr-2 h-4 w-4 cursor-pointer" /> Remover
                Importância
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push(`/dashboard/tutorial/${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4 cursor-pointer" /> Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" /> Deletar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
