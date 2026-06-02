import { CLIENT_COLORS } from "@repo/shared";
import { useRegistration } from "../../context/useRegistration";
import {
  ColorGrid,
  ColorLegend,
  ColorSwatch,
  FieldError,
  FieldHint,
  FieldLabel,
  FieldRoot,
} from "../../styles/primitives";

export function ColorPickerField() {
  const {
    selectColor,
    clearColor,
    selectedColorId,
    getError,
    submitting,
  } = useRegistration();
  const error = getError("color");
  const hasError = Boolean(error);

  return (
    <FieldRoot data-field-error={hasError ? "true" : undefined}>
      <FieldLabel $error={hasError}>Cor favorita</FieldLabel>
      <FieldHint>Escolha uma cor do arco-íris (opcional).</FieldHint>
      <ColorGrid role="radiogroup" aria-label="Cor favorita">
        {CLIENT_COLORS.map((option) => {
          const selected = selectedColorId === option.id;
          return (
            <ColorSwatch
              key={option.id}
              type="button"
              title={option.label}
              aria-label={option.label}
              aria-pressed={selected}
              disabled={submitting}
              $hex={option.hex}
              $on={selected}
              onClick={() =>
                selected ? clearColor() : selectColor(option.id)
              }
            />
          );
        })}
      </ColorGrid>
      {selectedColorId && (
        <ColorLegend>
          Selecionado:{" "}
          {CLIENT_COLORS.find((c) => c.id === selectedColorId)?.label}
        </ColorLegend>
      )}
      {hasError && (
        <FieldError role="alert">{error}</FieldError>
      )}
    </FieldRoot>
  );
}
