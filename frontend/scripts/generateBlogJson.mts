/**
 * Build-time script to generate blog.json from markdown frontmatter.
 *
 * Usage: npx ts-node scripts/generateBlogJson.ts
 *
 * This script:
 * 1. Scans all .md files in public/blog/
 * 2. Parses YAML frontmatter from each file
 * 3. Sorts entries by publishedDate (descending)
 * 4. Writes the result to helpers/blog.json
 */

import * as fs from "fs"
import * as path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface BlogEntry {
    title: string
    slug: string  // Derived from filename, not from frontmatter
    author: string
    featured: boolean
    featureImage: string
    publishedDate: string
    description: string
}

const BLOG_DIR = path.join(__dirname, "../public/blog")
const OUTPUT_PATH = path.join(__dirname, "../helpers/blog.json")

function parseFrontmatter(content: string): Record<string, unknown> | null {
    const match = content.match(/^---\s*\n([\s\S]*?)\n---/)
    if (!match) {
        return null
    }

    const yamlContent = match[1]
    const result: Record<string, unknown> = {}

    // Simple YAML parser for our specific format
    const lines = yamlContent.split("\n")
    for (const line of lines) {
        const colonIndex = line.indexOf(":")
        if (colonIndex === -1) continue

        const key = line.slice(0, colonIndex).trim()
        let value: unknown = line.slice(colonIndex + 1).trim()

        // Remove surrounding quotes
        if (typeof value === "string" && value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1).replace(/\\"/g, '"')
        }

        // Parse booleans
        if (value === "true") value = true
        if (value === "false") value = false

        result[key] = value
    }

    return result
}

function generateBlogJson() {
    console.log("Scanning blog directory...")

    const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"))
    console.log(`Found ${files.length} markdown files`)

    const entries: BlogEntry[] = []
    let errorCount = 0

    for (const file of files) {
        const filePath = path.join(BLOG_DIR, file)
        const content = fs.readFileSync(filePath, "utf-8")
        const frontmatter = parseFrontmatter(content)

        if (!frontmatter) {
            console.error(`  ✗ No frontmatter found in: ${file}`)
            errorCount++
            continue
        }

        // Derive slug from filename (e.g., "react.md" -> "react")
        const slug = file.replace(/\.md$/, "")

        // Validate required fields (slug is derived, not from frontmatter)
        const required = ["title", "author", "featured", "featureImage", "publishedDate", "description"]
        const missing = required.filter((field) => frontmatter[field] === undefined)

        if (missing.length > 0) {
            console.error(`  ✗ Missing fields in ${file}: ${missing.join(", ")}`)
            errorCount++
            continue
        }

        entries.push({
            title: frontmatter.title as string,
            slug: slug,
            author: frontmatter.author as string,
            featured: frontmatter.featured as boolean,
            featureImage: frontmatter.featureImage as string,
            publishedDate: frontmatter.publishedDate as string,
            description: frontmatter.description as string
        })

        console.log(`  ✓ Parsed: ${file}`)
    }

    // Sort by publishedDate descending (ISO 8601 format)
    entries.sort((a, b) => {
        const dateA = new Date(a.publishedDate)
        const dateB = new Date(b.publishedDate)
        return dateB.getTime() - dateA.getTime()
    })

    // Write output
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(entries, null, 4) + "\n")

    console.log("\n--- Generation Complete ---")
    console.log(`Entries: ${entries.length}`)
    console.log(`Errors: ${errorCount}`)
    console.log(`Output: ${OUTPUT_PATH}`)
}

generateBlogJson()
