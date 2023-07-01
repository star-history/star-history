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
      "Database DevOps and CI/CD for MySQL, PG, ClickHouse, Snowflake, TiDB, MongoDB and more",
  },
  {
    name: "Ockam",
    logo: utils.absolutifyLink("/sponsors/ockam/logo.webp"),
    landingImage: utils.absolutifyLink("/sponsors/ockam/landing.webp"),
    link: "https://github.com/build-trust/ockam?utm_source=starhistory",
    slogan:
      "End-to-end encryption and authentication for data-in-motion between distributed applications",
  },
  {
    name: "Dify",
    logo: utils.absolutifyLink("/sponsors/dify/logo.webp"),
    landingImage: utils.absolutifyLink("/sponsors/dify/landing.webp"),
    link: "https://dify.ai/?utm_source=star-history",
    slogan:
      "Create an AI app in minutes and integrate LLM into your app for continuous improvement",
  },
  // {
  //   name: "Selefra",
  //   logo: utils.absolutifyLink("/sponsors/selefra/logo.webp"),
  //   landingImage: utils.absolutifyLink("/sponsors/selefra/landing.webp"),
  //   link: "https://github.com/selefra/selefra?utm_source=starhistory",
  //   slogan:
  //     "Policy-as-Code analysis for Multi-Cloud and SaaS environments, AWS/GCP/Azure, k8s, GitHub, etc.",
  // },
];

export const randomSponsors = sampleSize(sponsors, sponsors.length);
