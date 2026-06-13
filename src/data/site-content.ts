export const siteContent = {
  hero: {
    title: 'Maîtrisez vos dépenses familiales simplement',
    subtitle:
      'Une application intelligente pour suivre votre budget familial, contrôler vos dépenses et améliorer votre gestion financière.',
    cta: 'Commencer maintenant',
    secondary: 'Découvrir l\'application',
  },

  presentation: {
    title: 'Pourquoi MADINDA ?',
    subtitle:
      'MADINDA Family Budget est conçu pour aider les familles à prendre le contrôle de leurs finances.',
    points: [
      {
        title: 'Éviter les dépenses inutiles',
        description:
          'Identifiez et réduisez les dépenses superflues grâce à un suivi détaillé de vos transactions.',
        icon: 'economy',
      },
      {
        title: 'Suivre l\'argent de la famille',
        description:
          'Ayez une vue claire sur l\'ensemble des revenus et dépenses de tous les membres de votre famille.',
        icon: 'tracking',
      },
      {
        title: 'Prendre de meilleures décisions',
        description:
          'Utilisez des analyses financières pertinentes pour planifier votre budget et atteindre vos objectifs.',
        icon: 'decisions',
      },
    ],
  },

  features: [
    {
      icon: 'wallet',
      title: 'Gestion des dépenses',
      description:
        'Enregistrez et catégorisez toutes vos dépenses en quelques clics.',
    },
    {
      icon: 'budget',
      title: 'Budget familial',
      description:
        'Définissez des limites budgétaires par catégorie et suivez leur évolution.',
    },
    {
      icon: 'chart',
      title: 'Analyse financière',
      description:
        'Obtenez des analyses détaillées de vos habitudes de consommation.',
    },
    {
      icon: 'stats',
      title: 'Statistiques graphiques',
      description:
        'Visualisez vos données financières avec des graphiques clairs et interactifs.',
    },
    {
      icon: 'users',
      title: 'Gestion des membres',
      description:
        'Ajoutez les membres de votre famille et gérez leurs dépenses individuellement.',
    },
    {
      icon: 'history',
      title: 'Historique financier',
      description:
        'Consultez l\'historique complet de toutes vos transactions passées.',
    },
    {
      icon: 'bell',
      title: 'Notifications intelligentes',
      description:
        'Recevez des alertes personnalisées sur votre budget et vos dépenses.',
    },
  ],

  howItWorks: [
    {
      step: 1,
      title: 'Créer un compte familial',
      description:
        'Inscrivez-vous gratuitement et créez votre espace familial dédié.',
    },
    {
      step: 2,
      title: 'Ajouter les membres',
      description:
        'Invitez les membres de votre famille à rejoindre le compte.',
    },
    {
      step: 3,
      title: 'Enregistrer les dépenses',
      description:
        'Saisissez vos dépenses au quotidien, simplement et rapidement.',
    },
    {
      step: 4,
      title: 'Analyser les résultats',
      description:
        'Consultez les statistiques et ajustez votre budget en conséquence.',
    },
  ],

  statistics: [
    {
      value: '+100',
      label: 'Familles accompagnées',
    },
    {
      value: '+5 000',
      label: 'Dépenses enregistrées',
    },
    {
      value: '100%',
      label: 'Gestion simplifiée',
    },
  ],

  testimonials: [
    {
      name: 'Marie K.',
      avatar: 'MK',
      comment:
        'MADINDA a complètement changé notre façon de gérer le budget familial. Simple et efficace !',
      role: 'Maman de 3 enfants',
    },
    {
      name: 'Paul D.',
      avatar: 'PD',
      comment:
        'Grâce à cette application, nous avons réduit nos dépenses inutiles de 30% le premier mois.',
      role: 'Chef de famille',
    },
    {
      name: 'Sophie M.',
      avatar: 'SM',
      comment:
        'Enfin une application qui nous permet de suivre nos finances en famille. Je recommande vivement.',
      role: 'Jeune maman',
    },
  ],

  faq: [
    {
      question: 'Pourquoi utiliser MADINDA ?',
      answer:
        'MADINDA vous permet de centraliser la gestion de votre budget familial, de suivre vos dépenses en temps réel et de prendre des décisions financières éclairées. Notre application est conçue pour être simple d\'utilisation tout en offrant des analyses puissantes.',
    },
    {
      question: 'Comment ajouter une dépense ?',
      answer:
        'Connectez-vous à votre compte, cliquez sur "Ajouter une dépense", renseignez le montant, la catégorie et une description facultative. La dépense sera immédiatement prise en compte dans votre budget.',
    },
    {
      question: 'Est-ce que plusieurs membres peuvent utiliser le même compte familial ?',
      answer:
        'Oui ! Un compte familial peut inclure plusieurs membres. Chacun peut ajouter ses propres dépenses et visualiser les statistiques partagées. Parfait pour suivre les finances de toute la famille.',
    },
    {
      question: 'Mes données sont-elles sécurisées ?',
      answer:
        'Absolument. Nous utilisons un chiffrement de bout en bout pour protéger vos données financières. Votre vie privée est notre priorité absolue.',
    },
  ],

  footer: {
    description:
      'MADINDA Family Budget est une application moderne de gestion budgétaire conçue pour aider les familles à maîtriser leurs finances.',
    quickLinks: ['Accueil', 'Fonctionnalités', 'À propos', 'Contact'],
    legal: ['Conditions d\'utilisation', 'Politique de confidentialité'],
    contact: {
      email: 'contact@madinda.app',
      address: 'Kinshasa, RDC',
    },
  },
} as const;
