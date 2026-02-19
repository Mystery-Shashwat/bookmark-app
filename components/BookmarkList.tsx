import type { Bookmark } from '@/types'

type BookmarkListProps = {
  bookmarks: Bookmark[]
  onDelete: (id: string) => void
}

export function BookmarkList({ bookmarks, onDelete }: BookmarkListProps) {
  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No bookmarks yet. Add your first one above!
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookmarks.map((bookmark) => (
        <div key={bookmark.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{bookmark.title}</h3>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline text-sm truncate block"
            >
              {bookmark.url}
            </a>
          </div>
          <button
            onClick={() => onDelete(bookmark.id)}
            className="ml-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition flex-shrink-0"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}
