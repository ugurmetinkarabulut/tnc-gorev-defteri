import { useEffect, useRef, useState } from 'react'
import TaskRow from './components/TaskRow.jsx'
import { loadTasks, storageKey } from './tasks.js'

const filters = [
  { id: 'all', label: 'Tümü', empty: 'İlk görevini yukarıdan ekleyebilirsin.' },
  { id: 'pending', label: 'Bekleyen', empty: 'Bekleyen görev yok.' },
  { id: 'done', label: 'Tamamlanan', empty: 'Henüz tamamlanan görev yok.' },
]

export default function App() {
  const [tasks, setTasks] = useState(loadTasks)
  const [title, setTitle] = useState('')
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState('')
  const [storageError, setStorageError] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const addInput = useRef(null)

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(tasks))
      setStorageError(false)
    } catch {
      setStorageError(true)
    }
  }, [tasks])

  const completed = tasks.filter((task) => task.completed).length
  const visibleTasks = tasks.filter((task) =>
    filter === 'all' || task.completed === (filter === 'done'),
  )

  function addTask(event) {
    event.preventDefault()
    const cleanTitle = title.trim()
    if (!cleanTitle) {
      setError('Bir görev adı yaz.')
      addInput.current.focus()
      return
    }

    const task = { id: crypto.randomUUID(), title: cleanTitle, completed: false }
    setTasks((current) => [...current, task])
    setFilter('all')
    setTitle('')
    setError('')
    setAnnouncement(cleanTitle + ' eklendi.')
    addInput.current.focus()
  }

  function updateTask(id, changes) {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, ...changes } : task))
    if (changes.title) setAnnouncement(changes.title + ' güncellendi.')
  }

  function deleteTask(id) {
    const task = tasks.find((item) => item.id === id)
    setTasks((current) => current.filter((item) => item.id !== id))
    setAnnouncement(task.title + ' silindi.')
    addInput.current.focus()
  }

  return (
    <>
      <header className="site-header">
        <span className="brand-mark" aria-hidden="true"><span /></span>
        Görev Defteri
      </header>

      <main>
        <h1>Görevlerim</h1>
        <p className="summary">{tasks.length} görev var, {completed} tamamlandı</p>
        <div className="progress">
          <span aria-hidden="true">{completed}/{tasks.length}</span>
          <progress aria-label="Tamamlanan görev oranı" value={completed} max={tasks.length || 1} />
        </div>

        <form className="add-form" onSubmit={addTask}>
          <input
            ref={addInput}
            aria-label="Yeni görev"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'add-error' : undefined}
            placeholder="Yeni görev yaz…"
            maxLength={120}
            value={title}
            onChange={(event) => {
              setTitle(event.target.value)
              setError('')
            }}
          />
          <button className="primary" type="submit"><span aria-hidden="true">+</span> Görev ekle</button>
          {error && <p className="error" id="add-error" role="alert">{error}</p>}
        </form>

        <div className="filters" role="group" aria-label="Görev filtresi">
          {filters.map(({ id, label }) => (
            <button key={id} aria-pressed={filter === id} onClick={() => setFilter(id)}>
              {label}
            </button>
          ))}
        </div>

        {visibleTasks.length > 0 ? (
          <ul className="task-list" aria-label="Görev listesi">
            {visibleTasks.map((task) => (
              <TaskRow key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} />
            ))}
          </ul>
        ) : (
          <p className="empty">{filters.find(({ id }) => id === filter).empty}</p>
        )}

        {storageError && <p className="error storage-error" role="alert">Görevler tarayıcıya kaydedilemedi. Bu sayfa açıkken düzenlemeye devam edebilirsin.</p>}
        <p className="sr-only" role="status">{announcement}</p>
      </main>
    </>
  )
}
