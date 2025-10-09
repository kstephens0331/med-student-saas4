import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { calculateSHA256FromBuffer, getFileType } from '@/lib/utils/file-hash'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const blockId = formData.get('blockId') as string

    if (!file || !blockId) {
      return NextResponse.json({ error: 'Missing file or block ID' }, { status: 400 })
    }

    // Get user profile to get school_id
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('school_id')
      .eq('id', session.user.id)
      .single()

    if (!profile?.school_id) {
      return NextResponse.json({ error: 'User has no school assigned' }, { status: 400 })
    }

    // Convert file to buffer and calculate hash
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const sha256Hash = await calculateSHA256FromBuffer(buffer)

    // Check for duplicate file
    const { data: existingFile } = await supabase
      .from('files')
      .select('id, file_name')
      .eq('school_id', profile.school_id)
      .eq('block_id', blockId)
      .eq('sha256_hash', sha256Hash)
      .single()

    if (existingFile) {
      return NextResponse.json({
        message: 'File already exists',
        fileId: existingFile.id,
        isDuplicate: true,
      })
    }

    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const storagePath = `${profile.school_id}/${blockId}/${fileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('study-materials')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }

    // Get file type
    const fileType = getFileType(file.name)

    // Create file record
    const { data: fileRecord, error: fileError } = await supabase
      .from('files')
      .insert({
        block_id: blockId,
        uploaded_by: session.user.id,
        school_id: profile.school_id,
        file_name: file.name,
        file_type: fileType,
        file_size: file.size,
        storage_path: storagePath,
        sha256_hash: sha256Hash,
        is_shared: false,
        processing_status: 'pending',
      })
      .select()
      .single()

    if (fileError) {
      console.error('File record error:', fileError)
      return NextResponse.json({ error: 'Failed to create file record' }, { status: 500 })
    }

    // TODO: Queue file for processing on Railway
    // await questionQueue.add('process-file', { fileId: fileRecord.id })

    return NextResponse.json({
      message: 'File uploaded successfully',
      fileId: fileRecord.id,
      fileName: file.name,
      processingStatus: 'pending',
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
