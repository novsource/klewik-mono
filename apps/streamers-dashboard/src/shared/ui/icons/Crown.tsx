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
const SvgCrown = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes['default'],
    height: props.size ? sizes[props.size] : props.height ?? sizes['default']
  };
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}><path fill="currentColor" fillRule="evenodd" d="m21.838 11.126-.23 2.436c-.377 4.012-.566 6.018-1.748 7.228C18.677 22 16.905 22 13.36 22h-2.72c-3.545 0-5.317 0-6.5-1.21s-1.371-3.216-1.75-7.228l-.228-2.436c-.18-1.912-.27-2.869.057-3.264a1 1 0 0 1 .674-.367c.476-.042 1.073.638 2.268 1.998.618.703.927 1.055 1.271 1.11a.92.92 0 0 0 .562-.09c.319-.16.53-.595.955-1.464l2.237-4.585C10.989 2.822 11.39 2 12 2s1.011.822 1.813 2.465l2.237 4.584c.424.868.637 1.303.955 1.463.176.089.37.12.562.09.344-.055.653-.406 1.271-1.11 1.195-1.36 1.792-2.04 2.268-1.998a1 1 0 0 1 .675.367c.328.395.238 1.352.058 3.264zM8.25 18a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75" clipRule="evenodd" /></svg>;
};
export default SvgCrown;