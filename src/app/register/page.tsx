import type { Metadata } from "next";
import { AuthSplitLayout } from "@/components/AuthSplitLayout";
import { RegisterForm } from "@/components/RegisterForm";

export const metadata: Metadata = {
  title: "Registrace | dotra",
  description: "Vytvořte si dotra účet",
};

export default function RegisterPage() {
  return (
    <AuthSplitLayout>
      <RegisterForm />
    </AuthSplitLayout>
  );
}
