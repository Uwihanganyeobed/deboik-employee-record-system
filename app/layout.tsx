import { NextAuthProvider } from '@/providers/NextAuthProvider';
import './globals.css';

export const metadata = {
  title: 'Employee Management System',
  description: 'Manage your employees efficiently',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col">
          <main className="flex-1 flex flex-col">
            <NextAuthProvider>{children}</NextAuthProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
