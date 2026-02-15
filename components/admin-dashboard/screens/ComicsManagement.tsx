"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Eye, Flag, Check, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAdminComics, updateAdminComicStatus } from "@/actions/admin.actions";
import { ApiResult, AdminComic, Paginated } from "@/lib/types/admin";
import { toast } from "sonner";

export function ComicsManagement() {
  const [activeTab, setActiveTab] = useState("pending");
  const [page, setPage] = useState(1);
  const [actionComicId, setActionComicId] = useState<string | null>(null);
  const pageSize = 20;

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const { data, isLoading, isError, refetch } = useQuery<
    ApiResult<Paginated<AdminComic>>
  >({
    queryKey: ["admin-comics", activeTab, page],
    queryFn: async () =>
      await getAdminComics({
        status: activeTab,
        page,
        pageSize,
      }),
  });

  const isFailed = data?.success === false;
  const comics = data?.data?.data ?? [];
  const totalComicsForTab = data?.data?.pagination?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalComicsForTab / pageSize));

  const { data: totalData } = useQuery<ApiResult<Paginated<AdminComic>>>({
    queryKey: ["admin-comics-total"],
    queryFn: async () => await getAdminComics({ page: 1, pageSize: 1 }),
  });

  const { data: pendingData } = useQuery<ApiResult<Paginated<AdminComic>>>({
    queryKey: ["admin-comics-pending"],
    queryFn: async () =>
      await getAdminComics({ status: "pending", page: 1, pageSize: 1 }),
  });

  const { data: flaggedData } = useQuery<ApiResult<Paginated<AdminComic>>>({
    queryKey: ["admin-comics-flagged"],
    queryFn: async () =>
      await getAdminComics({ status: "flagged", page: 1, pageSize: 1 }),
  });

  const totalComics = totalData?.data?.pagination?.total ?? 0;
  const pendingCount = pendingData?.data?.pagination?.total ?? 0;
  const flaggedCount = flaggedData?.data?.pagination?.total ?? 0;
  const totalViews = comics.reduce(
    (sum, comic) => sum + (comic.views ?? 0),
    0,
  );

  const handleModeration = async (comicId: string, status: string) => {
    setActionComicId(comicId);
    const result = await updateAdminComicStatus(comicId, { status });
    if (result?.success === false) {
      toast.error(result?.message || "Failed to update comic status.");
    } else {
      toast.success("Comic status updated.");
      await refetch();
    }
    setActionComicId(null);
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || isFailed) {
    return (
      <div className="p-8">
        <h1 className="text-3xl text-white mb-2">Comics & Content Management</h1>
        <p className="text-red-500">Failed to load comics.</p>
      </div>
    );
  }
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl text-white mb-2">Comics & Content Management</h1>
        <p className="text-[#9CA3AF]">Review, moderate, and manage comic content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
          <CardContent className="p-6">
            <p className="text-[#9CA3AF] text-sm mb-1">Total Comics</p>
            <p className="text-2xl text-white">{totalComics.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
          <CardContent className="p-6">
            <p className="text-[#9CA3AF] text-sm mb-1">Pending Review</p>
            <p className="text-2xl text-white">{pendingCount.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
          <CardContent className="p-6">
            <p className="text-[#9CA3AF] text-sm mb-1">Flagged Content</p>
            <p className="text-2xl text-white">{flaggedCount.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
          <CardContent className="p-6">
            <p className="text-[#9CA3AF] text-sm mb-1">Views (Current)</p>
            <p className="text-2xl text-white">{totalViews.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-[#121218] border border-[rgba(139,92,246,0.15)]">
          <TabsTrigger value="pending" className="data-[state=active]:bg-[#8B5CF6]">
            Pending Review
          </TabsTrigger>
          <TabsTrigger value="published" className="data-[state=active]:bg-[#8B5CF6]">
            Published
          </TabsTrigger>
          <TabsTrigger value="flagged" className="data-[state=active]:bg-[#8B5CF6]">
            Flagged
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
            <CardHeader>
              <CardTitle className="text-white">Comics Awaiting Moderation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {comics.length === 0 ? (
                  <div className="text-center py-10 text-[#9CA3AF]">
                    No pending comics to review.
                  </div>
                ) : (
                  comics.map((comic) => {
                    const submitted = comic.submitted
                      ? new Date(comic.submitted).toLocaleDateString()
                      : "-";
                    const previewUrl = comic.slug ? `/preview/${comic.slug}` : "";
                    return (
                      <div
                        key={comic.id}
                        className="flex items-center justify-between p-4 bg-[#1A1A24] rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-20 bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] rounded" />
                          <div>
                            <h3 className="text-white mb-1">{comic.title}</h3>
                            <p className="text-sm text-[#9CA3AF]">
                              by {comic.creator || "Unknown"} -{" "}
                              {comic.chapters ?? 0} chapters - {comic.genre || "-"}
                            </p>
                            <p className="text-xs text-[#9CA3AF] mt-1">
                              Submitted: {submitted}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {previewUrl ? (
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="border-[rgba(139,92,246,0.15)] text-[#D1D5DB]"
                            >
                              <Link href={previewUrl} target="_blank" rel="noreferrer">
                                <Eye size={16} className="mr-2" />
                                Review
                              </Link>
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled
                              className="border-[rgba(139,92,246,0.15)] text-[#D1D5DB]"
                            >
                              <Eye size={16} className="mr-2" />
                              Review
                            </Button>
                          )}
                          <Button
                            size="sm"
                            className="bg-[#10B981] hover:bg-[#059669] text-white"
                            disabled={actionComicId === comic.id}
                            onClick={() => handleModeration(comic.id, "published")}
                          >
                            <Check size={16} className="mr-2" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10"
                            disabled={actionComicId === comic.id}
                            onClick={() => handleModeration(comic.id, "flagged")}
                          >
                            <X size={16} className="mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-[#9CA3AF]">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="border-[rgba(139,92,246,0.15)] text-[#D1D5DB]"
                    disabled={page <= 1}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[rgba(139,92,246,0.15)] text-[#D1D5DB]"
                    disabled={page >= totalPages}
                    onClick={() =>
                      setPage((prev) => Math.min(totalPages, prev + 1))
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="published">
          <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
            <CardHeader>
              <CardTitle className="text-white">Published Comics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {comics.length === 0 ? (
                  <div className="text-center py-10 text-[#9CA3AF]">
                    No published comics found.
                  </div>
                ) : (
                  comics.map((comic) => (
                    (() => {
                      const previewUrl = comic.slug
                        ? `/preview/${comic.slug}`
                        : "";
                      return (
                        <div
                          key={comic.id}
                          className="flex items-center justify-between p-4 bg-[#1A1A24] rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-20 bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] rounded" />
                            <div>
                              <h3 className="text-white mb-1">{comic.title}</h3>
                              <p className="text-sm text-[#9CA3AF]">
                                by {comic.creator || "Unknown"}
                              </p>
                              <div className="flex gap-4 mt-2 text-xs text-[#9CA3AF]">
                                <span>
                                  {Number(comic.views ?? 0).toLocaleString()} views
                                </span>
                                <span>
                                  {Number(comic.sales ?? 0).toLocaleString()} sales
                                </span>
                                <span>
                                  ${Number(comic.revenue ?? 0).toLocaleString()} revenue
                                </span>
                              </div>
                            </div>
                          </div>
                          {previewUrl ? (
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="border-[rgba(139,92,246,0.15)] text-[#D1D5DB]"
                            >
                              <Link href={previewUrl} target="_blank" rel="noreferrer">
                                <Eye size={16} className="mr-2" />
                                Review
                              </Link>
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled
                              className="border-[rgba(139,92,246,0.15)] text-[#D1D5DB]"
                            >
                              <Eye size={16} className="mr-2" />
                              Review
                            </Button>
                          )}
                        </div>
                      );
                    })()
                  ))
                )}
              </div>
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-[#9CA3AF]">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="border-[rgba(139,92,246,0.15)] text-[#D1D5DB]"
                    disabled={page <= 1}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[rgba(139,92,246,0.15)] text-[#D1D5DB]"
                    disabled={page >= totalPages}
                    onClick={() =>
                      setPage((prev) => Math.min(totalPages, prev + 1))
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flagged">
          <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
            <CardHeader>
              <CardTitle className="text-white">Flagged Content</CardTitle>
            </CardHeader>
            <CardContent>
              {comics.length === 0 ? (
                <div className="text-center py-12">
                  <Flag size={48} className="mx-auto text-[#9CA3AF] mb-4" />
                  <p className="text-[#9CA3AF]">No flagged content to review</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {comics.map((comic) => (
                    (() => {
                      const previewUrl = comic.slug
                        ? `/preview/${comic.slug}`
                        : "";
                      return (
                        <div
                          key={comic.id}
                          className="flex items-center justify-between p-4 bg-[#1A1A24] rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-20 bg-gradient-to-br from-[#EF4444] to-[#F59E0B] rounded" />
                            <div>
                              <h3 className="text-white mb-1">{comic.title}</h3>
                              <p className="text-sm text-[#9CA3AF]">
                                by {comic.creator || "Unknown"} - {comic.genre || "-"}
                              </p>
                              <p className="text-xs text-[#9CA3AF] mt-1">
                                Views: {Number(comic.views ?? 0).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {previewUrl ? (
                              <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="border-[rgba(139,92,246,0.15)] text-[#D1D5DB]"
                              >
                                <Link href={previewUrl} target="_blank" rel="noreferrer">
                                  <Eye size={16} className="mr-2" />
                                  Review
                                </Link>
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled
                                className="border-[rgba(139,92,246,0.15)] text-[#D1D5DB]"
                              >
                                <Eye size={16} className="mr-2" />
                                Review
                              </Button>
                            )}
                            <Button
                              size="sm"
                              className="bg-[#10B981] hover:bg-[#059669] text-white"
                              disabled={actionComicId === comic.id}
                              onClick={() => handleModeration(comic.id, "published")}
                            >
                              <Check size={16} className="mr-2" />
                              Restore
                            </Button>
                          </div>
                        </div>
                      );
                    })()
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-[#9CA3AF]">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="border-[rgba(139,92,246,0.15)] text-[#D1D5DB]"
                    disabled={page <= 1}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[rgba(139,92,246,0.15)] text-[#D1D5DB]"
                    disabled={page >= totalPages}
                    onClick={() =>
                      setPage((prev) => Math.min(totalPages, prev + 1))
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
