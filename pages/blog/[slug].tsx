import { useRouter } from 'next/router';
import { FC } from 'react';

const SingleBlog: FC = () => {
  const router = useRouter ()
  const slug = router.query.slug||"" 
  console.log (slug)
  return (
    <div className="relative w-full h-auto min-h-screen overflow-auto flex flex-col justify-center items-center">
      <p>Hello World {slug}</p>
    </div>
  );
};

export default SingleBlog;