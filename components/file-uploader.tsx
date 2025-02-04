'use client';

import * as React from 'react';
import Image from 'next/image';
import { Cross2Icon, UploadIcon } from '@radix-ui/react-icons';
import Dropzone, {
  type DropzoneProps,
  type FileRejection
} from 'react-dropzone';
import { toast } from 'sonner';

import { cn, formatBytes } from '@/lib/utils';
import { useControllableState } from '@/hooks/use-controllable-state';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Value of the uploader.
   * @type File[]
   * @default undefined
   * @example value={files}
   */
  value?: File[];
  sticker?: boolean;
  /**
   * Function to be called when the value changes.
   * @type React.Dispatch<React.SetStateAction<File[]>>
   * @default undefined
   * @example onValueChange={(files) => setFiles(files)}
   */
  onValueChange?: React.Dispatch<React.SetStateAction<File[]>>;

  /**
   * Function to be called when files are uploaded.
   * @type (files: File[]) => Promise<void>
   * @default undefined
   * @example onUpload={(files) => uploadFiles(files)}
   */
  onUpload?: (files: File[]) => Promise<void>;

  /**
   * Progress of the uploaded files.
   * @type Record<string, number> | undefined
   * @default undefined
   * @example progresses={{ "file1.png": 50 }}
   */
  progresses?: Record<string, number>;

  /**
   * Accepted file types for the uploader.
   * @type { [key: string]: string[]}
   * @default
   * ```ts
   * { "image/*": [] }
   * ```
   * @example accept={["image/png", "image/jpeg"]}
   */
  accept?: DropzoneProps['accept'];

  /**
   * Maximum file size for the uploader.
   * @type number | undefined
   * @default 1024 * 1024 * 2 // 2MB
   * @example maxSize={1024 * 1024 * 2} // 2MB
   */
  maxSize?: DropzoneProps['maxSize'];

  /**
   * Maximum number of files for the uploader.
   * @type number | undefined
   * @default 1
   * @example maxFiles={5}
   */
  maxFiles?: DropzoneProps['maxFiles'];

  /**
   * Whether the uploader should accept multiple files.
   * @type boolean
   * @default false
   * @example multiple
   */
  multiple?: boolean;

  /**
   * Whether the uploader is disabled.
   * @type boolean
   * @default false
   * @example disabled
   */
  disabled?: boolean;
}

