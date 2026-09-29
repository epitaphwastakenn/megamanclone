// VARIABLES

const anglerHat = [
  '.....KKKKKKKKKK.......',
  '....KLLLLLLLLLLK......',
  '....KLLLLLLLLLLK......',
  '....KLLLLLLLLLLLK.....',
  '....KnnnnnnnnnnnK.....',
  '..KKLLLLLLLLLLLLLKK...',
  '.KLLLLLLLLLLLLLLLLLK..',
  'KLLnnnnnnnnnnnnnnnLLK.',
  'KnnKKKKKKKKKKKKKKKnnK.',
  'KKK..............KKK..',
];

const anglerLure = [
  '.KK.',
  'KOOK',
  'KOoK',
  '.KOK',
  '..W.',
  '.WW.',
];

const anglerFly = [
  'KW.',
  'KRK',
  '.K.',
];

const anglerHair = [
  'KNNNNNNNK',
  'KNNNNNNNK',
  'KNNNNNNNK',
  'KNNNNNNNK',
  'KNNNNNNNK',
  '.KNNNNNNK',
  '..KKKKKK.',
];

const anglerReelEar = [
  '.KKKK.',
  'KGGGGK',
  'KGWWGK',
  'KGWKGK',
  'KGGGGK',
  '.KKKK.',
];

const anglerFaces = {
  normal: [
    'SSSKKKKSSK',
    'SSSSWWWKSK',
    'SSSSWWWKSK',
    'SSSSSSSSSK',
    'SSSSSKKKSK',
    'SSSSSSSSK.',
    'KKKKKKKKK.',
  ],
  blink: [
    'SSSKKKKSSK',
    'SSSSSSSSSK',
    'SSSSKKKKSK',
    'SSSSSSSSSK',
    'SSSSSKKKSK',
    'SSSSSSSSK.',
    'KKKKKKKKK.',
  ],
  shout: [
    'SSSKKKKKSK',
    'SSSSWWWKSK',
    'SSSSWWKKSK',
    'SSSSSSSSSK',
    'SSSSKKKKSK',
    'SSSSKqqKSK',
    'KKKKKKKKK.',
  ],
  grin: [
    'SSSKKKKKSK',
    'SSSSWWWKSK',
    'SSSSWWKKSK',
    'SSSSSSSSSK',
    'SSSKWWWKSK',
    'SSSSKKKSK.',
    'KKKKKKKKK.',
  ],
  dizzy: [
    'SSSSSSSSSK',
    'SSSSKSKSSK',
    'SSSSSKSSSK',
    'SSSSKSKSSK',
    'SSSSSSSSSK',
    'SSSSKKKKK.',
    'KKKKKKKKK.',
  ],
};

const anglerTorso = [
  '.....KKKKKKKKKKKK',
  '...KKLLKnnKeeKnnK',
  '..KLLLLKnnKeeKnnK',
  '..KLLLLKnKKeeKKnK',
  '..KLLLKKnKLKeKLnK',
  '..KKKKKKnKKeeKKnK',
  '..KOOOKKeeeeeeeeK',
  '.KOOOOK.KeeeKeeeK',
  '.KOKOOK.KeeeKeeeK',
  '..KKKK.KeeeK.KeeeK',
];

const anglerFrontArm = {
  side: [
    'KLLKK..',
    'KLLLLK.',
    'KKLLLK.',
    'KKLLLK.',
    'KKKKKK.',
    'KKOOOK.',
    '.KOOOOK',
    '.KOOKOK',
    '..KKKK.',
  ],
  grip: [
    'KLLKK...',
    'KLLLLK..',
    'KKLLLK..',
    'KKLLLK..',
    'KKKKKK..',
    'KKOOOOK.',
    '.KOOOOOK',
    '.KOKOKOK',
    '..KKKKK.',
  ],
  throw: [
    'KLLKKKKK.....',
    'KLLLLLLKKKK..',
    'KKLLLLLLLKOOK',
    'KKKKKKKKKOOOOK',
    '........KOKOOK',
    '.........KKKK.',
  ],
  up: [
    '.KKKK..',
    'KOOOOK.',
    'KOKOOK.',
    'KOOOOK.',
    '.KKKK..',
    '.KLLK..',
    '.KLLK..',
    '.KLLK..',
    'KLLK...',
    'KLLK...',
    'KLLK...',
    'KLLLK..',
    'KLLLK..',
    'KKKKK..',
  ],
};

const anglerLegs = {
  stand: [
    '....KeeeeggK..KeeeeggK..',
    '....KeeeeggK..KeeeeggK..',
    '...KeeeeeegK..KeeeeeegK.',
    '..KeeeeeeeeK..KeeeeeeeeK',
    '..KKKKKKKKKK..KKKKKKKKKK',
  ],
  jump: [
    '....KeeeegK....KeeeeggK.',
    '...KeeeegK.....KeeeeggK.',
    '..KeeeeegK......KeeeegK.',
    '..KeeeeeeK......KKKKKKK.',
    '..KKKKKKKK..............',
  ],
  brace: [
    '...KeeeegK.....KeeeeggK.',
    '..KeeeegK......KeeeeggK.',
    '.KeeeeegK.......KeeeeegK',
    'KeeeeeeeK.......KeeeeeeeK',
    'KKKKKKKKK.......KKKKKKKKK',
  ],
};

