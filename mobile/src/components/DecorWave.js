import LightWave from '../assets/decor/lines/light-wave-line.svg';
import NormalWave from '../assets/decor/lines/normal-wave-line.svg';
import BoldWave from '../assets/decor/lines/blod-wave-line.svg';
import SemiBold from '../assets/decor/lines/semi-bold-line.svg';

const WAVES = {
  light: LightWave,
  normal: NormalWave,
  bold: BoldWave,
  semiBold: SemiBold,
};

/**
 * Decorative wave / line SVG.
 */
export function DecorWave({
  kind = 'light',
  width = 180,
  height = 24,
  opacity = 0.45,
  style,
}) {
  const Svg = WAVES[kind] || WAVES.light;
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
