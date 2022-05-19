import axios from "axios";

// TODO(Steven): This is also a service from Ghost, need to remove it later.
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
