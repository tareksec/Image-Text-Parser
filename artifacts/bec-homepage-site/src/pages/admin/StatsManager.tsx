import { useState, useEffect } from 'react';
import { Save, BarChart3 } from 'lucide-react';
import { statsApi } from '@/lib/adminApi';
import { toast } from 'sonner';

interface SiteStat {
  id: number;
  key: string;
  label: string;
  value: string;
  icon: string | null;
  displayOrder: number;
  updatedAt: string;
}

export default function StatsManager() {
  const [stats, setStats] = useState<SiteStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editedStats, setEditedStats] = useState<Record<number, Partial<SiteStat>>>({});
  const [saving, setSaving] = useState<number | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await statsApi.list();
      setStats(data.stats || []);
    } catch {
      toast.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleChange = (id: number, field: string, val: string) => {
    setEditedStats((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: val },
    }));
  };

  const handleSave = async (stat: SiteStat) => {
    const edited = editedStats[stat.id];
    if (!edited) return;

    try {
      setSaving(stat.id);
      await statsApi.update(stat.id, {
        label: edited.label ?? stat.label,
        value: edited.value ?? stat.value,
        icon: edited.icon ?? stat.icon,
        displayOrder: stat.displayOrder,
      });
      toast.success(`"${stat.key}" stat updated successfully`);
      setEditedStats((prev) => {
        const next = { ...prev };
        delete next[stat.id];
        return next;
      });
      fetchStats();
    } catch {
      toast.error('Failed to update stat');
    } finally {
      setSaving(null);
    }
  };

  const getVal = (stat: SiteStat, field: keyof SiteStat) => {
    return (editedStats[stat.id]?.[field] as string) ?? (stat[field] as string);
  };

  const hasChanges = (id: number) => !!editedStats[id];

  if (loading) {
    return (
      <div className="admin-empty">
        <p>Loading stats...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-card" style={{ marginBottom: 20 }}>
        <div className="admin-card-header">
          <h3>Homepage Impact Stats</h3>
          <span style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>
            Edit the values displayed on the public homepage
          </span>
        </div>
      </div>

      {stats.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <BarChart3 />
            <h4>No stats found</h4>
            <p>Run the seed endpoint to create default stats.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {stats.map((stat) => (
            <div className="admin-card" key={stat.id}>
              <div className="admin-card-body">
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr 1fr 1fr auto',
                    gap: 16,
                    alignItems: 'end',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: 'var(--admin-text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: 6,
                      }}
                    >
                      Key
                    </div>
                    <div
                      style={{
                        padding: '10px 14px',
                        background: '#f8fafc',
                        borderRadius: 'var(--admin-radius-sm)',
                        fontSize: 13,
                        fontWeight: 600,
                        color: 'var(--admin-primary)',
                      }}
                    >
                      {stat.key}
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Label</label>
                    <input
                      value={getVal(stat, 'label')}
                      onChange={(e) => handleChange(stat.id, 'label', e.target.value)}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Value</label>
                    <input
                      value={getVal(stat, 'value')}
                      onChange={(e) => handleChange(stat.id, 'value', e.target.value)}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Icon</label>
                    <input
                      value={getVal(stat, 'icon') || ''}
                      onChange={(e) => handleChange(stat.id, 'icon', e.target.value)}
                      placeholder="Icon name"
                    />
                  </div>

                  <button
                    className={`admin-btn ${hasChanges(stat.id) ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                    onClick={() => handleSave(stat)}
                    disabled={!hasChanges(stat.id) || saving === stat.id}
                    style={{ marginBottom: 1 }}
                  >
                    <Save size={14} />
                    {saving === stat.id ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
