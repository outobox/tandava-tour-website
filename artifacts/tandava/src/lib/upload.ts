export async function uploadFile(
  file: File,
  requestUploadUrl: (data: any) => Promise<{ uploadURL: string; objectPath: string }>
): Promise<string> {
  // 1. Request presigned URL
  const { uploadURL, objectPath } = await requestUploadUrl({
    data: {
      name: file.name,
      size: file.size,
      contentType: file.type
    }
  });

  // 2. Upload file directly to GCS via presigned URL
  const res = await fetch(uploadURL, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type
    }
  });

  if (!res.ok) {
    throw new Error('Failed to upload file to storage');
  }

  // Return the objectPath which can be stored in the DB and served via /api/storage/objects/
  return objectPath;
}
