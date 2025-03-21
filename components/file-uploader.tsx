"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, File, X, CheckCircle } from "lucide-react"

interface FileUploaderProps {
  accept?: string
  maxSize?: number // in MB
  multiple?: boolean
}

export function FileUploader({ accept = "*", maxSize = 10, multiple = false }: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const selectedFiles = Array.from(e.target.files || [])

    // Check file size
    const oversizedFiles = selectedFiles.filter((file) => file.size > maxSize * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      setError(`File(s) exceed the ${maxSize}MB limit`)
      return
    }

    // Simulate upload
    setUploading(true)
    setTimeout(() => {
      setUploading(false)
      setFiles(multiple ? [...files, ...selectedFiles] : selectedFiles)
    }, 1500)
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const triggerFileInput = () => {
    inputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          error ? "border-red-400 bg-red-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
        }`}
        onClick={triggerFileInput}
      >
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="w-8 h-8 text-gray-400" />
          <div className="text-sm text-gray-600">
            <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
          </div>
          <p className="text-xs text-gray-500">
            {accept.split(",").join(", ")} (max {maxSize}MB)
          </p>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-500 flex items-center">
          <X className="w-4 h-4 mr-1" />
          {error}
        </div>
      )}

      {uploading && (
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span>Uploading...</span>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border rounded-md">
              <div className="flex items-center space-x-2">
                <File className="w-5 h-5 text-blue-600" />
                <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(index)
                  }}
                  className="text-gray-500 hover:text-red-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

