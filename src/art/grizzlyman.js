// VARIABLES

const grizzlyHelmet = [
  '....KKK.....KKK......',
  '...KnnnK...KnnnK.....',
  '...KnOnKKKKKnOnK.....',
  '..KnnnnnnnnnnnnnK....',
  '.KnnnnnnnnnnnOOnnK...',
  '.KnnnnnnnnnnnnnnnnK..',
  'KNnnnnnnnnnKKKKKKnK..',
];

const grizzlyFaces = {
  normal: [
    'KNnnnnnnnnKSSSSSSKK..',
    'KNnnnnnnnnKSSSSWKSK..',
    'KNNnnnnnnnKSSSSWKSK..',
    'KNNnnnnnnnKSSSOOOOOKK',
    '.KNNnnnnnnKSSOOOOOOOKK',
    '.KNNNnnnnKSSOOOOOOKKKK',
  ],
  blink: [
    'KNnnnnnnnnKSSSSSSKK..',
    'KNnnnnnnnnKSSSSSSSK..',
    'KNNnnnnnnnKSSSKKKSK..',
    'KNNnnnnnnnKSSSOOOOOKK',
    '.KNNnnnnnnKSSOOOOOOOKK',
    '.KNNNnnnnKSSOOOOOOKKKK',
  ],
  roar: [
    'KNnnnnnnnnKSSKKKSKK..',
    'KNnnnnnnnnKSSSSWKSK..',
    'KNNnnnnnnnKSSSSWKOOKK',
    'KNNnnnnnnnKSSOOOOOOOKK',
    '.KNNnnnnnnKSOKKKKKKKKK',
    '.KNNNnnnnKSOKWKRRRWK..',
    '..KNNNnnnKOOOOOOOOK...',
  ],
  dizzy: [
    'KNnnnnnnnnKSSSSSSKK..',
    'KNnnnnnnnnKSSSKSKSK..',
    'KNNnnnnnnnKSSSSKSSK..',
    'KNNnnnnnnnKSSSKOKOOKK',
    '.KNNnnnnnnKSSOOOOOOOKK',
    '.KNNNnnnnKSSOOOOOOKKKK',
  ],
  grimace: [
    'KNnnnnnnnnKSKKSSSKK..',
    'KNnnnnnnnnKSSKKKKSK..',
    'KNNnnnnnnnKSSSSSSSK..',
    'KNNnnnnnnnKSSSOOOOOKK',
    '.KNNnnnnnnKSSOKWKWKOKK',
    '.KNNNnnnnKSSOOOOOOKKKK',
  ],
};

const grizzlyTorso = [
  '...KKKKKKKKKKKKK....',
  '..KnnnnnnnnnnnnnK...',
  '.KNnnnnnKKKKKKnnnK..',
  '.KNnnnnKOOOOOOKnnK..',
  'KNNnnnKOOOOOOOOKnK..',
  'KNNnnnKOOOOOOOOKnK..',
  'KNNnnnKOOOOOOOOKnK..',
  'KNNnnnKOOOOOOOOKnK..',
  'KNNNnnnKOOOOOOKnnK..',
  'KNNNnnnnKKKKKKnnnK..',
  '.KNNNNNNNNNNNNNNNK..',
  '..KKKKKKKKKKKKKKK...',
];

const grizzlyPaw = [
  '.KnnnnnnK..',
  'KnnnnnnnnK.',
  'KnnnnnnnnK.',
  'KKKKKKKKKK.',
  'KWWKWWKWWK.',
  'KWGKWGKWGK.',
  '.KWKKWKKWK.',
  '..K..K..K..',
];

const grizzlyArms = {
  hang: [
    '..KKKKK...',
    '.KnnnnnK..',
    'KnnnOnnnK.',
    'KnnOnnnnK.',
    'KnnnnnnnK.',
    '.KnnnnnK..',
    '..KnnnnK..',
    '..KnnnnK..',
    '..KNNNNK..',
    ...grizzlyPaw,
  ],
  slam: [
    '..KKKKK......',
    '.KnnnnnK.....',
    'KnnnOnnnK....',
    'KnnOnnnnK....',
    'KnnnnnnnK....',
    '.KnnnnnnK....',
    '..KnnnnnK....',
    '...KnnnnK....',
    '...KNNNNK....',
    ...grizzlyPaw.map(row => '..' + row),
  ],
  raise: [
    '.........K..K..K..',
    '........KWKKWKKWK.',
    '........KGWKGWKGWK',
    '........KWWKWWKWWK',
    '........KKKKKKKKKK',
    '........KnnnnnnnnK',
    '........KnnnnnnnnK',
    '.........KnnnnnnK.',
    '..........KNNNNK..',
    '..........KnnnnK..',
    '..KKKKK...KnnnnK..',
    '.KnnnnnK.KnnnnnK..',
    'KnnnOnnnKnnnnnK...',
    'KnnOnnnnnnnnnK....',
    'KnnnnnnnnnnnK.....',
    '.KnnnnnnnnKK......',
    '..KKKKKKKK........',
  ],
};

const grizzlyLegs = {
  stand: [
    '..KNNnnnnK..KNnnnnnK..',
    '..KNnnnnnK..KNnnnnnK..',
    '..KNnnnnnK..KNnnnnnK..',
    '.KNNnnnnnK..KNNnnnnnK.',
    '.KNNnnnnnK..KNNnnnnnK.',
    'KNNNNNNNNK..KNNNNNNNNK',
    'KGGGGGGGGK..KGGGGGGGGK',
    'KKKKKKKKKK..KKKKKKKKKK',
  ],
  walk: [
    '..KNNnnnnK...KNnnnnnK.',
    '.KNNnnnnK....KNnnnnnK.',
    '.KNnnnnnK.....KNnnnnnK',
    'KNNnnnnK......KNNnnnnK',
    'KNNnnnnK.....KNNNnnnnK',
    'KNNNNNNK....KNNNNNNNNK',
    'KGGGGGGK....KGGGGGGGGK',
    'KKKKKKKK....KKKKKKKKKK',
  ],
  jump: [
    '..KNNnnnnK..KNnnnnnK..',
    '.KNNnnnnnK..KNnnnnnnK.',
    'KNNNnnnnK....KNnnnnnnK',
    'KGGGGGGK.....KNNNNNNNK',
    'KKKKKKK......KGGGGGGGK',
    '.............KKKKKKKKK',
  ],
  squat: [
    '.KNNNnnnnK..KNNnnnnnK.',
    'KNNNNNNNNK..KNNNNNNNNK',
    'KGGGGGGGGK..KGGGGGGGGK',
    'KKKKKKKKKK..KKKKKKKKKK',
  ],
};

const grizzlyQuadBody = [
  '.......KKKKKKKKKK.......',
  '....KKKnnnnnnnnnnKK.....',
  '...KnnnnnnnnnnnnnnnKK...',
  '..KNnnnnnnnnnnnnnnnnnK..',
  '.KNNnnnnnnnnnnnnnnnnnnK.',
  '.KNNnnnnnnnnnnnnnnnnnnK.',
  'KNNNnnnnnnnnnnnnnnnnnnnK',
  'KNNNnnnnnnnnnnnnnnnnnnnK',
  'KNNNNnnnnnnnnnnnnnnnnnnK',
  '.KNNNNNNKOOOOOOOOOKnnnK.',
  '..KKKNNNKOOOOOOOOOKnnK..',
  '.....KKKKKKKKKKKKKKKK...',
];

const grizzlyQuadLegs = {
  reach: [
    [['.KNNNNK.', 'KNNNNNK.', 'KNNNNK..', 'KNNNK...', 'KNNNK...', 'KGGGK...', 'KKKKK...'], 1, 0],
    [['.KNNNNK.', '.KNNNNNK', '..KNNNNK', '...KNNNK', '...KGGGK', '...KKKKK'], 5, 0],
    [['.KnnnnK..', '.KnnnnnK.', '..KnnnnnK', '..KnnnnnK', '..KKKKKKK', '..KWKWKWK', '..KWKWKWK', '...K.K.K.'], 16, -1],
    [['.KnnnnK..', 'KnnnnnK..', 'KnnnnK...', 'KnnnnK...', 'KKKKKK...', 'KWKWKW...', '.K.K.....'], 11, 0],
  ],
  gather: [
    [['.KNNNNK.', '.KNNNNK.', '..KNNNK.', '..KNNNK.', '..KGGGK.', '..KKKKK.'], 3, 0],
    [['.KNNNNK.', '.KNNNNK.', '.KNNNK..', '.KNNNK..', '.KGGGK..', '.KKKKK..'], 5, 0],
    [['.KnnnnK..', '.KnnnnK..', '.KnnnnK..', '.KnnnnK..', 'KKKKKKK..', 'KWKWKWK..', 'KWKWKWK..', '.K.K.K...'], 14, -1],
    [['.KnnnnK..', '.KnnnnK..', '.KnnnnK..', '.KnnnnK..', '.KKKKKK..', '.KWKWKW..', '..K.K....'], 12, 0],
  ],
};

const grizzlyFaceHalf = [
  '................',
  '....KKKK........',
  '...KnnnnK.......',
  '..KnnOOnnK......',
  '..KnOOOOnKKKKKKK',
  '..KnnOOnnnnnnnnn',
  '...KnnnnnnnnnnnO',
  '....KnnnnnnnnnnO',
  '....KnnnnnnnnnnO',
  '...KnnnnnnnnnnnO',
  '...KnnnnnnnnnnnO',
  '..KnnnnnnnnnnnnO',
  '..KnnnnnnKKKKKKK',
  '..KNnnnnKSSSSSSS',
  '..KNnnnKSSSSSSSS',
  '..KNnnnKSKKKSSSS',
  '..KNnnnKSSSKKSSS',
  '..KNnnnKSWWWKSSS',
  '..KNnnnKSWWKKSSS',
  '..KNNnnKSSSSSSSS',
  '..KNNnnKSSSSSOOO',
  '...KNNnKSSSOOOOO',
  '...KNNnKSSOOOOOO',
  '...KNNNKSOOOOOOK',
  '....KNNKSOOOOOOK',
  '....KNNKSSOOOOOO',
  '.....KKKKSSOOOOO',
  '..KKKnnnKKSSSSSS',
  '.KnnnnnnnnKKKKKK',
  'KnnOOnnnnnnnnnnn',
  'KnOOOOnnnnnnnnnn',
  'KnnOOnnnnnnnnnnn',
];

const grizzlyWaveRows = [
  [
    '.......K........',
    '......KOK.......',
    '......KOnK..K...',
    '..K..KOnnK.KOK..',
    '.KOK.KOnnNKKOnK.',
    '.KOnKKOnnNKOnnK.',
    'KOnnKOnnnNKOnNK.',
    'KOnnNKnnnNKnnNNK',
    'KnnnNKnnnNKnnNNK',
    'KnnNNKnnNNKnNNNK',
    'KNNNNKNNNNKNNNNK',
    'KKKKKKKKKKKKKKKK',
  ],
  [
    '...K.......K....',
    '..KOK.....KOK...',
    '..KOnK...KOnK...',
    '.KOnnK..KOnnNK..',
    '.KOnnNKKOnnnNK.K',
    'KOnnnNKOnnnnNKOK',
    'KOnnNNKOnnnNNKnK',
    'KnnnNNKnnnnNNKnK',
    'KnnNNNKnnnNNNKNK',
    'KnNNNNKnnNNNNKNK',
    'KNNNNNKNNNNNNKNK',
    'KKKKKKKKKKKKKKKK',
  ],
];

const grizzlyRockRows = [
  '.....KKKKKK.....',
  '...KKGGGGGDKK...',
  '..KGGWWGGGGDDK..',
  '.KGGWWGGGGGGDDK.',
  '.KGWWGGGGGGGGDK.',
  'KGGGGGGGGGGGGDDK',
  'KGGGGGGGGGGGDDDK',
  'KGGGGGKKGGGGDDDK',
  'KGGGGKDDKGGGDDDK',
  'KGGGGGKKGGGDDDDK',
  'KDGGGGGGGGGDDDDK',
  '.KDGGGGGGGDDDDK.',
  '.KDDGGGGGDDDDDK.',
  '..KDDDDDDDDDDK..',
  '...KKDDDDDDKK...',
  '.....KKKKKK.....',
];

