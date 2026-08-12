import { api } from '@/lib/api';

export async function uploadToCloudinary(file: File, folder = 'smg-gallery') {
  const sig = await api.signUpload(folder);
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', sig.apiKey);
  formData.append('timestamp', String(sig.timestamp));
  formData.append('signature', sig.signature);
  formData.append('folder', sig.folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error('Cloudinary upload failed');
  const data = await res.json();
  return {
    url: data.secure_url as string,
    publicId: data.public_id as string,
  };
}
