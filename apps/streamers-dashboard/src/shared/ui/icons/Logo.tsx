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
const SvgLogo = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes['default'],
    height: props.size ? sizes[props.size] : props.height ?? sizes['default']
  };
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 32 33" {...props}><path fill="#6FCF97" fillRule="evenodd" d="M9.431 14.751h1.058a3.5 3.5 0 0 1 3.424 2.782v-2.29a2.268 2.268 0 0 0-4.482-.492m4.432 3.498a2.268 2.268 0 0 1-4.435 0zm-5.631-3.006a3.414 3.414 0 1 1 6.828 0v2.528a3.414 3.414 0 1 1-6.828 0zm14.845 3.006a2.268 2.268 0 0 1-4.434 0zm.05-.57v-2.436a2.268 2.268 0 0 0-4.481-.492h1.03a3.5 3.5 0 0 1 3.452 2.928m-5.68-2.436a3.414 3.414 0 1 1 6.827 0v2.528a3.414 3.414 0 1 1-6.828 0zM4.323 16.955a7.934 7.934 0 1 0 11.221 11.221.643.643 0 0 1 .91 0 7.935 7.935 0 0 0 11.221-11.221.643.643 0 0 1 0-.91 7.935 7.935 0 0 0-11.221-11.22.643.643 0 0 1-.91-.001A7.934 7.934 0 1 0 4.324 16.045a.643.643 0 0 1 0 .91" clipRule="evenodd" /></svg>;
};
export default SvgLogo;