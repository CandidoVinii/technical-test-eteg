import { PageHeader } from "../components/registration/PageHeader";
import { RegistrationForm } from "../components/registration/RegistrationForm";
import { RegistrationProvider } from "../context/RegistrationProvider";
import { Card, Page } from "../styles/primitives";

export function RegisterPage() {
  return (
    <RegistrationProvider>
      <Page>
        <Card>
          <PageHeader />
          <RegistrationForm />
        </Card>
      </Page>
    </RegistrationProvider>
  );
}
