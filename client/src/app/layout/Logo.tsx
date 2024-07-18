import React, { SVGProps } from 'react';

const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.0" x="0px" y="0px" viewBox="0 0 24 24" enableBackground="new 0 0 24 24" xmlSpace="preserve">
    <g>
      <circle cx="12" cy="12" r="8" fill="white" />
      <path d="M12,4c4.4,0,8,3.6,8,8s-3.6,8-8,8c-4.4,0-8-3.6-8-8S7.6,4,12,4 M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10c5.5,0,10-4.5,10-10   S17.5,2,12,2L12,2z"></path>
    </g>
    <polygon points="9.6,15.8 8,11.1 12,8.2 16,11.1 14.4,15.8 "></polygon>
    <polygon points="13.9,2.4 15.1,4.5 12,5.8 8.9,4.5 10.1,2.4 "></polygon>
    <polygon points="3.5,7.2 5.9,6.8 6.1,10.1 3.9,12.6 2.3,10.8 "></polygon>
    <polygon points="4.8,18.6 5.1,16.2 8.4,17 10.1,19.9 7.9,20.9 "></polygon>
    <polygon points="16.1,20.9 13.9,19.9 15.6,17 18.9,16.2 19.2,18.6 "></polygon>
    <polygon points="21.7,10.8 20.1,12.6 17.9,10.1 18.1,6.8 20.5,7.2 "></polygon>
  </svg>
);

export default Logo;
