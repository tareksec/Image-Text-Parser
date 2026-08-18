import { useState, useEffect, type FormEvent } from 'react';
import { Plus, Edit2, Trash2, X, CalendarDays, MapPin } from 'lucide-react';
import { eventsApi } from '@/lib/adminApi';
import { toast } from 'sonner';

interface EventItem {
  id: number;
  title: string;
  date: string;
  time: string;
  venue: string;
  seats: number | null;
  registrationLink: string | null;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const emptyForm = {
  title: '',
  date: '',
  time: '',
  venue: '',
  seats: '',
  registrationLink: '',
  description: '',
};

export default function EventsManager() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventsApi.list();
      setEvents(data.events || []);
    } catch {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (ev: EventItem) => {
    setEditingId(ev.id);
    setForm({
      title: ev.title,
      date: ev.date,
      time: ev.time,
      venue: ev.venue,
      seats: ev.seats?.toString() || '',
      registrationLink: ev.registrationLink || '',
      description: ev.description,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        seats: form.seats ? Number(form.seats) : null,
      };
      if (editingId) {
        await eventsApi.update(editingId, payload);
        toast.success('Event updated successfully');
      } else {
        await eventsApi.create(payload);
        toast.success('Event created successfully');
      }
      setShowModal(false);
      fetchEvents();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save event');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await eventsApi.delete(deleteId);
      toast.success('Event deleted successfully');
      setDeleteId(null);
      fetchEvents();
    } catch {
      toast.error('Failed to delete event');
    }
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="admin-card" style={{ marginBottom: 20 }}>
        <div className="admin-card-body">
          <div className="admin-toolbar">
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
              {events.length} Event{events.length !== 1 ? 's' : ''}
            </h3>
            <button className="admin-btn admin-btn-primary" onClick={openCreate}>
              <Plus /> New Event
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Date & Time</th>
                <th>Venue</th>
                <th>Seats</th>
                <th>Registration</th>
                <th style={{ width: 100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 40 }}>
                    Loading...
                  </td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="admin-empty">
                      <CalendarDays />
                      <h4>No events yet</h4>
                      <p>Create your first training event or workshop.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                events.map((ev) => (
                  <tr key={ev.id}>
                    <td style={{ fontWeight: 500, maxWidth: 240 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ev.title}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                        <CalendarDays size={13} style={{ color: 'var(--admin-primary)' }} />
                        {ev.date} · {ev.time}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                        <MapPin size={13} style={{ color: 'var(--admin-text-light)' }} />
                        {ev.venue}
                      </div>
                    </td>
                    <td style={{ fontSize: 13 }}>{ev.seats ?? '—'}</td>
                    <td>
                      {ev.registrationLink ? (
                        <a
                          href={ev.registrationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: 12, color: 'var(--admin-primary)' }}
                        >
                          Link ↗
                        </a>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--admin-text-light)' }}>—</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          onClick={() => openEdit(ev)}
                          title="Edit"
                        >
                          <Edit2 />
                        </button>
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          onClick={() => setDeleteId(ev.id)}
                          title="Delete"
                          style={{ color: 'var(--admin-danger)' }}
                        >
                          <Trash2 />
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

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingId ? 'Edit Event' : 'Create Event'}</h3>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Title</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    required
                    placeholder="Event title"
                  />
                </div>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Time</label>
                    <input
                      type="time"
                      value={form.time}
                      onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>Venue</label>
                  <input
                    value={form.venue}
                    onChange={(e) => setForm((f) => ({ ...f, venue: e.target.value }))}
                    required
                    placeholder="Event venue or location"
                  />
                </div>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Available Seats</label>
                    <input
                      type="number"
                      value={form.seats}
                      onChange={(e) => setForm((f) => ({ ...f, seats: e.target.value }))}
                      placeholder="Optional"
                      min={0}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Registration Link</label>
                    <input
                      value={form.registrationLink}
                      onChange={(e) => setForm((f) => ({ ...f, registrationLink: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={4}
                    placeholder="Event description..."
                  />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingId ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId !== null && (
        <div className="admin-modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="admin-modal" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Delete Event</h3>
              <button className="admin-modal-close" onClick={() => setDeleteId(null)}>
                <X size={16} />
              </button>
            </div>
            <div className="admin-modal-body">
              <p className="admin-confirm-text">
                Are you sure you want to delete this event? This action cannot be undone.
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
