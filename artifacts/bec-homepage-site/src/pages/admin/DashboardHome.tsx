import { useState, useEffect } from 'react';
import {
  FileText,
  Star,
  CalendarDays,
  Users,
  UserCog,
  BarChart3,
} from 'lucide-react';
import { postsApi, reviewsApi, eventsApi, membersApi, teamApi, statsApi } from '@/lib/adminApi';

interface DashboardCounts {
  posts: number;
  reviews: number;
  pendingReviews: number;
  events: number;
  members: number;
  pendingMembers: number;
  team: number;
  stats: number;
}

export default function DashboardHome() {
  const [counts, setCounts] = useState<DashboardCounts>({
    posts: 0,
    reviews: 0,
    pendingReviews: 0,
    events: 0,
    members: 0,
    pendingMembers: 0,
    team: 0,
    stats: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [postsData, reviewsData, eventsData, membersData, teamData, statsData] =
          await Promise.all([
            postsApi.list(),
            reviewsApi.list(),
            eventsApi.list(),
            membersApi.list(),
            teamApi.list(),
            statsApi.list(),
          ]);

        setCounts({
          posts: postsData.posts?.length || 0,
          reviews: reviewsData.reviews?.length || 0,
          pendingReviews:
            reviewsData.reviews?.filter((r: any) => r.status === 'pending').length || 0,
          events: eventsData.events?.length || 0,
          members: membersData.members?.length || 0,
          pendingMembers:
            membersData.members?.filter((m: any) => m.status === 'pending').length || 0,
          team: teamData.team?.length || 0,
          stats: statsData.stats?.length || 0,
        });
      } catch {
        // Counts stay at 0
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const cards = [
    {
      label: 'Total Posts',
      value: counts.posts,
      icon: FileText,
      color: 'green' as const,
    },
    {
      label: 'Total Reviews',
      value: counts.reviews,
      icon: Star,
      color: 'gold' as const,
      sub: `${counts.pendingReviews} pending`,
    },
    {
      label: 'Events',
      value: counts.events,
      icon: CalendarDays,
      color: 'blue' as const,
    },
    {
      label: 'Members',
      value: counts.members,
      icon: Users,
      color: 'purple' as const,
      sub: `${counts.pendingMembers} pending`,
    },
    {
      label: 'Team Members',
      value: counts.team,
      icon: UserCog,
      color: 'orange' as const,
    },
    {
      label: 'Site Stats',
      value: counts.stats,
      icon: BarChart3,
      color: 'green' as const,
    },
  ];

  if (loading) {
    return (
      <div className="admin-empty">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-stats-grid">
        {cards.map(({ label, value, icon: Icon, color, sub }) => (
          <div className="admin-stat-card" key={label}>
            <div className={`admin-stat-icon ${color}`}>
              <Icon />
            </div>
            <div>
              <div className="admin-stat-value">{value}</div>
              <div className="admin-stat-label">{label}</div>
              {sub && (
                <div className="admin-stat-label" style={{ fontSize: 11, marginTop: 2, color: '#f59e0b' }}>
                  {sub}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Welcome to BEC Admin Panel</h3>
        </div>
        <div className="admin-card-body">
          <p style={{ fontSize: 13, color: 'var(--admin-text-muted)', lineHeight: 1.7, margin: 0 }}>
            Manage all aspects of the Bangladesh Executive Chamber website from this dashboard.
            Use the sidebar navigation to access Posts, Reviews, Events, Members, Team, and Stats managers.
          </p>
        </div>
      </div>
    </div>
  );
}
