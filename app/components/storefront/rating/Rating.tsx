import { useEffect, useState, KeyboardEvent } from 'react';

import { RatingProps } from './Rating.props';
import styles from './Rating.module.css';
import Star from './Star';

const Rating = ({
  isEditable = false,
  rating,
  setRating,
  className,
  ...props
}: RatingProps): JSX.Element => {
  const [ratingArray, setRatingArray] = useState<JSX.Element[]>(new Array(5).fill(<></>));

  const hoverHandle = (idx: number) => {
    if (!isEditable) {
      return;
    }
    constructRating(idx);
  };
  const clickHandle = (idx: number) => {
    if (!isEditable || !setRating) {
      return;
    }
    setRating(idx);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLSpanElement>, idx: number) => {
    if (!isEditable || !setRating) {
      return;
    }
    if (e.code !== 'Space') {
      return;
    }
    setRating(idx);
  };

  const constructRating = (currentRating: number) => {
    
    const updatedArray = ratingArray.map((ratingItem: JSX.Element, idx: number) => {
      return (
        <Star
          isFilled={idx < currentRating}
          key={idx}
          onMouseEnter={() => hoverHandle(idx + 1)}
          onMouseLeave={() => hoverHandle(rating)}
          onClick={() => clickHandle(idx + 1)}
          className={`${className || ''} ${isEditable ? 'cursor-pointer' : ''}`}
          tabIndex={isEditable ? 0 : -1}
          onKeyDown={(e: KeyboardEvent<HTMLSpanElement>) => handleKeyDown(e, idx + 1)}
        />
      );
    });
    setRatingArray(updatedArray);
  };

  useEffect(() => {
    constructRating(rating);
  }, [rating]);

  return (
    <div className={styles.rating} {...props}>
      {ratingArray.map((r: JSX.Element, idx) => (
        <span key={idx}>{r}</span>
      ))}
    </div>
  );
};
export default Rating;