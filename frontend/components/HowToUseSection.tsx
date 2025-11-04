import React from "react"
import Link from "next/link"

const HowToUseSection: React.FC = () => {
    return (
        <div className="flex flex-col justify-start items-start w-full mt-2 p-4">
            <div className="w-full flex flex-col justify-start items-start">
                <h3 className="text-sm font-medium text-gray-400 leading-6 mb-2">Playbook</h3>
                <Link href="/blog/how-to-use-github-star-history" className="cursor-pointer" rel="noopener noreferrer">
                    <span className="text-sm text-blue-700 hover:underline">📕 How to Use this Site</span>
                </Link>
            </div>
        </div>
    )
}

export default HowToUseSection
