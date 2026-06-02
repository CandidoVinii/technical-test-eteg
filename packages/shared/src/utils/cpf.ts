const CPF_LENGTH = 11;

function allSameDigits(digits: string): boolean {
  return /^(\d)\1+$/.test(digits);
}

function calcCheckDigit(digits: string, factor: number): number {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    sum += Number(digits[i]) * (factor - i);
  }
  const remainder = (sum * 10) % 11;
  return remainder === 10 ? 0 : remainder;
}

export function stripCpf(value: string): string {
  return value.replace(/\D/g, "");
}

export function validateCpf(value: string): boolean {
  const digits = stripCpf(value);
  if (digits.length !== CPF_LENGTH) return false;
  if (allSameDigits(digits)) return false;

  const base = digits.slice(0, 9);
  const first = calcCheckDigit(base, 10);
  if (first !== Number(digits[9])) return false;

  const second = calcCheckDigit(base + String(first), 11);
  return second === Number(digits[10]);
}

export function formatCpfMask(value: string): string {
  const digits = stripCpf(value).slice(0, CPF_LENGTH);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}
