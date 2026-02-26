import { useRouter } from "next/router"
import Link from "next/link"
import type { GetStaticProps, NextPage } from "next"
import { formatNumber } from "../helpers/format"
import { DEFAULT_MIN_STARS, loadRepoCards } from "../helpers/repo-data"
import PageShell from "../components/PageShell"

interface NotFoundProps {
    minStars: number
}

const NotFound: NextPage<NotFoundProps> = ({ minStars }) => {
    const router = useRouter()
    const pathname = router.asPath.split("?")[0].split("#")[0]
    const segments = pathname.split("/").filter(Boolean)

    // Detect owner/repo pattern
    const isRepoPath = segments.length === 2 && !segments[0].startsWith("_") && segments[0] !== "blog"
    const isBlogPath = segments.length === 2 && segments[0] === "blog"

    if (isRepoPath) {
        const repoName = segments.join("/")
        return (
            <PageShell>
                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-5 py-16 text-center">
                        <p className="text-4xl mb-3">🔭</p>
                        <h1 className="text-lg font-semibold text-neutral-800">
                            <span className="font-mono">{repoName}</span> not found
                        </h1>
                        <p className="text-sm text-neutral-500 mt-2">
                            We only track repositories with over {formatNumber(minStars)} stars. Try another repository above.
                        </p>
                    </div>
                </div>
            </PageShell>
        )
    }

    if (isBlogPath) {
        return (
            <div className="relative w-full min-h-screen flex flex-col justify-center items-center">
                <p className="text-center leading-8 text-lg text-dark font-medium">Oops! Article not found.</p>
                <p className="text-center mt-2">
                    <Link href="/blog" className="link-action">
                        Back to blog list
                    </Link>
                </p>
            </div>
        )
    }

    return (
        <div className="relative w-full min-h-screen flex flex-col justify-center items-center">
            <p className="text-lg font-medium">404, Not Found.</p>
            <p className="text-sm text-neutral-500 mt-2">
                <Link href="/" className="link-action">
                    Go to star-history.com
                </Link>
            </p>
        </div>
    )
}

export const getStaticProps: GetStaticProps<NotFoundProps> = async () => {
    const { min_stars: minStars } = loadRepoCards()
    return { props: { minStars } }
}

export default NotFound
