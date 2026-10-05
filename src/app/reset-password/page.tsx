import type { Metadata } from "next";
import { AuthSplitLayout } from "@/components/AuthSplitLayout";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Nové heslo | dotra",
  description: "Nastavení nového hesla do dotra účtu",
};

export default function ResetPasswordPage() {
  return (
    <AuthSplitLayout>
      <ResetPasswordForm />
    </AuthSplitLayout>
  );
}
