import { Users, BriefcaseBusiness, GraduationCap, Network, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import PageTransition from '@/components/layout/PageTransition';

const services = [
  {
    id: 'talent',
    icon: Users,
    title: 'Talent Acquisition & HR',
    desc: 'Connecting skilled professionals with reputable organizations. Building high-performing teams.',
    features: [
      'CV screening and evaluation',
      'Strategic job matching',
      'Comprehensive HR consulting',
      'Candidate shortlisting',
      'Interview coordination',
    ],
  },
  {
    id: 'consulting',
    icon: BriefcaseBusiness,
    title: 'Business Consulting',
    desc: 'Strategic guidance for business development, sales, and corporate marketing.',
    features: [
      'Sales strategy development',
      'Marketing operations optimization',
      'Brand positioning & identity',
      'In-depth market research',
      'Corporate growth planning',
    ],
  },
  {
    id: 'training',
    icon: GraduationCap,
    title: 'Training & Workshops',
    desc: 'Sessions on soft skills, leadership, and technical career readiness.',
    features: [
      'Effective communication skills',
      'Leadership & management training',
      'Professional CV building',
      'Interview preparation & tactics',
      'Personalized career coaching',
    ],
  },
  {
    id: 'networking',
    icon: Network,
    title: 'Networking Platforms',
    desc: 'Facilitating meaningful connections through digital media and exclusive events.',
    features: [
      'Professional visibility enhancement',
      'LinkedIn profile growth',
      'Exclusive industry events',
      'Peer-to-peer collaboration',
      'Direct mentor access',
    ],
  },
];

export default function Services() {
  return (
    <PageTransition className="bec-services-page">
      {/* Hero Section */}
      <section className="bec-services-hero">
        <div className="bec-services-hero-content">
          <h1 className="bec-page-title">
            What <span>We Do</span>
          </h1>
          <p className="bec-page-subtitle">
            Comprehensive solutions for individuals and organizations aiming for excellence.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bec-services-main">
        <div className="bec-container">
          <div className="bec-services-list">
            {services.map((svc) => {
              const Icon = svc.icon;
              return (
                <div key={svc.id} className="bec-service-detail-card" id={svc.id}>
                  <div className="bec-service-detail-icon">
                    <Icon size={32} />
                  </div>
                  <div className="bec-service-detail-content">
                    <h2>{svc.title}</h2>
                    <p className="bec-service-desc">{svc.desc}</p>
                    <ul className="bec-service-features">
                      {svc.features.map((feature, idx) => (
                        <li key={idx}>
                          <ArrowRight size={14} className="feature-bullet" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link href="/contact" className="bec-service-cta">
                      Get Started
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
