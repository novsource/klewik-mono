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
const SvgOpenArrow = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes['default'],
    height: props.size ? sizes[props.size] : props.height ?? sizes['default']
  };
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 25" {...props}><path fill="currentColor" d="M12 2.139h-.057c-2.309 0-4.118 0-5.53.19-1.444.194-2.584.6-3.479 1.494-.895.895-1.3 2.035-1.494 3.48-.19 1.411-.19 3.22-.19 5.529v.114c0 2.309 0 4.118.19 5.53.194 1.444.6 2.584 1.494 3.479.895.895 2.035 1.3 3.48 1.494 1.411.19 3.22.19 5.529.19h.114c2.309 0 4.118 0 5.53-.19 1.444-.194 2.584-.6 3.479-1.494.895-.895 1.3-2.035 1.494-3.48.19-1.411.19-3.22.19-5.529v-.057a.75.75 0 0 0-1.5 0c0 2.378-.002 4.086-.176 5.386-.172 1.279-.5 2.05-1.069 2.62-.57.569-1.34.896-2.619 1.067-1.3.175-3.008.177-5.386.177s-4.086-.002-5.386-.177c-1.279-.171-2.05-.498-2.62-1.068-.569-.57-.896-1.34-1.068-2.619-.174-1.3-.176-3.008-.176-5.386s.002-4.087.176-5.387c.172-1.278.5-2.049 1.069-2.618.57-.57 1.34-.897 2.619-1.069 1.3-.174 3.008-.176 5.386-.176a.75.75 0 0 0 0-1.5" /><path fill="currentColor" d="M12.47 11.359a.75.75 0 1 0 1.06 1.06l7.72-7.72v3.534a.75.75 0 0 0 1.5 0V2.889a.75.75 0 0 0-.75-.75h-5.344a.75.75 0 0 0 0 1.5h3.533z" /></svg>;
};
export default SvgOpenArrow;