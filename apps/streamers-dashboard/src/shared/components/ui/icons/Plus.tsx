import * as React from 'react';
import type {SVGProps} from 'react';
const SvgPlus = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="none"
      viewBox="0 0 24 24"
      {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12.75 6a.75.75 0 0 0-1.5 0v5.25H6a.75.75 0 0 0 0 1.5h5.25V18a.75.75 0 0 0 1.5 0v-5.25H18a.75.75 0 0 0 0-1.5h-5.25z"
        clipRule="evenodd"
      />
    </svg>
  );
};
export default SvgPlus;
