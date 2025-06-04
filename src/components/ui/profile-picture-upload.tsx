'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, CheckCircle2, AlertCircle, Camera, User, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { uploadAvatar, deleteAvatar } from '@/lib/upload-avatar'
import { motion, AnimatePresence } from 'framer-motion'

interface ProfilePictureUploadProps {
  userId: string
  currentAvatar?: string
  onAvatarChange: (url: string) => void
  className?: string
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  userId,
  currentAvatar,
  onAvatarChange,
  className
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    // Create preview
    const previewUrl = URL.createObjectURL(file)
    setPreview(previewUrl)
    setIsUploading(true)

    try {
      // Delete previous uploaded avatar if exists
      if (uploadedUrl) {
        await deleteAvatar(uploadedUrl)
      }

      const result = await uploadAvatar(file, userId)
      
      if (result.success && result.url) {
        setUploadedUrl(result.url)
        onAvatarChange(result.url)
        toast.success('Profile picture uploaded successfully!')
      } else {
        toast.error(result.error || 'Upload failed')
        setPreview(null)
      }
    } catch (error) {
      toast.error('An error occurred while uploading')
      setPreview(null)
    } finally {
      setIsUploading(false)
      // Clean up preview URL
      URL.revokeObjectURL(previewUrl)
    }
  }, [userId, onAvatarChange, uploadedUrl])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: isUploading
  })

  const removeUploadedImage = async () => {
    if (uploadedUrl) {
      const deleted = await deleteAvatar(uploadedUrl)
      if (deleted) {
        toast.success('Profile picture removed')
      }
    }
    setUploadedUrl(null)
    setPreview(null)
    onAvatarChange('')
  }

  const displayImage = preview || uploadedUrl || currentAvatar

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
          <Camera className="w-4 h-4" />
          <span className="text-xs font-medium">CUSTOM UPLOAD</span>
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          Upload Your Professional Photo
        </h3>
        <p className="text-sm text-muted-foreground">
          Upload a high-quality photo for a more professional appearance
        </p>
      </div>      {/* Upload Area */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {!displayImage ? (
            <motion.div
              key="upload-area"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div
                {...getRootProps()}
                className={cn(
                  "relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300",
                  isDragActive && !isDragReject && "border-primary bg-primary/5 scale-[1.02]",
                  isDragReject && "border-destructive bg-destructive/5",
                  !isDragActive && "border-border hover:border-primary/50 hover:bg-accent/50",
                  isUploading && "pointer-events-none opacity-60"
                )}
              >
                <input {...getInputProps()} />
                <div className="space-y-4">
                <div className="relative mx-auto w-16 h-16">
                  <div className={cn(
                    "w-full h-full rounded-full border-2 border-dashed flex items-center justify-center transition-colors duration-300",
                    isDragActive && !isDragReject ? "border-primary bg-primary/10" : "border-muted-foreground/30"
                  )}>
                    {isUploading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    ) : (
                      <Upload className={cn(
                        "w-6 h-6 transition-colors duration-300",
                        isDragActive && !isDragReject ? "text-primary" : "text-muted-foreground"
                      )} />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    {isDragActive && !isDragReject
                      ? "Drop your image here"
                      : isDragReject
                      ? "Invalid file type"
                      : isUploading
                      ? "Uploading image..."
                      : "Drop an image here or click to browse"
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPEG, PNG, or WebP • Max 5MB
                  </p>
                </div>
              </div>

              {/* Visual feedback overlay */}
              <AnimatePresence>                {isDragActive && !isDragReject && (
                  <div className="absolute inset-0 rounded-xl bg-primary/5 border-2 border-primary flex items-center justify-center">
                    <div className="text-primary font-medium">
                      Release to upload
                    </div>
                  </div>
                )}
              </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <div className="relative w-32 h-32 mx-auto">
                {/* Main image */}
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
                  <img
                    src={displayImage}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Upload overlay */}
                  {isUploading && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  )}
                </div>

                {/* Status indicator */}
                <div className="absolute -bottom-2 -right-2">
                  {uploadedUrl ? (
                    <div className="w-8 h-8 bg-background rounded-full border-2 border-primary/20 shadow-sm flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                  ) : preview ? (
                    <div className="w-8 h-8 bg-background rounded-full border-2 border-primary/20 shadow-sm flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    </div>
                  ) : null}
                </div>
              </div>              {/* Action buttons */}
              <div className="flex items-center justify-center gap-3 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="h-9 px-4"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Change Photo
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeUploadedImage}
                  disabled={isUploading}
                  className="h-9 px-4 text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>

              {/* Hidden file input for "Change Photo" button */}
              <input
                ref={fileInputRef}
                {...getInputProps()}
                style={{ display: 'none' }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Upload status */}
      <AnimatePresence>
        {uploadedUrl && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800"
          >
            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              Custom photo uploaded successfully
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProfilePictureUpload
