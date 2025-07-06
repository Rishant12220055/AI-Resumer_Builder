"use client"

import React, { useState, useRef, useEffect } from "react"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

// Simple select component without external dependencies
const Select = ({ children, value, onValueChange, ...props }) => {
  return (
    <div {...props}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { value, onValueChange })
        }
        return child
      })}
    </div>
  )
}

const SelectGroup = ({ children }) => {
  return <div className="py-1">{children}</div>
}

const SelectValue = ({ placeholder, children }) => {
  return (
    <span className="block truncate">
      {children || placeholder}
    </span>
  )
}

const SelectTrigger = React.forwardRef(({ className, children, value, onValueChange, ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(value)
  const [selectedLabel, setSelectedLabel] = useState("")
  const triggerRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    setSelectedValue(value)
  }, [value])

  const handleSelect = (newValue, label) => {
    setSelectedValue(newValue)
    setSelectedLabel(label)
    setIsOpen(false)
    if (onValueChange) {
      onValueChange(newValue)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target) &&
          contentRef.current && !contentRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        className={`flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 ${className}`}
        onClick={() => setIsOpen(!isOpen)}
        {...props}
      >
        <span className="block truncate">
          {selectedLabel || "Select an option"}
        </span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
      
      {isOpen && (
        <div
          ref={contentRef}
          className="absolute z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-white text-slate-900 shadow-md animate-in fade-in-0 zoom-in-95"
          style={{
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '2px'
          }}
        >
          <div className="p-1">
            {React.Children.map(children, child => {
              if (React.isValidElement(child) && child.type === SelectContent) {
                return React.cloneElement(child, { 
                  onSelect: handleSelect,
                  selectedValue 
                })
              }
              return child
            })}
          </div>
        </div>
      )}
    </div>
  )
})
SelectTrigger.displayName = "SelectTrigger"

const SelectContent = React.forwardRef(({ className, children, onSelect, selectedValue, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-white text-slate-900 shadow-md ${className}`}
      {...props}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { onSelect, selectedValue })
        }
        return child
      })}
    </div>
  )
})
SelectContent.displayName = "SelectContent"

const SelectLabel = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`py-1.5 pl-8 pr-2 text-sm font-semibold ${className}`}
      {...props}
    >
      {children}
    </div>
  )
})
SelectLabel.displayName = "SelectLabel"

const SelectItem = React.forwardRef(({ className, children, value, onSelect, selectedValue, ...props }, ref) => {
  const isSelected = selectedValue === value
  
  return (
    <button
      ref={ref}
      className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className}`}
      onClick={() => onSelect && onSelect(value, children)}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <Check className="h-4 w-4" />}
      </span>
      <span className="block truncate">{children}</span>
    </button>
  )
})
SelectItem.displayName = "SelectItem"

const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`-mx-1 my-1 h-px bg-slate-200 ${className}`}
      {...props}
    />
  )
})
SelectSeparator.displayName = "SelectSeparator"

// Placeholder components for compatibility
const SelectScrollUpButton = ({ className, ...props }) => (
  <button
    className={`flex cursor-default items-center justify-center py-1 ${className}`}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </button>
)
SelectScrollUpButton.displayName = "SelectScrollUpButton"

const SelectScrollDownButton = ({ className, ...props }) => (
  <button
    className={`flex cursor-default items-center justify-center py-1 ${className}`}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </button>
)
SelectScrollDownButton.displayName = "SelectScrollDownButton"

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} 