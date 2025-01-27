import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateFichaPDF = (formData: any) => {
  const doc = new jsPDF();

  // Título do PDF
  doc.setFontSize(18);
  doc.text('Visagismo - Análise Personalizada', 105, 20, { align: 'center' });

  doc.setFontSize(14);

  const sections = [
    {
      title: '1° - Defina a Curvatura',
      images: [
        { src: '/ficha/olhos/Amendoado.jpg', label: 'Amendoado' },
        { src: '/ficha/olhos/Grande.jpg', label: 'Grande' },
        {
          src: '/ficha/olhos/Pequeno-fino.jpg',
          label: 'Pequeno Fino'
        },
        {
          src: '/ficha/olhos/Pequeno-redondo.jpg',
          label: 'Pequeno Redondo'
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
          label: 'Linear'
        },
        {
          src: '/ficha/alinhamento/olho-ascendentes.jpg',
          label: 'Ascendente'
        },
        {
          src: '/ficha/alinhamento/olho-descendentes.jpg',
          label: 'Descendente'
        }
      ],
      result: formData.alinhamento || 'Não definido'
    },
    {
      title: '4° - Distanciamento',
      images: [
        {
          src: '/ficha/distanciamento/olhos-normais.jpg',
          label: 'Normais'
        },
        {
          src: '/ficha/distanciamento/olhos-separados.jpg',
          label: 'Separados'
        },
        {
          src: '/ficha/distanciamento/olhos-juntos.jpg',
          label: 'Juntos'
        }
      ],
      result: formData.distanciamento || 'Não definido'
    },
    {
      title: '5° - Pálpebras Caídas',
      images: [
        {
          src: '/ficha/palpebras/palpebras-caidas.jpg',
          label: 'Caídas'
        },
        {
          src: '/ficha/palpebras/palpebras-encapuzadas.jpg',
          label: 'Encapuzadas'
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
      (formData.pele === 'quente' &&
        formData.cabelo === 'quente' &&
        'Marrom ou Mescla') ||
      (formData.pele === 'frio' && formData.cabelo === 'frio' && 'Preto') ||
      (formData.pele === 'frio' && formData.cabelo === 'quente' && 'Mescla') ||
      (formData.pele === 'quente' && formData.cabelo === 'frio' && 'Preto') ||
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
      // Três imagens na mesma linha
      section.images.forEach(({ src, label }, index) => {
        const xPosition = 10 + index * 60;
        doc.addImage(src, 'JPEG', xPosition, yPosition, 50, 50);
        doc.text(label, xPosition + 10, yPosition + 55);
      });
      yPosition += 70; // Ajustar a posição para o próximo bloco
    } else {
      // Quatro ou menos imagens em 2x2
      section.images.forEach(({ src, label }, index) => {
        const xPosition = 10 + (index % 2) * 90; // Coloca duas imagens por linha
        const adjustedY = yPosition + Math.floor(index / 2) * 60; // Nova linha a cada 2 imagens
        doc.addImage(src, 'JPEG', xPosition, adjustedY, 50, 50);
        doc.text(label, xPosition + 10, adjustedY + 55);
      });
      yPosition += 120; // Ajustar a posição para o próximo bloco
    }

    doc.text(`Resultado: ${section.result}`, 10, yPosition);
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
