import "./globals.css";

export const metadata = {
  title: "SARFA La Bisbal - Encara esperes?",
  description: "Eina de protesta ciutadana pel mal servei de l'autobús Sarfa a La Bisbal d'Empordà.",
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
