import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Task } from '../domain/task.ts'
import { TaskRepository, TaskStorageError } from './taskRepository.ts'

const task: Task = {
  id: 'task-1',
  title: 'Plan tomorrow',
  scheduledAt: '2026-10-15T13:30:00.000Z',
  completed: false,
  createdAt: '2026-10-14T17:00:00.000Z',
  updatedAt: '2026-10-14T17:00:00.000Z',
}

describe('TaskRepository', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns an empty list when no tasks are stored', () => {
    expect(new TaskRepository().list()).toEqual([])
  })

  it('saves and retrieves tasks', () => {
    const repository = new TaskRepository()

    repository.save([task])

    expect(repository.list()).toEqual([task])
  })

  it('adds, updates, and removes task records', () => {
    const repository = new TaskRepository()
    const updatedTask = {
      ...task,
      title: 'Plan the week',
      updatedAt: '2026-10-14T18:00:00.000Z',
    }

    expect(repository.add(task)).toEqual([task])
    expect(repository.update(updatedTask)).toEqual([updatedTask])
    expect(repository.remove(task.id)).toEqual([])
    expect(repository.list()).toEqual([])
  })

  it('rejects malformed stored data without overwriting it', () => {
    const setItem = vi.fn()
    const storage: Storage = {
      length: 1,
      clear: vi.fn(),
      getItem: vi.fn(() => '{malformed'),
      key: vi.fn(() => 'planner.tasks'),
      removeItem: vi.fn(),
      setItem,
    }
    const repository = new TaskRepository(storage)

    expect(() => repository.add(task)).toThrow(TaskStorageError)
    expect(setItem).not.toHaveBeenCalled()
  })

  it('rejects stored task records with an invalid shape', () => {
    localStorage.setItem('planner.tasks', JSON.stringify([{ ...task, title: '' }]))

    expect(() => new TaskRepository().list()).toThrow(
      'Stored task data is malformed and was left unchanged.',
    )
  })

  it('wraps browser storage read failures', () => {
    const storage: Storage = {
      length: 0,
      clear: vi.fn(),
      getItem: vi.fn(() => {
        throw new Error('Storage unavailable')
      }),
      key: vi.fn(() => null),
      removeItem: vi.fn(),
      setItem: vi.fn(),
    }

    expect(() => new TaskRepository(storage).list()).toThrow(
      'Task data could not be read from browser storage.',
    )
  })

  it('wraps browser storage write failures', () => {
    const storage: Storage = {
      length: 0,
      clear: vi.fn(),
      getItem: vi.fn(() => null),
      key: vi.fn(() => null),
      removeItem: vi.fn(),
      setItem: vi.fn(() => {
        throw new Error('Storage unavailable')
      }),
    }

    expect(() => new TaskRepository(storage).add(task)).toThrow(
      'Task data could not be saved to browser storage.',
    )
  })
})
