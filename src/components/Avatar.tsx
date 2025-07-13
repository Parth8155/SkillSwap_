import React, { useState } from 'react';
import { getAvatarUrl, AvatarProps } from '../utils/avatarGenerator';

/**
 * Avatar Component
 * Automatically generates profile images when no image is provided
 */
const Avatar: React.FC<AvatarProps> = ({
    src,
    name,
    size = 40,
    className = '',
    alt
}) => {
    const [imageError, setImageError] = useState(false);

    // Generate avatar URL
    const avatarUrl = getAvatarUrl(
        imageError ? undefined : src,
        name,
        size
    );

    const handleImageError = () => {
        setImageError(true);
    };

    const sizeClasses = size <= 32 ? 'w-8 h-8' :
        size <= 40 ? 'w-10 h-10' :
            size <= 48 ? 'w-12 h-12' :
                size <= 64 ? 'w-16 h-16' : 'w-20 h-20';

    const baseClasses = `
    inline-block
    object-cover
    flex-shrink-0
    rounded-full
    ${sizeClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

    return (
        <img
            src={avatarUrl}
            alt={alt || `${name}'s avatar`}
            className={baseClasses}
            onError={handleImageError}
            loading="lazy"
        />
    );
};

export default Avatar;
