import { useRegistration } from "../../context/useRegistration";
import {
  FieldControl,
  FieldError,
  FieldHint,
  FieldLabel,
  FieldRoot,
} from "../../styles/primitives";

export function CpfField() {
  const { getValue, setValue, blur, getError, submitting } = useRegistration();
  const error = getError("cpf");
  const hasError = Boolean(error);

  return (
    <FieldRoot data-field-error={hasError ? "true" : undefined}>
      <FieldLabel htmlFor="cpf" $error={hasError}>
        CPF
      </FieldLabel>
      <FieldControl
        id="cpf"
        name="cpf"
        inputMode="numeric"
        placeholder="000.000.000-00"
        autoComplete="off"
        required
        disabled={submitting}
        value={getValue("cpf")}
        $error={hasError}
        aria-invalid={hasError}
        aria-describedby={hasError ? "cpf-error" : "cpf-hint"}
        onChange={(e) => setValue("cpf", e.target.value)}
        onBlur={() => blur("cpf")}
      />
      {!hasError && (
        <FieldHint id="cpf-hint">Apenas números; um cadastro por CPF.</FieldHint>
      )}
      {hasError && (
        <FieldError id="cpf-error" role="alert">
          {error}
        </FieldError>
      )}
    </FieldRoot>
  );
}
