import type { ReactNode } from 'react'

/**
 * Simple Markdown renderer for chat messages
 * Supports: headers, bold, italic, lists, code blocks, inline code
 */

interface MarkdownContentProps {
  content: string
  className?: string
}

export function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n')
    const elements: ReactNode[] = []
    let inCodeBlock = false
    let codeBlockContent: string[] = []
    let codeBlockLang = ''
    let listItems: string[] = []
    let listType: 'ul' | 'ol' | null = null

    const flushList = () => {
      if (listItems.length > 0 && listType) {
        const ListTag = listType
        elements.push(
          <ListTag key={elements.length} className={listType === 'ul' ? 'list-disc list-inside my-2 space-y-1' : 'list-decimal list-inside my-2 space-y-1'}>
            {listItems.map((item, i) => (
              <li key={i}>{renderInline(item)}</li>
            ))}
          </ListTag>
        )
        listItems = []
        listType = null
      }
    }

    const renderInline = (line: string): ReactNode => {
      let remaining = line

      // Process bold **text** or __text__
      remaining = remaining.replace(/\*\*(.+?)\*\*|__(.+?)__/g, (_, g1, g2) => {
        return `<strong>${g1 || g2}</strong>`
      })

      // Process italic *text* or _text_
      remaining = remaining.replace(/\*(.+?)\*|_(.+?)_/g, (_, g1, g2) => {
        return `<em>${g1 || g2}</em>`
      })

      // Process inline code `code`
      remaining = remaining.replace(/`([^`]+)`/g, (_, code) => {
        return `<code class="bg-ink/10 px-1 py-0.5 rounded text-sm font-mono">${code}</code>`
      })

      // Convert to JSX
      return <span dangerouslySetInnerHTML={{ __html: remaining }} />
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Code block start/end
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          flushList()
          inCodeBlock = true
          codeBlockLang = line.slice(3).trim()
          codeBlockContent = []
        } else {
          elements.push(
            <pre key={elements.length} className="bg-ink/5 rounded-lg p-3 my-2 overflow-x-auto">
              <code className="text-sm font-mono">{codeBlockContent.join('\n')}</code>
            </pre>
          )
          inCodeBlock = false
          codeBlockContent = []
          codeBlockLang = ''
        }
        continue
      }

      if (inCodeBlock) {
        codeBlockContent.push(line)
        continue
      }

      // Headers
      if (line.startsWith('### ')) {
        flushList()
        elements.push(
          <h3 key={elements.length} className="font-bold text-lg mt-4 mb-2">
            {renderInline(line.slice(4))}
          </h3>
        )
        continue
      }
      if (line.startsWith('## ')) {
        flushList()
        elements.push(
          <h2 key={elements.length} className="font-bold text-xl mt-4 mb-2">
            {renderInline(line.slice(3))}
          </h2>
        )
        continue
      }
      if (line.startsWith('# ')) {
        flushList()
        elements.push(
          <h1 key={elements.length} className="font-bold text-2xl mt-4 mb-2">
            {renderInline(line.slice(2))}
          </h1>
        )
        continue
      }

      // Unordered list
      if (line.match(/^[-*]\s/)) {
        if (listType !== 'ul') {
          flushList()
          listType = 'ul'
        }
        listItems.push(line.slice(2))
        continue
      }

      // Ordered list
      if (line.match(/^\d+\.\s/)) {
        if (listType !== 'ol') {
          flushList()
          listType = 'ol'
        }
        listItems.push(line.replace(/^\d+\.\s/, ''))
        continue
      }

      // Horizontal rule
      if (line.match(/^[-*_]{3,}$/)) {
        flushList()
        elements.push(<hr key={elements.length} className="my-4 border-primary/20" />)
        continue
      }

      // Empty line
      if (line.trim() === '') {
        flushList()
        elements.push(<div key={elements.length} className="h-2" />)
        continue
      }

      // Regular paragraph
      flushList()
      elements.push(
        <p key={elements.length} className="my-1">
          {renderInline(line)}
        </p>
      )
    }

    flushList()

    // Handle unclosed code block
    if (inCodeBlock && codeBlockContent.length > 0) {
      elements.push(
        <pre key={elements.length} className="bg-ink/5 rounded-lg p-3 my-2 overflow-x-auto">
          <code className="text-sm font-mono">{codeBlockContent.join('\n')}</code>
        </pre>
      )
    }

    return elements
  }

  return <div className={`markdown-content ${className}`}>{renderMarkdown(content)}</div>
}
