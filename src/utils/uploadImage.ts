import cloudinary from '@/lib/cloudinary';

export const uploadImage = async (base64Image: string, isProfilePicture: boolean = false): Promise<string> => {
  try {
    // Extract base64 data from the data URL
    const base64Data = base64Image.split(',')[1];

    // Configure upload options based on image type
    const uploadOptions = isProfilePicture ? {
      folder: 'profile_pictures',
      resource_type: 'image',
      transformation: [{ width: 200, height: 200, crop: 'fill', quality: 'auto' }],
    } : {
      folder: 'generated_images',
      resource_type: 'image',
      quality: 100, // Maximum quality for generated images
      format: 'png',
    };

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(`data:image/png;base64,${base64Data}`, uploadOptions);

    return result.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};