import styled, { css } from "styled-components";
import type { ToastVariant } from "../context/registration-context";

const fieldBorder = css<{ $error?: boolean }>`
  border: 1px solid
    ${({ theme, $error }) =>
      $error ? theme.colors.errorBorder : theme.colors.border};

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.borderFocus};
    outline-offset: 0;
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.bgInputDisabled};
    cursor: not-allowed;
  }
`;

function toastColors(theme: import("../theme").AppTheme, variant: ToastVariant) {
  const map = {
    success: {
      bg: theme.colors.successBg,
      border: theme.colors.successBorder,
      text: theme.colors.successText,
    },
    error: {
      bg: theme.colors.errorBg,
      border: theme.colors.errorBorder,
      text: theme.colors.errorText,
    },
    warning: {
      bg: theme.colors.warningBg,
      border: theme.colors.warningBorder,
      text: theme.colors.warningText,
    },
  };
  return map[variant];
}

export const Page = styled.main`
  display: flex;
  min-height: 100vh;
  min-height: 100dvh;
  align-items: flex-start;
  justify-content: center;
  padding: 16px 16px 24px;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    align-items: center;
    padding-top: 24px;
    padding-bottom: 32px;
  }
`;

export const Card = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxFormWidth};
  padding: 20px 16px;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.card};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 24px;
  }
`;

export const Title = styled.h1`
  margin: 0 0 8px;
  font-size: clamp(1.25rem, 4vw, ${({ theme }) => theme.fonts.sizeXl});
  font-weight: 600;
  line-height: 1.25;
`;

export const Subtitle = styled.p`
  margin: 0 0 20px;
  font-size: ${({ theme }) => theme.fonts.sizeSm};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textSecondary};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-bottom: 24px;
  }
`;

export const SectionLabel = styled.p`
  margin: 16px 0 12px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.divider};
  font-size: ${({ theme }) => theme.fonts.sizeSm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: 16px;
  }
`;

export const FieldRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const FieldLabel = styled.label<{ $error?: boolean }>`
  font-size: ${({ theme }) => theme.fonts.sizeSm};
  color: ${({ theme, $error }) =>
    $error ? theme.colors.errorText : theme.colors.textSecondary};
`;

export const FieldControl = styled.input<{ $error?: boolean }>`
  width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  font: inherit;
  font-size: max(16px, ${({ theme }) => theme.fonts.sizeBase});
  border-radius: ${({ theme }) => theme.radius.sm};
  ${fieldBorder}
`;

export const FieldTextarea = styled.textarea<{ $error?: boolean }>`
  width: 100%;
  min-height: 80px;
  padding: 10px 12px;
  font: inherit;
  font-size: max(16px, ${({ theme }) => theme.fonts.sizeBase});
  resize: vertical;
  border-radius: ${({ theme }) => theme.radius.sm};
  ${fieldBorder}
`;

export const FieldHint = styled.span`
  font-size: ${({ theme }) => theme.fonts.sizeXs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const FieldError = styled.span`
  font-size: ${({ theme }) => theme.fonts.sizeSm};
  color: ${({ theme }) => theme.colors.errorText};
`;

export const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-height: 48px;
  margin-top: 4px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  font: inherit;
  font-size: ${({ theme }) => theme.fonts.sizeBase};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textInverse};
  background: ${({ theme }) => theme.colors.primary};
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryHover};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.bgInputDisabled};
    color: ${({ theme }) => theme.colors.textPlaceholder};
    cursor: not-allowed;
  }
`;

export const SpinnerMark = styled.span`
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.65s linear infinite;
`;

export const ToastStack = styled.div`
  position: fixed;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  left: 12px;
  right: 12px;
  bottom: 12px;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    top: 16px;
    right: 16px;
    bottom: auto;
    left: auto;
    max-width: 360px;
  }
`;

export const ToastBox = styled.div<{ $variant: ToastVariant }>`
  padding: 12px 14px;
  font-size: ${({ theme }) => theme.fonts.sizeSm};
  line-height: 1.4;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme, $variant }) => toastColors(theme, $variant).border};
  background: ${({ theme, $variant }) => toastColors(theme, $variant).bg};
  color: ${({ theme, $variant }) => toastColors(theme, $variant).text};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

export const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  width: 100%;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(7, 1fr);
  }
`;

export const ColorSwatch = styled.button<{ $hex: string; $on?: boolean }>`
  width: 100%;
  aspect-ratio: 1;
  padding: 0;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 2px solid
    ${({ theme, $on }) => ($on ? theme.colors.borderFocus : theme.colors.border)};
  background: ${({ $hex }) => $hex};
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
  }
`;

export const ColorLegend = styled.span`
  font-size: ${({ theme }) => theme.fonts.sizeXs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const ColorPreview = styled.div<{ $empty?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
  padding: 12px;
  border: 1px solid
    ${({ theme, $empty }) =>
      $empty ? theme.colors.border : theme.colors.borderFocus};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.bgCard};
`;

export const ColorPreviewSwatch = styled.div<{ $hex: string }>`
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ $hex }) => $hex};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
`;

export const ColorPreviewMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

export const ColorPreviewLabel = styled.span`
  font-size: ${({ theme }) => theme.fonts.sizeSm};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const ColorPreviewHex = styled.span`
  font-size: ${({ theme }) => theme.fonts.sizeXs};
  font-family: ui-monospace, monospace;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const ColorAddDetails = styled.details`
  margin-top: 12px;

  summary {
    font-size: ${({ theme }) => theme.fonts.sizeXs};
    color: ${({ theme }) => theme.colors.textSecondary};
    cursor: pointer;
    list-style: none;
    user-select: none;

    &::-webkit-details-marker {
      display: none;
    }

    &::before {
      content: "+ ";
    }
  }

  &[open] summary::before {
    content: "− ";
  }
`;

export const ColorAddPanel = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 8px;
`;

export const ColorPickerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
`;

export const ColorPickerInput = styled.input.attrs({ type: "color" })`
  width: 52px;
  height: 44px;
  padding: 2px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.bgCard};
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
