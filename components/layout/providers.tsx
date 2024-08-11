'use client';
import React from 'react';
import ThemeProvider from './ThemeToggle/theme-provider';
import { AuthProvider } from '@/contexts/auth-context';
import { Toaster } from 'react-hot-toast';
import { ClipboardProvider } from '@/contexts/ClipboardContext';
import { CustomProvider } from 'rsuite';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster />
      <AuthProvider>
        <CustomProvider>
          <ClipboardProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
            </ThemeProvider>
          </ClipboardProvider>
        </CustomProvider>
      </AuthProvider>
    </>
  );
}
