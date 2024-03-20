import React, { useState } from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import HighlightBlogSection from "../components/HighlightBlogSection"
import SponsorBanner from "../components/SponsorStaticBanner"
import RepoInputer from "../components/RepoInputer"
import { AppStateProvider } from "../store"
import type { NextPage } from "next"
import StarChartViewer from "../components/StarChartViewer"
import Head from "next/head"

interface IndexProps {}

const Index: NextPage<IndexProps> = () => {
    const [isChartVisible, setChartVisibility] = useState(false) // Start with false since chart is not visible by default

    const metadata = {
		title:       "GitHub Star History",
		description: "View and compare GitHub star history graph of open source projects.",
		imageURL:    "https://www.star-history.com/assets/star-history.webp",
	}

    return (
        <>
            <Head>
                <title>{metadata.title}</title>
                <meta name="description" content="GitHub Star History" />

                {/* Standard Meta Tags */}
                <meta name="description" content={metadata.description} />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={metadata.title} />
                <meta property="og:description" content={metadata.description} />
                <meta property="og:image" content={metadata.imageURL} />

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:card" content={metadata.imageURL} />
                <meta property="twitter:title" content={metadata.title} />
                <meta property="twitter:description" content={metadata.description} />
                <meta property="twitter:image" content={metadata.imageURL} />
            </Head>
            <section>
                <AppStateProvider>
                    <div className="relative w-full h-auto min-h-screen overflow-auto flex flex-col">
                        <Header />
                        <div className="w-full h-auto grow lg:grid lg:grid-cols-[256px_1fr_256px]">
                            <div className="w-full hidden lg:block">
                                <HighlightBlogSection />
                            </div>
                            <div className="w-full flex flex-col justify-start items-center">
                                <RepoInputer isChartVisible={isChartVisible} setChartVisibility={setChartVisibility} />
                                {isChartVisible && <StarChartViewer />}
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
                                            backgroundColor: "transparent"
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
    )
}

export default Index
