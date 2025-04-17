import React from 'react';

const FirebaseIcon = ({ width = 48, height = 48, fill = '#FFCA28', className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 256 351"
      className={className}
    >
      <defs>
        <filter id="logosFirebase0" width="200%" height="200%" x="-50%" y="-50%" filterUnits="objectBoundingBox">
          <feGaussianBlur in="SourceAlpha" result="shadowBlurInner1" stdDeviation="17.5"/>
          <feOffset in="shadowBlurInner1" result="shadowOffsetInner1"/>
          <feComposite in="shadowOffsetInner1" in2="SourceAlpha" k2="-1" k3="1" operator="arithmetic" result="shadowInnerInner1"/>
          <feColorMatrix in="shadowInnerInner1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0"/>
        </filter>
      </defs>
      <path fill={fill} d="m0 283l2-4L102 89l.4-.7.6.7L160 155z"/>
      <path fill={fill} d="m0 283l1-1 157-157 33 34z"/>
      <path fill={fill} d="m0 283l1-1 205-98-33-68z"/>
      <path fill={fill} d="m128 0l53 105h.5L128 0zM227 183l29 50h-.1L227 183z"/>
    </svg>
  );
};

export default FirebaseIcon; 