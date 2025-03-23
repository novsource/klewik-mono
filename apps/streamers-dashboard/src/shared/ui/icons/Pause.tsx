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
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 25" {...props}><path fill="currentColor" d="M2 6.654c0-1.885 0-2.828.586-3.414S4.114 2.654 6 2.654s2.828 0 3.414.586S10 4.77 10 6.654v12c0 1.886 0 2.829-.586 3.415s-1.528.585-3.414.585-2.828 0-3.414-.585C2 21.483 2 20.54 2 18.654zM14 6.654c0-1.885 0-2.828.586-3.414s1.528-.586 3.414-.586 2.828 0 3.414.586S22 4.77 22 6.654v12c0 1.886 0 2.829-.586 3.415s-1.528.585-3.414.585-2.828 0-3.414-.585C14 21.483 14 20.54 14 18.654z" /></svg>;
};
export default SvgPause;