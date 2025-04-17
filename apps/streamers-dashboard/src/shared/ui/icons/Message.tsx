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
const SvgMessage = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes['default'],
    height: props.size ? sizes[props.size] : props.height ?? sizes['default']
  };
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 25 24" {...props}><path fill="currentColor" fillRule="evenodd" d="M11.616 3h2a9 9 0 1 1 0 18h-7a4 4 0 0 1-4-4v-5a9 9 0 0 1 9-9m-3 11.75a.75.75 0 0 1 0-1.5h4a.75.75 0 0 1 0 1.5zm0-4a.75.75 0 0 1 0-1.5h8a.75.75 0 0 1 0 1.5z" clipRule="evenodd" /></svg>;
};
export default SvgMessage;