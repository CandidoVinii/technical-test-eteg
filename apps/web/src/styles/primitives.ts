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
  padding: max(16px, env(safe-area-inset-top))
    max(16px, env(safe-area-inset-right))
    max(24px, env(safe-area-inset-bottom))
    max(16px, env(safe-area-inset-left));

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
  left: max(12px, env(safe-area-inset-left));
  right: max(12px, env(safe-area-inset-right));
  bottom: max(12px, env(safe-area-inset-bottom));

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    top: max(16px, env(safe-area-inset-top));
    right: max(16px, env(safe-area-inset-right));
    bottom: auto;
    left: auto;
    max-width: min(360px, calc(100vw - 32px));
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
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  width: 100%;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
    gap: 10px;
    max-width: 320px;
  }
`;

export const ColorSwatch = styled.button<{ $hex: string; $on?: boolean }>`
  width: 100%;
  aspect-ratio: 1;
  max-width: 44px;
  max-height: 44px;
  justify-self: center;
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
