import { useState, useEffect } from 'react';
import { Target, TrendingUp, Users, Lightbulb, UserCog, Linkedin } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import { teamApi } from '@/lib/adminApi';

interface TeamMember {
  id: number;
  name: string;
  designation: string;
  photoUrl: string | null;
  linkedinUrl: string | null;
  displayOrder: number;
}

const objectives = [
  {
    icon: TrendingUp,
    title: 'Career Empowerment',
    desc: 'Equipping professionals with the skills and opportunities they need to excel in their careers.',
  },
  {
    icon: Target,
    title: 'Professional Branding',
    desc: 'Helping individuals and companies define, enhance, and leverage their brand presence in the market.',
  },
  {
    icon: Lightbulb,
    title: 'Corporate Solutions',
    desc: 'Providing expert consulting in sales, marketing, and HR to drive business growth and operational excellence.',
  },
  {
    icon: Users,
    title: 'Community Building',
    desc: 'Fostering a strong network of leaders, innovators, and young professionals for collaborative success.',
  },
];

const milestones = [
  { year: 'Vision', title: 'Founded with a mission to bridge talent and industry' },
  { year: '10K+', title: 'Professionals onboarded and connected' },
  { year: '500+', title: 'Partner organizations across Bangladesh' },
  { year: '150+', title: 'Workshops and training sessions delivered' },
];

export default function About() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeam() {
      try {
        const data = await teamApi.list();
        setTeam(data.team || []);
      } catch (err) {
        console.error('Failed to load team', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTeam();
  }, []);

  return (
    <PageTransition className="bec-about">
      {/* Hero Section */}
      <section className="bec-about-hero">
        <div className="bec-about-hero-content">
          <h1 className="bec-page-title">
            Who <span>We Are</span>
          </h1>
          <p className="bec-page-subtitle">
            Promoting Brands. Empowering Careers.
          </p>
          <p className="bec-about-vision">
            Our vision is to build a professional ecosystem where growth is accessible to all, bridging the gap between exceptional talent and industry-leading organizations.
          </p>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="bec-about-section bg-gray-50">
        <div className="bec-container">
          <h2 className="bec-section-title">Our Objectives</h2>
          <div className="bec-objectives-grid">
            {objectives.map((obj, i) => {
              const Icon = obj.icon;
              return (
                <div key={i} className="bec-objective-card">
                  <div className="bec-objective-icon">
                    <Icon size={24} />
                  </div>
                  <h3>{obj.title}</h3>
                  <p>{obj.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="bec-about-section">
        <div className="bec-container">
          <h2 className="bec-section-title">Our Impact</h2>
          <div className="bec-timeline">
            {milestones.map((m, i) => (
              <div key={i} className="bec-timeline-item">
                <div className="bec-timeline-marker"></div>
                <div className="bec-timeline-content">
                  <div className="bec-timeline-year">{m.year}</div>
                  <p className="bec-timeline-desc">{m.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bec-about-section bg-gray-50">
        <div className="bec-container">
          <h2 className="bec-section-title">Meet Our Team</h2>
          <div className="bec-team-grid">
            {loading ? (
              <div className="bec-team-loading">Loading team members...</div>
            ) : team.length === 0 ? (
              <div className="bec-team-empty">
                <UserCog size={48} />
                <p>Team members will be displayed here.</p>
              </div>
            ) : (
              team.map((member) => (
                <div key={member.id} className="bec-team-card">
                  <div className="bec-team-photo">
                    {member.photoUrl ? (
                      <img src={member.photoUrl} alt={member.name} />
                    ) : (
                      <div className="bec-team-avatar">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="bec-team-info">
                    <h3>{member.name}</h3>
                    <p>{member.designation}</p>
                    {member.linkedinUrl && (
                      <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="bec-team-social">
                        <Linkedin size={18} />
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
