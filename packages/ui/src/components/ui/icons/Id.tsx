
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
const SvgId = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes['default'],
    height: props.size ? sizes[props.size] : props.height ?? sizes['default']
  };
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M15.031 9.776c.354-.012.747.085 1.039.342.262.232.602.736.602 1.874s-.34 1.642-.604 1.875c-.29.257-.684.353-1.037.341h-1.467V9.777z" /><path fill="currentColor" fillRule="evenodd" d="M2 6.444A4.444 4.444 0 0 1 6.444 2h11.112A4.444 4.444 0 0 1 22 6.444v11.112A4.444 4.444 0 0 1 17.556 22H6.444A4.444 4.444 0 0 1 2 17.556zm5.328 9.974V7.562H9.55v8.856zm11.566-4.426c0-1.611-.502-2.79-1.356-3.542-.82-.722-1.81-.917-2.56-.896H11.34v8.876h3.637c.75.02 1.741-.174 2.56-.896.855-.753 1.357-1.93 1.357-3.542" clipRule="evenodd" /></svg>;
};
export default SvgId;
