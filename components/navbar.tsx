"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"
import { BookPlus, Building2, Heart, Home, LogOut, Menu, MessageSquare, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export default function Navbar() {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [isLoggedIn, setIsLoggedIn] = useState(true)

  // Não mostrar navbar nas páginas de login e cadastro
  if (pathname === "/login" || pathname === "/register") {
    return null
  }

  const NavItems = () => (
    <>
      <Link href="/feed">
        <Button
          variant={pathname === "/feed" ? "default" : "ghost"}
          className={`flex gap-3 h-12 px-6 rounded-2xl font-medium transition-all duration-200 hover:scale-105 ${
            pathname === "/feed"
              ? "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
              : ""
          }`}
        >
          <Home size={20} />
          {!isMobile && "Início"}
        </Button>
      </Link>
      <Link href="/favorites">
        <Button
          variant={pathname === "/favorites" ? "default" : "ghost"}
          className={`flex gap-3 h-12 px-6 rounded-2xl font-medium transition-all duration-200 hover:scale-105 ${
            pathname === "/favorites"
              ? "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
              : ""
          }`}
        >
          <Heart size={20} />
          {!isMobile && "Favoritos"}
        </Button>
      </Link>
      <Link href="/chats">
        <Button
          variant={pathname === "/chats" ? "default" : "ghost"}
          className={`flex gap-3 h-12 px-6 rounded-2xl font-medium transition-all duration-200 hover:scale-105 ${
            pathname === "/chats"
              ? "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
              : ""
          }`}
        >
          <MessageSquare size={20} />
          {!isMobile && "Mensagens"}
        </Button>
      </Link>
      <Link href="/create-listing">
        <Button
          variant={pathname === "/create-listing" ? "default" : "ghost"}
          className={`flex gap-3 h-12 px-6 rounded-2xl font-medium transition-all duration-200 hover:scale-105 ${
            pathname === "/create-listing"
              ? "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
              : ""
          }`}
        >
          <BookPlus size={20} />
          {!isMobile && "Anunciar"}
        </Button>
      </Link>
    </>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/feed" className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl transition-all duration-200 transform hover:scale-105">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-white">uH</span>
            </div>
          </Link>
        </div>

        {isLoggedIn ? (
          <>
            {isMobile ? (
              <div className="flex items-center gap-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-2xl">
                      <Menu />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="rounded-r-3xl">
                    <div className="flex flex-col gap-4 mt-8">
                      <NavItems />
                    </div>
                  </SheetContent>
                </Sheet>

                <ThemeToggle />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-12 w-12 rounded-2xl">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Avatar" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                          MP
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2">
                    <DropdownMenuItem asChild className="rounded-xl p-3">
                      <Link href="/profile" className="flex items-center gap-3">
                        <User size={18} />
                        Meu Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl p-3">
                      <Link href="/my-listings" className="flex items-center gap-3">
                        <Building2 size={18} />
                        Meus Anúncios
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem asChild className="rounded-xl p-3">
                      <Link href="/login" className="flex items-center gap-3 text-red-600 focus:text-red-600">
                        <LogOut size={18} className="text-red-600" />
                        Sair
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <nav className="flex items-center gap-2">
                  <NavItems />
                </nav>

                <ThemeToggle />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-12 w-12 rounded-2xl">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Avatar" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                          MP
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2">
                    <DropdownMenuItem asChild className="rounded-xl p-3">
                      <Link href="/profile" className="flex items-center gap-3">
                        <User size={18} />
                        Meu Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl p-3">
                      <Link href="/my-listings" className="flex items-center gap-3">
                        <Building2 size={18} />
                        Meus Anúncios
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem asChild className="rounded-xl p-3">
                      <Link href="/login" className="flex items-center gap-3 text-red-600 focus:text-red-600">
                        <LogOut size={18} className="text-red-600" />
                        Sair
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" className="rounded-2xl font-medium">
                Entrar
              </Button>
            </Link>
            <Link href="/register">
              <Button className="rounded-2xl font-medium bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600">
                Cadastrar
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
