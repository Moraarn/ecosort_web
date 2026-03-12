import { SUPPORTED_LANGUAGES } from "@/types/languages"

export default function USSDSection() {
  const languages = SUPPORTED_LANGUAGES.map(lang => ({
    ...lang,
    greeting: lang.code === 'en' ? 'Welcome to EcoSort AI' :
            lang.code === 'sw' ? 'Karibu EcoSort AI' :
            lang.code === 'lg' ? 'Wangeeko ku EcoSort AI' :
            lang.code === 'ki' ? 'Nĩmũhũgwo wa EcoSort AI' :
            lang.code === 'lu' ? 'Ponyo EcoSort AI' :
            lang.code === 'ka' ? 'Eko EcoSort AI' :
            'Nimugye EcoSort AI'
  }));

  const menuOptions = [
    { number: "1", title: "Waste Disposal Guide", desc: "Learn how to sort different types of waste" },
    { number: "2", title: "Recycling Points", desc: "Find nearby recycling centers and earn points" },
    { number: "3", title: "Collection Schedule", desc: "Check waste collection times in your area" },
    { number: "4", title: "Environmental Tips", desc: "Get eco-friendly tips and best practices" }
  ];

  return (
    <section id="ussd" className="py-20 px-4 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 00.502.861l1.498-4.493A1 1 0 018.28 3H5a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            USSD Service - Accessible to Everyone
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dial *123# from any phone for instant recycling guidance in your local language. No internet required!
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Left: Phone Demo */}
          <div className="flex flex-col items-center">
            <div className="bg-gray-800 rounded-3xl p-2 shadow-2xl max-w-xs w-full">
              <div className="bg-black rounded-2xl overflow-hidden">
                {/* Status Bar */}
                <div className="bg-gray-900 px-4 py-1 flex justify-between items-center">
                  <span className="text-white text-xs">9:41 AM</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-3 border border-white rounded-sm">
                      <div className="w-2 h-1 bg-white rounded-sm m-0.5"></div>
                    </div>
                    <div className="w-1 h-2 bg-white rounded-sm"></div>
                  </div>
                </div>

                {/* USSD Display */}
                <div className="bg-green-50 p-4 min-h-[250px] font-mono text-sm">
                  <div className="space-y-3">
                    <div className="text-green-900 font-bold">
                      <div className="flex items-start">
                        <span className="mr-2">{'<'}</span>
                        <span className="whitespace-pre-wrap">Karibu EcoSort AI</span>
                      </div>
                    </div>
                    <div className="text-green-900">
                      <div className="flex items-start">
                        <span className="mr-2">{'<'}</span>
                        <span className="whitespace-pre-wrap">Main Menu:</span>
                      </div>
                    </div>
                    <div className="text-green-900">
                      <div className="flex items-start">
                        <span className="mr-2">{'<'}</span>
                        <span className="whitespace-pre-wrap">1. Mwongozo wa Taka</span>
                      </div>
                    </div>
                    <div className="text-green-900">
                      <div className="flex items-start">
                        <span className="mr-2">{'<'}</span>
                        <span className="whitespace-pre-wrap">2. Ebiina byo</span>
                      </div>
                    </div>
                    <div className="text-green-900">
                      <div className="flex items-start">
                        <span className="mr-2">{'<'}</span>
                        <span className="whitespace-pre-wrap">3. Harabu ya Taka</span>
                      </div>
                    </div>
                    <div className="text-green-900">
                      <div className="flex items-start">
                        <span className="mr-2">{'<'}</span>
                        <span className="whitespace-pre-wrap">4. Amannya ga Taka</span>
                      </div>
                    </div>
                    <div className="text-green-700">
                      <div className="flex items-center">
                        <span className="mr-2 font-bold">{'>'}</span>
                        <span>1</span>
                        <span className="animate-pulse ml-1">_</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phone Keypad Preview */}
                <div className="bg-gray-100 p-3">
                  <div className="grid grid-cols-3 gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((key) => (
                      <div
                        key={key}
                        className={`py-2 rounded text-center text-xs font-bold ${
                          key === '*' || key === '#'
                            ? 'bg-gray-300 text-gray-700'
                            : 'bg-white text-gray-900 border border-gray-300'
                        }`}
                      >
                        {key}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <div className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-full font-bold shadow-lg">
                <span className="text-lg mr-2">📱</span>
                <span>Dial *123#</span>
              </div>
            </div>
          </div>

          {/* Right: Features & Languages */}
          <div className="space-y-8">
            {/* How It Works */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h3>
              <div className="space-y-4">
                {menuOptions.map((option) => (
                  <div key={option.number} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                      {option.number}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{option.title}</h4>
                      <p className="text-gray-600 text-sm">{option.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Benefits */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Why USSD?</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-2xl mb-2">🌐</div>
                  <h4 className="font-semibold text-gray-900">No Internet Required</h4>
                  <p className="text-gray-600 text-sm">Works on any basic mobile phone</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-2xl mb-2">🗣️</div>
                  <h4 className="font-semibold text-gray-900">Local Languages</h4>
                  <p className="text-gray-600 text-sm">7 African languages supported</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-2xl mb-2">⚡</div>
                  <h4 className="font-semibold text-gray-900">Instant Access</h4>
                  <p className="text-gray-600 text-sm">24/7 availability everywhere</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-2xl mb-2">📱</div>
                  <h4 className="font-semibold text-gray-900">Universal Compatible</h4>
                  <p className="text-gray-600 text-sm">Works on all mobile networks</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Languages Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Supported Local Languages</h3>
            <p className="text-gray-600">Breaking language barriers for inclusive communities</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {languages.map((lang) => (
              <div key={lang.code} className="text-center">
                <div className="text-3xl mb-2">{lang.flag}</div>
                <h4 className="font-semibold text-gray-900 text-sm">{lang.name}</h4>
                <p className="text-xs text-gray-600 mt-1">{lang.greeting}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-blue-800 text-sm font-medium">
                More languages coming soon! We're committed to serving all communities.
              </span>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Try It Now!</h3>
            <p className="text-lg mb-6">Pick up any phone and dial *123# to experience the future of recycling in your language.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-white text-green-600 px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                📱 *123#
              </div>
              <button className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-full font-bold transition-colors">
                Learn More →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
