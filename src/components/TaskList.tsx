import type { Task } from '../domain/task.ts'

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
    return <p className="empty-state">No tasks yet.</p>
  }

  const sortedTasks = [...tasks].sort(
    (firstTask, secondTask) =>
      new Date(firstTask.scheduledAt).getTime() -
      new Date(secondTask.scheduledAt).getTime(),
  )

  return (
    <ul className="task-list" aria-label="Tasks">
      {sortedTasks.map((task) => {
        const scheduledDate = new Date(task.scheduledAt)

        return (
          <li
            className={`task-item${task.completed ? ' task-item--completed' : ''}`}
            key={task.id}
          >
            <input
              aria-label={`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
              checked={task.completed}
              type="checkbox"
              onChange={() => onToggle(task)}
            />
            <div className="task-details">
              <h2>{task.title}</h2>
              <time dateTime={task.scheduledAt}>
                <span>{dateFormatter.format(scheduledDate)}</span>
                <span>{timeFormatter.format(scheduledDate)}</span>
              </time>
            </div>
            <div className="task-actions">
              <span className="task-status">
                {task.completed ? 'Completed' : 'Incomplete'}
              </span>
              <button
                aria-label={`Edit ${task.title}`}
                type="button"
                onClick={() => onEdit(task)}
              >
                Edit
              </button>
              <button
                aria-label={`Delete ${task.title}`}
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
