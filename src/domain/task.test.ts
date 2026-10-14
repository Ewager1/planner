import { describe, expect, it } from 'vitest'
import {
  createTask,
  TaskValidationError,
  toggleTaskCompletion,
  updateTask,
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

    expect(
      validateTaskInput({
        title: 'Plan tomorrow',
        scheduledAt: '2026-10-15',
      }),
    ).toEqual({ scheduledAt: 'Choose a valid scheduled date and time.' })

    expect(
      validateTaskInput({
        title: 'Plan tomorrow',
        scheduledAt: '2026-02-30T09:30',
      }),
    ).toEqual({ scheduledAt: 'Choose a valid scheduled date and time.' })

    expect(
      validateTaskInput({
        title: 'Plan tomorrow',
        scheduledAt: '2026-02-30T09:30:00.000Z',
      }),
    ).toEqual({ scheduledAt: 'Choose a valid scheduled date and time.' })
  })
})

describe('updateTask', () => {
  it('updates editable fields and the modification timestamp', () => {
    const originalTask = createTask(
      {
        title: 'Original title',
        scheduledAt: '2026-10-15T13:30:00.000Z',
      },
      {
        generateId: () => 'task-1',
        now: () => new Date('2026-10-14T17:00:00.000Z'),
      },
    )

    const updatedTask = updateTask(
      originalTask,
      {
        title: '  Updated title  ',
        scheduledAt: '2026-10-16T09:00:00-04:00',
      },
      { now: () => new Date('2026-10-14T18:00:00.000Z') },
    )

    expect(updatedTask).toEqual({
      ...originalTask,
      title: 'Updated title',
      scheduledAt: '2026-10-16T13:00:00.000Z',
      updatedAt: '2026-10-14T18:00:00.000Z',
    })
  })
})

describe('toggleTaskCompletion', () => {
  it('toggles completion and updates the modification timestamp', () => {
    const task = createTask(
      {
        title: 'Finish report',
        scheduledAt: '2026-10-15T13:30:00.000Z',
      },
      {
        generateId: () => 'task-1',
        now: () => new Date('2026-10-14T17:00:00.000Z'),
      },
    )

    expect(
      toggleTaskCompletion(task, {
        now: () => new Date('2026-10-14T18:00:00.000Z'),
      }),
    ).toEqual({
      ...task,
      completed: true,
      updatedAt: '2026-10-14T18:00:00.000Z',
    })
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
