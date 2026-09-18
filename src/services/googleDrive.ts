export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  webContentLink?: string;
  thumbnailLink?: string;
  size?: string;
  modifiedTime?: string;
}

/**
 * Get or create "Donggala Heritage Media & Data" folder in user's Google Drive
 */
export async function getOrCreateDonggalaFolder(accessToken: string): Promise<string> {
  // Check if exists
  const q = encodeURIComponent("name='Donggala Heritage Media' and mimeType='application/vnd.google-apps.folder' and trashed=false");
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)`;

  const searchRes = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (searchRes.ok) {
    const data = await searchRes.json();
    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }
  }

  // Create folder
  const createUrl = 'https://www.googleapis.com/drive/v3/files';
  const createRes = await fetch(createUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Donggala Heritage Media',
      mimeType: 'application/vnd.google-apps.folder',
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Gagal membuat folder di Google Drive: ${err}`);
  }

  const created = await createRes.json();
  return created.id;
}

/**
 * List files inside the Donggala Heritage folder or user's Drive
 */
export async function listDonggalaDriveFiles(
  accessToken: string,
  folderId?: string
): Promise<DriveFileItem[]> {
  let query = "trashed=false";
  if (folderId) {
    query += ` and '${folderId}' in parents`;
  } else {
    query += " and (mimeType contains 'image/' or mimeType contains 'spreadsheet' or name contains 'Donggala')";
  }

  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType,webViewLink,webContentLink,thumbnailLink,size,modifiedTime)&orderBy=modifiedTime desc&pageSize=30`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gagal membaca daftar file dari Google Drive: ${err}`);
  }

  const data = await res.json();
  return (data.files || []).map((f: any) => ({
    id: f.id,
    name: f.name,
    mimeType: f.mimeType,
    webViewLink: f.webViewLink,
    webContentLink: f.webContentLink,
    thumbnailLink: f.thumbnailLink,
    size: f.size,
    modifiedTime: f.modifiedTime,
  }));
}

/**
 * Upload an image or document to Google Drive
 */
export async function uploadMediaToDrive(
  accessToken: string,
  file: File,
  folderId?: string
): Promise<DriveFileItem> {
  const metadata: any = {
    name: file.name,
    mimeType: file.type,
  };

  if (folderId) {
    metadata.parents = [folderId];
  }

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const reader = new FileReader();

  const fileDataPromise = new Promise<ArrayBuffer>((resolve, reject) => {
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });

  const arrayBuffer = await fileDataPromise;
  const uint8Array = new Uint8Array(arrayBuffer);

  const metadataPart = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`;
  const mediaPartHeader = `${delimiter}Content-Type: ${file.type || 'application/octet-stream'}\r\n\r\n`;

  // Combine blobs
  const combinedBlob = new Blob(
    [metadataPart, mediaPartHeader, uint8Array, closeDelimiter],
    { type: `multipart/related; boundary=${boundary}` }
  );

  const uploadUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,webContentLink,thumbnailLink';
  const res = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: combinedBlob,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gagal mengunggah file ke Google Drive: ${err}`);
  }

  const createdFile = await res.json();
  return {
    id: createdFile.id,
    name: createdFile.name,
    mimeType: createdFile.mimeType,
    webViewLink: createdFile.webViewLink,
    webContentLink: createdFile.webContentLink,
    thumbnailLink: createdFile.thumbnailLink,
  };
}

/**
 * Backup entire database snapshot as a JSON file in Google Drive
 */
export async function backupDatabaseToDrive(
  accessToken: string,
  dataToBackup: any,
  folderId?: string
): Promise<DriveFileItem> {
  const fileName = `donggala-heritage-backup-${new Date().toISOString().slice(0, 10)}.json`;
  const jsonContent = JSON.stringify(dataToBackup, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const file = new File([blob], fileName, { type: 'application/json' });

  return uploadMediaToDrive(accessToken, file, folderId);
}
