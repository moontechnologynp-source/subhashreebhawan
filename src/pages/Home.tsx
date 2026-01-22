import { useEffect, useState } from 'react'
import { Building2, Stethoscope, Coffee, ShieldCheck, DoorOpen, Dumbbell, Utensils, Film, Laptop, Phone, Mail, MapPin, Star, ArrowRight, Sun, Moon } from 'lucide-react'

export default function Home() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [theme, setTheme] = useState<'light' | 'dark'>('dark')

    useEffect(() => {
        // Check for saved preference or use system preference
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme === 'light' || savedTheme === 'dark') {
            setTheme(savedTheme)
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            setTheme(prefersDark ? 'dark' : 'light')
        }
    }, [])

    useEffect(() => {
        // Apply theme to document
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
        localStorage.setItem('theme', theme)
    }, [theme])

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark')
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white overflow-hidden cursor-none transition-colors duration-300">
            {/* Custom Cursor */}
            <div
                className="fixed pointer-events-none z-50 mix-blend-difference"
                style={{
                    left: `${mousePosition.x}px`,
                    top: `${mousePosition.y}px`,
                    transform: 'translate(-50%, -50%)',
                }}
            >
                <div className="transition-all duration-200">
                    <div className="w-8 h-8 border-2 border-black dark:border-white rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-black dark:bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                </div>
            </div>

            {/* Mouse Trail Effect */}
            <div
                className="fixed pointer-events-none z-40 w-96 h-96 rounded-full opacity-20 blur-3xl bg-gradient-to-br from-black dark:from-white to-transparent"
                style={{
                    left: `${mousePosition.x}px`,
                    top: `${mousePosition.y}px`,
                    transform: 'translate(-50%, -50%)',
                    transition: 'all 0.3s ease-out',
                }}
            ></div>

            {/* Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 z-30 pointer-events-auto bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <a href="#hero" className="text-xl font-bold tracking-tight hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer">
                            Subha Shree Bhawan
                        </a>

                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-1">
                                <div className="relative group/dropdown">
                                    <button className="px-4 py-2 text-sm tracking-wider hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer">
                                        BUILDING A
                                    </button>
                                    <div className="absolute top-full left-0 mt-2 w-48 bg-white/95 dark:bg-black/95 backdrop-blur-md border border-gray-200 dark:border-white/20 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-200">
                                        <a href="#building-a-ground" className="block px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer border-b border-gray-200 dark:border-white/10">Ground Floor</a>
                                        <a href="#building-a-1st" className="block px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer border-b border-gray-200 dark:border-white/10">1st Floor</a>
                                        <a href="#building-a-2nd" className="block px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer border-b border-gray-200 dark:border-white/10">2nd Floor</a>
                                        <a href="#building-a-3rd" className="block px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer border-b border-gray-200 dark:border-white/10">3rd Floor</a>
                                        <a href="#building-a-gym" className="block px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer">Gym (4th-6th)</a>
                                    </div>
                                </div>

                                <div className="relative group/dropdown">
                                    <button className="px-4 py-2 text-sm tracking-wider hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer">
                                        BUILDING B
                                    </button>
                                    <div className="absolute top-full left-0 mt-2 w-48 bg-white/95 dark:bg-black/95 backdrop-blur-md border border-gray-200 dark:border-white/20 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-200">
                                        <a href="#building-b-ground" className="block px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer border-b border-gray-200 dark:border-white/10">Ground Floor</a>
                                        <a href="#building-b-1st" className="block px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer border-b border-gray-200 dark:border-white/10">1st Floor</a>
                                        <a href="#building-b-2nd" className="block px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer">2nd Floor</a>
                                    </div>
                                </div>

                                <a href="#available-spaces" className="px-4 py-2 text-sm tracking-wider hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer">
                                    AVAILABLE SPACES
                                </a>
                            </div>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full border border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/10 transition-all cursor-pointer"
                                aria-label="Toggle theme"
                            >
                                {theme === 'dark' ? (
                                    <Sun className="w-5 h-5" />
                                ) : (
                                    <Moon className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920"
                        alt="Building"
                        className="w-full h-full object-cover opacity-40 dark:opacity-40 scale-105 animate-[zoom_20s_ease-in-out_infinite]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white dark:from-black dark:via-transparent dark:to-black"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                    <div className="opacity-0 animate-[fadeInUp_1s_ease-out_0.2s_forwards]">
                        <div className="inline-block mb-8 px-8 py-3 border border-gray-300 dark:border-white/30 backdrop-blur-sm">
                            <span className="text-sm tracking-[0.3em] font-light">PREMIUM COMMERCIAL COMPLEX</span>
                        </div>
                    </div>

                    <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-8 opacity-0 animate-[fadeInUp_1s_ease-out_0.4s_forwards]">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white">
                            Subha Shree Bhawan
                        </span>
                    </h1>

                    <div className="flex items-center justify-center gap-6 mb-12 opacity-0 animate-[fadeInUp_1s_ease-out_0.6s_forwards]">
                        <div className="h-px w-24 bg-gradient-to-r from-transparent to-gray-900 dark:to-white"></div>
                        <Star className="w-6 h-6" />
                        <div className="h-px w-24 bg-gradient-to-l from-transparent to-gray-900 dark:to-white"></div>
                    </div>

                    <p className="text-2xl md:text-3xl font-light text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto opacity-0 animate-[fadeInUp_1s_ease-out_0.8s_forwards]">
                        Where Business Meets Excellence in Nepal
                    </p>

                    <div className="flex flex-wrap justify-center gap-6 text-sm opacity-0 animate-[fadeInUp_1s_ease-out_1s_forwards]">
                        <div className="flex items-center gap-3 px-6 py-4 border border-gray-300 dark:border-white/20 backdrop-blur-sm hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-300 group">
                            <Building2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="tracking-wider">2 CONNECTED BUILDINGS</span>
                        </div>
                        <div className="flex items-center gap-3 px-6 py-4 border border-gray-300 dark:border-white/20 backdrop-blur-sm hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-300 group">
                            <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="tracking-wider">BALUWATAR, KATHMANDU</span>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-gray-400 dark:border-white/30 rounded-full flex items-start justify-center p-2">
                        <div className="w-1 h-3 bg-gray-900 dark:bg-white rounded-full animate-[scroll_2s_ease-in-out_infinite]"></div>
                    </div>
                </div>
            </section>

            {/* Building A Divider */}
            <div className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-black dark:via-gray-900 dark:to-black"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-6xl md:text-7xl font-bold tracking-tighter mb-4">Building A</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 tracking-wider">SEVEN FLOORS OF EXCELLENCE</p>
                </div>
            </div>

            {/* Building A - Ground Floor */}
            <section id="building-a-ground" className="relative py-32 overflow-hidden group">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=1920"
                        alt="Healthcare and Coffee"
                        className="w-full h-full object-cover grayscale opacity-30 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent dark:from-black dark:via-black/90 dark:to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="inline-block px-4 py-2 border border-gray-300 dark:border-white/30 backdrop-blur-sm">
                                <span className="text-xs tracking-[0.3em]">GROUND FLOOR • BUILDING A</span>
                            </div>

                            <h3 className="text-6xl md:text-7xl font-bold tracking-tight">
                                Tesla Clinic &<br />Himalayan Java
                            </h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4 group/item hover:translate-x-2 transition-transform">
                                    <div className="p-3 border border-gray-300 dark:border-white/20 group-hover/item:border-gray-400 dark:group-hover/item:border-white/40 transition-colors">
                                        <Stethoscope className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold mb-2">Tesla Clinic</h4>
                                        <p className="text-gray-700 dark:text-gray-400 leading-relaxed">Professional healthcare services with modern medical facilities and experienced practitioners</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group/item hover:translate-x-2 transition-transform">
                                    <div className="p-3 border border-gray-300 dark:border-white/20 group-hover/item:border-gray-400 dark:group-hover/item:border-white/40 transition-colors">
                                        <Coffee className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold mb-2">Himalayan Java</h4>
                                        <p className="text-gray-700 dark:text-gray-400 leading-relaxed">Premium coffee experience with authentic Nepali hospitality</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="relative overflow-hidden border border-gray-300 dark:border-white/10 backdrop-blur-sm bg-gray-100 dark:bg-white/5 p-8 hover:border-gray-400 dark:hover:border-white/20 transition-all duration-500 group/card">
                                <img
                                    src="/javatesla.png"
                                    alt="Healthcare"
                                    className="w-full h-96 object-cover grayscale mb-8 group-hover/card:grayscale-0 transition-all duration-700"
                                />
                                <div className="space-y-4 text-sm">
                                    {/* <div className="flex justify-between items-center pb-4 border-b border-gray-300 dark:border-white/10"> */}
                                    {/* <span className="text-gray-600 dark:text-gray-400 tracking-wider">FLOOR AREA</span>
                    <span className="font-semibold">3,500 sq. ft.</span> */}
                                    {/* </div> */}
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400 tracking-wider">FACILITIES</span>
                                        <span className="font-semibold">Clinic + Café</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Building A - 1st Floor */}
            <section id="building-a-1st" className="relative py-32 overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-950 group">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `linear-gradient(45deg, currentColor 1px, transparent 1px), linear-gradient(-45deg, currentColor 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="relative order-2 md:order-1">
                            <div className="relative overflow-hidden border border-gray-300 dark:border-white/10 backdrop-blur-sm bg-gray-100 dark:bg-white/5 p-8 hover:border-gray-400 dark:hover:border-white/20 transition-all duration-500 group/card">
                                <img
                                    src="/vairav.png"
                                    alt="Security"
                                    className="pl-25 w-100 h-100 object-cover grayscale mb-8 group-hover/card:grayscale-0 transition-all duration-700"
                                />
                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between items-center pb-4 border-b border-gray-300 dark:border-white/10">
                                        <span className="text-gray-600 dark:text-gray-400 tracking-wider">FLOOR AREA</span>
                                        <span className="font-semibold">3,500 sq. ft.</span>
                                    </div>
                                    {/* <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400 tracking-wider">SERVICES</span>
                    <span className="font-semibold">24/7 Security Solutions</span>
                  </div> */}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8 order-1 md:order-2">
                            <div className="inline-block px-4 py-2 border border-gray-300 dark:border-white/30 backdrop-blur-sm">
                                <span className="text-xs tracking-[0.3em]">1ST FLOOR • BUILDING A</span>
                            </div>

                            <h3 className="text-6xl md:text-7xl font-bold tracking-tight">
                                Vairav<br />Tech
                            </h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4 group/item hover:translate-x-2 transition-transform">
                                    <div className="p-3 border border-gray-300 dark:border-white/20 group-hover/item:border-gray-400 dark:group-hover/item:border-white/40 transition-colors">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold mb-2">The Leading Security Operation Center Sevice Provider</h4>
                                        {/* <p className="text-gray-700 dark:text-gray-400 leading-relaxed">Comprehensive security solutions including armed guards and surveillance systems</p> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Building A - 2nd Floor (Vacant) */}
            <section id="building-a-2nd" className="relative py-32 overflow-hidden group">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920"
                        alt="Office Space"
                        className="w-full h-full object-cover grayscale opacity-30 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-white via-white/90 to-transparent dark:from-black dark:via-black/90 dark:to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="inline-block px-4 py-2 border border-gray-300 dark:border-white/30 backdrop-blur-sm">
                                <span className="text-xs tracking-[0.3em]">2ND FLOOR • BUILDING A</span>
                            </div>

                            <div className="inline-flex items-center gap-3 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold tracking-wider animate-pulse">
                                <Star className="w-5 h-5" />
                                AVAILABLE FOR LEASE
                            </div>

                            <h3 className="text-6xl md:text-7xl font-bold tracking-tight">
                                Prime Office<br />Space
                            </h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4 group/item hover:translate-x-2 transition-transform">
                                    <div className="p-3 border border-gray-300 dark:border-white/20 group-hover/item:border-gray-400 dark:group-hover/item:border-white/40 transition-colors">
                                        <DoorOpen className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold mb-2">Customizable Layout</h4>
                                        <p className="text-gray-700 dark:text-gray-400 leading-relaxed">Open floor plan ready for your design vision</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="relative overflow-hidden border border-gray-300 dark:border-white/10 backdrop-blur-sm bg-gray-100 dark:bg-white/5 p-8 hover:border-gray-400 dark:hover:border-white/20 transition-all duration-500">
                                <img
                                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"
                                    alt="Office"
                                    className="w-full h-96 object-cover grayscale mb-8"
                                />
                                <div className="space-y-6 text-sm">
                                    <div className="flex justify-between items-center pb-4 border-b border-gray-300 dark:border-white/10">
                                        <span className="text-gray-600 dark:text-gray-400 tracking-wider">FLOOR AREA</span>
                                        <span className="font-bold text-lg">3,500 sq. ft.</span>
                                    </div>
                                    {/* <div className="flex justify-between items-center pb-6 border-b border-gray-300 dark:border-white/10">
                    <span className="text-gray-600 dark:text-gray-400 tracking-wider">MONTHLY RENT</span>
                    <span className="font-bold text-2xl">NPR 2,50,000</span>
                  </div> */}
                                    <div className="pt-4 px-6 py-4 border border-gray-300 dark:border-white/20 bg-gray-200 dark:bg-white/5">
                                        <p className="text-gray-600 dark:text-gray-400 mb-2 tracking-wider text-xs">CONTACT FOR VIEWING</p>
                                        <p className="font-semibold">+977 980-8100067</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Building A - 3rd Floor (Vacant) */}
            <section id="building-a-3rd" className="relative py-32 overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black group">
                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="relative order-2 md:order-1">
                            <div className="relative overflow-hidden border border-gray-300 dark:border-white/10 backdrop-blur-sm bg-gray-100 dark:bg-white/5 p-8 hover:border-gray-400 dark:hover:border-white/20 transition-all duration-500">
                                <img
                                    src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800"
                                    alt="Executive Office"
                                    className="w-full h-96 object-cover grayscale mb-8"
                                />
                                <div className="space-y-6 text-sm">
                                    <div className="flex justify-between items-center pb-4 border-b border-gray-300 dark:border-white/10">
                                        <span className="text-gray-600 dark:text-gray-400 tracking-wider">FLOOR AREA</span>
                                        <span className="font-bold text-lg">3,500 sq. ft.</span>
                                    </div>
                                    <div className="pt-4 px-6 py-4 border border-gray-300 dark:border-white/20 bg-gray-200 dark:bg-white/5">
                                        <p className="text-gray-600 dark:text-gray-400 mb-2 tracking-wider text-xs">CONTACT FOR VIEWING</p>
                                        <p className="font-semibold">+977 980-8100067</p>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="space-y-8 order-1 md:order-2">
                            <div className="inline-block px-4 py-2 border border-gray-300 dark:border-white/30 backdrop-blur-sm">
                                <span className="text-xs tracking-[0.3em]">3RD FLOOR • BUILDING A</span>
                            </div>

                            <div className="inline-flex items-center gap-3 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold tracking-wider animate-pulse">
                                <Star className="w-5 h-5" />
                                AVAILABLE FOR LEASE
                            </div>

                            <h3 className="text-6xl md:text-7xl font-bold tracking-tight">
                                Prime Office<br />Space
                            </h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4 group/item hover:translate-x-2 transition-transform">
                                    <div className="p-3 border border-gray-300 dark:border-white/20 group-hover/item:border-gray-400 dark:group-hover/item:border-white/40 transition-colors">
                                        <Building2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold mb-2">Customizable Layout</h4>
                                        <p className="text-gray-700 dark:text-gray-400 leading-relaxed">Open floor plan ready for your design vision</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Building A - Gym Section */}
            <section id="building-a-gym" className="relative py-32 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920"
                        alt="Gym"
                        className="w-full h-full object-cover grayscale opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white dark:from-black dark:via-transparent dark:to-black"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <div className="inline-block mb-8 px-4 py-2 border border-gray-300 dark:border-white/30 backdrop-blur-sm">
                            <span className="text-xs tracking-[0.3em]">4TH, 5TH AND 6TH FLOORS • BUILDING A</span>
                        </div>
                        <h3 className="text-7xl md:text-8xl font-bold tracking-tighter mb-6">Premium Fitness Center  <br /> COMING SOON!!!</h3>
                        <p className="text-xl text-gray-600 dark:text-gray-400 tracking-wider">THREE FLOORS OF WELLNESS</p>
                    </div>

                
                </div>
            </section>

            {/* Available Spaces Section */}
            <section id="available-spaces" className="relative py-32 overflow-hidden bg-white dark:bg-black">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }}></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <div className="inline-block mb-8 px-8 py-3 border border-gray-300 dark:border-white/30 backdrop-blur-sm">
                            <span className="text-sm tracking-[0.3em] font-light">INVESTMENT OPPORTUNITIES</span>
                        </div>
                        <h2 className="text-7xl md:text-8xl font-bold tracking-tighter mb-6">Available Spaces</h2>
                        <p className="text-2xl text-gray-600 dark:text-gray-400 tracking-wider max-w-3xl mx-auto">
                            Premium commercial floors ready for immediate occupancy
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {/* Building A - 2nd Floor */}
                        <div className="group relative overflow-hidden border border-gray-300 dark:border-white/20 bg-gradient-to-br from-gray-100 dark:from-white/5 to-transparent hover:border-gray-400 dark:hover:border-white/40 transition-all duration-500">
                            <div className="absolute top-0 right-0 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold text-sm tracking-wider">
                                AVAILABLE NOW
                            </div>

                            <div className="p-10">
                                <div className="mb-8">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 tracking-[0.3em] mb-3">BUILDING A</p>
                                    <h3 className="text-5xl font-bold mb-4 tracking-tight">2nd Floor</h3>
                                    <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">Prime Office Space</p>
                                </div>

                                <div className="space-y-6 mb-8">
                                    <div className="flex justify-between items-center pb-4 border-b border-gray-300 dark:border-white/10">
                                        <span className="text-gray-600 dark:text-gray-400 tracking-wider text-sm">FLOOR AREA</span>
                                        <span className="text-2xl font-bold">3,500 sq. ft.</span>
                                    </div>

                                    {/* <div className="flex justify-between items-center pb-4 border-b border-gray-300 dark:border-white/10">
                                        <span className="text-gray-600 dark:text-gray-400 tracking-wider text-sm">MONTHLY RENT</span>
                                        <span className="text-3xl font-bold">NPR 2,50,000</span>
                                    </div> */}

                                    <div className="flex justify-between items-center pb-4 border-b border-gray-300 dark:border-white/10">
                                        <span className="text-gray-600 dark:text-gray-400 tracking-wider text-sm">TYPE</span>
                                        <span className="font-semibold">FOR LEASE</span>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                                        <ArrowRight className="w-4 h-4" />
                                        <span>Open floor plan - customizable layout</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                                        <ArrowRight className="w-4 h-4" />
                                        <span>Perfect for corporate offices</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                                        <ArrowRight className="w-4 h-4" />
                                        <span>Tech companies & professional firms</span>
                                    </div>
                                </div>

                                <div className="border border-gray-300 dark:border-white/20 bg-gray-200 dark:bg-white/5 p-6">
                                    <p className="text-xs tracking-wider text-gray-600 dark:text-gray-400 mb-2">CONTACT FOR VIEWING</p>
                                    <p className="text-lg font-bold">+977 9808100067</p>
                                </div>
                            </div>
                        </div>

                        {/* Building A - 3rd Floor */}
                        <div className="group relative overflow-hidden border border-gray-300 dark:border-white/20 bg-gradient-to-br from-gray-100 dark:from-white/5 to-transparent hover:border-gray-400 dark:hover:border-white/40 transition-all duration-500">
                            {/* <div className="absolute top-0 right-0 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold text-sm tracking-wider">
                                SPECIAL OFFER
                            </div> */}

                            <div className="p-10">
                                <div className="mb-8">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 tracking-[0.3em] mb-3">BUILDING A</p>
                                    <h3 className="text-5xl font-bold mb-4 tracking-tight">3rd Floor</h3>
                                    <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">Prime Office Space</p>
                                </div>

                                <div className="space-y-6 mb-8">
                                    <div className="flex justify-between items-center pb-4 border-b border-gray-300 dark:border-white/10">
                                        <span className="text-gray-600 dark:text-gray-400 tracking-wider text-sm">FLOOR AREA</span>
                                        <span className="text-2xl font-bold">3,500 sq. ft.</span>
                                    </div>

                                    <div className="flex justify-between items-center pb-4 border-b border-gray-300 dark:border-white/10">
                                        <span className="text-gray-600 dark:text-gray-400 tracking-wider text-sm">TYPE</span>
                                        <span className="font-semibold">FOR LEASE</span>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                                        <ArrowRight className="w-4 h-4" />
                                        <span>Customizable open floor plan</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                                        <ArrowRight className="w-4 h-4" />
                                        <span>Ready for your design vision</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                                        <ArrowRight className="w-4 h-4" />
                                        <span>Flexible lease terms available</span>
                                    </div>
                                </div>

                                <div className="border border-gray-300 dark:border-white/20 bg-gray-200 dark:bg-white/5 p-6">
                                    <p className="text-xs tracking-wider text-gray-600 dark:text-gray-400 mb-2">CONTACT FOR VIEWING</p>
                                    <p className="text-lg font-bold">+977 9808100067</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 text-center">
                        <div className="inline-block border border-gray-300 dark:border-white/20 bg-gray-100 dark:bg-white/5 p-10 max-w-2xl">
                            <h4 className="text-2xl font-bold mb-4 tracking-tight">Interested in Leasing?</h4>
                            <p className="text-gray-700 dark:text-gray-400 mb-6 leading-relaxed">
                                Schedule a viewing or request detailed floor plans and lease terms
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <div className="border border-gray-300 dark:border-white/30 px-8 py-4 hover:bg-gray-200 dark:hover:bg-white/5 transition-all">
                                    <Phone className="w-5 h-5 inline mr-2" />
                                    <span className="font-semibold">+977 9808100067</span>
                                </div>
                                <div className="border border-gray-300 dark:border-white/30 px-8 py-4 hover:bg-gray-200 dark:hover:bg-white/5 transition-all">
                                    <Mail className="w-5 h-5 inline mr-2" />
                                    <span className="font-semibold">buddhalife.np@gmail.com</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Building B Divider */}
            <div className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-black dark:via-gray-900 dark:to-black"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-6xl md:text-7xl font-bold tracking-tighter mb-4">Building B</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 tracking-wider">CONNECTED EXCELLENCE</p>
                </div>
            </div>

            {/* Building B - Ground Floor */}
            <section id="building-b-ground" className="relative py-32 overflow-hidden group">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920"
                        alt="Restaurant"
                        className="w-full h-full object-cover grayscale opacity-30 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent dark:from-black dark:via-black/90 dark:to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="inline-block px-4 py-2 border border-gray-300 dark:border-white/30 backdrop-blur-sm">
                                <span className="text-xs tracking-[0.3em]">GROUND FLOOR • BUILDING B</span>
                            </div>

                            <h3 className="text-6xl md:text-7xl font-bold tracking-tight">
                                Elements<br />Restaurant
                            </h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4 group/item hover:translate-x-2 transition-transform">
                                    <div className="p-3 border border-gray-300 dark:border-white/20 group-hover/item:border-gray-400 dark:group-hover/item:border-white/40 transition-colors">
                                        <Utensils className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold mb-2">Fine Dining Experience</h4>
                                        <p className="text-gray-700 dark:text-gray-400 leading-relaxed">Contemporary Nepali and international cuisine crafted by award-winning chefs</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="relative overflow-hidden border border-gray-300 dark:border-white/10 backdrop-blur-sm bg-gray-100 dark:bg-white/5 p-8 hover:border-gray-400 dark:hover:border-white/20 transition-all duration-500 group/card">
                                <img
                                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800"
                                    alt="Restaurant"
                                    className="w-full h-96 object-cover grayscale mb-8 group-hover/card:grayscale-0 transition-all duration-700"
                                />
                                <div className="space-y-4 text-sm">
                                    {/* <div className="flex justify-between items-center pb-4 border-b border-gray-300 dark:border-white/10">
                                        <span className="text-gray-600 dark:text-gray-400 tracking-wider">SEATING</span>
                                        <span className="font-semibold">120 guests</span>
                                    </div> */}
                                    {/* <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400 tracking-wider">HOURS</span>
                                        <span className="font-semibold">11 AM - 11 PM</span>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Building B - 1st Floor */}
            <section id="building-b-1st" className="relative py-32 overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-950 group">
                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="relative order-2 md:order-1">
                            <div className="relative overflow-hidden border border-gray-300 dark:border-white/10 backdrop-blur-sm bg-gray-100 dark:bg-white/5 p-8 hover:border-gray-400 dark:hover:border-white/20 transition-all duration-500 group/card">
                                <img
                                    src="https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800"
                                    alt="Cinema"
                                    className="w-full h-96 object-cover grayscale mb-8 group-hover/card:grayscale-0 transition-all duration-700"
                                />
                                <div className="space-y-4 text-sm">
                                    {/* <div className="flex justify-between items-center pb-4 border-b border-gray-300 dark:border-white/10">
                                        <span className="text-gray-600 dark:text-gray-400 tracking-wider">HALL SIZE</span>
                                        <span className="font-semibold">2,500 sq. ft.</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400 tracking-wider">TECHNOLOGY</span>
                                        <span className="font-semibold">Dolby Sound</span>
                                    </div> */}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8 order-1 md:order-2">
                            <div className="inline-block px-4 py-2 border border-gray-300 dark:border-white/30 backdrop-blur-sm">
                                <span className="text-xs tracking-[0.3em]">1ST FLOOR • BUILDING B</span>
                            </div>

                            <h3 className="text-6xl md:text-7xl font-bold tracking-tight">
                                Swopna<br />Chitra
                            </h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4 group/item hover:translate-x-2 transition-transform">
                                    <div className="p-3 border border-gray-300 dark:border-white/20 group-hover/item:border-gray-400 dark:group-hover/item:border-white/40 transition-colors">
                                        <Film className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold mb-2">Production House</h4>
                                        {/* <p className="text-gray-700 dark:text-gray-400 leading-relaxed">Premium movie theater with state-of-the-art projection and sound</p> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Building B - 2nd Floor */}
            <section id="building-b-2nd" className="relative py-32 overflow-hidden group">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920"
                        alt="Tech Office"
                        className="w-full h-full object-cover grayscale opacity-30 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-white via-white/90 to-transparent dark:from-black dark:via-black/90 dark:to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="inline-block px-4 py-2 border border-gray-300 dark:border-white/30 backdrop-blur-sm">
                                <span className="text-xs tracking-[0.3em]">2ND FLOOR • BUILDING B</span>
                            </div>

                            <h3 className="text-6xl md:text-7xl font-bold tracking-tight">
                                Moon<br />Technology
                            </h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4 group/item hover:translate-x-2 transition-transform">
                                    <div className="p-3 border border-gray-300 dark:border-white/20 group-hover/item:border-gray-400 dark:group-hover/item:border-white/40 transition-colors">
                                        <Laptop className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold mb-2">IT Solutions & Services</h4>
                                        <p className="text-gray-700 dark:text-gray-400 leading-relaxed">Leading technology company providing software development and cloud solutions</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="relative overflow-hidden border border-gray-300 dark:border-white/10 backdrop-blur-sm bg-gray-100 dark:bg-white/5 p-8 hover:border-gray-400 dark:hover:border-white/20 transition-all duration-500 group/card">
                                <img
                                    src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800"
                                    alt="Tech Office"
                                    className="w-full h-96 object-cover grayscale mb-8 group-hover/card:grayscale-0 transition-all duration-700"
                                />
                                <div className="space-y-4 text-sm">
                                    {/* <div className="flex justify-between items-center pb-4 border-b border-gray-300 dark:border-white/10">
                                        <span className="text-gray-600 dark:text-gray-400 tracking-wider">OFFICE AREA</span>
                                        <span className="font-semibold">2,800 sq. ft.</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400 tracking-wider">TEAM SIZE</span>
                                        <span className="font-semibold">30+ Professionals</span>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative py-24 overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black border-t border-gray-300 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-16 mb-16">
                        <div>
                            <h3 className="text-3xl font-bold mb-6 tracking-tight">Subha Shree Bhawan</h3>
                            <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                                Nepal's premier commercial complex offering world-class business spaces and amenities
                            </p>
                        </div>

                        <div>
                            <h4 className="text-xl font-semibold mb-6 tracking-wider">CONTACT</h4>
                            <div className="space-y-4 text-gray-700 dark:text-gray-400">
                                <div className="flex items-center gap-3 group hover:text-black dark:hover:text-white transition-colors">
                                    <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span>Kathmandu, Nepal</span>
                                </div>
                                <div className="flex items-center gap-3 group hover:text-black dark:hover:text-white transition-colors">
                                    <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span>+977 980-8100067</span>
                                </div>
                                <div className="flex items-center gap-3 group hover:text-black dark:hover:text-white transition-colors">
                                    <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span>buddhalife.np@gmail.com</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xl font-semibold mb-6 tracking-wider">FEATURES</h4>
                            <ul className="space-y-3 text-gray-700 dark:text-gray-400">
                                <li className="flex items-center gap-2 hover:text-black dark:hover:text-white transition-colors">
                                    <ArrowRight className="w-4 h-4" /> Prime location</li>
                                <li className="flex items-center gap-2 hover:text-black dark:hover:text-white transition-colors">
                                    <ArrowRight className="w-4 h-4" /> Modern infrastructure</li>
                                <li className="flex items-center gap-2 hover:text-black dark:hover:text-white transition-colors">
                                    <ArrowRight className="w-4 h-4" /> 24/7 security</li>
                                <li className="flex items-center gap-2 hover:text-black dark:hover:text-white transition-colors">
                                    <ArrowRight className="w-4 h-4" /> Ungerground parking</li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-300 dark:border-white/10 text-center text-gray-500 text-sm">
                        <p>&copy; 2026 Subha Shree Bhawan. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes zoom {
          0%, 100% {
            transform: scale(1.05);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes scroll {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(8px);
          }
          100% {
            transform: translateY(0);
          }
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
        </div>
    )
}
