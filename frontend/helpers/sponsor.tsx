import { sampleSize } from "lodash"
import utils from "../shared/common/utils"

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
    // {
    //   name: "Bytebase",
    //   logo: utils.absolutifyLink("/assets/sponsors/bytebase/logo.webp"),
    //   landingImage: utils.absolutifyLink("/assets/sponsors/bytebase/landing.webp"),
    //   link: "https://bytebase.com?utm_source=star-history",
    //   logoSlogan:
    //     "Bytebase: Database DevSecOps for MySQL, PG, Oracle, SQL Server, Snowflake, ClickHouse, Mongo, Redis",
    //   landingSlogan:
    //     "Database DevSecOps for MySQL, PG, Oracle, SQL Server, Snowflake, ClickHouse, Mongo, Redis",
    // },
    {
        name: "Dify",
        logo: utils.absolutifyLink("/assets/sponsors/dify/logo.webp"),
        landingImage: utils.absolutifyLink("/assets/sponsors/dify/landing.webp"),
        link: "https://dify.ai/?utm_source=star-history",
        logoSlogan: "Dify: Open-source platform for building LLM apps, from agents to AI workflows.",
        landingSlogan: "Open-source platform for building LLM apps, from agents to AI workflows."
    },
    // {
    //   name: "DBHub",
    //   logo: utils.absolutifyLink("/assets/sponsors/dbhub/logo.webp"),
    //   landingImage: utils.absolutifyLink("/assets/sponsors/dbhub/landing.webp"),
    //   link: "https://github.com/bytebase/dbhub/?utm_source=star-history",
    //   logoSlogan: "DBHub: Universal Database MCP Server.",
    //   landingSlogan: "Universal Database MCP Server."
    // },
    {
      name: "Parlant",
      logo: utils.absolutifyLink("/assets/sponsors/parlant/logo.webp"),
      landingImage: utils.absolutifyLink("/assets/sponsors/parlant/landing.webp"),
      link: "https://github.com/emcie-co/parlant/?utm_source=star-history",
      logoSlogan: "Parlant: The Open-Source Conversational AI Framework.",
      landingSlogan: "The Open-Source Conversational AI Framework."
    },
    {
      name: "MemU",
      logo: utils.absolutifyLink("/assets/sponsors/memu/logo.webp"),
      landingImage: utils.absolutifyLink("/assets/sponsors/memu/landing.webp"),
      link: "https://github.com/NevaMind-AI/memU/?utm_source=star-history",
      logoSlogan: "MemU: make your LLM and agent have better memory than GPT-5 and Claude.",
      landingSlogan: "Make your LLM and agent have better memory than GPT-5 and Claude."
    },
    {
      name: "pgschema",
      logo: utils.absolutifyLink("/assets/sponsors/pgschema/logo.webp"),
      landingImage: utils.absolutifyLink("/assets/sponsors/pgschema/landing.webp"),
      link: "https://github.com/pgschema/pgschema/?utm_source=star-history",
      logoSlogan: "pgschema: Postgres declarative schema migration, like Terraform.",
      landingSlogan: "Postgres declarative schema migration, like Terraform."
    },
]

export const randomSponsors = sampleSize(sponsors, sponsors.length)
