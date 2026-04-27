interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block"
        >
          <defs>
            <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--chart-4))" />
            </linearGradient>
          </defs>
          <rect x="1" y="1" width="30" height="30" rx="8" fill="url(#logo-grad)" />
          <rect x="1" y="1" width="30" height="30" rx="8" stroke="hsl(var(--foreground) / 0.08)" strokeWidth="1" />
          <path
            d="M9 11h14M9 16h10M9 21h7"
            stroke="hsl(var(--primary-foreground))"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.95"
          />
          <circle cx="23" cy="21" r="2.5" fill="hsl(var(--primary-foreground))" opacity="0.95" />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-bold tracking-tight text-foreground text-[15px]">
          AIToken<span className="text-primary">Calc</span>
        </span>
        <span className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground font-mono mt-0.5">
          API Cost Estimator
        </span>
      </div>
    </div>
  );
}
