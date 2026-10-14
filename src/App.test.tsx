import { render, screen, within } from '@testing-library/react'
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
})
