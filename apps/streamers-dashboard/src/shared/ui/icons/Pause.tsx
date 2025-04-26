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
const SvgPause = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes['default'],
    height: props.size ? sizes[props.size] : props.height ?? sizes['default']
  };
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 25" {...props}><path fill="currentColor" d="M2 6.654c0-1.885 0-2.828.586-3.414S4.114 2.654 6 2.654s2.828 0 3.414.586S10 4.77 10 6.654v12c0 1.886 0 2.829-.586 3.415-.586.584-1.528.584-3.414.584s-2.828 0-3.414-.585C2 21.482 2 20.539 2 18.653v-12zM14 6.654c0-1.885 0-2.828.586-3.414s1.528-.586 3.414-.586 2.828 0 3.414.586S22 4.77 22 6.654v12c0 1.886 0 2.829-.586 3.415-.586.584-1.528.584-3.414.584s-2.828 0-3.414-.585C14 21.482 14 20.539 14 18.653v-12z" /></svg>;
};
export default SvgPause;