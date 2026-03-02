
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
const SvgSound = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes['default'],
    height: props.size ? sizes[props.size] : props.height ?? sizes['default']
  };
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 25 25" {...props}><path fill="currentColor" fillRule="evenodd" d="M12.409 4.139a.75.75 0 0 1 .749.749l-.001 15.999a.75.75 0 0 1-1.501-.001l-.001-16.001a.75.75 0 0 1 .749-.751zM8.408 7.138a.75.75 0 0 1 .749.749v9.999a.75.75 0 0 1-1.501-.001V7.888a.75.75 0 0 1 .749-.751zm7.999-.001a.75.75 0 0 1 .749.749v9.999a.75.75 0 0 1-1.501-.001V7.888a.75.75 0 0 1 .749-.751zM4.408 11.138a.75.75 0 0 1 .749.749l-.001 1.999a.75.75 0 0 1-1.501-.001l-.001-2.001a.75.75 0 0 1 .749-.751zm15.999-.001a.75.75 0 0 1 .749.749v1.999a.75.75 0 0 1-1.501-.001v-2.001a.75.75 0 0 1 .749-.751z" clipRule="evenodd" /></svg>;
};
export default SvgSound;
