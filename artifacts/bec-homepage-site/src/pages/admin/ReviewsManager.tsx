import { useState, useEffect } from 'react';
import { Trash2, X, CheckCircle, XCircle, Clock, Star } from 'lucide-react';
import { reviewsApi } from '@/lib/adminApi';
import { toast } from 'sonner';

interface Review {
  id: number;
  name: string;
  designation: string | null;
  company: string | null;
  rating: number;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function ReviewsManager() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewsApi.list();
      setReviews(data.reviews || []);
    } catch {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleStatus = async (id: number, status: string) => {
    try {
      await reviewsApi.updateStatus(id, status);
      toast.success(`Review ${status} successfully`);
      fetchReviews();
    } catch {
      toast.error('Failed to update review status');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await reviewsApi.delete(deleteId);
      toast.success('Review deleted successfully');
      setDeleteId(null);
      fetchReviews();
    } catch {
      toast.error('Failed to delete review');
    }
  };

  const renderStars = (rating: number) => (
    <div className="admin-stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={14} fill={s <= rating ? '#fbbf24' : 'none'} className={s > rating ? 'empty' : ''} />
      ))}
    </div>
  );

  const statusBadge = (status: string) => {
    const map: Record<string, { color: string; icon: any; label: string }> = {
      pending: { color: 'yellow', icon: Clock, label: 'Pending' },
      approved: { color: 'green', icon: CheckCircle, label: 'Approved' },
      rejected: { color: 'red', icon: XCircle, label: 'Rejected' },
    };
    const { color, icon: Icon, label } = map[status] || map.pending;
    return (
      <span className={`admin-badge ${color}`}>
        <Icon size={12} /> {label}
      </span>
    );
  };

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>All Reviews ({reviews.length})</h3>
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Reviewer</th>
                <th>Rating</th>
                <th>Message</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ width: 160 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 40 }}>
                    Loading...
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="admin-empty">
                      <h4>No reviews yet</h4>
                      <p>Reviews submitted on the public site will appear here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{review.name}</div>
                      {(review.designation || review.company) && (
                        <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', marginTop: 2 }}>
                          {review.designation}
                          {review.designation && review.company ? ', ' : ''}
                          {review.company}
                        </div>
                      )}
                    </td>
                    <td>{renderStars(review.rating)}</td>
                    <td style={{ maxWidth: 250 }}>
                      <div
                        style={{
                          fontSize: 12,
                          color: 'var(--admin-text-muted)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {review.message}
                      </div>
                    </td>
                    <td>{statusBadge(review.status)}</td>
                    <td style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {review.status !== 'approved' && (
                          <button
                            className="admin-btn admin-btn-sm admin-btn-ghost"
                            onClick={() => handleStatus(review.id, 'approved')}
                            title="Approve"
                            style={{ color: 'var(--admin-success)' }}
                          >
                            <CheckCircle size={14} />
                          </button>
                        )}
                        {review.status !== 'rejected' && (
                          <button
                            className="admin-btn admin-btn-sm admin-btn-ghost"
                            onClick={() => handleStatus(review.id, 'rejected')}
                            title="Reject"
                            style={{ color: 'var(--admin-warning)' }}
                          >
                            <XCircle size={14} />
                          </button>
                        )}
                        <button
                          className="admin-btn admin-btn-sm admin-btn-ghost"
                          onClick={() => setDeleteId(review.id)}
                          title="Delete"
                          style={{ color: 'var(--admin-danger)' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleteId !== null && (
        <div className="admin-modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="admin-modal" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Delete Review</h3>
              <button className="admin-modal-close" onClick={() => setDeleteId(null)}>
                <X size={16} />
              </button>
            </div>
            <div className="admin-modal-body">
              <p className="admin-confirm-text">
                Are you sure you want to delete this review? This action cannot be undone.
              </p>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-secondary" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button className="admin-btn admin-btn-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
