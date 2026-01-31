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
const SvgShare = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes['default'],
    height: props.size ? sizes[props.size] : props.height ?? sizes['default']
  };
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="m13.955 5.184 4.978 4.424c.93.827 1.396 1.241 1.567 1.73a2 2 0 0 1 0 1.325c-.171.488-.637.902-1.567 1.729l-4.978 4.424c-.422.376-.633.564-.813.57a.5.5 0 0 1-.404-.181c-.115-.139-.115-.421-.115-.986v-2.79c-2.428 0-4.992.78-6.865 2.164-.975.72-1.462 1.08-1.648 1.067a.45.45 0 0 1-.39-.24c-.096-.16-.01-.658.16-1.653C4.983 10.3 9.433 8.57 12.622 8.57v-2.79c0-.565 0-.847.115-.986a.5.5 0 0 1 .404-.181c.18.006.39.194.813.57" /></svg>;
};
export default SvgShare;