import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Iniciar sesión"
        description="Página de acceso al panel administrativo de Hospital Santa Bárbara"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
