import { useRegistration } from "../../context/useRegistration";
import {
  FieldError,
  FieldHint,
  FieldLabel,
  FieldRoot,
  FieldTextarea,
} from "../../styles/primitives";

export function NoteField() {
  const { getValue, setValue, blur, getError, submitting, noteLength } =
    useRegistration();
  const error = getError("note");
  const hasError = Boolean(error);

  return (
    <FieldRoot data-field-error={hasError ? "true" : undefined}>
      <FieldLabel htmlFor="note" $error={hasError}>
        Observação
      </FieldLabel>
      <FieldTextarea
        id="note"
        name="note"
        rows={3}
        maxLength={500}
        disabled={submitting}
        value={getValue("note")}
        $error={hasError}
        aria-invalid={hasError}
        aria-describedby={hasError ? "note-error" : "note-hint"}
        onChange={(e) => setValue("note", e.target.value)}
        onBlur={() => blur("note")}
      />
      {!hasError && (
        <FieldHint id="note-hint">
          {noteLength} / 500
        </FieldHint>
      )}
      {hasError && (
        <FieldError id="note-error" role="alert">
          {error}
        </FieldError>
      )}
    </FieldRoot>
  );
}
