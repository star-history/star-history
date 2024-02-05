import { useRouter } from "next/router";
import { NextPage } from "next";
import { AppProps } from "next/app";
import "../global.css";
import Home from "../pages/index";
import NotFound from "../pages/404";
import Blog from "./blog/";
import '@fortawesome/fontawesome-free/css/all.css';
import Head from "next/head";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const routes = {
  "/": Home,
  "/blog": Blog,
};

const Router = ({ Component, pageProps }: AppPropsWithLayout) => {
  const router = useRouter();
  const { pathname } = router;
  const ComponentToRender = routes[pathname as keyof typeof routes] || NotFound;

  return <ComponentToRender {...pageProps} />;
};

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {getLayout(<Component {...pageProps} />)}
    </>
  );
};

export default MyApp;
