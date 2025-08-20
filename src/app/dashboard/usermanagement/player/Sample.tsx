"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
  { id: "1", name: "Apple" },
  { id: "2", name: "Banana" },
  { id: "3", name: "Cherry" },
  { id: "4", name: "Durian" },
  { id: "5", name: "Elderberry" },
  { id: "6", name: "Fig" },
  { id: "7", name: "Grape" },
]

export default function DialogWithPopover() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<string | null>(null)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          // ✅ prevent dialog from closing when interacting with popover
          if (e.target instanceof Element && e.target.closest("[data-radix-popover-content]")) {
            e.preventDefault()
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Dialog with Popover + Command</DialogTitle>
        </DialogHeader>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between"
            >
              {value ? items.find((i) => i.id === value)?.name : "Select item..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className="w-[--radix-popover-trigger-width] p-0"
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              // ✅ prevent popover from closing when clicking inside
              if (e.target instanceof Element && e.target.closest("[data-radix-popover-content]")) {
                e.preventDefault()
              }
            }}
          >
            <Command>
              <CommandInput placeholder="Search items..." />
              <CommandList className="max-h-60 overflow-y-auto">
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {items.map((item) => (
                    <CommandItem
                      key={item.id}
                      onSelect={() => {
                        setValue(item.id)
                        setOpen(false) // close popover after selection
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === item.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {item.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </DialogContent>
    </Dialog>
  )
}
