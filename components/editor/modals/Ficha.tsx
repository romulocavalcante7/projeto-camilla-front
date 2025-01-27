import React, { useState } from 'react';
import { Drawer } from 'rsuite';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useCanvasEditorStore } from '@/store/canvasEditorStore';
import { useForm, Controller } from 'react-hook-form';
import Image from 'next/image';
import Amendoado from '@/app/assets/ficha/olhos/Amendoado.png';
import PequenoFino from '@/app/assets/ficha/olhos/Pequeno-fino.png';
import Grande from '@/app/assets/ficha/olhos/Grande.png';
import PequenoRedondo from '@/app/assets/ficha/olhos/Pequeno-redondo.png';

import PequenoNormal from '@/app/assets/ficha/profundidade/profundidade-normal.png';
import PequenoProeminente from '@/app/assets/ficha/profundidade/profundidade-proeminente.png';
import PequenoProfundo from '@/app/assets/ficha/profundidade/profundidade-profundo.png';

import OlhoLinear from '@/app/assets/ficha/alinhamento/olho-linear.png';
import OlhoAscendente from '@/app/assets/ficha/alinhamento/olho-ascendentes.png';
import OlhoDescendentes from '@/app/assets/ficha/alinhamento/olho-descendentes.png';

import OlhoNormais from '@/app/assets/ficha/distanciamento/olhos-normais.png';
import OlhoSeparados from '@/app/assets/ficha/distanciamento/olhos-separados.png';
import OlhoJuntos from '@/app/assets/ficha/distanciamento/olhos-juntos.png';

import PalpebrasCaidas from '@/app/assets/ficha/palpebras/palpebras-caidas.png';
import PalpebrasEncapuzadas from '@/app/assets/ficha/palpebras/palpebras-encapuzadas.png';

import CurvaturaNormal from '@/app/assets/ficha/curvatura/curvatura-normal.png';
import CurvaturaCurvado from '@/app/assets/ficha/curvatura/curvatura-curvado.png';
import CurvaturaReto from '@/app/assets/ficha/curvatura/curvatura-reto.png';

import Desidade1mm from '@/app/assets/ficha/densidade/densidade-1mm.png';
import Desidade2mm from '@/app/assets/ficha/densidade/densidade-2mm.png';

import SobrancelhaCurta from '@/app/assets/ficha/sobrancelhas/sobrancelha-curta.png';
import SobrancelhaLonga from '@/app/assets/ficha/sobrancelhas/sobrancelha-longa.png';
// import { cn } from '@/lib/utils';

interface FichaModalProps {
  saveChanges: () => void;
}

export const FichaModal = ({ saveChanges }: FichaModalProps) => {
  const { isFichaModalOpen: isOpen, setIsFichaModalOpen: onClose } =
    useCanvasEditorStore();
  const [step, setStep] = useState(1);
  const { control, handleSubmit } = useForm();

  const handleClose = () => {
    onClose(false);
    saveChanges();
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
                id: 'amendoado-redondo',
                label: 'Olhos amendoado redondo',
                src: Amendoado
              },
              { id: 'grande', label: 'Olhos grandes', src: Grande },
              {
                id: 'pequeno-fino',
                label: 'Olhos pequeno fino',
                src: PequenoFino
              },
              {
                id: 'pequeno-redondo',
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
                      className="h-20 w-20 object-cover"
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
      title: '1° - Defina a Profundidade',
      content: (
        <div>
          <h3 className="mb-2 text-center text-lg font-medium text-white">
            Profundidade
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'normal', label: 'Normal', src: PequenoNormal },
              {
                id: 'proeminente',
                label: 'Proeminente',
                src: PequenoProeminente
              },
              { id: 'profundo', label: 'Profundo', src: PequenoProfundo }
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
                      className="h-20 w-20 object-cover"
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
      title: '2° - Defina o Alinhamento',
      content: (
        <div>
          <h3 className="mb-2 text-center text-lg font-medium text-white">
            Alinhamentos
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'lineares', label: 'Olhos Lineares', src: OlhoLinear },
              {
                id: 'ascendentes',
                label: 'Olhos Ascendentes',
                src: OlhoAscendente
              },
              {
                id: 'descendentes',
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
                      className="h-20 w-full object-contain"
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
      title: '2° - Defina o Alinhamento',
      content: (
        <div>
          <h3 className="mb-2 mt-6 text-center text-lg font-medium text-white">
            Distanciamento
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'normal', label: 'Olhos Normais', src: OlhoNormais },
              { id: 'separado', label: 'Olhos Separados', src: OlhoSeparados },
              { id: 'proximo', label: 'Olhos Juntos', src: OlhoJuntos }
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
                      className="h-20 w-full object-contain"
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
      title: '2° - Defina o Alinhamento',
      content: (
        <div>
          <h3 className="mb-2 mt-6 text-center text-lg font-medium text-white">
            Pálpebras Caídas
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { id: 'sim', label: 'Pálpebras Caídas', src: PalpebrasCaidas },
              {
                id: 'nao',
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
      title: '3° - Defina a Projeção',
      content: (
        <div>
          <h3 className="mb-2 text-center text-lg font-medium text-white">
            Curvatura dos Cílios Naturais
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'reto', label: 'Reto', src: CurvaturaReto },
              { id: 'curvado', label: 'Curvado', src: CurvaturaCurvado },
              { id: 'normal', label: 'Normal', src: CurvaturaNormal }
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
      title: '4° - Defina a Densidade',
      content: (
        <div>
          <h3 className="mb-2 text-center text-lg font-medium text-white">
            Distanciamento do Fio Natural
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { id: '1mm', label: '1mm (Mais denso)', src: Desidade1mm },
              {
                id: '2mm',
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
      title: '4° - Defina Tamanhos',
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
                id: 'curto-curto',
                label: 'Curto + Curto = Tamanho Pequeno',
                description: 'Distância curta para ambas as sobrancelhas.'
              },
              {
                id: 'longo-curto',
                label: 'Longo + Curto = Tamanho Pequeno',
                description: 'Sobrancelha longa combinada com uma curta.'
              },
              {
                id: 'curto-longo',
                label: 'Curto + Longo = Tamanho Pequeno',
                description: 'Sobrancelha curta combinada com uma longa.'
              },
              {
                id: 'longo-longo',
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
      title: '6° - Defina a Colorimetria',
      content: (
        <div>
          <h3 className="mb-2 text-center text-lg font-medium text-white">
            Pele e Cabelo
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="pele" className="mb-1 text-white">
                Pele
              </label>
              <input
                id="pele"
                type="text"
                placeholder="Ex.: Quente, Frio"
                className="w-full rounded-lg bg-gray-800 p-2 text-white focus:outline-none focus:ring-2 focus:ring-zinc-50"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="cabelo" className="mb-1 text-white">
                Cabelo
              </label>
              <input
                id="cabelo"
                type="text"
                placeholder="Ex.: Claro, Escuro"
                className="w-full rounded-lg bg-gray-800 p-2 text-white focus:outline-none focus:ring-2 focus:ring-zinc-50"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 10,
      title: '8° - Defina o Temperamento',
      content: (
        <div>
          <h3 className="mb-2 text-center text-lg font-medium text-white">
            Temperamento
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { id: 'colerico', label: 'Colérico e Sanguíneo (Desconectados)' },
              {
                id: 'melancolico',
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
                      className={`mt-2 cursor-pointer rounded-lg border-2  border-white/20 p-2 text-center transition hover:border-white ${
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
                handleClose();
              })}
              className="rounded-lg bg-white px-4 py-2 text-black"
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
