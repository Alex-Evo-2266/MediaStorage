import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import { describe, expect, it } from 'vitest'

describe('Media Storage app', () => {
  it('searches and filters media by title and type', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/library']}>
        <App />
      </MemoryRouter>,
    )

    const searchInput = await screen.findByPlaceholderText('Поиск по медиатеке')
    await user.clear(searchInput)
    await user.type(searchInput, 'лес')

    await waitFor(() => {
      expect(screen.getAllByText('Сосновый лес').length).toBeGreaterThan(0)
    })

    const photoFilter = screen.getAllByRole('button', { name: /^Фото$/i })[0]
    await user.click(photoFilter)

    await waitFor(() => {
      expect(screen.getAllByText('Сосновый лес').length).toBeGreaterThan(0)
    })

    expect(screen.queryByText('Городской ролик')).not.toBeInTheDocument()
  })

  it('creates a collection and adds a file to it', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/collections']}>
        <App />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /Коллекции/i }))

    const nameInput = screen.getByLabelText('Название коллекции')
    await user.type(nameInput, 'Новая подборка')

    const descriptionInput = screen.getByLabelText('Описание')
    await user.type(descriptionInput, 'Мои любимые фото')

    await user.click(screen.getByRole('button', { name: /Создать коллекцию/i }))

    await waitFor(() => {
      expect(screen.getAllByText('Новая подборка').length).toBeGreaterThan(0)
    })

    const comboBoxes = screen.getAllByLabelText('Добавить файл')
    const comboBox = comboBoxes[comboBoxes.length - 1]
    await user.click(comboBox)
    const option = await screen.findByRole('option', { name: 'Сосновый лес' })
    await user.click(option)

    const addButtons = screen.getAllByRole('button', { name: /Добавить в коллекцию/i })
    await user.click(addButtons[addButtons.length - 1])

    await waitFor(() => {
      expect(screen.getAllByText('Сосновый лес').length).toBeGreaterThan(0)
    })
  })

  it('shows an error when an invalid file is selected', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/library']}>
        <App />
      </MemoryRouter>,
    )

    await screen.findByPlaceholderText('Поиск по медиатеке')

    const uploadTrigger = screen.getByText('Выбрать файлы')
    const fileInput = uploadTrigger.closest('label')?.querySelector('input[type="file"]') as HTMLInputElement | null
    const invalidFile = new File(['invalid'], 'notes.txt', { type: 'text/plain' })

    expect(fileInput).not.toBeNull()
    await user.upload(fileInput!, invalidFile)

    await waitFor(() => {
      expect(screen.getByText(/Некорректные файлы: notes\.txt/i)).toBeInTheDocument()
    })
  })
})
