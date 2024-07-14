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
import { deleteSubniche } from '@/services/subnicheService';
import { deleteFile } from '@/services/uploadService';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Subniche } from '@/services/subnicheService';

interface CellActionProps {
  data: Subniche;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    try {
      console.log('data', data);
      setLoading(true);
      if (data?.attachment?.id) {
        await deleteFile(data.attachment.id);
      }
      await deleteSubniche(data.id);
      toast.success('Subnicho deletado.');
      router.push(`/dashboard/subnicho`);
      window.location.reload();
    } catch (error: any) {
      console.log('error', error);
      toast.error(
        'Certifique-se de remover todos os produtos que usam este subnicho primeiro.'
      );
    } finally {
      setLoading(false);
      setOpen(false);
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
          <DropdownMenuLabel>Acões</DropdownMenuLabel>

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push(`/dashboard/subnicho/${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4 cursor-pointer" /> Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <Trash className=" mr-2 h-4 w-4" /> Deletar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
