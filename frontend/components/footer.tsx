import { FaEnvelope, FaRss } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"

const Footer = () => {
    return (
        <footer className="relative w-full shrink-0 h-auto mt-6 flex flex-col justify-end items-center">
            <div className="w-full py-2 px-3 flex flex-row flex-wrap justify-between items-center text-neutral-700 border-t">
                <div className="text-sm leading-8 flex flex-row flex-wrap justify-start items-center">
                    <div className="h-full text-gray-600">The de facto GitHub star history graph</div>
                    <a className="h-full flex flex-row justify-center items-center ml-2 text-lg hover:opacity-80" href="mailto:star@bytebase.com" target="_blank" rel="noopener noreferrer">
                        <FaEnvelope />
                    </a>
                    <a className="h-full flex flex-row justify-center items-center ml-2 text-lg hover:opacity-80" href="https://x.com/StarHistoryHQ" target="_blank" rel="noopener noreferrer">
                        <FaXTwitter />
                    </a>
                    <a className="h-full flex flex-row justify-center items-center ml-2 text-lg hover:opacity-80" href="https://rss.beehiiv.com/feeds/BbNzf9ozGZ.xml" target="_blank" rel="noopener noreferrer">
                        <FaRss />
                    </a>
                </div>
                <div className="flex flex-row flex-wrap items-center space-x-4">
                    <div className="flex flex-row link-footer">
                        <img className="h-4 mt-2 mr-1" src="/assets/pgconsole.svg" alt="pgconsole" />
                        <a href="https://www.pgconsole.com" target="_blank" rel="noopener noreferrer">
                            {" "}
                            pgconsole{" "}
                        </a>
                    </div>
                    <div className="flex flex-row link-footer">
                        <img className="h-4 mt-2 mr-1" src="/assets/pgschema.webp" alt="DB Cost" />
                        <a href="https://www.pgschema.com/" target="_blank" rel="noopener noreferrer">
                            pgschema
                        </a>
                    </div>
                    <div className="flex flex-row link-footer">
                        <img className="h-4 mt-2 mr-1" src="/assets/dbhub.svg" alt="dbhub" />
                        <a href="https://dbhub.ai" target="_blank" rel="noopener noreferrer">
                            {" "}
                            DBHub{" "}
                        </a>
                    </div>
                    <div className="flex flex-row link-footer">
                        <img className="h-4 mt-2 mr-1" src="/assets/arfak.webp" alt="arfak" />
                        <a href="https://www.arfak.ai" target="_blank" rel="noopener noreferrer">
                            {" "}
                            Arfak{" "}
                        </a>
                    </div>
                </div>
                <div className="text-xs leading-8 flex flex-row flex-nowrap justify-end items-center">
                    <span className="text-gray-600">
                        Maintained by{" "}
                        <a className="link" href="https://bytebase.com" target="_blank" rel="noopener noreferrer">
                            Bytebase
                        </a>
                        , originally built by{" "}
                        <a className="link" href="https://x.com/tim_qian" target="_blank" rel="noopener noreferrer">
                            @tim_qian
                        </a>
                    </span>
                </div>
            </div>
        </footer>
    )
}

export default Footer
