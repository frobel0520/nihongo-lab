/** 細長的進度條（原生 <progress>，螢幕閱讀器會念出目前進度）。 */
export function ProgressBar({
  value,
  max,
  label,
}: {
  value: number;
  max: number;
  label: string;
}) {
  return <progress className="bar" value={value} max={max} aria-label={label} />;
}
