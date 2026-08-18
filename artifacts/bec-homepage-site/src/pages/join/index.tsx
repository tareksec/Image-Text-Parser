import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import { publicApi } from '@/lib/publicApi';

type Tier = 'basic' | 'professional' | 'corporate';

export default function Join() {
  const [selectedTier, setSelectedTier] = useState<Tier>('basic');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [designation, setDesignation] = useState('');
  const [message, setMessage] = useState('');

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await publicApi.members.join({
        fullName,
        email,
        phone,
        company,
        designation,
        tier: selectedTier,
        message, // note: backend schema might drop message if not in DB, but it's safe to send
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert('Failed to submit application. Please check your data.');
    } finally {
      setSubmitting(false);
    }
  };

  const tiers = [
    {
      id: 'basic' as Tier,
      name: 'BASIC',
      price: 'Free',
      features: ['Access to job alerts', 'Community feed access', 'Monthly newsletter'],
      cta: 'Join Free'
    },
    {
      id: 'professional' as Tier,
      name: 'PROFESSIONAL',
      price: 'Premium',
      features: ['Everything in Basic', 'Profile feature on community page', 'Priority event registration', 'Career consulting session'],
      cta: 'Get Started'
    },
    {
      id: 'corporate' as Tier,
      name: 'CORPORATE',
      price: 'Enterprise',
      features: ['Everything in Professional', 'Talent acquisition support', 'Business consulting access', 'Brand visibility on BEC platforms'],
      cta: 'Contact Us'
    }
  ];

  if (submitted) {
    return (
      <PageTransition className="bec-join-page py-32 text-center">
        <div className="bec-container max-w-xl">
          <div className="w-24 h-24 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-4xl font-extrabold mb-4 text-[#14202d]">Thank You for Joining!</h1>
          <p className="text-gray-600 text-lg mb-8">
            We have received your application. Our team will review your details and get back to you shortly regarding your membership status.
          </p>
          <button onClick={() => window.location.href = '/'} className="bec-primary">
            Return to Home
          </button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="bec-join-page">
      <section className="bec-page-header py-20 bg-gray-50 text-center">
        <div className="bec-container">
          <h1 className="bec-page-title">
            Become a <span>Member</span>
          </h1>
          <p className="bec-page-subtitle mx-auto">
            Choose the membership tier that fits your professional goals and gain exclusive access to the BEC ecosystem.
          </p>
        </div>
      </section>

      <section className="bec-section py-20">
        <div className="bec-container">
          
          {/* Tiers */}
          <div className="bec-pricing-grid mb-24">
            {tiers.map((tier) => (
              <div 
                key={tier.id} 
                className={`bec-pricing-card ${selectedTier === tier.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedTier(tier.id);
                  document.getElementById('join-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <div className="tier-header">
                  <h3>{tier.name}</h3>
                  <div className="tier-price">{tier.price}</div>
                </div>
                <ul className="tier-features">
                  {tier.features.map((f, i) => (
                    <li key={i}><CheckCircle2 size={16} /> {f}</li>
                  ))}
                </ul>
                <button className={`w-full justify-center ${selectedTier === tier.id ? 'bec-primary' : 'bec-secondary'}`}>
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Form */}
          <div id="join-form" className="max-w-3xl mx-auto">
            <div className="bec-form-card p-10 shadow-xl border-none">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold">Membership Application</h3>
                <p className="text-gray-500">You are applying for the <strong className="text-[#08735d] uppercase">{selectedTier}</strong> tier.</p>
              </div>

              <form onSubmit={handleJoin} className="bec-form">
                <div className="grid grid-cols-2 gap-6">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} className="bec-input" />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="bec-input" />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="bec-input" />
                  </div>
                  <div className="form-group">
                    <label>Company / Organization</label>
                    <input type="text" value={company} onChange={e => setCompany(e.target.value)} className="bec-input" />
                  </div>
                  <div className="form-group col-span-2">
                    <label>Current Designation</label>
                    <input type="text" value={designation} onChange={e => setDesignation(e.target.value)} className="bec-input" />
                  </div>
                  <div className="form-group col-span-2">
                    <label>Why do you want to join BEC?</label>
                    <textarea rows={4} value={message} onChange={e => setMessage(e.target.value)} className="bec-input" />
                  </div>
                </div>
                
                <button type="submit" disabled={submitting} className="bec-primary w-full justify-center mt-8 h-12 text-lg">
                  {submitting ? 'Submitting Application...' : 'Submit Application'}
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>
    </PageTransition>
  );
}
