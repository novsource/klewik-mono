
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
const SvgMagicStick = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes['default'],
    height: props.size ? sizes[props.size] : props.height ?? sizes['default']
  };
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M3.845 3.845a2.883 2.883 0 0 0 0 4.077L5.432 9.51l.038-.04 4-4 .04-.038-1.588-1.587a2.883 2.883 0 0 0-4.077 0M10.568 6.49l-.038.04-4 4-.04.038 9.588 9.588a2.884 2.884 0 0 0 4.078-4.078zM16.1 2.307c.16-.41.738-.41.9 0l.43 1.095c.05.126.148.225.272.274l1.091.432a.486.486 0 0 1 0 .903l-1.09.433a.49.49 0 0 0-.273.273L17 6.81a.483.483 0 0 1-.9.001l-.43-1.094a.49.49 0 0 0-.273-.273l-1.09-.432a.486.486 0 0 1 0-.902l1.09-.432a.49.49 0 0 0 .273-.274l.43-1.095zM19.967 9.13a.483.483 0 0 1 .9 0l.156.399c.05.124.148.223.273.272l.398.158a.486.486 0 0 1 0 .902l-.398.158a.49.49 0 0 0-.272.273l-.157.4a.483.483 0 0 1-.9 0l-.157-.4a.49.49 0 0 0-.272-.273l-.398-.158a.486.486 0 0 1 0-.902l.398-.158a.49.49 0 0 0 .272-.273l.157-.4zM5.133 15.307a.483.483 0 0 1 .9 0l.157.4a.48.48 0 0 0 .272.273l.398.157a.486.486 0 0 1 0 .903l-.398.158a.48.48 0 0 0-.272.273l-.157.4a.483.483 0 0 1-.9 0l-.157-.4a.48.48 0 0 0-.272-.272l-.398-.158a.486.486 0 0 1 0-.903l.398-.157a.48.48 0 0 0 .272-.273l.157-.4z" /></svg>;
};
export default SvgMagicStick;