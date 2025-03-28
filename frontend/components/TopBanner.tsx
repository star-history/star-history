import Link from "next/link";

const TopBanner: React.FC = () => {
    return (
        <nav>
            <div className="flex justify-center items-center gap-x-6 bg-green-600 px-6 py-1 sm:px-3.5 ">
                <p className="text-sm leading-6 text-white">
                    <Link href="/blog/a-message-to-github-star-history-users">
                       🚨 A message to our users about ongoing broken live chart
                    </Link>
                </p>
            </div>
        </nav>
    )
}

export default TopBanner
