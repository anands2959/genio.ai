import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadAudio(audioData: string): Promise<string> {
  try {
    const uploadResponse = await cloudinary.uploader.upload(audioData, {
      resource_type: 'video', // Cloudinary uses 'video' type for audio files
      folder: 'audio_uploads',
    });

    return uploadResponse.secure_url;
  } catch (error) {
    console.error('Error uploading audio to Cloudinary:', error);
    throw new Error('Failed to upload audio');
  }
}