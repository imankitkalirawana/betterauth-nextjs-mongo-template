export default async function OrganizationPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  return <div>Organization {params.id}</div>;
}
