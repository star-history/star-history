import { useState } from "react"
import { useRouter } from "next/router"
import { GITHUB_REPO_URL_REG } from "../helpers/consts"

export default function NavInput() {
    const router = useRouter()
    const [navInput, setNavInput] = useState("")

    const handleNavSubmit = () => {
        let raw = navInput.trim()
        if (!raw) return

        if (GITHUB_REPO_URL_REG.test(raw)) {
            const match = raw.match(GITHUB_REPO_URL_REG)
            if (match) raw = match[1]
        }

        const parts = raw.split("/").filter(Boolean)
        if (parts.length === 1) {
            router.push(`/${parts[0]}/${parts[0]}`)
        } else if (parts.length >= 2) {
            router.push(`/${parts[0]}/${parts[1]}`)
        }
    }

    return (
        <div className="w-full max-w-2xl mb-4 flex items-center rounded-lg border border-neutral-200 bg-white shadow-sm overflow-hidden">
            <input
                type="text"
                value={navInput}
                onChange={(e) => setNavInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNavSubmit()}
                placeholder="star-history or star-history/star-history or https://github.com/star-history/star-history"
                className="flex-1 h-10 px-4 text-sm outline-none placeholder:text-neutral-400"
            />
            <button
                onClick={handleNavSubmit}
                className="h-10 px-4 text-sm text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 border-l border-neutral-200 transition-colors"
            >
                Go
            </button>
        </div>
    )
}
