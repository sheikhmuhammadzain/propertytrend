import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '@/components/containers/Navbar'
import Footer from '@/components/containers/Footer'
import BlogContent from '@/components/blog/BlogContent'
import { apiService } from '@/services/apiServices'
import { useSeo } from '@/hooks/useSeo'
import type { BlogPost } from '@/types/blog'
import { ArrowLeft, Clock } from 'lucide-react'

const formatDate = (iso: string | null) => {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return ''
  }
}

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let active = true
    const load = async () => {
      if (!slug) return
      setLoading(true)
      setNotFound(false)
      try {
        const res = await apiService.getBlogPost(slug)
        if (!active) return
        if (res.success && res.data?.id) {
          setPost(res.data)
        } else {
          setNotFound(true)
        }
      } catch {
        if (active) setNotFound(true)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [slug])

  const publishedDate = post?.published_at || post?.created_at || null

  useSeo({
    title: post?.meta_title || post?.title,
    description: post?.meta_description || post?.excerpt || undefined,
    image: post?.cover_image,
    type: 'article',
    jsonLd: post
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.meta_description || post.excerpt || '',
          image: post.cover_image ? [post.cover_image] : undefined,
          datePublished: publishedDate,
          dateModified: post.updated_at,
          author: { '@type': 'Person', name: post.author || 'Mark Menendez' },
          publisher: {
            '@type': 'Organization',
            name: 'The Refined Report — Douglas Elliman',
          },
        }
      : null,
  })

  return (
    <div className="min-h-screen bg-[#F1EFED]">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-light uppercase tracking-[0.15em] text-[#3A3B40]/70 transition-colors hover:text-[#3A3B40]"
          >
            <ArrowLeft className="h-4 w-4" />
            All Insights
          </Link>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
            <div className="h-10 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="aspect-[16/9] w-full animate-pulse rounded-xl bg-gray-200" />
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-4 w-full animate-pulse rounded bg-gray-200" />
              ))}
            </div>
          </div>
        ) : notFound || !post ? (
          <div className="py-20 text-center">
            <h1 className="text-2xl font-light uppercase tracking-[0.15em] text-[#3A3B40]">
              Article not found
            </h1>
            <p className="mt-3 text-sm font-light text-[#3A3B40]/60">
              This article may have been moved or unpublished.
            </p>
            <Link
              to="/blog"
              className="mt-6 inline-flex items-center gap-2 rounded-lg border-2 border-[#3A3B40] px-6 py-2.5 text-sm font-light uppercase tracking-[0.15em] text-[#3A3B40] transition-all hover:bg-[#3A3B40] hover:text-white"
            >
              Browse Insights
            </Link>
          </div>
        ) : (
          <article>
            {/* Header */}
            <header className="mb-8">
              {post.tags?.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white px-3 py-1 text-[10px] font-light uppercase tracking-[0.15em] text-[#3A3B40] shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <h1 className="font-headline text-3xl font-light uppercase tracking-[0.06em] leading-tight text-[#3A3B40] md:text-4xl">
                {post.title}
              </h1>
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-light uppercase tracking-[0.12em] text-[#3A3B40]/60">
                {post.author && <span>By {post.author}</span>}
                {post.author && <span className="text-gray-400">•</span>}
                <span>{formatDate(publishedDate)}</span>
                <span className="text-gray-400">•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.reading_minutes} min read
                </span>
              </div>
            </header>

            {/* Cover */}
            {post.cover_image && (
              <div className="mb-10 overflow-hidden rounded-2xl shadow-sm">
                <img src={post.cover_image} alt={post.title} className="w-full object-cover" />
              </div>
            )}

            {/* Body */}
            <BlogContent html={post.content || ''} />

            {/* Footer attribution */}
            <div className="mt-12 border-t border-gray-200 pt-6 text-center">
              <p className="text-xs font-light uppercase tracking-[0.2em] text-[#3A3B40]/60">
                Mark Menendez · Douglas Elliman Real Estate
              </p>
            </div>
          </article>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default BlogPostPage
