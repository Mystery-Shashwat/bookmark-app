import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { Bookmark } from '@/types'

export function useBookmarks(userId: string | undefined) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const localInsertIds = useRef<Set<string>>(new Set())
  const localDeleteIds = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (userId) {
      fetchBookmarks()
      const cleanup = subscribeToBookmarks()
      return cleanup
    }
  }, [userId])

  const fetchBookmarks = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setBookmarks(data)
    setLoading(false)
  }

  const subscribeToBookmarks = () => {
    const channel = supabase
      .channel('bookmarks-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bookmarks', filter: `user_id=eq.${userId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newBookmark = payload.new as Bookmark
            
            // Skip if this was a local insert
            if (localInsertIds.current.has(newBookmark.id)) {
              localInsertIds.current.delete(newBookmark.id)
              return
            }
            
            // Add bookmark from another tab/user
            setBookmarks(prev => {
              const exists = prev.some(b => b.id === newBookmark.id)
              if (exists) return prev
              return [newBookmark, ...prev]
            })
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id
            
            // Skip if this was a local delete
            if (localDeleteIds.current.has(deletedId)) {
              localDeleteIds.current.delete(deletedId)
              return
            }
            
            setBookmarks(prev => prev.filter(b => b.id !== deletedId))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const addBookmark = async (url: string, title: string) => {
    if (!userId) return

    // Check if URL already exists
    const urlExists = bookmarks.some(b => b.url.toLowerCase() === url.toLowerCase())
    if (urlExists) {
      throw new Error('This URL is already bookmarked!')
    }

    const tempId = crypto.randomUUID()
    const newBookmark: Bookmark = {
      id: tempId,
      url,
      title,
      user_id: userId,
      created_at: new Date().toISOString()
    }
    
    setBookmarks(prev => [newBookmark, ...prev])

    const { data, error } = await supabase
      .from('bookmarks')
      .insert([{ url, title, user_id: userId }])
      .select()
      .single()

    if (error) {
      setBookmarks(prev => prev.filter(b => b.id !== tempId))
      throw new Error('Failed to add bookmark. Please try again.')
    } else if (data) {
      // Mark this as a local insert to ignore in realtime
      localInsertIds.current.add(data.id)
      // Replace temp bookmark with real one
      setBookmarks(prev => prev.map(b => b.id === tempId ? data : b))
    }
  }

  const deleteBookmark = async (id: string) => {
    // Mark as local delete
    localDeleteIds.current.add(id)
    
    // Optimistically remove from UI
    setBookmarks(prev => prev.filter(b => b.id !== id))
    
    const { error } = await supabase.from('bookmarks').delete().eq('id', id)
    
    if (error) {
      // Revert on error
      localDeleteIds.current.delete(id)
      fetchBookmarks()
    }
  }

  return { bookmarks, loading, addBookmark, deleteBookmark }
}
