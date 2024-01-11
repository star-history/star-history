import React, { useState } from "react";
import Layout from "../components/layout";
import Header from "../components/header";
import Footer from "../components/footer";
import HighlightBlogSection from "../components/HighlightBlogSection";
import SponsorBanner from "../components/SponsorStaticBanner";
import RepoInputer from "../components/RepoInputer";
import { AppStateProvider } from "../store";
import type { NextPage } from "next";
import { ReactElement, ReactNode } from "react";
import StarChartViewer from "../components/StarChartViewer";

interface IndexProps {
  // Add any additional props here
}

const Index: NextPage<IndexProps> = () => {
  const [isChartVisible, setChartVisibility] = useState(true);

  const handleClickLink = (link: string) => {
    // Handle the click event here
    console.log(`Link clicked: ${link}`);
  };

  return (
    <section>
      <AppStateProvider>
        <div className="relative w-full h-auto min-h-screen overflow-auto flex flex-col">
          <Header />
          <div className="w-full h-auto grow lg:grid lg:grid-cols-[256px_1fr_256px]">
            <div className="w-full hidden lg:block">
              <HighlightBlogSection
                clickLink={(link) => console.log(`Link clicked: ${link}`)}
              />
            </div>
            <div className="w-full flex flex-col justify-start items-center">
              <RepoInputer
                isChartVisible={isChartVisible}
                setChartVisibility={setChartVisibility}
              />
              {isChartVisible && <StarChartViewer />}
            </div>
            <div className="hidden lg:block"></div>
          </div>
          <Footer />
          <SponsorBanner />
        </div>
      </AppStateProvider>
    </section>
  );
};

export default Index;