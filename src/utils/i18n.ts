export type Language = 'en' | 'fr';

export interface Translations {
  // Brand & Slogans
  brandSubtitlePublic: string;
  brandSubtitleAdmin: string;
  tagline: string;
  datingForCause: string;
  totalFundsRaised: string;
  totalDonationsLabel: string;
  datersRegistered: string;
  activeCausesCount: string;
  allCauses: string;
  showingCount: string;

  // Navigation Links
  navCauses: string;
  navFloor: string;
  navDates: string;
  navMatches: string;
  navAvatar: string;
  navAdmin: string;
  exitToPublic: string;
  newCampaign: string;
  speedDateBtn: string;
  registerDonateBtn: string;
  createEventBtn: string;
  pressStartToDate: string;
  customizeSprite: string;
  browseAllCauses: string;

  // Lobby & Fundraiser
  starlightLounge: string;
  speedDatingFloorTitle: string;
  datingFloorSubtitle: string;
  datesCompleted: string;
  mutualMatchesBadge: string;
  howToPlay: string;
  viewMatchReveal: string;
  startSpeedDating: string;
  editSprite: string;
  rules1Title: string;
  rules1Desc: string;
  rules2Title: string;
  rules2Desc: string;
  rules3Title: string;
  rules3Desc: string;
  filterSuitors: string;
  allSuitors: string;
  women: string;
  men: string;
  nonbinary: string;
  communityDonorsTab: string;
  speedDatingTablesTab: string;
  openMatchesBtn: string;
  chatWithMatch: string;
  sitAtTable: string;
  dateAgain: string;
  waitingAtTable: string;
  dateConcluded: string;
  mutualMatchTag: string;

  // Active Speed Date
  roundLabel: string;
  speedDateWith: string;
  skipDate: string;
  chemistryLabel: string;
  quickTimeCheck: string;
  lockEyesTitle: string;
  lockEyesDesc: string;
  syncNowBtn: string;
  selectResponsePrompt: string;
  saysPrefix: string;
  roundConcludedTitle: string;
  verdictTitle: string;
  finalChemistryScore: string;
  pdaNotesPlaceholder: string;
  verdictPrompt: string;
  passBtn: string;
  likeBtn: string;
  superLikeBtn: string;

  // Match Reveal & Messenger
  ceremonyBadge: string;
  matchmakingResultsTitle: string;
  ballotsCountedDesc: string;
  mutualMatchesFound: string;
  yourVote: string;
  suitorVote: string;
  likedYouBack: string;
  passedVote: string;
  tallyingVote: string;
  chatAndPlanDate2: string;
  speedDateAgainReset: string;
  openMessengerBtn: string;
  pdaMessengerTitle: string;
  matchChatHubTitle: string;
  yourMatchesCount: string;
  date2InvitationTitle: string;
  locationLabel: string;
  activityLabel: string;
  dateScheduledBadge: string;
  acceptDate2Btn: string;
  sendMessagePlaceholder: string;
  sendBtn: string;

  // Registration Modal
  regModalBadge: string;
  registerSpeedDatingTitle: string;
  step1Tier: string;
  step2Donation: string;
  step3Profile: string;
  fullNameLabel: string;
  emailLabel: string;
  pronounsLabel: string;
  interestedInLabel: string;
  introPromptLabel: string;
  totalDonationLabel: string;
  completeRegBtn: string;
  confirmedBadge: string;
  confirmedTitle: string;
  passTicketBadge: string;
  ticketCodeLabel: string;
  enterLobbyBtn: string;

  // Admin Portal
  staffGatewayTitle: string;
  staffOnlyBadge: string;
  adminPortalTitle: string;
  adminPortalDesc: string;
  staffKeycodeLabel: string;
  verifyUnlockBtn: string;
  quickAccessBtn: string;
  organizerConsoleTitle: string;
  organizerConsoleDesc: string;
  exportCsvBtn: string;
  totalRaisedKpi: string;
  registeredDatersKpi: string;
  venueCheckInRateKpi: string;
  matchesKpi: string;
  tabEvents: string;
  tabCheckIn: string;
  tabFloorBell: string;
  tabAnalytics: string;
  soundRoundBellBtn: string;
  searchAttendeePlaceholder: string;
  markCheckInBtn: string;
  checkedInStatus: string;
  recordOfflineDonationTitle: string;
  sponsorNameLabel: string;
  donationAmountLabel: string;
  creditDonationBtn: string;
  revenueByCategory: string;
  topDonorsTitle: string;

