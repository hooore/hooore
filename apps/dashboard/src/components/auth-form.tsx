"use client";

import type { FuncActionState } from "@/types/result";
import { useFormState } from "react-dom";

export type AuthFormProps = {
  children: React.ReactNode;
  action: (
    prevState: FuncActionState,
    formData: FormData,
  ) => Promise<FuncActionState>;
  className?: string;
  withErrorText?: boolean;
};

export function AuthForm({
  action,
  children,
  className,
  withErrorText = true,
}: AuthFormProps) {
  const [state, formAction] = useFormState(action, {
    success: true,
    data: "",
  });

  return (
    <form action={formAction} className={className}>
      {children}
      {withErrorText && !state.success && (
        <p className="dd-my-4 dd-text-red-500">{state.error}</p>
      )}
    </form>
  );
}