import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface StarProps
    extends DetailedHTMLProps<
        HTMLAttributes<HTMLSpanElement>,
        HTMLSpanElement
    > {
    isFilled: boolean;
}

export interface RatingProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  isEditable: boolean;
  rating: number;
  setRating?: (rating: number) => void;
}