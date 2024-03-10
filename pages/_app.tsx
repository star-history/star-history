import { NextPage } from "next"
import { AppProps } from "next/app"
import "../global.css"
import "@fortawesome/fontawesome-free/css/all.css"
import Head from "next/head"

export type NextPageWithLayout = NextPage & {
    getLayout?: (_page: React.ReactElement) => React.ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
    // Use the layout defined at the page level, if available
    const getLayout = Component.getLayout ?? ((page) => page)
    return (
        <>
            <Head>
                <link rel="icon" href="/assets/favicon.ico" />
                <script defer data-domain="star-history.com" src="https://plausible.io/js/script.js"></script>
            </Head>
            {getLayout(<Component {...pageProps} />)}
        </>
    )
}

export default MyApp
