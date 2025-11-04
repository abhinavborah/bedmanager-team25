"use client";;
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/authSlice";

const SidebarContext = createContext(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-full px-4 py-4 hidden md:flex md:flex-col bg-neutral-100 dark:bg-neutral-900 w-[300px] flex-shrink-0",
        className
      )}
      animate={{
        width: animate ? (open ? "300px" : "80px") : "300px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}>
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      {/* Floating hamburger button - fixed so it doesn't affect layout */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Open menu"
        className="fixed top-4 right-4 z-50 md:hidden bg-neutral-100 dark:bg-neutral-900 p-2 rounded-md shadow-sm"
        {...props}
      >
        <Menu className="text-neutral-800 dark:text-neutral-200" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className={cn(
              "fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between md:hidden",
              className
            )}>
            <div
              className="absolute right-6 top-6 z-60 text-neutral-800 dark:text-neutral-200 cursor-pointer"
              onClick={() => setOpen(false)}>
              <X />
            </div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}) => {
  const { open, animate } = useSidebar();
  
  const content = (
    <>
      {/* fixed-size icon container so icon remains visible when sidebar is collapsed */}
      <span className="h-6 w-6 flex-shrink-0 text-neutral-700 dark:text-neutral-200 flex items-center justify-center">
        {link.icon}
      </span>

      {/* label: absolutely positioned so it does not reflow the icon when toggling open state */}
      <div className="relative flex-1">
        <motion.span
          aria-hidden={!open}
          animate={{
            opacity: animate ? (open ? 1 : 0) : 1,
            x: animate ? (open ? 0 : -3) : 0,
          }}
          transition={{ duration: 0.18 }}
          className={cn(
            "absolute left-5 top-1/2 -translate-y-1/2 text-neutral-700 dark:text-neutral-200 text-sm transition-transform duration-150 whitespace-pre group-hover/sidebar:translate-x-1",
            !open && "pointer-events-none"
          )}
        >
          {link.label}
        </motion.span>
      </div>
    </>
  );
  
  if (link.onClick) {
    return (
      <button
        onClick={link.onClick}
        className={cn("flex items-center justify-start gap-2 group/sidebar py-3 px-3 w-full text-left", className)}
        {...props}>
        {content}
      </button>
    );
  }
  
  return (
    <Link
      to={link.href}
      className={cn("flex items-center justify-start gap-2 group/sidebar py-3 px-3", className)}
      {...props}>
      {content}
    </Link>
  );
};

// Simple Logo components used in the Dashboard
export const Logo = () => {
  const { open, animate } = useSidebar();
  return (
    <div className="group/sidebar flex items-center justify-start gap-2 py-2 px-3">
      <span className="h-6 w-6 flex-shrink-0 bg-white/90 rounded-md" />
      <div className="relative flex-1">
        <motion.span
          aria-hidden={!open}
          animate={{
            opacity: animate ? (open ? 1 : 0) : 1,
            x: animate ? (open ? 0 : -3) : 0,
          }}
          transition={{ duration: 0.18 }}
          className={cn(
            "absolute left-5 top-1/2 -translate-y-1/2 font-medium text-neutral-700 dark:text-neutral-200 text-sm whitespace-pre transition-transform duration-150 group-hover/sidebar:translate-x-1",
            !open && "pointer-events-none"
          )}
        >
          Bed Manager
        </motion.span>
      </div>
    </div>
  );
};

export const LogoIcon = () => (
  <div className="flex items-center gap-2 px-3 py-2">
    <div className="h-6 w-6 bg-white/90 rounded-md" />
  </div>
);

export const ProfileLink = () => {
  const { open, animate } = useSidebar();
  const currentUser = useSelector(selectCurrentUser);
  
  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  return (
    <div className="group/sidebar flex items-center justify-start gap-2 py-4 px-3">
      <div className="h-8 w-8 rounded-full bg-sky-500 flex-shrink-0 flex items-center justify-center text-white text-xs font-semibold">
        {currentUser ? getInitials(currentUser.name) : '?'}
      </div>
      <div className="relative flex-1">
        <motion.div
          aria-hidden={!open}
          animate={{
            opacity: animate ? (open ? 1 : 0) : 1,
            x: animate ? (open ? 0 : -3) : 0,
          }}
          transition={{ duration: 0.18 }}
          className={cn(
            "absolute left-2 top-1/2 -translate-y-1/2 text-neutral-700 dark:text-neutral-200 whitespace-pre transition-transform duration-150 group-hover/sidebar:translate-x-1",
            !open && "pointer-events-none"
          )}
        >
          <div className="text-sm font-medium">{currentUser?.name || 'Guest'}</div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 capitalize">
            {currentUser?.role?.replace(/_/g, ' ') || 'No role'}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
