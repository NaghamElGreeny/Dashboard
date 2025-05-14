import {  AiFillEdit } from "react-icons/ai"
import EditIconC from "./EditIcon"
type EditProps_TP = {
  className?: string
  action?: () => void
  size?:number
}
export const Edit = ({
  className,
  action,
  size,
  ...props
}: EditProps_TP) => {

  return (
    <EditIconC
      className={`cursor-pointer  ${className}`}
      onClick={action}
      {...props}
    />
  )
}
