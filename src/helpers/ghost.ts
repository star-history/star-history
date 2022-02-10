import axios from "axios";
import GhostContentAPI, { Params, PostOrPage } from "@tryghost/content-api";

// Create API instance with site credentials
const ghostContentAPI = new GhostContentAPI({
  url: "https://bytebase.ghost.io",
  key: "f3ffa1aa4e40b7999486ef97e5",
  version: "v3",
});

export async function getPosts(
  tagList?: string[],
  page?: number
): Promise<PostOrPage[]> {
  const params: Params = {
    limit: "all",
    include: ["tags", "authors"],
    order: "published_at DESC",
  };

  if (tagList && tagList.length > 0) {
    params.filter = `tag:[${tagList.join(", ")}]`;
  }

  if (page) {
    params.page = page;
  }

  return await ghostContentAPI.posts.browse(params).catch((err) => {
    console.error(err);
    throw err;
  });
}

export async function getPostDetailBySlug(
  postSlug: string
): Promise<PostOrPage> {
  return await ghostContentAPI.posts
    .read(
      {
        slug: postSlug,
      },
      {
        include: ["tags", "authors"],
      }
    )
    .catch((err) => {
      console.error(err);
      throw err;
    });
}

export async function subscribeBlog(email: string) {
  return axios.post(
    "https://newsletter.bytebase.com/members/api/send-magic-link/",
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        name: "",
        requestSrc: "bytebase.com",
      }),
    }
  );
}
