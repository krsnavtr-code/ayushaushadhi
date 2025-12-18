import api from './axios';

// Helper: extract filename
const getFilename = (urlOrPath = '') => {
  if (!urlOrPath) return '';
  return urlOrPath.split(/[\\/]/).pop();
};

// Helper: generate media URL via API
export const getImageUrl = (filename) => {
  if (!filename) return '';
  const cleanFilename = filename.startsWith('http')
    ? getFilename(new URL(filename).pathname)
    : getFilename(filename);

  return `/api/upload/file/${encodeURIComponent(cleanFilename)}`;
};

// ================= MEDIA LIST =================

// Get all uploaded media
export const getUploadedImages = async () => {
  const response = await api.get('/upload/files');

  if (response.data?.data) {
    response.data.data = response.data.data.map(file => ({
      ...file,
      type: file.type || (file.mimetype?.startsWith('video/') ? 'video' : 'image'),
      url: file.url || getImageUrl(file.name || file.path),
      thumbnailUrl: file.thumbnailUrl || file.url || getImageUrl(file.name || file.path)
    }));
  }

  return response.data;
};

// ================= UPLOAD IMAGE =================

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  const result = response.data?.data || response.data;
  if (!result) return response.data;

  const filename = result.name || getFilename(result.path) || getFilename(result.url);

  return {
    ...result,
    url: getImageUrl(filename),
    type: 'image'
  };
};

// ================= UPLOAD VIDEO =================

export const uploadVideo = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload/video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 300000 // 5 min
  });

  const result = response.data?.data || response.data;
  if (!result) return response.data;

  const filename = result.name || getFilename(result.path) || getFilename(result.url);

  return {
    ...result,
    url: getImageUrl(filename),
    type: 'video'
  };
};

// ================= DELETE MEDIA =================

export const deleteMediaFile = async (filename) => {
  const response = await api.delete(
    `/upload/file/${encodeURIComponent(filename)}`
  );
  return response.data;
};
