import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-20 px-4 bg-green-600 text-white">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Transform Waste Management in Your Community?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of Kenyans already using EcoSort AI to create cleaner, more sustainable communities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/recycling-assistant">
            <button className="bg-white text-green-600 px-8 py-4 rounded-full hover:bg-gray-100 transition-colors font-medium">
              🔄 Start Sorting Now
            </button>
          </Link>
          <Link href="/auth/login">
            <button className="border-2 border-green-400 text-white px-8 py-4 rounded-full hover:bg-green-400 hover:text-white transition-colors font-medium">
              Get Started Free
            </button>
          </Link>
          <button className="border-2 border-green-400 text-white px-8 py-4 rounded-full hover:bg-green-400 hover:text-white transition-colors font-medium">
            Schedule Demo
          </button>
        </div>
      </div>
    </section>
  );
}
