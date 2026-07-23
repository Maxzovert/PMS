import Star from '../assets/decor/lines/4-side-star.svg';
import OneCircle from '../assets/decor/lines/one-circle.svg';
import TwoCircle from '../assets/decor/lines/two-circle.svg';
import DottedCircle from '../assets/decor/lines/dotted-circle.svg';
import IllusOne from '../assets/decor/lines/illus-one.svg';
import IllusTwo from '../assets/decor/lines/illus-two.svg';

const MARKS = {
  star: Star,
  oneCircle: OneCircle,
  twoCircle: TwoCircle,
  dottedCircle: DottedCircle,
  illusOne: IllusOne,
  illusTwo: IllusTwo,
};

/**
 * Decorative SVG mark (from src/assets/decor/lines).
 */
export function DecorMark({
  kind = 'star',
  width = 28,
  height = 28,
  opacity = 0.45,
  style,
}) {
  const Svg = MARKS[kind] || MARKS.star;
  return (
    <Svg
      width={width}
      height={height}
      opacity={opacity}
      style={style}
      accessible={false}
      importantForAccessibility="no"
    />
  );
}
