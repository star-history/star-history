import Link from 'next/link'
import axios from "react";

function GitHubStarButton() {
  return (
    <a
    className="border rounded flex flex-row justify-start items-center text-black text-xs bg-white shadow-inner hover:opacity-80"
    href="https://github.com/star-history/star-history"
    target="_blank"
    aria-label="Star star-history/star-history on GitHub"
  >
    <span
      className="pr-1 pl-2 h-full flex flex-row justify-center items-center bg-gray-100 border-r font-medium"
    >
      <i className="fab fa-github text-base mr-1 -mt-px"></i>
      <span className="mt-px">Star</span>
    </span>
    <div className="h-full block px-2 mt-px font-medium">
      <span v-if="starCount === 0">
        <i className="fa fa-spinner animate-spin opacity-90 px-2"></i>
      </span>
    </div>
  </a>

  )
}
export default GitHubStarButton;