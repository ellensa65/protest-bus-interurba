import "./globals.css";

export const metadata = {
  title: "El bus no es toca",
  description: "Eina de protesta ciutadana pel mal servei de l'autobús interurbà a Comarques Gironines",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ca">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
