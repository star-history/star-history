import { sampleSize } from "lodash";
import utils from "../../common/utils";

interface Sponsor {
  // The name of the sponsor
  name: string;
  // The logo of the sponsor and will be displayed in the right side section.
  logo: string;
  // The landing image of the sponsor and will be displayed in the bottom side section.
  landingImage: string;
  // The link of the sponsor.
  link: string;
  // The slogan of the sponsor.
  slogan: string;
}

// The list of current sponsors.
const sponsors: Sponsor[] = [
  {
    name: "Bytebase",
    logo: utils.absolutifyLink("/sponsors/bytebase/logo.webp"),
    landingImage: utils.absolutifyLink("/sponsors/bytebase/landing.webp"),
    link: "https://bytebase.com?utm_source=star-history",
    slogan:
      "Database DevOps and CI/CD for MySQL, PG, Oracle, SQL Server, Snowflake, CK, Mongo, Redis",
  },
  // {
  //   name: "Ockam",
  //   logo: utils.absolutifyLink("/sponsors/ockam/logo.webp"),
  //   landingImage: utils.absolutifyLink("/sponsors/ockam/landing.webp"),
  //   link: "https://github.com/build-trust/ockam?utm_source=starhistory",
  //   slogan:
  //     "End-to-end encryption and authentication for data-in-motion between distributed applications",
  // },
  {
    name: "Dify",
    logo: utils.absolutifyLink("/sponsors/dify/logo.webp"),
    landingImage: utils.absolutifyLink("/sponsors/dify/landing.webp"),
    link: "https://dify.ai/?utm_source=star-history",
    slogan:
      "The next-gen development platform. Create Assistants API and GPTs based on any LLMs.",
  },
  // {
  //   name: "Selefra",
  //   logo: utils.absolutifyLink("/sponsors/selefra/logo.webp"),
  //   landingImage: utils.absolutifyLink("/sponsors/selefra/landing.webp"),
  //   link: "https://github.com/selefra/selefra?utm_source=starhistory",
  //   slogan:
  //     "Policy-as-Code analysis for Multi-Cloud and SaaS environments, AWS/GCP/Azure, k8s, GitHub, etc.",
  // },
  {
    name: "GPTBots",
    logo: utils.absolutifyLink("/sponsors/gptbots/logo.webp"),
    landingImage: utils.absolutifyLink("/sponsors/gptbots/landing.webp"),
    link: "https://www.gptbots.ai?refer=star-history",
    slogan:
      "Seamlessly connects LLM with enterprise data and services to build usable AI Bot services for business scenarios.",
  },
];

export const randomSponsors = sampleSize(sponsors, sponsors.length);
