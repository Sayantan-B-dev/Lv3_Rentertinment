import { redirect } from "next/navigation";

export default function ArtistViewRedirect({ params }: { params: any }) {
  const id = params.id;
  redirect(`/admin/artists/${id}/edit`);
}
