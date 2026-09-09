import type { Metadata } from "next";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Přihlášení | Dotra",
  description: "Přihlášení do Dotra dashboardu",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh flex-1 items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-[400px] rounded-[1.5rem] border border-border bg-card px-6 py-8 shadow-[0_16px_48px_rgba(17,17,17,0.08)] sm:px-8 sm:py-10">
        <LoginForm />
      </div>
    </main>
  );
}
