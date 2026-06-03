import { useRegistration } from "../../context/useRegistration";
import { Form, SectionLabel } from "../../styles/primitives";
import { ColorPickerField } from "./ColorPickerField";
import { CpfField } from "./CpfField";
import { EmailField } from "./EmailField";
import { NameField } from "./NameField";
import { NoteField } from "./NoteField";
import { SubmitButton } from "./SubmitButton";

export function RegistrationForm() {
  const { submitForm, submitting } = useRegistration();

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    submitForm();
  };

  return (
    <Form onSubmit={handleSubmit} aria-busy={submitting} noValidate>
      <NameField />
      <EmailField />
      <CpfField />
      <ColorPickerField />
      <NoteField />
      <SubmitButton />
    </Form>
  );
}
