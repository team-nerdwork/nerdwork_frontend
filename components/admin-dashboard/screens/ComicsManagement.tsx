"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Eye, Flag, Check, X } from "lucide-react";

const pendingComics = [
  {
    id: "COM001",
    title: "Cyber Legends Vol. 1",
    creator: "CryptoArtist",
    submitted: "2024-01-15",
    pages: 24,
    genre: "Sci-Fi",
  },
  {
    id: "COM002",
    title: "Neon Dreams",
    creator: "DigitalDreamer",
    submitted: "2024-01-16",
    pages: 18,
    genre: "Cyberpunk",
  },
];

const publishedComics = [
  {
    id: "COM010",
    title: "Cosmic Warriors",
    creator: "PixelMaster",
    published: "2023-12-10",
    views: 15420,
    sales: 234,
    rating: 4.8,
  },
  {
    id: "COM011",
    title: "Dark City Chronicles",
    creator: "NeonNinja",
    published: "2023-12-05",
    views: 12890,
    sales: 189,
    rating: 4.6,
  },
];

export function ComicsManagement() {
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
            <p className="text-2xl text-white">8,456</p>
          </CardContent>
        </Card>
        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
          <CardContent className="p-6">
            <p className="text-[#9CA3AF] text-sm mb-1">Pending Review</p>
            <p className="text-2xl text-white">23</p>
          </CardContent>
        </Card>
        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
          <CardContent className="p-6">
            <p className="text-[#9CA3AF] text-sm mb-1">Flagged Content</p>
            <p className="text-2xl text-white">7</p>
          </CardContent>
        </Card>
        <Card className="bg-[#121218] border-[rgba(139,92,246,0.15)]">
          <CardContent className="p-6">
            <p className="text-[#9CA3AF] text-sm mb-1">Views (30d)</p>
            <p className="text-2xl text-white">1.2M</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
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
                {pendingComics.map((comic) => (
                  <div
                    key={comic.id}
                    className="flex items-center justify-between p-4 bg-[#1A1A24] rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-20 bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] rounded" />
                      <div>
                        <h3 className="text-white mb-1">{comic.title}</h3>
                        <p className="text-sm text-[#9CA3AF]">
                          by {comic.creator} - {comic.pages} pages - {comic.genre}
                        </p>
                        <p className="text-xs text-[#9CA3AF] mt-1">
                          Submitted: {comic.submitted}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[rgba(139,92,246,0.15)] text-[#D1D5DB]"
                      >
                        <Eye size={16} className="mr-2" />
                        Review
                      </Button>
                      <Button
                        size="sm"
                        className="bg-[#10B981] hover:bg-[#059669] text-white"
                      >
                        <Check size={16} className="mr-2" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10"
                      >
                        <X size={16} className="mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
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
                {publishedComics.map((comic) => (
                  <div
                    key={comic.id}
                    className="flex items-center justify-between p-4 bg-[#1A1A24] rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-20 bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] rounded" />
                      <div>
                        <h3 className="text-white mb-1">{comic.title}</h3>
                        <p className="text-sm text-[#9CA3AF]">by {comic.creator}</p>
                        <div className="flex gap-4 mt-2 text-xs text-[#9CA3AF]">
                          <span>{comic.views.toLocaleString()} views</span>
                          <span>{comic.sales} sales</span>
                          <span>Rating {comic.rating}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[rgba(139,92,246,0.15)] text-[#D1D5DB]"
                    >
                      Manage
                    </Button>
                  </div>
                ))}
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
              <div className="text-center py-12">
                <Flag size={48} className="mx-auto text-[#9CA3AF] mb-4" />
                <p className="text-[#9CA3AF]">No flagged content to review</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
