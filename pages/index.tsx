import Layout from '../components/layout'
import Header from '../components/header'
import Footer from '../components/footer'
import HighlightBlogSection from '../components/HighlightBlogSection';
import SponsorBanner from '../components/SponsorStaticBanner';
import RepoInputer from "../components/RepoInputer";
import React from 'react';
import { AppStateProvider } from '../store'
import type { NextPage } from 'next'
import { ReactElement, ReactNode } from 'react'
import StarChartViewer from "../components/StarChartViewer";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement, handleClickLink: (link: string) => void) => ReactNode
}


const Index: NextPageWithLayout = () => {
  const handleClickLink = (link: string) => {
    // Handle the click event here
    console.log(`Link clicked: ${link}`);
  };
  return (
    <section>
 
    </section>
  )
}

export default Index

Index.getLayout = function getLayout(page: React.ReactElement, handleClickLink: (link: string) => void) {
  return (
    <AppStateProvider>
      <div className="relative w-full h-auto min-h-screen overflow-auto flex flex-col">
        <Header />
        <div className="w-full h-auto grow lg:grid lg:grid-cols-[256px_1fr_256px]">
          <div className="w-full hidden lg:block">
            <HighlightBlogSection clickLink={(link) => console.log(`Link clicked: ${link}`)} />
          </div>
          <div className="w-full flex flex-col justify-start items-center">
            <RepoInputer />
      <StarChartViewer /> 
          </div>
          <div className="hidden lg:block"></div>
        </div>
        <Footer />
        <SponsorBanner />
      </div>
    </AppStateProvider>
  )
}
