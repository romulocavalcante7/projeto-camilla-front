import React, { useContext, useState } from 'react';
import { Drawer } from 'rsuite';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useCanvasEditorStore } from '@/store/canvasEditorStore';
import { useForm, Controller } from 'react-hook-form';
import AuthContext from '@/contexts/auth-context';
import Image from 'next/image';
import { differenceInDays } from 'date-fns';
import Amendoado from '@/app/assets/ficha/olhos/Amendoado.webp';
import PequenoFino from '@/app/assets/ficha/olhos/Pequeno-fino.webp';
import Grande from '@/app/assets/ficha/olhos/Grande.webp';
import PequenoRedondo from '@/app/assets/ficha/olhos/Pequeno-redondo.webp';

import PequenoNormal from '@/app/assets/ficha/profundidade/profundidade-normal.webp';
import PequenoProeminente from '@/app/assets/ficha/profundidade/profundidade-proeminente.webp';
import PequenoProfundo from '@/app/assets/ficha/profundidade/profundidade-profundo.webp';

import OlhoLinear from '@/app/assets/ficha/alinhamento/olho-linear.webp';
import OlhoAscendente from '@/app/assets/ficha/alinhamento/olho-ascendentes.webp';
import OlhoDescendentes from '@/app/assets/ficha/alinhamento/olho-descendentes.webp';

import OlhoNormais from '@/app/assets/ficha/distanciamento/olhos-normais.webp';
import OlhoSeparados from '@/app/assets/ficha/distanciamento/olhos-separados.webp';
import OlhoJuntos from '@/app/assets/ficha/distanciamento/olhos-juntos.webp';

import PalpebrasCaidas from '@/app/assets/ficha/palpebras/palpebras-caidas.webp';
import PalpebrasEncapuzadas from '@/app/assets/ficha/palpebras/palpebras-encapuzadas.webp';

import CurvaturaNormal from '@/app/assets/ficha/curvatura/curvatura-normal.webp';
import CurvaturaCurvado from '@/app/assets/ficha/curvatura/curvatura-curvado.webp';
import CurvaturaReto from '@/app/assets/ficha/curvatura/curvatura-reto.webp';

import Desidade1mm from '@/app/assets/ficha/densidade/densidade-1mm.webp';
import Desidade2mm from '@/app/assets/ficha/densidade/densidade-2mm.webp';

import SobrancelhaCurta from '@/app/assets/ficha/sobrancelhas/sobrancelha-curta.webp';
import SobrancelhaLonga from '@/app/assets/ficha/sobrancelhas/sobrancelha-longa.webp';
import { generateFichaPDF } from '@/lib/pdf';
// import { cn } from '@/lib/utils';

interface FichaModalProps {
  saveChanges: () => void;
}

