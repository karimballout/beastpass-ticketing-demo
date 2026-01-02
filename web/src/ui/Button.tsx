import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
};

export function Button({ children, onClick, disabled, variant = "primary" }: Props) {
  const isPrimary = variant === "primary";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "10px 12px",
        borderRadius: 10,
        border: "1px solid #444",
        background: isPrimary ? "#1b1b1b" : "transparent",
        color: "white",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {children}
    </button>
  );
}
