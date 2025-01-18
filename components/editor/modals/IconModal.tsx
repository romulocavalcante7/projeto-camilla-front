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
import { Category, getAllCategories } from '@/services/categoryService';
import {
  getStickersByCategoryId,
  Sticker,
  StickerResponse
} from '@/services/stickerService';
import { cn } from '@/lib/utils';

export const EyelashModal = () => {
  const {
    canvasRef,
    isIconModalOpen: isOpen,
    setIsIconModalOpen: onClose
  } = useCanvasEditorStore();
  const { saveState } = useCanvasHistoryStore();

  const [eyes, setEyes] = useState<Sticker[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [search, setSearch] = useState<string | undefined>(undefined);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [totalCategories, setTotalCategories] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  console.log('eyes', eyes);
  const fetchCategories = async (
    pageNum: number,
    pageSize: number,
    search?: string,
    sortField?: string,
    sortOrder?: string
  ) => {
    setLoading(true);
    try {
      const data = await getAllCategories(
        pageNum,
        pageSize,
        search,
        sortField,
        sortOrder
      );
      setCategories(data.categories);
      setTotalCategories(data.total);
      setPageCount(data.totalPages);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEyes = async (page: number) => {
    setLoading(true);
    if (!selectedCategoryId) return;
    try {
      const data: StickerResponse = await getStickersByCategoryId(
        selectedCategoryId,
        page,
        10
      );
      setEyes(data.stickers);
      setTotalPage(data.totalPages);
      // setHasMore(page < data.totalPages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(page, pageSize, search);
  }, [page, search, pageSize]);

  useEffect(() => {
    if (selectedCategoryId) {
      fetchEyes(page);
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

  // const fetchIcons = async (pageNum: number, searchTerm?: string) => {
  //   setLoading(true);
  //   try {
  //     const data = await getAllIcons(
  //       pageNum,
  //       900,
  //       searchTerm,
  //       undefined,
  //       undefined,
  //       'true'
  //     );
  //     setIcons((prevIcons) => {
  //       const newIcons = data.icons.filter(
  //         (icon) => !prevIcons.some((prev) => prev.id === icon.id)
  //       );
  //       return [...prevIcons, ...newIcons];
  //     });
  //     setTotalPage(data.totalPages);
  //     setHasMore(pageNum < data.totalPages);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    if (isOpen) {
      setEyes([]); // Limpa ícones ao abrir o modal
      setPage(1); // Reseta a página ao abrir o modal
      // fetchIcons(1, search); // Inicia o carregamento da primeira página
    }
  }, [isOpen, search]);

  // useEffect(() => {
  //   if (page > 1 || icons.length === 0) {
  //     fetchIcons(page, search);
  //   }
  // }, [page]);

  // const loadMore = () => {
  //   if (!loading && page < totalPage) {
  //     setPage((prevPage) => prevPage + 1);
  //   }
  // };

  // const handleSearch = (newSearch: string) => {
  //   setSearch(newSearch || undefined);
  //   setPage(1); // Reseta a página para nova busca
  //   setIcons([]); // Limpa ícones para nova busca
  // };

  return (
    <Drawer
      size="full"
      placement="bottom"
      open={isOpen}
      onClose={() => onClose(false)}
      dialogClassName="relative rounded-2xl backdrop-blur-2xl"
      closeButton={false}
    >
      <div className="py-5">
        <Cross2Icon
          onClick={() => onClose(false)}
          className="absolute right-4 top-5 h-8 w-8 cursor-pointer text-white"
        />
        <p className="text-center text-2xl font-semibold text-white">
          Selecione
        </p>
      </div>

      <div className="max-h-full overflow-y-auto p-4 pb-16">
        {/* <Search
          className="mb-5"
          onSearch={handleSearch}
          placeholder="Busque um cílio"
          defaultValues={{ search }}
        /> */}

        {/* <InfiniteScroll
          page={page}
          totalPage={totalPage}
          hasMore={hasMore}
          isLoading={loading}
          next={loadMore}
        > */}
        {/* <ul className="grid grid-cols-2 gap-4 pb-10">
            {icons.map((icon) => (
              <li
                key={icon.id}
                className="w-full cursor-pointer rounded-2xl border-2 border-none bg-[#7e7e7e63] p-2 text-center backdrop-blur-[20px] transition-all duration-200 ease-in-out hover:bg-[#4e4d4d] dark:hover:bg-[#1e1e1e]"
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
          </ul> */}
        <div className="w-full">
          <ul className="flex w-full flex-col gap-4 pb-10">
            {categories.map((category) => {
              return (
                <li
                  key={category.id}
                  onClick={() => {
                    setSelectedCategoryId(category.id);
                  }}
                  className={cn(
                    'w-full cursor-pointer rounded-2xl border-2 border-none bg-black/20 p-2 transition-all duration-200 ease-in-out hover:bg-black/20',
                    selectedCategoryId === category.id && 'bg-blue-500'
                  )}
                >
                  <p className="truncate text-center text-white">
                    {category.name}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex w-full flex-col gap-4 pb-10">
          {eyes.map((eye) => {
            return (
              <div
                key={eye.id}
                className="w-full cursor-pointer rounded-2xl border-2 border-none bg-[#7e7e7e63] p-2 text-center backdrop-blur-[20px] transition-all duration-200 ease-in-out hover:bg-[#4e4d4d] dark:hover:bg-[#1e1e1e]"
                onClick={() => {
                  handleIconSelect(eye.attachment.url);
                  onClose(false);
                }}
              >
                <ImageNext
                  src={eye.attachment.url}
                  alt={eye.name}
                  width={1200}
                  height={800}
                  className="mx-auto h-full w-full object-cover"
                />
                <p className="mt-2 truncate text-sm text-white">{eye.name}</p>
              </div>
            );
          })}
        </div>

        {/* </InfiniteScroll> */}

        {/* {loading && <Loader2 className="mx-auto my-4 h-8 w-8 animate-spin" />}
        {!hasMore && icons.length === 0 && !loading && (
          <p className="text-center text-xl text-gray-500">
            Não foram encontrados ícones
          </p>
        )} */}
      </div>
    </Drawer>
  );
};
