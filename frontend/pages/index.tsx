import React, { useState } from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import RightSidebar from "../components/RightSidebar"
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
		imageURL:    "https://star-history.com/assets/star-history.webp",
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
                <meta property="og:url" content="https://star-history.com" />
                <meta property="og:title" content={metadata.title} />
                <meta property="og:description" content={metadata.description} />
                <meta property="og:image" content={metadata.imageURL} />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content="https://star-history.com" />
                <meta name="twitter:title" content={metadata.title} />
                <meta name="twitter:description" content={metadata.description} />
                <meta name="twitter:image" content={metadata.imageURL} />
            </Head>
            <section>
                <AppStateProvider>
                    <div className="relative w-full h-auto min-h-screen flex flex-col">
                        <Header />
                        <div className="w-full h-auto grow flex flex-row justify-center">
                            <div className="w-full md:max-w-5xl lg:max-w-7xl px-0 sm:px-4 h-auto grow lg:grid lg:grid-cols-[1fr_256px]">
                                <div className="w-full flex flex-col justify-start sm:-ml-4">
                                <RepoInputer isChartVisible={isChartVisible} setChartVisibility={setChartVisibility} />
                                {isChartVisible && <StarChartViewer />}
                            </div>

                            <div className="w-full hidden lg:block sm:-mr-4">
                                <RightSidebar />
                            </div>
                            </div>
                        </div>

                        <Footer />
                    </div>
                </AppStateProvider>
            </section>
        </>
    )
}

export default Index
