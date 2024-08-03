import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Flame } from "lucide-react";

const API_KEY = 'YOUR_NEWS_API_KEY'; // Replace with your actual NewsAPI key
const API_URL = 'https://newsapi.org/v2/everything';

const fetchOlympicsNews = async () => {
  const response = await axios.get(API_URL, {
    params: {
      q: 'Olympics',
      apiKey: API_KEY,
      language: 'en',
      sortBy: 'publishedAt',
    },
  });
  return response.data.articles.map((article, index) => ({
    id: index,
    title: article.title,
    content: article.description,
    category: article.source.name,
    url: article.url,
  }));
};

const NewsCard = ({ title, content, url }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          {title}
        </a>
      </CardTitle>
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

  const [categories, setCategories] = useState(["All"]);

  useEffect(() => {
    if (news) {
      const newCategories = ["All", ...new Set(news.map(item => item.category))];
      setCategories(newCategories);
    }
  }, [news]);

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
              <NewsCard key={item.id} title={item.title} content={item.content} url={item.url} />
            ))}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
