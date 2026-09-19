import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { getValidAdminSession } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminIndex,
});

function AdminIndex() {
  useEffect(() => {
    void getValidAdminSession().then((session) => {
      window.location.replace(session ? "/admin/bookings" : "/admin/login");
    });
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-sand">
      <p className="text-sm text-muted-foreground">Opening SPA NAZ admin…</p>
    </main>
  );
}
