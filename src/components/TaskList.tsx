import type { Task } from '../domain/task.ts'
import styles from './TaskList.module.css'

interface TaskListProps {
  onDelete: (task: Task) => void
  onEdit: (task: Task) => void
  onToggle: (task: Task) => void
  tasks: Task[]
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
})

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  timeStyle: 'short',
})

export function TaskList({ onDelete, onEdit, onToggle, tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className={styles.empty}>No tasks yet.</p>
  }

  const sortedTasks = [...tasks].sort(
    (firstTask, secondTask) =>
      new Date(firstTask.scheduledAt).getTime() -
      new Date(secondTask.scheduledAt).getTime(),
  )

  return (
    <ul className={styles.list} aria-label="Tasks">
      {sortedTasks.map((task) => {
        const scheduledDate = new Date(task.scheduledAt)

        return (
          <li
            className={`${styles.item} ${task.completed ? styles.itemCompleted : ''}`}
            key={task.id}
          >
            <input
              aria-label={`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
              checked={task.completed}
              className={styles.completionToggle}
              type="checkbox"
              onChange={() => onToggle(task)}
            />
            <div className={styles.details}>
              <h2>{task.title}</h2>
              <time dateTime={task.scheduledAt}>
                <span>{dateFormatter.format(scheduledDate)}</span>
                <span>{timeFormatter.format(scheduledDate)}</span>
              </time>
            </div>
            <div className={styles.actions}>
              <span className={styles.status}>
                {task.completed ? 'Completed' : 'Incomplete'}
              </span>
              <button
                aria-label={`Edit ${task.title}`}
                className={styles.secondaryButton}
                type="button"
                onClick={() => onEdit(task)}
              >
                Edit
              </button>
              <button
                aria-label={`Delete ${task.title}`}
                className={styles.dangerButton}
                type="button"
                onClick={() => onDelete(task)}
              >
                Delete
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
