import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { uploadMediaFileMock } = vi.hoisted(() => ({
  uploadMediaFileMock: vi.fn(),
}))

vi.mock('../../../entities/media/api/mediaApi', () => ({
  uploadMediaFile: uploadMediaFileMock,
}))

import { UploadFilesCard } from '../UploadFilesCard'

describe('UploadFilesCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('отклоняет файл неподдерживаемого формата', async () => {
    const user = userEvent.setup({ applyAccept: false })

    render(<UploadFilesCard onUploadComplete={async () => {}} />)

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement

    const file = new File(['invalid'], 'notes.txt', {
      type: 'text/plain',
    })

    await user.upload(input, file)

    expect(
      screen.getByText('notes.txt: неподдерживаемый формат'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Нет файлов для загрузки.'),
    ).toBeInTheDocument()

    expect(uploadMediaFileMock).not.toHaveBeenCalled()
  })

  it('добавляет поддерживаемое изображение в очередь', async () => {
    const user = userEvent.setup()

    render(<UploadFilesCard onUploadComplete={async () => {}} />)

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement

    const file = new File(['image data'], 'photo.png', {
      type: 'image/png',
    })

    await user.upload(input, file)

    expect(screen.getByText('photo.png')).toBeInTheDocument()
    expect(screen.getByText('Ожидает загрузки')).toBeInTheDocument()
    expect(uploadMediaFileMock).not.toHaveBeenCalled()
  })

  it('загружает файл и вызывает обновление медиатеки', async () => {
    const user = userEvent.setup()
    const onUploadComplete = vi.fn().mockResolvedValue(undefined)

    vi.mocked(uploadMediaFileMock).mockResolvedValue(undefined)

    render(
      <UploadFilesCard onUploadComplete={onUploadComplete} />,
    )

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement

    const file = new File(['image data'], 'photo.png', {
      type: 'image/png',
    })

    await user.upload(input, file)
    await user.click(
      screen.getByRole('button', { name: 'Загрузить файлы' }),
    )

    await waitFor(() => {
      expect(uploadMediaFileMock).toHaveBeenCalledWith(file)
      expect(onUploadComplete).toHaveBeenCalledTimes(1)
      expect(screen.getByText('Загружено')).toBeInTheDocument()
    })
  })
})
