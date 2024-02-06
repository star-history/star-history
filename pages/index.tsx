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
import Head from "next/head";

interface IndexProps {}

const Index: NextPage<IndexProps> = () => {
  const [isChartVisible, setChartVisibility] = useState(true);

  const handleClickLink = (link: string) => {
    console.log(`Link clicked: ${link}`);
  };

  return (
    <>
      <Head>
        <title>GitHub Star History</title>
      </Head>
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
              <div className="w-full flex flex-col h-full justify-start items-center">
                <RepoInputer
                  isChartVisible={isChartVisible}
                  setChartVisibility={setChartVisibility}
                />
                {isChartVisible && <StarChartViewer />}
                <div className="flex-grow"></div>
                <div className="flex justify-center mb-12">
                  <iframe
                    src="https://embeds.beehiiv.com/2803dbaa-d8dd-4486-8880-4b843f3a7da6?slim=true"
                    data-test-id="beehiiv-embed"
                    height="52"
                    frameBorder="0"
                    scrolling="no"
                    style={{
                      margin: 0,
                      borderRadius: 0,
                      backgroundColor: "transparent",
                    }}
                  ></iframe>
                </div>
              </div>

              <div className="hidden lg:block"></div>
            </div>

            <Footer />
            <SponsorBanner />
          </div>
        </AppStateProvider>
      </section>
    </>
  );
};

export default Index;
