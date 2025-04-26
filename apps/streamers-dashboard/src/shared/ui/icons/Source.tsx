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
const SvgSource = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes['default'],
    height: props.size ? sizes[props.size] : props.height ?? sizes['default']
  };
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 25" {...props}><path fill="currentColor" fillRule="evenodd" d="M15 2.889h2c1.886-.001 2.828-.001 3.414.585S21 5.003 21 6.889v15.249h1a.75.75 0 0 1 0 1.499H2a.75.75 0 0 1 0-1.501h1V9.888c0-1.887 0-2.83.586-3.415.586-.586 1.528-.586 3.414-.586h4c1.886-.001 2.828-.001 3.414.585C15 7.06 15 8.003 15 9.889v12.249h1.5V9.798c0-.866 0-1.66-.087-2.306-.095-.71-.32-1.462-.938-2.08s-1.37-.843-2.08-.938c-.637-.086-1.418-.087-2.27-.087.085-.388.226-.68.46-.915.587-.586 1.53-.586 3.415-.586zM5.25 8.888a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.499H6a.75.75 0 0 1-.75-.751zm0 2.999a.75.75 0 0 1 .75-.751h6a.75.75 0 0 1 0 1.499H6a.75.75 0 0 1-.75-.751zm0 2.999a.75.75 0 0 1 .75-.751h6a.75.75 0 0 1 0 1.499H6a.75.75 0 0 1-.75-.751zM9 19.138a.75.75 0 0 1 .75.749v2.249h-1.5v-2.251a.75.75 0 0 1 .75-.751z" clipRule="evenodd" /></svg>;
};
export default SvgSource;