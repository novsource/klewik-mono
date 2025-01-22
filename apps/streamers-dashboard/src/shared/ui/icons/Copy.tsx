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
const SvgCopy = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes['default'],
    height: props.size ? sizes[props.size] : props.height ?? sizes['default']
  };
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 25 24" {...props}><path fill="currentColor" d="M15.74 2h-3.894c-1.764 0-3.162 0-4.255.148-1.126.152-2.037.472-2.755 1.193-.719.721-1.038 1.636-1.189 2.766C3.5 7.205 3.5 8.608 3.5 10.379v5.838c0 1.508.92 2.8 2.227 3.342-.067-.91-.067-2.185-.067-3.247v-5.01c0-1.281 0-2.386.118-3.27.127-.948.413-1.856 1.147-2.593s1.639-1.024 2.583-1.152c.88-.118 1.98-.118 3.257-.118h3.07c1.276 0 2.374 0 3.255.118A3.6 3.6 0 0 0 15.74 2" /><path fill="currentColor" d="M7.1 11.397c0-2.726 0-4.089.844-4.936.843-.847 2.2-.847 4.916-.847h2.88c2.715 0 4.073 0 4.917.847s.843 2.21.843 4.936v4.82c0 2.726 0 4.089-.843 4.936-.844.847-2.202.847-4.917.847h-2.88c-2.715 0-4.073 0-4.916-.847-.844-.847-.844-2.21-.844-4.936z" /></svg>;
};
export default SvgCopy;