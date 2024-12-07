import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

export function OTPInput({ value, onChange, maxLength = 6 }: OTPInputProps) {
  return (
    <InputOTP
      maxLength={maxLength}
      value={value}
      onChange={onChange}
      render={({ slots }) => (
        <InputOTPGroup className="gap-2">
          {Array.from({ length: maxLength }).map((_, i) => (
            <InputOTPSlot key={i} index={i} />
          ))}
        </InputOTPGroup>
      )}
    />
  )
}