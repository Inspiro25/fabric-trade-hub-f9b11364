import { useState } from 'react';

export const Image = ({ src, fallback = '/default-image.png', ...props }) => {
  const [error, setError] = useState(false);

  return (
    <img
      src={error ? fallback : src}
      onError={() => setError(true)}
      {...props}
    />
  );
};