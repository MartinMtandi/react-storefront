import React, { memo } from 'react';
import styled from 'styled-components';
import { Star } from 'react-feather';

interface StarRatingProps {
  rating: number;
  count?: number;
  showCount?: boolean;
}

const StarRatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;

  span {
    margin-left: 4px;
    color: #666;
    font-size: 14px;
  }
`;

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  count = 5,
  showCount = true 
}) => {
  return (
    <StarRatingContainer>
      {[...Array(count)].map((_, index) => {
        const isFull = index < Math.floor(rating);
        const isHalf = index === Math.floor(rating) && rating % 1 !== 0;
        return (
          <Star
            key={index}
            size={16}
            data-testid="star-icon"
            fill={isFull ? "#FFD700" : isHalf ? "url(#half-fill)" : "transparent"}
            stroke={isFull || isHalf ? "#FFD700" : "#666"}
          />
        );
      })}
      {showCount && <span>({rating})</span>}
    </StarRatingContainer>
  );
};

export default memo(StarRating);
