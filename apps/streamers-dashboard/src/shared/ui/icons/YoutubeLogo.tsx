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
const SvgYoutubeLogo = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes['default'],
    height: props.size ? sizes[props.size] : props.height ?? sizes['default']
  };
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 37 32" {...props}><path fill="#F03" d="M18.485 26.344s9.373 0 11.698-.621a3.74 3.74 0 0 0 2.64-2.617c.639-2.296.639-7.127.639-7.127s0-4.8-.64-7.076a3.67 3.67 0 0 0-2.638-2.617c-2.326-.63-11.7-.63-11.7-.63s-9.352 0-11.667.63a3.77 3.77 0 0 0-2.66 2.617C3.54 11.18 3.54 15.98 3.54 15.98s0 4.83.617 7.126a3.85 3.85 0 0 0 2.66 2.617c2.315.62 11.668.62 11.668.62z" /><path fill="#fff" d="m23.143 16-7.739-4.396v8.792z" /></svg>;
};
export default SvgYoutubeLogo;