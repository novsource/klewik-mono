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
const SvgItalic = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes['default'],
    height: props.size ? sizes[props.size] : props.height ?? sizes['default']
  };
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}><path fill="currentColor" fillRule="evenodd" d="M14.977 1H9a1 1 0 1 0 0 2h4.656l-5.4 18H3a1 1 0 1 0 0 2h12a1 1 0 1 0 0-2h-4.656l5.4-18H21a1 1 0 1 0 0-2h-6.023" clipRule="evenodd" /></svg>;
};
export default SvgItalic;