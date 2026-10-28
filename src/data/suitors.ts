import { Suitor } from '../types/dating';

export const SUITORS_DATA: Suitor[] = [
  {
    id: 'nova',
    name: 'Nova Sky',
    age: 26,
    title: 'Synthwave Keytarist & Neon Dreamer',
    gender: 'women',
    archetype: 'Electric Rebel',
    bio: 'Plays keytar in an underground retro wave band. Looking for someone who can keep up with 160 BPM and won’t judge my neon synthesizer rack.',
    flirtingStyle: 'Electric & Sarcastic',
    favoriteSnack: 'Glazed Neon Pop-Tarts & Espresso',
    redFlag: 'Starts an impromptu guitar solo when you are trying to sleep',
    greenFlag: 'Will customize a mixtape specifically tuned to your heart rate',
    initialChemistry: 45,
    minMatchChemistry: 60,
    avatar: {
      skinTone: 'peach',
      hairStyle: 'spiky',
      hairColor: 'neon-cyan',
      eyeStyle: 'wink',
      outfitStyle: 'arcade-jacket',
      outfitColor: 'cyan',
      accessory: 'headphones',
      expression: 'idle'
    },
    rounds: [
      {
        prompt: 'Nova adjusts their glowing headphones and smirks across the diner table.',
        suitorSays: "Three minutes on the clock, player! Tell me: what's your ultimate high-tempo midnight anthem, or are you strictly elevator music?",
        choices: [
          {
            id: 'n1',
            text: "Fast synth beats with heavy bass. If the windows aren't shaking, it's not music.",
            chemistryChange: 25,
            suitorResponse: "YES! Finally someone with real bass taste. You might just survive round one!",
            resultingExpression: 'love',
            reactionTag: 'smooth'
          },
          {
            id: 'n2',
            text: "I actually love peaceful 8-bit ambient chiptunes while looking at pixel rain.",
            chemistryChange: 15,
            suitorResponse: "Okay, that's surprisingly poetic. I do have a secret rainy lo-fi side project...",
            resultingExpression: 'happy',
            reactionTag: 'funny'
          },
          {
            id: 'n3',
            text: "Does the sound of clicking spreadsheet cells count as an anthem?",
            chemistryChange: -15,
            suitorResponse: "Ouch. My keytar just winced in sympathetic agony. Let's pretend you didn't say that.",
            resultingExpression: 'skeptical',
            reactionTag: 'awkward'
          }
        ]
      },
      {
        prompt: 'Nova leans forward, tapping a rhythmic 4/4 beat on the table edge.',
        suitorSays: "Speed test! We are stuck in a 1989 arcade with one quarter left. What machine do we conquer together?",
        choices: [
          {
            id: 'n4',
            text: "Dance Dance Revolution! We take the doubles pad and set the local high score.",
            chemistryChange: 20,
            suitorResponse: "That's what I'm talking about! Get ready to sweat, I don't miss arrows.",
            resultingExpression: 'happy',
            reactionTag: 'spicy'
          },
          {
            id: 'n5',
            text: "Classic co-op beat 'em up like TMNT or Streets of Rage. Teamwork is key.",
            chemistryChange: 25,
            suitorResponse: "Flawless choice! You cover my back, I spam special attacks.",
            resultingExpression: 'love',
            reactionTag: 'smooth'
          },
          {
            id: 'n6',
            text: "The rigged claw machine to win a depressed-looking plushie.",
            chemistryChange: 5,
            suitorResponse: "Hilarious, but you're paying for the second quarter when the claw goes limp!",
            resultingExpression: 'blush',
            reactionTag: 'funny'
          }
        ]
      },
      {
        prompt: 'The 30-second warning buzzer chimes. Nova looks at you with bright eyes.',
        suitorSays: "Time flies when you're not boring. Honest truth: what makes you want to hit 'Continue' instead of 'Game Over' with me?",
        choices: [
          {
            id: 'n7',
            text: "Your chaotic energy is addictive. I want to see you play that keytar live.",
            chemistryChange: 25,
            suitorResponse: "Consider yourself on the permanent VIP guest list, cutie.",
            resultingExpression: 'love',
            reactionTag: 'spicy'
          },
          {
            id: 'n8',
            text: "You challenge me, and honestly this 3 minutes felt like 5 seconds.",
            chemistryChange: 20,
            suitorResponse: "Aww... Look at you making the synth-punk blush behind their cool shades.",
            resultingExpression: 'blush',
            reactionTag: 'smooth'
          },
          {
            id: 'n9',
            text: "I just really wanted to get your Pop-Tart recipe.",
            chemistryChange: -10,
            suitorResponse: "Hey! The recipe is top secret intellectual property!",
            resultingExpression: 'shock',
            reactionTag: 'awkward'
          }
        ]
      }
    ],
    matchMessage: "OMG! We matched! You actually survived my tempo! Let's hit the rooftop neon lounge this weekend. Bring earplugs just in case!",
    rejectionMessage: "You're cool, but I think our frequencies were slightly out of tune. Keep rocking that retro vibe though!",
    inviteDateLocation: 'Neon Skyline Arcade Rooftop',
    secondDateActivity: 'Co-op retro beat-em-up marathon with spicy midnight ramen'
  },
  {
    id: 'kai',
    name: 'Kai Lin',
    age: 28,
    title: 'Indie Pixel Artist & Game Dev',
    gender: 'men',
    archetype: 'Quiet Genius',
    bio: 'I spend 12 hours perfecting a 16x16 sprite animation. Looking for someone to co-op life with, exchange boba teas, and test play my unfinished indie RPG.',
    flirtingStyle: 'Gentle & Observant',
    favoriteSnack: 'Taro Milk Tea & Strawberry Pocky',
    redFlag: 'Critiques the typography on restaurant menus before ordering food',
    greenFlag: 'Will secretly animate an 8-bit sprite portrait of you and put it as an Easter egg in their game',
    initialChemistry: 50,
    minMatchChemistry: 60,
    avatar: {
      skinTone: 'fair',
      hairStyle: 'bob',
      hairColor: 'raven',
      eyeStyle: 'round-glasses',
      outfitStyle: 'cyber-turtleneck',
      outfitColor: 'purple',
      accessory: 'boba',
      expression: 'idle'
    },
    rounds: [
      {
        prompt: 'Kai timidly adjusts his round glasses and smiles warmly.',
        suitorSays: "Hi! Sorry if I was staring—I was just mentally breaking down the pixel palette of your outfit. If your personality was a game genre, what would it be?",
        choices: [
          {
            id: 'k1',
            text: "A cozy farming simulation like Stardew Valley. Warm, patient, and full of heartfelt gifts.",
            chemistryChange: 25,
            suitorResponse: "That is... literally the sweetest thing ever. Cozy games are pure healing art.",
            resultingExpression: 'blush',
            reactionTag: 'smooth'
          },
          {
            id: 'k2',
            text: "An intricate mystery puzzle game. You have to unlock clues to figure me out.",
            chemistryChange: 20,
            suitorResponse: "Ooh, I love a good narrative puzzle with rich environmental storytelling!",
            resultingExpression: 'love',
            reactionTag: 'funny'
          },
          {
            id: 'k3',
            text: "A brutal soulslike where one mistake immediately ruins your day.",
            chemistryChange: -10,
            suitorResponse: "Haha... wait, are you warning me or bragging? My anxiety just spiked 40 points.",
            resultingExpression: 'shock',
            reactionTag: 'awkward'
          }
        ]
      },
      {
        prompt: 'Kai slides a sketchpad across the table showing adorable doodle sprites.',
        suitorSays: "Quick debate: In a video game, do you prefer a devastating boss fight with heartbreaking music, or a cozy campfire conversation with your companions?",
        choices: [
          {
            id: 'k4',
            text: "The campfire. The characters and quiet moments between battles are why I play.",
            chemistryChange: 25,
            suitorResponse: "Yes! The ludonarrative resonance around campfires is what makes games art.",
            resultingExpression: 'love',
            reactionTag: 'smooth'
          },
          {
            id: 'k5',
            text: "Why not both? A campfire right before the dramatic final boss duel!",
            chemistryChange: 20,
            suitorResponse: "Great game design instinct! High stakes feel earned after emotional bonding.",
            resultingExpression: 'happy',
            reactionTag: 'spicy'
          },
          {
            id: 'k6',
            text: "I skip all cutscenes and dialogues to finish the game as fast as possible.",
            chemistryChange: -20,
            suitorResponse: "A part of my soul as a game developer just crumbled into 1-bit dust...",
            resultingExpression: 'skeptical',
            reactionTag: 'awkward'
          }
        ]
      },
      {
        prompt: 'The timer is ticking down. Kai looks up with a blush on his cheeks.',
        suitorSays: "I'm usually terrible at these speed dating events, but with you I haven't even looked at my watch. Would you want to hang out in the real world?",
        choices: [
          {
            id: 'k7',
            text: "Only if you let me test that indie RPG of yours... and get boba together first.",
            chemistryChange: 25,
            suitorResponse: "Deal! I promise to give your character the best starting gear and infinite boba potions.",
            resultingExpression: 'love',
            reactionTag: 'smooth'
          },
          {
            id: 'k8',
            text: "I'd love that. You have such a comforting and creative aura.",
            chemistryChange: 20,
            suitorResponse: "Thank you... that genuinely made my whole month.",
            resultingExpression: 'blush',
            reactionTag: 'funny'
          },
          {
            id: 'k9',
            text: "I don't know, do you talk about pixels on all your dates?",
            chemistryChange: -10,
            suitorResponse: "Only with people who seem interesting enough to appreciate them...",
            resultingExpression: 'skeptical',
            reactionTag: 'awkward'
          }
        ]
      }
    ],
    matchMessage: "It's a MATCH! ♥ I just sketched a little pixel sprite of us holding boba. Would you like to check out that retro gaming cafe with me this Friday?",
    rejectionMessage: "It was really lovely talking to you! Best of luck finding your player two in the speed dating lobby!",
    inviteDateLocation: 'Chiptune Boba & Board Games Lounge',
    secondDateActivity: 'Cozy indie game playtesting and sharing artisan mochi'
  },
  {
    id: 'rowan',
    name: 'Rowan Thorne',
    age: 27,
    title: 'Cozy Botanist & Coffee Witch',
    gender: 'nonbinary',
    archetype: 'Earthy Mystic',
    bio: 'Guardian of 38 houseplants, two rescue cats named Glitch & Pixel, and master of hand-ground pour-over coffee. Looking for deep conversations and herbal tea dates.',
    flirtingStyle: 'Warm & Witty',
    favoriteSnack: 'Cinnamon Brioche & Iced Matcha Oat Latte',
    redFlag: 'Leaves dried eucalyptus branches in your car vents for good vibes',
    greenFlag: 'Will nurse any dying succulent or plant you own back to vibrant health',
    initialChemistry: 45,
    minMatchChemistry: 55,
    avatar: {
      skinTone: 'warm-tan',
      hairStyle: 'long',
      hairColor: 'emerald',
      eyeStyle: 'sparkle',
      outfitStyle: 'cozy-sweater',
      outfitColor: 'emerald',
      accessory: 'cat-ears',
      expression: 'idle'
    },
    rounds: [
      {
        prompt: 'Rowan sets down a handcrafted mug radiating cinnamon aroma.',
        suitorSays: "Hello, wanderer! The universe aligned our tables. Tell me: when you're overwhelmed by modern noise, where is your sanctuary?",
        choices: [
          {
            id: 'r1',
            text: "Deep in an old forest or botanical garden with zero phone reception.",
            chemistryChange: 25,
            suitorResponse: "The forest whispers back when you listen. You have an old soul, I can feel it.",
            resultingExpression: 'love',
            reactionTag: 'smooth'
          },
          {
            id: 'r2',
            text: "Curled up in bed with rain tapping on the window and a warm cup of cocoa.",
            chemistryChange: 20,
            suitorResponse: "That is maximum hygge energy. I want to build a blanket fort right now.",
            resultingExpression: 'happy',
            reactionTag: 'funny'
          },
          {
            id: 'r3',
            text: "The middle of a crowded mall during Black Friday sales.",
            chemistryChange: -15,
            suitorResponse: "My aura just shrank three feet in terror. Are you secretly a supervillain?",
            resultingExpression: 'shock',
            reactionTag: 'awkward'
          }
        ]
      },
      {
        prompt: 'Rowan points to a tiny potted sprout sitting on the table.',
        suitorSays: "Important question for compatibility: If my cats Glitch and Pixel inspect you, what is your approach strategy?",
        choices: [
          {
            id: 'r4',
            text: "Offer the gentle hand sniff first, let them initiate, and scratch behind the ears.",
            chemistryChange: 25,
            suitorResponse: "A true feline diplomat! You would be accepted into the inner council immediately.",
            resultingExpression: 'love',
            reactionTag: 'smooth'
          },
          {
            id: 'r5',
            text: "I will talk to them in baby voices until they surrender to cuddles.",
            chemistryChange: 15,
            suitorResponse: "Glitch will scoff, but Pixel will melt into a purring puddle.",
            resultingExpression: 'happy',
            reactionTag: 'funny'
          },
          {
            id: 'r6',
            text: "Cats are basically aloof freeloaders.",
            chemistryChange: -20,
            suitorResponse: "Blasphemy! They pay rent in unconditional judgment and spiritual grounding!",
            resultingExpression: 'skeptical',
            reactionTag: 'awkward'
          }
        ]
      },
      {
        prompt: 'Rowan smiles softly as the table bell tolls.',
        suitorSays: "Our speed date is closing, but the energy between us is undeniably cozy. Shall we brew something special next time?",
        choices: [
          {
            id: 'r7',
            text: "Teach me how you make that magic pour-over, and I'll bring the pastries.",
            chemistryChange: 25,
            suitorResponse: "It's a ritual! I'll grind my special Ethiopian beans for our date.",
            resultingExpression: 'love',
            reactionTag: 'spicy'
          },
          {
            id: 'r8',
            text: "I'd love to visit your urban greenhouse and meet the cats.",
            chemistryChange: 20,
            suitorResponse: "The cats are already preparing to approve you, I just know it.",
            resultingExpression: 'blush',
            reactionTag: 'smooth'
          },
          {
            id: 'r9',
            text: "Only if you promise not to read my tea leaves.",
            chemistryChange: -5,
            suitorResponse: "No promises... the tea leaves speak whether we want them to or not!",
            resultingExpression: 'happy',
            reactionTag: 'funny'
          }
        ]
      }
    ],
    matchMessage: "The stars and the coffee grounds were right: IT'S A MATCH! ♥ Come over to the botanical tea house this Sunday for fresh pour-overs and feline cuddles!",
    rejectionMessage: "Our branches grew in different directions today, but I send warmth and blooming energy along your journey!",
    inviteDateLocation: 'The Enchanted Greenhouse Tea Bar',
    secondDateActivity: 'Handcrafted tea blending and succulent potting workshop'
  },
  {
    id: 'blaze',
    name: 'Blaze Vance',
    age: 25,
    title: 'Arcade Speedrunner & Pastry Baker',
    gender: 'men',
    archetype: 'High-Octane Baker',
    bio: 'Holder of 3 world records in retro arcade racers. Fast thumbs, big heart. By day I roll frame-perfect drifts; by morning I knead buttery French croissants.',
    flirtingStyle: 'Playful & Competitive',
    favoriteSnack: 'Warm Chocolate Almond Croissant',
    redFlag: 'Challenges you to Mario Kart and doesn’t hold back the blue shell',
    greenFlag: 'Wakes up at 5 AM to bake fresh brioche and brings it to your door',
    initialChemistry: 40,
    minMatchChemistry: 60,
    avatar: {
      skinTone: 'deep-bronze',
      hairStyle: 'spiky',
      hairColor: 'ruby',
      eyeStyle: 'normal',
      outfitStyle: 'hoodie',
      outfitColor: 'crimson',
      accessory: 'bandana',
      expression: 'idle'
    },
    rounds: [
      {
        prompt: 'Blaze spins an arcade token across his knuckles with dizzying agility.',
        suitorSays: "Sup! I like moving fast, in gaming and in life. But my coach says I need to slow down and date. What’s your biggest bragging right?",
        choices: [
          {
            id: 'b1',
            text: "I can beat Bowser without taking damage and make a killer sourdough from scratch.",
            chemistryChange: 25,
            suitorResponse: "Whoa. Gaming skill AND fermentation game?! Did my guardian angel send you?",
            resultingExpression: 'love',
            reactionTag: 'spicy'
          },
          {
            id: 'b2',
            text: "I can binge an entire 90s anime season in one sitting while eating pizza.",
            chemistryChange: 15,
            suitorResponse: "Respected endurance stat! That takes serious hydration discipline.",
            resultingExpression: 'happy',
            reactionTag: 'funny'
          },
          {
            id: 'b3',
            text: "I once slept for 16 hours straight. I do not do fast-paced.",
            chemistryChange: -10,
            suitorResponse: "16 hours?! Are you a hibernating bear? We might need to find a middle gear.",
            resultingExpression: 'shock',
            reactionTag: 'awkward'
          }
        ]
      },
      {
        prompt: 'Blaze pulls out a fresh miniature pastry wrapped in parchment.',
        suitorSays: "Mini challenge! Take a bite. Tell me what secret spice is folded into this cardamom knot, or guess my favorite track in Mario Kart!",
        choices: [
          {
            id: 'b4',
            text: "Cardamom with orange zest! And your track has to be Rainbow Road because you love high risk.",
            chemistryChange: 30,
            suitorResponse: "BOOM! NAIL ON THE HEAD! You have an elite palate AND you read my mind!",
            resultingExpression: 'love',
            reactionTag: 'smooth'
          },
          {
            id: 'b5',
            text: "I have no idea about spices, but it tastes heavenly. Can I have another?",
            chemistryChange: 20,
            suitorResponse: "Haha, watching someone enjoy my food is better than any trophy anyway.",
            resultingExpression: 'blush',
            reactionTag: 'funny'
          },
          {
            id: 'b6',
            text: "Tastes like regular supermarket pastry to me.",
            chemistryChange: -20,
            suitorResponse: "SUPERMARKET?! That took 72 hours of cold fermentation! My heart took critical damage!",
            resultingExpression: 'skeptical',
            reactionTag: 'awkward'
          }
        ]
      },
      {
        prompt: 'The final bell rings. Blaze jumps up slightly from his seat with a grinning wink.',
        suitorSays: "Lap 3 complete! Checkered flag is waving. Are we taking this race into overtime?",
        choices: [
          {
            id: 'b7',
            text: "Let's do a 1v1 arcade race. Loser buys milkshakes and baked goodies.",
            chemistryChange: 25,
            suitorResponse: "Oh, it is ON! You're gonna eat my pixel dust (and delicious milkshakes)!",
            resultingExpression: 'love',
            reactionTag: 'spicy'
          },
          {
            id: 'b8',
            text: "Only if you promise to bake for our next date too.",
            chemistryChange: 20,
            suitorResponse: "I'll bake you a custom pastry shaped like an arcade cabinet!",
            resultingExpression: 'happy',
            reactionTag: 'smooth'
          },
          {
            id: 'b9',
            text: "I think you have way too much energy for me.",
            chemistryChange: -10,
            suitorResponse: "Fair enough! Sometimes the turbo boost isn't for everybody.",
            resultingExpression: 'idle',
            reactionTag: 'awkward'
          }
        ]
      }
    ],
    matchMessage: "NEW RECORD: WE MATCHED! ♥ The pastry oven is preheated and I've got two vintage arcade controllers ready with your name on one!",
    rejectionMessage: "Great run on the track! Keep that speed up and good luck in the next qualifying heats!",
    inviteDateLocation: 'Turbo Bakery & 8-Bit Speedrun Pit',
    secondDateActivity: 'Retro arcade racing tournament followed by midnight croissant tasting'
  },
  {
    id: 'astra',
    name: 'Dr. Astra Vega',
    age: 29,
    title: 'Astrophysicist & Chiptune DJ',
    gender: 'women',
    archetype: 'Cosmic Visionary',
    bio: 'Researches pulsars by day, produces celestial 8-bit space funk by night. Looking for a co-pilot to share telescope views and decode the cosmic mysteries of human connection.',
    flirtingStyle: 'Intellectual & Dreamy',
    favoriteSnack: 'Space-Freeze-Dried Neapolitan Ice Cream',
    redFlag: 'Explains gravitational redshift when you just asked what time it was',
    greenFlag: 'Will point a 12-inch Schmidt-Cassegrain telescope right at Saturn’s rings for you',
    initialChemistry: 45,
    minMatchChemistry: 60,
    avatar: {
      skinTone: 'cyber-lilac',
      hairStyle: 'afro',
      hairColor: 'lavender',
      eyeStyle: 'sparkle',
      outfitStyle: 'cyber-turtleneck',
      outfitColor: 'purple',
      accessory: 'gold-chain',
      expression: 'idle'
    },
    rounds: [
      {
        prompt: 'Astra gazes out the pixel diner window towards the starry neon sky.',
        suitorSays: "Light from the stars we see tonight traveled millions of years just to illuminate our table. Do you believe in cosmic synchronicity, or pure random collision?",
        choices: [
          {
            id: 'a1',
            text: "I think every atom in our bodies came from exploding stars, so being here together is cosmic destiny.",
            chemistryChange: 25,
            suitorResponse: "Carl Sagan would applaud you! That is breathtakingly romantic.",
            resultingExpression: 'love',
            reactionTag: 'smooth'
          },
          {
            id: 'a2',
            text: "Even if it's pure random probability, this moment is a pretty wonderful roll of the dice.",
            chemistryChange: 20,
            suitorResponse: "A poetic rationalist! The statistical odds of this connection make it even more precious.",
            resultingExpression: 'happy',
            reactionTag: 'funny'
          },
          {
            id: 'a3',
            text: "Stars are just giant balls of burning gas. Let's not get carried away.",
            chemistryChange: -15,
            suitorResponse: "Where is your sense of cosmic wonder?! The universe wept a tiny hydrogen tear.",
            resultingExpression: 'skeptical',
            reactionTag: 'awkward'
          }
        ]
      },
      {
        prompt: 'Astra shows an audio waveform visualizer vibrating on her pocket console.',
        suitorSays: "I sampled a recording of the Vela pulsar spinning 11 times per second into a dance track. Want to listen?",
        choices: [
          {
            id: 'a4',
            text: "Share an earbud with me. I want to dance to the heartbeat of the cosmos.",
            chemistryChange: 25,
            suitorResponse: "Leaning in... The rhythm syncs with your smile. You really get my vision.",
            resultingExpression: 'love',
            reactionTag: 'spicy'
          },
          {
            id: 'a5',
            text: "That sounds like the ultimate science nerd flex, and I respect it immensely.",
            chemistryChange: 15,
            suitorResponse: "Haha, guilty as charged! Science nerd flexes are my primary mating ritual.",
            resultingExpression: 'happy',
            reactionTag: 'funny'
          },
          {
            id: 'a6',
            text: "Static noise gives me a migraine, sorry.",
            chemistryChange: -10,
            suitorResponse: "It's not static, it's cosmic radio telemetry! But okay, volume down.",
            resultingExpression: 'idle',
            reactionTag: 'awkward'
          }
        ]
      },
      {
        prompt: 'The warning chime signals the end of the speed date orbit.',
        suitorSays: "Our planetary encounter has reached perihelion. Should we establish a permanent binary star system?",
        choices: [
          {
            id: 'a7',
            text: "Only if you bring the telescope. I want you to teach me all the constellations.",
            chemistryChange: 25,
            suitorResponse: "The observatory roof is reserved for us. Prepare to be starry-eyed.",
            resultingExpression: 'love',
            reactionTag: 'smooth'
          },
          {
            id: 'a8',
            text: "I'd love that. You've made my heart undergo a gravitational collapse in the best way.",
            chemistryChange: 20,
            suitorResponse: "A supernova of charm! You really know the astrophysics pickup lines.",
            resultingExpression: 'blush',
            reactionTag: 'spicy'
          },
          {
            id: 'a9',
            text: "I think I prefer to stay a rogue asteroid drifting solo.",
            chemistryChange: -15,
            suitorResponse: "Safe travels through deep space, lone traveler.",
            resultingExpression: 'idle',
            reactionTag: 'awkward'
          }
        ]
      }
    ],
    matchMessage: "COSMIC CONVERGENCE! ♥ Our orbital resonance is stable and we've officially matched! Meet me at the planetarium observatory Friday night!",
    rejectionMessage: "Our trajectories intersected for a bright moment before drifting into separate galaxies. May your stars shine bright!",
    inviteDateLocation: 'Starlight Observatory & Planetarium Dome',
    secondDateActivity: 'Stargazing telescope session with celestial chiptune listening party'
  },
  {
    id: 'milo',
    name: 'Milo Sterling',
    age: 24,
    title: 'Retro Dungeon Master & Vintage Thrift King',
    gender: 'men',
    archetype: 'Whimsical Storyteller',
    bio: 'I roll a 20-sided die to make important decisions. Collector of oversized vintage corduroy jackets, forgotten fantasy paperbacks, and 1990s floppy disks.',
    flirtingStyle: 'Dramatic & Endearing',
    favoriteSnack: 'Salty Soft Pretzels & Craft Root Beer',
    redFlag: 'Speaks in Shakespearean iambic pentameter when stressed',
    greenFlag: 'Will craft an epic 40-page campaign where you are the heroic savior of the realm',
    initialChemistry: 45,
    minMatchChemistry: 55,
    avatar: {
      skinTone: 'peach',
      hairStyle: 'fade',
      hairColor: 'golden',
      eyeStyle: 'wink',
      outfitStyle: 'vintage-shirt',
      outfitColor: 'yellow',
      accessory: 'none',
      expression: 'idle'
    },
    rounds: [
      {
        prompt: 'Milo pulls a glittering twenty-sided die from his vintage vest.',
        suitorSays: "Greetings, noble traveler! A wild speed dating encounter approaches! Roll for initiative, or tell me: what is your secret character class in real life?",
        choices: [
          {
            id: 'm1',
            text: "Bard with +5 Charisma and a tendency to cast vicious mockery when provoked.",
            chemistryChange: 25,
            suitorResponse: "A fellow bard?! Quick, let us perform a legendary tavern duet right here!",
            resultingExpression: 'love',
            reactionTag: 'spicy'
          },
          {
            id: 'm2',
            text: "Paladin of cozy naps, swearing an oath to defend comfort and warm blankets.",
            chemistryChange: 20,
            suitorResponse: "The most sacred oath of all! I shall pledge fealty to your duvet fortress.",
            resultingExpression: 'happy',
            reactionTag: 'funny'
          },
          {
            id: 'm3',
            text: "I am a normal adult human who doesn't play fantasy games.",
            chemistryChange: -15,
            suitorResponse: "Critical fail on imagination! But fear not, the cure is within reach.",
            resultingExpression: 'shock',
            reactionTag: 'awkward'
          }
        ]
      },
      {
        prompt: 'Milo rolls the d20 on the table. It lands on a Natural 20!',
        suitorSays: "NAT 20! The dating gods have blessed this table! You get one free wish from the DM. What do you command?",
        choices: [
          {
            id: 'm4',
            text: "I wish for an unforgettable vintage thrift crawl with you picking my outfit.",
            chemistryChange: 25,
            suitorResponse: "YOUR WISH IS GRANTED! I already envision you in pristine 80s pastel corduroy!",
            resultingExpression: 'love',
            reactionTag: 'smooth'
          },
          {
            id: 'm5',
            text: "I wish for infinite pretzels and root beer refills for the rest of the night.",
            chemistryChange: 20,
            suitorResponse: "A wish of true practical wisdom! Barkeep, bring this legend a feast!",
            resultingExpression: 'happy',
            reactionTag: 'funny'
          },
          {
            id: 'm6',
            text: "I wish for the speed date timer to go off faster.",
            chemistryChange: -25,
            suitorResponse: "That deals 3d6 psychic damage directly to my fragile confidence...",
            resultingExpression: 'skeptical',
            reactionTag: 'awkward'
          }
        ]
      },
      {
        prompt: 'The tavern... er, diner bell sounds the end of the round.',
        suitorSays: "Alas, the sands of the hourglass run dry! Will our party unite for another quest, or shall our paths diverge?",
        choices: [
          {
            id: 'm7',
            text: "I want to join your adventuring party. You make life feel like an epic adventure.",
            chemistryChange: 25,
            suitorResponse: "Huzzah! Together we shall conquer the dragons of mundane existence!",
            resultingExpression: 'love',
            reactionTag: 'smooth'
          },
          {
            id: 'm8',
            text: "Only if I get first pick of the treasure loot on our second date.",
            chemistryChange: 20,
            suitorResponse: "Deal! All the shiny magic rings and warm pretzels are yours.",
            resultingExpression: 'blush',
            reactionTag: 'funny'
          },
          {
            id: 'm9',
            text: "I think my campaign log is currently full, Milo.",
            chemistryChange: -10,
            suitorResponse: "Then may fortune favor your solo quest, brave companion!",
            resultingExpression: 'idle',
            reactionTag: 'awkward'
          }
        ]
      }
    ],
    matchMessage: "CRITICAL SUCCESS! WE MATCHED! ♥ The DM declares our compatibility a legendary artifact! Let's explore the hidden vintage quarter together this Saturday!",
    rejectionMessage: "A noble encounter nonetheless! May your future dice rolls be blessed with natural twenties!",
    inviteDateLocation: 'The Dragon & Floppy Disk Tavern',
    secondDateActivity: 'Retro thrift store scavenger hunt and vintage board game duel'
  }
];