const anglerThighs = {
  stand: '..KKKK.KeeeK.KeeeK',
  jump: '..KKKK.KeeeK...KeeeK',
  brace: '..KKKK.KeeeK..KeeeK',
};

const anglerLifeRingRows = [
  '....KKKKKK....',
  '..KKWWRRWWKK..',
  '.KWWRRKKRRWWK.',
  '.KWRKK..KKRWK.',
  'KWRK......KRWK',
  'KRRK......KRRK',
  'KRWK......KWRK',
  'KWWK......KWWK',
  'KRRK......KRRK',
  'KWRK......KRWK',
  '.KWRKK..KKRWK.',
  '.KWWRRKKRRWWK.',
  '..KKWWRRWWKK..',
  '....KKKKKK....',
];

const anglerBobberRows = [
  '...KK...',
  '...KK...',
  '..KWWK..',
  '.KWWWWK.',
  'KWWWWWWK',
  'KRRRRRRK',
  'KRRRRRrK',
  '.KRRRrK.',
  '..KrrK..',
  '...KK...',
];

const anglerFishRows = [
  '.....KKKKK........',
  '...KKYYYYYKK...KK.',
  '..KYWWYYYYYYK.KOK.',
  '.KYWKWYOYOYYOKOOK.',
  'KYYWWYYOYOYYYKOOK.',
  'KRYYYYYYYYYYOOKOK.',
  '.KRRYYOOOOOOOKKOK.',
  '..KKOOOOOOOKK..KK.',
  '....KKKKKKK.......',
];

const anglerFishFlap = [
  '.....KKKKK........',
  '...KKYYYYYKK......',
  '..KYWWYYYYYYK..KK.',
  '.KYWKWYOYOYYOKKOK.',
  'KYYWWYYOYOYYYOOOK.',
  'KRYYYYYYYYYYOOKKK.',
  '.KRRYYOOOOOOOK....',
  '..KKOOOOOOOKK.....',
  '....KKKKKKK.......',
];

const anglerHookRows = [
  '.KK.',
  'KWWK',
  '.KWK',
  '..WK',
  'K.WK',
  'KWWK',
  '.KK.',
];

const anglerFaceHalf = [
  '................',
  '.........KKKKKKK',
  '........KLLLLLLL',
  '........KLLLLLLL',
  '........KLLLLLLL',
  '.......KLLLLLLLL',
  '.......KLLLLLLLL',
  '.......KnnnnnnnO',
  '.......KnnnnnnOO',
  '....KKKLLLLLLLLO',
  '..KKLLLLLLLLLLLL',
  '.KLLLnnnnnnnnnnn',
  '.KnnKKKKKKKKKKKK',
  '.KKKKSSSSSSSSSSS',
  '.KKKKSSSSSSSSSSS',
  'KGGGGKSSKKKKKSSS',
  'KGWWGKSSSSSSSSSS',
  'KGWKGKSSWWWWKSSS',
  'KGGGGKSSWWKKKSSS',
  '.KGGKSSSWWKKKSSS',
  '..KKSSSSSSSSSSSS',
  '...KSSSSSSSSSSSq',
  '...KSSSSSSSSSSSq',
  '....KSSSSSSKKKKK',
  '....KSSSSSSSSSSS',
  '.....KSSSSSSSSSS',
  '......KKSSSSSSSS',
  '...KKKKKKKKKKKKK',
  '..KLLLKnnnnnKeee',
  '.KLLLLKnnnnKeeee',
  'KLLLLLKnKKKKeeee',
  'KLLLLKKnKLLKeeee',
];

const anglerLureHookRows = [
  '..KKK...',
  '.KOOOK..',
  'KOWOOOK.',
  '.KOOOK.K',
  '..KKK.KW',
  '.....KWK',
  '......K.',
];

const anglerLureHookSpin = [
  '..KKK...',
  '.KOOOK..',
  'KOOOWOK.',
  '.KOOOK..',
  '..KKKK..',
  '....KWK.',
  '.....KWK',
];

const anglerLeapFishRows = [
  '.....KKKKK......',
  '...KKRRRRRKK..KK',
  '..KRWWRRRRRRKKRK',
  '.KRWKWRRORRRRRRK',
  'KWWWWRRRORRRRRRK',
  'KWKWKRRRORRRKKRK',
  '.KWKWRRRRRRK..KK',
  '..KKWWWWWWKK....',
  '....KKKKKK......',
];

const anglerLeapFishFlap = [
  '.....KKKKK......',
  '...KKRRRRRKK....',
  '..KRWWRRRRRRK.KK',
  '.KRWKWRRORRRRKRK',
  'KWWWWRRRORRRRRRK',
  'KWKWKRRRORRRRKRK',
  '.KWKWRRRRRRK.KKK',
  '..KKWWWWWWKK....',
  '....KKKKKK......',
];

const anglerPelicanBody = [
  '.........KKKK.........',
  '........KWWWWK........',
  '.......KWWKWWK........',
  '.......KWWWWWWKKKKKK..',
  '.......KWWWWWOOOOOOOK.',
  '........KWWWKOOOOOOK..',
  '..KK....KWWWKOOOOOK...',
  '.KGGKKKKWWWWKOOOK.....',
  'KGGGGGGKWWWWWKKK......',
  '.KKGGGKWWWWWWWK.......',
  '...KKKKWWWWWWK........',
  '......KKKKKKK.........',
  '........KOOK..........',
  '.......KOK.OK.........',
];

const anglerPelicanWingUp = [
  '..KKKKK',
  '.KGGGGGK',
  'KGGGGGGK',
  '.KKGGGK.',
  '...KKK..',
];

const anglerPelicanWingDown = [
  '.KKK....',
  'KGGGK...',
  'KGGGGKK.',
  '.KGGGGGK',
  '..KKKKK.',
];

const anglerPelicanMouth = [
  '.....KWWWWWOOOOOOK.',
  '......KWWWKKKKKKK..',
  '.......KWKOOOOOOOK.',
  '.......KWKOOOOOK...',
  '........KKKKKKK....',
];

const anglerPelicanBombRows = [
  '..K..',
  '.KWK.',
  'KWWWK',
  'KRRRK',
  '.KRK.',
  '..K..',
];

const anglerCrabBody = [
  '....KK......KK....',
  '...KWWK....KWWK...',
  '...KWKK....KKWK...',
  '....KK......KK....',
  '.....K......K.....',
  '...KKKKKKKKKKKK...',
  '..KRRRRRRRRRRRRK..',
  '.KRRRqRRRRRRqRRRK.',
  '.KRRRRRRRRRRRRRRK.',
  '..KRrRrRRRRrRrRK..',
  '...KKKKKKKKKKKK...',
];

const anglerCrabLegs = [
  ['..K.K.K....K.K.K..', '.K.K.K......K.K.K.'],
  ['.K.K.K......K.K.K.', '..K.K.K....K.K.K..'],
];

const anglerCrabClawOpen = [
  '.KK.KK',
  'KRRKRRK',
  'KRRKKRK',
  '.KRRRK.',
  '..KKK..',
];

const anglerCrabClawUp = [
  'KK..KK',
  'KRKKRK',
  'KRRRRK',
  '.KRRK.',
  '.KRRK.',
  '..KK..',
];

const anglerRippleRows = [
  [
    '........................',
    '.........aWWWWa.........',
    '.......WWa....aWW.......',
    '.........aWWWWa.........',
  ],
  [
    '........................',
    '.......aWWWWWWWWa.......',
    '....WWa..........aWW....',
    '.......aWWWWWWWWa.......',
  ],
  [
    '........................',
    '...aWWWa........aWWWa...',
    '.WW....................WW',
    '...aWWWa........aWWWa...',
  ],
];

const anglerFinRows = [
  '..KK....',
  '..KRK...',
  '..KRRK..',
  '.KRRRRK.',
  '.KRWRRRK',
  'KRRRRRRRK',
];

const anglerDockRows = [
  'KKKKKKKKKKKKKKKK',
  'LLLLLLLnLLLLLLLn',
  'nnnnnnnNnnnnnnnN',
  'nnLnnnnNnnLnnnnN',
  'nnnnnnnNnnnnnnnN',
  'NNNNNNNKNNNNNNNK',
  'KKKKKKKKKKKKKKKK',
  'NNNNKnnNKNNNNNNN',
  'NKNNKnnNKNNNKNNN',
  'NNNNKnnNKNNNNNNN',
  'NNNNKnnNKNNNNNNN',
  'NNNKKnnNKKNNNNKN',
  'NNNNKnnNKNNNNNNN',
  'NNNNKnnNKNNNNNNN',
  'NKNNKnnNKNNKNNNN',
  'KKKKKKKKKKKKKKKK',
];

const anglerWaterRows = [
  '.....WWWW.......',
  '...WWaaaaWW.....',
  'aaaaAAAAAAAaaaaa',
  'AAAAAAAAAAAAAAAA',
  'AAAAAAAAAAAAAAAA',
  'AAAaAAAAAAAAAAAA',
  'BBBBBBBAAAABBBBB',
  'BBBBBBBBBBBBBBBB',
  'BBBBBBBBBBaBBBBB',
  'BBBBBBBBBBBBBBBB',
  'BBQBBBBBBBBBBBBB',
  'BBBBBBBBBBBBBQBB',
  'QBBBBBBBBBBBBBBB',
  'BBBBBBQBBBBBBBBB',
  'BBBBBBBBBBBBBBBB',
  'BBBBBBBBBBBQBBBB',
];

const anglerDeepRows = [
  'BBBBBBBBBBBBBBBB',
  'BBBBQBBBBBBBBBBB',
  'BBBBBBBBBBBBQBBB',
  'QBBBBBBBBBBBBBBB',
  'QQBBBBBBBBQBBBBB',
  'BQQQBBBBBBQQBBBB',
  'QQQQQQBBBQQQQQBB',
  'QQQQQQQQQQQQQQQQ',
  'QQdQQQQQQQQQQdQQ',
  'QQQQQQQQdQQQQQQQ',
  'dQQQQdQQQQQQQQQQ',
  'QQQQdddQQQQQdQQQ',
  'ddddddddQQQddddd',
  'dddddddddddddddd',
  'dddddddddddddddd',
  'dddddddddddddddd',
];

const anglerPostRows = [
  'KnnNK',
  'KnnNK',
  'KnnNK',
  'KnLNK',
  'KnnNK',
  'KnnNK',
  'KnnNK',
  'KnnNK',
  'KnnNK',
  'KnnNK',
  'KnnNK',
  'KnnNK',
  'KnnNK',
  'KnnNK',
  'KnnNK',
  'KnnNK',
];

