import React from 'react'
import { Link } from 'react-router-dom'
import { navItems } from '../../static/data'
import styles from '../../styles/styles'

const Navbar = ({active}) => {
  return (
    <div className={`flex flex-col 800px:flex-row 800px:${styles.noramlFlex} gap-1 800px:gap-0`}>
         {
            navItems && navItems.map((i,index) => (
                <div className="flex" key={index}>
                    <Link to={i.url}
                    className={`${
                      active === index + 1 
                        ? "text-indigo-600 800px:text-indigo-400 font-bold bg-indigo-50 800px:bg-transparent" 
                        : "text-slate-700 800px:text-slate-200 hover:text-indigo-600 800px:hover:text-white font-medium"
                    } py-2.5 px-4 800px:py-0 800px:px-5 rounded-xl 800px:rounded-none text-sm transition-colors cursor-pointer w-full 800px:w-auto`}
                    >
                    {i.title}
                    </Link>
                </div>
            ))
         }
    </div>
  )
}

export default Navbar