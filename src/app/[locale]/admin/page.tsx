import AdminDashboard from "../component/AdminDashboard";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <AdminDashboard locale={locale} />;
}