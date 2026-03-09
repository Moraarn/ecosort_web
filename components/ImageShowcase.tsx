export default function ImageShowcase() {
  const showcaseImages = [
    {
      id: 1,
      title: "Smart Classification",
      description: "AI-powered waste detection",
      image: "https://i.pinimg.com/736x/92/5d/56/925d565f4b26155296bfbbc98d5029bf.jpg"
    },
    {
      id: 2,
      title: "Community Collection",
      description: "African waste management initiatives",
      image: "https://i.pinimg.com/1200x/63/a3/89/63a389b3ec38cf93a6f8adea068df3d8.jpg"
    },
    {
      id: 3,
      title: "Environmental Impact",
      description: "Sustainable communities",
      image: "https://i.pinimg.com/736x/eb/33/f6/eb33f67e26bad7835c0dc18895ca1853.jpg"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Transforming Communities Across Africa
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how EcoSort is making a real difference in waste management
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {showcaseImages.map((item) => (
            <div key={item.id} className="relative overflow-hidden rounded-2xl group">
              <img 
                src={item.image}
                alt={item.title}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm opacity-90">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
