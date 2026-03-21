
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
const SvgTelegram = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes['default'],
    height: props.size ? sizes[props.size] : props.height ?? sizes['default']
  };
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 28 28" {...props}><path fill="currentColor" d="M23.983 6.76c.156-1.006-.801-1.8-1.696-1.408l-17.83 7.83c-.643.28-.596 1.253.07 1.465l3.677 1.171a2.37 2.37 0 0 0 2.074-.315l8.29-5.728c.25-.172.523.183.31.403l-5.968 6.153c-.579.598-.464 1.609.233 2.046l6.68 4.19c.75.47 1.714-.003 1.854-.908z" /></svg>;
};
export default SvgTelegram;
