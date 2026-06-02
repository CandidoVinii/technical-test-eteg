import { useRegistration } from "../../context/useRegistration";
import { PrimaryButton } from "../../styles/primitives";
import { Spinner } from "../ui/Spinner";

export function SubmitButton() {
  const { submitting } = useRegistration();

  return (
    <PrimaryButton type="submit" disabled={submitting} aria-busy={submitting}>
      {submitting ? (
        <>
          <Spinner />
          <span>Cadastrando…</span>
        </>
      ) : (
        "Cadastrar"
      )}
    </PrimaryButton>
  );
}
