import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { uploadImage } from '@/utils/uploadImage';

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { name, avatar } = data;

    let imageUrl = avatar;
    if (avatar && avatar.startsWith('data:image')) {
      // Upload base64 image to Cloudinary
      try {
        imageUrl = await uploadImage(avatar);
        console.log('Uploaded image URL:', imageUrl); // Log the URL for debugging
      } catch (error) {
        console.error('Error uploading image:', error);
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
      }
    }

    // Update user profile in database
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: name,
        profilePicture: imageUrl || null // Ensure null if no image URL
      },
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.profilePicture,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}