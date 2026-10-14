import { useState, type FormEvent } from 'react'
import {
  validateTaskInput,
  type TaskInput,
  type TaskValidationErrors,
} from '../domain/task.ts'

interface TaskFormProps {
  onCancel: () => void
  onCreate: (input: TaskInput) => void
}

export function TaskForm({ onCancel, onCreate }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
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
      onCreate(input)
    }
  }

  return (
    <form className="task-form" noValidate onSubmit={handleSubmit}>
      <div className="form-field">
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
          <span className="field-error" id="task-title-error">
            {errors.title}
          </span>
        ) : null}
      </div>

      <div className="form-row">
        <div className="form-field">
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

        <div className="form-field">
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
        <span className="field-error" id="task-schedule-error">
          {errors.scheduledAt}
        </span>
      ) : null}

      <div className="form-actions">
        <button type="submit">Create task</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
