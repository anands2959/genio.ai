import cloudinary from '@/lib/cloudinary';

export const uploadVideo = async (base64Video: string): Promise<string> => {
  try {
    // Extract base64 data from the data URL
    const base64Data = base64Video.split(',')[1];

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(`data:video/mp4;base64,${base64Data}`, {
      folder: 'generated_videos', // Store in a dedicated folder
      resource_type: 'video',
      transformation: [
        { quality: 'auto' }, // Optimize video quality
        { format: 'mp4' } // Ensure consistent format
      ]
    });

    return result.secure_url;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw new Error('Failed to upload video');
  }
};