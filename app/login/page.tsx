"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AnimatePresence, motion } from "framer-motion"
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

  // Animações mais suaves e otimizadas
  const pageVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  }

  const containerVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    initial: {
      opacity: 0,
      y: 10,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  }

  const featureVariants = {
    initial: {
      opacity: 0,
      x: -20,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  }

  const formVariants = {
    initial: {
      opacity: 0,
      x: 20,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  }

  return (
    <AnimatePresence>
      <motion.div
        initial="initial"
        animate="animate"
        variants={pageVariants}
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden"
      >
        {/* Background Pattern - Simplificado */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-grid-slate-200/60 dark:bg-grid-slate-700/25 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"
        />

        {/* Floating Elements - Animações mais suaves */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "reverse",
          }}
          className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/35 to-purple-400/35 rounded-full blur-2xl"
        />

        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "reverse",
            delay: 0.5,
          }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-indigo-400/40 to-cyan-400/40 rounded-full blur-2xl"
        />

        <div className="flex min-h-screen relative z-10">
          {/* Left side - Hero Section */}
          <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            className="hidden lg:flex lg:w-1/2 items-center justify-center p-12"
          >
            <div className="max-w-lg text-center">
              {/* Logo */}
              <motion.div variants={itemVariants} className="mb-12">
                <div className="inline-flex items-center gap-3 mb-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-lg"
                  >
                    <Home className="w-8 h-8 text-white" />
                  </motion.div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    UniHome
                  </h1>
                </div>
              </motion.div>

              {/* Features */}
              <motion.div className="space-y-6">
                {[
                  {
                    icon: <GraduationCap className="w-6 h-6 text-white" />,
                    title: "Para Estudantes",
                    description: "Encontre moradia perto da sua universidade",
                    gradient: "from-blue-500 to-cyan-500",
                  },
                  {
                    icon: <MapPin className="w-6 h-6 text-white" />,
                    title: "Localização Ideal",
                    description: "Imóveis próximos às principais universidades",
                    gradient: "from-indigo-500 to-purple-500",
                  },
                  {
                    icon: <Sparkles className="w-6 h-6 text-white" />,
                    title: "Comunidade",
                    description: "Conecte-se com outros estudantes",
                    gradient: "from-purple-500 to-pink-500",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={featureVariants}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    className="flex items-center gap-6 p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl"
                  >
                    <div className={`p-4 bg-gradient-to-r ${feature.gradient} rounded-2xl`}>
                      {feature.icon}
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-slate-800 dark:text-slate-200">{feature.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Right side - Form */}
          <motion.div
            variants={formVariants}
            initial="initial"
            animate="animate"
            className="w-full lg:w-1/2 flex items-center justify-center p-8"
          >
            <div className="w-full max-w-md">
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl">
                  <CardHeader className="text-center pb-8 pt-10">
                    <CardTitle className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                      Entrar
                    </CardTitle>
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
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        transition={{ duration: 0.2 }}
                        className="w-full"
                      >
                        <Button
                          type="submit"
                          className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
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
                      </motion.div>

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
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
