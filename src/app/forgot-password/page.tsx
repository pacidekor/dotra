import type { Metadata } from "next";
import { AuthSplitLayout } from "@/components/AuthSplitLayout";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Zapomenuté heslo | dotra",
  description: "Obnovení hesla do dotra účtu",
};

export default function ForgotPasswordPage() {
  return (
    <AuthSplitLayout>
      <ForgotPasswordForm />
    </AuthSplitLayout>
  );
}
