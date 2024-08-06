import React, { createContext, useState, ReactNode, useEffect } from 'react';

interface ClipboardContextProps {
  clipboardHexColor: string;
  setClipboardHexColor: React.Dispatch<React.SetStateAction<string>>;
}

export const ClipboardContext = createContext<ClipboardContextProps>({
  clipboardHexColor: '',
  setClipboardHexColor: () => {}
});

export const ClipboardProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [clipboardHexColor, setClipboardHexColor] = useState<string>('');

  useEffect(() => {
    const savedColor = localStorage.getItem('clipboardHexColor');
    if (savedColor) {
      setClipboardHexColor(savedColor);
    }
  }, []);

  useEffect(() => {
    if (clipboardHexColor) {
      localStorage.setItem('clipboardHexColor', clipboardHexColor);
    }
  }, [clipboardHexColor]);

  return (
    <ClipboardContext.Provider
      value={{ clipboardHexColor, setClipboardHexColor }}
    >
      {children}
    </ClipboardContext.Provider>
  );
};
