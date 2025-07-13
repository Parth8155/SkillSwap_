/**
 * Avatar Generator Utility
 * Automatically generates profile images based on user names
 */

export interface AvatarOptions {
  size?: number;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  fontWeight?: string;
  borderRadius?: number;
}

/**
 * Generates initials from a full name
 */
export const getInitials = (name: string): string => {
  if (!name) return 'U';
  
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

/**
 * Generates a consistent color based on the user's name
 */
export const getColorFromName = (name: string): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
    '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
    '#10AC84', '#EE5A24', '#0984E3', '#6C5CE7', '#A29BFE',
    '#FD79A8', '#E17055', '#00B894', '#00CEC9', '#6C5CE7'
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

/**
 * Generates a data URL for an avatar image
 */
export const generateAvatarDataURL = (
  name: string, 
  options: AvatarOptions = {}
): string => {
  const {
    size = 100,
    backgroundColor = getColorFromName(name),
    textColor = '#FFFFFF',
    fontSize = size * 0.4,
    fontWeight = '600',
    borderRadius = size / 2
  } = options;

  const initials = getInitials(name);
  
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Draw background circle
  ctx.fillStyle = backgroundColor;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, borderRadius, 0, 2 * Math.PI);
  ctx.fill();

  // Draw initials
  ctx.fillStyle = textColor;
  ctx.font = `${fontWeight} ${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials, size / 2, size / 2);

  return canvas.toDataURL();
};

/**
 * React component props for Avatar
 */
export interface AvatarProps {
  src?: string;
  name: string;
  size?: number;
  className?: string;
  alt?: string;
}

/**
 * Generates avatar URL - returns provided src or generates one from name
 */
export const getAvatarUrl = (src: string | undefined, name: string, size: number = 100): string => {
  if (src && src !== '' && !src.includes('placeholder') && !src.includes('default')) {
    return src;
  }
  
  return generateAvatarDataURL(name, { size });
};

/**
 * React hook for avatar generation
 */
export const useAvatar = (src: string | undefined, name: string, size: number = 100) => {
  const avatarUrl = React.useMemo(() => {
    return getAvatarUrl(src, name, size);
  }, [src, name, size]);

  return avatarUrl;
};

// For non-React environments, we need to import React
import React from 'react';
