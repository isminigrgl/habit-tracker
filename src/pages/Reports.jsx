import { useState, useEffect } from 'react'
import { getStatistics } from '../api'

export default function Reports() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const res = await getStatistics()
      setStats(res.data)
    } catch {
      setError('Could not load statistics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="page"><p>Loading...</p></div>
  if (error)   return <div className="page"><p className="error-msg">{error}</p></div>

  const rate = parseFloat(stats.completion_rate)
  const barColor = rate >= 75 ? '#16a34a' : rate >= 40 ? '#ca8a04' : '#dc2626'

  return (
    <div className="page">
      <h1>Reports & Statistics</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="number">{stats.total_logs}</div>
          <div className="label">Total Logs</div>
        </div>
        <div className="stat-card">
          <div className="number" style={{ color: '#16a34a' }}>{stats.completed_logs}</div>
          <div className="label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="number" style={{ color: '#dc2626' }}>{stats.missed_logs}</div>
          <div className="label">Missed</div>
        </div>
        <div className="stat-card">
          <div className="number" style={{ color: '#ca8a04' }}>{stats.skipped_logs}</div>
          <div className="label">Skipped</div>
        </div>
      </div>

      <div className="card">
        <h2>Completion Rate</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
          <div style={{
            flex: 1, height: 20, background: '#e5e7eb',
            borderRadius: 10, overflow: 'hidden'
          }}>
            <div style={{
              width: `${rate}%`, height: '100%',
              background: barColor, transition: 'width 0.5s',
              borderRadius: 10
            }} />
          </div>
          <strong style={{ minWidth: 50, color: barColor }}>{stats.completion_rate}</strong>
        </div>
        <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#666' }}>
          {rate >= 75 && 'Great job! Keep it up!'}
          {rate >= 40 && rate < 75 && 'You\'re making progress. Stay consistent!'}
          {rate < 40 && stats.total_logs > 0 && 'Room for improvement. Try to stay on track!'}
          {stats.total_logs === 0 && 'Start logging your habits to see statistics here.'}
        </p>
      </div>

      {stats.total_logs > 0 && (
        <div className="card">
          <h2>Breakdown</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem' }}>
            {[
              { label: 'Completed', value: stats.completed_logs, color: '#16a34a' },
              { label: 'Missed',    value: stats.missed_logs,    color: '#dc2626' },
              { label: 'Skipped',   value: stats.skipped_logs,   color: '#ca8a04' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <span style={{ minWidth: 80, fontSize: '0.85rem' }}>{label}</span>
                <div style={{ flex: 1, height: 12, background: '#e5e7eb', borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{
                    width: `${stats.total_logs > 0 ? (value / stats.total_logs) * 100 : 0}%`,
                    height: '100%', background: color, borderRadius: 6
                  }} />
                </div>
                <span style={{ minWidth: 30, fontSize: '0.85rem', color }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
