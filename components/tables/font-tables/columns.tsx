/* eslint-disable react-hooks/rules-of-hooks */

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Font } from '@/services/fontService';
import { format } from 'date-fns';
import { DataTableColumnHeader } from '../data-header';
import { Star, StarOff } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export const columns: ColumnDef<Font>[] = [
  {
    accessorKey: 'isImportant',
    header: '',
    cell: ({ row }) =>
      row.original.isImportant ? (
        <Star fill="yellow" stroke="#e2d40ed1" size={20} />
      ) : (
        <StarOff size={20} />
      )
  },
  {
    accessorKey: 'attachment',
    header: 'Prévia da Fonte',
    cell: ({ row }) => {
      const [fontName, setFontName] = useState<string | null>(null);
      useEffect(() => {
        const attachmentUrl = row.original.attachment?.url;
        if (attachmentUrl) {
          const fontName = row.original.name.split('.')[0];
          const font = new FontFace(fontName, `url(${attachmentUrl})`);

          font
            .load()
            .then((loadedFont) => {
              document.fonts.add(loadedFont);
              setFontName(fontName);
            })
            .catch((error) => {
              console.error('Erro ao carregar a fonte:', error);
            });
        }
      }, [row.original.attachment?.url, row.original.name]);

      return fontName ? (
        <p style={{ fontFamily: fontName, fontSize: '22px' }}>{fontName}</p>
      ) : (
        <div className="aspect-square h-14 w-32 rounded-lg bg-gray-300 object-cover" />
      );
    }
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} order="A" title="Nome da Fonte" />
    )
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data de criação" />
    ),
    cell: ({ row }) => {
      return (
        <p>{format(new Date(row.original.createdAt), 'dd/MM/yyyy HH:mm:ss')}</p>
      );
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
