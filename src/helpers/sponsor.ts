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
    logo: utils.absolutifyLink("/sponsors/bytebase/logo.png"),
    landingImage: utils.absolutifyLink("/sponsors/bytebase/landing.webp"),
    link: "https://bytebase.com?source=star-history",
    slogan:
      "Database DevOps and CI/CD for MySQL, PG, ClickHouse, Snowflake, TiDB, MongoDB and Spanner",
  },
];

export const randomSponsors = sampleSize(sponsors, sponsors.length);
