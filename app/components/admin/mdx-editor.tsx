'use client'

import { ChangeEvent, useRef, useState, useCallback, useMemo, memo } from 'react'
import Markdown from 'react-markdown'

interface MDXEditorProps {
  title: string
  name: string
  placeholder: string
  defaultValue?: string
}

function MDXEditorComponent({
  title,
  name,
  placeholder,
  defaultValue = '',
}: MDXEditorProps) {
  const [content, setContent] = useState<string>(defaultValue)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  // textarea 높이 조절 함수 - 메모이제이션
  const adjustTextareaHeight = useCallback((textarea: HTMLTextAreaElement) => {
    textarea.style.height = '0px'
    const scrollHeight = textarea.scrollHeight
    textarea.style.height = `${scrollHeight}px`
  }, [])

  // change 핸들러 - 메모이제이션
  const handleTextareaChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.currentTarget.value
    setContent(newValue)
    
    // textarea 높이 조절
    if (textareaRef.current) {
      adjustTextareaHeight(textareaRef.current)
    }
  }, [adjustTextareaHeight])

  // Markdown 컴포넌트 메모이제이션
  const MarkdownPreview = useMemo(() => (
    <Markdown>{content}</Markdown>
  ), [content])

  return (
    <div className="col-span-1 flex w-full flex-col gap-2 sm:col-span-3 lg:col-span-3 xl:col-span-4">
      <div className="member-data-title">{title}</div>
      <div className="flex flex-col items-start gap-2 lg:flex-row">
        <div className="w-full">
          <div className="mb-2 text-sm font-medium">Editor</div>
          <textarea
            ref={textareaRef}
            name={name}
            placeholder={placeholder}
            onChange={handleTextareaChange}
            defaultValue={defaultValue}
            className="member-data-input h-auto min-h-96 resize-none overflow-hidden"
            aria-label={`${title} 편집기`}
          />
        </div>
        <div className="w-full">
          <div className="mb-2 text-sm font-medium">Preview</div>
          <div className="prose min-h-96 w-full rounded-lg border-2 border-sky-900 p-4 bg-white">
            {MarkdownPreview}
          </div>
        </div>
      </div>
    </div>
  )
}

// 메모이제이션된 컴포넌트 export
export default memo(MDXEditorComponent)
