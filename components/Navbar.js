import Link from "next/link";
import { useState } from "react";
import { HiMenu } from "react-icons/hi";
import { BiX, BiNews } from "react-icons/bi";
import { TiHome } from "react-icons/ti";
import { MdOutlineExplore } from "react-icons/md"
import { HiOutlineHeart } from "react-icons/hi"
import { FiPlusSquare } from "react-icons/fi";
import { CgProfile } from "react-icons/cg"

function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <nav className="shadow-md fixed w-full z-50  ">
      <div className="flex items-center bg-white py-2 rounded-b-lg w-full">
        <div className="flex items items-center w-full mx-9 md:mx-40 justify-between">
          <div className="flex items-center justify-center ">
            <h1 className="font-bold text-2xl cursor-pointer logo">
              InstaClone
            </h1>
          </div>
          <form className="flex items-center text-gray-700 ">
            <label for="simple-search" className="sr-only">
              Search
            </label>
            <div className="relative w-full">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                id="simple-search"
                className="bg-gray-10 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-200 dark:border-none dark:placeholder-gray-400 dark:text-gray dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search"
                required
              />
            </div>
          </form>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/Feed" className=" cusor-pointer ">
                <div className="no-underline hover:text-orange-600 cursor-pointer">
                  <TiHome className="text-2xl" />
                </div>
              </Link>
              <Link href="/creations" className=" cusor-pointer ">
                <div className="no-underline hover:text-orange-600 cursor-pointer">
                  <MdOutlineExplore className="text-2xl" />
                </div>
              </Link>
              <Link href="/starred" className=" cusor-pointer ">
                <div className="no-underline hover:text-orange-600 cursor-pointer">
                  <HiOutlineHeart className="text-2xl" />
                </div>
              </Link>
              {/* <Link href="/creations" className=" cusor-pointer ">
                <div className="no-underline hover:text-orange-600 cursor-pointer">
                  <BiNews className="text-2xl" />
                </div>
              </Link> */}

              <Link href="/create" className=" cusor-pointer ">
                <FiPlusSquare className="text-2xl" />
                {/* <button className="no-underline bg-green-500 py-2 px-3 rounded-lg font-bold text-teal-50 hover:bg-orange-500 cursor-pointer ">
                  Create NFT
                </button> */}
              </Link>

              <Link href="/" className=" cusor-pointer ">
                <CgProfile className="text-2xl" />
                {/* <button className="no-underline bg-green-500 py-2 px-3 rounded-lg font-bold text-teal-50 hover:bg-orange-500 cursor-pointer ">
                  Create NFT
                </button> */}
              </Link>
            </div>
          </div>
          <div className="block md:hidden">
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className=" ml-10 cursor-pointer flex items-center bg-green-500 text-gray-50  hover:bg-orange-500 px-2 py-2 rounded-lg "
            >
              {!openMenu ? (
                <HiMenu className="font-bold text-2xl" />
              ) : (
                <BiX className="font-bold text-2xl" />
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="md:hidden  bg-white  rounded-b-lg w-full ">
        <div className=" mx-20 justify-between">
          {openMenu && (
            <div className=" flex flex-column items-center  space-y-8 py-3">
              <Link href="/" className=" cusor-pointer ">
                <div className="no-underline font-semibold text-lg text-black-600 hover:text-orange-600 block cursor-pointer">
                  Home
                </div>
              </Link>
              <Link href="/Feed" className=" cusor-pointer ">
                <div className="no-underline font-semibold text-lg text-black-600 hover:text-orange-600 cursor-pointer">
                  Feed
                </div>
              </Link>
              <Link href="/starred" className=" cusor-pointer ">
                <div className="no-underline font-semibold text-lg text-black-600 hover:text-orange-600 cursor-pointer">
                  Starred
                </div>
              </Link>
              <Link href="/creations" className=" cusor-pointer ">
                <div className="no-underline font-semibold text-lg text-black-600 hover:text-orange-600 cursor-pointer">
                  Creations
                </div>
              </Link>

              <Link href="/create" className=" cusor-pointer ">
                <button className="no-underline bg-green-500 py-2 px-3 rounded-lg font-semibold text-lg text-teal-50  hover:bg-orange-500 cursor-pointer ">
                  Create NFT
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
