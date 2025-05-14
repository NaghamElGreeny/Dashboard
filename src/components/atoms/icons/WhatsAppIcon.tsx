import { BsWhatsapp } from "react-icons/bs"
type DeleteProps_TP = {
  className?: string
  action?: () => void
  size?: number
}
export const WhatsAppIcon = ({
  className,
  action,
  size,
  ...props
}: DeleteProps_TP) => {
  return (
    <BsWhatsapp
      size={size}
      className={` fill-red-500 cursor-pointer  ${className}`}
      onClick={action}
      {...props}
    />
  )
}
