import { useEffect, useState } from 'react';
import { Drawer } from 'rsuite';
import { Cross2Icon } from '@radix-ui/react-icons';
import { getAllFonts, Font } from '@/services/fontService';
import InfiniteScroll from '@/components/ui/InfiniteScroll';
import { Loader2 } from 'lucide-react';
import Search from '@/components/search';
import { useCanvasEditorStore } from '@/store/canvasEditorStore';

interface FontModalProps {
  saveChanges: () => void;
}

export const FontModal = ({ saveChanges }: FontModalProps) => {
  const {
    isFontModalOpen: isOpen,
    setIsFontModalOpen: onClose,
    setFontFamily,
    canvasRef
  } = useCanvasEditorStore();

  const [fonts, setFonts] = useState<Font[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [search, setSearch] = useState<string | undefined>(undefined);

  const fetchFonts = async (pageNum: number, searchTerm?: string) => {
    setLoading(true);
    try {
      const data = await getAllFonts(
        pageNum,
        10,
        searchTerm,
        undefined,
        undefined,
        'true'
      );

      setFonts((prevFonts) => {
        const newFonts = data.fonts.filter(
          (font) => !prevFonts.some((prev) => prev.id === font.id)
        );
        return [...prevFonts, ...newFonts];
      });
      setTotalPage(data.totalPages);
      setHasMore(pageNum < data.totalPages);
    } catch (error) {
      console.error('Erro ao buscar fontes:', error);
    } finally {
      setLoading(false);
    }
  };

  const injectFontFaces = (fonts: Font[]) => {
    const style = document.createElement('style');
    style.type = 'text/css';
    fonts.forEach((font) => {
      const fontFace = `
        @font-face {
          font-family: '${font.name}';
          src: url(${font.attachment.url}) format('truetype');
        }
      `;
      style.appendChild(document.createTextNode(fontFace));
    });
    document.head.appendChild(style);
  };

  const applyFontFamily = async (fontName: string) => {
    await document.fonts.load(`1em ${fontName}`);
    setFontFamily(fontName);

    // Atualiza o canvas para aplicar a fonte
    const activeObjects = canvasRef?.current?.getActiveObjects();
    if (!activeObjects) return;

    activeObjects.forEach((obj) => {
      if (obj.type === 'i-text') {
        obj.set({ fontFamily: fontName });
      }
    });
    canvasRef?.current?.renderAll();
    saveChanges();
  };

  useEffect(() => {
    if (isOpen && fonts.length > 0) {
      injectFontFaces(fonts);
    }
  }, [isOpen, fonts]);

  useEffect(() => {
    if (isOpen) {
      setPage(1);
      setFonts([]);
      fetchFonts(1, search);
    }
  }, [isOpen, search]);

  const loadMoreFonts = () => {
    if (!loading && page < totalPage) {
      setPage((prevPage) => prevPage + 1);
      fetchFonts(page + 1, search);
    }
  };

  const handleSearch = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
    setFonts([]);
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
        <p className="text-center text-2xl font-semibold">
          Selecione uma Fonte
        </p>
      </div>

      <div className="max-h-full overflow-y-auto p-4 pb-16">
        <Search
          className="mb-5"
          onSearch={handleSearch}
          placeholder="Busque uma fonte"
          defaultValues={{ search }}
        />

        <InfiniteScroll
          page={page}
          totalPage={totalPage}
          hasMore={hasMore}
          isLoading={loading}
          next={loadMoreFonts}
        >
          <ul className="grid grid-cols-2 gap-4 pb-10">
            {fonts.map((font) => (
              <li
                key={font.id}
                className="cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap rounded-lg border border-gray-300 p-2 text-center text-[20px] transition-all duration-200 ease-in-out hover:bg-gray-100 hover:underline dark:border-[#444] dark:hover:bg-[#1e1e1e]"
                onClick={() => {
                  applyFontFamily(font.name);
                  onClose(false);
                }}
                style={{
                  fontFamily: `"${font.name}", sans-serif`,
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale'
                }}
              >
                {font.name.length > 15
                  ? `${font.name.substring(0, 15)}...`
                  : font.name}
              </li>
            ))}
          </ul>
        </InfiniteScroll>

        {loading && <Loader2 className="mx-auto my-4 h-8 w-8 animate-spin" />}
        {!hasMore && fonts.length === 0 && !loading && (
          <p className="text-center text-xl text-gray-500">
            Não foram encontradas fontes
          </p>
        )}
      </div>
    </Drawer>
  );
};
