'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { StaticImageData } from 'next/image';

interface ImageCompareProps {
  firstImage?: StaticImageData | undefined;
  secondImage?: StaticImageData | undefined;
  firstImageClassName?: string;
  secondImageClassname?: string;
  className?: string;
  slideMode?: string;
}

const ImageCompare: React.FC<ImageCompareProps> = ({
  firstImage,
  secondImage,
  className,
  slideMode
}) => {
  const [sliderX, setSliderX] = useState(50); // Slider inicia no centro (50%)
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
      setSliderX(percent);
    },
    [containerRef]
  );

  const handleTouchMove = useCallback(
    (event: React.TouchEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = event.touches[0].clientX - rect.left;
      const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
      setSliderX(percent);
    },
    [containerRef]
  );

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      style={{
        width: '100%',
        height: '400px',
        position: 'relative'
      }}
    >
      {/* Segunda imagem: Sempre visível no fundo */}
      <img
        src={secondImage}
        alt="Second Image"
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      {/* Primeira imagem: Clip-path dinâmico */}
      <motion.div
        className="absolute inset-0"
        style={{
          clipPath: `inset(0 ${100 - sliderX}% 0 0)`
        }}
      >
        <img
          src={firstImage}
          alt="First Image"
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
      </motion.div>

      {/* Slider */}
      <motion.div
        className={`absolute bottom-0 top-0 z-10 w-1 bg-blue-500`}
        style={{
          left: `${sliderX}%`
        }}
      >
        {/* Handle */}
        <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-md" />
      </motion.div>
    </div>
  );
};

export default ImageCompare;
