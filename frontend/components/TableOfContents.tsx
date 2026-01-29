import React, { useEffect, useState } from "react"

export interface TocItem {
    id: string
    text: string
    level: number
}

interface Props {
    items: TocItem[]
}

const TableOfContents: React.FC<Props> = ({ items }) => {
    const [activeId, setActiveId] = useState<string>("")

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                    }
                })
            },
            { rootMargin: "-80px 0px -80% 0px" }
        )

        items.forEach((item) => {
            const element = document.getElementById(item.id)
            if (element) {
                observer.observe(element)
            }
        })

        return () => observer.disconnect()
    }, [items])

    if (items.length === 0) {
        return null
    }

    return (
        <div className="sticky top-28 flex flex-col justify-start items-start w-full h-fit">
            <div className="w-full px-2 pt-4 flex flex-col justify-start items-start">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">On this page</h3>
                <nav className="w-full">
                    <ul className="space-y-2 text-sm">
                        {items.map((item) => (
                            <li
                                key={item.id}
                                style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
                            >
                                <a
                                    href={`#${item.id}`}
                                    className={`block py-1 leading-5 transition-colors duration-150 ${
                                        activeId === item.id
                                            ? "text-indigo-600 font-medium"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        const element = document.getElementById(item.id)
                                        if (element) {
                                            const offset = 80
                                            const elementPosition = element.getBoundingClientRect().top + window.scrollY
                                            window.scrollTo({
                                                top: elementPosition - offset,
                                                behavior: "smooth"
                                            })
                                            setActiveId(item.id)
                                            history.pushState(null, "", `#${item.id}`)
                                        }
                                    }}
                                >
                                    {item.text}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default TableOfContents