export function FileUploader(props: FileUploaderProps) {
  const {
    value: valueProp,
    onValueChange,
    onUpload,
    progresses,
    accept = {
      'image/*': [],
      'font/ttf': ['.ttf'],
      'font/otf': ['.otf'],
      'font/woff': ['.woff'],
      'font/woff2': ['.woff2'],
      'application/x-font-ttf': ['.ttf'],
      'application/x-font-opentype': ['.otf'],
      'application/x-font-woff': ['.woff'],
      'application/font-woff2': ['.woff2']
    },
    maxSize = 1024 * 1024 * 2,
    maxFiles = 1,
    multiple = false,
    disabled = false,
    sticker = false,
    className,
    ...dropzoneProps
  } = props;

  const [files, setFiles] = useControllableState({
    prop: valueProp,
    onChange: onValueChange
  });

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (!multiple && maxFiles === 1 && acceptedFiles.length > 1) {
        toast.error('Cannot upload more than 1 file at a time');
        return;
      }

      if ((files?.length ?? 0) + acceptedFiles.length > maxFiles) {
        toast.error(`Cannot upload more than ${maxFiles} files`);
        return;
      }

      const sanitizedFiles = acceptedFiles.map((file) => {
        const sanitizedFile = new File([file], file.name.replace(/\s+/g, ''), {
          type: file.type
        });
        return Object.assign(sanitizedFile, {
          preview: URL.createObjectURL(sanitizedFile)
        });
      });

      const updatedFiles = files
        ? [...files, ...sanitizedFiles]
        : sanitizedFiles;

      setFiles(updatedFiles);

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          toast.error(`File ${file.name} was rejected`);
        });
      }

      if (
        onUpload &&
        updatedFiles.length > 0 &&
        updatedFiles.length <= maxFiles
      ) {
        const target =
          updatedFiles.length > 0 ? `${updatedFiles.length} files` : `file`;

        toast.promise(onUpload(updatedFiles), {
          loading: `Uploading ${target}...`,
          success: () => {
            setFiles([]);
            return `${target} uploaded`;
          },
          error: `Failed to upload ${target}`
        });
      }
    },
    [files, maxFiles, multiple, onUpload, setFiles]
  );

  function onRemove(index: number) {
    if (!files) return;
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onValueChange?.(newFiles);
  }

  // Revoke preview url when component unmounts
  React.useEffect(() => {
    return () => {
      if (!files) return;
      files.forEach((file) => {
        if (isFileWithPreview(file)) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDisabled = disabled || (files?.length ?? 0) >= maxFiles;

  return (
    <div className="relative flex flex-col gap-6 overflow-hidden">
      <Dropzone
        onDrop={onDrop}
        accept={accept}
        maxSize={maxSize}
        maxFiles={maxFiles}
        multiple={maxFiles > 1 || multiple}
        disabled={isDisabled}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className={cn(
              'group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25',
              'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              isDragActive && 'border-muted-foreground/50',
              isDisabled && 'pointer-events-none opacity-60',
              className
            )}
            {...dropzoneProps}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                <div className="rounded-full border border-dashed p-3">
                  <UploadIcon
                    className="size-7 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                <p className="font-medium text-muted-foreground">
                  Drop the files here
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                <div className="rounded-full border border-dashed p-3">
                  <UploadIcon
                    className="size-7 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex flex-col items-center gap-3 space-y-px text-center">
                  <p className="max-w-64 text-center font-medium text-muted-foreground sm:max-w-full">
                    Arraste os arquivos, ou clique para selecionar
                  </p>
                  <p className="max-w-64 text-center text-sm text-muted-foreground/70 sm:max-w-full">
                    Você pode fazer upload de
                    {maxFiles > 1
                      ? ` ${maxFiles === Infinity ? 'multiple' : maxFiles}
                      arquivos com ${formatBytes(maxSize)} cada)`
                      : ` um arquivo com ${formatBytes(maxSize)}`}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Dropzone>
      {files?.length ? (
        <ScrollArea className="h-fit w-full">
          {sticker ? (
            <div className="flex flex-wrap gap-10">
              {files?.map((file, index) => (
                <FileCardSticker
                  key={index}
                  file={file}
                  onRemove={() => onRemove(index)}
                  progress={progresses?.[file.name]}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {files?.map((file, index) => (
                <FileCard
                  key={index}
                  file={file}
                  onRemove={() => onRemove(index)}
                  progress={progresses?.[file.name]}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      ) : null}
    </div>
  );
}

interface FileCardProps {
  file: File;
  onRemove: () => void;
  progress?: number;
}

function isFontFile(file: File): boolean {
  return (
    file.type.startsWith('font/') ||
    ['.ttf', '.otf', '.woff', '.woff2'].some((ext) => file.name.endsWith(ext))
  );
}

function FileCard({ file, progress, onRemove }: FileCardProps) {
  const [fontName, setFontName] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (file && isFontFile(file)) {
      const fontURL = URL.createObjectURL(file);
      const fontName = file.name.split('.')[0];
      const font = new FontFace(fontName, `url(${fontURL})`);

      font
        .load()
        .then((loadedFont) => {
          document.fonts.add(loadedFont);
          setFontName(fontName);
        })
        .catch((error) => {
          console.error('Erro ao carregar a fonte:', error);
        });

      return () => {
        URL.revokeObjectURL(fontURL);
      };
    }
  }, [file]);

  return (
    <div className="relative flex flex-col">
      <div className="flex flex-1 flex-col gap-5">
        {fontName ? (
          <div className="flex flex-col items-center justify-center gap-2">
            <p style={{ fontFamily: fontName, fontSize: '42px' }}>
              {file.name.split('.')[0]}
            </p>
          </div>
        ) : (
          isFileWithPreview(file) && (
            <Image
              src={file.preview}
              alt={file.name}
              width={300}
              height={300}
              loading="lazy"
              className="h-64 w-full shrink-0 rounded-md bg-cover object-cover"
            />
          )
        )}
        <div className="flex w-full justify-between gap-2">
          <div className="space-y-px">
            <p className="line-clamp-1 text-sm font-medium text-foreground/80">
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatBytes(file.size)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-7"
              onClick={onRemove}
            >
              <Cross2Icon className="size-4 " aria-hidden="true" />
              <span className="sr-only">Remove file</span>
            </Button>
          </div>
          {progress ? <Progress value={progress} /> : null}
        </div>
      </div>
    </div>
  );
}

function FileCardSticker({ file, progress, onRemove }: FileCardProps) {
  return (
    <div className="relative flex flex-col">
      <div className="flex w-fit flex-1 flex-col gap-5">
        {isFileWithPreview(file) ? (
          <Image
            src={file.preview}
            alt={file.name}
            width={300}
            height={300}
            loading="lazy"
            className="h-40 w-full shrink-0 rounded-md  bg-cover object-cover"
          />
        ) : null}
        <div className="flex w-full justify-between gap-2">
          <div className="space-y-px">
            <p className="line-clamp-1 text-sm font-medium text-foreground/80">
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatBytes(file.size)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-gray-200 hover:bg-gray-300"
              onClick={onRemove}
            >
              <Cross2Icon className="size-4" aria-hidden="true" />
              <span className="sr-only">Remove file</span>
            </Button>
          </div>
          {progress ? <Progress value={progress} /> : null}
        </div>
      </div>
    </div>
  );
}

function isFileWithPreview(file: File): file is File & { preview: string } {
  return 'preview' in file && typeof file.preview === 'string';
}
