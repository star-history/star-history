import { FC } from "react";
import { useRouter } from "next/router";

const SingleBlog: FC = () => {
  const router = useRouter();
  const slug = router.query.slug || "";

  // here you can use the slug to fetch the blog content and render it
  // e.g fetch(`/blog/${slug}.md`)

  return (
    <div className="relative w-full h-auto min-h-screen overflow-auto flex flex-col justify-center items-center">
      <p>Hello World {slug}</p>
    </div>
  );
};

export default SingleBlog;
