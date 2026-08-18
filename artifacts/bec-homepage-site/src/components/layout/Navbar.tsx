import { ChevronDown, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'wouter';

export default function Navbar() {
  const [location] = useLocation();

  return (
    <header>
      <nav className="bec-nav" aria-label="Primary navigation">
        <svg className="bec-nav-contour" viewBox="0 0 1220 67" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 1H388C419 1 441 17 462 42C475 57 484 66 506 66H1220" fill="none" stroke="#427263" strokeWidth="1" />
        </svg>
        <Link href="/" className="bec-brand" aria-label="Bangladesh Executive Chamber home" data-testid="link-brand-home">
          <div className="bec-mark" aria-hidden="true">BEC</div>
          <div className="bec-brand-rule" aria-hidden="true" />
          <div className="bec-brand-name">BANGLADESH<br />EXECUTIVE CHAMBER <span>/ BEC</span></div>
        </Link>
        <div className="bec-links">
          <Link href="/" className={location === '/' ? 'active' : ''} data-testid="link-home">Home</Link>
          <Link href="/about" className={location === '/about' ? 'active' : ''} data-testid="link-about">About Us</Link>
          <Link href="/services" className={location === '/services' ? 'active' : ''} data-testid="link-services">Our Services</Link>
          <Link href="/community" className={location === '/community' ? 'active' : ''}>Community</Link>
          <Link href="/events" className={location === '/events' ? 'active' : ''}>Events</Link>
          <Link href="/reviews" className={location === '/reviews' ? 'active' : ''}>Reviews</Link>
          <Link href="/resources" className={location === '/resources' ? 'active' : ''}>Resources</Link>
          <Link href="/contact" className={location === '/contact' ? 'active' : ''}>Contact Us</Link>
        </div>
        <Link href="/join" className="bec-join" data-testid="link-join-bec">Join BEC <ArrowRight aria-hidden="true" /></Link>
      </nav>
    </header>
  );
}