const anglerShoreRows = [
  'nnnnnnnnNnnnnnnn',
  'nnnGnnnnnnnnnnNn',
  'nnnnnnnnnnnnnnnn',
  'nNnnnnnnnnGDnnnn',
  'nnnnnnnnnnnnnnnn',
  'nnnnNnnnnnnnnnnn',
  'nnnnnnnnnnnnnNnn',
  'NnnnnnGDnnnnnnnn',
  'nnnnnnnnnnnnnnnn',
  'nnnnnnnnnnnNnnnn',
  'nnNnnnnnnnnnnnnn',
  'nnnnnnnnnnnnnnGD',
  'nnnnnnnnNnnnnnnn',
  'nnnnnNnnnnnnnnnn',
  'NnnnnnnnnnnnNnnn',
  'nnnnnnnnnnnnnnnn',
];

const anglerShoreTopRows = [
  '..g...h.....g...',
  '.ghg.ghg...ghg.h',
  'gghggghggghgghgg',
  'eggeggeggegggegg',
  'KeeKeeKeeKeeKeeK',
  'nKnnKnnKnnKnnKnn',
];

const anglerBoathouseRows = [
  'KrRRRRKrRRRRKrRR',
  'KrRRRRKrRRRRKrRR',
  'KrRRRRKrRRRRKrRR',
  'KrRRRRKrRRRRKrRR',
  'KrRRRRKrRRRRKrRR',
  'KrRRRRKrRRRRKrRR',
  'KrRRRRKrRRRRKrRR',
  'KrRRRRKrRRRRKrRR',
  'KrRRRRKrRRRRKrRR',
  'KrRRRRKrRRRRKrRR',
  'KrRRRRKrRRRRKrRR',
  'KrRRRRKrRRRRKrRR',
  'KrRRRRKrRRRRKrRR',
  'KrRRRRKrRRRRKrRR',
  'KrRRRRKrRRRRKrRR',
  'KrRRRRKrRRRRKrRR',
];

const anglerBackWallRows = [
  'KtttNtttKtttNttt',
  'KtttNtttKtttNttt',
  'KtttNtttKtttNttt',
  'KtttNtttKtttNttt',
  'KtttNtttKtttNttt',
  'KtttNtttKtttNttt',
  'KttKNtttKtttNttt',
  'KtttNtttKtttNttt',
  'KtttNtttKtttNKtt',
  'KtttNtttKtttNttt',
  'KtttNtttKtttNttt',
  'KtttNtttKtttNttt',
  'KtttNtttKtttNttt',
  'KtttNtttKtttNttt',
  'KtttNtttKtttNttt',
  'KtttNtttKtttNttt',
];

const anglerWindowRows = [
  'KWWWWWWWWWWWWWWK',
  'KWKKKKKKKKKKKKWK',
  'KWK....KK....KWK',
  'KWK....KK....KWK',
  'KWK....KK....KWK',
  'KWK....KK....KWK',
  'KWK....KK....KWK',
  'KWKKKKKKKKKKKKWK',
  'KWKKKKKKKKKKKKWK',
  'KWK....KK....KWK',
  'KWK....KK....KWK',
  'KWK....KK....KWK',
  'KWK....KK....KWK',
  'KWK....KK....KWK',
  'KWKKKKKKKKKKKKWK',
  'KWWWWWWWWWWWWWWK',
];

const anglerNetRows = [
  'n.......n.......',
  '.n.....n.n.....n',
  '..n...n...n...n.',
  '...n.n.....n.n..',
  '....n.......n...',
  '...n.n.....n.n..',
  '..n...n...n...n.',
  '.n.....n.n.....n',
  'n.......n.......',
  '.n.....n.n.....n',
  '..n...n...n...n.',
  '...n.n.....n.n..',
  '....n.......n...',
  '...n.n.....n.n..',
  '..n...n...n...n.',
  '.n.....n.n.....n',
];

const anglerCrateRows = [
  'KKKKKKKKKKKKKKKK',
  'KLLLLLLLLLLLLLnK',
  'KLKKKKKKKKKKKKnK',
  'KLKnnNKKKKnnNKnK',
  'KLKnnnNKKnnnNKnK',
  'KLKKnnnNnnnNKKnK',
  'KLKKKnnnnnNKKKnK',
  'KLKKKKnnnNKKKKnK',
  'KLKKKnnnnnNKKKnK',
  'KLKKnnnNnnnNKKnK',
  'KLKnnnNKKnnnNKnK',
  'KLKnnNKKKKnnNKnK',
  'KLKKKKKKKKKKKKnK',
  'KLnnnnnnnnnnnnNK',
  'KnNNNNNNNNNNNNNK',
  'KKKKKKKKKKKKKKKK',
];

const anglerLadderRows = [
  '..KnK......KnK..',
  '..KnKKKKKKKKnK..',
  '..KnLLLLLLLLnK..',
  '..KnKKKKKKKKnK..',
  '..KnK......KnK..',
  '..KnK......KnK..',
  '..KnK......KnK..',
  '..KnK......KnK..',
  '..KnK......KnK..',
  '..KnKKKKKKKKnK..',
  '..KnLLLLLLLLnK..',
  '..KnKKKKKKKKnK..',
  '..KnK......KnK..',
  '..KnK......KnK..',
  '..KnK......KnK..',
  '..KnK......KnK..',
];

