import type { NextPageWithLayout } from './_app'
import Layout from '../components/layout'
import Header from '../components/header'
const Index: NextPageWithLayout = () => {
  return (
    <section>
      <h2>Layout Example (Index)</h2>
 
    </section>
  )
}

export default Index

Index.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>
      <Header />
      {page}
    </Layout>
  )
}
