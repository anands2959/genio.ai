'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';

interface ImageItem {
  id: string;
  prompt: string;
  style: string;
  imageUrl: string;
  createdAt: Date;
}

interface ImageGridProps {
  images: ImageItem[];
}

const ImageGrid: React.FC<ImageGridProps> = ({ images }) => {
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  const styles = ['all', 'natural', 'artistic', 'anime', 'abstract', 'cinematic', '3d'];

  const filteredImages = selectedStyle === 'all'
    ? images
    : images.filter(image => image.style === selectedStyle);

  return (
    <div className="space-y-6">
      {/* Style Filter */}
      <div className="flex flex-wrap gap-2 p-2">
        {styles.map(style => (
          <button
            key={style}
            onClick={() => setSelectedStyle(style)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
              ${selectedStyle === style
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20'
                : 'bg-black/20 text-gray-300 hover:bg-white/10 hover:text-white'}`}
          >
            {style.charAt(0).toUpperCase() + style.slice(1)}
          </button>
        ))}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((image) => (
          <div
            key={image.id}
            className="relative group rounded-xl overflow-hidden border border-white/10 bg-black/20 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-[1.02]"
            onMouseEnter={() => setHoveredImage(image.id)}
            onMouseLeave={() => setHoveredImage(null)}
          >
            <div className="aspect-square relative">
              <Image
                src={image.imageUrl}
                alt={image.prompt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Image Details Overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 flex flex-col justify-end transition-opacity duration-300
                ${hoveredImage === image.id ? 'opacity-100' : 'opacity-0'}`}
            >
              <p className="text-white font-medium line-clamp-2 mb-2">
                {image.prompt}
              </p>
              <div className="flex justify-between items-center text-sm text-gray-300">
                <span className="px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm">
                  {image.style.charAt(0).toUpperCase() + image.style.slice(1)}
                </span>
                <span>
                  {format(new Date(image.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">
            No images found for the selected style.
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageGrid;