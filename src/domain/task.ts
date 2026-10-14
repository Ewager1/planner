export interface Task {
  id: string
  title: string
  scheduledAt: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface TaskInput {
  title: string
  scheduledAt: string
}

export interface TaskValidationErrors {
  title?: string
  scheduledAt?: string
}

interface TaskCreationDependencies {
  generateId: () => string
  now: () => Date
}

interface TaskUpdateDependencies {
  now: () => Date
}

const defaultDependencies: TaskCreationDependencies = {
  generateId: () => crypto.randomUUID(),
  now: () => new Date(),
}

export class TaskValidationError extends Error {
  readonly errors: TaskValidationErrors

  constructor(errors: TaskValidationErrors) {
    super('Task input is invalid.')
    this.name = 'TaskValidationError'
    this.errors = errors
  }
}

export function validateTaskInput(input: TaskInput): TaskValidationErrors {
  const errors: TaskValidationErrors = {}

  if (!input.title.trim()) {
    errors.title = 'Enter a task title.'
  }

  if (!input.scheduledAt.trim()) {
    errors.scheduledAt = 'Choose a scheduled date and time.'
  } else if (Number.isNaN(new Date(input.scheduledAt).getTime())) {
    errors.scheduledAt = 'Choose a valid scheduled date and time.'
  }

  return errors
}

export function createTask(
  input: TaskInput,
  dependencies: TaskCreationDependencies = defaultDependencies,
): Task {
  const errors = validateTaskInput(input)

  if (Object.keys(errors).length > 0) {
    throw new TaskValidationError(errors)
  }

  const timestamp = dependencies.now().toISOString()

  return {
    id: dependencies.generateId(),
    title: input.title.trim(),
    scheduledAt: new Date(input.scheduledAt).toISOString(),
    completed: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

export function updateTask(
  task: Task,
  input: TaskInput,
  dependencies: TaskUpdateDependencies = { now: () => new Date() },
): Task {
  const errors = validateTaskInput(input)

  if (Object.keys(errors).length > 0) {
    throw new TaskValidationError(errors)
  }

  return {
    ...task,
    title: input.title.trim(),
    scheduledAt: new Date(input.scheduledAt).toISOString(),
    updatedAt: dependencies.now().toISOString(),
  }
}

export function toggleTaskCompletion(
  task: Task,
  dependencies: TaskUpdateDependencies = { now: () => new Date() },
): Task {
  return {
    ...task,
    completed: !task.completed,
    updatedAt: dependencies.now().toISOString(),
  }
}
