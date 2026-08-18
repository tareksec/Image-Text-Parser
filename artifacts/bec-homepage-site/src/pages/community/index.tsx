import { useState, useEffect } from 'react';
import { Building2, Landmark, UsersRound, BriefcaseBusiness, Globe2, Quote } from 'lucide-react';
import { Link } from 'wouter';
import PageTransition from '@/components/layout/PageTransition';
import { publicApi, type CommunityStats, type Member } from '@/lib/publicApi';

const focusAreas = [
  'Real Estate',
  'FMCG',
  'Digital Marketing',
  'Corporate HR',
  'Business Development',
];

const fallbackStats = [
  { value: '10,000+', label: 'Professionals' },
  { value: '500+', label: 'Partner Organizations' },
  { value: '2,000+', label: 'Career Opportunities' },
  { value: '150+', label: 'Training & Workshops' },
  { value: 'Nationwide', label: 'Impact' },
];

export default function Community() {
  const [stats, setStats] = useState<CommunityStats[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, membersData] = await Promise.all([
          publicApi.community.getStats(),
          publicApi.community.getMembers(),
        ]);
        setStats(statsData.stats);
        setMembers(membersData.members);
      } catch (err) {
        console.error('Failed to load community data', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const displayStats = stats.length > 0 ? stats : fallbackStats;

  return (
    <PageTransition className="bec-community-page">
      {/* Hero Section */}
      <section className="bec-community-hero">
        <div className="bec-container">
          <h1 className="bec-page-title">
            Join a Thriving <span>Professional Community</span>
          </h1>
          <p className="bec-page-subtitle mx-auto text-center">
            Connect, collaborate, and grow with thousands of ambitious professionals across Bangladesh.
          </p>
        </div>
      </section>

      {/* Live Stats Bar */}
      <section className="bec-stats" aria-label="BEC impact metrics" style={{ marginTop: '-40px' }}>
        {displayStats.map((stat, i) => (
          <div className="bec-stat" key={i}>
            <div className="bec-stat-icon">
              {i === 0 ? <UsersRound /> : i === 1 ? <Building2 /> : i === 2 ? <BriefcaseBusiness /> : i === 3 ? <Landmark /> : <Globe2 />}
            </div>
            <div>
              <div className="bec-stat-value">{stat.value}</div>
              <div className="bec-stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Member Spotlight */}
      <section className="bec-section py-20">
        <div className="bec-container">
          <h2 className="bec-section-title">Member Spotlight</h2>
          <div className="bec-member-grid">
            {loading ? (
              <div className="col-span-full text-center py-12 text-gray-500">Loading members...</div>
            ) : members.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                Our community is growing. Become the first spotlight member!
              </div>
            ) : (
              members.map((member) => (
                <div key={member.id} className="bec-member-card">
                  <div className="bec-member-avatar">
                    {member.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="bec-member-info">
                    <h3>{member.fullName}</h3>
                    {member.designation && <p className="designation">{member.designation}</p>}
                    {member.company && <p className="company">{member.company}</p>}
                  </div>
                  <div className={`bec-tier-badge tier-${member.tier}`}>
                    {member.tier.toUpperCase()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="bec-section py-20 bg-gray-50">
        <div className="bec-container">
          <h2 className="bec-section-title">Success Stories</h2>
          <div className="bec-stories-grid">
            <div className="bec-story-card">
              <Quote className="quote-icon" size={32} />
              <p className="story-text">"BEC helped me land my dream role in the FMCG industry. The support and guidance were unparalleled."</p>
              <div className="story-author">
                <strong>Rahim Uddin</strong>
                <span>Brand Manager, FMCG Corp</span>
              </div>
            </div>
            <div className="bec-story-card">
              <Quote className="quote-icon" size={32} />
              <p className="story-text">"The networking events opened doors I didn't know existed. I've met incredible mentors here."</p>
              <div className="story-author">
                <strong>Nusrat Jahan</strong>
                <span>Marketing Lead, TechNova</span>
              </div>
            </div>
            <div className="bec-story-card">
              <Quote className="quote-icon" size={32} />
              <p className="story-text">"Business consulting from BEC completely transformed our sales team's approach and results."</p>
              <div className="story-author">
                <strong>Arif Hossain</strong>
                <span>Sales Director, Retail BD</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="bec-section py-20">
        <div className="bec-container text-center">
          <h2 className="bec-section-title">Community Focus Areas</h2>
          <div className="bec-focus-areas">
            {focusAreas.map((area, i) => (
              <span key={i} className="focus-pill">{area}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bec-cta-section py-20 text-center">
        <div className="bec-container">
          <h2 className="text-3xl font-extrabold mb-6">Ready to Accelerate Your Career?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Join the Bangladesh Executive Chamber today and gain access to exclusive events, mentorship, and career opportunities.</p>
          <Link href="/join" className="bec-primary inline-flex">
            Become a Member
          </Link>
        </div>
      </section>
    </PageTransition>
  );
}
