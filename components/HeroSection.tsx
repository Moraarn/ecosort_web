import Link from "next/link";
import { HERO_IMAGE } from "../lib/constants/images";

export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 relative min-h-screen flex items-center">
      <img 
        src={HERO_IMAGE}
        alt="African Waste Management Hero"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-white">
            
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Transform Waste into <span className="text-green-400">Environmental Wealth</span>
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed max-w-lg">
              AI-powered waste categorization and recycling incentive platform that helps communities 
              sort waste correctly while earning rewards for sustainable behavior.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/scan">
                <button className="bg-green-500 text-white px-8 py-4 rounded-full hover:bg-green-600 transition-colors font-medium">
                  Start Free Trial
                </button>
              </Link>
              <button className="border border-green-400 text-green-400 px-8 py-4 rounded-full hover:bg-green-400 hover:text-white transition-colors font-medium">
                Watch Demo
              </button>
            </div>
            
            <div className="flex items-center space-x-8 pt-4">
              <div>
                <div className="text-2xl font-bold text-white">15K+</div>
                <div className="text-sm text-gray-300">Active Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">250T</div>
                <div className="text-sm text-gray-300">Waste Recycled</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">87%</div>
                <div className="text-sm text-gray-300">Accuracy Rate</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-[var(--primary)]/20 backdrop-blur-md rounded-3xl transform rotate-3"></div>
            <div className="relative bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden ">
              <div className="aspect-video overflow-hidden">
                <video 
                  src="/Download.mp4" 
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>
              <div className="p-6 backdrop-blur-md">
                <div className="flex items-center space-x-2 text-sm text-gray-200">
                  <span className="w-2 h-2 bg-[var(--primary)] rounded-full"></span>
                  <span>Real-time waste detection</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-200 mt-1">
                  <span className="w-2 h-2 bg-[var(--primary)] rounded-full"></span>
                  <span>Smart sorting instructions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
