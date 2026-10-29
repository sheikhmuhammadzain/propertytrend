import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '@/components/containers/Navbar'
import { useAuth } from '@/context'
import { apiService, toAbsoluteMediaUrl } from '@/services/apiServices'
import { useToast } from '@/hooks/use-toast'
import RichTextEditor from '@/components/blog/RichTextEditor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { BlogPost, BlogStatus } from '@/types/blog'
import {
  Plus, Pencil, Trash2, ArrowLeft, RefreshCw, ExternalLink, Save, Eye, FileText, Upload, Loader2, X,
} from 'lucide-react'

const EMPTY_FORM = {
  id: null as number | null,
  title: '',
  slug: '',
  excerpt: '',
  cover_image: '',
  author: 'Mark Menendez',
  tagsText: '',
  status: 'draft' as BlogStatus,
  meta_title: '',
  meta_description: '',
  content: '',
}

type FormState = typeof EMPTY_FORM

const formatDate = (iso: string | null) => {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return '—'
  }
}

const formatDateTime = (iso: string) => {
  try {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
    })
  } catch {
    return ''
  }
}

// ---------------------------------------------------------------------------
// Local draft persistence
//
// The editor form is autosaved to localStorage on this device so that a session
// expiry, accidental navigation, or a crashed tab does not lose an article in
// progress. One slot per post: `new` for an unsaved post, else the post id.
// ---------------------------------------------------------------------------
const DRAFT_PREFIX = 'refined_blog_draft:'
const AUTOSAVE_DELAY_MS = 500

interface StoredDraft {
  key: string
  form: FormState
  savedAt: string
}

const draftKey = (id: number | null) => `${DRAFT_PREFIX}${id ?? 'new'}`

const isBlankForm = (f: FormState) =>
  !f.title.trim() && !f.excerpt.trim() && (!f.content || f.content === '<p></p>')

const readDraft = (key: string): StoredDraft | null => {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || !parsed.form) return null
    const form: FormState = { ...EMPTY_FORM, ...parsed.form }
    if (isBlankForm(form)) return null
    return { key, form, savedAt: typeof parsed.savedAt === 'string' ? parsed.savedAt : '' }
  } catch {
    return null
  }
}

const listDrafts = (): StoredDraft[] => {
  const out: StoredDraft[] = []
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && k.startsWith(DRAFT_PREFIX)) {
        const d = readDraft(k)
        if (d) out.push(d)
      }
    }
  } catch {
    /* storage unavailable */
  }
  return out.sort((a, b) => b.savedAt.localeCompare(a.savedAt))
}

const writeDraft = (form: FormState): string => {
  const savedAt = new Date().toISOString()
  try {
    localStorage.setItem(draftKey(form.id), JSON.stringify({ form, savedAt }))
  } catch {
    /* storage full or unavailable; autosave is best-effort */
  }
  return savedAt
}

