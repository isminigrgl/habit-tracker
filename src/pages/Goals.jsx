import { useState, useEffect } from 'react'
import { getGoals, createGoal, updateGoal, deleteGoal, getHabits } from '../api'

const EMPTY_FORM = {
  title: '', description: '', target_value: 1,
  target_period: 'weekly', start_date: '', end_date: '',
  status: 'active', habit_id: ''
}

const STATUS_CONFIG = {
  active:    { icon: '🔥', color: '#2563eb', bg: '#dbeafe' },
  completed: { icon: '✅', color: '#16a34a', bg: '#dcfce7' },
  failed:    { icon: '❌', color: '#dc2626', bg: '#fee2e2' },
}

const PERIOD_ICON = { daily: '📅', weekly: '📆', monthly: '🗓️' }

export default function Goals() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [goals, setGoals] = useState([])
  const [habits, setHabits] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    const [g, h] = await Promise.all([getGoals(), getHabits()])
    setGoals(g.data)
    setHabits(h.data)
  }

  function openCreate() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setError('')
    setShowModal(true)
  }

  function openEdit(goal) {
    setEditing(goal)
    setForm({
      title: goal.title,
      description: goal.description || '',
      target_value: goal.target_value,
      target_period: goal.target_period,
      start_date: goal.start_date?.slice(0, 10) || '',
      end_date: goal.end_date?.slice(0, 10) || '',
      status: goal.status,
      habit_id: goal.habit_id || ''
    })
    setError('')
    setShowModal(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const payload = { ...form, user_id: user.id, habit_id: form.habit_id || null }
      if (editing) {
        await updateGoal(editing.goal_id, payload)
      } else {
        await createGoal(payload)
      }
      setShowModal(false)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving goal')
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this goal?')) return
    await deleteGoal(id)
    load()
  }

  function habitName(id) {
    const h = habits.find(h => h.habit_id === id)
    return h ? h.name : null
  }

  const byStatus = (s) => goals.filter(g => g.status === s)

  return (
    <div className="page">
      <div className="top-bar">
        <div>
          <h1 style={{ marginBottom: 0 }}>Goals</h1>
          <p style={{ color: '#6b7280', fontSize: '0.88rem', marginTop: '0.2rem' }}>
            {goals.length} goal{goals.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ New Goal</button>
      </div>

      {goals.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🎯</div>
          <p>No goals yet. Set your first one!</p>
          <button className="btn btn-primary" onClick={openCreate}>Create Goal</button>
        </div>
      )}

      {['active', 'completed', 'failed'].map(status => {
        const group = byStatus(status)
        if (group.length === 0) return null
        const cfg = STATUS_CONFIG[status]
        return (
          <div key={status} style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '0.95rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              {cfg.icon} {status} ({group.length})
            </h2>
            <div className="goals-grid">
              {group.map(g => (
                <div className="goal-card" key={g.goal_id} style={{ '--gcolor': cfg.color, '--gbg': cfg.bg }}>
                  <div className="goal-card-header">
                    <h3 className="goal-title">{g.title}</h3>
                    <span className="goal-status-badge" style={{ background: cfg.bg, color: cfg.color }}>
                      {cfg.icon} {g.status}
                    </span>
                  </div>

                  {g.description && <p className="goal-desc">{g.description}</p>}

                  <div className="goal-meta">
                    <span className="meta-chip">
                      {PERIOD_ICON[g.target_period] || '🔁'} {g.target_value}x {g.target_period}
                    </span>
                    {habitName(g.habit_id) && (
                      <span className="meta-chip">✅ {habitName(g.habit_id)}</span>
                    )}
                    {g.start_date && (
                      <span className="meta-chip">▶ {g.start_date.slice(0,10)}</span>
                    )}
                    {g.end_date && (
                      <span className="meta-chip">⏹ {g.end_date.slice(0,10)}</span>
                    )}
                  </div>

                  <div className="habit-actions">
                    <button className="habit-btn edit" onClick={() => openEdit(g)}>✏️ Edit</button>
                    <button className="habit-btn delete" onClick={() => handleDelete(g.goal_id)}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editing ? 'Edit Goal' : 'New Goal'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required placeholder="e.g. Run 5km weekly" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Optional description" />
              </div>
              <div className="form-group">
                <label>Linked Habit</label>
                <select value={form.habit_id} onChange={e => setForm({...form, habit_id: e.target.value})}>
                  <option value="">-- None --</option>
                  {habits.map(h => <option key={h.habit_id} value={h.habit_id}>{h.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label>Target Value</label>
                  <input type="number" min={1} value={form.target_value} onChange={e => setForm({...form, target_value: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Period</label>
                  <select value={form.target_period} onChange={e => setForm({...form, target_period: e.target.value})}>
                    <option value="daily">📅 Daily</option>
                    <option value="weekly">📆 Weekly</option>
                    <option value="monthly">🗓️ Monthly</option>
                  </select>
                </div>
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
              <div className="form-group">
                <label>Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                  <option value="active">🔥 Active</option>
                  <option value="completed">✅ Completed</option>
                  <option value="failed">❌ Failed</option>
                </select>
              </div>
              {error && <p className="error-msg">{error}</p>}
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Goal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
