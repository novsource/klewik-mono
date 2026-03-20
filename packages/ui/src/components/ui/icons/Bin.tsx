
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
const SvgBin = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes['default'],
    height: props.size ? sizes[props.size] : props.height ?? sizes['default']
  };
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M3 6.386c0-.484.345-.877.771-.877l2.666-.002c.53-.015.996-.398 1.176-.964l.03-.1.115-.391c.07-.24.131-.45.217-.637.338-.739.964-1.252 1.687-1.383.184-.032.378-.032.6-.032h3.48c.222 0 .416 0 .599.033.722.131 1.348.644 1.686 1.383.086.187.147.396.218.637l.114.391.03.1c.18.566.74.95 1.27.965h2.57c.427-.001.772.392.772.876s-.345.877-.771.877H3.77c-.425 0-.77-.393-.77-.877z" /><path fill="currentColor" fillRule="evenodd" d="M11.596 22h.808c2.783 0 4.175 0 5.08-.886.904-.886.996-2.339 1.181-5.245l.267-4.19c.1-1.576.15-2.365-.303-2.864-.455-.5-1.221-.5-2.754-.5H8.124c-1.533 0-2.3 0-2.753.5s-.403 1.288-.302 2.865l.267 4.189c.185 2.905.277 4.358 1.182 5.244s2.296.886 5.079.886zm-1.35-9.811c-.04-.435-.408-.752-.82-.708-.413.043-.713.43-.672.864l.5 5.263c.04.433.408.75.82.706.413-.044.714-.43.672-.864l-.5-5.263zm4.329-.708c.412.043.713.43.671.864l-.5 5.263c-.04.433-.409.75-.82.706-.413-.044-.714-.43-.672-.864l.5-5.263c.04-.435.409-.752.82-.708z" clipRule="evenodd" /></svg>;
};
export default SvgBin;
