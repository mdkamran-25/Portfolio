export default function Bash({ width = "60", height = "60", fill = "#4EAA25", className = "bg-slate-900 rounded-lg p-2", ...props }) {
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
        <path d="M21.038 4.9l-7.577-4.498c-.8-.48-1.123-.48-1.922 0L3.962 4.9C3.24 5.32 3 5.6 3 6.32v11.36c0 .72.24 1 .962 1.42l7.577 4.498c.8.48 1.123.48 1.922 0l7.577-4.498c.72-.42.962-.7.962-1.42V6.32c0-.72-.242-1-.962-1.42zM12 6.32L5.28 10 12 13.68 18.72 10 12 6.32zm-7.5 10.32V9.36L12 12.68v7.28L4.5 16.64zm15 0L12 19.96v-7.28L19.5 9.36v7.28z" 
          fill={fill}
        />
      </svg>

    );
  }