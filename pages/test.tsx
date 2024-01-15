import { NextPage } from 'next'
import React from 'react'
import { NextPageWithLayout } from './_app'
import Layout from '@components/layout';


const Test: NextPageWithLayout = () => {
   return (
       <div>BlogList</div>
   );
}

export default Test


Test.getLayout = function getLayout(page: React.ReactElement) {
    return (
      <Layout>
    
        {page}
      </Layout>
    )
  }
  