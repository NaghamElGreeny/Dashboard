import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"
import { AccordionDown } from "../atoms/icons/AccordionDown"
import { AccordionUp } from "../atoms/icons/AccordionUp"
import { useToggle } from "../../hooks/useToggle"

export const Accordion = ({
  children,
  isInitiallyOpen = true,
  title,
  className,
  accordionArrowColor = "black",
  ...props
}: {
  children: ReactNode
  isInitiallyOpen?: boolean
  title: string
  className?: string
  accordionArrowColor?: string
}) => {
  const [isOpen, toggleOpen] = useToggle(isInitiallyOpen || false)

  return (
    <div {...props}>
      <header
        onClick={toggleOpen}
        className={twMerge(
          "flex justify-between items-center p-2 pl-2 pr-2 cursor-pointer select-none bg-mainGreen rounded",
          className
        )}
      >
        <span className=" text-inherit font-thin text-xl">{title}</span>
        {isOpen ? (
          <AccordionUp color={accordionArrowColor} />
        ) : (
          <AccordionDown color={accordionArrowColor} />
        )}
      </header>
      {isOpen && children}
    </div>
  )
}
