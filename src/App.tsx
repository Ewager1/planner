import { useMemo, useState } from 'react'
import { TaskForm } from './components/TaskForm.tsx'
import { TaskList } from './components/TaskList.tsx'
import {
  createTask,
  toggleTaskCompletion,
  updateTask,
  type Task,
  type TaskInput,
} from './domain/task.ts'
import { TaskRepository, TaskStorageError } from './services/taskRepository.ts'
import styles from './App.module.css'

interface InitialTaskState {
  tasks: Task[]
  error: string | null
}

interface AppProps {
  repository?: TaskRepository
}

function loadTasks(repository: TaskRepository): InitialTaskState {
  try {
    return { tasks: repository.list(), error: null }
  } catch {
    return {
      tasks: [],
      error: 'Saved tasks could not be loaded. Your stored data was left unchanged.',
    }
  }
}

function getStorageErrorMessage(error: unknown, action: string): string {
  if (error instanceof TaskStorageError) {
    return error.operation === 'read'
      ? `${action} because stored tasks could not be read safely. Your existing data was left unchanged.`
      : `${action} in browser storage. Your existing tasks remain unchanged.`
  }

  return `${action}.`
}

function App({ repository: providedRepository }: AppProps = {}) {
  const repository = useMemo(
    () => providedRepository ?? new TaskRepository(),
    [providedRepository],
  )
  const [{ tasks, error }, setTaskState] = useState(() => loadTasks(repository))
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  function handleSubmitTask(input: TaskInput) {
    try {
      const nextTasks = editingTask
        ? repository.update(updateTask(editingTask, input))
        : repository.add(createTask(input))
      setTaskState({ tasks: nextTasks, error: null })
      setIsTaskFormOpen(false)
      setEditingTask(null)
    } catch (error) {
      setTaskState((currentState) => ({
        ...currentState,
        error: getStorageErrorMessage(error, 'The task could not be saved'),
      }))
    }
  }

  function handleToggleTask(task: Task) {
    try {
      const nextTasks = repository.update(toggleTaskCompletion(task))
      setTaskState({ tasks: nextTasks, error: null })
    } catch (error) {
      setTaskState((currentState) => ({
        ...currentState,
        error: getStorageErrorMessage(error, 'The task could not be updated'),
      }))
    }
  }

  function handleDeleteTask(task: Task) {
    try {
      const nextTasks = repository.remove(task.id)
      setTaskState({ tasks: nextTasks, error: null })

      if (editingTask?.id === task.id) {
        setEditingTask(null)
      }
    } catch (error) {
      setTaskState((currentState) => ({
        ...currentState,
        error: getStorageErrorMessage(error, 'The task could not be deleted'),
      }))
    }
  }

  return (
    <main className={styles.shell}>
      <section className={styles.card} aria-labelledby="app-title">
        <header className={styles.header}>
          <p className={styles.eyebrow}>Make time for what matters</p>
          <h1 className={styles.title} id="app-title">
            Planner
          </h1>
          {!isTaskFormOpen && !editingTask ? (
            <button
              className={styles.addButton}
              type="button"
              onClick={() => setIsTaskFormOpen(true)}
            >
              Add task
            </button>
          ) : null}
        </header>

        {error ? (
          <p className={styles.alert} role="alert">
            {error}
          </p>
        ) : null}
        {isTaskFormOpen || editingTask ? (
          <TaskForm
            key={editingTask?.id ?? 'new-task'}
            task={editingTask ?? undefined}
            onCancel={() => {
              setIsTaskFormOpen(false)
              setEditingTask(null)
            }}
            onSubmit={handleSubmitTask}
          />
        ) : null}
        <TaskList
          tasks={tasks}
          onDelete={handleDeleteTask}
          onEdit={(task) => {
            setIsTaskFormOpen(false)
            setEditingTask(task)
          }}
          onToggle={handleToggleTask}
        />
      </section>
    </main>
  )
}

export default App
