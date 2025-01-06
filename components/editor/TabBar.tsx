'use client';
import React from 'react';
// import { cn } from '@/lib/utils';
// import {
//   BaselineIcon,
//   CircleDashed,
//   Rainbow,
//   TriangleRight,
//   TypeIcon
// } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useCanvasEditorStore } from '@/store/canvasEditorStore';

export const TabBar = () => {
  const { theme } = useTheme();
  const {
    currentMenu,
    setCurrentMenu,
    selectedObject,
    setIsColorModalOpen,
    setIsIconModalOpen,
    setIsOpacityModalOpen,
    setIsSaturationTemperatureModalOpen
  } = useCanvasEditorStore();

  return (
    <div className="fixed bottom-5 mx-auto flex w-full max-w-[370px] items-center gap-2 rounded-lg border bg-gray-50 pt-3  backdrop-blur-[14px] sm:max-w-lg sm:px-10 dark:border-none dark:border-stone-300/20 dark:bg-[#2E2B2B]">
      {currentMenu !== 'main' && (
        <button
          onClick={() => setCurrentMenu('main')}
          className="flex w-20 cursor-pointer flex-col items-center pb-3"
        >
          <svg width="30" height="30" fill="currentColor" viewBox="0 0 30 30">
            <path d="M15 6l-6 6 6 6"></path>
          </svg>
          <span className="mt-1 text-xs text-black dark:text-white">
            Voltar
          </span>
        </button>
      )}

      <div className="flex items-center justify-start gap-2 overflow-x-auto pb-3">
        {currentMenu !== 'style' && currentMenu !== 'align' && (
          <div className="flex items-center justify-start gap-2 pr-5">
            <button
              onClick={() => setIsColorModalOpen(true)}
              // disabled={selectedObject.some((item) => item.type === 'image')}
              className={`flex w-20 cursor-pointer flex-col items-center gap-0`}
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.2501 5.83317C11.4802 5.83317 11.6667 5.64662 11.6667 5.4165C11.6667 5.18639 11.4802 4.99984 11.2501 4.99984C11.02 4.99984 10.8334 5.18639 10.8334 5.4165C10.8334 5.64662 11.02 5.83317 11.2501 5.83317Z"
                  stroke={theme === 'dark' ? '#fff' : '#000'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.5834 9.1665C14.8135 9.1665 15.0001 8.97996 15.0001 8.74984C15.0001 8.51972 14.8135 8.33317 14.5834 8.33317C14.3533 8.33317 14.1667 8.51972 14.1667 8.74984C14.1667 8.97996 14.3533 9.1665 14.5834 9.1665Z"
                  stroke={theme === 'dark' ? '#fff' : '#000'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.08341 6.6665C7.31353 6.6665 7.50008 6.47996 7.50008 6.24984C7.50008 6.01972 7.31353 5.83317 7.08341 5.83317C6.8533 5.83317 6.66675 6.01972 6.66675 6.24984C6.66675 6.47996 6.8533 6.6665 7.08341 6.6665Z"
                  stroke={theme === 'dark' ? '#fff' : '#000'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.41675 10.8332C5.64687 10.8332 5.83341 10.6466 5.83341 10.4165C5.83341 10.1864 5.64687 9.99984 5.41675 9.99984C5.18663 9.99984 5.00008 10.1864 5.00008 10.4165C5.00008 10.6466 5.18663 10.8332 5.41675 10.8332Z"
                  stroke={theme === 'dark' ? '#fff' : '#000'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.0001 1.6665C5.41675 1.6665 1.66675 5.4165 1.66675 9.99984C1.66675 14.5832 5.41675 18.3332 10.0001 18.3332C10.7717 18.3332 11.3734 17.7115 11.3734 16.9265C11.3734 16.5623 11.2234 16.2307 11.0092 15.989C10.7676 15.7482 10.6442 15.4457 10.6442 15.0515C10.6411 14.8681 10.6749 14.6859 10.7436 14.5159C10.8124 14.3458 10.9146 14.1913 11.0443 14.0616C11.174 13.9319 11.3285 13.8296 11.4986 13.7609C11.6687 13.6921 11.8508 13.6583 12.0342 13.6615H13.6976C16.2401 13.6615 18.3267 11.5757 18.3267 9.03317C18.3042 5.00984 14.5509 1.6665 10.0001 1.6665Z"
                  stroke={theme === 'dark' ? '#fff' : '#000'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span className="mt-2 text-xs text-black dark:text-white">
                Cor
              </span>
            </button>

            <button
              onClick={() => setIsSaturationTemperatureModalOpen(true)}
              className="flex w-20 cursor-pointer flex-col items-center gap-0"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 1V5C12 5.53043 12.2107 6.03914 12.5858 6.41421C12.9609 6.78929 13.4696 7 14 7H18M6 11H6.01M14 11H14.01M8 14C8 14 8.8 15 10 15C11.3 15 12 14 12 14M13.5 1H3C2.46957 1 1.96086 1.21071 1.58579 1.58579C1.21071 1.96086 1 2.46957 1 3V17C1 18.1 1.9 19 3 19H17C17.5304 19 18.0391 18.7893 18.4142 18.4142C18.7893 18.0391 19 17.5304 19 17V6.5L13.5 1Z"
                  stroke="#000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="mt-[10px] text-xs text-black dark:text-white">
                Filtros
              </span>
            </button>

            <button
              onClick={() => setIsIconModalOpen(true)}
              className={`flex w-20 cursor-pointer flex-col items-center gap-0`}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 1V5C12 5.53043 12.2107 6.03914 12.5858 6.41421C12.9609 6.78929 13.4696 7 14 7H18M6 11H6.01M14 11H14.01M8 14C8 14 8.8 15 10 15C11.3 15 12 14 12 14M13.5 1H3C2.46957 1 1.96086 1.21071 1.58579 1.58579C1.21071 1.96086 1 2.46957 1 3V17C1 18.1 1.9 19 3 19H17C17.5304 19 18.0391 18.7893 18.4142 18.4142C18.7893 18.0391 19 17.5304 19 17V6.5L13.5 1Z"
                  stroke={theme === 'dark' ? '#fff' : '#000'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="mt-[10px] text-xs text-black dark:text-white">
                Ícone
              </span>
            </button>

            <button
              onClick={() => setIsOpacityModalOpen(true)}
              disabled={!selectedObject}
              className={`flex w-20 flex-col items-center gap-1 ${
                !selectedObject
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer'
              }`}
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z"
                  stroke={theme === 'dark' ? '#fff' : '#000'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 21C17.866 21 21 17.866 21 14C21 10.134 17.866 7 14 7C10.134 7 7 10.134 7 14C7 17.866 10.134 21 14 21Z"
                  stroke={theme === 'dark' ? '#fff' : '#000'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="mt-1 text-xs text-black dark:text-white">
                Opacidade
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
