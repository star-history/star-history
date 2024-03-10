import { FaTwitter, FaEnvelope, FaGithub } from "react-icons/fa"

const Footer = () => {
    return (
        <div className="relative w-full shrink-0 h-auto mt-6 flex flex-col justify-end items-center">
            <div className="w-full py-2 px-3 md:w-5/6 lg:max-w-7xl flex flex-row flex-wrap justify-between items-center text-neutral-700 border-t">
                <div className="text-sm leading-8 flex flex-row flex-wrap justify-start items-center">
                    <h1 className="h-full text-gray-600">The missing GitHub star history graph</h1>
                    <a className="h-full flex flex-row justify-center items-center ml-3 text-lg hover:opacity-80" href="https://twitter.com/StarHistoryHQ" target="_blank" rel="noopener noreferrer">
                        <FaTwitter />
                    </a>
                    <a className="h-full flex flex-row justify-center items-center mx-3 text-lg hover:opacity-80" href="mailto:star@bytebase.com" target="_blank" rel="noopener noreferrer">
                        <FaEnvelope />
                    </a>
                    <a
                        className="h-full flex flex-row justify-center items-center mr-3 text-lg hover:opacity-80"
                        href="https://github.com/star-history/star-history"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaGithub />
                    </a>
                </div>
                <div className="flex flex-row flex-wrap items-center space-x-4">
                    <div className="flex flex-row text-sm leading-8 underline text-blue-700 hover:opacity-80">
                        <img className="h-6 mt-1 mr-2" src="/sqlchat.webp" alt="SQL Chat" />
                        <a href="https://sqlchat.ai" target="_blank" rel="noopener noreferrer">
                            {" "}
                            SQL Chat{" "}
                        </a>
                    </div>
                    <div className="flex flex-row text-sm leading-8 underline text-blue-700 hover:opacity-80">
                        <img className="h-6 mt-1 mr-2" src="/dbcost.webp" alt="DB Cost" />
                        <a href="https://dbcost.com" target="_blank" rel="noopener noreferrer">
                            DB Cost
                        </a>
                    </div>
                    <div className="flex flex-row text-sm leading-8 underline text-blue-700 hover:opacity-80">
                        <img className="h-6 mt-1 mr-2" src="/mysql-vs-pg.webp" alt="DB Cost" />
                        <a href="https://dbcost.com" target="_blank" rel="noopener noreferrer">
                            MySQL or PG
                        </a>
                    </div>
                </div>
                <div className="text-xs leading-8 flex flex-row flex-nowrap justify-end items-center">
                    <span className="text-gray-600">
                        Maintained by{" "}
                        <a className="text-blue-500 font-bold hover:opacity-80" href="https://bytebase.com" target="_blank" rel="noopener noreferrer">
                            Bytebase
                        </a>
                        , originally built by{" "}
                        <a className="bg-blue-400 text-white p-1 pl-2 pr-2 rounded-l-2xl rounded-r-2xl hover:opacity-80" href="https://twitter.com/tim_qian" target="_blank" rel="noopener noreferrer">
                            @tim_qian
                        </a>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Footer
