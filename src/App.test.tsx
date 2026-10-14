import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App.tsx'
import type { Task } from './domain/task.ts'
import { TaskRepository } from './services/taskRepository.ts'

const laterTask: Task = {
  id: 'task-later',
  title: 'Later task',
  scheduledAt: '2026-10-16T17:30:00.000Z',
  completed: true,
  createdAt: '2026-10-14T17:00:00.000Z',
  updatedAt: '2026-10-14T17:00:00.000Z',
}

const earlierTask: Task = {
  ...laterTask,
  id: 'task-earlier',
  title: 'Earlier task',
  scheduledAt: '2026-10-15T13:30:00.000Z',
  completed: false,
}

function getLocalScheduleParts(scheduledAt: string) {
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

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the planner application heading', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Planner' })).toBeInTheDocument()
  })

  it('displays an empty state when no tasks are saved', () => {
    render(<App />)

    expect(screen.getByText('No tasks yet.')).toBeInTheDocument()
  })

  it('loads and renders saved tasks in chronological order', () => {
    new TaskRepository().save([laterTask, earlierTask])

    render(<App />)

    const taskList = screen.getByRole('list', { name: 'Tasks' })
    const taskHeadings = within(taskList).getAllByRole('heading', { level: 2 })

    expect(taskHeadings.map((heading) => heading.textContent)).toEqual([
      'Earlier task',
      'Later task',
    ])
    expect(within(taskList).getByText('Incomplete')).toBeInTheDocument()
    expect(within(taskList).getByText('Completed')).toBeInTheDocument()
    expect(within(taskList).getAllByRole('time')).toHaveLength(2)
  })

  it('validates required task fields', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Add task' }))
    fireEvent.click(screen.getByRole('button', { name: 'Create task' }))

    expect(screen.getByText('Enter a task title.')).toBeInTheDocument()
    expect(
      screen.getByText('Choose a scheduled date and time.'),
    ).toBeInTheDocument()
  })

  it('creates, displays, and persists a task', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Add task' }))
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Write project update' },
    })
    fireEvent.change(screen.getByLabelText('Scheduled date'), {
      target: { value: '2026-10-15' },
    })
    fireEvent.change(screen.getByLabelText('Scheduled time'), {
      target: { value: '09:30' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Create task' }))

    expect(
      screen.getByRole('heading', { name: 'Write project update' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Incomplete')).toBeInTheDocument()
    expect(new TaskRepository().list()).toEqual([
      expect.objectContaining({
        title: 'Write project update',
        completed: false,
      }),
    ])
  })

  it('populates the edit form and persists saved changes', () => {
    new TaskRepository().save([earlierTask])
    const initialSchedule = getLocalScheduleParts(earlierTask.scheduledAt)

    render(<App />)

    fireEvent.click(
      screen.getByRole('button', { name: `Edit ${earlierTask.title}` }),
    )

    expect(screen.getByLabelText('Title')).toHaveValue(earlierTask.title)
    expect(screen.getByLabelText('Scheduled date')).toHaveValue(
      initialSchedule.date,
    )
    expect(screen.getByLabelText('Scheduled time')).toHaveValue(
      initialSchedule.time,
    )

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Updated task' },
    })
    fireEvent.change(screen.getByLabelText('Scheduled date'), {
      target: { value: '2026-10-20' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(
      screen.getByRole('heading', { name: 'Updated task' }),
    ).toBeInTheDocument()
    expect(new TaskRepository().list()).toEqual([
      expect.objectContaining({
        id: earlierTask.id,
        title: 'Updated task',
        createdAt: earlierTask.createdAt,
        completed: earlierTask.completed,
      }),
    ])
  })

  it('cancels an edit without modifying the task', () => {
    new TaskRepository().save([earlierTask])

    render(<App />)

    fireEvent.click(
      screen.getByRole('button', { name: `Edit ${earlierTask.title}` }),
    )
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Discarded change' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(
      screen.getByRole('heading', { name: earlierTask.title }),
    ).toBeInTheDocument()
    expect(screen.queryByDisplayValue('Discarded change')).not.toBeInTheDocument()
    expect(new TaskRepository().list()).toEqual([earlierTask])
  })

  it('toggles completion and persists the new state', () => {
    new TaskRepository().save([earlierTask])

    render(<App />)

    fireEvent.click(
      screen.getByRole('checkbox', {
        name: `Mark ${earlierTask.title} as complete`,
      }),
    )

    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(new TaskRepository().list()[0]).toEqual(
      expect.objectContaining({ completed: true }),
    )

    fireEvent.click(
      screen.getByRole('checkbox', {
        name: `Mark ${earlierTask.title} as incomplete`,
      }),
    )

    expect(screen.getByText('Incomplete')).toBeInTheDocument()
    expect(new TaskRepository().list()[0]).toEqual(
      expect.objectContaining({ completed: false }),
    )
  })

  it('deletes a task from the list and storage', () => {
    new TaskRepository().save([earlierTask])

    render(<App />)

    fireEvent.click(
      screen.getByRole('button', { name: `Delete ${earlierTask.title}` }),
    )

    expect(
      screen.queryByRole('heading', { name: earlierTask.title }),
    ).not.toBeInTheDocument()
    expect(screen.getByText('No tasks yet.')).toBeInTheDocument()
    expect(new TaskRepository().list()).toEqual([])
  })
})
