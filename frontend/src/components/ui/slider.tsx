import * as React from "react"
import { cn } from "../../lib/utils"

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: number;
  max?: number;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, max = 100, ...props }, ref) => {
    // Calcul du pourcentage pour colorier la barre avant le curseur
    const percentage = (value / max) * 100;

    return (
      <div className="relative flex w-full touch-none select-none items-center group">
        {/* La barre de fond (grise) */}
        <div className="relative h-1 w-full grow overflow-hidden rounded-full bg-white/20">
          {/* La barre remplie (violette) */}
          <div 
            className="absolute h-full bg-primary transition-all duration-100 ease-out" 
            style={{ width: `${percentage}%` }} 
          />
        </div>
        
        {/* L'input invisible qui permet de cliquer et glisser */}
        <input
          type="range"
          max={max}
          value={value}
          ref={ref}
          className={cn(
            "absolute inset-0 w-full opacity-0 cursor-pointer h-4 top-1/2 -translate-y-1/2",
            className
          )}
          {...props}
        />
        
        {/* Le petit rond (Thumb) qui apparaît au survol */}
        <div 
            className="absolute h-3 w-3 rounded-full border border-primary bg-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}
        />
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }