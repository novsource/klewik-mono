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
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 25" {...props}><path fill="currentColor" fillRule="evenodd" d="M12 14.456a6.3 6.3 0 1 0 0-12.6 6.3 6.3 0 0 0 0 12.6m0-1.507a4.793 4.793 0 1 0 0-9.587 4.793 4.793 0 0 0 0 9.587" clipRule="evenodd" /><path fill="currentColor" fillRule="evenodd" d="M12 12.41a4.254 4.254 0 1 0 0-8.508 4.254 4.254 0 0 0 0 8.507m1.976-4.177a1.343 1.343 0 1 1-1.9 1.899.11.11 0 0 0-.154 0 1.343 1.343 0 0 1-1.899-1.9.11.11 0 0 0 0-.153 1.343 1.343 0 0 1 1.9-1.9.11.11 0 0 0 .153 0 1.343 1.343 0 1 1 1.9 1.9.11.11 0 0 0 0 .154" clipRule="evenodd" /><path fill="currentColor" d="M18.513 12.357c.212-.463.348-.965.393-1.492A6.3 6.3 0 1 1 13.17 22.08a5 5 0 0 0 1.156-1.111 4.793 4.793 0 0 0 4.188-8.612" /><path fill="currentColor" d="M14.628 20.51a4.254 4.254 0 0 0 3.631-7.677c-.33.54-.771 1.01-1.292 1.378a1.342 1.342 0 0 1 1.209 2.268.11.11 0 0 0 0 .154 1.343 1.343 0 0 1-1.9 1.899.11.11 0 0 0-.154 0 1.34 1.34 0 0 1-.92.393 4.7 4.7 0 0 1-.574 1.584M5.122 10.852A6.3 6.3 0 1 0 14 15.429c-.46.198-.949.345-1.457.431q.05.341.05.696a4.793 4.793 0 1 1-6.978-4.268 6.4 6.4 0 0 1-.493-1.437" /><path fill="currentColor" d="M5.87 12.764a4.254 4.254 0 1 0 6.138 3.165 6.6 6.6 0 0 1-1.87-.109c-.054.241-.175.471-.362.659a.11.11 0 0 0 0 .154 1.343 1.343 0 1 1-1.9 1.899.11.11 0 0 0-.153 0 1.343 1.343 0 1 1-1.9-1.9.11.11 0 0 0 0-.153 1.343 1.343 0 0 1 1.208-2.268 6.5 6.5 0 0 1-1.161-1.447" /></svg>;
};
export default SvgPointsSum;