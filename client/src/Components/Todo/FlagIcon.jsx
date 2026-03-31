const FlagIcon = ({ active }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={active ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    className={`w-5 h-5 transition-colors ${
      active ? "text-indigo-400" : "text-slate-400"
    }`}
  >
    <path d="M5 3v18" /> 
    <path d="M5 3h10l-2 4 2 4H5" />
  </svg>
);

export default FlagIcon