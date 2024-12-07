import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { Dot } from "lucide-react"
import { cn } from "@/lib/utils"

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn("flex items-center gap-2", className)}
    {...props}
  />
))
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2", className)}
    {...props}
  />
))
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext)
  
  // Add null check for slots
  if (!inputOTPContext?.slots) {
    console.error("InputOTPSlot must be used within an OTPInput");
    return null;
  }

  const slot = inputOTPContext.slots[index];
  
  // Add null check for slot
  if (!slot) {
    console.error(`No slot found at index ${index}`);
    return null;
  }

  const { char, hasFakeCaret, isActive } = slot;

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center border-y border-r border-l border-input first:rounded-l-md last:rounded-r-md",
        isActive && "z-10 ring-2 ring-offset-background ring-ring",
        className
      )}
      {...props}
    >
      {char && !hasFakeCaret ? (
        <div className="animate-in fade-in-0">{char}</div>
      ) : null}
      {!char && !hasFakeCaret ? <Dot className="h-4 w-4" /> : null}
      {hasFakeCaret ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center animate-in fade-in-0">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-500" />
        </div>
      ) : null}
    </div>
  )
})
InputOTPSlot.displayName = "InputOTPSlot"

const InputOTPSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props} />
))
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }