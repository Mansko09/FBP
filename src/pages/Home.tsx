import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, Award, Calendar } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Star className="h-8 w-8 text-amber-500" />,
      title: "Excellence & Qualité",
      description: "Des coiffeurs experts spécialisés dans les cheveux afro et crépus"
    },
    {
      icon: <Users className="h-8 w-8 text-amber-500" />,
      title: "Équipe Professionnelle",
      description: "Une équipe passionnée formée aux dernières techniques de coiffure afro"
    },
    {
      icon: <Award className="h-8 w-8 text-amber-500" />,
      title: "Produits Premium",
      description: "Utilisation de produits haut de gamme adaptés aux cheveux texturés"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Bella Coiffure Afro
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Votre salon de coiffure spécialisé dans la beauté des cheveux afro et crépus. 
              Découvrez l'art de la coiffure africaine dans un cadre chaleureux et professionnel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/reservation"
                className="bg-white text-orange-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Calendar className="h-5 w-5" />
                <span>Réserver maintenant</span>
              </Link>
              <Link
                to="/services"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-orange-600 transition-all duration-200"
              >
                Nos Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi nous choisir ?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez ce qui fait de Bella Coiffure Afro le salon de référence pour vos cheveux
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Services Populaires
            </h2>
            <p className="text-lg text-gray-600">
              Des services spécialisés pour sublimer vos cheveux naturels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Tresses & Nattes", price: "À partir de 35€", image: "https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg" },
              { name: "Défrisage", price: "À partir de 45€", image: "https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg" },
              { name: "Soins Capillaires", price: "À partir de 25€", image: "https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg" },
              { name: "Coupe & Style", price: "À partir de 30€", image: "https://images.pexels.com/photos/3065204/pexels-photo-3065204.jpeg" }
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="h-48 bg-gradient-to-br from-orange-200 to-amber-200"></div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-orange-600 font-semibold">
                    {service.price}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/services"
              className="bg-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-orange-700 transition-colors duration-200"
            >
              Voir tous nos services
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt(e) à transformer vos cheveux ?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Réservez dès maintenant votre rendez-vous et laissez nos experts 
            prendre soin de vos cheveux avec passion et professionnalisme.
          </p>
          <Link
            to="/reservation"
            className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-10 py-5 rounded-full font-semibold text-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200 inline-flex items-center space-x-2"
          >
            <Calendar className="h-5 w-5" />
            <span>Réserver votre rendez-vous</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;