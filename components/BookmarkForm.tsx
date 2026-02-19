import { useState } from 'react'

type BookmarkFormProps = {
  onSubmit: (url: string, title: string) => Promise<void>
  onError: (message: string) => void
  onSuccess: (message: string) => void
}

export function BookmarkForm({ onSubmit, onError, onSuccess }: BookmarkFormProps) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url || !title) return

    setLoading(true)
    try {
      await onSubmit(url, title)
      setUrl('')
      setTitle('')
      onSuccess('Bookmark added successfully!')
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to add bookmark')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8">
      <div className="mb-4">
        <input
          type="url"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border rounded"
          required
          disabled={loading}
        />
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
          disabled={loading}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add Bookmark'}
      </button>
    </form>
  )
}
