import * as React from 'react';
import { EyeIcon, EyeOffIcon, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: LucideIcon;
  endIcon?: LucideIcon;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon, endIcon, ...props }, ref) => {
    const StartIcon = startIcon;
    const EndIcon = endIcon;
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
      <div className="relative w-full">
        {StartIcon && (
          <div className="absolute left-3 top-1/2 z-[2] -translate-y-1/2 transform">
            <StartIcon size={18} className="text-muted-foreground" />
          </div>
        )}
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-muted-foreground/30 dark:bg-[#323032]/50 dark:text-muted-foreground dark:backdrop-blur-lg',
            startIcon ? 'pl-10' : '',
            endIcon ? 'pr-8' : '',
            type === 'password' ? 'pr-8' : '',
            className
          )}
          style={{ fontSize: '16px' }}
          ref={ref}
          {...props}
        />
        {EndIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 transform">
            <EndIcon className="text-muted-foreground" size={18} />
          </div>
        )}
        {type === 'password' && (
          <div className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center gap-x-1 pr-3">
            <div
              className="cursor-pointer p-2"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOffIcon className="text-muted-foreground" size={20} />
              ) : (
                <EyeIcon className="text-muted-foreground" size={20} />
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
