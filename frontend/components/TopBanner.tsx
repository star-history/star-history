
const TopBanner: React.FC = () => {
    return (
        <nav>
            <div className="flex justify-center items-center gap-x-6 bg-green-600 px-6 py-1 sm:px-3.5 ">
                <p className="text-sm leading-6 text-white">
                    <a href="http://www.pgconsole.com/?utm_source=star-history" target="_blank" rel="noopener noreferrer">
                        Treat your Postgres to a better interface. Try pgconsole 👈
                    </a>
                </p>
            </div>
        </nav>
    )
}

export default TopBanner
