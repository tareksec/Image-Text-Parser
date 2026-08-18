import { type ReactNode, useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }: { children: ReactNode }) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bec-page" id="top">
      <div className="bec-shell">
        <Navbar />
        <main className="bec-main-content">
          {children}
        </main>
        <Footer />
        
        {showScrollTop && (
          <button 
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 w-12 h-12 bg-[#c09643] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#a88235] transition-all z-50"
            aria-label="Scroll to top"
          >
            <ArrowUp size={24} />
          </button>
        )}
      </div>
    </div>
  );
}
