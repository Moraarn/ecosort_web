import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with African Context */}
      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900/90 via-emerald-800/85 to-teal-700/80"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593784997443-7465e69c6899?w=1920&h=1080&fit=crop&auto=format')] bg-cover bg-center opacity-30"></div>
        </div>
        
        <div className="relative container mx-auto px-4 z-10">
          <div className="text-center space-y-8 max-w-5xl mx-auto">
            {/* African Context Badge */}
            <div className="inline-flex items-center bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/30 text-yellow-100 rounded-full px-6 py-3">
              <span className="w-3 h-3 bg-yellow-400 rounded-full mr-3 animate-pulse"></span>
              <span className="font-semibold">🌍 Transforming Waste Management Across African Cities</span>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              From Waste to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400"> Wealth</span>
            </h1>
            
            {/* Compelling Subtitle */}
            <p className="text-xl md:text-2xl text-orange-100 max-w-4xl mx-auto leading-relaxed">
              Empowering Kenyan communities to turn everyday waste into valuable resources through AI-powered sorting, 
              creating cleaner streets, healthier environments, and economic opportunities for all.
            </p>
            
            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all transform hover:scale-105 shadow-2xl">
                  🌱 Start Your Eco Journey
                </button>
              </Link>
              <Link href="/auth/login">
                <button className="border-2 border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all backdrop-blur-sm">
                  Sign In
                </button>
              </Link>
            </div>
            
            {/* Impact Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400">15K+</div>
                <div className="text-orange-100 font-medium">Active Kenyans</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400">250T</div>
                <div className="text-orange-100 font-medium">Waste Recycled</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400">87%</div>
                <div className="text-orange-100 font-medium">Sorting Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400">KES 2.5M</div>
                <div className="text-orange-100 font-medium">Community Earnings</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Success Stories with Images */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Stories from Our Communities</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real Kenyans making a real difference with EcoSort AI
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-orange-600/10 to-emerald-600/10 backdrop-blur-sm border border-orange-500/20 rounded-2xl overflow-hidden">
              <div className="h-32 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1573164574511-73c53e33e0f4?w=400&h=150&fit=crop&auto=format')"}}></div>
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">JM</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Jane Muthoni</h3>
                    <p className="text-gray-400 text-sm">Kawangware, Nairobi</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">
                  "EcoSort helps me earn extra money for my family while keeping our neighborhood clean. 
                  I've earned KES 3,000 this month just from proper waste sorting!"
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600/10 to-cyan-600/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl overflow-hidden">
              <div className="h-32 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1517048676744-dc14c7145b69?w=400&h=150&fit=crop&auto=format')"}}></div>
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">KO</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Kevin Otieno</h3>
                    <p className="text-gray-400 text-sm">Kibera, Nairobi</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">
                  "As a youth leader, I've organized 50+ households to use EcoSort. 
                  Our estate is now the cleanest in the area!"
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-600/10 to-orange-600/10 backdrop-blur-sm border border-yellow-500/20 rounded-2xl overflow-hidden">
              <div className="h-32 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c54fd67?w=400&h=150&fit=crop&auto=format')"}}></div>
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">PW</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Peninah Wanjiku</h3>
                    <p className="text-gray-400 text-sm">Mombasa County</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">
                  "The app is so easy to use even my grandmother can sort waste properly now. 
                  We use the points to buy school supplies for the children."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section - Real African Context */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold text-white mb-4">
                  The Challenge We Face Daily
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  In Nairobi and cities across Africa, improper waste management affects millions. 
                  Overflowing dumpsites, blocked drainage systems, and environmental pollution 
                  impact our health, economy, and future generations.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🏭</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">Industrial Waste</h3>
                      <p className="text-gray-400">Factories and businesses struggle with proper disposal systems</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🏘️</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">Residential Overflow</h3>
                      <p className="text-gray-400">Neighborhoods face daily challenges with waste collection</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🌊</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">Environmental Impact</h3>
                      <p className="text-gray-400">Rivers and ecosystems suffer from pollution</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-blue-600/20 rounded-2xl"></div>
                <img 
                  src="https://images.unsplash.com/photo-1584473297446-8bf5c2144f1c?w=600&h=400&fit=crop&auto=format" 
                  alt="Dandora Dumpsite, Nairobi - Waste management challenge in Africa"
                  className="relative rounded-2xl shadow-2xl w-full"
                />
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-white text-sm font-medium">Dandora Dumpsite, Nairobi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section with Images */}
      <section id="features" className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our African Solution</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Technology meets tradition to create sustainable waste management for our communities
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-orange-600/10 to-emerald-600/10 backdrop-blur-sm border border-orange-500/20 rounded-2xl overflow-hidden hover:shadow-2xl transition-all hover:scale-105">
              <div className="h-48 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=200&fit=crop&auto=format')"}}></div>
              <div className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-3xl">🤖</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">AI That Understands Africa</h3>
                <p className="text-gray-300 mb-4">
                  Trained on African waste patterns, our AI recognizes local materials, 
                  packaging types, and disposal methods specific to our environment.
                </p>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                    Local plastic sachets & bags
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                    Traditional waste materials
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                    95%+ accuracy rate
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600/10 to-cyan-600/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl overflow-hidden hover:shadow-2xl transition-all hover:scale-105">
              <div className="h-48 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop&auto=format')"}}></div>
              <div className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-3xl">📱</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Smart QR Tracking</h3>
                <p className="text-gray-300 mb-4">
                  Every collection point has a unique QR code. Scan to confirm disposal, 
                  earn instant rewards, and help municipalities track waste patterns.
                </p>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                    Works on basic smartphones
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                    Offline capability
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                    GPS location tracking
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-600/10 to-orange-600/10 backdrop-blur-sm border border-yellow-500/20 rounded-2xl overflow-hidden hover:shadow-2xl transition-all hover:scale-105">
              <div className="h-48 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop&auto=format')"}}></div>
              <div className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-3xl">💰</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Real Economic Value</h3>
                <p className="text-gray-300 mb-4">
                  Earn points redeemable for mobile money, airtime, or local services. 
                  Turn your daily waste into tangible rewards for your family.
                </p>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                    M-Pesa integration
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                    Local business partnerships
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                    Community rewards
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Impact Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Real Impact, Real Images</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how EcoSort AI is transforming communities across Africa
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="relative group overflow-hidden rounded-2xl">
              <img 
                src="https://images.unsplash.com/photo-1593784997443-7465e69c6899?w=400&h=300&fit=crop&auto=format" 
                alt="Recycling center in Africa"
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-bold">Modern Recycling Centers</p>
                  <p className="text-sm">Transforming waste management</p>
                </div>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-2xl">
              <img 
                src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop&auto=format" 
                alt="Community waste sorting"
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-bold">Community Action</p>
                  <p className="text-sm">People working together</p>
                </div>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-2xl">
              <img 
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&auto=format" 
                alt="Mobile technology for waste management"
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-bold">Mobile Technology</p>
                  <p className="text-sm">Smart waste tracking</p>
                </div>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-2xl">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format" 
                alt="Clean African neighborhood"
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-bold">Clean Communities</p>
                  <p className="text-sm">Better living environments</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-600 via-emerald-600 to-teal-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Be Part of Africa's orange Revolution
          </h2>
          <p className="text-xl mb-8 text-orange-100 max-w-2xl mx-auto">
            Join thousands of Kenyans transforming waste into wealth, one disposal at a time. 
            Together, we're building cleaner, healthier, and more prosperous communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 rounded-xl text-lg font-bold transition-all transform hover:scale-105 shadow-2xl">
                🌱 Start Your Eco Journey Today
              </button>
            </Link>
            <Link href="#features">
              <button className="border-2 border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all backdrop-blur-sm">
                Learn More
              </button>
            </Link>
          </div>
          
          <div className="mt-12 flex justify-center space-x-8 text-orange-100">
            <div className="text-center">
              <div className="text-2xl font-bold">🇰🇪</div>
              <div className="text-sm">Made for Kenya</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">🌍</div>
              <div className="text-sm">Built for Africa</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">💚</div>
              <div className="text-sm">orange Future</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
