import { useState, useEffect, type FormEvent } from 'react';
import { Plus, Search, Edit2, Trash2, X, Eye, EyeOff } from 'lucide-react';
import { postsApi } from '@/lib/adminApi';
import { toast } from 'sonner';

interface Post {
  id: number;
  title: string;
  slug: string;
  category: string;
  content: string;
  coverImageUrl: string | null;
  tags: string;
  published: boolean;
  authorId: number | null;
  createdAt: string;
  updatedAt: string;
}

const emptyForm = {
  title: '',
  slug: '',
  category: 'general',
  content: '',
  coverImageUrl: '',
  tags: '',
  published: false,
};

export default function PostsManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postsApi.list({
        search: search || undefined,
        category: categoryFilter || undefined,
      });
      setPosts(data.posts || []);
    } catch {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [search, categoryFilter]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (post: Post) => {
    setEditingId(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      category: post.category,
      content: post.content,
      coverImageUrl: post.coverImageUrl || '',
      tags: post.tags,
      published: post.published,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await postsApi.update(editingId, form);
        toast.success('Post updated successfully');
      } else {
        await postsApi.create(form);
        toast.success('Post created successfully');
      }
      setShowModal(false);
      fetchPosts();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save post');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await postsApi.delete(deleteId);
      toast.success('Post deleted successfully');
      setDeleteId(null);
      fetchPosts();
    } catch {
      toast.error('Failed to delete post');
    }
  };

  const autoSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="admin-card" style={{ marginBottom: 20 }}>
        <div className="admin-card-body">
          <div className="admin-toolbar">
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div className="admin-search">
                <Search />
                <input
                  placeholder="Search posts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="admin-filter-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="general">General</option>
                <option value="news">News</option>
                <option value="blog">Blog</option>
                <option value="announcement">Announcement</option>
              </select>
            </div>
            <button className="admin-btn admin-btn-primary" onClick={openCreate}>
              <Plus /> New Post
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
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Tags</th>
                <th>Created</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 40 }}>
                    Loading...
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="admin-empty">
                      <h4>No posts yet</h4>
                      <p>Create your first post to get started.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id}>
                    <td style={{ fontWeight: 500, maxWidth: 260 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {post.title}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--admin-text-light)', marginTop: 2 }}>
                        /{post.slug}
                      </div>
                    </td>
                    <td>
                      <span className="admin-badge blue">{post.category}</span>
                    </td>
                    <td>
                      <span className={`admin-badge ${post.published ? 'green' : 'gray'}`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>
                      {post.tags || '—'}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          onClick={() => openEdit(post)}
                          title="Edit"
                        >
                          <Edit2 />
                        </button>
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          onClick={() => setDeleteId(post.id)}
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
              <h3>{editingId ? 'Edit Post' : 'Create Post'}</h3>
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
                    onChange={(e) => {
                      const title = e.target.value;
                      setForm((f) => ({
                        ...f,
                        title,
                        slug: editingId ? f.slug : autoSlug(title),
                      }));
                    }}
                    required
                    placeholder="Post title"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Slug</label>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                    required
                    placeholder="post-url-slug"
                  />
                </div>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    >
                      <option value="general">General</option>
                      <option value="news">News</option>
                      <option value="blog">Blog</option>
                      <option value="announcement">Announcement</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label>Tags (comma-separated)</label>
                    <input
                      value={form.tags}
                      onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                      placeholder="tag1, tag2"
                    />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>Cover Image URL</label>
                  <input
                    value={form.coverImageUrl}
                    onChange={(e) => setForm((f) => ({ ...f, coverImageUrl: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
                <div className="admin-form-group">
                  <label>Content</label>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                    rows={8}
                    placeholder="Write your post content here..."
                  />
                </div>
                <div className="admin-form-check">
                  <input
                    type="checkbox"
                    id="post-published"
                    checked={form.published}
                    onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                  />
                  <label htmlFor="post-published">
                    {form.published ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Eye size={14} /> Published
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <EyeOff size={14} /> Draft
                      </span>
                    )}
                  </label>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingId ? 'Update Post' : 'Create Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId !== null && (
        <div className="admin-modal-overlay" onClick={() => setDeleteId(null)}>
          <div
            className="admin-modal"
            style={{ maxWidth: 400 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <h3>Delete Post</h3>
              <button className="admin-modal-close" onClick={() => setDeleteId(null)}>
                <X size={16} />
              </button>
            </div>
            <div className="admin-modal-body">
              <p className="admin-confirm-text">
                Are you sure you want to delete this post? This action cannot be undone.
              </p>
            </div>
            <div className="admin-modal-footer">
              <button
                className="admin-btn admin-btn-secondary"
                onClick={() => setDeleteId(null)}
              >
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
