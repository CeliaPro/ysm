export interface Project {
  id: string
  name: string
  description: string | null
  documentsCount?: number // For UI display purposes
  membersCount?: number // For UI display purposes
  storageUsed?: string // For UI display purposes
  storageLimit: string | null
  usagePercentage?: number // For UI display purposes
  createdAt: Date
  lastUpdated: Date
  isArchived?: boolean
}

export interface ProjectMember {
  id: string
  projectId: string
  userId: string
  role: 'owner' | 'editor' | 'viewer'
  joinedAt: Date
}

export type StorageProvider = 'local' | 's3'
export type AccessLevel = 'public' | 'private' | 'project'

export interface Document {
  id: string
  projectId: string
  projectName?: string // For UI display purposes
  name: string
  description: string | null
  filePath: string
  fileSize: number
  fileSizeFormatted?: string // For UI display purposes
  fileType: string
  uploadedBy: string
  uploadedAt: Date
  updatedAt: Date
  isArchived: boolean
  storageProvider: StorageProvider
  s3BucketName: string | null
  s3ObjectKey: string | null
  s3Region: string | null
  contentType: string
  publicUrl: string | null
  accessLevel: AccessLevel
  tags?: string[]
  isStarred?: boolean // Added this property to fix the error
}

export interface DocumentTag {
  id: string
  documentId: string
  tagName: string
}

export interface S3Bucket {
  id: string
  bucketName: string
  region: string
  isActive: boolean
  description: string | null
  createdAt: Date
  updatedAt: Date
}

export interface StoragePolicy {
  id: string
  projectId: string
  maxFileSize: number
  allowedFileTypes: string[]
  retentionPeriod: number | null
  createdAt: Date
  updatedAt: Date
}

export interface StorageAccessLog {
  id: string
  documentId: string
  userId: string
  accessType: 'view' | 'download' | 'upload' | 'delete'
  accessTimestamp: Date
  ipAddress: string | null
  success: boolean
}

export interface ActivityLog {
  id: string
  userId: string
  projectId: string | null
  documentId: string | null
  actionType: 'CREATE' | 'UPDATE' | 'DELETE' | 'ARCHIVE' | string
  actionDetails: string | null
  createdAt: Date
}

export interface AIConfiguration {
  id: string
  name: string
  model: string
  maxTokens: number
  temperature: number
  createdBy: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AIPrompt {
  id: string
  configurationId: string
  promptText: string
  purpose: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface AIConversation {
  id: string
  userId: string
  projectId: string | null
  documentId: string | null
  title: string
  createdAt: Date
  updatedAt: Date
}

export interface AIMessage {
  id: string
  conversationId: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  tokensUsed: number
}
