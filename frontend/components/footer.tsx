import { FaTwitter, FaEnvelope, FaGithub } from "react-icons/fa"

const Footer = () => {
    return (
        <footer className="relative w-full shrink-0 h-auto mt-6 flex flex-col justify-end items-center">
            <div className="w-full py-2 px-3 md:w-5/6 lg:max-w-7xl flex flex-row flex-wrap justify-between items-center text-neutral-700 border-t">
                <div className="text-sm leading-8 flex flex-row flex-wrap justify-start items-center">
                    <div className="h-full text-gray-600">The de facto GitHub star history graph</div>
                    <a className="h-full flex flex-row justify-center items-center ml-2 text-lg hover:opacity-80" href="mailto:star@bytebase.com" target="_blank" rel="noopener noreferrer">
                        <FaEnvelope />
                    </a>
                </div>
                <div className="flex flex-row flex-wrap items-center space-x-4">
                    <div className="flex flex-row text-sm leading-8 underline text-blue-700 hover:opacity-80">
                        <img className="h-4 mt-2 mr-2" src="/assets/pgconsole.webp" alt="pgconsole" />
                        <a href="https://www.pgconsole.com" target="_blank" rel="noopener noreferrer">
                            {" "}
                            pgconsole{" "}
                        </a>
                    </div>
                    <div className="flex flex-row text-sm leading-8 underline text-blue-700 hover:opacity-80">
                        <img className="h-4 mt-2 mr-2" src="/assets/pgschema.webp" alt="DB Cost" />
                        <a href="https://www.pgschema.com/" target="_blank" rel="noopener noreferrer">
                            pgschema
                        </a>
                    </div>
                </div>
                <div className="text-xs leading-8 flex flex-row flex-nowrap justify-end items-center">
                    <span className="text-gray-600">
                        Maintained by{" "}
                        <a className="text-blue-500 hover:opacity-80" href="https://bytebase.com" target="_blank" rel="noopener noreferrer">
                            Bytebase
                        </a>
                        , originally built by{" "}
                        <a className="text-blue-500 hover:opacity-80" href="https://twitter.com/tim_qian" target="_blank" rel="noopener noreferrer">
                            @tim_qian
                        </a>
                    </span>
                </div>
            </div>
        </footer>
    )
}

export default Footer
