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

function isValidScheduledAt(value: string): boolean {
  const dateTimeMatch = value.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})?$/,
  )

  if (!dateTimeMatch) {
    return false
  }

  const [, yearValue, monthValue, dayValue, hoursValue, minutesValue, secondsValue = '0'] =
    dateTimeMatch
  const year = Number(yearValue)
  const month = Number(monthValue)
  const day = Number(dayValue)
  const hours = Number(hoursValue)
  const minutes = Number(minutesValue)
  const seconds = Number(secondsValue)
  const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
  const daysInMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  if (
    year < 1 ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > daysInMonth[month - 1] ||
    hours > 23 ||
    minutes > 59 ||
    seconds > 59
  ) {
    return false
  }

  const scheduledDate = new Date(value)
  return !Number.isNaN(scheduledDate.getTime())
}

export function validateTaskInput(input: TaskInput): TaskValidationErrors {
  const errors: TaskValidationErrors = {}

  if (!input.title.trim()) {
    errors.title = 'Enter a task title.'
  }

  if (!input.scheduledAt.trim()) {
    errors.scheduledAt = 'Choose a scheduled date and time.'
  } else if (!isValidScheduledAt(input.scheduledAt)) {
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
