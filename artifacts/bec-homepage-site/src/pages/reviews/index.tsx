import { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import { publicApi, type Review } from '@/lib/publicApi';
import { toast } from 'sonner';

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | '5 Star' | '4 Star'>('All');

  // Form State
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [company, setCompany] = useState('');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    try {
      const data = await publicApi.reviews.getApproved();
      setReviews(data.reviews || []);
    } catch (err) {
      console.error('Failed to load reviews', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) {
      toast.error('Name and message are required');
      return;
    }
    
    setSubmitting(true);
    try {
      await publicApi.reviews.submit({
        name,
        designation,
        company,
        rating,
        message,
      });
      toast.success('Your review has been submitted and is pending approval.');
      // Reset form
      setName('');
      setDesignation('');
      setCompany('');
      setRating(5);
      setMessage('');
    } catch (err) {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filter === '5 Star') return r.rating === 5;
    if (filter === '4 Star') return r.rating === 4;
    return true;
  });

  return (
    <PageTransition className="bec-reviews-page">
      <section className="bec-page-header py-20 bg-gray-50 text-center">
        <div className="bec-container">
          <h1 className="bec-page-title">
            Reviews & <span>Testimonials</span>
          </h1>
          <p className="bec-page-subtitle mx-auto">
            See what our members and partners are saying about their experience with BEC.
          </p>
        </div>
      </section>

      <section className="bec-section py-20">
        <div className="bec-container">
          
          <div className="bec-reviews-layout">
            
            {/* Reviews List */}
            <div className="bec-reviews-list-col">
              <div className="bec-filter-bar">
                {['All', '5 Star', '4 Star'].map(f => (
                  <button 
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={`filter-btn ${filter === f ? 'active' : ''}`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="py-12 text-center text-gray-500">Loading reviews...</div>
              ) : filteredReviews.length === 0 ? (
                <div className="py-12 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
                  <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
                  <p>No approved reviews found for this filter.</p>
                </div>
              ) : (
                <div className="bec-reviews-grid">
                  {filteredReviews.map((review) => (
                    <div key={review.id} className="bec-review-card">
                      <div className="bec-review-stars">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            fill={i < review.rating ? '#c09643' : 'none'} 
                            color={i < review.rating ? '#c09643' : '#d1d5db'} 
                          />
                        ))}
                      </div>
                      <p className="bec-review-message">"{review.message}"</p>
                      <div className="bec-review-author">
                        <div className="bec-review-avatar">
                          {review.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong>{review.name}</strong>
                          <span className="block text-xs text-gray-500">
                            {[review.designation, review.company].filter(Boolean).join(', ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Review Form */}
            <div className="bec-review-form-col">
              <div className="bec-form-card">
                <h3>Submit a Review</h3>
                <p className="form-note">Your review will appear after approval.</p>
                
                <form onSubmit={handleSubmit} className="bec-form">
                  <div className="form-group">
                    <label>Rating</label>
                    <div className="star-selector">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          className="star-btn"
                        >
                          <Star 
                            size={24} 
                            fill={star <= rating ? '#c09643' : 'none'} 
                            color={star <= rating ? '#c09643' : '#d1d5db'} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
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
                    <label>Designation (Optional)</label>
                    <input 
                      type="text" 
                      value={designation} 
                      onChange={(e) => setDesignation(e.target.value)} 
                      className="bec-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Company (Optional)</label>
                    <input 
                      type="text" 
                      value={company} 
                      onChange={(e) => setCompany(e.target.value)} 
                      className="bec-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Review Message *</label>
                    <textarea 
                      required 
                      value={message} 
                      onChange={(e) => setMessage(e.target.value)} 
                      className="bec-input"
                      rows={4}
                    />
                  </div>
                  
                  <button type="submit" className="bec-primary w-full justify-center mt-4" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Review'}
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
