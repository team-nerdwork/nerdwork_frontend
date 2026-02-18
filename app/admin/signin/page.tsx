import { Suspense } from "react";
import AdminSignInClient from "./admin-signin-client";

export default function AdminSignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminSignInClient />
    </Suspense>
  );
}
