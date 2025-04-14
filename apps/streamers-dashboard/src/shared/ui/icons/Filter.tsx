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
const SvgFilter = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes['default'],
    height: props.size ? sizes[props.size] : props.height ?? sizes['default']
  };
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 25 25" {...props}><path fill="currentColor" d="M19.205 3.013h-14c-1.414 0-2.121 0-2.56.412s-.44 1.075-.44 2.402v.69c0 1.038 0 1.557.26 1.987s.733.697 1.682 1.231l2.913 1.64c.636.358.955.537 1.182.735.475.412.767.896.9 1.49.063.285.063.618.063 1.286v2.669c0 .91 0 1.364.252 1.719.252.354.7.53 1.594.88 1.879.734 2.818 1.1 3.486.683s.668-1.372.668-3.282v-2.67c0-.667 0-1 .063-1.285a2.68 2.68 0 0 1 .9-1.49c.227-.198.546-.377 1.182-.735l2.913-1.64c.948-.534 1.423-.8 1.682-1.231.26-.43.26-.949.26-1.987v-.69c0-1.327 0-1.99-.44-2.402-.439-.412-1.146-.412-2.56-.412" /></svg>;
};
export default SvgFilter;