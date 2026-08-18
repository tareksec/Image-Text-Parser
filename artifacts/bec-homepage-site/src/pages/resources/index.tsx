import { useState, useEffect } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import { publicApi, type Post } from '@/lib/publicApi';
import { toast } from 'sonner';

const categories = ['All', 'Career Tips', 'Business', 'Industry Insights', 'Training'];

export default function Resources() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  
  // Newsletter
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await publicApi.posts.getAll();
        setPosts(data.posts || []);
      } catch (err) {
        console.error('Failed to load posts', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubscribing(true);
    try {
      await publicApi.newsletter.subscribe(email);
      toast.success('Thank you for subscribing!');
      setEmail('');
    } catch (err) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  const filteredPosts = posts.filter((p) => {
    if (filter === 'All') return true;
    return p.category === filter;
  });

  return (
    <PageTransition className="bec-resources-page">
      <section className="bec-page-header py-20 bg-gray-50 text-center">
        <div className="bec-container">
          <h1 className="bec-page-title">
            Insights & <span>Resources</span>
          </h1>
          <p className="bec-page-subtitle mx-auto">
            Stay updated with the latest industry trends, career tips, and business strategies.
          </p>
        </div>
      </section>

      {/* Blog Section */}
      <section className="bec-section py-20">
        <div className="bec-container">
          
          <div className="bec-filter-bar justify-center mb-12">
            {categories.map(c => (
              <button 
                key={c}
                onClick={() => setFilter(c)}
                className={`filter-btn ${filter === c ? 'active' : ''}`}
              >
                {c}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="bec-blog-grid">
              {[1, 2, 3].map(i => (
                <div key={i} className="bec-blog-card skeleton">
                  <div className="skeleton-img"></div>
                  <div className="skeleton-content p-6">
                    <div className="skeleton-line w-1/4 mb-4"></div>
                    <div className="skeleton-line w-full mb-2"></div>
                    <div className="skeleton-line w-3/4 mb-4"></div>
                    <div className="skeleton-line w-full mb-2"></div>
                    <div className="skeleton-line w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-xl max-w-3xl mx-auto">
              <BookOpen size={48} className="mx-auto mb-4 opacity-30 text-gray-400" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">Coming Soon</h3>
              <p className="text-gray-500">We are currently curating the best content for this category. Check back later!</p>
            </div>
          ) : (
            <div className="bec-blog-grid">
              {filteredPosts.map((post) => (
                <article key={post.id} className="bec-blog-card">
                  {post.coverImageUrl && (
                    <div className="bec-blog-img">
                      <img src={post.coverImageUrl} alt={post.title} />
                      <span className="bec-blog-category">{post.category}</span>
                    </div>
                  )}
                  <div className="bec-blog-content">
                    <div className="bec-blog-meta">
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{Math.max(1, Math.ceil(post.content.length / 1000))} min read</span>
                    </div>
                    <h3 className="bec-blog-title">{post.title}</h3>
                    <p className="bec-blog-excerpt">
                      {post.content.replace(/<[^>]*>?/gm, '').substring(0, 120)}...
                    </p>
                    <button className="bec-blog-link">
                      Read More <ArrowRight size={14} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bec-newsletter-section py-24 bg-[#14202d] text-white text-center">
        <div className="bec-container max-w-3xl">
          <h2 className="text-3xl font-extrabold mb-4">Never Miss an Update</h2>
          <p className="text-gray-400 mb-8">
            Subscribe to our newsletter for exclusive career advice, business insights, and upcoming event notifications.
          </p>
          <form onSubmit={handleSubscribe} className="bec-newsletter-form">
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address" 
              className="newsletter-input"
            />
            <button type="submit" disabled={subscribing} className="newsletter-btn">
              {subscribing ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </section>
    </PageTransition>
  );
}
