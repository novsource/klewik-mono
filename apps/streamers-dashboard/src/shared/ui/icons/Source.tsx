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
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 25" {...props}><path fill="currentColor" fillRule="evenodd" d="M15 2.889h2c1.886 0 2.828 0 3.414.586C21 4.06 21 5.003 21 6.889v15.25h1a.75.75 0 0 1 0 1.5H2a.75.75 0 0 1 0-1.5h1V9.889c0-1.886 0-2.829.586-3.414.586-.586 1.528-.586 3.414-.586h4c1.886 0 2.828 0 3.414.586C15 7.06 15 8.003 15 9.889v12.25h1.5V9.799c0-.865 0-1.659-.087-2.304-.095-.711-.32-1.463-.938-2.081s-1.37-.843-2.08-.938c-.637-.086-1.418-.087-2.269-.087.084-.387.225-.68.46-.914.586-.586 1.528-.586 3.414-.586m-9.75 6a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75m0 3a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75m0 3a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75M9 19.139a.75.75 0 0 1 .75.75v2.25h-1.5v-2.25a.75.75 0 0 1 .75-.75" clipRule="evenodd" /></svg>;
};
export default SvgSource;