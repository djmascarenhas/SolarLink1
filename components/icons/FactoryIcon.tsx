
import React from 'react';

export const FactoryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.375-.375l-1.125 1.125M12 15.75l-3 3m0 0l-3-3m3 3V8.25" display="none" /> 
    {/* Replacing generic building with a factory look */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 21V8.25l4.5-2.25V21m0-11.25l4.5-2.25V21m0-9.75l4.5-2.25V21" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 8.25V5.25c0-.621.504-1.125 1.125-1.125h.75" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 8.25V6c0-.621.504-1.125 1.125-1.125h.75" />
     <path strokeLinecap="round" strokeLinejoin="round" d="M15 9.75V6.75c0-.621.504-1.125 1.125-1.125h.75" />
  </svg>
);
