import star from '../assets/decor/lines/4-side-star.svg';
import oneCircle from '../assets/decor/lines/one-circle.svg';
import twoCircle from '../assets/decor/lines/two-circle.svg';
import dottedCircle from '../assets/decor/lines/dotted-circle.svg';
import illusOne from '../assets/decor/lines/illus-one.svg';
import illusTwo from '../assets/decor/lines/illus-two.svg';

const MARKS = {
  star,
  oneCircle,
  twoCircle,
  dottedCircle,
  illusOne,
  illusTwo,
};

/**
 * Decorative mark from client/src/assets/decor/lines.
 * @param {{ kind?: keyof typeof MARKS, className?: string, alt?: string } & React.ImgHTMLAttributes<HTMLImageElement>} props
 */
export function DecorMark({ kind = 'star', className = '', alt = '', ...rest }) {
  const src = MARKS[kind] || MARKS.star;
  return (
    <img
      src={src}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      className={`pointer-events-none select-none ${className}`}
      draggable={false}
      {...rest}
    />
  );
}
