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
const SvgIntegrations = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes['default'],
    height: props.size ? sizes[props.size] : props.height ?? sizes['default']
  };
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 25" {...props}><path fill="currentColor" d="M21.537 12.328a2.532 2.532 0 0 0-4.963-.71h-4.171v-5.05h4.17a2.533 2.533 0 1 0-.038-1.266h-4.132c-.428-.07-1.282.084-1.282 1.266v5.05H7.426a2.533 2.533 0 1 0 .038 1.273h3.657v5.283c0 1.132.854 1.319 1.282 1.271h4.154a2.533 2.533 0 1 0-.007-1.27h-4.147V12.89h4.133a2.533 2.533 0 0 0 5.001-.563" /></svg>;
};
export default SvgIntegrations;