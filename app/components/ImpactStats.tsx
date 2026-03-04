export default function ImpactStats() {
  const stats = [
    {
      id: 1,
      value: "15,000+",
      label: "Active Users"
    },
    {
      id: 2,
      value: "250T",
      label: "Waste Recycled"
    },
    {
      id: 3,
      value: "KES 2.5M",
      label: "Community Earnings"
    },
    {
      id: 4,
      value: "3.2T",
      label: "CO₂ Reduced Monthly"
    }
  ];

  return (
    <section id="impact" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Making a Real Impact
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of users making a difference in their communities
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.id} className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
