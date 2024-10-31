import { useState, useEffect } from 'react';
import { Drawer } from 'rsuite';
import { Cross2Icon } from '@radix-ui/react-icons';
import { getAllIcons, Icon } from '@/services/iconService';
import InfiniteScroll from '@/components/ui/InfiniteScroll';
import { Loader2 } from 'lucide-react';
import Search from '@/components/search';
import ImageNext from 'next/image';
import { Image as FabricImage } from 'fabric';
import { useCanvasEditorStore } from '@/store/canvasEditorStore';
import { useCanvasHistoryStore } from '@/store/canvasHistoryStore';

export const IconModal = () => {
  const {
    canvasRef,
    isIconModalOpen: isOpen,
    setIsIconModalOpen: onClose
  } = useCanvasEditorStore();
  const { saveState } = useCanvasHistoryStore();

  const [icons, setIcons] = useState<Icon[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [search, setSearch] = useState<string | undefined>(undefined);

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
        scaleX: 0.3,
        scaleY: 0.3
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

  const fetchIcons = async (pageNum: number, searchTerm?: string) => {
    setLoading(true);
    try {
      const data = await getAllIcons(
        pageNum,
        900,
        searchTerm,
        undefined,
        undefined,
        'true'
      );
      setIcons((prevIcons) => {
        const newIcons = data.icons.filter(
          (icon) => !prevIcons.some((prev) => prev.id === icon.id)
        );
        return [...prevIcons, ...newIcons];
      });
      setTotalPage(data.totalPages);
      setHasMore(pageNum < data.totalPages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setIcons([]); // Limpa ícones ao abrir o modal
      setPage(1); // Reseta a página ao abrir o modal
      fetchIcons(1, search); // Inicia o carregamento da primeira página
    }
  }, [isOpen, search]);

  useEffect(() => {
    if (page > 1 || icons.length === 0) {
      fetchIcons(page, search);
    }
  }, [page]);

  const loadMore = () => {
    if (!loading && page < totalPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleSearch = (newSearch: string) => {
    setSearch(newSearch || undefined);
    setPage(1); // Reseta a página para nova busca
    setIcons([]); // Limpa ícones para nova busca
  };

  return (
    <Drawer
      size="full"
      placement="bottom"
      open={isOpen}
      onClose={() => onClose(false)}
      dialogClassName="bg-white relative rounded-2xl dark:bg-[#2a292a]"
      closeButton={false}
    >
      <div className="py-5">
        <Cross2Icon
          onClick={() => onClose(false)}
          className="absolute right-4 top-5 h-8 w-8 cursor-pointer"
        />
        <p className="text-center text-2xl font-semibold">Selecione um Ícone</p>
      </div>

      <div className="max-h-full overflow-y-auto p-4 pb-16">
        <Search
          className="mb-5"
          onSearch={handleSearch}
          placeholder="Busque um ícone"
          defaultValues={{ search }}
        />

        <InfiniteScroll
          page={page}
          totalPage={totalPage}
          hasMore={hasMore}
          isLoading={loading}
          next={loadMore}
        >
          <ul className="grid grid-cols-3 gap-4 pb-10">
            {icons.map((icon) => (
              <li
                key={icon.id}
                className="w-full cursor-pointer rounded-2xl bg-[#3b3b3b] p-2 text-center transition-all duration-200 ease-in-out hover:bg-[#4e4d4d] dark:hover:bg-[#1e1e1e]"
                onClick={() => {
                  handleIconSelect(icon.attachment.url);
                  onClose(false);
                }}
              >
                <ImageNext
                  src={icon.attachment.url}
                  alt={icon.name}
                  width={1200}
                  height={800}
                  className="mx-auto h-16 w-full object-cover"
                />
                <p className="mt-2 truncate text-sm text-white">{icon.name}</p>
              </li>
            ))}
          </ul>
        </InfiniteScroll>

        {loading && <Loader2 className="mx-auto my-4 h-8 w-8 animate-spin" />}
        {!hasMore && icons.length === 0 && !loading && (
          <p className="text-center text-xl text-gray-500">
            Não foram encontrados ícones
          </p>
        )}
      </div>
    </Drawer>
  );
};
