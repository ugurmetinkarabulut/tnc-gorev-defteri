import { useLayoutEffect, useRef, useState } from 'react'

export default function TaskRow({ task, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(task.title)
  const [error, setError] = useState('')
  const editor = useRef(null)
  const editButton = useRef(null)
  const restoreFocus = useRef(false)

  useLayoutEffect(() => {
    if (editing) {
      editor.current.focus()
      editor.current.select()
    } else if (restoreFocus.current) {
      editButton.current.focus()
      restoreFocus.current = false
    }
  }, [editing])

  function stopEditing() {
    restoreFocus.current = true
    setEditing(false)
  }

  function save(event) {
    event.preventDefault()
    const title = draft.trim()
    if (!title) {
      setError('Bir görev adı yaz.')
      editor.current.focus()
      return
    }
    onUpdate(task.id, { title })
    stopEditing()
  }

  return (
    <li className="task-row">
      {editing ? (
        <form className="edit-form" onSubmit={save} onKeyDown={(event) => {
          if (event.key === 'Escape') stopEditing()
        }}>
          <input
            ref={editor}
            aria-label="Görev adını düzenle"
            aria-invalid={Boolean(error)}
            maxLength={120}
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value)
              setError('')
            }}
          />
          <div className="row-actions">
            <button className="primary small" type="submit">Kaydet</button>
            <button className="outline" type="button" onClick={stopEditing}>Vazgeç</button>
          </div>
          {error && <p className="error" role="alert">{error}</p>}
        </form>
      ) : (
        <>
          <label className="task-label">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={(event) => onUpdate(task.id, { completed: event.target.checked })}
            />
            <span>{task.title}</span>
          </label>
          <div className="row-actions">
            <button ref={editButton} className="outline" aria-label={task.title + ' görevini düzenle'} onClick={() => {
              setDraft(task.title)
              setError('')
              setEditing(true)
            }}>Düzenle</button>
            <button className="outline delete" aria-label={task.title + ' görevini sil'} onClick={() => onDelete(task.id)}>Sil</button>
          </div>
        </>
      )}
    </li>
  )
}
