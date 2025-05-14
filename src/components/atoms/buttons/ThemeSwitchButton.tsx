import React, { Children, ReactNode } from 'react'

type ThemeSwitchButton_TP = {
    action?:React.MouseEventHandler<HTMLButtonElement>;
    children?:React.ReactNode

}
const ThemeSwitchButton = ({action,children}:ThemeSwitchButton_TP) => {
  return (
    <button
        onClick={action}
        className='flex items-center p-2 rounded-full bg-white-light/40
         dark:bg-dark/40 hover:text-primary
         hover:bg-white-light/90 dark:hover:bg-dark/60'
    >
        {children}
    </button>
  )
}

export default ThemeSwitchButton
