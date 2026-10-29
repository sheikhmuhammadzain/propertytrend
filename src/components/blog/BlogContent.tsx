import { useMemo } from 'react'
import DOMPurify from 'dompurify'
import { cn } from '@/lib/utils'

interface BlogContentProps {
  html: string
  className?: string
}

/**
 * Renders blog HTML produced by the rich-text editor.
 * Always sanitized with DOMPurify before insertion to prevent stored XSS.
 */
const BlogContent = ({ html, className }: BlogContentProps) => {
  const clean = useMemo(
    () =>
      DOMPurify.sanitize(html || '', {
        ADD_ATTR: ['target', 'rel'],
        FORBID_TAGS: ['style', 'script', 'iframe'],
        FORBID_ATTR: ['onerror', 'onload', 'onclick'],
      }),
    [html],
  )

  return (
    <div
      className={cn(
        'prose prose-neutral max-w-none font-montserrat',
        'prose-headings:font-light prose-headings:tracking-wide prose-headings:text-[#3A3B40]',
        'prose-p:text-[#3A3B40]/90 prose-p:leading-relaxed prose-li:text-[#3A3B40]/90',
        'prose-a:text-[#3A3B40] prose-a:underline hover:prose-a:text-black',
        'prose-strong:text-[#3A3B40] prose-img:rounded-xl prose-img:shadow-sm',
        'prose-blockquote:border-l-[#3A3B40] prose-blockquote:text-[#3A3B40]/80',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  )
}

export default BlogContent
