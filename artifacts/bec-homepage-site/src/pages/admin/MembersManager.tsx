import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Users } from 'lucide-react';
import { membersApi } from '@/lib/adminApi';
import { toast } from 'sonner';

interface Member {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  company: string | null;
  designation: string | null;
  tier: 'basic' | 'professional' | 'corporate';
  status: 'pending' | 'active' | 'rejected';
  createdAt: string;
}

export default function MembersManager() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [tierFilter, setTierFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await membersApi.list({
        tier: tierFilter || undefined,
        status: statusFilter || undefined,
      });
      setMembers(data.members || []);
    } catch {
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [tierFilter, statusFilter]);

  const handleStatus = async (id: number, status: string) => {
    try {
      await membersApi.updateStatus(id, status);
      toast.success(`Member ${status === 'active' ? 'activated' : status} successfully`);
      fetchMembers();
    } catch {
      toast.error('Failed to update member status');
    }
  };

  const tierBadge = (tier: string) => {
    const colors: Record<string, string> = {
      basic: 'gray',
      professional: 'blue',
      corporate: 'gold',
    };
    return <span className={`admin-badge ${colors[tier] || 'gray'}`}>{tier}</span>;
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { color: string; icon: any; label: string }> = {
      pending: { color: 'yellow', icon: Clock, label: 'Pending' },
      active: { color: 'green', icon: CheckCircle, label: 'Active' },
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
      {/* Filters */}
      <div className="admin-card" style={{ marginBottom: 20 }}>
        <div className="admin-card-body">
          <div className="admin-toolbar">
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <select
                className="admin-filter-select"
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
              >
                <option value="">All Tiers</option>
                <option value="basic">Basic</option>
                <option value="professional">Professional</option>
                <option value="corporate">Corporate</option>
              </select>
              <select
                className="admin-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <span style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>
              {members.length} member{members.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Tier</th>
                <th>Status</th>
                <th>Applied</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 40 }}>
                    Loading...
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="admin-empty">
                      <Users />
                      <h4>No members found</h4>
                      <p>Join BEC form submissions will appear here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{member.fullName}</div>
                      {member.designation && (
                        <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', marginTop: 2 }}>
                          {member.designation}
                        </div>
                      )}
                    </td>
                    <td style={{ fontSize: 12 }}>{member.email}</td>
                    <td style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>
                      {member.company || '—'}
                    </td>
                    <td>{tierBadge(member.tier)}</td>
                    <td>{statusBadge(member.status)}</td>
                    <td style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>
                      {new Date(member.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {member.status !== 'active' && (
                          <button
                            className="admin-btn admin-btn-sm admin-btn-ghost"
                            onClick={() => handleStatus(member.id, 'active')}
                            title="Activate"
                            style={{ color: 'var(--admin-success)' }}
                          >
                            <CheckCircle size={14} />
                          </button>
                        )}
                        {member.status !== 'rejected' && (
                          <button
                            className="admin-btn admin-btn-sm admin-btn-ghost"
                            onClick={() => handleStatus(member.id, 'rejected')}
                            title="Reject"
                            style={{ color: 'var(--admin-danger)' }}
                          >
                            <XCircle size={14} />
                          </button>
                        )}
                        {member.status !== 'pending' && (
                          <button
                            className="admin-btn admin-btn-sm admin-btn-ghost"
                            onClick={() => handleStatus(member.id, 'pending')}
                            title="Set Pending"
                            style={{ color: 'var(--admin-warning)' }}
                          >
                            <Clock size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