const removeDraft = (key: string) => {
  try {
    localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}

const AdminBlog = () => {
  const navigate = useNavigate()
  const { getToken, getStoredUser } = useAuth()
  const { toast } = useToast()

  const [view, setView] = useState<'list' | 'edit'>('list')
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [coverUploading, setCoverUploading] = useState(false)
  const coverInputRef = useRef<HTMLInputElement>(null)

  // Draft autosave state
  const [drafts, setDrafts] = useState<StoredDraft[]>(() => listDrafts())
  const [lastAutosave, setLastAutosave] = useState<string | null>(null)
  const dirtyRef = useRef(false)            // user has edited the open form
  const pendingRef = useRef<FormState | null>(null) // debounced write not yet flushed
  const timerRef = useRef<number | null>(null)

  const refreshDrafts = useCallback(() => setDrafts(listDrafts()), [])

  // Auth gate: must be logged in AND admin. An expired token now reads as
  // "no token" (see lib/auth-token), so expiry lands on the login page with a
  // return path instead of silently failing every save.
  useEffect(() => {
    if (!getToken()) {
      navigate('/login', { replace: true, state: { from: '/admin/blog' } })
      return
    }
    if (getStoredUser()?.role !== 'admin') {
      navigate('/', { replace: true })
    }
  }, [getToken, getStoredUser, navigate])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const res = await apiService.adminGetBlogPosts()
      if (res.success && res.data) {
        setPosts(res.data.posts || [])
      } else {
        toast({ title: 'Failed to load posts', description: res.message, variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Failed to load posts', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---- autosave plumbing -------------------------------------------------
  const cancelPending = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
    pendingRef.current = null
  }

  const flushPending = () => {
    if (pendingRef.current) {
      writeDraft(pendingRef.current)
    }
    cancelPending()
  }

  // Debounced write whenever the user edits the open form.
  useEffect(() => {
    if (view !== 'edit' || !dirtyRef.current || isBlankForm(form)) return
    pendingRef.current = form
    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null
      pendingRef.current = null
      setLastAutosave(writeDraft(form))
      setDrafts(listDrafts())
    }, AUTOSAVE_DELAY_MS)
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [form, view])

  // If the page unmounts with a write still pending (e.g. a session-expired
  // redirect right after typing), flush it synchronously.
  useEffect(() => {
    return () => {
      if (pendingRef.current) writeDraft(pendingRef.current)
    }
  }, [])

  /** Apply a user edit to the form and mark it dirty for autosave. */
  const patch = (p: Partial<FormState>) => {
    dirtyRef.current = true
    setForm((f) => ({ ...f, ...p }))
  }

  const openForm = (next: FormState, dirty: boolean) => {
    cancelPending()
    dirtyRef.current = dirty
    setLastAutosave(null)
    setForm(next)
    setView('edit')
  }

  const openDraft = (d: StoredDraft) => {
    openForm(d.form, true)
    setLastAutosave(d.savedAt || null)
  }

  // ---- navigation actions -------------------------------------------------
  const startNew = () => {
    const existing = readDraft(draftKey(null))
    if (existing) {
      const resume = window.confirm(
        `You have an unsaved draft "${existing.form.title || 'Untitled'}" from ${formatDateTime(existing.savedAt)}.\n\n` +
        'OK: resume that draft.\nCancel: start a blank post and discard it.',
      )
      if (resume) {
        openDraft(existing)
        return
      }
      removeDraft(existing.key)
      refreshDrafts()
    }
    openForm(EMPTY_FORM, false)
  }

  const startEdit = async (post: BlogPost) => {
    const existing = readDraft(draftKey(post.id))
    if (existing) {
      const resume = window.confirm(
        `You have unsaved changes to "${post.title}" from ${formatDateTime(existing.savedAt)}.\n\n` +
        'OK: resume those changes.\nCancel: discard them and load the saved version.',
      )
      if (resume) {
        openDraft(existing)
        return
      }
      removeDraft(existing.key)
      refreshDrafts()
    }
    try {
      const res = await apiService.adminGetBlogPost(post.id)
      const full: BlogPost = res.success && res.data ? res.data : post
      openForm({
        id: full.id,
        title: full.title || '',
        slug: full.slug || '',
        excerpt: full.excerpt || '',
        cover_image: full.cover_image || '',
        author: full.author || 'Mark Menendez',
        tagsText: (full.tags || []).join(', '),
        status: full.status || 'draft',
        meta_title: full.meta_title || '',
        meta_description: full.meta_description || '',
        content: full.content || '',
      }, false)
    } catch {
      toast({ title: 'Failed to open post', variant: 'destructive' })
    }
  }

  const backToList = () => {
    // Keep whatever was typed; it stays listed under "Unsaved drafts".
    flushPending()
    refreshDrafts()
    setView('list')
    setForm(EMPTY_FORM)
    dirtyRef.current = false
  }

  const handleDelete = async (post: BlogPost) => {
    if (!window.confirm(`Delete “${post.title}”? This cannot be undone.`)) return
    try {
      const res = await apiService.deleteBlogPost(post.id)
      if (res.success) {
        toast({ title: 'Post deleted' })
        setPosts((prev) => prev.filter((p) => p.id !== post.id))
        removeDraft(draftKey(post.id))
        refreshDrafts()
      } else {
        toast({ title: 'Delete failed', description: res.message, variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Delete failed', variant: 'destructive' })
    }
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setCoverUploading(true)
    try {
      const res = await apiService.uploadBlogImage(file)
      if (res.success && res.data?.path) {
        patch({ cover_image: toAbsoluteMediaUrl(res.data.path) })
      } else {
        toast({ title: 'Cover upload failed', description: res.message, variant: 'destructive' })
      }
    } finally {
      setCoverUploading(false)
    }
  }

  const buildPayload = (status?: BlogStatus) => ({
    title: form.title.trim(),
    content: form.content,
    excerpt: form.excerpt.trim() || undefined,
    slug: form.slug.trim() || undefined,
    cover_image: form.cover_image.trim() || undefined,
    author: form.author.trim() || undefined,
    tags: form.tagsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    status: status || form.status,
    meta_title: form.meta_title.trim() || undefined,
    meta_description: form.meta_description.trim() || undefined,
  })

  const handleSave = async (status?: BlogStatus) => {
    if (!form.title.trim()) {
      toast({ title: 'Title is required', variant: 'destructive' })
      return
    }
    if (!form.content || form.content === '<p></p>') {
      toast({ title: 'Content is required', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const payload = buildPayload(status)
      const res = form.id
        ? await apiService.updateBlogPost(form.id, payload)
        : await apiService.createBlogPost(payload)

      if (res.success && res.data) {
        // Saved on the server: the local draft is now redundant.
        cancelPending()
        removeDraft(draftKey(form.id))
        dirtyRef.current = false
        toast({
          title: form.id ? 'Post updated' : 'Post created',
          description: payload.status === 'published' ? 'It is now live.' : 'Saved as draft.',
        })
        await fetchPosts()
        refreshDrafts()
        setView('list')
        setForm(EMPTY_FORM)
      } else {
        // Keep the local draft; the user can retry or come back after signing in.
        flushPending()
        toast({ title: 'Save failed', description: res.message, variant: 'destructive' })
      }
    } catch {
      flushPending()
      toast({ title: 'Save failed', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const stats = useMemo(() => {
    const published = posts.filter((p) => p.status === 'published').length
    return { total: posts.length, published, drafts: posts.length - published }
  }, [posts])

  // ----------------------- EDIT VIEW -----------------------
  if (view === 'edit') {
    return (
      <div className="min-h-screen bg-[#F1EFED]">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={backToList}
              className="inline-flex items-center gap-2 text-xs font-light uppercase tracking-[0.15em] text-[#3A3B40]/70 hover:text-[#3A3B40]"
            >
              <ArrowLeft className="h-4 w-4" /> Back to posts
            </button>
            <span className="text-right text-xs font-light uppercase tracking-[0.15em] text-[#3A3B40]/60">
              {form.id ? 'Editing post' : 'New post'}
              {lastAutosave && (
                <span className="block text-[10px] normal-case tracking-normal text-[#3A3B40]/50">
                  Draft autosaved {formatDateTime(lastAutosave)}
                </span>
              )}
            </span>
          </div>

          <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.1em] text-[#3A3B40]">Title *</label>
              <Input
                value={form.title}
                onChange={(e) => patch({ title: e.target.value })}
                placeholder="e.g. River Oaks Luxury Market — Q2 2026 Review"
              />
            </div>

            {/* Slug + Author */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.1em] text-[#3A3B40]">
                  Slug (URL)
                </label>
                <Input
                  value={form.slug}
                  onChange={(e) => patch({ slug: e.target.value })}
                  placeholder="auto-generated from title if left blank"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.1em] text-[#3A3B40]">Author</label>
                <Input
                  value={form.author}
                  onChange={(e) => patch({ author: e.target.value })}
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.1em] text-[#3A3B40]">
                Excerpt <span className="font-light normal-case tracking-normal text-[#3A3B40]/50">(short summary shown on cards & search)</span>
              </label>
              <textarea
                value={form.excerpt}
                onChange={(e) => patch({ excerpt: e.target.value })}
                rows={2}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-[#3A3B40] focus:border-[#3A3B40] focus:outline-none focus:ring-1 focus:ring-[#3A3B40]"
                placeholder="One or two sentences summarizing the article…"
              />
            </div>

            {/* Cover + Tags */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.1em] text-[#3A3B40]">
                  Cover image
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    value={form.cover_image}
                    onChange={(e) => patch({ cover_image: e.target.value })}
                    placeholder="Upload a file or paste a URL"
                  />
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverUpload}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={coverUploading}
                    onClick={() => coverInputRef.current?.click()}
                    className="shrink-0 border-[#3A3B40] text-[#3A3B40] hover:bg-[#3A3B40] hover:text-white"
                  >
                    {coverUploading
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <><Upload className="mr-1.5 h-4 w-4" /> Upload</>}
                  </Button>
                </div>
                {form.cover_image && (
                  <div className="relative mt-2 inline-block">
                    <img
                      src={form.cover_image}
                      alt="Cover preview"
                      className="h-24 rounded-md border border-gray-200 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => patch({ cover_image: '' })}
                      title="Remove cover"
                      className="absolute -right-2 -top-2 rounded-full bg-white p-0.5 text-gray-500 shadow border border-gray-200 hover:text-red-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.1em] text-[#3A3B40]">
                  Tags <span className="font-light normal-case tracking-normal text-[#3A3B40]/50">(comma-separated)</span>
                </label>
                <Input
                  value={form.tagsText}
                  onChange={(e) => patch({ tagsText: e.target.value })}
                  placeholder="River Oaks, Market Update, Luxury"
                />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.1em] text-[#3A3B40]">Content *</label>
              <RichTextEditor
                value={form.content}
                onChange={(html) => patch({ content: html })}
                placeholder="Write or paste your article here…"
              />
            </div>

            {/* SEO */}
            <div className="rounded-lg border border-dashed border-gray-300 bg-[#FAFAF9] p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#3A3B40]">
                SEO (optional)
              </p>
              <div className="space-y-3">
                <Input
                  value={form.meta_title}
                  onChange={(e) => patch({ meta_title: e.target.value })}
                  placeholder="Meta title (defaults to the post title)"
                />
                <textarea
                  value={form.meta_description}
                  onChange={(e) => patch({ meta_description: e.target.value })}
                  rows={2}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-[#3A3B40] focus:border-[#3A3B40] focus:outline-none focus:ring-1 focus:ring-[#3A3B40]"
                  placeholder="Meta description (defaults to the excerpt)"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-5">
              <p className="text-[11px] font-light text-[#3A3B40]/50">
                Your work is saved automatically on this device until you publish or save a draft.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleSave('draft')}
                  disabled={saving}
                  className="border-[#3A3B40] text-[#3A3B40] hover:bg-[#3A3B40] hover:text-white"
                >
                  <Save className="mr-2 h-4 w-4" /> Save draft
                </Button>
                <Button
                  onClick={() => handleSave('published')}
                  disabled={saving}
                  className="bg-[#3A3B40] text-white hover:bg-black"
                >
                  <Eye className="mr-2 h-4 w-4" /> {saving ? 'Saving…' : 'Publish'}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // ----------------------- LIST VIEW -----------------------
  return (
    <div className="min-h-screen bg-[#F1EFED]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-headline text-2xl font-light uppercase tracking-[0.2em] text-[#3A3B40] md:text-3xl">
              Manage Insights
            </h1>
            <p className="mt-1 text-xs font-light uppercase tracking-[0.1em] text-[#3A3B40]/60">
              {stats.total} total · {stats.published} published · {stats.drafts} drafts
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={fetchPosts}
              disabled={loading}
              className="border-[#3A3B40] text-[#3A3B40] hover:bg-[#3A3B40] hover:text-white"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </Button>
            <Button onClick={startNew} className="bg-[#3A3B40] text-white hover:bg-black">
              <Plus className="mr-2 h-4 w-4" /> New post
            </Button>
          </div>
        </div>

        {/* Unsaved local drafts (autosaved on this device) */}
        {drafts.length > 0 && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-amber-800">
              Unsaved drafts on this device
            </p>
            <ul className="mt-3 space-y-2">
              {drafts.map((d) => (
                <li
                  key={d.key}
                  className="flex flex-wrap items-center justify-between gap-2 text-sm text-[#3A3B40]"
                >
                  <span>
                    <span className="font-medium">{d.form.title || 'Untitled'}</span>
                    <span className="text-[#3A3B40]/60">
                      {' '}· {d.form.id ? 'changes to an existing post' : 'new post'}
                      {d.savedAt && ` · autosaved ${formatDateTime(d.savedAt)}`}
                    </span>
                  </span>
                  <span className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => openDraft(d)}
                      className="bg-[#3A3B40] text-white hover:bg-black"
                    >
                      Resume
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (window.confirm('Discard this draft? This cannot be undone.')) {
                          removeDraft(d.key)
                          refreshDrafts()
                        }
                      }}
                      className="border-[#3A3B40] text-[#3A3B40] hover:bg-[#3A3B40] hover:text-white"
                    >
                      Discard
                    </Button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-20 text-[#3A3B40]">
              <RefreshCw className="h-5 w-5 animate-spin" /> Loading posts…
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <FileText className="mb-4 h-12 w-12 text-[#3A3B40]/40" />
              <h3 className="text-lg font-light uppercase tracking-[0.15em] text-[#3A3B40]">No posts yet</h3>
              <p className="mt-2 text-sm font-light text-[#3A3B40]/60">
                Create your first article to get started.
              </p>
              <Button onClick={startNew} className="mt-6 bg-[#3A3B40] text-white hover:bg-black">
                <Plus className="mr-2 h-4 w-4" /> New post
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#3A3B40]/70">
                    <th className="px-5 py-3">Title</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Updated</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b border-gray-100 last:border-0 hover:bg-[#F8F7F5]">
                      <td className="px-5 py-3">
                        <div className="font-light text-[#3A3B40]">{post.title}</div>
                        <div className="text-xs text-[#3A3B40]/50">/{post.slug}</div>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] ${
                            post.status === 'published'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm font-light text-[#3A3B40]/70">
                        {formatDate(post.updated_at)}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {post.status === 'published' && (
                            <a
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="View live"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#3A3B40] hover:bg-[#3A3B40]/10"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                          <button
                            onClick={() => startEdit(post)}
                            title="Edit"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#3A3B40] hover:bg-[#3A3B40]/10"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(post)}
                            title="Delete"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminBlog
