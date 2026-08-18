import { useState, useEffect, type FormEvent } from 'react';
import { Plus, Edit2, Trash2, X, UserCog, Linkedin } from 'lucide-react';
import { teamApi } from '@/lib/adminApi';
import { toast } from 'sonner';

interface TeamMember {
  id: number;
  name: string;
  designation: string;
  photoUrl: string | null;
  linkedinUrl: string | null;
  displayOrder: number;
  createdAt: string;
}

const emptyForm = {
  name: '',
  designation: '',
  photoUrl: '',
  linkedinUrl: '',
  displayOrder: 0,
};

export default function TeamManager() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const data = await teamApi.list();
      setTeam(data.team || []);
    } catch {
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, displayOrder: team.length });
    setShowModal(true);
  };

  const openEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setForm({
      name: member.name,
      designation: member.designation,
      photoUrl: member.photoUrl || '',
      linkedinUrl: member.linkedinUrl || '',
      displayOrder: member.displayOrder,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        displayOrder: Number(form.displayOrder),
      };
      if (editingId) {
        await teamApi.update(editingId, payload);
        toast.success('Team member updated successfully');
      } else {
        await teamApi.create(payload);
        toast.success('Team member added successfully');
      }
      setShowModal(false);
      fetchTeam();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save team member');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await teamApi.delete(deleteId);
      toast.success('Team member deleted successfully');
      setDeleteId(null);
      fetchTeam();
    } catch {
      toast.error('Failed to delete team member');
    }
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="admin-card" style={{ marginBottom: 20 }}>
        <div className="admin-card-body">
          <div className="admin-toolbar">
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
              {team.length} Team Member{team.length !== 1 ? 's' : ''}
            </h3>
            <button className="admin-btn admin-btn-primary" onClick={openCreate}>
              <Plus /> Add Member
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
                <th style={{ width: 50 }}>Order</th>
                <th>Photo</th>
                <th>Name</th>
                <th>Designation</th>
                <th>LinkedIn</th>
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
              ) : team.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="admin-empty">
                      <UserCog />
                      <h4>No team members yet</h4>
                      <p>Add team members to display on the About Us page.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                team.map((member) => (
                  <tr key={member.id}>
                    <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--admin-text-muted)' }}>
                      {member.displayOrder}
                    </td>
                    <td>
                      {member.photoUrl ? (
                        <img
                          src={member.photoUrl}
                          alt={member.name}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 8,
                            objectFit: 'cover',
                            border: '1px solid var(--admin-border)',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 8,
                            background: 'var(--admin-primary-light)',
                            color: 'var(--admin-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: 14,
                          }}
                        >
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td style={{ fontWeight: 500 }}>{member.name}</td>
                    <td style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>
                      {member.designation}
                    </td>
                    <td>
                      {member.linkedinUrl ? (
                        <a
                          href={member.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#0077b5' }}
                        >
                          <Linkedin size={16} />
                        </a>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--admin-text-light)' }}>—</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          onClick={() => openEdit(member)}
                          title="Edit"
                        >
                          <Edit2 />
                        </button>
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          onClick={() => setDeleteId(member.id)}
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
              <h3>{editingId ? 'Edit Team Member' : 'Add Team Member'}</h3>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Name</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      required
                      placeholder="Full name"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Designation</label>
                    <input
                      value={form.designation}
                      onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))}
                      required
                      placeholder="e.g. CEO, CTO"
                    />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>Photo URL</label>
                  <input
                    value={form.photoUrl}
                    onChange={(e) => setForm((f) => ({ ...f, photoUrl: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>LinkedIn URL</label>
                    <input
                      value={form.linkedinUrl}
                      onChange={(e) => setForm((f) => ({ ...f, linkedinUrl: e.target.value }))}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Display Order</label>
                    <input
                      type="number"
                      value={form.displayOrder}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, displayOrder: Number(e.target.value) }))
                      }
                      min={0}
                    />
                  </div>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingId ? 'Update Member' : 'Add Member'}
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
              <h3>Delete Team Member</h3>
              <button className="admin-modal-close" onClick={() => setDeleteId(null)}>
                <X size={16} />
              </button>
            </div>
            <div className="admin-modal-body">
              <p className="admin-confirm-text">
                Are you sure you want to remove this team member? This action cannot be undone.
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
