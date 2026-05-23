import { useState, useEffect } from 'react'
import {
  getHabits, createHabit, updateHabit, deleteHabit,
  createHabitLog, getHabitLogs, getCategories
} from '../api'

const EMPTY_FORM = {
  name: '', description: '', frequency: 'daily',
  target_count: 1, start_date: '', end_date: '',
  category_id: '', is_active: 1
}

const FREQ_ICON = { daily: '📅', weekly: '📆', monthly: '🗓️' }
const CAT_COLORS = ['#2563eb','#16a34a','#dc2626','#ca8a04','#9333ea','#0891b2','#ea580c']

export default function Habits() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [habits, setHabits] = useState([])
  const [categories, setCategories] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [logsModal, setLogsModal] = useState(null)
  const [logs, setLogs] = useState([])
  const [logForm, setLogForm] = useState({ completion_date: '', status: 'completed', notes: '' })
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    const [h, c] = await Promise.all([getHabits(), getCategories()])
    setHabits(h.data)
    setCategories(c.data)
  }

  function openCreate() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setError('')
    setShowModal(true)
  }

  function openEdit(habit) {
    setEditing(habit)
    setForm({
      name: habit.name,
      description: habit.description || '',
      frequency: habit.frequency,
      target_count: habit.target_count,
      start_date: habit.start_date?.slice(0, 10) || '',
      end_date: habit.end_date?.slice(0, 10) || '',
      category_id: habit.category_id || '',
      is_active: habit.is_active
    })
    setError('')
    setShowModal(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const payload = { ...form, user_id: user.id, category_id: form.category_id || null }
      if (editing) {
        await updateHabit(editing.habit_id, payload)
      } else {
        await createHabit(payload)
      }
      setShowModal(false)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving habit')
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this habit?')) return
    await deleteHabit(id)
    load()
  }

  async function openLogs(habit) {
    setLogsModal(habit)
    const res = await getHabitLogs(habit.habit_id)
    setLogs(res.data)
    setLogForm({ completion_date: new Date().toISOString().slice(0, 10), status: 'completed', notes: '' })
  }

  async function submitLog(e) {
    e.preventDefault()
    await createHabitLog(logsModal.habit_id, logForm)
    const res = await getHabitLogs(logsModal.habit_id)
    setLogs(res.data)
  }

  function getCategory(id) {
    return categories.find(c => c.category_id === id)
  }

  function getCatColor(id, index) {
    const cat = getCategory(id)
    return cat?.color || CAT_COLORS[index % CAT_COLORS.length]
  }

  return (
    <div className="page">
      <div className="top-bar">
        <div>
          <h1 style={{ marginBottom: 0 }}>My Habits</h1>
          <p style={{ color: '#6b7280', fontSize: '0.88rem', marginTop: '0.2rem' }}>
            {habits.length} habit{habits.length !== 1 ? 's' : ''} tracked
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ New Habit</button>
      </div>

      {habits.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🌱</div>
          <p>No habits yet. Start by creating your first one!</p>
          <button className="btn btn-primary" onClick={openCreate}>Create Habit</button>
        </div>
      )}

      <div className="habits-grid">
        {habits.map((h, i) => {
          const cat = getCategory(h.category_id)
          const color = getCatColor(h.category_id, i)
          return (
            <div className="habit-card" key={h.habit_id} style={{ '--accent': color }}>
              <div className="habit-card-accent" />
              <div className="habit-card-body">
                <div className="habit-card-top">
                  <h3 className="habit-name">{h.name}</h3>
                  <span className={`badge ${h.is_active ? 'active' : 'inactive'}`}>
                    {h.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {h.description && (
                  <p className="habit-desc">{h.description}</p>
                )}

                <div className="habit-meta">
                  <span className="meta-chip">
                    {FREQ_ICON[h.frequency] || '🔁'} {h.frequency}
                  </span>
                  <span className="meta-chip">
                    🎯 {h.target_count}x
                  </span>
                  {cat && (
                    <span className="meta-chip" style={{ background: color + '20', color }}>
                      {cat.icon && <span>{cat.icon} </span>}{cat.name}
                    </span>
                  )}
                  {h.start_date && (
                    <span className="meta-chip">
                      📅 {h.start_date.slice(0, 10)}
                    </span>
                  )}
                </div>

                <div className="habit-actions">
                  <button className="habit-btn edit" onClick={() => openEdit(h)}>✏️ Edit</button>
                  <button className="habit-btn logs" onClick={() => openLogs(h)}>📋 Logs</button>
                  <button className="habit-btn delete" onClick={() => handleDelete(h.habit_id)}>🗑️</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editing ? 'Edit Habit' : 'New Habit'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="e.g. Morning run" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Optional description" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label>Frequency</label>
                  <select value={form.frequency} onChange={e => setForm({...form, frequency: e.target.value})}>
                    <option value="daily">📅 Daily</option>
                    <option value="weekly">📆 Weekly</option>
                    <option value="monthly">🗓️ Monthly</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Target Count</label>
                  <input type="number" min={1} value={form.target_count} onChange={e => setForm({...form, target_count: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})}>
                  <option value="">-- None --</option>
                  {categories.map(c => <option key={c.category_id} value={c.category_id}>{c.icon ? c.icon + ' ' : ''}{c.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label>Start Date</label>
                  <input type="date" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input type="date" value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})} />
                </div>
              </div>
              {editing && (
                <div className="form-group">
                  <label>Status</label>
                  <select value={form.is_active} onChange={e => setForm({...form, is_active: Number(e.target.value)})}>
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
              )}
              {error && <p className="error-msg">{error}</p>}
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Habit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logs Modal */}
      {logsModal && (
        <div className="modal-backdrop" onClick={() => setLogsModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>📋 {logsModal.name}</h2>
            <form onSubmit={submitLog} style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" value={logForm.completion_date} onChange={e => setLogForm({...logForm, completion_date: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={logForm.status} onChange={e => setLogForm({...logForm, status: e.target.value})}>
                    <option value="completed">✅ Completed</option>
                    <option value="skipped">⏭️ Skipped</option>
                    <option value="missed">❌ Missed</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <input value={logForm.notes} onChange={e => setLogForm({...logForm, notes: e.target.value})} placeholder="Optional notes..." />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setLogsModal(null)}>Close</button>
                <button type="submit" className="btn btn-success">Add Log</button>
              </div>
            </form>

            <h2>History</h2>
            {logs.length === 0 && <p className="empty">No logs yet.</p>}
            <ul className="log-list">
              {logs.slice().reverse().map(l => (
                <li className="log-item" key={l.log_id}>
                  <span className={`badge ${l.status}`}>{l.status}</span>
                  <span>{l.completion_date?.slice(0,10)}</span>
                  {l.notes && <span style={{ color: '#888' }}>— {l.notes}</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