const grizzlySlashRows = [
  [
    '..OWWWO...OWWWO..OWWO...',
    '...OOWWO..OWWWO.OWWWWO..',
    '...OWWWWO..OWWWO.OWWWO..',
    '....OWWWO..OWWWO.OWWWWO.',
    '.....OWWWO.OWWWWO.OWWWO.',
    '......OWWWOOWWWWO.OWWWO.',
    '......OWWWO.OWWWO.OWWWO.',
    '......OWWWO.OWWWWOOWWWWO',
    '......OWWWWOOWWWWO.OWWWO',
    '.......OWWWO.OWWWO.OWWWO',
    '.......OWWWO.OWWWO.OWWWO',
    '.......OWWWO..OOO...OOO.',
    '........OOO.............',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
  ],
  [
    '..OWWWO...OWWWO..OWWO...',
    '...OOWWO..OWWWO.OWWWWO..',
    '...OWWWWO..OWWWO.OWWWO..',
    '....OWWWO..OWWWO.OWWWWO.',
    '.....OWWWO.OWWWWO.OWWWO.',
    '......OWWO.OWWWWO.OWWWO.',
    '......OWWWO.OWWWO.OWWWO.',
    '......OWWWO.OWWWWOOWWWWO',
    '......OWWWWOOWWWWO.OWWWO',
    '.......OWWWO.OWWWO.OWWWO',
    '.......OWWWO.OWWWO.OWWWO',
    '.......OWWWO.OWWWO.OWWWO',
    '.......OWWWO.OWWWO.OWWWO',
    '.......OWWWO.OWWWO.OWWWO',
    '.......OWWWO.OWWWO.OWWWO',
    '.......OWWWO.OWWWO.OWWWO',
    '......OWWWWOOWWWWO.OWWWO',
    '......OWWWO.OWWWWOOWWWWO',
    '......OWWWO.OWWWO.OWWWO.',
    '......OWWO.OWWWWO.OWWWO.',
    '.....OWWWO.OWWWWO.OWWWO.',
    '....OWWWO..OWWWO.OWWWWO.',
    '...OWWWWO..OWWWO.OWWWO..',
    '....OWWO..OWWWO.OWWWWO..',
  ],
  [
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '.........O..............',
    '........OWO....O........',
    '........OWWO..OWO.......',
    '.......OWWWO.OWWWO..OOO.',
    '.......OWWO..OWWWO.OWWWO',
    '......OWWWO..OWWO..OWWO.',
    '......OWWWO..OWWO..OWWO.',
    '......OWWO..OWWWO..OWWO.',
    '......OWO...OWWO..OWWWO.',
    '.....OWWO..OWWWO..OWWO..',
    '....OWWO...OWWO..OWWWO..',
  ],
];

const grizzlyPawIcon = [
  '...K....K....K..',
  '..KWK..KWK..KWK.',
  '..KWK..KWK..KWK.',
  '..KGK..KGK..KGK.',
  '.KnnnKKnnnKKnnnK',
  '.KnOnKKnOnKKnOnK',
  '.KnnnKKnnnKKnnnK',
  '..KKK..KKK..KKK.',
  '...KKKKKKKKKKK..',
  '..KnnnnnnnnnnnK.',
  '.KnnOOOOOOOOnnnK',
  '.KnOOOOOOOOOOnnK',
  '.KnOOOOOOOOOOnnK',
  '.KnnOOOOOOOOnnK.',
  '..KnnnnnnnnnnK..',
  '...KKKKKKKKKK...',
];

const grizzlyMarmotBody = [
  '...KK..KK...',
  '..KoOKKOoK..',
  '.KOOOOOOOOK.',
  '.KOOOOOKWOK.',
  'KOOOOOOKKOOK',
  'KOOOOOOOOSSK',
  '.KOOOOOOSKKK',
  '.KOOOOOOSWK.',
  'KOoKOOSSKK..',
  'KOoKSSSSSK..',
  'KOoKSSSSSK..',
  '.KKSSSSSSK..',
];

const grizzlyMarmotThrowBody = [
  '.......KK...',
  '...KK.KGGK..',
  '..KoOKKGGK..',
  '.KOOOOKKKOK.',
  '.KOOOOKOKWK.',
  'KOOOOOOKOKOK',
  'KOOOOOOOOSSK',
  '.KOOOOOOSKKK',
  '.KOOOOOOSWK.',
  'KOoKOOSSKK..',
  'KOoKSSSSSK..',
  '.KKSSSSSSK..',
];

const grizzlyMound = [
  '..KKNNNNNNNNKK..',
  '.KNnnNNNNNNnnNK.',
  'KNnnnnnnnnnnnnNK',
  'KnnnNnnnnnNnnnnK',
  'KnNnnnnNnnnnnNnK',
  'KKKKKKKKKKKKKKKK',
];

const grizzlyMoundHole = [
  '....KKKKKKKK....',
  '..KKNKKKKKKNKK..',
  '.KNnnNKKKKNnnNK.',
  'KNnnnnnnnnnnnnNK',
  'KnnnNnnnnnNnnnnK',
  'KnNnnnnNnnnnnNnK',
  'KKKKKKKKKKKKKKKK',
];

const grizzlySalmonRows = [
  [
    '....KKKK....',
    '...KPPPPK...',
    '..KPPWKPPK..',
    '..KPPKKPPK..',
    '.KPPPPPPPPK.',
    '.KpPPPPPWPK.',
    'KGKpPPPPWPK.',
    'KGKpPPPPWPKK',
    '.KKpPPPPWPGK',
    '..KppPPPWPGK',
    '..KppPPPWPKK',
    '..KppPPPWPK.',
    '...KpPPWPK..',
    '...KppPWPK..',
    '....KpPPK...',
    '...KKKKKKK..',
    '..KGGK.KGGK.',
    '..KKK...KKK.',
  ],
  [
    '....KKKK....',
    '...KPPPPK...',
    '..KPPWKPPK..',
    '..KPPKKPPK..',
    '.KPPPPPPPPK.',
    '.KpPPPPPWPK.',
    'KGKpPPPPWPK.',
    'KGKpPPPPWPKK',
    '.KKpPPPPWPGK',
    '..KppPPPWPGK',
    '..KppPPPWPKK',
    '..KppPPPWPK.',
    '..KpPPPWPK..',
    '..KppPWPK...',
    '..KpPPK.....',
    '.KKKKKKK....',
    'KGGK.KGGK...',
    'KKK...KKK...',
  ],
];

const grizzlyBatRows = {
  hang: [
    '...K....K...',
    '...KK..KK...',
    '..KVVKKVVK..',
    '.KVVVVVVVVK.',
    '.KVDVVVVDVK.',
    'KVVDVVVVDVVK',
    'KVVDVKKVDVVK',
    'KVVDVVVVDVVK',
    '.KVDKVVKDVK.',
    '..KK.KK.KK..',
    '.....KK.....',
  ],
  wake: [
    '...K....K...',
    '...KK..KK...',
    '..KVVKKVVK..',
    '.KVVVVVVVVK.',
    '.KVDVVVVDVK.',
    'KVVDVVVVDVVK',
    'KVVDRVVRDVVK',
    'KVVDVWWVDVVK',
    '.KVDKVVKDVK.',
    '..KK.KK.KK..',
    '.....KK.....',
  ],
  up: [
    'K..............K',
    'KK............KK',
    'KVK...K..K...KVK',
    'KVVK..KKKK..KVVK',
    '.KVVKKVVVVKKVVK.',
    '.KVVVVRVVRVVVVK.',
    '..KVVVVVVVVVVK..',
    '...KKKVWWVKKK...',
    '......KKKK......',
  ],
  down: [
    '......K..K......',
    '......KKKK......',
    '....KKVVVVKK....',
    '..KKVVRVVRVVKK..',
    '.KVVVVVVVVVVVVK.',
    'KVVVKKVWWVKKVVVK',
    'KVVK..KKKK..KVVK',
    'KVK..........KVK',
    'KK............KK',
    'K..............K',
  ],
};

const grizzlyRollerRows = {
  idle: [
    '......KKKKKK........',
    '.....KYYYYYYK.......',
    '....KYYYYYYYYK......',
    '....KYKKKKKKYK......',
    '....KYKKKRRKYK......',
    '....KYKKKKKKYK......',
    '...KKYYYYYYYYKK.....',
    '..KGGKKKKKKKKGGK....',
    '..KGYYYYYYYYYYGK....',
    '..KGYOOOOOOOOYGKK...',
    '..KGYOYYYYYYOYGKGK..',
    '..KGYOOOOOOOOYGKGK..',
    '..KGYYYYYYYYYYGKGK..',
    '...KKKKKKKKKKKKKKK..',
    '..KDDDDDDDDDDDDDK...',
    '.KDKDKDKDKDKDKDKDK..',
    '.KDDDDDDDDDDDDDDDK..',
    '..KKKKKKKKKKKKKKK...',
  ],
  push: [
    '......KKKKKK........',
    '.....KYYYYYYK.......',
    '....KYYYYYYYYK......',
    '....KYKKKKKKYK......',
    '....KYKKKKRRYK......',
    '....KYKKKKKKYK......',
    '...KKYYYYYYYYKK.....',
    '..KGGKKKKKKKKGGKKKK.',
    '..KGYYYYYYYYYYGKGGGK',
    '..KGYOOOOOOOOYGKGKGK',
    '..KGYOYYYYYYOYGKGGGK',
    '..KGYOOOOOOOOYGKKKK.',
    '..KGYYYYYYYYYYGK....',
    '...KKKKKKKKKKKKK....',
    '..KDDDDDDDDDDDDDK...',
    '.KDKDKDKDKDKDKDKDK..',
    '.KDDDDDDDDDDDDDDDK..',
    '..KKKKKKKKKKKKKKK...',
  ],
};

const grizzlyStalactiteRows = [
  'KKKKKKKKKKKK',
  'KDGGGGGGGDDK',
  '.KDGGWGGGDK.',
  '.KDGGWGGDDK.',
  '.KDGGGGGDDK.',
  '..KDGGGGDK..',
  '..KDGWGGDK..',
  '..KDGGGDDK..',
  '...KDGGDK...',
  '...KDGGDK...',
  '...KDGDDK...',
  '....KGDK....',
  '....KGDK....',
  '....KDDK....',
  '.....KK.....',
];

const grizzlyRockTile = [
  'nnnnnnnKnnnnnnnO',
  'nOOnnnnKnnnnnnnN',
  'nOnnnnnKnnnOnnnN',
  'nnnnnnKNnnnnnnnN',
  'nnnnnKNNnnnnnnNN',
  'NnnnnKNnnnnnnNNK',
  'KNNNNKNNNNNNNKKn',
  'nKKKKnKKKKKKKnnn',
  'nnnnnnnnnKnnnnnn',
  'nOOnnnnnnKnnnnnO',
  'nOnnnnnnnKNnnnnn',
  'nnnnnnnnKNNnnnnn',
  'NnnnnnnKNNnnnnnN',
  'NNnnnnKNNNNnnnNN',
  'KNNNNKKNNNNNNNNK',
  'nKKKKnnKKKKKKKKn',
];

const grizzlyCrackTile = [
  'KKKKKKKKKKKKKKKK',
  'KOOOOOnnKnnnnnNK',
  'KOnnnnnKnnnnnnNK',
  'KOnnnnnKnnnnnnNK',
  'KOnnnnnnKnnnnnNK',
  'KnnnnnnnKKnnnnNK',
  'KnnnnnnKnnKKnnNK',
  'KnKKnnKnnnnnKKNK',
  'KKnnKKnnnnnnnnKK',
  'KnnnnnKnnnnnnnNK',
  'KnnnnnnKnnnnnnNK',
  'KnnnnnnKnnnnnnNK',
  'KnnnnnKnnnnnnnNK',
  'KnnnnnKnnnnnnNNK',
  'KNNNNNKNNNNNNNNK',
  'KKKKKKKKKKKKKKKK',
];

const grizzlyFallRows = [
  'WAAaAAWAAaaAaWAa',
  'WAAWAAWAAaWAaWAa',
  'WAAWAAaaAaWAaaAa',
  'WAAaAAaWAaWAaAAW',
  'aAAaAaaWAaaAaAAW',
  'aAAaAWaWAaAAWAAW',
  'aaAaAWaWAaAAWAaa',
  'aWAaAWaaAWAAWAWa',
  'aWAaaaaAAWAAWAWa',
  'aWAaWAaAAWAaWAWa',
  'aWaaWAaAAWAWaAaa',
  'aaWaWAaAaaAWaAAa',
  'aAWaWAaAWaAWaaAa',
  'aAWaWAaAWaAaaWAa',
  'aAaaaAWAWaAAaWAa',
  'aAAaAAWAWaAAaWAa',
];

const grizzlyWaterRows = [
  'AAAAAAAAAAAAAAAA',
  'AAAaAAAAAAAAAAAA',
  'AAAAAAAAAAAaAAAA',
  'AAAAAAAAAAAAAAAA',
  'AAAAAAaAAAAAAAAA',
  'AAAAAAAAAAAAAAAA',
  'AaAAAAAAAAAAAaAA',
  'AAAAAAAAAAAAAAAA',
  'AAAAAAAAAaAAAAAA',
  'AAAAAAAAAAAAAAAA',
  'AAAaAAAAAAAAAAAA',
  'AAAAAAAAAAAAAAaA',
  'AAAAAAAaAAAAAAAA',
  'AAAAAAAAAAAAAAAA',
  'AAAAAAAAAAAAAAAA',
  'AaAAAAAAAAAaAAAA',
];

const grizzlyWaveTop = [
  '......WW........',
  '....WWaaWW......',
  'WWWWaaAAaaWWWWWW',
  'aaaaAAAAAAaaaaaa',
];

const grizzlyFoamTop = [
  '..W....WW...W...',
  '.WaW..WaaW.WaW..',
  'WaWaWWaWWaWaWaWW',
  'aWaaWaaWaaWaaWaa',
  'AaWAAaWAAaWAaWAA',
];

const grizzlyPineRows = {
  top: [
    '.......KK.......',
    '......KhgK......',
    '......KggK......',
    '.....KhggeK.....',
    '.....KggeeK.....',
    '....KhgggeeK....',
    '...KKgKeeKeKK...',
    '....KhggggeK....',
  ],
  tier: [
    '....KhggggeK....',
    '...KhgggggeeK...',
    '..KhggggggeeeK..',
    '..KgggggggeeeK..',
    '.KhgggggggeeeeK.',
    'KhgggggggggeeeeK',
    'KKKgKKeKKeKKeKKK',
    '...KhggggggeK...',
  ],
  trunk: [
    '...KhgggggeeK...',
    '..KhgggggggeeK..',
    '.KhggggggggeeeK.',
    'KgggggggggeeeeeK',
    'KKKgKKeKKeKKeKKK',
    '......KNnK......',
    '......KNnK......',
    '......KNnK......',
    '......KNnK......',
    '......KNnK......',
    '......KNnK......',
    '......KNnK......',
    '.....KNNnnK.....',
    '....KNNNnnnK....',
    '...KNNNNnnnnK...',
    '..KKKKKKKKKKKK..',
  ],
};

const grizzlyGrassTop = [
  'h.hh.h.hh.hhh.h.',
  'hhhghhhhghhhhghh',
  'gggggggegggggggg',
  'egegggeeegegggeg',
  'KeKeegKeKKeKegKe',
  'nKnKeKnKnnKnKeKn',
];

const grizzlyCaveTop = [
  'GGGGGGGGGGGGGGGG',
  'GOGGGGnGGGGGOGGG',
  'nnnnnnnnnnnnnnnn',
  'KnnOnnnKnnnOnnnK',
  'nKnnnnKnKnnnnnKn',
];

const grizzlyCaveBackRows = [
  'KKKKKKKNKKKKKKKK',
  'KKKKKKNKKKKKKKKK',
  'KKNNNNKKKKKKKKKK',
  'KNKKKKKKKKKKKNKK',
  'NKKKKKKKKNNNNKKK',
  'KKKKKKKKNKKKKKKK',
  'KKKKKKKNKKKKKKKK',
  'KKKKKKKNKKKKKKNN',
  'NNNKKKKKNKKKKNKK',
  'KKKNKKKKKNNNNKKK',
  'KKKKNKKKKKKKKKKK',
  'KKKKKNNKKKKKKKKK',
  'KKKKKKKNKKKKKKKN',
  'KKKKKKKKNNKKKKNK',
  'KKNNKKKKKKNNNNKK',
  'KNKKNKKKKKKKKKKK',
];

const grizzlyScratchRows = [
  'KKKKKKKNKKKKKKKK',
  'KKnKKKNKKnKKKKnK',
  'KKnKKKKKKnKKKKnK',
  'KKKnKKKKKKnKKKKn',
  'NKKnKKKKKNnNKKKn',
  'KKKnKKKKNKnKKKKn',
  'KKKKnKKNKKKnKKKK',
  'KKKKnKKNKKKnKKKK',
  'NNNKnKKKNKKnKKKN',
  'KKKNKnKKKnKKnNNK',
  'KKKKNnKKKKNKnKKK',
  'KKKKKnNKKKKKKnKK',
  'KKKKKKnKKKKKKnKN',
  'KKKKKKKKNNKKKKKK',
  'KKNNKKKKKKNNNNKK',
  'KNKKNKKKKKKKKKKK',
];

