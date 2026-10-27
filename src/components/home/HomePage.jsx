import React from "react";
import { HeroBannerSlider } from "./HeroBannerSlider";
import { FlashDealsSection } from "./FlashDealsSection";
import { CategoryGrid } from "./CategoryGrid";
import { BestSellersTabs } from "./BestSellersTabs";
import { PromoBanners } from "./PromoBanners";
import { BrandCarousel } from "./BrandCarousel";
import { RecommendationsSection } from "./RecommendationsSection";
import { RecentlyViewedSection } from "./RecentlyViewedSection";

export const HomePage = () => {
  return (
    <div className="space-y-4 pb-12">
      <HeroBannerSlider />
      <FlashDealsSection />
      <CategoryGrid />
      <BestSellersTabs />
      <PromoBanners />
      <RecommendationsSection />
      <BrandCarousel />
      <RecentlyViewedSection />
    </div>
  );
};
