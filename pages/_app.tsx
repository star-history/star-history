import { useRouter } from "next/router";
import { NextPage, NextPageContext } from "next";
import { AppProps } from "next/app";
import "../global.css";
import Home from "../pages/index";
import NotFound from "../pages/404";
import About from "./about";
import Test from "./test";
import Blog from "./Blog";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const routes = {
  "/": Home,
  "/about": About,
  "/test": Test,
  "/blog": Blog,
};

const Router = (pageProps: any) => {
  const router = useRouter();
  const { pathname } = router;
  const Component = routes[("/" + pathname) as keyof typeof routes] || NotFound;
  return <Component {...pageProps} />;
};

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  return getLayout(<Component {...pageProps} />);
};

export default MyApp;
