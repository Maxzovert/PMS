import lightWave from '../assets/decor/lines/light-wave-line.svg';
import normalWave from '../assets/decor/lines/normal-wave-line.svg';
import boldWave from '../assets/decor/lines/blod-wave-line.svg';
import semiBold from '../assets/decor/lines/semi-bold-line.svg';

const WAVES = {
  light: lightWave,
  normal: normalWave,
  bold: boldWave,
  semiBold,
};

/**
 * Decorative wave / line from client/src/assets/decor/lines.
 * @param {{ kind?: keyof typeof WAVES, className?: string }} props
 */
export function DecorWave({ kind = 'light', className = '' }) {
  const src = WAVES[kind] || WAVES.light;
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      className={`pointer-events-none select-none w-full h-auto ${className}`}
      draggable={false}
    />
  );
}
