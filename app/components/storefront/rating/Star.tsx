'use client';

import { StarProps } from './Star.props';

const Star = ({ isFilled = false, className, ...props }: StarProps) => {
    return (
        <span className={className}>
           
        </span>
    );
};
export default Star;