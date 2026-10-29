import { EventRegistration, Suitor, DateRound, CommunityEvent } from '../types/dating';
import { Language } from './i18n';

/**
 * Converts a real event attendee registration into a fully interactive 8-bit speed dater.
 * Generates tailored dialogue rounds, choices, reactions, and chemistry dynamics based
 * on their actual bio, pronouns, preferences, and the event's community cause.
 */
export function registrationToSuitor(
  registration: EventRegistration,
  event?: CommunityEvent,
  language: Language = 'fr'
): Suitor {
  const isFr = language === 'fr';
  const attendeeName = registration.attendeeName || (isFr ? 'Participant Anonyme' : 'Community Dater');
  const causeName = event?.beneficiaryName || event?.title || (isFr ? 'la cause solidaire' : 'the community cause');
  const venue = event?.venueName || (isFr ? 'Café Rétro Arcade' : 'Local Retro Arcade & Diner');

  const gender = registration.interestedIn === 'women' 
    ? 'women' 
    : registration.interestedIn === 'men' 
    ? 'men' 
    : 'nonbinary';

  const rounds: [DateRound, DateRound, DateRound] = [
    // Round 1: Cause & Icebreaker
    {
      prompt: isFr 
        ? `${attendeeName} vous sourit et prend place en face de vous.`
        : `${attendeeName} smiles warmly and takes a seat across from you.`,
      suitorSays: isFr
        ? `Salut ! Je suis tellement ravi(e) de participer à cette soirée pour soutenir ${causeName}. Qu'est-ce qui t'a donné envie de venir aujourd'hui ?`
        : `Hey there! I am so excited to be here supporting ${causeName}. What inspired you to join this speed dating night today?`,
      choices: [
        {
          id: `${registration.id}-r1-a`,
          text: isFr
            ? `C'est une cause formidable, et je cherchais quelqu'un d'aussi engagé et souriant que toi !`
            : `It's such a fantastic cause, and I was hoping to meet someone as passionate and kind as you!`,
          chemistryChange: 25,
          suitorResponse: isFr
            ? `Oh c'est adorable ! On a déjà un point commun essentiel : le cœur sur la main ♥`
            : `That is so sweet! We already have the most important thing in common: big hearts ♥`,
          resultingExpression: 'love',
          reactionTag: 'smooth'
        },
        {
          id: `${registration.id}-r1-b`,
          text: isFr
            ? `J'adore l'ambiance rétro 8-bit et j'avais envie de faire des rencontres authentiques.`
            : `I love the retro 8-bit vibe and wanted to connect with genuine community members!`,
          chemistryChange: 15,
          suitorResponse: isFr
            ? `Totalement d'accord, l'ambiance arcade est imbattable pour briser la glace !`
            : `Totally agree, the arcade atmosphere is unbeatable for breaking the ice!`,
          resultingExpression: 'happy',
          reactionTag: 'funny'
        },
        {
          id: `${registration.id}-r1-c`,
          text: isFr
            ? `Honnêtement, mes amis m'ont inscrit(e) de force, mais je ne regrette pas d'être là.`
            : `Honestly, my friends dared me to register, but I'm really glad I showed up!`,
          chemistryChange: 5,
          suitorResponse: isFr
            ? `Haha au moins tu es honnête ! Remercie tes amis de ma part ;) !`
            : `Haha at least you're honest! Send your friends a thank you for me ;) !`,
          resultingExpression: 'blush',
          reactionTag: 'awkward'
        }
      ]
    },

    // Round 2: Vibe & Shared Nostalgia
    {
      prompt: isFr
        ? `${attendeeName} se penche en avant, les yeux pétillants.`
        : `${attendeeName} leans in with an engaged, playful look.`,
      suitorSays: isFr
        ? `Si on devait former une équipe de choc pour une soirée jeux coopératifs ou un projet bénévole, quel serait ton super-pouvoir ?`
        : `If we teamed up for a co-op gaming marathon or community project, what would be your special superpower?`,
      choices: [
        {
          id: `${registration.id}-r2-a`,
          text: isFr
            ? `Le soutien inconditionnel : je relève toujours mon Joueur 2 et je prépare les meilleurs snacks !`
            : `Unconditional support: I always revive Player 2 and keep the snacks coming!`,
          chemistryChange: 20,
          suitorResponse: isFr
            ? `Le coéquipier de rêve ! Tu viens de marquer un maximum de points !`
            : `The ultimate dream teammate! You just earned a high score in my book!`,
          resultingExpression: 'love',
          reactionTag: 'smooth'
        },
        {
          id: `${registration.id}-r2-b`,
          text: isFr
            ? `La stratégie et l'humour : impossible de paniquer quand on rigole ensemble.`
            : `Strategy and humor: impossible to panic when we're laughing through the levels together.`,
          chemistryChange: 15,
          suitorResponse: isFr
            ? `J'adore cet état d'esprit ! Le rire, c'est le meilleur bonus de vie.`
            : `I love that mindset! Laughter is genuinely the best power-up.`,
          resultingExpression: 'happy',
          reactionTag: 'funny'
        },
        {
          id: `${registration.id}-r2-c`,
          text: isFr
            ? `Fouiller tous les recoins de la carte quitte à se perdre complètement.`
            : `Obsessively exploring every secret corner of the map until we get totally lost.`,
          chemistryChange: 10,
          suitorResponse: isFr
            ? `Haha c'est risqué mais très divertissant ! Prépare la boussole.`
            : `Haha that's risky but very entertaining! Better bring a compass.`,
          resultingExpression: 'skeptical',
          reactionTag: 'awkward'
        }
      ]
    },

    // Round 3: Date 2 Vision
    {
      prompt: isFr
        ? `La cloche des 45 secondes approche de la fin de manche !`
        : `The 45-second round bell is about to chime!`,
      suitorSays: isFr
        ? `Le temps passe tellement vite avec toi ! Dis-moi, à quoi ressemblerait notre 2e rendez-vous idéal ?`
        : `Time flies so fast with you! Tell me, what would our ideal Date #2 look like?`,
      choices: [
        {
          id: `${registration.id}-r3-a`,
          text: isFr
            ? `Un chocolat chaud réconfortant à ${venue}, suivi d'une partie de jeu d'arcade rétro en duo.`
            : `A cozy warm drink at ${venue}, followed by a retro co-op arcade challenge!`,
          chemistryChange: 25,
          suitorResponse: isFr
            ? `C'est exactement ce dont je rêvais ! J'espère vraiment qu'on va matcher !`
            : `That sounds like perfection! I truly hope we get a mutual match!`,
          resultingExpression: 'love',
          reactionTag: 'smooth'
        },
        {
          id: `${registration.id}-r3-b`,
          text: isFr
            ? `Une balade détendue pour refaire le monde et discuter de nos prochains projets caritatifs.`
            : `A relaxing walk talking about life, music, and our next community charity projects.`,
          chemistryChange: 18,
          suitorResponse: isFr
            ? `Compte sur moi, j'adore les conversations profondes et sans filtre.`
            : `Count me in, I love deep, genuine late-evening conversations.`,
          resultingExpression: 'happy',
          reactionTag: 'funny'
        },
        {
          id: `${registration.id}-r3-c`,
          text: isFr
            ? `Un tournoi ultra-compétitif où le perdant offre le dîner !`
            : `A high-stakes tournament where the loser buys dinner!`,
          chemistryChange: 12,
          suitorResponse: isFr
            ? `Attention, je ne perds jamais facilement ! Défi relevé !`
            : `Careful now, I don't go down easily! Challenge accepted!`,
          resultingExpression: 'blush',
          reactionTag: 'spicy'
        }
      ]
    }
  ];

  return {
    id: registration.id,
    name: attendeeName,
    age: 26,
    title: registration.bio || (isFr ? 'Donateur & Participant Engagé' : 'Community Dater & Supporter'),
    gender,
    archetype: registration.pronouns ? `${registration.pronouns} · ${isFr ? 'Participant' : 'Dater'}` : (isFr ? 'Célibataire Solidaire' : 'Community Dater'),
    bio: registration.bio || (isFr ? 'Présent pour soutenir la cause et trouver un partenaire authentique !' : 'Here to support the cause and meet an authentic partner!'),
    flirtingStyle: isFr ? 'Bienveillant & Spontané' : 'Warm & Playful',
    favoriteSnack: isFr ? 'Friandises 8-bit & Boisson artisanale' : 'Retro arcade snacks & craft sodas',
    greenFlag: isFr ? 'Générosité et soutien actif aux projets communautaires' : 'Active supporter of community causes',
    redFlag: isFr ? 'Ne partage jamais ses frites lors des victoires' : 'Will steal your tokens when winning',
    initialChemistry: 45,
    minMatchChemistry: 55,
    avatar: registration.avatar,
    rounds,
    matchMessage: isFr ? `Coup de foudre solidaire ! Match mutuel avec ${attendeeName}` : `Mutual spark with ${attendeeName}!`,
    rejectionMessage: isFr ? 'Une belle connexion amicale' : 'A friendly connection',
    inviteDateLocation: venue,
    secondDateActivity: isFr ? 'Duo Arcade & Café Solidaire' : 'Co-Op Arcade Challenge & Warm Coffee'
  };
}
