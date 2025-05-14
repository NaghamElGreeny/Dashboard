import { AiFillDelete } from "react-icons/ai"
type DeleteProps_TP = {
  className?: string
  action?: () => void
  size?:number
}
export const Delete = ({
  className,
  action,
  size,
  ...props
}: DeleteProps_TP) => {

  return (
    <AiFillDelete
      size={size}
      className={` fill-red-500 cursor-pointer  ${className}`}
      onClick={action}
      {...props}
    />
  )
}
