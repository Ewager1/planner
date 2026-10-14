import type { Task } from '../domain/task.ts'

const DEFAULT_STORAGE_KEY = 'planner.tasks'

type StorageOperation = 'read' | 'write'

export class TaskStorageError extends Error {
  readonly operation: StorageOperation

  constructor(message: string, operation: StorageOperation, cause?: unknown) {
    super(message, { cause })
    this.name = 'TaskStorageError'
    this.operation = operation
  }
}

function isValidTimestamp(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(new Date(value).getTime())
}

function isTaskRecord(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const task = value as Record<string, unknown>

  return (
    typeof task.id === 'string' &&
    task.id.length > 0 &&
    typeof task.title === 'string' &&
    task.title.length > 0 &&
    task.title === task.title.trim() &&
    isValidTimestamp(task.scheduledAt) &&
    typeof task.completed === 'boolean' &&
    isValidTimestamp(task.createdAt) &&
    isValidTimestamp(task.updatedAt)
  )
}

export class TaskRepository {
  private readonly storage: Storage
  private readonly storageKey: string

  constructor(storage: Storage = window.localStorage, storageKey = DEFAULT_STORAGE_KEY) {
    this.storage = storage
    this.storageKey = storageKey
  }

  list(): Task[] {
    let storedValue: string | null

    try {
      storedValue = this.storage.getItem(this.storageKey)
    } catch (error) {
      throw new TaskStorageError(
        'Task data could not be read from browser storage.',
        'read',
        error,
      )
    }

    if (storedValue === null) {
      return []
    }

    try {
      const parsedValue: unknown = JSON.parse(storedValue)

      if (!Array.isArray(parsedValue) || !parsedValue.every(isTaskRecord)) {
        throw new Error('Stored task data has an invalid shape.')
      }

      return parsedValue
    } catch (error) {
      throw new TaskStorageError(
        'Stored task data is malformed and was left unchanged.',
        'read',
        error,
      )
    }
  }

  save(tasks: Task[]): void {
    if (!tasks.every(isTaskRecord)) {
      throw new TaskStorageError('Invalid task data cannot be saved.', 'write')
    }

    this.list()
    this.write(tasks)
  }

  add(task: Task): Task[] {
    const tasks = this.list()

    if (tasks.some((existingTask) => existingTask.id === task.id)) {
      throw new TaskStorageError('A task with this identifier already exists.', 'write')
    }

    const nextTasks = [...tasks, task]
    this.write(nextTasks)
    return nextTasks
  }

  update(task: Task): Task[] {
    const tasks = this.list()
    const taskIndex = tasks.findIndex((existingTask) => existingTask.id === task.id)

    if (taskIndex === -1) {
      throw new TaskStorageError('The task to update could not be found.', 'write')
    }

    const nextTasks = tasks.map((existingTask) =>
      existingTask.id === task.id ? task : existingTask,
    )
    this.write(nextTasks)
    return nextTasks
  }

  remove(taskId: string): Task[] {
    const tasks = this.list()
    const nextTasks = tasks.filter((task) => task.id !== taskId)

    if (nextTasks.length !== tasks.length) {
      this.write(nextTasks)
    }

    return nextTasks
  }

  private write(tasks: Task[]): void {
    if (!tasks.every(isTaskRecord)) {
      throw new TaskStorageError('Invalid task data cannot be saved.', 'write')
    }

    try {
      this.storage.setItem(this.storageKey, JSON.stringify(tasks))
    } catch (error) {
      throw new TaskStorageError(
        'Task data could not be saved to browser storage.',
        'write',
        error,
      )
    }
  }
}
