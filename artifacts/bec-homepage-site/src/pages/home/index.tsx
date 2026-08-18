import { ArrowRight, BarChart3, BriefcaseBusiness, Building2, Globe2, Handshake, Landmark, UsersRound } from 'lucide-react';
import { Link } from 'wouter';
import PageTransition from '@/components/layout/PageTransition';

const services = [
  { icon: UsersRound, title: 'TALENT SOLUTIONS', body: 'Connecting the right talent with the right opportunities.' },
  { icon: BriefcaseBusiness, title: 'BUSINESS CONSULTING', body: 'Strategic solutions for sales, marketing & business growth.' },
  { icon: BarChart3, title: 'TRAINING & DEVELOPMENT', body: 'Upskill, lead, and grow with industry-relevant programs.' },
  { icon: Handshake, title: 'NETWORKING & COMMUNITY', body: 'Bridging professionals and organizations for impact.' },
];

const metrics = [
  { icon: UsersRound, value: '10,000+', label: 'Professionals', sub: 'Connected' },
  { icon: Building2, value: '500+', label: 'Partner', sub: 'Organizations' },
  { icon: BriefcaseBusiness, value: '2,000+', label: 'Career Opportunities', sub: 'Shared' },
  { icon: Landmark, value: '150+', label: 'Training & Workshops', sub: 'Conducted' },
  { icon: Globe2, value: 'Nationwide', label: 'Impact Across', sub: 'Industries' },
];

export default function Home() {
  return (
    <PageTransition>
      <section className="bec-hero" aria-labelledby="bec-heading">
        <div className="bec-backdrop" aria-hidden="true" />
        <div className="bec-dots" aria-hidden="true" />
        <div className="bec-ribbon" aria-hidden="true" />
        <div className="bec-copy">
          <div className="bec-kicker">PROMOTING BRANDS. EMPOWERING CAREERS.</div>
          <h1 className="bec-title" id="bec-heading">Building People.<br />Strengthening Brands.<br /><em>Shaping Bangladesh</em></h1>
          <div className="bec-divider" aria-hidden="true" />
          <p className="bec-desc">Bangladesh Executive Chamber (BEC) is a professional ecosystem that empowers careers, strengthens brands, and drives corporate growth through consulting, talent solutions, training, and meaningful connections.</p>
          <div className="bec-actions">
            <Link href="/services" className="bec-primary" data-testid="link-explore-services">Explore Our Services <ArrowRight aria-hidden="true" /></Link>
            <Link href="/join" className="bec-secondary" data-testid="link-join-network">Join Our Network <UsersRound aria-hidden="true" /></Link>
          </div>
        </div>
        <div className="bec-art">
          <img src="/images/bec-reference.png" alt="BEC business community illustration" width="1024" height="683" />
        </div>
        <aside className="bec-services" aria-label="BEC services">
          {services.map(({ icon: Icon, title, body }) => (
            <div className="bec-service" key={title} data-testid={`service-${title.toLowerCase().replaceAll(' ', '-')}`}>
              <div className="bec-service-icon"><Icon aria-hidden="true" /></div>
              <div className="bec-service-copy"><h2>{title}</h2><p>{body}</p></div>
            </div>
          ))}
        </aside>
      </section>

      <section className="bec-stats" aria-label="BEC impact metrics">
        {metrics.map(({ icon: Icon, value, label, sub }) => (
          <div className="bec-stat" key={value} data-testid={`metric-${value.toLowerCase().replaceAll('+', '-plus').replaceAll(',', '')}`}>
            <div className="bec-stat-icon"><Icon aria-hidden="true" /></div>
            <div><div className="bec-stat-value">{value}</div><div className="bec-stat-label">{label}<br />{sub}</div></div>
          </div>
        ))}
      </section>
    </PageTransition>
  );
}
