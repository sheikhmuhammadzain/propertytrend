import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '@/components/containers/Navbar'
import Footer from '@/components/containers/Footer'
import { apiService } from '@/services/apiServices'
import { useSeo } from '@/hooks/useSeo'
import type { BlogPost } from '@/types/blog'
import { Clock, ArrowRight, Newspaper } from 'lucide-react'

const formatDate = (iso: string | null) => {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return ''
  }
}

const CoverImage = ({ post }: { post: BlogPost }) => {
  if (post.cover_image) {
    return (
      <div className="aspect-[16/9] w-full overflow-hidden bg-[#E7E4E0]">
        <img
          src={post.cover_image}
          alt={post.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    )
  }
  return (
    <div className="aspect-[16/9] w-full bg-gradient-to-br from-[#3A3B40] to-[#6b6c72] flex items-center justify-center">
      <Newspaper className="h-10 w-10 text-white/70" />
    </div>
  )
}

const PostCard = ({ post }: { post: BlogPost }) => (
  <Link
    to={`/blog/${post.slug}`}
    className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
  >
    <CoverImage post={post} />
    <div className="flex flex-1 flex-col p-5">
      {post.tags?.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#F1EFED] px-2.5 py-0.5 text-[10px] font-light uppercase tracking-[0.15em] text-[#3A3B40]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <h2 className="font-headline text-lg font-light uppercase tracking-[0.06em] text-[#3A3B40] leading-snug">
        {post.title}
      </h2>
      {post.excerpt && (
        <p className="mt-2 line-clamp-3 text-sm font-light leading-relaxed text-[#3A3B40]/70">
          {post.excerpt}
        </p>
      )}
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-[11px] font-light uppercase tracking-[0.1em] text-[#3A3B40]/60">
        <span>{formatDate(post.published_at || post.created_at)}</span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {post.reading_minutes} min
        </span>
      </div>
    </div>
  </Link>
)

const SkeletonCard = () => (
  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
    <div className="aspect-[16/9] w-full animate-pulse bg-gray-200" />
    <div className="space-y-3 p-5">
      <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200" />
      <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
      <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
      <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200" />
    </div>
  </div>
)

const PAGE_SIZE = 12

const BlogList = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [total, setTotal] = useState(0)
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(false)

  useSeo({
    title: 'Insights',
    description:
      'Market insights, analysis, and commentary on Houston ultra-luxury real estate from The Refined Report by Mark Menendez at Douglas Elliman.',
    type: 'website',
  })

  const fetchPosts = async (nextOffset: number, append: boolean) => {
    append ? setLoadingMore(true) : setLoading(true)
    try {
      const res = await apiService.getBlogPosts({ limit: PAGE_SIZE, offset: nextOffset })
      if (res.success && res.data) {
        const incoming: BlogPost[] = res.data.posts || []
        setPosts((prev) => (append ? [...prev, ...incoming] : incoming))
        setTotal(res.data.total || 0)
        setOffset(nextOffset)
        setError(false)
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchPosts(0, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hasMore = posts.length < total

  return (
    <div className="min-h-screen bg-[#F1EFED]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <p className="mb-3 text-xs font-light uppercase tracking-[0.3em] text-[#3A3B40]/60">
            The Refined Report
          </p>
          <h1 className="font-headline text-3xl font-light uppercase tracking-[0.25em] text-[#3A3B40] md:text-5xl">
            Insights
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-light leading-relaxed text-[#3A3B40]/70 md:text-base">
            Market analysis, neighborhood spotlights, and commentary on Houston's ultra-luxury
            real estate — curated by Mark Menendez at Douglas Elliman.
          </p>
        </header>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <p className="text-sm font-light uppercase tracking-[0.15em] text-[#3A3B40]/70">
              Unable to load insights right now. Please try again later.
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <Newspaper className="mb-4 h-12 w-12 text-[#3A3B40]/40" />
            <h3 className="text-lg font-light uppercase tracking-[0.15em] text-[#3A3B40]">
              No articles yet
            </h3>
            <p className="mt-2 text-sm font-light text-[#3A3B40]/60">
              Check back soon for market insights and analysis.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => fetchPosts(offset + PAGE_SIZE, true)}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-[#3A3B40] bg-transparent px-6 py-2.5 text-sm font-light uppercase tracking-[0.15em] text-[#3A3B40] transition-all duration-300 hover:bg-[#3A3B40] hover:text-white disabled:opacity-50"
                >
                  {loadingMore ? 'Loading…' : 'Load more'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default BlogList
