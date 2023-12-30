
import React from 'react';

interface BlogLink {
  title: string;
  path: string;
}

interface BlogSection {
  title: string;
  linkList: BlogLink[];
}

interface HighlightBlogSectionProps {
  blogSectionList: BlogSection[];
  clickLink: (link: string) => void;
}

const blogSectionList: BlogSection[] = [
  {
    title: "Playbook",
    linkList: [
      {
        title: "📕 How to Use this Site",
        path: "/blog/how-to-use-github-star-history",
      },
      {
        title: "⭐️ How to Get More Stars",
        path: "/blog/playbook-for-more-github-stars",
      },
    ],
  },
  {
    title: "AI Collections",
    linkList: [
      {
        title: "Infra",
        path: "https://star-history.com/blog/open-source-ai-infra-projects",
      },
      {
        title: "Model",
        path: "https://star-history.com/#CompVis/stable-diffusion&lllyasviel/ControlNet&openai/whisper&facebookresearch/llama&databrickslabs/dolly&tatsu-lab/stanford_alpaca&nomic-ai/gpt4all&Stability-AI/StableLM",
      },
      {
        title: "Llama Ecosystem",
        path: "https://star-history.com/blog/llama2",
      },
      {
        title: "GPT Ecosystem",
        path: "https://star-history.com/blog/star-history-monthly-pick-202303",
      },
      {
        title: "Coding Assistant",
        path: "https://star-history.com/blog/coding-ai",
      },
    ],
  },
  {
    title: "Developer Collections",
    linkList: [
      {
        title: "Database DevOps",
        path: "https://star-history.com/#bytebase/bytebase&liquibase/liquibase&flyway/flyway",
      },
      {
        title: "Workflow Orchestration",
        path: "https://star-history.com/#temporalio/temporal&apache/dolphinscheduler&apache/airflow&quartz-scheduler/quartz&netflix/conductor",
      },
    ],
  },
  {
    title: "Monthly Pick",
    linkList: [
      {
        title: "2023 Nov (TTS)",
        path: "https://star-history.com/blog/tts",
      },
      {
        title: "2023 Oct (AI for Postgres)",
        path: "https://star-history.com/blog/ai-for-postgres",
      },
      {
        title: "2023 Sept (Coding AI)",
        path: "https://star-history.com/blog/coding-ai",
      },
      {
        title: "2023 Aug (CLI tool for LLMs)",
        path: "https://star-history.com/blog/cli-tool-for-llm",
      },
      {
        title: "2023 July (Llama 2 Edition)",
        path: "https://star-history.com/blog/llama2",
      },
      {
        title: "2023 June",
        path: "https://star-history.com/blog/star-history-monthly-pick-202306",
      },
      {
        title: "2023 May",
        path: "https://star-history.com/blog/star-history-monthly-pick-202305",
      },
      {
        title: "2023 Apr",
        path: "https://star-history.com/blog/star-history-monthly-pick-202304",
      },
      {
        title: "2023 Mar (ChatGPT Edition)",
        path: "https://star-history.com/blog/star-history-monthly-pick-202303",
      },
      {
        title: "2023 Feb",
        path: "https://star-history.com/blog/star-history-monthly-pick-202302",
      },
      {
        title: "2023 Jan",
        path: "https://star-history.com/blog/star-history-monthly-pick-202301",
      },
      {
        title: "2022 Dec",
        path: "https://star-history.com/blog/star-history-monthly-pick-202212",
      },
    ],
  },
  {
    title: "Best of 2022",
    linkList: [
      {
        title: "Data, Infra & DevTools",
        path: "https://star-history.com/blog/star-history-yearly-pick-2022-data-infra-devtools",
      },
      {
        title: "Platform Engineering",
        path: "https://star-history.com/blog/star-history-open-source-2022-platform-engineering",
      },
      {
        title: "Open-Source Alternatives",
        path: "https://star-history.com/blog/star-history-open-source-2022-open-source-alternatives",
      },
      {
        title: "Front-end",
        path: "https://star-history.com/blog/star-history-yearly-pick-2022-frontend",
      },
    ],
  },
  {
    title: "Starlet List",
    linkList: [
      {
        title: "Prompt yours for FREE ⭐️",
        path: "/blog/list-your-open-source-project",
      },
      {
        title: "Issue #14 - Proton",
        path: "/blog/proton",
      },
      {
        title: "Issue #13 - Earthly",
        path: "/blog/earthly",
      },
      {
        title: "Issue #12 - Wasp",
        path: "/blog/wasp",
      },
      {
        title: "Issue #11 - libSQL",
        path: "/blog/libsql",
      },
      {
        title: "Issue #10 - PostgresML",
        path: "/blog/postgresml",
      },
      {
        title: "Issue #9 - ElectricSQL",
        path: "/blog/electricsql",
      },
      {
        title: "Issue #8 - Prompt flow",
        path: "/blog/prompt-flow",
      },
      {
        title: "Issue #7 - Clipboard",
        path: "/blog/clipboard",
      },
      {
        title: "Issue #6 - Hoppscotch",
        path: "/blog/hoppscotch",
      },
      {
        title: "Issue #5 - MetisFL",
        path: "/blog/metisfl",
      },
      {
        title: "Issue #4 - chatgpt.js",
        path: "/blog/chatgpt-js",
      },
      {
        title: "Issue #3 - Mockoon",
        path: "/blog/mockoon",
      },
      {
        title: "Issue #2 - DLTA-AI",
        path: "/blog/dlta-ai",
      },
      {
        title: "Issue #1 - Sniffnet",
        path: "/blog/sniffnet",
      },
    ],
  },
];

const HighlightBlogSection: React.FC<Omit<HighlightBlogSectionProps, 'blogSectionList'>> = ({ clickLink }) => {
  return (
    <div className="flex flex-col justify-start items-start w-full mt-12 p-4 pl-8">
      {blogSectionList.map((section) => (
        <div key={section.title}>
          <div className="w-full flex flex-row justify-between items-center my-2">
            <h3 className="text-sm font-medium text-gray-400 leading-6">
              {section.title}
            </h3>
          </div>
          <ul className="list-disc list-inside">
            {section.linkList.map((blog) => (
              <li
                key={blog.title}
                className="mb-2 leading-3 cursor-pointer"
                onClick={() => clickLink(blog.path)}
              >
                <span className="inline -ml-2 text-sm text-blue-700 hover:underline">
                  {blog.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
export default HighlightBlogSection;
