import { useState, type FormEvent } from 'react'
import {
  validateTaskInput,
  type Task,
  type TaskInput,
  type TaskValidationErrors,
} from '../domain/task.ts'
import styles from './TaskForm.module.css'

interface TaskFormProps {
  task?: Task
  onCancel: () => void
  onSubmit: (input: TaskInput) => void
}

function getLocalScheduleParts(scheduledAt?: string) {
  if (!scheduledAt) {
    return { date: '', time: '' }
  }

  const scheduledDate = new Date(scheduledAt)
  const localDate = new Date(
    scheduledDate.getTime() - scheduledDate.getTimezoneOffset() * 60_000,
  )
    .toISOString()
    .slice(0, 16)

  return {
    date: localDate.slice(0, 10),
    time: localDate.slice(11, 16),
  }
}

export function TaskForm({ task, onCancel, onSubmit }: TaskFormProps) {
  const initialSchedule = getLocalScheduleParts(task?.scheduledAt)
  const [title, setTitle] = useState(task?.title ?? '')
  const [date, setDate] = useState(initialSchedule.date)
  const [time, setTime] = useState(initialSchedule.time)
  const [errors, setErrors] = useState<TaskValidationErrors>({})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const input: TaskInput = {
      title,
      scheduledAt: date && time ? `${date}T${time}` : '',
    }
    const nextErrors = validateTaskInput(input)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length === 0) {
      onSubmit(input)
    }
  }

  return (
    <form
      aria-labelledby="task-form-title"
      className={styles.form}
      noValidate
      onSubmit={handleSubmit}
    >
      <h2 className={styles.title} id="task-form-title">
        {task ? 'Edit task' : 'Create a task'}
      </h2>
      <div className={styles.field}>
        <label htmlFor="task-title">Title</label>
        <input
          aria-describedby={errors.title ? 'task-title-error' : undefined}
          aria-invalid={Boolean(errors.title)}
          id="task-title"
          onChange={(event) => setTitle(event.target.value)}
          required
          type="text"
          value={title}
        />
        {errors.title ? (
          <span className={styles.error} id="task-title-error">
            {errors.title}
          </span>
        ) : null}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="task-date">Scheduled date</label>
          <input
            aria-describedby={errors.scheduledAt ? 'task-schedule-error' : undefined}
            aria-invalid={Boolean(errors.scheduledAt)}
            id="task-date"
            onChange={(event) => setDate(event.target.value)}
            required
            type="date"
            value={date}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="task-time">Scheduled time</label>
          <input
            aria-describedby={errors.scheduledAt ? 'task-schedule-error' : undefined}
            aria-invalid={Boolean(errors.scheduledAt)}
            id="task-time"
            onChange={(event) => setTime(event.target.value)}
            required
            type="time"
            value={time}
          />
        </div>
      </div>

      {errors.scheduledAt ? (
        <span className={styles.error} id="task-schedule-error">
          {errors.scheduledAt}
        </span>
      ) : null}

      <div className={styles.actions}>
        <button className={styles.primaryButton} type="submit">
          {task ? 'Save changes' : 'Create task'}
        </button>
        <button className={styles.secondaryButton} type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
