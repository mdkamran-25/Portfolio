
export default function X({ width="40", height="40", fill="#1ABCFE", className= " rounded-lg", ...props}) {
    return (
    <svg
       width={width}
       height={height}
       viewBox="0 0 24 24" 
       fill={fill}
       xmlns="http://www.w3.org/2000/svg" transform="rotate(0 0 0)"
       className={className}
       {...props}
       >
        <path
         d="M17.7512 2.96094H20.818L14.1179 10.6187L22 21.0391H15.8284L10.9946 14.7191L5.4636 21.0391H2.39492L9.56132 12.8483L2 2.96094H8.32824L12.6976 8.73762L17.7512 2.96094ZM16.6748 19.2035H18.3742L7.40492 4.70014H5.58132L16.6748 19.2035Z" 
         fill={fill}
         />
    </svg>
    );
  }
