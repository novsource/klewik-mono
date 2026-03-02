
import type { SVGProps } from "react";
type Sizes = 'xs' | 'sm' | 'default' | 'lg';
type IconsProps = SVGProps<SVGSVGElement> & {
  size?: Sizes;
};
const sizes: Record<Sizes, number> = {
  xs: 16,
  sm: 18,
  default: 21,
  lg: 24
};
const SvgStop = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes['default'],
    height: props.size ? sizes[props.size] : props.height ?? sizes['default']
  };
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 25" {...props}><path fill="currentColor" d="M2 12.356C2 7.642 2 5.285 3.464 3.82 4.93 2.356 7.286 2.356 12 2.356s7.071 0 8.535 1.464C22 5.285 22 7.642 22 12.356s0 7.07-1.465 8.535c-1.464 1.466-3.82 1.466-8.535 1.466s-7.071 0-8.536-1.465C2 19.428 2 17.071 2 12.357z" /></svg>;
};
export default SvgStop;
