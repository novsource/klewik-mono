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
const SvgPointsSum = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes['default'],
    height: props.size ? sizes[props.size] : props.height ?? sizes['default']
  };
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 25" {...props}><path fill="currentColor" fillRule="evenodd" d="M12 14.456a6.3 6.3 0 1 0 0-12.6 6.3 6.3 0 0 0 0 12.6m0-1.507a4.793 4.793 0 1 0 0-9.589 4.793 4.793 0 0 0 0 9.587z" clipRule="evenodd" /><path fill="currentColor" fillRule="evenodd" d="M12 12.41a4.254 4.254 0 1 0 0-8.508 4.254 4.254 0 0 0 0 8.507zm1.976-4.177a1.343 1.343 0 1 1-1.9 1.899.11.11 0 0 0-.154 0 1.343 1.343 0 0 1-1.899-1.9.11.11 0 0 0 0-.153 1.343 1.343 0 0 1 1.9-1.9.11.11 0 0 0 .153 0 1.343 1.343 0 1 1 1.9 1.899.11.11 0 0 0 0 .153z" clipRule="evenodd" /><path fill="currentColor" d="M18.513 12.356c.212-.462.348-.964.393-1.491A6.3 6.3 0 1 1 13.17 22.08a5 5 0 0 0 1.156-1.111 4.793 4.793 0 0 0 4.188-8.612z" /><path fill="currentColor" d="M14.628 20.51a4.254 4.254 0 0 0 3.631-7.677c-.33.54-.771 1.01-1.292 1.378a1.342 1.342 0 0 1 1.209 2.269.11.11 0 0 0 0 .153 1.343 1.343 0 0 1-1.9 1.899.11.11 0 0 0-.153 0 1.34 1.34 0 0 1-.922.393 4.7 4.7 0 0 1-.572 1.584zM5.122 10.851A6.3 6.3 0 1 0 14 15.431a6.4 6.4 0 0 1-1.457.43 4.793 4.793 0 1 1-6.927-3.573 6.4 6.4 0 0 1-.494-1.436z" /><path fill="currentColor" d="M5.87 12.764a4.254 4.254 0 1 0 6.138 3.165 6.6 6.6 0 0 1-1.87-.11c-.054.242-.175.47-.362.659a.11.11 0 0 0 0 .153 1.343 1.343 0 1 1-1.9 1.899.11.11 0 0 0-.153 0 1.343 1.343 0 1 1-1.9-1.9.11.11 0 0 0 0-.153 1.343 1.343 0 0 1 1.208-2.269 6.5 6.5 0 0 1-1.16-1.446z" /></svg>;
};
export default SvgPointsSum;