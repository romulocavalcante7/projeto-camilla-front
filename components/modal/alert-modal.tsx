'use client';

import { useEffect, useState } from 'react';

import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Você tem certeza?"
      description="Esta ação não poderá ser desfeita."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex w-full items-center justify-end space-x-2 pt-6">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          Continuar
        </Button>
      </div>
    </Modal>
  );
};
