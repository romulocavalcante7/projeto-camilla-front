import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateFichaPDF = (formData: any) => {
  const doc = new jsPDF();

  // Título do PDF
  doc.setFontSize(18);
  doc.text('Ficha Visagismo', 105, 20, { align: 'center' });

  doc.setFontSize(14);

  const sections = [
    {
      title: '1° - Defina a Curvatura',
      images: [
        { src: '/ficha/olhos/Amendoado.jpg', label: 'Olhos amendoado redondo' },
        { src: '/ficha/olhos/Grande.jpg', label: 'Olhos grandes' },
        {
          src: '/ficha/olhos/Pequeno-fino.jpg',
          label: 'Olhos pequeno fino'
        },
        {
          src: '/ficha/olhos/Pequeno-redondo.jpg',
          label: 'Olhos pequeno redondo'
        }
      ],
      result: formData.tipoOlho || 'Não definido'
    },
    {
      title: '2° - Profundidade',
      images: [
        {
          src: '/ficha/profundidade/profundidade-normal.jpg',
          label: 'Normal'
        },
        {
          src: '/ficha/profundidade/profundidade-proeminente.jpg',
          label: 'Proeminente'
        },
        {
          src: '/ficha/profundidade/profundidade-profundo.jpg',
          label: 'Profundo'
        }
      ],
      result: formData.profundidade || 'Não definido'
    },
    {
      title: '3° - Alinhamento',
      images: [
        {
          src: '/ficha/alinhamento/olho-linear.jpg',
          label: 'Olhos Lineares'
        },
        {
          src: '/ficha/alinhamento/olho-ascendentes.jpg',
          label: 'Olhos Ascendentes'
        },
        {
          src: '/ficha/alinhamento/olho-descendentes.jpg',
          label: 'Olhos Descendentes'
        }
      ],
      result: formData.alinhamento || 'Não definido'
    },
    {
      title: '4° - Distanciamento',
      images: [
        {
          src: '/ficha/distanciamento/olhos-normais.jpg',
          label: 'Olhos Normais'
        },
        {
          src: '/ficha/distanciamento/olhos-separados.jpg',
          label: 'Olhos Separados'
        },
        {
          src: '/ficha/distanciamento/olhos-juntos.jpg',
          label: 'Olhos Juntos'
        }
      ],
      result: formData.distanciamento || 'Não definido'
    },
    {
      title: '5° - Pálpebras Caídas',
      images: [
        {
          src: '/ficha/palpebras/palpebras-caidas.jpg',
          label: 'Pálpebras Caídas'
        },
        {
          src: '/ficha/palpebras/palpebras-encapuzadas.jpg',
          label: 'Pálpebras Encapuzadas'
        }
      ],
      result: formData.palpebras || 'Não definido'
    },
    {
      title: '6° - Curvatura dos Cílios Naturais',
      images: [
        {
          src: '/ficha/curvatura/curvatura-normal.jpg',
          label: 'Normal'
        },
        {
          src: '/ficha/curvatura/curvatura-curvado.jpg',
          label: 'Curvado'
        },
        {
          src: '/ficha/curvatura/curvatura-reto.jpg',
          label: 'Reto'
        }
      ],
      result: formData.projecao || 'Não definido'
    },
    {
      title: '7° - Distanciamento do Fio Natural',
      images: [
        {
          src: '/ficha/densidade/densidade-1mm.jpg',
          label: '1mm (Mais denso)'
        },
        {
          src: '/ficha/densidade/densidade-2mm.jpg',
          label: '2mm ou mais (Menos denso)'
        }
      ],
      result: formData.densidade || 'Não definido'
    },
    {
      title: '8° - Distanciamento da Sobrancelhas',
      images: [
        {
          src: '/ficha/sobrancelhas/sobrancelha-curta.jpg',
          label: 'Curta'
        },
        {
          src: '/ficha/sobrancelhas/sobrancelha-longa.jpg',
          label: 'Longa'
        }
      ],
      result: formData.sobrancelhaDistancia || 'Não definido'
    }
  ];

  const colorimetria = {
    title: '9° - Colorimetria e Resultado Final',
    content: `
    Pele: ${formData.pele || 'Não definido'}
    Cabelo: ${formData.cabelo || 'Não definido'}
    Resultado: ${
      (formData.pele === 'Quente' &&
        formData.cabelo === 'Quente' &&
        'Marrom ou Mescla') ||
      (formData.pele === 'Frio' && formData.cabelo === 'Frio' && 'Preto') ||
      (formData.pele === 'Frio' && formData.cabelo === 'Quente' && 'Mescla') ||
      (formData.pele === 'Quente' && formData.cabelo === 'Frio' && 'Preto') ||
      'Não definido'
    }
    `
  };

  const temperamento = {
    title: '10° - Temperamento',
    content: `${formData.temperamento || 'Não definido'}`
  };

  let itemsOnPage = 0;
  let yPosition = 40;

  sections.forEach((section) => {
    if (itemsOnPage === 2) {
      doc.addPage();
      yPosition = 40;
      itemsOnPage = 0;
    }

    doc.text(section.title, 10, yPosition);
    yPosition += 10;

    if (section.images.length === 3) {
      // Centraliza as três imagens horizontalmente

      const totalWidth = 3 * 50 + 2 * 10; // Largura total das imagens e espaçamentos
      const startX = (210 - totalWidth) / 2; // Calcula o ponto inicial centralizado
      section.images.forEach(({ src, label }, index) => {
        const xPosition = startX + index * (50 + 10); // Posiciona as imagens

        if (
          section.title === '3° - Alinhamento' ||
          section.title === '4° - Distanciamento'
        ) {
          doc.addImage(src, 'JPEG', xPosition - 8, yPosition, 60, 30);
          doc.text(label, xPosition + 5, yPosition + 40);
        } else {
          doc.addImage(src, 'JPEG', xPosition, yPosition, 50, 50);
          doc.text(label, xPosition + 17, yPosition + 55);
        }
      });
      yPosition += 70; // Ajustar a posição para o próximo bloco
    } else {
      // Quatro ou menos imagens em 2x2
      let blockWidth;
      if (
        section.title === '8° - Distanciamento da Sobrancelhas' ||
        section.title === '5° - Pálpebras Caídas'
      ) {
        blockWidth = 2 * 60 + 50;
      } else {
        blockWidth = 2 * 50 + 50; // Largura do bloco 2x2 com espaçamentos
      }
      const startX = (210 - blockWidth) / 2; // Centraliza o bloco horizontalmente
      section.images.forEach(({ src, label }, index) => {
        const xPosition = startX + (index % 2) * 90; // Duas imagens por linha
        const adjustedY = yPosition + Math.floor(index / 2) * 60; // Nova linha a cada 2 imagens
        let imageWidth;
        if (
          section.title === '8° - Distanciamento da Sobrancelhas' ||
          section.title === '5° - Pálpebras Caídas'
        ) {
          imageWidth = 80;
        } else {
          imageWidth = 60; // Largura da imagem
        }

        const textXPosition =
          xPosition + imageWidth / 2 - doc.getTextWidth(label) / 2; // Centraliza o texto em relação à imagem

        doc.addImage(src, 'JPEG', xPosition, adjustedY, imageWidth, 50);

        doc.text(label, textXPosition, adjustedY + 55); // Ajusta o texto para ficar centralizado
      });
      yPosition += 120; // Ajustar a posição para o próximo bloco
    }
    let positionResult;
    if (
      section.title === '5° - Pálpebras Caídas' ||
      section.title === '7° - Distanciamento do Fio Natural' ||
      section.title === '8° - Distanciamento da Sobrancelhas'
    ) {
      positionResult = yPosition - 40;
    } else {
      positionResult = yPosition + 6;
    }
    doc.setFont('helvetica', 'bold');
    doc.text(`Resultado: ${section.result}`, 10, positionResult);
    doc.setFont('helvetica', 'normal');
    yPosition += 20;
    itemsOnPage++;
  });

  // Adicionar Colorimetria e Temperamento
  if (itemsOnPage === 2) {
    doc.addPage();
    yPosition = 40;
  }
  doc.text(colorimetria.title, 10, yPosition);
  yPosition += 10;

  doc.text(colorimetria.content, 10, yPosition);

  yPosition += 50;
  doc.text(temperamento.title, 10, yPosition);
  doc.text(temperamento.content, 10, yPosition + 10);

  // Salvar o PDF
  doc.save('ficha-visagismo.pdf');
};
