type IconProps = {
  className?: string;
};

export function SparklesIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 3.25 9.88 9.88 3.25 12l6.63 2.12L12 20.75l2.12-6.63L20.75 12l-6.63-2.12L12 3.25Z" />
      <path d="M5.5 3.75 4.7 6.2 2.25 7l2.45.8.8 2.45.8-2.45 2.45-.8L6.3 6.2l-.8-2.45Z" />
      <path d="m17.7 14.2.92-2.82L21.5 9.5l-2.88-.88-.92-2.82-.92 2.82-2.88.88 2.88.88.92 2.82Z" />
    </svg>
  );
}
