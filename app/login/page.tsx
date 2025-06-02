"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, GraduationCap, Home, Loader2, MapPin, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type React from "react"
import { useState } from "react"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulação de login com delay para mostrar o loading
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      router.push("/feed")
    } catch (error) {
      console.error("Login failed:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-200/60 dark:bg-grid-slate-700/25 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-pink-400/10 to-orange-400/10 rounded-full blur-2xl animate-pulse delay-500" />

      <div className="flex min-h-screen relative z-10">
        {/* Left side - Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <div className="max-w-lg text-center">
            {/* Logo */}
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-lg">
                  <Home className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  UniHome
                </h1>
              </div>
              <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4">Bem-vindo de volta!</h2>
                <p className="text-lg text-slate-600 dark:text-slate-300">
                  Acesse sua conta e continue sua busca pelo lar ideal
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-8">
              <div className="flex items-center gap-6 p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">Para Estudantes</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Encontre moradia perto da sua universidade
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl">
                <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">Localização Ideal</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Imóveis próximos às principais universidades
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl">
                <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">Comunidade</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Conecte-se com outros estudantes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="absolute top-6 right-6">
            <ThemeToggle />
          </div>

          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8 text-center">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  UniHome
                </h1>
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Bem-vindo de volta!</h2>
                <p className="text-slate-600 dark:text-slate-300">
                  Acesse sua conta e continue sua busca pelo lar ideal
                </p>
              </div>
            </div>

            <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl">
              <CardHeader className="text-center pb-8 pt-10">
                <CardTitle className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">Entrar</CardTitle>
                <CardDescription className="text-lg text-slate-600 dark:text-slate-400">
                  Acesse sua conta para encontrar o imóvel ideal
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6 px-10">
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="h-14 rounded-2xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-lg placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Senha
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        className="h-14 rounded-2xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-lg placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-14"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 h-10 w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="remember"
                        className="h-5 w-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500"
                        disabled={isLoading}
                      />
                      <Label htmlFor="remember" className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Lembrar-me
                      </Label>
                    </div>
                    <Link
                      href="/forgot-password"
                      className={`text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors ${isLoading ? "pointer-events-none" : ""}`}
                    >
                      Esqueceu a senha?
                    </Link>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-6 px-10 pb-10">
                  <Button
                    type="submit"
                    className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Entrando...</span>
                      </div>
                    ) : (
                      "Entrar"
                    )}
                  </Button>

                  <div className="text-center">
                    <span className="text-slate-600 dark:text-slate-400">Não tem uma conta? </span>
                    <Link
                      href="/register"
                      className={`font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors ${isLoading ? "pointer-events-none" : ""}`}
                    >
                      Cadastre-se
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