const anglerLoftRows = [
  'KKKKKKKKKKKKKKKK',
  'LLLLLLLLLLLLLLLn',
  'nnnnnnnnnnnnnnnN',
  'NNNNNNNNNNNNNNNN',
  'KKKKKKKKKKKKKKKK',
  '.KnK........KnK.',
  '..KnK......KnK..',
  '...KnK....KnK...',
];

const anglerBuoyRows = [
  '......KKKK......',
  '.....KYLLYK.....',
  '.....KYYYYK.....',
  '..KKKKKKKKKKKK..',
  '.KWWWWWWWWWWWWK.',
  'KaWWWWWWWWWWWWaK',
  'KRRRRRRRRRRRRrrK',
  'KRRRRRRRRRRRRrrK',
  'KWWWWWWWWWWWWaaK',
  'KWWWWWWWWWWWWaaK',
  'KRRRRRRRRRRRRrrK',
  'KRRRRRRRRRRRRrrK',
  '.KRRRRRRRRRRrrK.',
  '..KKKKKKKKKKKK..',
  '................',
  '................',
];

const anglerReedRows = [
  '...........KK...',
  '..KK......KNNK..',
  '.KNNK.....KNNK..',
  '.KNNK.....KNNK..',
  '.KNNK......KK...',
  '..KK...K...Ke...',
  '..Ke..KgK..Ke...',
  '..Kg..KgK..KeK..',
  '..Kg..KgK.KgeK..',
  '.KgK..KgK.KgK...',
  '.KgK.KggK.KgK.K.',
  '.KgK.KgK..KgK.Kg',
  'KgeKKggK.KggKKgK',
  'KgeKKgeK.KgeKKgK',
  'KggeKgeKKggeKgeK',
  'KggeKggeKggeKgeK',
];

const anglerLampPostRows = [
  '....KKKKKKK.....',
  '...KNNNNNNNK....',
  '..KKKKKKKKKKK...',
  '...KYLLLLLYK....',
  '...KYLWWWLYK....',
  '...KYLWWWLYK....',
  '...KYLLLLLYK....',
  '..KKKKKKKKKKK...',
  '......KNK.......',
  '......KNK.......',
  '......KNK.......',
  '......KNK.......',
  '......KNK.......',
  '......KNK.......',
  '......KNK.......',
  '......KNK.......',
];

const anglerPolePostRows = [
  '......KNK.......',
  '......KNK.......',
  '......KNK.......',
  '......KNK.......',
  '......KNK.......',
  '......KNK.......',
  '......KNK.......',
  '......KNK.......',
  '......KNK.......',
  '......KNK.......',
  '......KNK.......',
  '......KNK.......',
  '......KNK.......',
  '......KNK.......',
  '.....KKNKK......',
  '....KNNNNNK.....',
];

const anglerBollardRows = [
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '.....KKKKKK.....',
  '....KGGGGGDK....',
  '....KKKKKKKK....',
  '.....KGGGDK.....',
  '.....KGGGDK.....',
  '.....KGGGDK.....',
  '....KGGGGGDK....',
  '....KKKKKKKK....',
];

const anglerBoatRows = [
  'KK............................................KK',
  'KNKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKNK',
  'KNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNK',
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',
  '.KWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWK.',
  '.KWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWaK.',
  '.KRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRrK.',
  '..KRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRrK..',
  '..KWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWaaK..',
  '..KWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWaaK..',
  '...KWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWaaK...',
  '...KaWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWaaK...',
  '....KaWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWaaK....',
  '.....KaaWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWaaaK.....',
  '......KaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaK......',
  '.......KaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaK.......',
  '........KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK........',
  '................................................',
];

const anglerLiftRows = [
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',
  'KLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLnK',
  'KnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnNK',
  'KNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNK',
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',
  '...KNK..............KNK..............KNK...',
  '...KKK..............KKK..............KKK...',
];

const anglerPulleyRows = [
  '..KKKK..',
  '.KGGGGK.',
  'KGGKKGGK',
  'KGKWWKGK',
  'KGKWWKGK',
  'KGGKKGGK',
  '.KGGGGK.',
  '..KKKK..',
];

// FUNCTIONS

function anglerBlankArt(width, height) {
  const grid = [];
  for (let y = 0; y < height; y++) grid.push(new Array(width).fill('.'));
  return grid;
}

function anglerLinePoints(x0, y0, x1, y1) {
  const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
  const points = [];
  for (let i = 0; i <= steps; i++) points.push([Math.round(x0 + ((x1 - x0) * i) / steps), Math.round(y0 + ((y1 - y0) * i) / steps)]);
  return points;
}

function anglerPlotPart(points, paint) {
  const xs = points.map(point => point[0]);
  const ys = points.map(point => point[1]);
  const left = Math.min(...xs) - 1;
  const top = Math.min(...ys) - 1;
  const grid = anglerBlankArt(Math.max(...xs) - left + 2, Math.max(...ys) - top + 2);
  paint(grid, left, top);
  return [grid.map(row => row.join('')), left, top];
}

