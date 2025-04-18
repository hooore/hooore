import * as React from "react";

import { cn } from "@hooore/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "dd-flex dd-h-10 dd-w-full dd-rounded-md dd-border dd-border-input dd-bg-background dd-px-3 dd-py-2 dd-text-sm dd-ring-offset-background file:dd-border-0 file:dd-bg-transparent file:dd-text-sm file:dd-font-medium placeholder:dd-text-muted-foreground focus-visible:dd-outline-none focus-visible:dd-ring-2 focus-visible:dd-ring-ring focus-visible:dd-ring-offset-2 disabled:dd-cursor-not-allowed disabled:dd-opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export interface InputWithIconProps extends InputProps {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ className, type, startIcon, endIcon, ...props }, ref) => {
    return (
      <div className="dd-relative dd-w-full">
        {startIcon && (
          <div className="dd-absolute dd-left-1.5 dd-top-1/2 -dd-translate-y-1/2 dd-transform">
            {startIcon}
          </div>
        )}
        <Input
          type={type}
          ref={ref}
          {...props}
          className={cn(
            startIcon && "dd-pl-8",
            endIcon && "dd-pr-8",
            className
          )}
        />
        {endIcon && (
          <div className="dd-absolute dd-right-3 dd-top-1/2 -dd-translate-y-1/2 dd-transform">
            {endIcon}
          </div>
        )}
      </div>
    );
  }
);
InputWithIcon.displayName = "InputWithIcon";

export { Input, InputWithIcon };
