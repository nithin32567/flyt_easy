import * as React from "react"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface AccordionItemProps {
  children: React.ReactNode
  className?: string
}

interface AccordionTriggerProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  isOpen?: boolean
}

interface AccordionContentProps {
  children: React.ReactNode
  className?: string
  isOpen?: boolean
}

interface AccordionGroupProps {
  children: React.ReactNode
  className?: string
}

const AccordionGroup = ({ children, className = "" }: AccordionGroupProps) => {
  return <div className={`space-y-4 ${className}`}>{children}</div>
}

const AccordionItem = ({ children, className = "" }: AccordionItemProps) => {
  return <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`}>{children}</div>
}

const AccordionTrigger = ({ children, className = "", onClick, isOpen = false }: AccordionTriggerProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 md:p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-200 ${className}`}
    >
      <div className="flex-1">{children}</div>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
        className="ml-4 flex-shrink-0"
      >
        <ChevronDown className="h-5 w-5 text-gray-500" />
      </motion.div>
    </button>
  )
}

const AccordionContent = ({ children, className = "", isOpen = false }: AccordionContentProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className={`px-4 md:px-6 pb-4 md:pb-6 border-t border-gray-100 ${className}`}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export { AccordionGroup, AccordionItem, AccordionTrigger, AccordionContent }