const grizzlyCliffBackRows = [
  'NNNNNNNKNNNNNNNN',
  'NnnnnnNKNnnnnNNN',
  'NnnnNNKNNnnnNNNN',
  'NNNNNKNNNNNNNNKK',
  'KKKKKNNNNNNNNKNN',
  'NNNNKNNnnnnNNKNN',
  'NnnNKNnnnnNNNKNN',
  'NNNNKNNNNNNNKNNN',
  'NNNNNKKKKKKKNNNN',
  'NNnnnnNNNNNKNNNN',
  'NnnnnNNNNNNKNnnN',
  'NNNNNNNNNNKNnnNN',
  'KKKNNNNNNKNNNNNN',
  'NNNKKKKKKNNNNNNN',
  'NNnnNNNNKNNNnnNN',
  'NNNNNNNNKNNNNNNN',
];

const grizzlyBonesRows = [
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '....KKKK........',
  '...KWWWWK.......',
  '..KWKWWKWK...KK.',
  '..KWWWWWWK..KWWK',
  '...KWKKWK..KWWK.',
  '...KWWWWK.KWWK..',
  'KK..KKKK.KWWKKK.',
  'WWKKKKKKKWWKWWWK',
];

// FUNCTIONS

function grizzlyDarkenArm(rows) {
  return recolorArt(rows, { n: 'N', O: 'n' });
}

function grizzlyFlipVertical(rows) {
  return [...rows].reverse();
}

function grizzlyFlipHorizontal(rows) {
  const width = Math.max(...rows.map(row => row.length));
  return rows.map(row => row.padEnd(width, '.').split('').reverse().join(''));
}

function grizzlyHead(face) {
  return [...grizzlyHelmet, ...grizzlyFaces[face || 'normal']];
}

function buildGrizzly(options) {
  const top = options.top || 0;
  const left = options.left || 0;
  const drop = options.drop || 0;
  const legs = grizzlyLegs[options.legs || 'stand'];
  const parts = [];
  const backArm = options.backArm === 'raise' ? grizzlyFlipHorizontal(grizzlyArms.raise) : grizzlyArms[options.backArm || 'hang'];
  const backArmX = options.backArm === 'raise' ? -6 : options.backArmX || 0;
  const armX = options.armX || (options.arm === 'raise' ? 20 : 21);
  const armY = options.armY || (options.arm === 'raise' ? 2 : 12);
  const backArmY = options.backArm === 'raise' ? 2 : 12;
  parts.push([grizzlyDarkenArm(backArm), backArmX, backArmY + drop]);
  parts.push([grizzlyTorso, 5, 13 + drop]);
  parts.push([legs, 5, 32 - legs.length]);
  parts.push([grizzlyHead(options.face), 7, drop]);
  parts.push([grizzlyArms[options.arm || 'hang'], armX, armY + drop]);
  return composeArt(40 + left, 32 + top, parts.map(([rows, dx, dy]) => [rows, dx + left, dy + top]));
}

function buildGrizzlyQuad(legs, headDrop) {
  const parts = [[grizzlyQuadBody, 0, 4]];
  for (const [rows, dx, dy] of grizzlyQuadLegs[legs]) parts.push([rows, dx, 15 + dy]);
  parts.push([grizzlyHead('normal'), 17, 1 + (headDrop || 0)]);
  return composeArt(40, 23, parts);
}

function grizzlyShiftDown(rows, offset) {
  return rows.map((row, index) => rows[(index - offset + rows.length) % rows.length]);
}

function grizzlyShiftRight(rows, offset) {
  return rows.map(row => row.slice(row.length - offset) + row.slice(0, row.length - offset));
}

function grizzlyLogRows(width) {
  const bark = 'nnnNnnnnnnNnnnnn';
  const rows = [];
  rows.push('.' + 'K'.repeat(width - 2) + '.');
  rows.push('KOK' + 'O'.repeat(width - 6) + 'KOOK');
  rows.push('KOOK' + bark.repeat(4).slice(0, width - 8) + 'KOKOK');
  rows.push('KOKOK' + bark.repeat(4).slice(3, width - 6) + 'KOKOK');
  rows.push('KOOK' + bark.repeat(4).slice(7, width - 1).replace(/n/g, 'N').slice(0, width - 8) + 'KOOK');
  rows.push('KOK' + 'N'.repeat(width - 6) + 'KOK');
  rows.push('.K' + 'K'.repeat(width - 4) + 'K.');
  return rows.map(row => row.padEnd(width, '.').slice(0, width));
}

// VARIABLES

const grizzlyArt = {
  grizzlyStand: { ox: 15, rows: trimRight(buildGrizzly({})) },
  grizzlyBlink: { ox: 15, rows: trimRight(buildGrizzly({ arm: 'raise', armX: 17, armY: 7, face: 'blink' })) },
  grizzlyJump: { ox: 21, rows: trimRight(buildGrizzly({ legs: 'jump', arm: 'raise', backArm: 'raise', face: 'roar', left: 6 })) },
  grizzlyPose: { ox: 21, rows: trimRight(buildGrizzly({ arm: 'raise', backArm: 'raise', face: 'roar', left: 6 })) },
  grizzlySlam: { ox: 15, rows: trimRight(buildGrizzly({ legs: 'squat', arm: 'slam', backArm: 'slam', backArmX: 15, face: 'roar', drop: 4 })) },
  grizzlyGuard: { ox: 15, rows: trimRight(buildGrizzly({ arm: 'raise', armX: 17, armY: 7, face: 'grimace' })) },
  grizzlyGuardWalk: { ox: 15, rows: trimRight(buildGrizzly({ arm: 'raise', armX: 17, armY: 7, face: 'grimace', legs: 'walk' })) },
  grizzlyDizzy: { ox: 15, rows: trimRight(buildGrizzly({ face: 'dizzy' })) },
  grizzlyFlail1: { ox: 15, rows: trimRight(buildGrizzly({ arm: 'raise', face: 'grimace' })) },
  grizzlyFlail2: { ox: 21, rows: trimRight(buildGrizzly({ backArm: 'raise', face: 'grimace', left: 6 })) },
  grizzlyRun1: { ox: 18, rows: trimRight(buildGrizzlyQuad('reach')) },
  grizzlyRun2: { ox: 18, rows: trimRight(buildGrizzlyQuad('gather', 1)) },
  grizzlyCrouch: { ox: 18, rows: trimRight(buildGrizzlyQuad('gather', 2)) },
  grizzlyFace: { ox: 0, oy: 0, rows: mirrorArt(grizzlyFaceHalf) },
  grizzlyWave1: { rows: grizzlyWaveRows[0] },
  grizzlyWave2: { rows: grizzlyWaveRows[1] },
  grizzlyPaw1: { ox: 7, oy: 7, rows: grizzlyPawIcon },
  grizzlyPaw2: { ox: 7, oy: 7, rows: ['................', '................', '...K....K....K..', ...grizzlyPawIcon.slice(3)] },
};

