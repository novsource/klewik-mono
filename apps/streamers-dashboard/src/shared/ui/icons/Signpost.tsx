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
const SvgSignpost = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes['default'],
    height: props.size ? sizes[props.size] : props.height ?? sizes['default']
  };
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 25" {...props}><path fill="currentColor" fillRule="evenodd" d="M12.75 2.889a.75.75 0 0 0-1.5 0v1.5H6.704c-.658 0-.986 0-1.288.098a2 2 0 0 0-.383.17c-.274.16-.494.404-.933.893-.85.948-1.276 1.422-1.379 1.975a2 2 0 0 0 0 .728c.103.553.528 1.027 1.379 1.974.44.49.659.734.933.893q.183.105.383.17c.302.099.63.099 1.288.099h4.546v2H6.5c-1.404 0-2.107 0-2.611.337a2 2 0 0 0-.552.552C3 14.782 3 15.485 3 16.888c0 1.405 0 2.108.337 2.612.146.218.333.406.552.552.504.337 1.207.337 2.611.337h4.75v1.75H10a.75.75 0 0 0 0 1.5h4a.75.75 0 0 0 0-1.5h-1.25v-1.75h4.546c.658 0 .986 0 1.288-.098q.2-.066.383-.17c.274-.16.494-.404.933-.894.85-.947 1.276-1.42 1.379-1.974a2 2 0 0 0 0-.728c-.103-.553-.528-1.027-1.379-1.974-.44-.49-.659-.734-.933-.893a2 2 0 0 0-.383-.17c-.302-.1-.63-.1-1.288-.1H12.75v-2h4.75c1.404 0 2.107 0 2.611-.336.218-.146.406-.334.552-.552C21 9.996 21 9.293 21 7.89s0-2.107-.337-2.611a2 2 0 0 0-.552-.552c-.504-.337-1.207-.337-2.611-.337h-4.75zM9 7.139a.75.75 0 1 0 0 1.5h6a.75.75 0 0 0 0-1.5zm-.75 9.75a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75" clipRule="evenodd" /></svg>;
};
export default SvgSignpost;