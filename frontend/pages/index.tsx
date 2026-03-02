import React, { useState } from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import LeftSidebar from "../components/LeftSidebar"
import RightSidebar from "../components/RightSidebar"
import RepoInputer from "../components/RepoInputer"
import type { NextPage } from "next"
import StarChartViewer from "../components/StarChartViewer"
import Head from "next/head"
import { SITE_URL } from "../helpers/consts"

const Index: NextPage = () => {
    const [isChartVisible, setChartVisibility] = useState(false) // Start with false since chart is not visible by default

    const metadata = {
		title:       "GitHub Star History",
		description: "View and compare GitHub star history graph of open source projects.",
		imageURL:    `${SITE_URL}/assets/star-history-preview.webp`,
	}

    return (
        <>
            <Head>
                <title>{metadata.title}</title>
                <meta name="description" content={metadata.description} />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content={SITE_URL} />
                <meta property="og:title" content={metadata.title} />
                <meta property="og:description" content={metadata.description} />
                <meta property="og:image" content={metadata.imageURL} />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={SITE_URL} />
                <meta name="twitter:title" content={metadata.title} />
                <meta name="twitter:description" content={metadata.description} />
                <meta name="twitter:image" content={metadata.imageURL} />
            </Head>
            <div className="relative w-full h-auto min-h-screen flex flex-col overflow-x-hidden">
                <Header />
                <div className="w-full h-auto grow flex flex-row justify-center">
                    <div className="w-full px-4 h-auto grow lg:grid lg:grid-cols-[1fr_288px] xl:grid-cols-[240px_1fr_288px] lg:gap-8 xl:gap-24">
                        <div className="hidden xl:block">
                            <LeftSidebar />
                        </div>

                        <div className="w-full flex flex-col justify-start">
                            <RepoInputer isChartVisible={isChartVisible} setChartVisibility={setChartVisibility} />
                            {isChartVisible && <StarChartViewer />}
                        </div>

                        <div className="hidden lg:block">
                            <RightSidebar />
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    )
}

export default Index
