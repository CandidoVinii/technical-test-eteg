import { useRegistration } from "../../context/useRegistration";
import {
  FieldControl,
  FieldError,
  FieldLabel,
  FieldRoot,
} from "../../styles/primitives";

export function EmailField() {
  const { getValue, setValue, blur, getError, submitting } = useRegistration();
  const error = getError("email");
  const hasError = Boolean(error);

  return (
    <FieldRoot data-field-error={hasError ? "true" : undefined}>
      <FieldLabel htmlFor="email" $error={hasError}>
        E-mail
      </FieldLabel>
      <FieldControl
        id="email"
        name="email"
        type="email"
        placeholder="maria@email.com"
        autoComplete="email"
        required
        disabled={submitting}
        value={getValue("email")}
        $error={hasError}
        aria-invalid={hasError}
        aria-describedby={hasError ? "email-error" : undefined}
        onChange={(e) => setValue("email", e.target.value)}
        onBlur={() => blur("email")}
      />
      {hasError && (
        <FieldError id="email-error" role="alert">
          {error}
        </FieldError>
      )}
    </FieldRoot>
  );
}
