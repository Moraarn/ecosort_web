export default function FeaturesGrid() {
  const features = [
    {
      id: 1,
      title: "AI Classification",
      description: "Advanced computer vision identifies waste types with 87% accuracy, providing instant sorting instructions.",
      image: "https://i.pinimg.com/736x/39/99/34/3999340e739208bf710b61630aecf90e.jpg",
      bgColor: "bg-green-100"
    },
    {
      id: 2,
      title: "USSD Service",
      description: "Dial *123# for instant recycling guidance in 7 local languages including Swahili, Luganda, and Kikuyu.",
      image: "https://i.pinimg.com/736x/1a/13/0a/1a130a3b198ce31d3c07bc280b2225be.jpg",
      bgColor: "bg-green-100"
    },
    {
      id: 3,
      title: "QR Tracking",
      description: "Smart QR codes at disposal points track waste collection and verify proper disposal for rewards.",
      image: "https://i.pinimg.com/1200x/6c/d8/6b/6cd86bd9835465dfa61080617bcdcf08.jpg",
      bgColor: "bg-green-100"
    },
    {
      id: 4,
      title: "Reward System",
      description: "Earn points for proper waste disposal and redeem rewards from local partners.",
      image: "https://i.pinimg.com/1200x/cc/9b/12/cc9b12ef7854106ef43f38d909b3c38d.jpg",
      bgColor: "bg-green-100"
    },
    {
      id: 5,
      title: "Analytics Dashboard",
      description: "Real-time insights into waste patterns, collection efficiency, and environmental impact.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop&crop=center",
      bgColor: "bg-green-100"
    },
    {
      id: 6,
      title: "Environmental Impact",
      description: "Track CO₂ reduction, recycling rates, and contribution to sustainable development goals.",
      image: "https://i.pinimg.com/736x/8e/8b/31/8e8b312d89ff6265932c9a5081318af2.jpg",
      bgColor: "bg-green-100"
    },
    {
      id: 7,
      title: "IoT Integration",
      description: "Smart bin monitoring with fill-level sensors and automated collection alerts.",
      image: "https://i.pinimg.com/1200x/ad/54/18/ad5418b8b432180454ec774195f3bb26.jpg",
      bgColor: "bg-green-100"
    },
    {
      id: 8,
      title: "Multi-Language Support",
      description: "Accessible in English, Swahili, Luganda, Kikuyu, Luo, Kalenjin, and Runyankole for inclusive community engagement.",
      image: "https://i.pinimg.com/1200x/a6/d1/54/a6d154515d4599844a70c1ad7e46ffbe.jpg",
      bgColor: "bg-green-100"
    }
  ];

  return (
    <section id="features" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 ">
            Powerful Features for Sustainable Communities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to manage waste efficiently and reward sustainable behavior
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="bg-white rounded-2xl border border-gray-200 hover:shadow-lg hover:text-primary transition-shadow overflow-hidden">
              <img 
                src={feature.image}
                alt={feature.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
