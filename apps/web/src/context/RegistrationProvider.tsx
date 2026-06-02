import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { formatCpfMask, isClientColorId, type ClientColorId } from "@repo/shared";
import { ToastView } from "../components/registration/ToastView";
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

const TOAST_DISMISS_MS = 4500;

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [fields, setFields] = useState<FormFields>(emptyFields);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<FormFieldKey, boolean>>>(
    {},
  );
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
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
    const issue = result.error.errors.find((e) => e.path[0] === key);
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

  const selectColor = useCallback((colorId: ClientColorId) => {
    setFields((prev) => ({ ...prev, color: colorId }));
    setTouched((prev) => ({ ...prev, color: true }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.color;
      return next;
    });
  }, []);

  const clearColor = useCallback(() => {
    setFields((prev) => ({ ...prev, color: "" }));
  }, []);

  const selectedColorId = useMemo((): ClientColorId | null => {
    const id = fields.color;
    return isClientColorId(id) ? id : null;
  }, [fields.color]);

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
      submitForm: () => {
        void submitForm();
      },
      getValue,
      setValue,
      blur,
      getError,
      selectColor,
      clearColor,
      selectedColorId,
      noteLength: fields.note.length,
    }),
    [
      submitting,
      toast,
      submitForm,
      getValue,
      setValue,
      blur,
      getError,
      selectColor,
      clearColor,
      selectedColorId,
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
