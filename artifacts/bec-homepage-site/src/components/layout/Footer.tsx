import { Link } from 'wouter';
import { Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bec-footer">
      <div className="bec-footer-content">
        <div className="bec-footer-brand">
          <div className="bec-footer-mark">BEC</div>
          <div>
            <div className="bec-footer-name">BANGLADESH EXECUTIVE CHAMBER</div>
            <div className="bec-footer-tagline">Promoting Brands. Empowering Careers.</div>
          </div>
        </div>

        <div className="bec-footer-links">
          <div className="bec-footer-col">
            <h4>Quick Links</h4>
            <Link href="/">Home</Link>
            <Link href="/about">About Us</Link>
            <Link href="/services">Our Services</Link>
            <Link href="/community">Community</Link>
            <Link href="/events">Events</Link>
            <Link href="/reviews">Reviews</Link>
            <Link href="/resources">Resources</Link>
            <Link href="/contact">Contact Us</Link>
          </div>
          <div className="bec-footer-col">
            <h4>Follow Us</h4>
            <a href="https://www.linkedin.com/company/bangladesh-executive-chamber/" target="_blank" rel="noopener noreferrer" className="bec-footer-social">
              <Linkedin size={18} /> LinkedIn
            </a>
          </div>
        </div>
      </div>
      <div className="bec-footer-bottom">
        <p>&copy; {new Date().getFullYear()} Bangladesh Executive Chamber. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
