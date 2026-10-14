import { describe, expect, it } from 'vitest'
import {
  createTask,
  TaskValidationError,
  validateTaskInput,
} from './task.ts'

describe('validateTaskInput', () => {
  it('accepts a valid title and scheduled timestamp', () => {
    expect(
      validateTaskInput({
        title: 'Plan tomorrow',
        scheduledAt: '2026-10-15T13:30:00.000Z',
      }),
    ).toEqual({})
  })

  it('rejects a blank title', () => {
    expect(
      validateTaskInput({
        title: '   ',
        scheduledAt: '2026-10-15T13:30:00.000Z',
      }),
    ).toEqual({ title: 'Enter a task title.' })
  })

  it('rejects missing and invalid scheduled timestamps', () => {
    expect(
      validateTaskInput({ title: 'Plan tomorrow', scheduledAt: '' }),
    ).toEqual({ scheduledAt: 'Choose a scheduled date and time.' })

    expect(
      validateTaskInput({
        title: 'Plan tomorrow',
        scheduledAt: 'not-a-date',
      }),
    ).toEqual({ scheduledAt: 'Choose a valid scheduled date and time.' })
  })
})

describe('createTask', () => {
  it('creates a normalized, incomplete task with consistent timestamps', () => {
    const task = createTask(
      {
        title: '  Plan tomorrow  ',
        scheduledAt: '2026-10-15T09:30:00-04:00',
      },
      {
        generateId: () => 'task-1',
        now: () => new Date('2026-10-14T17:00:00.000Z'),
      },
    )

    expect(task).toEqual({
      id: 'task-1',
      title: 'Plan tomorrow',
      scheduledAt: '2026-10-15T13:30:00.000Z',
      completed: false,
      createdAt: '2026-10-14T17:00:00.000Z',
      updatedAt: '2026-10-14T17:00:00.000Z',
    })
  })

  it('generates a unique identifier for each task', () => {
    const input = {
      title: 'Plan tomorrow',
      scheduledAt: '2026-10-15T13:30:00.000Z',
    }

    expect(createTask(input).id).not.toBe(createTask(input).id)
  })

  it('throws a validation error for invalid input', () => {
    expect(() => createTask({ title: ' ', scheduledAt: '' })).toThrow(
      TaskValidationError,
    )
  })
})
