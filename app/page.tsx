'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useBookmarks } from '@/hooks/useBookmarks'
import { LoginPage } from '@/components/LoginPage'
import { BookmarkForm } from '@/components/BookmarkForm'
import { BookmarkList } from '@/components/BookmarkList'
import { Toast } from '@/components/Toast'

type ToastState = {
  message: string
  type: 'success' | 'error' | 'warning'
} | null

export default function Home() {
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth()
  const { bookmarks, loading: bookmarksLoading, addBookmark, deleteBookmark } = useBookmarks(user?.id)
  const [toast, setToast] = useState<ToastState>(null)

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    setToast({ message, type })
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage onSignIn={signInWithGoogle} />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Bookmarks</h1>
          <button
            onClick={signOut}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Sign Out
          </button>
        </div>

        <BookmarkForm 
          onSubmit={addBookmark}
          onError={(msg) => showToast(msg, 'error')}
          onSuccess={(msg) => showToast(msg, 'success')}
        />

        {bookmarksLoading ? (
          <div className="text-center py-12 text-gray-500">Loading bookmarks...</div>
        ) : (
          <BookmarkList bookmarks={bookmarks} onDelete={deleteBookmark} />
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
