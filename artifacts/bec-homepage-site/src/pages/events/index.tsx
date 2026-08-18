import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, X } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import { publicApi, type Event } from '@/lib/publicApi';
import { toast } from 'sonner';

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await publicApi.events.getAll();
        setEvents(data.events || []);
      } catch (err) {
        console.error('Failed to load events', err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !name || !email) return;

    setRegistering(true);
    try {
      await publicApi.events.register(selectedEvent.id, { name, email, phone });
      toast.success(`Successfully registered for ${selectedEvent.title}!`);
      closeModal();
    } catch (err) {
      toast.error('Failed to register. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setName('');
    setEmail('');
    setPhone('');
  };

  return (
    <PageTransition className="bec-events-page">
      <section className="bec-page-header py-20 bg-gray-50 text-center">
        <div className="bec-container">
          <h1 className="bec-page-title">
            Training & <span>Events</span>
          </h1>
          <p className="bec-page-subtitle mx-auto">
            Discover upcoming workshops, networking sessions, and career development events.
          </p>
        </div>
      </section>

      <section className="bec-section py-20">
        <div className="bec-container">
          <h2 className="bec-section-title text-left mb-10">Upcoming Events</h2>
          
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="bec-empty-state py-20 text-center border-2 border-dashed border-gray-200 rounded-xl">
              <Calendar size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-gray-500 text-lg">New workshops coming soon. Check back shortly.</p>
            </div>
          ) : (
            <div className="bec-events-list">
              {events.map((event) => (
                <div key={event.id} className="bec-event-card">
                  <div className="bec-event-content">
                    <h3 className="bec-event-title">{event.title}</h3>
                    <div className="bec-event-meta">
                      <span className="meta-item"><Calendar size={14} /> {event.date}</span>
                      <span className="meta-item"><Clock size={14} /> {event.time}</span>
                      <span className="meta-item"><MapPin size={14} /> {event.venue}</span>
                    </div>
                    <p className="bec-event-desc">{event.description}</p>
                    {event.seats !== null && (
                      <div className="bec-event-seats">
                        <span className="font-bold text-green-700">{event.seats}</span> seats remaining
                      </div>
                    )}
                  </div>
                  <div className="bec-event-action">
                    {event.registrationLink ? (
                      <a 
                        href={event.registrationLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bec-primary w-full justify-center"
                      >
                        External Register
                      </a>
                    ) : (
                      <button 
                        onClick={() => setSelectedEvent(event)}
                        className="bec-primary w-full justify-center"
                      >
                        Register Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Registration Modal */}
      {selectedEvent && (
        <div className="bec-modal-overlay">
          <div className="bec-modal">
            <button className="bec-modal-close" onClick={closeModal}>
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold mb-2">Register for Event</h3>
            <p className="text-gray-600 text-sm mb-6">{selectedEvent.title}</p>
            
            <form onSubmit={handleRegister} className="bec-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="bec-input"
                />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="bec-input"
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  className="bec-input"
                />
              </div>
              <div className="mt-8 flex gap-3">
                <button type="button" onClick={closeModal} className="bec-secondary flex-1 justify-center">
                  Cancel
                </button>
                <button type="submit" disabled={registering} className="bec-primary flex-1 justify-center">
                  {registering ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageTransition>
  );
}
