import React from 'react';
import Header from '../components/header/Header';
import ScrollToTop from '../components/ScrollToTop';

interface AppLayoutProps {
  children: React.ReactNode;
}

function DefaultLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 font-sans">
      <Header />
      <ScrollToTop />
      {/* FIX: The main tag no longer has padding, allowing child elements to be full-width */}
      <main>
        {children}
      </main>
    </div>
  );
}

export default DefaultLayout;