  // Workflow & Roadmap
  workRoadTitle: string;
  pauseAndExitToLobby: string;
  backToResults: string;
  backToLobbyWithoutReset: string;
  resumeSpeedDating: string;
  nextStepAction: string;
  prevStepAction: string;
  currentStepBadge: string;

  // Footer
  footerCopyright: string;
  footerProceeds: string;
  footerOrganizerLink: string;
  footerStaffSession: string;
  footerLockLogout: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    brandSubtitlePublic: 'Community Fundraiser',
    brandSubtitleAdmin: 'Organizer Portal',
    tagline: 'Speed Dating to Raise Funds for Community Events',
    datingForCause: 'Dating for a Cause',
    totalFundsRaised: 'Total Funds Raised for Causes:',
    totalDonationsLabel: 'TOTAL COMMUNITY DONATIONS',
    datersRegistered: 'COMMUNITY DATERS REGISTERED',
    activeCausesCount: 'ACTIVE CAUSES',
    allCauses: 'All Causes',
    showingCount: 'Showing',

    navCauses: 'Causes & Events',
    navFloor: 'Dating Floor',
    navDates: 'Speed Dates',
    navMatches: 'Matches',
    navAvatar: 'Avatar Lab',
    navAdmin: 'Admin Hub',
    exitToPublic: 'Public App',
    newCampaign: 'New Campaign',
    speedDateBtn: 'Speed Date',
    registerDonateBtn: 'Register & Donate',
    createEventBtn: 'Create Speed Dating Fundraiser',
    pressStartToDate: 'PRESS START TO DATE',
    customizeSprite: 'Customize Sprite',
    browseAllCauses: 'Browse All Causes',

    starlightLounge: 'STARLIGHT ARCADE DINER',
    speedDatingFloorTitle: '8-Bit Speed Dating Floor',
    datingFloorSubtitle: 'Take a seat at the retro booths. You have 45 seconds per suitor to break the ice and support the cause!',
    datesCompleted: 'Dates completed',
    mutualMatchesBadge: 'Mutual Matches',
    howToPlay: 'How to Play',
    viewMatchReveal: 'View Match Reveal!',
    startSpeedDating: 'Start Speed Dating',
    editSprite: 'Edit Sprite',
    rules1Title: '1. Banter & Dialogue',
    rules1Desc: 'Pick witty dialogue options to boost chemistry with pixel suitors.',
    rules2Title: '2. Heart Sync Minigame',
    rules2Desc: 'Hit the button at the rhythm sweet spot to score +15 chemistry points.',
    rules3Title: '3. Mutual Match & Date 2',
    rules3Desc: 'Vote Like or Super-Like! Mutual matches unlock 8-bit text messenger & Date #2.',
    filterSuitors: 'Filter Suitors:',
    allSuitors: 'All Suitors',
    women: 'Women',
    men: 'Men',
    nonbinary: 'Non-Binary',
    communityDonorsTab: 'Community Donors & Registrations',
    speedDatingTablesTab: 'Speed Dating Floor',
    openMatchesBtn: 'Open Matches',
    chatWithMatch: 'Chat With Match →',
    sitAtTable: 'Sit at Table',
    dateAgain: 'Date Again',
    waitingAtTable: 'Waiting at Table',
    dateConcluded: 'Date Concluded',
    mutualMatchTag: 'MUTUAL MATCH!',

