import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createColorSchema, formatCpfMask } from "@repo/shared";
import { ToastView } from "../components/registration/ToastView";
import { getColors, postColor } from "../services/color-api";
import { postClient } from "../services/client-api";
import {
  CLIENT_VALIDATION_TOAST,
  resolveApiToast,
  successToast,
  type ToastMessage,
} from "./registration-messages";
import {
  RegistrationContext,
  type FormFieldKey,
  type ToastState,
} from "./registration-context";
import {
  ALL_FIELDS_TOUCHED,
  emptyFields,
  fieldErrorsFromApi,
  hasFieldContent,
  parseClientForm,
  scrollToFirstFieldError,
  zodIssuesToFieldErrors,
  type FieldErrors,
  type FormFields,
} from "./registration-form";
import type { ColorResponse } from "@repo/shared";

const TOAST_DISMISS_MS = 4500;

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [fields, setFields] = useState<FormFields>(emptyFields);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<FormFieldKey, boolean>>>(
    {},
  );
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [colors, setColors] = useState<ColorResponse[]>([]);
  const [colorsLoading, setColorsLoading] = useState(true);
  const toastSeq = useRef(0);

  const notify = useCallback((message: ToastMessage) => {
    toastSeq.current += 1;
    setToast({
      id: toastSeq.current,
      variant: message.variant,
      message: message.message,
    });
  }, []);

  const failWithFieldErrors = useCallback(
    (errors: FieldErrors, toastMessage: ToastMessage) => {
      setFieldErrors(errors);
      notify(toastMessage);
      scrollToFirstFieldError();
    },
    [notify],
  );

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), TOAST_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [toast?.id]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await getColors();
      if (cancelled) return;
      if (result.ok) {
        setColors(result.data);
      } else {
        notify({
          variant: "error",
          message: "Não foi possível carregar as cores.",
        });
      }
      setColorsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [notify]);

  const clearFieldError = useCallback((key: FormFieldKey) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const validateField = useCallback((key: FormFieldKey, values: FormFields) => {
    if (!hasFieldContent(key, values[key])) {
      clearFieldError(key);
      return;
    }

    const result = parseClientForm(values);
    if (result.success) {
      clearFieldError(key);
      return;
    }
    const issue = result.error.errors.find((e) => {
      const path = e.path[0];
      if (path === key) return true;
      if (key === "color" && path === "colorId") return true;
      return false;
    });
    if (issue) {
      setFieldErrors((prev) => ({ ...prev, [key]: issue.message }));
    } else {
      clearFieldError(key);
    }
  }, [clearFieldError]);

  const getValue = useCallback(
    (field: FormFieldKey) => fields[field],
    [fields],
  );

  const setValue = useCallback(
    (field: FormFieldKey, value: string) => {
      const next: FormFields = {
        ...fields,
        [field]: field === "cpf" ? formatCpfMask(value) : value,
      };
      setFields(next);
      if (touched[field]) {
        validateField(field, next);
      }
    },
    [fields, touched, validateField],
  );

  const blur = useCallback(
    (field: FormFieldKey) => {
      if (!hasFieldContent(field, fields[field])) {
        clearFieldError(field);
        return;
      }
      setTouched((prev) => ({ ...prev, [field]: true }));
      validateField(field, fields);
    },
    [fields, validateField, clearFieldError],
  );

  const getError = useCallback(
    (field: FormFieldKey) => fieldErrors[field],
    [fieldErrors],
  );

  const selectColor = useCallback((colorId: string) => {
    setFields((prev) => ({ ...prev, color: colorId }));
    setTouched((prev) => ({ ...prev, color: true }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.color;
      return next;
    });
  }, []);

  const selectedColorId = fields.color || null;

  const createColor = useCallback(
    async (label: string, hex: string): Promise<boolean> => {
      const parsed = createColorSchema.safeParse({ label, hex });
      if (!parsed.success) {
        notify({
          variant: "warning",
          message: parsed.error.errors[0]?.message ?? "Dados da cor inválidos.",
        });
        return false;
      }

      const result = await postColor(parsed.data);
      if (!result.ok) {
        notify(resolveApiToast(result.status, result.error.code));
        return false;
      }

      setColors((prev) =>
        [...prev, result.data].sort((a, b) => a.label.localeCompare(b.label)),
      );
      selectColor(String(result.data.id));
      notify({ variant: "success", message: `Cor "${result.data.label}" criada.` });
      return true;
    },
    [notify, selectColor],
  );

  const submitForm = useCallback(async () => {
    setToast(null);
    setTouched(ALL_FIELDS_TOUCHED);

    const parsed = parseClientForm(fields);
    if (!parsed.success) {
      failWithFieldErrors(
        zodIssuesToFieldErrors(parsed.error.errors),
        CLIENT_VALIDATION_TOAST,
      );
      return;
    }

    setFieldErrors({});
    setSubmitting(true);

    try {
      const result = await postClient(parsed.data);

      if (result.ok) {
        setFields(emptyFields());
        setTouched({});
        notify(successToast(result.data.name));
        return;
      }

      const errors = fieldErrorsFromApi(result.error);
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        scrollToFirstFieldError();
      }

      notify(resolveApiToast(result.status, result.error.code));
    } finally {
      setSubmitting(false);
    }
  }, [fields, failWithFieldErrors, notify]);

  const value = useMemo(
    () => ({
      submitting,
      toast,
      colors,
      colorsLoading,
      submitForm: () => {
        void submitForm();
      },
      getValue,
      setValue,
      blur,
      getError,
      selectColor,
      selectedColorId,
      createColor,
      noteLength: fields.note.length,
    }),
    [
      submitting,
      toast,
      colors,
      colorsLoading,
      submitForm,
      getValue,
      setValue,
      blur,
      getError,
      selectColor,
      selectedColorId,
      createColor,
      fields.note.length,
    ],
  );

  return (
    <RegistrationContext.Provider value={value}>
      {children}
      <ToastView />
    </RegistrationContext.Provider>
  );
}
