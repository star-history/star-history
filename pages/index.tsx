import type { NextPageWithLayout } from './_app'
import Layout from '../components/layout'
import Header from '../components/header'
import Footer from '../components/footer'
import HighlightBlogSection from '../components/HighlightBlogSection';
import SponsorBanner from '../components/SponsorStaticBanner';


const Index: NextPageWithLayout = () => {
  return (
    <section>
 
    </section>
  )
}

export default Index

Index.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>
      <Header />
      <HighlightBlogSection />
      <SponsorBanner />
      <Footer />
      {page}
    </Layout>
  )
}
