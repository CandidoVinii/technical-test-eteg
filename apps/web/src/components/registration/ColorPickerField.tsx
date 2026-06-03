import { useState, type ChangeEvent } from "react";
import { features } from "../../config/features";
import { useRegistration } from "../../context/useRegistration";
import {
  ColorAddDetails,
  ColorAddPanel,
  ColorGrid,
  ColorPickerInput,
  ColorPickerRow,
  ColorPreview,
  ColorPreviewHex,
  ColorPreviewLabel,
  ColorPreviewMeta,
  ColorPreviewSwatch,
  ColorSwatch,
  FieldControl,
  FieldError,
  FieldHint,
  FieldLabel,
  FieldRoot,
  PrimaryButton,
} from "../../styles/primitives";

export function ColorPickerField() {
  const {
    colors,
    colorsLoading,
    selectColor,
    selectedColorId,
    getError,
    submitting,
    createColor,
  } = useRegistration();
  const error = getError("color");
  const hasError = Boolean(error);
  const [newLabel, setNewLabel] = useState("");
  const [newHex, setNewHex] = useState("#3B82F6");
  const [adding, setAdding] = useState(false);

  const selected = colors.find((c) => String(c.id) === selectedColorId);

  const handleAddColor = async () => {
    setAdding(true);
    try {
      await createColor(newLabel, newHex);
      setNewLabel("");
    } finally {
      setAdding(false);
    }
  };

  return (
    <FieldRoot data-field-error={hasError ? "true" : undefined}>
      <FieldLabel $error={hasError}>Cor favorita</FieldLabel>
      <FieldHint>Selecione uma cor (obrigatório).</FieldHint>

      <ColorPreview $empty={!selected} aria-live="polite">
        {selected ? (
          <>
            <ColorPreviewSwatch $hex={selected.hex} aria-hidden />
            <ColorPreviewMeta>
              <ColorPreviewLabel>{selected.label}</ColorPreviewLabel>
              <ColorPreviewHex>{selected.hex}</ColorPreviewHex>
            </ColorPreviewMeta>
          </>
        ) : (
          <>
            <ColorPreviewSwatch $hex="#e7e5e4" aria-hidden />
            <ColorPreviewMeta>
              <ColorPreviewLabel>Prévia</ColorPreviewLabel>
              <ColorPreviewHex>Escolha uma cor abaixo</ColorPreviewHex>
            </ColorPreviewMeta>
          </>
        )}
      </ColorPreview>

      {colorsLoading ? (
        <FieldHint>Carregando cores…</FieldHint>
      ) : (
        <ColorGrid role="radiogroup" aria-label="Cor favorita">
          {colors.map((option) => {
            const id = String(option.id);
            const on = selectedColorId === id;
            return (
              <ColorSwatch
                key={id}
                type="button"
                title={option.label}
                aria-label={option.label}
                aria-pressed={on}
                disabled={submitting}
                $hex={option.hex}
                $on={on}
                onClick={() => selectColor(id)}
              />
            );
          })}
        </ColorGrid>
      )}

      {hasError && <FieldError role="alert">{error}</FieldError>}

      {features.addColor && (
        <ColorAddDetails>
          <summary>Adicionar nova cor</summary>
          <FieldHint>Nome e cor</FieldHint>
          <ColorAddPanel>
            <FieldControl
              aria-label="Nome da cor"
              placeholder="Ex.: Turquesa"
              value={newLabel}
              disabled={submitting || adding}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewLabel(e.target.value)
              }
            />
            <ColorPickerRow>
              <ColorPickerInput
                aria-label="Selecionar cor"
                value={newHex}
                disabled={submitting || adding}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setNewHex(e.target.value.toUpperCase())
                }
              />
              <ColorPreviewSwatch $hex={newHex} aria-hidden />
              <ColorPreviewHex>{newHex}</ColorPreviewHex>
            </ColorPickerRow>
            <PrimaryButton
              type="button"
              disabled={submitting || adding || !newLabel.trim()}
              onClick={() => void handleAddColor()}
            >
              Adicionar
            </PrimaryButton>
          </ColorAddPanel>
        </ColorAddDetails>
      )}
    </FieldRoot>
  );
}
