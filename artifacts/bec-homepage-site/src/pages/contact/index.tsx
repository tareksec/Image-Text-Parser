import { useState } from 'react';
import { Mail, MapPin, Linkedin, Phone } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import { publicApi } from '@/lib/publicApi';
import { toast } from 'sonner';

export default function Contact() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await publicApi.contact.submit({ name, email, phone, subject, message });
      toast.success('Your message has been sent successfully!');
      setName(''); setEmail(''); setPhone(''); setSubject(''); setMessage('');
    } catch (err) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const faqs = [
    {
      q: "What is Bangladesh Executive Chamber?",
      a: "BEC is a professional ecosystem for corporate growth, career development, and professional networking."
    },
    {
      q: "Who can join BEC?",
      a: "Fresh graduates, working professionals, entrepreneurs, and corporates from various industries are welcome."
    },
    {
      q: "What services does BEC offer?",
      a: "We offer Talent Acquisition, Business Consulting, Training & Workshops, and Networking Platforms."
    },
    {
      q: "How do I register for events?",
      a: "Visit the Training & Events page and click Register on any upcoming event."
    },
    {
      q: "Is BEC only for Dhaka-based professionals?",
      a: "No. BEC operates Nationwide across Bangladesh, supporting professionals from all districts."
    }
  ];

  return (
    <PageTransition className="bec-contact-page">
      <section className="bec-page-header py-20 bg-gray-50 text-center">
        <div className="bec-container">
          <h1 className="bec-page-title">
            Get in <span>Touch</span>
          </h1>
          <p className="bec-page-subtitle mx-auto">
            Have questions about our services or memberships? We're here to help.
          </p>
        </div>
      </section>

      <section className="bec-section py-20">
        <div className="bec-container">
          <div className="bec-contact-layout">
            
            {/* Info Column */}
            <div className="bec-contact-info-col">
              <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
              
              <div className="bec-info-card">
                <div className="info-icon"><MapPin /></div>
                <div>
                  <h4>Location</h4>
                  <p>Dhaka, Bangladesh</p>
                </div>
              </div>
              
              <div className="bec-info-card">
                <div className="info-icon"><Mail /></div>
                <div>
                  <h4>Email Us</h4>
                  <p>info@b-e-c.org</p>
                </div>
              </div>

              <div className="bec-info-card">
                <div className="info-icon"><Linkedin /></div>
                <div>
                  <h4>LinkedIn</h4>
                  <a href="https://www.linkedin.com/company/bangladesh-executive-chamber/" target="_blank" rel="noopener noreferrer" className="text-green-700 font-semibold hover:underline">
                    bangladesh-executive-chamber
                  </a>
                </div>
              </div>

              <div className="bec-faq-container mt-16">
                <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                <div className="bec-accordion">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className={`accordion-item ${activeFaq === idx ? 'active' : ''}`}>
                      <button className="accordion-header" onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}>
                        {faq.q}
                        <span className="accordion-icon">{activeFaq === idx ? '-' : '+'}</span>
                      </button>
                      <div className="accordion-body">
                        <div className="accordion-content">{faq.a}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="bec-contact-form-col">
              <div className="bec-form-card p-10 shadow-xl border-none">
                <h3 className="text-2xl mb-2">Send us a Message</h3>
                <p className="text-gray-500 mb-8">Fill out the form below and our team will get back to you.</p>
                
                <form onSubmit={handleSubmit} className="bec-form">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input type="text" required value={name} onChange={e => setName(e.target.value)} className="bec-input" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="bec-input" />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="bec-input" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Subject *</label>
                    <input type="text" required value={subject} onChange={e => setSubject(e.target.value)} className="bec-input" />
                  </div>
                  
                  <div className="form-group">
                    <label>Message *</label>
                    <textarea required rows={5} value={message} onChange={e => setMessage(e.target.value)} className="bec-input" />
                  </div>
                  
                  <button type="submit" disabled={submitting} className="bec-primary w-full justify-center mt-4 h-12">
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </PageTransition>
  );
}
