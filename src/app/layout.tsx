import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Oaxe',
  description: 'Product Replication, Invention, Branding, and Evolution Engine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <header className="border-b border-zinc-800">
            <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
              <a href="/" className="text-xl font-bold tracking-tight">
                <span className="text-oaxe-500">O</span>axe
              </a>
              <nav className="flex items-center gap-4">
                <a
                  href="/run"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  New Run
                </a>
              </nav>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
