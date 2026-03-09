import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <div className="bg-green-100 text-green-800 border-green-200 rounded-full px-4 py-2 inline-block">
            🌍 Smart Waste Management for African Cities
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            EcoSort AI
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI-powered waste categorization and recycling incentive platform that helps communities 
            sort waste correctly while earning rewards for sustainable behavior.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-medium">
                Get Started
              </button>
            </Link>
            <Link href="/auth/login">
              <button className="border border-gray-300 hover:bg-gray-50 px-8 py-3 rounded-lg text-lg font-medium">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Simple 4-step process to make waste sorting easy and rewarding
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center border">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              📷
            </div>
            <h3 className="text-lg font-semibold mb-2">1. Capture</h3>
            <p className="text-gray-600 text-sm">
              Take a photo of your waste item using our mobile app
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center border">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              🌿
            </div>
            <h3 className="text-lg font-semibold mb-2">2. Classify</h3>
            <p className="text-gray-600 text-sm">
              AI instantly identifies the waste type and disposal instructions
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center border">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              📱
            </div>
            <h3 className="text-lg font-semibold mb-2">3. Scan QR</h3>
            <p className="text-gray-600 text-sm">
              Scan the QR code at the disposal location to confirm
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center border">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              🏆
            </div>
            <h3 className="text-lg font-semibold mb-2">4. Earn</h3>
            <p className="text-gray-600 text-sm">
              Earn points and rewards for correct waste disposal
            </p>
          </div>
        </div>
      </section>

      {/* Status Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Installation Status</h2>
            <p className="text-gray-600">
              The dependencies are being installed. The full UI components will be available once installation completes.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-semibold text-yellow-800 mb-2">🚧 Under Development</h3>
            <p className="text-yellow-700 text-sm">
              This is a simplified version of the landing page. The full EcoSort AI experience includes:
            </p>
            <ul className="mt-3 space-y-1 text-yellow-700 text-sm">
              <li>• AI-powered waste classification</li>
              <li>• QR code scanning and tracking</li>
              <li>• Rewards and gamification system</li>
              <li>• Admin analytics dashboard</li>
              <li>• Mobile-optimized interface</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Waste Management?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users making a difference in their communities
          </p>
          <Link href="/auth/signup">
            <button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-medium">
              Start Your Eco Journey Today
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
