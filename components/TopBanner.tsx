const TopBanner: React.FC = () => {
    return (
        <nav>
            <div className="flex justify-center items-center gap-x-6 bg-green-600 px-6 py-1 sm:px-3.5 ">
                <p className="text-sm leading-6 text-white">
                    <a href="https://star-history.com/blog/list-your-open-source-project" target="_blank">
                        Want to promote your open source project? Be on our ⭐️Starlet List⭐️ for FREE →
                    </a>
                </p>
            </div>
        </nav>
    )
}

export default TopBanner