export const FichaModal = ({ saveChanges }: FichaModalProps) => {
  const { isFichaModalOpen: isOpen, setIsFichaModalOpen: onClose } =
    useCanvasEditorStore();
  const { user } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const { control, handleSubmit } = useForm();

  const handleClose = () => {
    onClose(false);
    saveChanges();
  };

  const canDownloadPDF = () => {
    if (!user?.createdAt) return false;

    const createdAtDate = new Date(user.createdAt);
    const today = new Date();

    return differenceInDays(today, createdAtDate) >= 7;
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const steps = [
    {
      id: 1,
      title: '1° - Defina a Curvatura',
      content: (
        <div>
          <h3 className="mb-2 text-center text-lg font-medium text-white">
            Tipo de Olho
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                id: 'Olhos amendoado redondo',
                label: 'Olhos amendoado redondo',
                src: Amendoado
              },
              { id: 'Olhos grandes', label: 'Olhos grandes', src: Grande },
              {
                id: 'Olhos pequeno fino',
                label: 'Olhos pequeno fino',
                src: PequenoFino
              },
              {
                id: 'Olhos pequeno redondo',
                label: 'Olhos pequeno redondo',
                src: PequenoRedondo
              }
            ].map(({ id, label, src }) => (
              <Controller
                key={id}
                name="tipoOlho"
                control={control}
                render={({ field }) => (
                  <div
                    onClick={() => field.onChange(id)}
                    className={`flex cursor-pointer flex-col items-center rounded-lg border-2 border-white/20 p-2 ${
                      field.value === id
                        ? 'border-white bg-white text-black backdrop-blur-[20px]'
                        : 'border-transparent  text-white'
                    } transition hover:border-white`}
                  >
                    <Image
                      className="pointer-events-none h-20 w-20 object-cover"
                      onContextMenu={(e) => {
                        e.preventDefault();
                      }}
                      onTouchStart={(e) => e.preventDefault()}
                      src={src}
                      width={1200}
                      height={800}
                      alt={label}
                    />
                    <span className="text-center text-sm font-bold">
                      {label}
                    </span>
                    <input
                      type="radio"
                      id={id}
                      //@ts-ignore
                      value={id}
                      className="hidden"
                      {...field}
                    />
                  </div>
                )}
              />
            ))}
          </div>
        </div>
      )
    },

    {
      id: 2,
      title: '2° - Defina a Profundidade',
      content: (
        <div>
          <h3 className="mb-2 text-center text-lg font-medium text-white">
            Profundidade
          </h3>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { id: 'Normal', label: 'Normal', src: PequenoNormal },
              {
                id: 'Proeminente',
                label: 'Proeminente',
                src: PequenoProeminente
              },
              { id: 'Profundo', label: 'Profundo', src: PequenoProfundo }
            ].map(({ id, label, src }) => (
              <Controller
                key={id}
                name="profundidade"
                control={control}
                render={({ field }) => (
                  <div
                    onClick={() => field.onChange(id)}
                    className={`flex cursor-pointer flex-col items-center rounded-lg border-2 border-white/20 p-2 ${
                      field.value === id
                        ? 'border-white bg-white text-black backdrop-blur-[20px]'
                        : 'border-transparent  text-white'
                    } transition hover:border-white`}
                  >
                    <Image
                      className="pointer-events-none h-20 w-20 object-cover"
                      onContextMenu={(e) => {
                        e.preventDefault();
                      }}
                      onTouchStart={(e) => e.preventDefault()}
                      src={src}
                      width={1200}
                      height={800}
                      alt={label}
                    />
                    <span className="text-center text-sm font-bold">
                      {label}
                    </span>
                    <input
                      type="radio"
                      id={id}
                      //@ts-ignore
                      value={id}
                      className="hidden"
                      {...field}
                    />
                  </div>
                )}
              />
            ))}
          </div>
        </div>
      )
    },

    {
      id: 3,
      title: '3° - Defina o Alinhamento',
      content: (
        <div>
          <h3 className="mb-2 text-center text-lg font-medium text-white">
            Alinhamentos
          </h3>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              {
                id: 'Olhos Lineares',
                label: 'Olhos Lineares',
                src: OlhoLinear
              },
              {
                id: 'Olhos Ascendentes',
                label: 'Olhos Ascendentes',
                src: OlhoAscendente
              },
              {
                id: 'Olhos Descendentes',
                label: 'Olhos Descendentes',
                src: OlhoDescendentes
              }
            ].map(({ id, label, src }) => (
              <Controller
                key={id}
                name="alinhamento"
                control={control}
                render={({ field }) => (
                  <div
                    onClick={() => field.onChange(id)}
                    className={`flex cursor-pointer flex-col items-center rounded-lg border-2 border-white/20 p-2 ${
                      field.value === id
                        ? 'border-white bg-white text-black backdrop-blur-[20px]'
                        : 'border-transparent  text-white'
                    } transition hover:border-white`}
                  >
                    <Image
                      className="pointer-events-none h-20 w-full object-contain"
                      onContextMenu={(e) => {
                        e.preventDefault();
                      }}
                      onTouchStart={(e) => e.preventDefault()}
                      src={src}
                      width={1200}
                      height={800}
                      alt={label}
                    />
                    <span className="text-center text-sm">{label}</span>
                    <input
                      type="radio"
                      id={id}
                      //@ts-ignore
                      value={id}
                      className="hidden"
                      {...field}
                    />
                  </div>
                )}
              />
            ))}
          </div>
        </div>
      )
    },

    {
      id: 4,
      title: '4° - Defina o Alinhamento',
      content: (
        <div>
          <h3 className="mb-2 text-center text-lg font-medium text-white">
            Distanciamento
          </h3>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { id: 'Olhos Normais', label: 'Olhos Normais', src: OlhoNormais },
              {
                id: 'Olhos Separados',
                label: 'Olhos Separados',
                src: OlhoSeparados
              },
              { id: 'Olhos Juntos', label: 'Olhos Juntos', src: OlhoJuntos }
            ].map(({ id, label, src }) => (
              <Controller
                key={id}
                name="distanciamento"
                control={control}
                render={({ field }) => (
                  <div
                    onClick={() => field.onChange(id)}
                    className={`flex cursor-pointer flex-col items-center rounded-lg border-2 border-white/20 p-2 ${
                      field.value === id
                        ? 'border-white bg-white text-black backdrop-blur-[20px]'
                        : 'border-transparent  text-white'
                    } transition hover:border-white`}
                  >
                    <Image
                      className="pointer-events-none h-20 w-full object-contain"
                      onContextMenu={(e) => {
                        e.preventDefault();
                      }}
                      onTouchStart={(e) => e.preventDefault()}
                      src={src}
                      width={1200}
                      height={800}
                      alt={label}
                    />
                    <span className="text-center">{label}</span>
                    <input
                      type="radio"
                      id={id}
                      //@ts-ignore
                      value={id}
                      className="hidden"
                      {...field}
                    />
                  </div>
                )}
              />
            ))}
          </div>
        </div>
      )
    },

    {
      id: 5,
      title: '5° - Defina o Alinhamento',
      content: (
        <div>
          <h3 className="mb-2 text-center text-lg font-medium text-white">
            Pálpebras Caídas
          </h3>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              {
                id: 'Pálpebras Caídas',
                label: 'Pálpebras Caídas',
                src: PalpebrasCaidas
              },
              {
                id: 'Pálpebras Encapuzadas',
                label: 'Pálpebras Encapuzadas',
                src: PalpebrasEncapuzadas
              }
            ].map(({ id, label, src }) => (
              <Controller
                key={id}
                name="palpebras"
                control={control}
                render={({ field }) => (
                  <div
                    onClick={() => field.onChange(id)}
                    className={`flex cursor-pointer flex-col items-center rounded-lg border-2 border-white/20 p-2 ${
                      field.value === id
                        ? 'border-white bg-white text-black backdrop-blur-[20px]'
                        : 'border-transparent  text-white'
                    } transition hover:border-white`}
                  >
                    <Image
                      className="h-20 w-full object-cover"
                      src={src}
                      width={1200}
                      height={800}
                      alt={label}
                    />
                    <span className="mt-2 text-center">{label}</span>
                    <input
                      type="radio"
                      id={id}
                      //@ts-ignore
                      value={id}
                      className="hidden"
                      {...field}
                    />
                  </div>
                )}
              />
            ))}
          </div>
        </div>
      )
    },

    {
      id: 6,
      title: '6° - Defina a Projeção',
      content: (
        <div>
          <h3 className="mb-2 text-center text-lg font-medium text-white">
            Curvatura dos Cílios Naturais
          </h3>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { id: 'Reto', label: 'Reto', src: CurvaturaReto },
              { id: 'Curvado', label: 'Curvado', src: CurvaturaCurvado },
              { id: 'Normal', label: 'Normal', src: CurvaturaNormal }
            ].map(({ id, label, src }) => (
              <Controller
                key={id}
                name="projecao"
                control={control}
                render={({ field }) => (
                  <div
                    onClick={() => field.onChange(id)}
                    className={`flex cursor-pointer flex-col items-center rounded-lg border-2 border-white/20 p-2 ${
                      field.value === id
                        ? 'border-white bg-white text-black backdrop-blur-[20px]'
                        : 'border-transparent  text-white'
                    } transition hover:border-white`}
                  >
                    <Image
                      className="h-20 w-20 object-cover"
                      src={src}
                      width={1200}
                      height={800}
                      alt={label}
                    />
                    <span className="text-center text-sm">{label}</span>
                    <input
                      type="radio"
                      id={id}
                      //@ts-ignore
                      value={id}
                      className="hidden"
                      {...field}
                    />
                  </div>
                )}
              />
            ))}
          </div>
        </div>
      )
    },

    {
      id: 7,
      title: '7° - Defina a Densidade',
      content: (
        <div>
          <h3 className="mb-2 text-center text-lg font-medium text-white">
            Distanciamento do Fio Natural
          </h3>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              {
                id: '1mm (Mais denso)',
                label: '1mm (Mais denso)',
                src: Desidade1mm
              },
              {
                id: '2mm ou mais (Menos denso)',
                label: '2mm ou mais (Menos denso)',
                src: Desidade2mm
              }
            ].map(({ id, label, src }) => (
              <Controller
                key={id}
                name="densidade"
                control={control}
                render={({ field }) => (
                  <div
                    onClick={() => field.onChange(id)}
                    className={`flex cursor-pointer flex-col items-center rounded-lg border-2 border-white/20 p-2 ${
                      field.value === id
                        ? 'border-white bg-white text-black backdrop-blur-[20px]'
                        : 'border-transparent  text-white'
                    } transition hover:border-white`}
                  >
                    <Image
                      className="h-20 w-20 object-contain"
                      src={src}
                      width={1200}
                      height={800}
                      alt={label}
                    />
                    <span className="text-center text-sm">{label}</span>
                    <input
                      type="radio"
                      id={id}
                      //@ts-ignore
                      value={id}
                      className="hidden"
                      {...field}
                    />
                  </div>
                )}
              />
            ))}
          </div>
        </div>
      )
    },

    {
      id: 8,
      title: '8° - Defina Tamanhos',
      content: (
        <div>
          <h3 className="mb-2 text-center text-base font-medium text-white">
            Distanciamento da Sobrancelhas: + Medida horizontal
          </h3>
          <div className="flex w-full justify-evenly gap-4">
            <div className="flex flex-col items-center">
              <Image
                className="h-[76px] w-full object-contain"
                src={SobrancelhaCurta}
                width={1200}
                height={800}
                alt={'SobrancelhaCurta'}
              />
              <p className="text-white">Curta</p>
            </div>
            <div className="flex flex-col items-center">
              <Image
                className="h-20 w-full object-contain"
                src={SobrancelhaLonga}
                width={1200}
                height={800}
                alt={'SobrancelhaLonga'}
              />
              <p className="text-white">Longa</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {[
              {
                id: 'Curto + Curto = Tamanho Pequeno',
                label: 'Curto + Curto = Tamanho Pequeno',
                description: 'Distância curta para ambas as sobrancelhas.'
              },
              {
                id: 'Longo + Curto = Tamanho Pequeno',
                label: 'Longo + Curto = Tamanho Pequeno',
                description: 'Sobrancelha longa combinada com uma curta.'
              },
              {
                id: 'Curto + Longo = Tamanho Pequeno',
                label: 'Curto + Longo = Tamanho Pequeno',
                description: 'Sobrancelha curta combinada com uma longa.'
              },
              {
                id: 'Longo + Longo = Tamanho Grande',
                label: 'Longo + Longo = Tamanho Grande',
                description: 'Distância longa para ambas as sobrancelhas.'
              }
            ].map(({ id, label, description }) => (
              <Controller
                key={id}
                name="sobrancelhaDistancia"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col items-center">
                    <input
                      {...field}
                      type="radio"
                      id={id}
                      value={id}
                      className="hidden"
                    />
                    <label
                      htmlFor={id}
                      className={`mt-2 cursor-pointer rounded-lg border-2  border-white/20 p-2 text-center text-sm transition hover:border-white ${
                        field.value === id
                          ? 'border-white bg-white text-black backdrop-blur-[20px]'
                          : 'border-transparent text-white'
                      }`}
                    >
                      {label}
                    </label>
                  </div>
                )}
              />
            ))}
          </div>
        </div>
      )
    },

    {
      id: 9,
      title: '9° - Defina a Colorimetria',
      content: (
        <div>
          <h3 className="mb-2 text-center text-lg font-medium text-white">
            Pele e Cabelo
          </h3>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {/* Seleção para Pele */}
            <div className="flex flex-col">
              <label htmlFor="pele" className="mb-1 text-white">
                Pele
              </label>
              <Controller
                name="pele"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    id="pele"
                    className="w-full rounded-lg bg-gray-800 p-2 text-white focus:outline-none focus:ring-2 focus:ring-zinc-50"
                  >
                    <option value="">Selecione</option>
                    <option value="Quente">Quente</option>
                    <option value="Frio">Frio</option>
                  </select>
                )}
              />
            </div>

            {/* Seleção para Cabelo */}
            <div className="flex flex-col">
              <label htmlFor="cabelo" className="mb-1 text-white">
                Cabelo
              </label>
              <Controller
                name="cabelo"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    id="cabelo"
                    className="w-full rounded-lg bg-gray-800 p-2 text-white focus:outline-none focus:ring-2 focus:ring-zinc-50"
                  >
                    <option value="">Selecione</option>
                    <option value="Quente">Quente</option>
                    <option value="Frio">Frio</option>
                  </select>
                )}
              />
            </div>
          </div>

          {/* Exibição do resultado da combinação */}
          <div className="mt-4">
            <h4 className="text-center text-lg font-medium text-white">
              Resultado da combinação:
            </h4>
            {/* Resultado dinâmico com base nos valores de pele e cabelo */}
            <Controller
              name="pele"
              control={control}
              render={({ field: { value: pele } }) => (
                <Controller
                  name="cabelo"
                  control={control}
                  render={({ field: { value: cabelo } }) => {
                    const resultado =
                      (pele === 'Quente' &&
                        cabelo === 'Quente' &&
                        'Marrom ou Mescla') ||
                      (pele === 'Frio' && cabelo === 'Frio' && 'Preto') ||
                      (pele === 'Frio' && cabelo === 'Quente' && 'Mescla') ||
                      (pele === 'Quente' && cabelo === 'Frio' && 'Preto') ||
                      'Não definido';

                    return (
                      <div className="mt-2 text-center text-white">
                        <span className="text-lg">{resultado}</span>
                      </div>
                    );
                  }}
                />
              )}
            />
          </div>
        </div>
      )
    },

    {
      id: 10,
      title: '10° - Defina o Temperamento',
      content: (
        <div>
          <h3 className="mb-2 text-center text-lg font-medium text-white">
            Temperamento
          </h3>
          <div className="mt-8 flex flex-col gap-4">
            {[
              {
                id: 'Colérico e Sanguíneo (Desconectados)',
                label: 'Colérico e Sanguíneo (Desconectados)'
              },
              {
                id: 'Melancólico e Fleumático (Alinhados e Naturais)',
                label: 'Melancólico e Fleumático (Alinhados e Naturais)'
              }
            ].map(({ id, label }) => (
              <Controller
                key={id}
                name="temperamento"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col items-center">
                    <input
                      {...field}
                      type="radio"
                      id={id}
                      value={id}
                      className="hidden"
                    />
                    <label
                      htmlFor={id}
                      className={`mt-2 w-full cursor-pointer rounded-lg border-2 border-white/20 px-2 py-4 text-center transition hover:border-white ${
                        field.value === id
                          ? 'border-white bg-white text-black'
                          : 'border-transparent bg-transparent text-white'
                      }`}
                    >
                      {label}
                    </label>
                  </div>
                )}
              />
            ))}
          </div>
        </div>
      )
    }
  ];

  return (
    <Drawer
      size={420}
      placement="bottom"
      open={isOpen}
      onClose={handleClose}
      dialogClassName="relative rounded-2xl backdrop-blur-[20px] bg-[#000000c6]"
      closeButton={false}
    >
      <form className="flex h-full flex-1 flex-col justify-between">
        <div className="pt-5">
          <Cross2Icon
            onClick={handleClose}
            className="absolute right-4 top-4 h-8 w-8 cursor-pointer text-white"
          />
          <p className="text-center text-2xl font-semibold text-white">
            {steps[step - 1].title}
          </p>
        </div>

        <div className="max-h-[400px] flex-1 overflow-y-auto px-4">
          {steps[step - 1].content}
        </div>

        <div className="flex justify-between px-4 py-2">
          <button
            type="button" // Garantir que este botão não tenha type="submit"
            onClick={prevStep}
            className="rounded-lg bg-gray-700 px-4 py-2 text-white"
            disabled={step === 1}
          >
            Voltar
          </button>
          {step === steps.length ? (
            <button
              type="submit"
              onClick={handleSubmit((data) => {
                if (canDownloadPDF()) {
                  generateFichaPDF(data);
                } else {
                  alert(
                    'O download do PDF só está disponível após 7 dias da criação do acesso.'
                  );
                }
              })}
              className={`rounded-lg px-4 py-2 ${
                canDownloadPDF()
                  ? 'bg-white text-black'
                  : 'bg-gray-400 text-gray-700'
              }`}
            >
              Salvar
            </button>
          ) : (
            <button
              type="button" // Garantir que este botão não tenha type="submit"
              onClick={(e) => {
                e.preventDefault(); // Previne qualquer submissão acidental
                nextStep();
              }}
              className="rounded-lg bg-white px-4 py-2 text-black"
            >
              Avançar
            </button>
          )}
        </div>
      </form>
    </Drawer>
  );
};
