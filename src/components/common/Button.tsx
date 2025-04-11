import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../utils/shadcn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-body1-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-30 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        full: "bg-main !text-body1-bold text-background-main hover:bg-button_hover hover:text-font-primary w-full h-[40px]",
        small:
          "bg-main rounded !text-body2-bold text-background-main hover:bg-button_hover hover:text-font-primary w-[67px] h-[40px]",
        secondary:
          "bg-background-toast rounded !text-body2-bold text-background-main hover:bg-font-muted hover:text-font-primary w-[67px] h-[40px]",
      },
    },
    defaultVariants: {
      variant: "small",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  fixed?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, fixed, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    if (fixed) {
      return (
        <div className="fixed bottom-0 left-0 right-0 z-10 mx-auto flex h-[73px] w-full max-w-[430px] items-center justify-center bg-[linear-gradient(180deg,_rgba(26,28,28,0)_0%,_rgba(26,28,28,1)_100%)] p-[16px]">
          <div className="absolute inset-0 -top-[12px] h-[85px] bg-[linear-gradient(180deg,_rgba(26,28,28,0)_0%,_rgba(26,28,28,1)_24px,_rgba(26,28,28,1)_100%)]" />
          <Comp
            className={cn(buttonVariants({ variant, className }), "relative max-w-[398px] p-4")}
            ref={ref}
            {...props}
          />
        </div>
      );
    }
    return <Comp className={cn(buttonVariants({ variant, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
