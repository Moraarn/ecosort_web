export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Upload Photo",
      description: "Take a photo of your waste item using our mobile app"
    },
    {
      id: 2,
      title: "AI Analysis",
      description: "Our AI identifies the waste type and provides sorting instructions"
    },
    {
      id: 3,
      title: "Dispose Properly",
      description: "Follow instructions and dispose at the correct collection point"
    },
    {
      id: 4,
      title: "Earn Rewards",
      description: "Scan QR code and earn points for proper disposal"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How EcoSort AI Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simple 4-step process to transform waste management in your community
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.id} className="text-center">
              <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                {step.id}
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
