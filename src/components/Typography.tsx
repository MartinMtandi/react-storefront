import React from 'react';

interface TypographyProps {
  children: React.ReactNode;
  color?: string;
  fontWeight?: number | string;
  fontSize?: number | string;
  className?: string;
}

const Typography: React.FC<TypographyProps> = ({
  children,
  color = '#212121',
  fontWeight = 'normal',
  fontSize = 'inherit',
  className = '',
}) => {
  const styles: React.CSSProperties = {
    color,
    fontWeight,
    fontSize,
  };

  return (
    <span className={className} style={styles}>
      {children}
    </span>
  );
};

export default Typography;
