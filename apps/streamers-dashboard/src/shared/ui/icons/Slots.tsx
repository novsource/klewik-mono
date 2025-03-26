import * as React from "react";
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
const SvgSlots = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes['default'],
    height: props.size ? sizes[props.size] : props.height ?? sizes['default']
  };
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M20.272 10.465H3.598V9.313a2 2 0 0 1 2-2h12.674a2 2 0 0 1 2 2zM18.192 5.79H5.678V4.626a2 2 0 0 1 2-2h8.514a2 2 0 0 1 2 2z" /><path fill="currentColor" fillRule="evenodd" d="M1.5 14a2 2 0 0 1 2-2h17a2 2 0 0 1 2 2v3.374a4 4 0 0 1-4 4h-13a4 4 0 0 1-4-4zm3.498 1.163c0-.47.38-.85.85-.85h12.35a.85.85 0 1 1 0 1.7H5.847a.85.85 0 0 1-.85-.85m.876 2.03a.85.85 0 0 0 0 1.7h8.274a.85.85 0 1 0 0-1.7z" clipRule="evenodd" /></svg>;
};
export default SvgSlots;