function anglerRodPart(x0, y0, x1, y1, bend) {
  const middle = [Math.round((x0 + x1) / 2 + (bend || 0)), Math.round((y0 + y1) / 2 - Math.abs(bend || 0) / 2)];
  const points = bend ? [...anglerLinePoints(x0, y0, middle[0], middle[1]), ...anglerLinePoints(middle[0], middle[1], x1, y1).slice(1)] : anglerLinePoints(x0, y0, x1, y1);
  return anglerPlotPart(points, (grid, left, top) => {
    points.forEach(([x, y], index) => {
      if (index > points.length - 5) return;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const cell = grid[y - top + dy];
        if (cell && cell[x - left + dx] === '.') cell[x - left + dx] = 'K';
      }
    });
    points.forEach(([x, y], index) => {
      let ch = 'N';
      if (index < 5) ch = 'L';
      if (index > points.length - 5) ch = 'K';
      if (index === points.length - 1) ch = 'W';
      grid[y - top][x - left] = ch;
    });
  });
}

function anglerLinePart(x0, y0, x1, y1) {
  const points = anglerLinePoints(x0, y0, x1, y1);
  return anglerPlotPart(points, (grid, left, top) => {
    for (const [x, y] of points) grid[y - top][x - left] = 'W';
  });
}

function anglerTrimPose(rows, anchorX, anchorY) {
  let minX = Infinity;
  let maxX = -1;
  let minY = Infinity;
  let maxY = -1;
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] === '.') continue;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  });
  return { ox: anchorX - minX, oy: anchorY - minY, rows: rows.slice(minY, maxY + 1).map(row => row.slice(minX, maxX + 1)) };
}

function buildAngler(options) {
  const legs = options.legs || 'stand';
  const arm = options.arm || 'side';
  const parts = [...(options.behind || [])];
  parts.push([anglerTorso, 0, 14]);
  parts.push([[anglerThighs[legs]], 0, 23]);
  parts.push([anglerLegs[legs], 0, 24]);
  parts.push([anglerHair, 2, 8]);
  parts.push([anglerReelEar, 3, 8]);
  parts.push([anglerFaces[options.face || 'normal'], 10, 8]);
  parts.push([anglerHat, 0, 0]);
  parts.push([anglerLure, 6, 0]);
  parts.push([anglerFly, 15, 3]);
  parts.push(...(options.middle || []));
  if (arm === 'up') parts.push([anglerFrontArm.up, 18, 1]);
  else parts.push([anglerFrontArm[arm], 16, 14]);
  parts.push(...(options.front || []));
  const left = 16;
  const top = 24;
  const rows = composeArt(72, 60, parts.map(([rows, dx, dy]) => [rows, dx + left, dy + top]));
  return anglerTrimPose(rows, 12 + left, 29 + top);
}

function anglerPose(name, options, tip) {
  anglerArt[name] = buildAngler(options);
  if (tip) anglerRodTips[name] = { x: tip[0] - 12, y: tip[1] - 29 };
}

function anglerShiftArt(rows, amount) {
  return rows.map(row => row.slice(amount) + row.slice(0, amount));
}

function anglerFlipRows(rows) {
  return rows.map(row => row.split('').reverse().join(''));
}

function anglerTile(parts) {
  return { ox: 0, oy: 0, rows: composeArt(16, 16, parts.map(rows => [rows, 0, 0])) };
}

function anglerPostTile(rows) {
  return { ox: 0, oy: 0, rows: composeArt(16, 16, [[rows, 0, 0], [anglerPostRows, 5, 0]]) };
}

function anglerPelican(wing, mouth) {
  const parts = [[anglerPelicanBody, 0, 0]];
  if (mouth) parts.push([anglerPelicanMouth, 3, 4]);
  parts.push([wing, 1, wing === anglerPelicanWingUp ? 3 : 6]);
  return { ox: 11, oy: 14, rows: composeArt(22, 14, parts) };
}

function anglerCrab(legs, claw) {
  const clawRows = claw === 'up' ? anglerCrabClawUp : anglerCrabClawOpen;
  const clawTop = claw === 'up' ? 0 : 4;
  return {
    ox: 13,
    oy: 13,
    rows: composeArt(26, 13, [[anglerCrabBody, 4, 0], [anglerCrabLegs[legs], 4, 11], [clawRows, 0, clawTop], [anglerFlipRows(clawRows), 19, clawTop]]),
  };
}

function drawFishingLine(ctx, x0, y0, x1, y1, sag) {
  const steps = Math.max(1, Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))));
  ctx.fillStyle = nesPalette[0x30];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = x0 + (x1 - x0) * t;
    const y = y0 + (y1 - y0) * t + (sag || 0) * 4 * t * (1 - t);
    ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
  }
}

// VARIABLES

const anglerArt = {};
const anglerRodTips = {};
const anglerStandRod = [anglerRodPart(21, 22, 27, -4), anglerLinePart(27, -3, 27, 4), [anglerLure, 26, 4]];

