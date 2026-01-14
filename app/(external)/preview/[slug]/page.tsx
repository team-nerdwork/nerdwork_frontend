import { getSharedComicPreview } from "@/actions/comic.actions";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";
import PreviewComicClient from "./PreviewComicClient";

interface PreviewComicProps {
  params: {
    slug: string;
  };
}

export default async function PreviewComic({ params }: PreviewComicProps) {
  const { slug } = params;
  const queryClient = new QueryClient();

  const response = await getSharedComicPreview(slug);

  if (!response?.success || !response?.data) {
    return notFound();
  }

  queryClient.setQueryData(["preview-comic", slug], response);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PreviewComicClient slug={slug} />
    </HydrationBoundary>
  );
}
