import './globals.css';
import React from 'react';
// Eğer styled-components veya benzeri bir tema kullanıyorsan aşağıdaki importları ekle:
// import { ThemeProvider } from 'styled-components';
// import { IkasThemeConfigProvider, lightTheme, locales, Toaster } from '@ikas/components';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head />
      <body>
        {/*
        <ThemeProvider theme={lightTheme}>
          <IkasThemeConfigProvider locale={locales.trTR}>
            {children}
            <Toaster />
          </IkasThemeConfigProvider>
        </ThemeProvider>
        */}
        {/* Eğer yukarıdaki provider'lar yoksa, sadece children'ı render et: */}
        {children}
      </body>
    </html>
  );
} 