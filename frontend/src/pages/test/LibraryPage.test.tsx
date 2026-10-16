import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { LibraryPage } from '../LibraryPage'
import type { MediaItem } from '../../types/media'

const mockItems = [
  {
    id: '1',
    title: 'Отпуск.png',
    type: 'image',
    size: 1024,
    previewUrl: null,
    createdAt: '2026-10-16T09:00:00Z',
    tags: [],
  },
  {
    id: '2',
    title: 'Видео.mp4',
    type: 'video',
    size: 2048,
    previewUrl: null,
    createdAt: '2026-10-16T09:00:00Z',
    tags: [],
  },
  {
    id: '3',
    title: 'Музыка.mp3',
    type: 'audio',
    size: 4096,
    previewUrl: null,
    createdAt: '2026-10-16T09:00:00Z',
    tags: [],
  },
] satisfies MediaItem[]

function renderLibrary(props: Partial<React.ComponentProps<typeof LibraryPage>> = {}) {
  return render(
    <MemoryRouter>
      <LibraryPage items={mockItems} {...props} />
    </MemoryRouter>,
  )
}

describe('LibraryPage', () => {
  it('показывает сообщение во время загрузки', () => {
    renderLibrary({ loading: true })

    expect(
      screen.getByText('Загрузка медиафайлов...'),
    ).toBeInTheDocument()
  })

  it('отображает файлы разных типов', () => {
    renderLibrary()

    expect(screen.getByText('Медиатека')).toBeInTheDocument()
    expect(screen.getByText('Отпуск.png')).toBeInTheDocument()
    expect(screen.getByText('Видео.mp4')).toBeInTheDocument()
    expect(screen.getByText('Музыка.mp3')).toBeInTheDocument()
  })

  it('вызывает обработчик при выборе фильтра «Фото»', async () => {
    const user = userEvent.setup()
    const onFilterChange = vi.fn()

    renderLibrary({ onFilterChange })

    await user.click(screen.getByRole('button', { name: 'Фото' }))

    expect(onFilterChange).toHaveBeenCalledWith('image')
  })
})