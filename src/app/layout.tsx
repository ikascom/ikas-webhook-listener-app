import './globals.css';
import React from 'react';
// If you are using styled-components or similar theme, add the following imports:
// import { ThemeProvider } from 'styled-components';
// import { IkasThemeConfigProvider, lightTheme, locales, Toaster } from '@ikas/components';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔗</text></svg>" />
      </head>
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