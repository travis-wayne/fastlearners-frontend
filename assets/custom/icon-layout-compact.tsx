import { type SVGProps } from "react";

export function IconLayoutCompact(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="3" y="3" width="6" height="6" stroke="currentColor" strokeWidth="2" />
      <rect x="3" y="13" width="6" height="6" stroke="currentColor" strokeWidth="2" />
      <rect x="13" y="3" width="8" height="16" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

