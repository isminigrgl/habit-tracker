import { useState, useEffect } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api'

const EMPTY_FORM = { name: '', color: '#2563eb', icon: '' }

export default function Categories() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [categories, setCategories] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    const res = await getCategories()
    setCategories(res.data)
  }

  function openCreate() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setError('')
    setShowModal(true)
  }

  function openEdit(cat) {
    setEditing(cat)
    setForm({ name: cat.name, color: cat.color || '#2563eb', icon: cat.icon || '' })
    setError('')
    setShowModal(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      if (editing) {
        await updateCategory(editing.category_id, form)
      } else {
        await createCategory({ ...form, user_id: user.id })
      }
      setShowModal(false)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving category')
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this category?')) return
    await deleteCategory(id)
    load()
  }

  return (
    <div className="page">
      <div className="top-bar">
        <div>
          <h1 style={{ marginBottom: 0 }}>Categories</h1>
          <p style={{ color: '#6b7280', fontSize: '0.88rem', marginTop: '0.2rem' }}>
            {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ New Category</button>
      </div>

      {categories.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🏷️</div>
          <p>No categories yet. Create one to organise your habits!</p>
          <button className="btn btn-primary" onClick={openCreate}>Create Category</button>
        </div>
      )}

      <div className="categories-grid">
        {categories.map(c => (
          <div className="category-card" key={c.category_id} style={{ '--ccolor': c.color || '#2563eb' }}>
            <div className="category-card-top">
              <div className="category-icon-circle" style={{ background: (c.color || '#2563eb') + '20', color: c.color || '#2563eb' }}>
                {c.icon || c.name.slice(0, 1).toUpperCase()}
              </div>
              <div className="category-info">
                <h3 className="category-name">{c.name}</h3>
                <span className="category-color-dot" style={{ background: c.color || '#2563eb' }} />
                <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>{c.color || '#2563eb'}</span>
              </div>
            </div>
            <div className="habit-actions" style={{ marginTop: '0.75rem' }}>
              <button className="habit-btn edit" onClick={() => openEdit(c)}>✏️ Edit</button>
              <button className="habit-btn delete" onClick={() => handleDelete(c.category_id)}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editing ? 'Edit Category' : 'New Category'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="e.g. Health" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label>Color</label>
                  <input type="color" value={form.color} onChange={e => setForm({...form, color: e.target.value})} style={{ height: 42, padding: 3, cursor: 'pointer' }} />
                </div>
                <div className="form-group">
                  <label>Icon (emoji)</label>
                  <input value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} placeholder="e.g. 🏃" maxLength={4} style={{ fontSize: '1.2rem' }} />
                </div>
              </div>

              {form.name && (
                <div className="category-preview">
                  <div className="category-icon-circle" style={{ background: form.color + '20', color: form.color }}>
                    {form.icon || form.name.slice(0, 1).toUpperCase()}
                  </div>
                  <span style={{ fontWeight: 600, color: form.color }}>{form.name}</span>
                </div>
              )}

              {error && <p className="error-msg">{error}</p>}
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
