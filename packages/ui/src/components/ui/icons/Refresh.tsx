
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
const SvgRefresh = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes['default'],
    height: props.size ? sizes[props.size] : props.height ?? sizes['default']
  };
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12.079 2.25c-4.795 0-8.735 3.663-9.12 8.333H2a.75.75 0 0 0-.528 1.283l1.68 1.666a.75.75 0 0 0 1.056 0l1.68-1.666a.75.75 0 0 0-.528-1.283h-.893c.38-3.831 3.638-6.833 7.612-6.833a7.66 7.66 0 0 1 6.536 3.643.75.75 0 1 0 1.277-.786A9.16 9.16 0 0 0 12.08 2.25zM20.841 10.467a.75.75 0 0 0-1.053 0L18.1 12.133a.75.75 0 0 0 .528 1.284h.899c-.381 3.83-3.651 6.833-7.644 6.833a7.7 7.7 0 0 1-6.565-3.644.75.75 0 1 0-1.277.788 9.2 9.2 0 0 0 7.843 4.356c4.808 0 8.764-3.66 9.15-8.333H22a.75.75 0 0 0 .527-1.284z" /><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M12.079 2.25c-4.795 0-8.735 3.663-9.12 8.333H2a.75.75 0 0 0-.528 1.283l1.68 1.666a.75.75 0 0 0 1.056 0l1.68-1.666a.75.75 0 0 0-.528-1.283h-.893c.38-3.831 3.638-6.833 7.612-6.833a7.66 7.66 0 0 1 6.536 3.643.75.75 0 1 0 1.277-.786A9.16 9.16 0 0 0 12.08 2.25zM20.841 10.467a.75.75 0 0 0-1.053 0L18.1 12.133a.75.75 0 0 0 .528 1.284h.899c-.381 3.83-3.651 6.833-7.644 6.833a7.7 7.7 0 0 1-6.565-3.644.75.75 0 1 0-1.277.788 9.2 9.2 0 0 0 7.843 4.356c4.808 0 8.764-3.66 9.15-8.333H22a.75.75 0 0 0 .527-1.284z" /></svg>;
};
export default SvgRefresh;
