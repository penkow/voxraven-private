"use client"

import { useState, useEffect } from "react"
import { FileAudio, FileVideo } from "lucide-react"

interface FilePreviewProps {
  file: File
}

export function FilePreview({ file }: FilePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const isVideo = file.type.startsWith("video/")
  const isAudio = file.type.startsWith("audio/")

  useEffect(() => {
    if (!file) return

    // Only create object URLs for video files that can be previewed
    if (isVideo) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)

      return () => {
        URL.revokeObjectURL(url)
      }
    }
  }, [file, isVideo])

  if (isVideo && previewUrl) {
    return (
      <div className="relative w-12 h-12 rounded overflow-hidden bg-black flex items-center justify-center">
        <video className="max-h-full max-w-full object-cover">
          <source src={previewUrl} type={file.type} />
        </video>
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <FileVideo className="h-6 w-6 text-white" />
        </div>
      </div>
    )
  }

  if (isAudio) {
    return (
      <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center">
        <FileAudio className="h-6 w-6 text-primary" />
      </div>
    )
  }

  return (
    <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center">
      <FileVideo className="h-6 w-6 text-primary" />
    </div>
  )
}