    roundLabel: 'ROUND',
    speedDateWith: 'Speed Date with',
    skipDate: 'Skip Date',
    chemistryLabel: 'Chemistry',
    quickTimeCheck: 'QUICK-TIME VIBE CHECK!',
    lockEyesTitle: 'Lock Eyes & Sync Hearts!',
    lockEyesDesc: 'Click the button right when the pulsing heart aligns with the target ring!',
    syncNowBtn: 'SYNC NOW! (SPACE/CLICK)',
    selectResponsePrompt: 'SELECT YOUR RESPONSE:',
    saysPrefix: 'SAYS:',
    roundConcludedTitle: 'ROUND CONCLUDED',
    verdictTitle: 'Speed Date Verdict',
    finalChemistryScore: 'Final Chemistry Score',
    pdaNotesPlaceholder: 'PDA notes on suitor (optional)...',
    verdictPrompt: 'Would you like to match? Both parties must say YES to reveal contact!',
    passBtn: 'Pass',
    likeBtn: 'Like ♥',
    superLikeBtn: 'Super Like!',

    ceremonyBadge: 'SPEED DATING CEREMONY',
    matchmakingResultsTitle: 'Matchmaking Results',
    ballotsCountedDesc: 'The speed dating ballots have been counted! Here is who felt the 8-bit romantic spark with you.',
    mutualMatchesFound: 'MUTUAL MATCHES FOUND! ♥',
    yourVote: 'Your Vote:',
    suitorVote: 'Suitor Vote:',
    likedYouBack: '♥ Liked You Back!',
    passedVote: '✕ Passed',
    tallyingVote: 'Tallying...',
    chatAndPlanDate2: 'Chat & Plan Date 2 →',
    speedDateAgainReset: 'Speed Date Again (Reset)',
    openMessengerBtn: 'Open 8-Bit Match Messenger',
    pdaMessengerTitle: '8-BIT PDA MESSENGER',
    matchChatHubTitle: 'Match Chat & Date Hub',
    yourMatchesCount: 'Your Matches',
    date2InvitationTitle: 'DATE #2 INVITATION',
    locationLabel: 'Location:',
    activityLabel: 'Activity:',
    dateScheduledBadge: 'DATE SCHEDULED! ♥',
    acceptDate2Btn: 'ACCEPT DATE #2!',
    sendMessagePlaceholder: 'Send a retro message...',
    sendBtn: 'Send',

    regModalBadge: 'COMMUNITY FUNDRAISER REGISTRATION',
    registerSpeedDatingTitle: 'Register for Speed Dating',
    step1Tier: '1. Select Your Ticket Tier',
    step2Donation: '2. Extra Community Donation (Optional)',
    step3Profile: '3. Speed Dating Attendee Profile',
    fullNameLabel: 'Your Full Name',
    emailLabel: 'Email (For Ticket Delivery)',
    pronounsLabel: 'Pronouns',
    interestedInLabel: 'Interested In Dating',
    introPromptLabel: 'Speed Dating Intro / Why You Support This Cause',
    totalDonationLabel: 'Total Entry Donation:',
    completeRegBtn: 'Complete Registration & Support',
    confirmedBadge: 'REGISTRATION CONFIRMED',
    confirmedTitle: "You're On The Speed Dating Guest List!",
    passTicketBadge: 'SPEED DATING PASS',
    ticketCodeLabel: 'TICKET CODE:',
    enterLobbyBtn: 'Enter Event Lobby →',

    staffGatewayTitle: 'STAFF ENTRANCE · ORGANIZER ONLY',
    staffOnlyBadge: 'STAFF GATEWAY · ORGANIZER ONLY',
    adminPortalTitle: 'Admin Portal',
    adminPortalDesc: 'Authorized access for community campaign management & check-in operations.',
    staffKeycodeLabel: 'Staff Keycode / PIN',
    verifyUnlockBtn: 'Verify & Unlock Console →',
    quickAccessBtn: '1-Click Access as Organizer',
    organizerConsoleTitle: 'Organizer Admin Console',
    organizerConsoleDesc: 'Manage fundraising campaigns, check-in attendees, assign tables, and view real-time donor receipts.',
    exportCsvBtn: 'Export CSV',
    totalRaisedKpi: 'TOTAL FUNDS RAISED',
    registeredDatersKpi: 'REGISTERED ATTENDEES',
    venueCheckInRateKpi: 'VENUE CHECK-IN RATE',
    matchesKpi: 'SPEED DATING MATCHES',
    tabEvents: 'Fundraising Events',
    tabCheckIn: 'Attendee Check-In Desk',
    tabFloorBell: 'Speed Dating Floor & Bell Control',
    tabAnalytics: 'Financial & Donor Analytics',
    soundRoundBellBtn: 'SOUND ROUND BELL (8-BIT)',
    searchAttendeePlaceholder: 'Search by name, email, ticket code...',
    markCheckInBtn: 'Mark Check-In',
    checkedInStatus: 'Checked In ✓',
    recordOfflineDonationTitle: 'Record Offline Donation / Sponsor Match',
    sponsorNameLabel: 'Sponsor / Donor Name',
    donationAmountLabel: 'Donation Amount ($ USD)',
    creditDonationBtn: 'Credit Donation →',
    revenueByCategory: 'Revenue by Cause Category',
    topDonorsTitle: 'Top Community Benefactors',

    // Workflow & Roadmap
    workRoadTitle: 'Event Roadmap & Workflow',
    pauseAndExitToLobby: 'Pause & Return to Lounge',
    backToResults: 'View Match Results',
    backToLobbyWithoutReset: 'Return to Lounge',
    resumeSpeedDating: 'Resume Speed Dating',
    nextStepAction: 'Next Step',
    prevStepAction: 'Previous Step',
    currentStepBadge: 'Current Stage',

    footerCopyright: 'HeartByte · Community Fundraiser Speed Dating Platform · 8-Bit Chiptunes',
    footerProceeds: '100% Proceeds to Beneficiaries',
    footerOrganizerLink: 'Organizer Portal',
    footerStaffSession: 'Staff Session Active',
    footerLockLogout: 'Lock & Log Out'
  },

  fr: {
    brandSubtitlePublic: 'Collecte Communautaire',
    brandSubtitleAdmin: 'Portail Organisateur',
    tagline: 'Rencontres Éclair pour Financer des Projets Communautaires',
    datingForCause: 'Rencontres Engagées & Solidaires',
    totalFundsRaised: 'Total des Fonds Collectés pour les Causes :',
    totalDonationsLabel: 'TOTAL DES DONS COMMUNAUTAIRES',
    datersRegistered: 'PARTICIPANTS INSCRITS',
    activeCausesCount: 'CAUSES ACTIVES',
    allCauses: 'Toutes les Causes',
    showingCount: 'Affichage de',

    navCauses: 'Causes & Événements',
    navFloor: 'Piste de Rencontre',
    navDates: 'Speed Dating',
    navMatches: 'Matchs',
    navAvatar: 'Labo Avatars',
    navAdmin: 'Espace Admin',
    exitToPublic: 'Appli Publique',
    newCampaign: 'Nouvelle Campagne',
    speedDateBtn: 'Rencontre Éclair',
    registerDonateBtn: 'S’inscrire & Soutenir',
    createEventBtn: 'Créer une Soirée Bénéfice',
    pressStartToDate: 'APPUYER SUR START',
    customizeSprite: 'Personnaliser l’Avatar',
    browseAllCauses: 'Voir Toutes les Causes',

    starlightLounge: 'SALON D’ARCADE STARLIGHT',
    speedDatingFloorTitle: 'Piste de Speed Dating 8-Bit',
    datingFloorSubtitle: 'Prenez place dans nos alcôves rétro. Vous avez 45 secondes par prétendant pour briser la glace et soutenir la cause !',
    datesCompleted: 'Rencontres faites',
    mutualMatchesBadge: 'Coups de Cœur Mutuels',
    howToPlay: 'Règles du Jeu',
    viewMatchReveal: 'Révélation des Matchs !',
    startSpeedDating: 'Lancer le Speed Dating',
    editSprite: 'Modifier Sprite',
    rules1Title: '1. Échanges & Réparties',
    rules1Desc: 'Choisissez les répliques parfaites pour faire grimper votre jauge d’Alchimie avec les prétendants.',
    rules2Title: '2. Mini-jeu Synchronisation du Cœur',
    rules2Desc: 'Tapez au bon tempo lors de la pulsation pour remporter +15 points d’alchimie.',
    rules3Title: '3. Matchs Mutuels & 2e Rendez-vous',
    rules3Desc: 'Votez Coup de Cœur ou Super-Like ! Les matchs mutuels débloquent la messagerie PDA 8-bit.',
    filterSuitors: 'Filtrer les Profils :',
    allSuitors: 'Tous les Profils',
    women: 'Femmes',
    men: 'Hommes',
    nonbinary: 'Non-Binaire',
    communityDonorsTab: 'Donateurs & Inscriptions Communautaires',
    speedDatingTablesTab: 'Tables de Rencontre',
    openMatchesBtn: 'Voir mes Matchs',
    chatWithMatch: 'Discuter avec le Match →',
    sitAtTable: 'S’asseoir à la Table',
    dateAgain: 'Rejouer la Table',
    waitingAtTable: 'En attente à la table',
    dateConcluded: 'Rencontre Conclue',
    mutualMatchTag: 'COUP DE CŒUR MUTUEL !',

    roundLabel: 'MANCHE',
    speedDateWith: 'En tête-à-tête avec',
    skipDate: 'Passer la Table',
    chemistryLabel: 'Alchimie',
    quickTimeCheck: 'TEST DE COMPATIBILITÉ ÉCLAIR !',
    lockEyesTitle: 'Croisez les Regards & Synchronisez vos Cœurs !',
    lockEyesDesc: 'Cliquez dès que le cœur battant s’aligne avec l’anneau lumineux !',
    syncNowBtn: 'SYNCHRONISER ! (ESPACE/CLIC)',
    selectResponsePrompt: 'CHOISISSEZ VOTRE RÉPLIQUE :',
    saysPrefix: 'DIT :',
    roundConcludedTitle: 'MANCHE TERMINÉE',
    verdictTitle: 'Verdict de la Rencontre',
    finalChemistryScore: 'Score Final d’Alchimie',
    pdaNotesPlaceholder: 'Notes personnelles sur la personne (optionnel)...',
    verdictPrompt: 'Souhaitez-vous matcher ? Il faut deux OUI pour échanger vos coordonnées !',
    passBtn: 'Passer',
    likeBtn: 'Coup de Cœur ♥',
    superLikeBtn: 'Super-Like !',

    ceremonyBadge: 'CÉRÉMONIE DES CORRESPONDANCES',
    matchmakingResultsTitle: 'Résultats des Matchs',
    ballotsCountedDesc: 'Le dépouillement secret des votes est terminé ! Découvrez qui a ressenti l’étincelle 8-bit avec vous.',
    mutualMatchesFound: 'MATCHS MUTUELS DÉCOUVERTS ! ♥',
    yourVote: 'Votre Vote :',
    suitorVote: 'Vote du Suitor :',
    likedYouBack: '♥ A Craqué pour Vous !',
    passedVote: '✕ A Passé',
    tallyingVote: 'Calcul en cours...',
    chatAndPlanDate2: 'Discuter & Planifier le 2e Rendez-vous →',
    speedDateAgainReset: 'Recommencer une Session (Reset)',
    openMessengerBtn: 'Ouvrir la Messagerie 8-Bit',
    pdaMessengerTitle: 'MESSAGERIE PDA 8-BIT',
    matchChatHubTitle: 'Salon de Discussion des Matchs',
    yourMatchesCount: 'Vos Matchs',
    date2InvitationTitle: 'INVITATION POUR LE 2E RENDEZ-VOUS',
    locationLabel: 'Lieu :',
    activityLabel: 'Activité :',
    dateScheduledBadge: 'RENDEZ-VOUS PROGRAMMÉ ! ♥',
    acceptDate2Btn: 'ACCEPTER LE RENDEZ-VOUS !',
    sendMessagePlaceholder: 'Envoyer un message rétro...',
    sendBtn: 'Envoyer',

    regModalBadge: 'INSCRIPTION COLLECTE COMMUNAUTAIRE',
    registerSpeedDatingTitle: 'S’inscrire au Speed Dating',
    step1Tier: '1. Choisissez votre Palier de Billet',
    step2Donation: '2. Don Communautaire Supplémentaire (Optionnel)',
    step3Profile: '3. Profil du Participant',
    fullNameLabel: 'Votre Nom Complet',
    emailLabel: 'Adresse E-mail (Pour le billet)',
    pronounsLabel: 'Pronoms',
    interestedInLabel: 'Souhaite rencontrer',
    introPromptLabel: 'Pourquoi vous soutenez cette cause / Votre phrase d’accroche',
    totalDonationLabel: 'Don Total d’Entrée :',
    completeRegBtn: 'Valider l’Inscription & Soutenir',
    confirmedBadge: 'INSCRIPTION CONFIRMÉE',
    confirmedTitle: 'Vous êtes sur la Liste des Invités !',
    passTicketBadge: 'PASS SPEED DATING',
    ticketCodeLabel: 'CODE BILLET :',
    enterLobbyBtn: 'Entrer dans le Salon →',

    staffGatewayTitle: 'ACCÈS STAFF · ORGANISATEURS',
    staffOnlyBadge: 'ACCÈS STAFF · ORGANISATEURS',
    adminPortalTitle: 'Portail Organisateur',
    adminPortalDesc: 'Accès réservé pour la gestion des campagnes et le pointage d’entrée.',
    staffKeycodeLabel: 'Code Secret Organisateur',
    verifyUnlockBtn: 'Vérifier & Déverrouiller la Console →',
    quickAccessBtn: 'Accès Démo 1-Clic Organisateur',
    organizerConsoleTitle: 'Console d’Administration Bénévole',
    organizerConsoleDesc: 'Gérez vos campagnes, pointez les arrivées des participants et gérez les tables en direct.',
    exportCsvBtn: 'Exporter CSV',
    totalRaisedKpi: 'FONDS TOTAUX COLLECTÉS',
    registeredDatersKpi: 'PARTICIPANTS INSCRITS',
    venueCheckInRateKpi: 'TAUX D’ÉMARGEMENT SUR PLACE',
    matchesKpi: 'COUPS DE CŒUR ENREGISTRÉS',
    tabEvents: 'Campagnes & Événements',
    tabCheckIn: 'Guichet d’Émargement',
    tabFloorBell: 'Cloche de Rotation & Tables',
    tabAnalytics: 'Analyses Financières & Donateurs',
    soundRoundBellBtn: 'SONNER LA CLOCHE (8-BIT)',
    searchAttendeePlaceholder: 'Rechercher par nom, e-mail, code billet...',
    markCheckInBtn: 'Pointer l’Entrée',
    checkedInStatus: 'Émargé ✓',
    recordOfflineDonationTitle: 'Enregistrer un Don Hors-Ligne / Mécénat',
    sponsorNameLabel: 'Nom du Mécène / Partenaire',
    donationAmountLabel: 'Montant du Don ($ USD)',
    creditDonationBtn: 'Créditer le Don →',
    revenueByCategory: 'Répartition par Catégorie de Cause',
    topDonorsTitle: 'Meilleurs Mécènes Communautaires',

    // Workflow & Roadmap
    workRoadTitle: 'Feuille de Route & Parcours de l’Événement',
    pauseAndExitToLobby: 'Pause & Retour au Salon',
    backToResults: 'Voir les Résultats des Matchs',
    backToLobbyWithoutReset: 'Retour au Salon',
    resumeSpeedDating: 'Reprendre les Rencontres',
    nextStepAction: 'Étape Suivante',
    prevStepAction: 'Étape Précédente',
    currentStepBadge: 'Étape en Cours',

    footerCopyright: 'HeartByte · Plateforme Solidaire de Rencontres Rétro 8-Bit',
    footerProceeds: '100% des bénéfices reversés aux causes locales',
    footerOrganizerLink: 'Portail Organisateur',
    footerStaffSession: 'Session Staff Active',
    footerLockLogout: 'Verrouiller & Déconnexion'
  }
};
