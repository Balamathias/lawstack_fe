'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle
} from "@/components/ui/dialog"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
  DrawerTitle,
} from "@/components/ui/drawer"

import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import { LucideX } from 'lucide-react'
import { Separator } from './ui/separator'

interface DynamicModalProps {
    children: React.ReactNode,
    trigger?: React.ReactNode,
    open?: boolean,
    setOpen?: React.Dispatch<React.SetStateAction<boolean>> | ((bool: boolean) => void),
    showCloseButton?: boolean,
    dialogClassName?: string,
    drawerClassName?: string,
    dialogOnly?: boolean,
    drawerOnly?: boolean,
    dismissible?: boolean,
    closeModal?: (open?: boolean) => void,
    showDrawerCancel?: boolean,
    hideDrawerCancel?: boolean,
    title?: string | React.ReactNode,
    blurHeader?: boolean,
    hideDrawerCancelIcon?: boolean
}
const DynamicModal = ({
  children, 
  trigger, 
  open, 
  setOpen, 
  dialogClassName, 
  drawerClassName, 
  showCloseButton, 
  dialogOnly=false, 
  drawerOnly=false, 
  dismissible=true,
  showDrawerCancel=true,
  closeModal,
  title,
  hideDrawerCancel,
  blurHeader=false,
  hideDrawerCancelIcon=false
}: DynamicModalProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  if ((isDesktop || dialogOnly) && !drawerOnly) {
    return (
      <Dialog open={open} onOpenChange={closeModal ? closeModal : setOpen} modal>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        <DialogContent className={cn("border-none drop-shadow-md shadow-md focus:border-none outline-none focus-within:border-none dark:bg-background/70 backdrop-blur-md rounded-2xl", dialogClassName)}>
          {
            title && (
              <div className={cn('text-muted-foreground', blurHeader && 'bg-transparent backdrop-blur')}>
                {
                  typeof title === 'string' ? (
                    <DialogTitle className='text-center font-semibold'>{title || 'This is a title'}</DialogTitle>
                  ): title
                }
                <Separator className='w-full mt-1.5 hidden' />
              </div>
            )
          }
          <div className="flex flex-col gap-3 p-2.5">
            {children}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} dismissible={dismissible}>
      <DrawerTrigger asChild>
        { trigger }
      </DrawerTrigger>
      <DrawerContent className={cn('flex flex-col flex-1 gap-3 border-none focus:border-none p-4 max-sm:pb-8 outline-none dark:bg-background/70 backdrop-blur-md rounded-2xl', drawerClassName)}>

        <DrawerTitle className={cn('bg-transparent flex items-center justify-between', hideDrawerCancel && 'hidden', blurHeader && 'bg-transparent backdrop-blur')} asChild>
          <div>
            <DrawerClose asChild>
              <Button variant="ghost" className='rounded-full py-2 bg-secondary/25' size={'icon'}>
                <LucideX />
              </Button>
            </DrawerClose>
            {
              title && (
                <div className='text-muted-foreground -ml-10'>
                  {
                    typeof title === 'string' ? (
                      <h2 className='text-center font-semibold text-muted-foreground text-sm md:text-base'>{title || 'This is a title'}</h2>
                    ): title
                  }
                </div>
              )
            }

            <div />
          </div>
        </DrawerTitle>

        <div className="flex flex-col gap-3">
            {children}
        </div>
        {showCloseButton && <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="destructive">Close</Button>
          </DrawerClose>
        </DrawerFooter>}
      </DrawerContent>
    </Drawer>
  )
}

export default DynamicModal