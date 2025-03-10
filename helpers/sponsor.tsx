import { sampleSize } from "lodash"
import utils from "../common/utils"

interface Sponsor {
    // The name of the sponsor
    name: string
    // The logo of the sponsor and will be displayed in the right side section.
    logo: string
    // The landing image of the sponsor and will be displayed in the bottom side section.
    landingImage: string
    // The link of the sponsor.
    link: string
    // The slogan of the sponsor logo.
    logoSlogan: string
    // The slogan of the sponsor landing.
    landingSlogan: string
}

// The list of current sponsors.
const sponsors: Sponsor[] = [
    {
      name: "Bytebase",
      logo: utils.absolutifyLink("/assets/sponsors/bytebase/logo.webp"),
      landingImage: utils.absolutifyLink("/assets/sponsors/bytebase/landing.webp"),
      link: "https://bytebase.com?utm_source=star-history",
      logoSlogan:
        "Bytebase: Database DevOps and CI/CD for MySQL, PG, Oracle, SQL Server, Snowflake, ClickHouse, Mongo, Redis",
      landingSlogan:
        "Database DevOps and CI/CD for MySQL, PG, Oracle, SQL Server, Snowflake, ClickHouse, Mongo, Redis",
    },
    {
        name: "Dify",
        logo: utils.absolutifyLink("/assets/sponsors/dify/logo.webp"),
        landingImage: utils.absolutifyLink("/assets/sponsors/dify/landing.webp"),
        link: "https://dify.ai/?utm_source=star-history",
        logoSlogan: "Dify: Open-source platform for building LLM apps, from agents to AI workflows.",
        landingSlogan: "Open-source platform for building LLM apps, from agents to AI workflows."
    },
]

export const randomSponsors = sampleSize(sponsors, sponsors.length)
