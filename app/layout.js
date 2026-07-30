import './globals.css';

export const metadata = {
  title: 'GameMyKisah',
  description: 'Situs download game hasil translate Bahasa Indonesia',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
