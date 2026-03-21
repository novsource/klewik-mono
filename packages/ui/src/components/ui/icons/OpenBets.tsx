
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
const SvgOpenBets = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes['default'],
    height: props.size ? sizes[props.size] : props.height ?? sizes['default']
  };
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 25" {...props}><path fill="currentColor" d="M2 5.327c0-.942 0-1.414.293-1.707S3.057 3.327 4 3.327h16c.943 0 1.414 0 1.707.293S22 4.385 22 5.327s0 1.415-.293 1.708-.764.292-1.707.292H4c-.943 0-1.414 0-1.707-.292C2 6.742 2 6.27 2 5.327M20.069 8.828q.211 0 .43-.002v4.502c0 3.77 0 5.656-1.172 6.828-1.145 1.145-2.973 1.17-6.578 1.171v-7.045l1.693 1.88a.75.75 0 1 0 1.115-1.003l-3-3.334a.75.75 0 0 0-1.115 0l-3 3.333a.75.75 0 1 0 1.114 1.003l1.693-1.881v7.045c-3.605 0-5.433-.026-6.578-1.171C3.5 18.984 3.5 17.099 3.5 13.328V8.826q.219.002.431.002H20.07z" /></svg>;
};
export default SvgOpenBets;