const grizzlyFxArt = {
  grizzlyRock0: { ox: 8, oy: 8, rows: grizzlyRockRows },
  grizzlyRock1: { ox: 8, oy: 8, rows: rotateArt(grizzlyRockRows) },
  grizzlyShard: { ox: 2, oy: 2, rows: ['.KKK.', 'KGGDK', 'KGDDK', '.KKK.'] },
  grizzlyStar: { ox: 2, oy: 2, rows: ['..Y..', '.YYY.', 'YYWYY', '.YYY.', '..Y..'] },
  grizzlyBee1: { ox: 3, oy: 3, rows: ['..WW...', '.WWKW..', 'KYKYKK.', 'KYKYKYK', '.KKKKK.'] },
  grizzlyBee2: { ox: 3, oy: 3, rows: ['.......', '.KWWK..', 'KYKYKK.', 'KYKYKYK', '.KKKKK.'] },
  grizzlyPebble: { ox: 3, oy: 3, rows: ['..KK..', '.KGGK.', 'KGWGDK', 'KGGDDK', '.KDDK.', '..KK..'] },
  grizzlyClawSlash1: { ox: 12, oy: 12, rows: grizzlySlashRows[0] },
  grizzlyClawSlash2: { ox: 12, oy: 12, rows: grizzlySlashRows[1] },
  grizzlyClawSlash3: { ox: 12, oy: 12, rows: grizzlySlashRows[2] },
};

const grizzlyEnemyArt = {
  grizzlyMarmotHide: { rows: grizzlyMoundHole },
  grizzlyMarmotPeek: { rows: composeArt(16, 10, [[grizzlyMarmotBody, 2, 0], [grizzlyMound, 0, 4]]) },
  grizzlyMarmotUp: { rows: composeArt(16, 17, [[grizzlyMarmotBody, 2, 0], [grizzlyMound, 0, 11]]) },
  grizzlyMarmotThrow: { rows: composeArt(16, 17, [[grizzlyMarmotThrowBody, 2, 0], [grizzlyMound, 0, 11]]) },
  grizzlyBatHang: { rows: grizzlyBatRows.hang },
  grizzlyBatWake: { rows: grizzlyBatRows.wake },
  grizzlyBatFly1: { rows: grizzlyBatRows.up },
  grizzlyBatFly2: { rows: grizzlyBatRows.down },
  grizzlyRoller1: { rows: grizzlyRollerRows.idle },
  grizzlyRoller2: { rows: grizzlyRollerRows.push },
  grizzlySalmon1: { rows: grizzlySalmonRows[0] },
  grizzlySalmon2: { rows: grizzlySalmonRows[1] },
  grizzlySalmonDive1: { rows: grizzlyFlipVertical(grizzlySalmonRows[0]) },
  grizzlySalmonDive2: { rows: grizzlyFlipVertical(grizzlySalmonRows[1]) },
};

const grizzlyBoulderArt = {};

const grizzlyTileArt = {
  tileGrizzlyRock: { ox: 0, oy: 0, rows: grizzlyRockTile },
  tileGrizzlyGrass: { ox: 0, oy: 0, rows: [...grizzlyGrassTop, ...grizzlyRockTile.slice(6)] },
  tileGrizzlyCrack: { ox: 0, oy: 0, rows: grizzlyCrackTile },
  tileGrizzlyCliffBack: { ox: 0, oy: 0, rows: grizzlyCliffBackRows },
  tileGrizzlyBones: { ox: 0, oy: 0, rows: grizzlyBonesRows },
};

const grizzlyCaveArt = {
  grizzlyStalactite: { rows: grizzlyStalactiteRows },
  tileGrizzlyCaveTop: { ox: 0, oy: 0, rows: [...grizzlyCaveTop, ...grizzlyRockTile.slice(5)] },
};

const grizzlyCaveBackArt = {
  tileGrizzlyCaveBack: { ox: 0, oy: 0, rows: grizzlyCaveBackRows },
  tileGrizzlyScratch: { ox: 0, oy: 0, rows: grizzlyScratchRows },
};

const grizzlyPineArt = {
  tileGrizzlyPineTop: { ox: 0, oy: 0, rows: [...grizzlyPineRows.top, ...grizzlyPineRows.tier] },
  tileGrizzlyPine: { ox: 0, oy: 0, rows: [...grizzlyPineRows.tier, ...grizzlyPineRows.tier] },
  tileGrizzlyPineTrunk: { ox: 0, oy: 0, rows: grizzlyPineRows.trunk },
  grizzlyForePine: { rows: recolorArt([...grizzlyPineRows.top, ...grizzlyPineRows.tier, ...grizzlyPineRows.tier, ...grizzlyPineRows.tier], { h: 'e', g: 'e', e: 'K' }) },
};

const grizzlyWaterArt = {};

const grizzlyPlatformArt = {
  grizzlyLogPlatform: { ox: 24, oy: 0, rows: grizzlyLogRows(48) },
};

for (let i = 0; i < 4; i++) {
  grizzlyWaterArt['tileGrizzlyFall' + i] = { ox: 0, oy: 0, rows: grizzlyShiftDown(grizzlyFallRows, i * 4) };
  grizzlyWaterArt['tileGrizzlySurface' + i] = { ox: 0, oy: 0, rows: [...grizzlyShiftRight(grizzlyWaveTop, i * 4), ...grizzlyWaterRows.slice(4)] };
  grizzlyWaterArt['tileGrizzlyFoam' + i] = { ox: 0, oy: 0, rows: [...grizzlyShiftRight(grizzlyFoamTop, i * 4), ...grizzlyWaterRows.slice(5)] };
}

