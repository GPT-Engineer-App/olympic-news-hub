import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Flame } from "lucide-react";

const fetchOlympicsNews = async () => {
  // In a real app, this would be an API call
  return [
    { id: 1, title: "Opening Ceremony Dazzles Spectators", content: "The Olympics kicked off with a spectacular show...", category: "General" },
    { id: 2, title: "New World Record in Swimming", content: "Athlete breaks 100m freestyle record...", category: "Swimming" },
    { id: 3, title: "Unexpected Victory in Gymnastics", content: "Underdog gymnast takes gold in all-around...", category: "Gymnastics" },
    { id: 4, title: "Controversy in Boxing Match", content: "Judges' decision sparks debate...", category: "Boxing" },
    { id: 5, title: "Track and Field Highlights", content: "Day 3 sees multiple personal bests...", category: "Athletics" },
  ];
};

const NewsCard = ({ title, content }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription>{content}</CardDescription>
    </CardContent>
  </Card>
);

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: news, isLoading, error } = useQuery({
    queryKey: ['olympicsNews'],
    queryFn: fetchOlympicsNews
  });

  if (isLoading) return <div className="text-center mt-8">Loading news...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error fetching news</div>;

  const categories = ["All", ...new Set(news.map(item => item.category))];
  const filteredNews = activeCategory === "All" ? news : news.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center justify-center">
          <Flame className="mr-2 text-red-500" />
          Olympics News Tracker
        </h1>
        <p className="text-xl text-gray-600">Stay updated with the latest Olympic events</p>
      </header>

      <Tabs defaultValue="All" className="w-full max-w-4xl mx-auto">
        <TabsList className="mb-4">
          {categories.map(category => (
            <TabsTrigger
              key={category}
              value={category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory}>
          <ScrollArea className="h-[600px] w-full rounded-md border p-4">
            {filteredNews.map(item => (
              <NewsCard key={item.id} title={item.title} content={item.content} />
            ))}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
