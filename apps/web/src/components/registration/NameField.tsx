import { useRegistration } from "../../context/useRegistration";
import {
  FieldControl,
  FieldError,
  FieldLabel,
  FieldRoot,
} from "../../styles/primitives";

export function NameField() {
  const { getValue, setValue, blur, getError, submitting } = useRegistration();
  const error = getError("name");
  const hasError = Boolean(error);

  return (
    <FieldRoot data-field-error={hasError ? "true" : undefined}>
      <FieldLabel htmlFor="name" $error={hasError}>
        Nome completo
      </FieldLabel>
      <FieldControl
        id="name"
        name="name"
        placeholder="Maria Silva"
        autoComplete="name"
        required
        disabled={submitting}
        value={getValue("name")}
        $error={hasError}
        aria-invalid={hasError}
        aria-describedby={hasError ? "name-error" : undefined}
        onChange={(e) => setValue("name", e.target.value)}
        onBlur={() => blur("name")}
      />
      {hasError && (
        <FieldError id="name-error" role="alert">
          {error}
        </FieldError>
      )}
    </FieldRoot>
  );
}
