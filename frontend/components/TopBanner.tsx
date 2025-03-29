import Link from "next/link";

const TopBanner: React.FC = () => {
    return (
        <nav>
            <div className="flex justify-center items-center gap-x-6 bg-green-600 px-6 py-1 sm:px-3.5 ">
                <p className="text-sm leading-6 text-white">
                    <Link href="/blog/list-your-open-source-project">
                        Want to promote your open source project? Be on our ⭐️Starlet List⭐️ for FREE
                    </Link>
                </p>
            </div>
        </nav>
    )
}

export default TopBanner
