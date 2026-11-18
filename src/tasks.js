export const storageKey = 'gorev-defteri:tasks:v1'

const sampleTasks = [
  { id: 'sample-1', title: 'Proje konusunu belirle', completed: true },
  { id: 'sample-2', title: 'Görev ekranını tasarla', completed: false },
  { id: 'sample-3', title: 'Projeyi GitHub’a yükle', completed: false },
]

export function loadTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem(storageKey))
    if (Array.isArray(savedTasks) && savedTasks.every(isTask)) {
      return savedTasks
    }
  } catch {
    // Depolama kapalıysa veya kayıt bozuksa örnek görevlerle aç.
  }
  return sampleTasks
}

function isTask(task) {
  return task && typeof task.id === 'string' &&
    typeof task.title === 'string' && typeof task.completed === 'boolean'
}
