import { useState } from 'react'
import { TaskList } from './components/TaskList.tsx'
import type { Task } from './domain/task.ts'
import { TaskRepository } from './services/taskRepository.ts'

interface InitialTaskState {
  tasks: Task[]
  error: string | null
}

function loadTasks(): InitialTaskState {
  try {
    return { tasks: new TaskRepository().list(), error: null }
  } catch {
    return {
      tasks: [],
      error: 'Saved tasks could not be loaded.',
    }
  }
}

function App() {
  const [{ tasks, error }] = useState(loadTasks)

  return (
    <main className="app-shell">
      <section className="app-card" aria-labelledby="app-title">
        <header className="app-header">
          <p className="eyebrow">Make time for what matters</p>
          <h1 id="app-title">Planner</h1>
        </header>

        {error ? <p role="alert">{error}</p> : null}
        <TaskList tasks={tasks} />
      </section>
    </main>
  )
}

export default App