anglerPose('anglerStand', { arm: 'grip', middle: anglerStandRod, front: [[anglerLifeRingRows, 11, 12]] }, [27, -4]);
anglerPose('anglerBlink', { arm: 'grip', face: 'blink', middle: anglerStandRod, front: [[anglerLifeRingRows, 11, 12]] }, [27, -4]);
anglerPose('anglerCrouch', { arm: 'grip', legs: 'brace', middle: anglerStandRod, front: [[anglerLifeRingRows, 11, 12]] }, [27, -4]);
anglerPose('anglerWindup', { arm: 'up', face: 'shout', legs: 'brace', behind: [anglerRodPart(20, 3, 2, -12), anglerLinePart(2, -11, 0, -2), [anglerHookRows, -2, -2]], front: [[anglerLifeRingRows, 11, 12]] }, [2, -12]);
anglerPose('anglerCast', { arm: 'throw', face: 'shout', legs: 'brace', front: [anglerRodPart(27, 17, 44, 6)] }, [44, 6]);
anglerPose('anglerReel1', { arm: 'up', face: 'grin', legs: 'brace', front: [anglerRodPart(21, 3, 36, -6, 4)] }, [36, -6]);
anglerPose('anglerReel2', { arm: 'up', face: 'shout', legs: 'brace', front: [anglerRodPart(21, 3, 35, -7, 5)] }, [35, -7]);
anglerPose('anglerJump', { arm: 'up', face: 'shout', legs: 'jump', middle: [anglerRodPart(21, 4, 26, -12)] }, [26, -12]);
anglerPose('anglerToss', { arm: 'up', face: 'shout', behind: [anglerRodPart(3, 21, -8, 4)], front: [[anglerBobberRows, 18, -8]] });
anglerPose('anglerThrow', { arm: 'throw', face: 'shout', behind: [anglerRodPart(3, 21, -8, 4)] });
anglerPose('anglerHurl', { arm: 'throw', face: 'shout', legs: 'jump', behind: [anglerRodPart(3, 21, -8, 4)] });
anglerPose('anglerPose', { arm: 'up', face: 'grin', front: [anglerRodPart(21, 3, 34, -10), anglerLinePart(34, -9, 34, 2), [anglerFishRows.map(row => row.slice(0, 13)), 28, 2]] });
anglerPose('anglerDizzy', { arm: 'side', face: 'dizzy', legs: 'brace', front: [anglerRodPart(20, 21, 31, 10), anglerLinePart(31, 11, 33, 13), anglerLinePart(33, 13, 31, 15)] });

Object.assign(anglerArt, {
  anglerFace: { ox: 0, oy: 0, rows: mirrorArt(anglerFaceHalf) },
  anglerBobber: { ox: 4, oy: 5, rows: anglerBobberRows },
  anglerBobberFlash: { ox: 4, oy: 5, rows: recolorArt(anglerBobberRows, { R: 'W', r: 'R', W: 'R' }) },
  anglerHook: { ox: 2, oy: 1, rows: anglerHookRows },
  anglerFish0: { ox: 9, oy: 5, rows: anglerFishRows },
  anglerFish1: { ox: 9, oy: 5, rows: anglerFishFlap },
  anglerFishUp: { ox: 5, oy: 9, rows: rotateArt(rotateArt(rotateArt(anglerFishRows))) },
});

const anglerWeaponArt = {
  anglerLure0: { ox: 4, oy: 3, rows: anglerLureHookRows },
  anglerLure1: { ox: 4, oy: 3, rows: anglerLureHookSpin },
};

const anglerEnemyArt = {
  anglerLeapFish0: { ox: 8, oy: 9, rows: anglerLeapFishRows },
  anglerLeapFish1: { ox: 8, oy: 9, rows: anglerLeapFishFlap },
  anglerLeapFishUp0: { ox: 4, oy: 16, rows: rotateArt(rotateArt(rotateArt(anglerLeapFishRows))) },
  anglerLeapFishUp1: { ox: 4, oy: 16, rows: rotateArt(rotateArt(rotateArt(anglerLeapFishFlap))) },
  anglerLeapFishDown0: { ox: 4, oy: 16, rows: rotateArt(anglerLeapFishRows) },
  anglerLeapFishDown1: { ox: 4, oy: 16, rows: rotateArt(anglerLeapFishFlap) },
  anglerPelican0: anglerPelican(anglerPelicanWingUp, false),
  anglerPelican1: anglerPelican(anglerPelicanWingDown, false),
  anglerPelicanOpen: anglerPelican(anglerPelicanWingDown, true),
  anglerPelicanBomb: { ox: 2, oy: 3, rows: anglerPelicanBombRows },
  anglerCrab0: anglerCrab(0, 'open'),
  anglerCrab1: anglerCrab(1, 'open'),
  anglerCrabGuard: anglerCrab(0, 'up'),
  anglerFin: { ox: 4, oy: 5, rows: anglerFinRows },
  anglerRipple0: { ox: 12, oy: 2, rows: anglerRippleRows[0] },
  anglerRipple1: { ox: 12, oy: 2, rows: anglerRippleRows[1] },
  anglerRipple2: { ox: 12, oy: 2, rows: anglerRippleRows[2] },
};

