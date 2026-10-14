import { useMemo, useState } from 'react'
import { TaskForm } from './components/TaskForm.tsx'
import { TaskList } from './components/TaskList.tsx'
import { createTask, type Task, type TaskInput } from './domain/task.ts'
import { TaskRepository } from './services/taskRepository.ts'

interface InitialTaskState {
  tasks: Task[]
  error: string | null
}

function loadTasks(repository: TaskRepository): InitialTaskState {
  try {
    return { tasks: repository.list(), error: null }
  } catch {
    return {
      tasks: [],
      error: 'Saved tasks could not be loaded.',
    }
  }
}

function App() {
  const repository = useMemo(() => new TaskRepository(), [])
  const [{ tasks, error }, setTaskState] = useState(() => loadTasks(repository))
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)

  function handleCreateTask(input: TaskInput) {
    try {
      const nextTasks = repository.add(createTask(input))
      setTaskState({ tasks: nextTasks, error: null })
      setIsTaskFormOpen(false)
    } catch {
      setTaskState((currentState) => ({
        ...currentState,
        error: 'The task could not be saved.',
      }))
    }
  }

  return (
    <main className="app-shell">
      <section className="app-card" aria-labelledby="app-title">
        <header className="app-header">
          <p className="eyebrow">Make time for what matters</p>
          <h1 id="app-title">Planner</h1>
          {!isTaskFormOpen ? (
            <button type="button" onClick={() => setIsTaskFormOpen(true)}>
              Add task
            </button>
          ) : null}
        </header>

        {error ? <p role="alert">{error}</p> : null}
        {isTaskFormOpen ? (
          <TaskForm
            onCancel={() => setIsTaskFormOpen(false)}
            onCreate={handleCreateTask}
          />
        ) : null}
        <TaskList tasks={tasks} />
      </section>
    </main>
  )
}

export default App
