import type { Metadata } from "next";
import { AuthSplitLayout } from "@/components/AuthSplitLayout";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Přihlášení | dotra",
  description: "Přihlášení do dotra dashboardu",
};

export default function LoginPage() {
  return (
    <AuthSplitLayout>
      <LoginForm />
    </AuthSplitLayout>
  );
}
