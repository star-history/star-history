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
  // The slogan of the sponsor logo.
  logoSlogan: string;
  // The slogan of the sponsor landing.
  landingSlogan: string;
}

// The list of current sponsors.
const sponsors: Sponsor[] = [
  // {
  //   name: "Bytebase",
  //   logo: utils.absolutifyLink("/sponsors/bytebase/logo.webp"),
  //   landingImage: utils.absolutifyLink("/sponsors/bytebase/landing.webp"),
  //   link: "https://bytebase.com?utm_source=star-history",
  //   logoSlogan:
  //     "Bytebase: Database DevOps and CI/CD for MySQL, PG, Oracle, SQL Server, Snowflake, CK, Mongo, Redis",
  //   landingSlogan:
  //     "Database DevOps and CI/CD for MySQL, PG, Oracle, SQL Server, Snowflake, CK, Mongo, Redis",
  // },
  {
    name: "Dify",
    logo: utils.absolutifyLink("/sponsors/dify/logo.webp"),
    landingImage: utils.absolutifyLink("/sponsors/dify/landing.webp"),
    link: "https://dify.ai/?utm_source=star-history",
    logoSlogan:
      "Dify: The next-gen development platform. Create Assistants API and GPTs based on any LLMs.",
    landingSlogan:
      "The next-gen development platform. Create Assistants API and GPTs based on any LLMs.",
  },
];

export const randomSponsors = sampleSize(sponsors, sponsors.length);
