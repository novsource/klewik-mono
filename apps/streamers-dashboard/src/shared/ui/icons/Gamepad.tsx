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
const SvgGamepad = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes['default'],
    height: props.size ? sizes[props.size] : props.height ?? sizes['default']
  };
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}><path fill="currentColor" fillRule="evenodd" d="m10.667 6.134-.502-.355A4.24 4.24 0 0 0 7.715 5h-.612c-.405 0-.813.025-1.194.16-2.384.846-4.023 3.935-3.904 10.943.024 1.411.354 2.972 1.628 3.581A3.2 3.2 0 0 0 5.027 20a2.74 2.74 0 0 0 1.53-.437c.41-.268.77-.616 1.13-.964.444-.431.888-.861 1.424-1.14a4.1 4.1 0 0 1 1.891-.46H13c.657 0 1.305.158 1.889.46.535.279.98.709 1.424 1.14.36.347.72.695 1.128.963.39.256.895.437 1.531.437a3.2 3.2 0 0 0 1.393-.316c1.274-.61 1.604-2.17 1.628-3.581.118-7.008-1.52-10.097-3.903-10.942-.38-.135-.788-.16-1.193-.16h-.612a4.24 4.24 0 0 0-2.45.78l-.502.354a2.31 2.31 0 0 1-2.666 0M16.75 9a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5m-9.25.25a.75.75 0 0 1 .75.75v.75H9a.75.75 0 0 1 0 1.5h-.75V13a.75.75 0 0 1-1.5 0v-.75H6a.75.75 0 0 1 0-1.5h.75V10a.75.75 0 0 1 .75-.75m11.5 2a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m-3.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m2.25.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0" clipRule="evenodd" /></svg>;
};
export default SvgGamepad;