const anglerTileArt = {
  tileAnglerDock: anglerTile([anglerDockRows]),
  tileAnglerShore: anglerTile([anglerShoreRows]),
  tileAnglerShoreTop: anglerTile([anglerShoreRows, anglerShoreTopRows]),
  tileAnglerBoathouse: anglerTile([anglerBoathouseRows]),
  tileAnglerBackWall: anglerTile([anglerBackWallRows]),
  tileAnglerWindow: anglerTile([anglerWindowRows]),
  tileAnglerNet: anglerTile([anglerBackWallRows, anglerNetRows]),
  tileAnglerCrate: anglerTile([anglerCrateRows]),
  tileAnglerLadder: anglerTile([anglerBackWallRows, anglerLadderRows]),
  tileAnglerLadderOut: anglerTile([anglerLadderRows]),
  tileAnglerLoft: anglerTile([anglerBackWallRows, anglerLoftRows]),
  tileAnglerBuoy: anglerTile([anglerBuoyRows]),
  tileAnglerReeds: anglerTile([anglerReedRows]),
  tileAnglerLamp: anglerTile([anglerLampPostRows]),
  tileAnglerPole: anglerTile([anglerPolePostRows]),
  tileAnglerBollard: anglerTile([anglerBollardRows]),
  tileAnglerPost: { ox: 0, oy: 0, rows: composeArt(16, 16, [[anglerPostRows, 5, 0]]) },
};

for (let i = 0; i < 4; i++) {
  anglerTileArt['tileAnglerWave' + i] = anglerTile([anglerShiftArt(anglerWaterRows, i * 4)]);
  anglerTileArt['tileAnglerWavePost' + i] = anglerPostTile(anglerShiftArt(anglerWaterRows, i * 4));
  anglerTileArt['tileAnglerWaveIn' + i] = anglerTile([anglerBackWallRows, anglerShiftArt(anglerWaterRows, i * 4)]);
}

for (let i = 0; i < 2; i++) {
  anglerTileArt['tileAnglerDeep' + i] = anglerTile([anglerShiftArt(anglerDeepRows, i * 8)]);
  anglerTileArt['tileAnglerDeepPost' + i] = anglerPostTile(anglerShiftArt(anglerDeepRows, i * 8));
}

const anglerPlatformArt = {
  anglerBoat: { ox: 24, oy: 0, rows: anglerBoatRows },
  anglerLift: { ox: 24, oy: 0, rows: anglerLiftRows },
  anglerPulley: { ox: 4, oy: 4, rows: anglerPulleyRows },
};

// INITIALIZATION

Object.assign(palettes, {
  megaAngler: { B: 0x18, C: 0x38, v: 0x08 },
  orbAngler: { C: 0x18, W: 0x38 },
  anglerTiles: { d: 0x02, t: 0x07 },
});

registerArt(anglerArt, 'boss');
registerArt(anglerWeaponArt, 'boss');
registerArt(anglerEnemyArt, 'enemy');
registerArt(anglerTileArt, 'anglerTiles');
registerArt(anglerPlatformArt, 'anglerTiles');

registerAnimations([
  { label: 'Angler Man', fps: 4, frames: ['anglerStand', 'anglerStand', 'anglerBlink', 'anglerStand', 'anglerPose', 'anglerPose', 'anglerJump', 'anglerDizzy'] },
  { label: 'Angler Man lancando', fps: 5, frames: ['anglerWindup', 'anglerWindup', 'anglerWindup', 'anglerCast', 'anglerCast', 'anglerReel1', 'anglerReel2', 'anglerReel1', 'anglerReel2'] },
  { label: 'Angler Man boias', fps: 4, frames: ['anglerToss', 'anglerToss', 'anglerThrow', 'anglerStand', 'anglerJump', 'anglerHurl'] },
  { label: 'Boia bomba', fps: 8, frames: ['anglerBobber', 'anglerBobber', 'anglerBobberFlash', 'anglerBobber', 'anglerBobberFlash'] },
  { label: 'Peixe robo', fps: 6, frames: ['anglerFish0', 'anglerFish1', 'anglerFishUp'] },
  { label: 'Anzol', fps: 1, frames: ['anglerHook'] },
  { label: 'Arma Lure Hook', fps: 6, frames: [{ sprite: 'megaShoot', palette: 'mega' }, { sprite: 'megaShoot', palette: 'megaAngler' }] },
  { label: 'Lure Hook', fps: 8, frames: ['anglerLure0', 'anglerLure1'] },
  { label: 'Orbes do Angler Man', fps: 16, frames: ['orbSmall', 'orbBig1', 'orbBig2', 'orbBig1'].map(sprite => ({ sprite, palette: 'orbAngler' })) },
  { label: 'Peixe saltador', fps: 6, frames: ['anglerLeapFish0', 'anglerLeapFish1', 'anglerLeapFishUp0', 'anglerLeapFishUp1', 'anglerLeapFishDown0', 'anglerLeapFishDown1'] },
  { label: 'Pelicano drone', fps: 6, frames: ['anglerPelican0', 'anglerPelican1', 'anglerPelican0', 'anglerPelican1', 'anglerPelicanOpen', 'anglerPelicanOpen'] },
  { label: 'Caranguejo robo', fps: 5, frames: ['anglerCrab0', 'anglerCrab1', 'anglerCrab0', 'anglerCrab1', 'anglerCrabGuard', 'anglerCrabGuard'] },
  { label: 'Ondulacao', fps: 6, frames: ['anglerRipple0', 'anglerRipple1', 'anglerRipple2', 'anglerFin'] },
  { label: 'Agua do lago', fps: 6, frames: ['tileAnglerWave0', 'tileAnglerWave1', 'tileAnglerWave2', 'tileAnglerWave3'].map(sprite => ({ sprite, palette: 'anglerTiles' })) },
  { label: 'Barco a remo', fps: 1, frames: [{ sprite: 'anglerBoat', palette: 'anglerTiles' }] },
  { label: 'Retrato', fps: 1, frames: ['anglerFace'] },
]);
