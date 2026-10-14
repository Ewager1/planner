import type { Task } from '../domain/task.ts'

interface TaskListProps {
  onEdit: (task: Task) => void
  tasks: Task[]
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
})

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  timeStyle: 'short',
})

export function TaskList({ onEdit, tasks }: TaskListProps) {
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
          <li className="task-item" key={task.id}>
            <div>
              <h2>{task.title}</h2>
              <time dateTime={task.scheduledAt}>
                <span>{dateFormatter.format(scheduledDate)}</span>
                <span>{timeFormatter.format(scheduledDate)}</span>
              </time>
            </div>
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
          </li>
        )
      })}
    </ul>
  )
}
