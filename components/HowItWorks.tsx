export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Scan QR code/Upload and Image",
      description: "Check for a QR code on the trash or upload an image of the trash",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 2,
      title: "Deposit in Smart Bin",
      description: "Throw your trash in the same bin instructed by the system",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 3a2 2 0 012-2h4a2 2 0 012 2M8 3v2M16 3v2M16 5a2 2 0 012 2v1" />
        </svg>
      )
    },
    {
      id: 3,
      title: "Earn your reward",
      description: "Redeemable points will immediately be deposited in your account.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            HOW IT WORKS
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.id} className="border-2 border-green-600 rounded-lg p-8 text-center bg-white">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
