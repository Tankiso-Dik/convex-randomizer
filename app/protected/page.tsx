import AuthGate from "../components/AuthGate";

export default function ProtectedPage() {
  return (
    <AuthGate>
      <main>Secret dashboard content.</main>
    </AuthGate>
  );
}
