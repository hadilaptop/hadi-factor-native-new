import React from 'react';

export const Svg: React.FC<any> = ({ children, width = 24, height = 24, viewBox = '0 0 24 24', style, ...props }) => (
  <svg width={width} height={height} viewBox={viewBox} style={style} {...props}>
    {children}
  </svg>
);

export const Path: React.FC<any> = (props) => <path {...props} />;
export const Polyline: React.FC<any> = (props) => <polyline {...props} />;
export const Circle: React.FC<any> = (props) => <circle {...props} />;
export const Line: React.FC<any> = (props) => <line {...props} />;
export const Rect: React.FC<any> = (props) => <rect {...props} />;
export const G: React.FC<any> = (props) => <g {...props} />;

export default Svg;
