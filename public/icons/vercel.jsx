export default function Vercel({ width = "60", height = "60", fill = "#000000", className = "bg-slate-900 rounded-lg p-2", ...props }) {
    return (
      <svg
       width={width}
       height={height}
       viewBox="0 0 24 24" 
       fill={fill}
       xmlns="http://www.w3.org/2000/svg"
       className={className}
       {...props}
       >
        <path d="M12 2L2 20h20L12 2z" 
          fill={fill}
        />
      </svg>

    );
  }