let grizzlyBoulderFrame = grizzlyRockRows;
for (let i = 0; i < 4; i++) {
  grizzlyBoulderArt['grizzlyBoulder' + i] = { oy: 16, rows: grizzlyBoulderFrame };
  grizzlyBoulderFrame = rotateArt(grizzlyBoulderFrame);
}

// INITIALIZATION

Object.assign(palettes, {
  grizzlyBoss: { n: 0x17, N: 0x07, O: 0x27, S: 0x37, G: 0x10, R: 0x16 },
  megaGrizzly: { B: 0x07, C: 0x27, v: 0x07 },
  orbGrizzly: { C: 0x17, W: 0x30 },
  grizzlyRocks: { n: 0x17, N: 0x07, O: 0x27, h: 0x2A, g: 0x1A, e: 0x0A },
  grizzlyCave: { n: 0x00, N: 0x0C, O: 0x10, G: 0x10, K: 0x0F },
  grizzlyCaveBack: { N: 0x0C, n: 0x1C, K: 0x0F },
  grizzlyWater: { A: 0x11, a: 0x21, W: 0x30 },
  grizzlyPines: { h: 0x2A, g: 0x1A, e: 0x0A, n: 0x17, N: 0x07 },
  grizzlyLadder: { W: 0x27, G: 0x17, D: 0x07 },
  grizzlyStone: { G: 0x10, D: 0x00, W: 0x30 },
  grizzlyEnemy: { V: 0x13, D: 0x03, R: 0x16, P: 0x25, p: 0x15, n: 0x18, N: 0x08 },
});

registerArt(grizzlyArt, 'grizzlyBoss');
registerArt(grizzlyFxArt, 'grizzlyBoss');
registerArt(grizzlyEnemyArt, 'grizzlyEnemy');
registerArt(grizzlyBoulderArt, 'grizzlyStone');
registerArt(grizzlyTileArt, 'grizzlyRocks');
registerArt(grizzlyCaveArt, 'grizzlyCave');
registerArt(grizzlyCaveBackArt, 'grizzlyCaveBack');
registerArt(grizzlyPineArt, 'grizzlyPines');
registerArt(grizzlyWaterArt, 'grizzlyWater');
registerArt(grizzlyPlatformArt, 'grizzlyRocks');
registerAnimations([
  { label: 'Grizzly Man', fps: 4, frames: ['grizzlyStand', 'grizzlyStand', 'grizzlyBlink', 'grizzlyStand', 'grizzlyPose', 'grizzlyGuard', 'grizzlyGuardWalk', 'grizzlyGuard', 'grizzlyJump', 'grizzlyDizzy'] },
  { label: 'Grizzly Man investida', fps: 8, frames: ['grizzlyCrouch', 'grizzlyRun2', 'grizzlyCrouch', 'grizzlyRun2', 'grizzlyRun1', 'grizzlyRun2', 'grizzlyRun1', 'grizzlyRun2'] },
  { label: 'Grizzly Man soco no chao', fps: 4, frames: ['grizzlyPose', 'grizzlyPose', 'grizzlySlam', 'grizzlySlam'] },
  { label: 'Grizzly Man abelhas', fps: 6, frames: ['grizzlyFlail1', 'grizzlyFlail2'] },
  { label: 'Onda de choque', fps: 8, frames: ['grizzlyWave1', 'grizzlyWave2'] },
  { label: 'Rocha / estilhaco', fps: 6, frames: ['grizzlyRock0', 'grizzlyRock1', 'grizzlyShard'] },
  { label: 'Estrelas / abelhas', fps: 6, frames: ['grizzlyStar', 'grizzlyBee1', 'grizzlyBee2'] },
  { label: 'Grizzly Claw', fps: 15, frames: ['grizzlyClawSlash1', 'grizzlyClawSlash2', 'grizzlyClawSlash3'] },
  { label: 'Arma Grizzly Claw', fps: 6, frames: [{ sprite: 'megaThrow', palette: 'mega' }, { sprite: 'megaThrow', palette: 'megaGrizzly' }] },
  { label: 'Icone Grizzly Claw', fps: 4, frames: ['grizzlyPaw2', 'grizzlyPaw1'] },
  { label: 'Robo-marmota', fps: 3, frames: ['grizzlyMarmotHide', 'grizzlyMarmotHide', 'grizzlyMarmotPeek', 'grizzlyMarmotUp', 'grizzlyMarmotThrow', 'grizzlyMarmotUp', 'grizzlyPebble'] },
  { label: 'Morcego da caverna', fps: 6, frames: ['grizzlyBatHang', 'grizzlyBatHang', 'grizzlyBatWake', 'grizzlyBatHang', 'grizzlyBatFly1', 'grizzlyBatFly2', 'grizzlyBatFly1', 'grizzlyBatFly2'] },
  { label: 'Robo-rolador', fps: 3, frames: ['grizzlyRoller1', 'grizzlyRoller1', 'grizzlyRoller2'] },
  { label: 'Pedregulho', fps: 10, frames: ['grizzlyBoulder0', 'grizzlyBoulder1', 'grizzlyBoulder2', 'grizzlyBoulder3'] },
  { label: 'Robo-salmao', fps: 6, frames: ['grizzlySalmon1', 'grizzlySalmon2', 'grizzlySalmon1', 'grizzlySalmonDive1', 'grizzlySalmonDive2', 'grizzlySalmonDive1'] },
  { label: 'Estalactite', fps: 1, frames: ['grizzlyStalactite'] },
  { label: 'Cachoeira', fps: 15, frames: ['tileGrizzlyFall0', 'tileGrizzlyFall1', 'tileGrizzlyFall2', 'tileGrizzlyFall3'] },
  { label: 'Agua / espuma', fps: 6, frames: ['tileGrizzlySurface0', 'tileGrizzlySurface1', 'tileGrizzlySurface2', 'tileGrizzlySurface3', 'tileGrizzlyFoam0', 'tileGrizzlyFoam1', 'tileGrizzlyFoam2', 'tileGrizzlyFoam3'] },
  { label: 'Retrato Grizzly Man', fps: 1, frames: ['grizzlyFace'] },
]);
