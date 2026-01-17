'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';



import {
  Brain,
  Zap,
  BarChart3,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
  Clock,
  Shield,
  Cpu
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function SolutionsIAPage() {
  const services = [
    {
      icon: Zap,
      title: 'Automatisation Intelligente',
      description: 'Automatisez vos processus métier avec des agents IA sur mesure',
      features: ['OCR 99.8%', 'Intégration ERP', 'Détection erreurs'],
      stats: { value: '70%', label: 'Gain de temps' },
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: MessageSquare,
      title: 'Chatbots Personnalisés',
      description: 'Assistants conversationnels disponibles 24/7 pour vos clients',
      features: ['Multilingue', 'Contexte métier', 'Analytics'],
      stats: { value: '24/7', label: 'Disponibilité' },
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: BarChart3,
      title: 'Analyse Prédictive',
      description: 'Anticipez les tendances avec le machine learning avancé',
      features: ['Prévisions stocks', 'Détection fraudes', 'Optimisation prix'],
      stats: { value: '95%', label: 'Précision' },
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const useCases = [
    {
      title: 'Facturation Automatique',
      company: 'Supermarché Local',
      result: '5.5M FCFA économisés/an',
      description: 'Extraction automatique des factures avec OCR et intégration ERP',
      icon: '🧾',
    },
    {
      title: 'Gestion Stocks Intelligente',
      company: 'Restaurant viTEDia',
      result: '40% réduction gaspillage',
      description: 'Prédiction de la demande et optimisation des commandes',
      icon: '📦',
    },
    {
      title: 'Service Client IA',
      company: 'E-commerce Local',
      result: '85% satisfaction client',
      description: 'Chatbot multilingue avec résolution instantanée',
      icon: '💬',
    },
  ];

  const pricing = [
    {
      name: 'Starter',
      price: 325000,
      period: 'mois',
      description: 'Pour PME 1-10 employés',
      features: [
        '1 solution IA',
        'Support email',
        'Intégration basique',
        'Analytics mensuels',
      ],
      popular: false,
    },
    {
      name: 'Business',
      price: 850000,
      period: 'mois',
      description: 'Pour PME 10-50 employés',
      features: [
        '3 solutions IA',
        'Support prioritaire',
        'Intégrations avancées',
        'Analytics temps réel',
        'Formation équipe',
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: null,
      period: 'sur devis',
      description: 'Pour +50 employés',
      features: [
        'Solutions illimitées',
        'Support dédié 24/7',
        'Infrastructure sur mesure',
        'SLA garanti',
        'Consulting stratégique',
      ],
      popular: false,
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow animation-delay-4000"></div>
        </div>

        <div className="container relative z-10 mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-white/10 backdrop-blur-md border border-white/20">
                <Brain className="w-4 h-4" />
                Intelligence Artificielle
              </Badge>

              <h1 className="text-5xl md:text-6xl font-black mb-6 font-heading">
                Le Cerveau du <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">Complexe</span>
              </h1>

              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Propulsez votre entreprise avec des solutions IA sur mesure.
                Automatisation, optimisation et transformation digitale pour les PME camerounaises.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Link href="#services">
                  <Button size="lg" rounded="full" className="bg-white text-primary-900 hover:bg-blue-50 shadow-xl">
                    Découvrir nos Solutions
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>

                <Link href="#contact">
                  <Button variant="outline" size="lg" rounded="full" className="border-white/30 text-white hover:bg-white/10">
                    Demander une Démo
                    <Sparkles className="w-5 h-5" />
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  { value: '99.8%', label: 'Précision IA' },
                  { value: '24/7', label: 'Disponibilité' },
                  { value: '70%', label: 'Gain temps' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-blue-200">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative h-[400px] flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute w-64 h-64 border-4 border-blue-400/30 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute w-48 h-48 border-4 border-purple-400/30 rounded-full"
                />
                <div className="relative w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl">
                  <Brain className="w-16 h-16 text-white" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black text-gray-900 mb-4 font-heading">
              Nos Solutions IA
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des outils puissants pour automatiser, optimiser et transformer votre entreprise
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card hover className="h-full group">
                  <CardHeader>
                    <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {service.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <span className="text-sm text-gray-600">{service.stats.label}</span>
                      <span className="text-2xl font-bold text-primary-600">{service.stats.value}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black text-gray-900 mb-4 font-heading">
              Cas d'Usage Réels
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez comment nos clients transforment leur business avec l'IA
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="text-5xl mb-4">{useCase.icon}</div>
                    <CardTitle className="text-xl">{useCase.title}</CardTitle>
                    <Badge variant="info" className="w-fit">{useCase.company}</Badge>
                  </CardHeader>

                  <CardContent>
                    <div className="mb-4 p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700">
                        <TrendingUp className="w-5 h-5" />
                        <span className="font-bold">{useCase.result}</span>
                      </div>
                    </div>
                    <p className="text-gray-600">{useCase.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black text-gray-900 mb-4 font-heading">
              Tarifs Transparents
            </h2>
            <p className="text-xl text-gray-600">
              Choisissez le plan adapté à votre entreprise
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={`h-full relative ${plan.popular ? 'border-2 border-primary-500 shadow-xl' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                        POPULAIRE
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <div className="mb-2">
                      {plan.price ? (
                        <>
                          <span className="text-4xl font-black text-gray-900">
                            {formatCurrency(plan.price)}
                          </span>
                          <span className="text-gray-600">/{plan.period}</span>
                        </>
                      ) : (
                        <span className="text-4xl font-black text-gray-900">Sur Devis</span>
                      )}
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href={`/contact?plan=${plan.name.toLowerCase()}`}>
                      <Button
                        variant={plan.popular ? 'primary' : 'outline'}
                        className="w-full"
                        size="lg"
                      >
                        {plan.price ? 'Choisir ce Plan' : 'Nous Contacter'}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-900 to-purple-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black mb-6 font-heading">
              Prêt à Transformer Votre Entreprise ?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Discutons de vos besoins et découvrons comment l'IA peut propulser votre croissance.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button size="xl" rounded="full" className="bg-white text-primary-900 hover:bg-blue-50 shadow-2xl">
                  Demander une Démo Gratuite
                  <Sparkles className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
