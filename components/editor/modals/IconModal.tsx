import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Image as FabricImage } from 'fabric';
import { useCanvasEditorStore } from '@/store/canvasEditorStore';
import { useCanvasHistoryStore } from '@/store/canvasHistoryStore';
import { getAllCategories, Category } from '@/services/categoryService';
import {
  getStickersByCategoryId,
  Sticker,
  StickerResponse
} from '@/services/stickerService';
import ImageNext from 'next/image';
import { cn } from '@/lib/utils';

export const EyelashModal = () => {
  const {
    canvasRef,
    isIconModalOpen: isOpen,
    setIsIconModalOpen: onClose
  } = useCanvasEditorStore();
  const { saveState } = useCanvasHistoryStore();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [eyes, setEyes] = useState<Sticker[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getAllCategories(1, 10);
      setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEyes = async () => {
    if (!selectedCategoryId) return;
    setLoading(true);
    try {
      const data: StickerResponse = await getStickersByCategoryId(
        selectedCategoryId,
        1,
        10
      );
      setEyes(data.stickers);
    } catch (error) {
      console.error('Error fetching eyes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedCategoryId) {
      setSelectedCategoryId(null);
      fetchEyes();
      setIsSheetOpen(true);
    }
  }, [selectedCategoryId]);

  const handleIconSelect = async (icon: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imgElement = new Image();
    imgElement.crossOrigin = 'anonymous';
    imgElement.src = icon;

    imgElement.onload = () => {
      const fabricImg = new FabricImage(imgElement, {
        left: canvas.width! / 2,
        top: canvas.height! / 2,
        originX: 'center',
        originY: 'center',
        scaleX: 0.2,
        scaleY: 0.2
      });

      canvas.add(fabricImg);
      canvas.setActiveObject(fabricImg);
      canvas.renderAll();
      saveState(canvas.toJSON());
    };

    imgElement.onerror = (error) => {
      console.error('Failed to load image element', error);
    };
  };

  const handleCloseDropdown = () => {
    onClose(false);
  };

  const handleBackdropClick = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      handleCloseDropdown();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleBackdropClick);
    }
    return () => {
      document.removeEventListener('click', handleBackdropClick);
    };
  }, [isOpen]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            className="absolute right-4 top-20 z-50 w-80 rounded-2xl bg-[#000000a9] py-4 shadow-lg backdrop-blur-[20px]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative">
              <Cross2Icon
                onClick={handleCloseDropdown}
                className="absolute -top-2 right-2 h-6 w-6 cursor-pointer text-white"
              />
            </div>
            <div className="mt-4">
              <ul className="flex flex-col gap-2">
                {categories.map((category) => (
                  <li
                    key={category.id}
                    onClick={() => {
                      setSelectedCategoryId(category.id);
                      handleCloseDropdown();
                    }}
                    className={cn(
                      'cursor-pointer rounded-md p-2 text-center text-white hover:bg-blue-500',
                      selectedCategoryId === category.id && 'bg-blue-500'
                    )}
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger />
        <SheetContent
          className="border-none bg-[#000000a9] shadow-lg backdrop-blur-[20px]"
          side="right"
        >
          <div className="mb-4 py-4">
            <h2 className="pr-4 text-center text-lg font-semibold text-white">
              Cílios
            </h2>
            <div className="mt-4 grid max-h-[calc(100vh-8rem)] grid-cols-1 gap-4 overflow-y-auto pr-2">
              {eyes.map((eye) => (
                <div
                  key={eye.id}
                  onClick={() => {
                    handleIconSelect(eye.attachment.url);
                    setIsSheetOpen(false);
                  }}
                  className="cursor-pointer rounded-2xl bg-white/30 p-2  hover:bg-white/10"
                >
                  <ImageNext
                    src={eye.attachment.url}
                    alt={eye.name}
                    quality={100}
                    width={1200}
                    height={800}
                    className="h-32 w-full object-cover"
                  />
                  <p className="text-center font-bold text-white">{eye.name}</p>
                </div>
              ))}
            </div>
            {loading && (
              <p className="mt-4 text-center text-sm text-white">
                Carregando...
              </p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
