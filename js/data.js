window.PAWVERSE_DATA = (() => {
  const STORAGE_KEY = 'pawverse_state_v4';

  const PEXELS_PHOTOS = {
    walkPark: 'https://images.pexels.com/photos/37989321/pexels-photo-37989321/free-photo-of-lush-green-park-pathway-in-summer-season.jpeg?auto=compress&cs=tinysrgb&w=1600',
    walkCafe: 'https://images.pexels.com/photos/32032971/pexels-photo-32032971/free-photo-of-charming-outdoor-cafe-terrace-in-hauts-de-france.jpeg?auto=compress&cs=tinysrgb&w=1600',
    walkGarden: 'https://images.pexels.com/photos/28900031/pexels-photo-28900031/free-photo-of-lush-pathway-in-blooming-garden-archway.jpeg?auto=compress&cs=tinysrgb&w=1600',
    walkArena: 'https://images.pexels.com/photos/40467626/pexels-photo-40467626/free-photo-of-sunny-day-in-open-green-park-landscape.jpeg?auto=compress&cs=tinysrgb&w=1600',

    dogGolden: 'https://images.pexels.com/photos/12538668/pexels-photo-12538668.jpeg?auto=compress&cs=tinysrgb&w=800',
    dogBrown: 'https://images.pexels.com/photos/29668631/pexels-photo-29668631/free-photo-of-cute-brown-dog-relaxing-in-green-field-outdoors.jpeg?auto=compress&cs=tinysrgb&w=800',
    dogPark: 'https://images.pexels.com/photos/13696874/pexels-photo-13696874.jpeg?auto=compress&cs=tinysrgb&w=900',
    dogCollie: 'https://images.pexels.com/photos/34070528/pexels-photo-34070528/free-photo-of-energetic-border-collie-running-in-misty-field.jpeg?auto=compress&cs=tinysrgb&w=900',
    catGinger: 'https://images.pexels.com/photos/29020872/pexels-photo-29020872/free-photo-of-ginger-cat-lying-outdoors-on-pavement.jpeg?auto=compress&cs=tinysrgb&w=800',
    catTabby: 'https://images.pexels.com/photos/16664165/pexels-photo-16664165/free-photo-of-head-of-cat.jpeg?auto=compress&cs=tinysrgb&w=800',
    catCafe: 'https://images.pexels.com/photos/30773266/pexels-photo-30773266/free-photo-of-cozy-cat-relaxing-on-rustic-cafe-table.jpeg?auto=compress&cs=tinysrgb&w=900',
    rabbitGray: 'https://images.pexels.com/photos/13460159/pexels-photo-13460159.jpeg?auto=compress&cs=tinysrgb&w=800',
    rabbitGrass: 'https://images.pexels.com/photos/19613749/pexels-photo-19613749/free-photo-of-close-up-of-a-domestic-rabbit.jpeg?auto=compress&cs=tinysrgb&w=800',
    hamsterWhite: 'https://images.pexels.com/photos/4052861/pexels-photo-4052861.jpeg?auto=compress&cs=tinysrgb&w=800',
    hamsterCouch: 'https://images.pexels.com/photos/38234776/pexels-photo-38234776/free-photo-of-cute-hamster-on-couch-indoor-pet-photography.jpeg?auto=compress&cs=tinysrgb&w=800',
    petBed: 'https://images.pexels.com/photos/11060021/pexels-photo-11060021.jpeg?auto=compress&cs=tinysrgb&w=800',
    petTreats: 'https://images.pexels.com/photos/8121142/pexels-photo-8121142.jpeg?auto=compress&cs=tinysrgb&w=800',
    flowerMeadow: 'https://images.pexels.com/photos/7813243/pexels-photo-7813243.jpeg?auto=compress&cs=tinysrgb&w=900'
  };

  const PET_SPRITES = {
    dog_golden: {
      id: 'dog_golden',
      species: 'dog',
      label: '골든 리트리버',
      spriteUrl: './assets/pets/dog_golden.png',
      thumbUrl: PEXELS_PHOTOS.dogGolden,
      baseHeight: 136,
      neckAnchor: { x: 0.23, y: -0.63 },
      headAnchor: { x: 0.30, y: -0.94 },
      eyeAnchor: { x: 0.36, y: -0.78 }
    },
    dog_brown: {
      id: 'dog_brown',
      species: 'dog',
      label: '초코 토이푸들',
      spriteUrl: './assets/pets/dog_brown.png',
      thumbUrl: PEXELS_PHOTOS.dogBrown,
      baseHeight: 118,
      neckAnchor: { x: 0.24, y: -0.58 },
      headAnchor: { x: 0.28, y: -0.95 },
      eyeAnchor: { x: 0.35, y: -0.76 }
    },
    cat_ginger: {
      id: 'cat_ginger',
      species: 'cat',
      label: '치즈 태비냥',
      spriteUrl: './assets/pets/cat_ginger.png',
      thumbUrl: PEXELS_PHOTOS.catGinger,
      baseHeight: 108,
      neckAnchor: { x: 0.31, y: -0.49 },
      headAnchor: { x: 0.38, y: -0.74 },
      eyeAnchor: { x: 0.42, y: -0.60 }
    },
    rabbit_white: {
      id: 'rabbit_white',
      species: 'rabbit',
      label: '크림 아기토끼',
      spriteUrl: './assets/pets/rabbit_white.png',
      thumbUrl: PEXELS_PHOTOS.rabbitGray,
      baseHeight: 84,
      neckAnchor: { x: 0.28, y: -0.45 },
      headAnchor: { x: 0.31, y: -0.95 },
      eyeAnchor: { x: 0.38, y: -0.65 }
    },
    hamster_cream: {
      id: 'hamster_cream',
      species: 'hamster',
      label: '골든 햄스터',
      spriteUrl: './assets/pets/hamster_cream.png',
      thumbUrl: PEXELS_PHOTOS.hamsterWhite,
      baseHeight: 62,
      neckAnchor: { x: 0.26, y: -0.42 },
      headAnchor: { x: 0.28, y: -0.94 },
      eyeAnchor: { x: 0.35, y: -0.66 }
    }
  };

  const PET_PORTRAITS = [
    { id: 'dog_golden', species: 'dog', label: '골든 리트리버', spriteId: 'dog_golden', url: PEXELS_PHOTOS.dogGolden },
    { id: 'dog_brown', species: 'dog', label: '초코 토이푸들', spriteId: 'dog_brown', url: PEXELS_PHOTOS.dogBrown },
    { id: 'cat_ginger', species: 'cat', label: '치즈 고양이', spriteId: 'cat_ginger', url: PEXELS_PHOTOS.catGinger },
    { id: 'rabbit_white', species: 'rabbit', label: '크림 토끼', spriteId: 'rabbit_white', url: PEXELS_PHOTOS.rabbitGray },
    { id: 'hamster_cream', species: 'hamster', label: '골든 햄찌', spriteId: 'hamster_cream', url: PEXELS_PHOTOS.hamsterWhite }
  ];

  // Growth stages (Pillar 1)
  const GROWTH_STAGES = [
    { level: 1, minExp: 0, title: '아기 퍼피/키튼', scaleMult: 0.88, coat: '보송보송 아기털' },
    { level: 2, minExp: 100, title: '호기심 꿈나무', scaleMult: 0.94, coat: '부드러운 솜털' },
    { level: 3, minExp: 240, title: '활발한 청소년', scaleMult: 1.0, coat: '윤기 도는 건강털' },
    { level: 4, minExp: 440, title: '든든한 단짝친구', scaleMult: 1.06, coat: '프리미엄 실크코트' },
    { level: 5, minExp: 700, title: '완벽한 평생가족', scaleMult: 1.12, coat: '황금빛 엔젤코트 ✨' }
  ];

  function getGrowthInfo(exp) {
    let current = GROWTH_STAGES[0];
    let next = GROWTH_STAGES[1];
    for (let i = 0; i < GROWTH_STAGES.length; i++) {
      if (exp >= GROWTH_STAGES[i].minExp) {
        current = GROWTH_STAGES[i];
        next = GROWTH_STAGES[i + 1] || null;
      }
    }
    const progress = next
      ? Math.min(100, Math.round(((exp - current.minExp) / (next.minExp - current.minExp)) * 100))
      : 100;
    return { current, next, progress };
  }

  const LIVE_VIDEOS = [
    {
      id: 'dog-sunny-park',
      tabLabel: '🐶 햇살 공원',
      badge: '햇살 공원 · 1080p HD',
      title: '햇살 공원 강아지 산책',
      desc: '따스한 햇살 아래 푸른 공원을 신나게 거니는 강아지 실시간 캠',
      posterUrl: 'https://images.pexels.com/videos/28638782/happy-happy-dog-happy-puppy-small-dog-28638782.jpeg?auto=compress&cs=tinysrgb&w=900',
      videoUrl: 'https://videos.pexels.com/video-files/28638782/12438626_1920_1080_50fps.mp4',
      pageUrl: 'https://www.pexels.com/video/happy-small-dog-outside-in-sunny-park-28638782/'
    },
    {
      id: 'dogs-running',
      tabLabel: '🐕 잔디 우다다',
      badge: '어질리티 존 · UHD',
      title: '잔디밭 강아지 듀오 우다다',
      desc: '넓은 잔디 광장을 함께 질주하는 두 반려견의 에너지 넘치는 순간',
      posterUrl: 'https://images.pexels.com/videos/12363705/dog-run-video-dog-running-dog-video-dogs-running-12363705.jpeg?auto=compress&cs=tinysrgb&w=900',
      videoUrl: 'https://videos.pexels.com/video-files/12363705/12363705-uhd_2560_1440_24fps.mp4',
      pageUrl: 'https://www.pexels.com/video/dogs-running-on-grass-12363705/'
    },
    {
      id: 'cat-garden',
      tabLabel: '🐱 정원 고양이',
      badge: '포우 가든 · 1080p HD',
      title: '치즈 고양이의 오후 힐링',
      desc: '정원 담장 위에서 평화롭게 햇볕을 쬐는 치즈태비 고양이',
      posterUrl: 'https://images.pexels.com/videos/31985257/4k-video-nature-adorable-cat-adult-cat-alert-cat-31985257.jpeg?auto=compress&cs=tinysrgb&w=900',
      videoUrl: 'https://videos.pexels.com/video-files/31985257/13630066_1920_1080_24fps.mp4',
      pageUrl: 'https://www.pexels.com/video/relaxed-ginger-cat-sitting-on-garden-wall-31985257/'
    },
    {
      id: 'cat-fluffy',
      tabLabel: '🐾 복실냥 아이컨택',
      badge: '포우 카페 · UHD',
      title: '사랑스러운 복실냥 클로즈업',
      desc: '포우 카페 라운지에서 집사를 바라보는 감성 모노톤 냥이 영상',
      posterUrl: PEXELS_PHOTOS.catTabby,
      videoUrl: 'https://videos.pexels.com/video-files/29695122/12770325_2560_1440_30fps.mp4',
      pageUrl: 'https://www.pexels.com/video/adorable-fluffy-cat-staring-lovingly-29695122/'
    },
    {
      id: 'bunny-eating',
      tabLabel: '🐰 토끼 먹방',
      badge: '무지개 정원 · 1080p HD',
      title: '아삭아삭 토끼 야채 먹방',
      desc: '신선한 풀잎을 오물오물 맛있게 먹는 보송보송 아기 토끼',
      posterUrl: 'https://images.pexels.com/videos/27615516/bunny-cute-cute-animal-domestic-27615516.jpeg?auto=compress&cs=tinysrgb&w=900',
      videoUrl: 'https://videos.pexels.com/video-files/27615516/12186146_1920_1080_30fps.mp4',
      pageUrl: 'https://www.pexels.com/video/bunny-eating-27615516/'
    },
    {
      id: 'hamster-house',
      tabLabel: '🐹 햄스터 하우스',
      badge: '마이 룸 · UHD',
      title: '작고 소중한 햄스터의 하루',
      desc: '아늑한 하우스에서 간식과 물을 챙겨 먹는 귀요미 햄스터 캠',
      posterUrl: 'https://images.pexels.com/videos/5768866/pexels-photo-5768866.jpeg?auto=compress&cs=tinysrgb&w=900',
      videoUrl: 'https://videos.pexels.com/video-files/5768866/5768866-uhd_2560_1440_24fps.mp4',
      pageUrl: 'https://www.pexels.com/video/hamster-drinking-water-5768866/'
    }
  ];

  const SPECIES = [
    { id: 'dog', name: '강아지', emoji: '🐶', defaultSprite: 'dog_golden', defaultPhoto: PEXELS_PHOTOS.dogGolden },
    { id: 'cat', name: '고양이', emoji: '🐱', defaultSprite: 'cat_ginger', defaultPhoto: PEXELS_PHOTOS.catGinger },
    { id: 'rabbit', name: '토끼', emoji: '🐰', defaultSprite: 'rabbit_white', defaultPhoto: PEXELS_PHOTOS.rabbitGray },
    { id: 'hamster', name: '햄스터', emoji: '🐹', defaultSprite: 'hamster_cream', defaultPhoto: PEXELS_PHOTOS.hamsterWhite }
  ];

  const COLORS = [
    { id: 'coral', name: '코랄 리드', hex: '#E46A52' },
    { id: 'cream', name: '크림 베이지', hex: '#D8A66C' },
    { id: 'forest', name: '포레스트 그린', hex: '#34B37E' },
    { id: 'lavender', name: '라벤더', hex: '#7F74F2' },
    { id: 'navy', name: '네이비', hex: '#385170' },
    { id: 'pink', name: '피치 핑크', hex: '#F28CA2' }
  ];

  const ACCESSORIES = [
    { id: 'none', name: '없음', emoji: '✨', free: true },
    { id: 'scarf', name: '빨간 스카프', emoji: '🧣', free: true },
    { id: 'sprout', name: '새싹 핀', emoji: '🌱', free: true },
    { id: 'sunglasses', name: '선글라스', emoji: '🕶️', free: false, shopId: 'acc_sunglasses' },
    { id: 'crown', name: '미니 왕관', emoji: '👑', free: false, shopId: 'acc_crown' },
    { id: 'ribbon', name: '파스텔 리본', emoji: '🎀', free: false, shopId: 'acc_ribbon' }
  ];

  const PERSONALITIES = [
    '활발한 탐험가',
    '낮잠 장인',
    '간식 헌터',
    '동네 인싸',
    '수줍은 힐러'
  ];

  const ZONES = [
    {
      id: 'park',
      name: '햇살 공원 산책로',
      icon: '🌳',
      walkPhoto: PEXELS_PHOTOS.walkPark,
      coverPhoto: PEXELS_PHOTOS.walkPark,
      horizonRatio: 0.56,
      desc: '푸른 나무 그늘과 햇살이 내리쬐는 실사 공원 산책로를 따라 여유롭게 걸어보세요.',
      visitors: 64
    },
    {
      id: 'cafe',
      name: '포우 카페 테라스',
      icon: '☕',
      walkPhoto: PEXELS_PHOTOS.walkCafe,
      coverPhoto: PEXELS_PHOTOS.walkCafe,
      horizonRatio: 0.58,
      desc: '따스한 우드 데크 야외 카페 테라스에서 반려동물 친구들과 여유로운 티타임을 즐겨보세요.',
      visitors: 31
    },
    {
      id: 'rainbow',
      name: '무지개 꽃길 정원',
      icon: '🌸',
      walkPhoto: PEXELS_PHOTOS.walkGarden,
      coverPhoto: PEXELS_PHOTOS.walkGarden,
      horizonRatio: 0.56,
      desc: '형형색색 꽃이 만개한 아치형 정원 오솔길에서 힐링 산책과 추억을 나눠보세요.',
      visitors: 19
    },
    {
      id: 'arena',
      name: '어질리티 잔디광장',
      icon: '🏃',
      walkPhoto: PEXELS_PHOTOS.walkArena,
      coverPhoto: PEXELS_PHOTOS.walkArena,
      horizonRatio: 0.54,
      desc: '드넓게 펼쳐진 초록빛 잔디 운동장에서 공 던지기와 전력 질주를 즐겨보세요!',
      visitors: 14
    }
  ];

  const NPCS = [
    {
      id: 'npc-1',
      name: '초코',
      species: 'dog',
      spriteId: 'dog_brown',
      color: '#7A5238',
      photoUrl: PEXELS_PHOTOS.dogBrown,
      accessory: 'scarf',
      personality: '간식 헌터',
      x: 245,
      y: 385,
      lines: ['멍멍! 공원 풀냄새 너무 좋다!', '저기 보물상자 있나 냄새 맡아볼래?', '산책 나오니까 기분 최고야!']
    },
    {
      id: 'npc-2',
      name: '모찌',
      species: 'cat',
      spriteId: 'cat_ginger',
      color: '#F6E7CB',
      photoUrl: PEXELS_PHOTOS.catGinger,
      accessory: 'ribbon',
      personality: '낮잠 장인',
      x: 685,
      y: 375,
      lines: ['냥... 나무 그늘 바람 시원해', '가까이 오면 코 인사해 줄게', '간식 냄새 나는데? 🐟']
    },
    {
      id: 'npc-3',
      name: '두부',
      species: 'rabbit',
      spriteId: 'rabbit_white',
      color: '#FFFFFF',
      photoUrl: PEXELS_PHOTOS.rabbitGray,
      accessory: 'sprout',
      personality: '활발한 탐험가',
      x: 590,
      y: 455,
      lines: ['깡총깡총! 같이 산책하자!', '새싹 핀 귀엽지? 🌱', '잔디밭이 폭신폭신해!']
    },
    {
      id: 'npc-4',
      name: '코코',
      species: 'hamster',
      spriteId: 'hamster_cream',
      color: '#D8965A',
      photoUrl: PEXELS_PHOTOS.hamsterWhite,
      accessory: 'crown',
      personality: '동네 인싸',
      x: 330,
      y: 470,
      lines: ['해바라기씨 챙겨왔어 🌻', '쪼꼬미지만 산책왕이야!', '오늘 만보기 3천 걸음 도전하자 🐾']
    }
  ];

  // Spatial.io-inspired Photorealistic Architectural Spaces & Interior Items
  const ROOM_THEMES = [
    {
      id: 'gallery',
      name: '🏛️ 모던 펫 갤러리',
      bgUrl: './assets/spaces/space_gallery.jpg',
      horizonRatio: 0.62,
      wallScreen: { x: 472, y: 162, w: 185, h: 108 },
      frames: [
        { x: 252, y: 174, w: 82, h: 104 },
        { x: 758, y: 174, w: 82, h: 104 }
      ],
      defaultWarmth: 12,
      desc: '오크 우드 루버와 천창 채광이 어우러진 Spatial 스타일 반려동물 갤러리 라운지'
    },
    {
      id: 'ocean',
      name: '🌊 오션뷰 테라스 빌라',
      bgUrl: './assets/spaces/space_ocean_villa.jpg',
      horizonRatio: 0.64,
      wallScreen: { x: 460, y: 156, w: 180, h: 104 },
      frames: [
        { x: 185, y: 176, w: 78, h: 98 },
        { x: 740, y: 176, w: 78, h: 98 }
      ],
      defaultWarmth: 4,
      desc: '탁 트인 에메랄드빛 바다와 우드 천장이 펼쳐진 오션뷰 모델하우스 펫 라운지'
    },
    {
      id: 'atrium',
      name: '🌅 선셋 아트리움 라운지',
      bgUrl: './assets/spaces/space_terrace_atrium.jpg',
      horizonRatio: 0.61,
      wallScreen: { x: 460, y: 215, w: 172, h: 98 },
      frames: [
        { x: 220, y: 218, w: 78, h: 96 },
        { x: 700, y: 218, w: 78, h: 96 }
      ],
      defaultWarmth: 24,
      desc: '노을빛 원형 천창과 따뜻한 간접조명이 감싸는 감성 테라코타 아트리움 공간'
    }
  ];

  const ROOM_ITEMS = [
    { id: 'room_bed', name: '디자이너 펫 베드', emoji: '🛏️', photoUrl: PEXELS_PHOTOS.petBed, actionText: '방석 너무 폭신해 Zzz 💤', actionType: 'nap', free: true },
    { id: 'room_bowl', name: '원목 펫 다이닝 바', emoji: '🥣', photoUrl: PEXELS_PHOTOS.petTreats, actionText: '사료 냠냠! 맛있어 🍖', actionType: 'eat', free: true },
    { id: 'room_toy', name: '플레이 토이 바구니', emoji: '🎾', photoUrl: PEXELS_PHOTOS.dogPark, actionText: '장난감 갖고 노는 중! 🎾', actionType: 'play', free: true },
    { id: 'room_plant', name: '몬스테라 대형 화분', emoji: '🪴', photoUrl: PEXELS_PHOTOS.flowerMeadow, actionText: '초록 화분 냄새 상쾌해 🌿', actionType: 'sniff', free: true },
    { id: 'room_lamp', name: '북유럽 플로어 무드등', emoji: '🛋️', photoUrl: PEXELS_PHOTOS.catCafe, actionText: '따뜻한 조명 아래 힐링 ✨', actionType: 'nap', free: true },
    { id: 'furn_cushion', name: '호텔급 푹신 방석', emoji: '☁️', photoUrl: PEXELS_PHOTOS.petBed, actionText: '구름 위에서 꿀잠 자는 중 ☁️', actionType: 'nap', free: false, shopId: 'furn_cushion' },
    { id: 'furn_sofa', name: '패브릭 라운지 소파', emoji: '🛋️', photoUrl: PEXELS_PHOTOS.hamsterCouch, actionText: '소파 위가 내 지정석이야 🛋️', actionType: 'nap', free: false, shopId: 'furn_sofa' },
    { id: 'furn_garden', name: '야생화 실내 화단', emoji: '🌼', photoUrl: PEXELS_PHOTOS.flowerMeadow, actionText: '킁킁~ 꽃향기 좋아 🌼', actionType: 'sniff', free: false, shopId: 'furn_garden' }
  ];

  // Pillar 5: Adoption Pre-Simulation Education Quests
  const ADOPTION_QUESTS = [
    {
      id: 'quest_vaccine',
      badge: '💉 예방접종 마스터',
      title: '필수 예방접종 & 심장사상충 주기 알기',
      desc: '어린 반려동물은 생후 6~8주부터 기초 종합백신(DHPPL/CVRP)과 광견병 접종, 매월 1회 심장사상충 예방이 필수입니다.',
      question: '심장사상충 예방약은 보통 얼마나 자주 급여/도포해야 할까요?',
      options: ['매월 1회 정기적으로', '1년에 한 번 겨울에만', '아플 때만 병원에서'],
      correctIndex: 0,
      reward: 100
    },
    {
      id: 'quest_budget',
      badge: '🏥 양육비 플래너',
      title: '월 양육비 & 응급 의료비 시뮬레이션',
      desc: '사료·배변패드·미용 등 고정비(월 평균 15~25만 원) 외에도, 노령기·응급 수술을 대비한 반려동물 비상금이나 펫보험 준비가 중요합니다.',
      question: '책임 있는 반려생활을 위해 가장 권장되는 재정 준비 방법은?',
      options: ['사료값만 최소한으로 준비한다', '고정 양육비 + 별도 응급 의료 비상금을 마련한다', '아프면 그때 고민한다'],
      correctIndex: 1,
      reward: 100
    },
    {
      id: 'quest_anxiety',
      badge: '🏠 분리불안 케어 전문가',
      title: '분리불안 대처법 & 펫티켓 산책',
      desc: '외출 전후 과도한 인사 대신 담담하게 행동하고, 노즈워크 장난감으로 혼자 있는 시간을 긍정적으로 학습시키면 분리불안을 완화할 수 있습니다.',
      question: '반려동물의 분리불안 완화에 도움이 되는 올바른 훈련법은?',
      options: ['외출할 때마다 미안하다고 10분간 안아준다', '짧은 외출부터 점진적으로 늘리며 노즈워크 보상을 준다', '혼자 짖을 때마다 크게 혼낸다'],
      correctIndex: 1,
      reward: 100
    }
  ];

  // Pillar 5: Pet Sitter Care Exchange (품앗이)
  const PET_SITTER_REQUESTS = [
    {
      id: 'sitter-1',
      owner: '해피네 집사',
      petName: '해피',
      photoUrl: PEXELS_PHOTOS.dogCollie,
      task: '야근 중이라 10분만 산책 & 물 급여 부탁드려요!',
      reward: 45,
      helped: false
    },
    {
      id: 'sitter-2',
      owner: '치즈맘',
      petName: '나비',
      photoUrl: PEXELS_PHOTOS.catCafe,
      task: '잠시 외출했어요! 빗질이랑 츄르 하나만 챙겨주세요 🐱',
      reward: 40,
      helped: false
    },
    {
      id: 'sitter-3',
      owner: '토순아빠',
      petName: '토순이',
      photoUrl: PEXELS_PHOTOS.rabbitGrass,
      task: '신선한 건초랑 당근 간식 한 번만 확인해 주세요 🥕',
      reward: 35,
      helped: false
    }
  ];

  // Pillar 5: Real-world Custom Goods & O2O Commerce
  const REAL_GOODS = [
    {
      id: 'goods_keyring',
      name: '내 아이 그대로 아크릴 키링',
      tag: '커스텀 제작',
      priceWon: '12,900원',
      discountCoin: 200,
      discountWon: '3,000원 할인',
      desc: '현재 꾸민 실사 반려동물 모습과 인식표 이름이 그대로 인쇄되는 양면 아크릴 키링'
    },
    {
      id: 'goods_cushion',
      name: '실사 포토 맞춤 쿠션',
      tag: '인기 굿즈',
      priceWon: '29,000원',
      discountCoin: 400,
      discountWon: '6,000원 할인',
      desc: '우리 아이 실사 캐릭터를 부드러운 벨벳 원단에 담은 40cm 맞춤 쿠션'
    },
    {
      id: 'goods_tag',
      name: '실물 각인 황동 인식표',
      tag: '안전 필수템',
      priceWon: '18,500원',
      discountCoin: 250,
      discountWon: '4,000원 할인',
      desc: '스튜디오에서 입력한 이름과 연락처가 레이저 각인되는 실제 목걸이 인식표'
    },
    {
      id: 'goods_food',
      name: '프리미엄 펫푸드 5,000원 할인권',
      tag: 'O2O 커머스',
      priceWon: '제휴몰 즉시 사용',
      discountCoin: 300,
      discountWon: '쿠폰 즉시 발급',
      desc: '산책과 케어로 모은 포우코인을 실제 펫푸드·용품 구매 할인 쿠폰으로 교환'
    }
  ];

  const SHOP_ITEMS = [
    {
      id: 'acc_sunglasses',
      category: 'accessory',
      categoryLabel: '액세서리',
      name: '힙스터 선글라스',
      emoji: '🕶️',
      photoUrl: PEXELS_PHOTOS.dogCollie,
      desc: '산책로 최고 인싸로 만들어주는 시크한 선글라스',
      price: 350,
      accessoryId: 'sunglasses'
    },
    {
      id: 'acc_crown',
      category: 'accessory',
      categoryLabel: '액세서리',
      name: '황금 미니 왕관',
      emoji: '👑',
      photoUrl: PEXELS_PHOTOS.catGinger,
      desc: '우리 집 댕냥이는 왕자님·공주님이니까요!',
      price: 500,
      accessoryId: 'crown'
    },
    {
      id: 'acc_ribbon',
      category: 'accessory',
      categoryLabel: '액세서리',
      name: '파스텔 리본',
      emoji: '🎀',
      photoUrl: PEXELS_PHOTOS.rabbitGrass,
      desc: '실사 산책 캐릭터 위에서도 사랑스럽게 빛나는 리본',
      price: 250,
      accessoryId: 'ribbon'
    },
    {
      id: 'treat_biscuit',
      category: 'treat',
      categoryLabel: '간식 & 소모품',
      name: '수제 뼈다귀 비스킷 세트',
      emoji: '🦴',
      photoUrl: PEXELS_PHOTOS.petTreats,
      desc: '포만감 +25 · 애정도 +10 · 산책 중 맛있게 먹어요',
      price: 120
    },
    {
      id: 'treat_cafe',
      category: 'treat',
      categoryLabel: '간식 & 소모품',
      name: '포우 카페 티타임 간식',
      emoji: '☕',
      photoUrl: PEXELS_PHOTOS.catCafe,
      desc: '스트레스 -20 · 애정도 +15 프리미엄 펫 간식',
      price: 180
    },
    {
      id: 'furn_cushion',
      category: 'furniture',
      categoryLabel: '마이룸 가구',
      name: '호텔급 푹신 방석',
      emoji: '☁️',
      photoUrl: PEXELS_PHOTOS.petBed,
      desc: '마이 룸에 배치하면 반려동물이 스스로 올라가 꿀잠을 잡니다',
      price: 420
    },
    {
      id: 'furn_sofa',
      category: 'furniture',
      categoryLabel: '마이룸 가구',
      name: '미니 패브릭 소파',
      emoji: '🛋️',
      photoUrl: PEXELS_PHOTOS.hamsterCouch,
      desc: '마이 룸 배치 시 자율 휴식 행동이 활성화되는 아늑한 소파',
      price: 580
    },
    {
      id: 'furn_garden',
      category: 'furniture',
      categoryLabel: '마이룸 가구',
      name: '야생화 실내 화분',
      emoji: '🌼',
      photoUrl: PEXELS_PHOTOS.flowerMeadow,
      desc: '마이 룸에 배치하면 반려동물이 다가와 꽃향기를 맡습니다',
      price: 490
    }
  ];

  const DEFAULT_POSTS = [
    {
      id: 'post-1',
      category: '산책일기',
      author: '몽이네 집사',
      authorAvatar: PEXELS_PHOTOS.dogGolden,
      photoUrl: PEXELS_PHOTOS.walkPark,
      time: '12분 전',
      content: '오늘 만보기 2,500걸음 연동해서 햇살 공원 산책 완료! 숨겨진 보물상자도 찾고 리드줄 산책 너무 힐링돼요 ✨',
      likes: 24,
      liked: false
    },
    {
      id: 'post-2',
      category: '모임모집',
      author: '모찌언니',
      authorAvatar: PEXELS_PHOTOS.catTabby,
      photoUrl: PEXELS_PHOTOS.catCafe,
      time: '45분 전',
      content: '오늘 밤 9시에 포우 카페 테라스에서 냥집사 티타임 & 펫 시터 품앗이 정모 열어요! ☕🐾',
      likes: 17,
      liked: false
    },
    {
      id: 'post-3',
      category: '추억편지',
      author: '별이엄마',
      authorAvatar: PEXELS_PHOTOS.dogBrown,
      photoUrl: PEXELS_PHOTOS.walkGarden,
      time: '2시간 전',
      content: '꽃이 만개한 무지개 정원 길을 걸으며 우리 별이를 떠올렸어. 그곳에서도 행복하게 산책하고 있길 바라.',
      likes: 41,
      liked: false
    },
    {
      id: 'post-4',
      category: '꿀팁공유',
      author: '두부아빠',
      authorAvatar: PEXELS_PHOTOS.rabbitGray,
      photoUrl: PEXELS_PHOTOS.petBed,
      time: '4시간 전',
      content: '마이 룸에 방석이랑 장난감 바구니 배치해 두니까 강아지가 혼자 가서 놀고 낮잠도 자네요 🛏️ AI 교감 최고!',
      likes: 15,
      liked: false
    }
  ];

  const DEFAULT_STATE = {
    coins: 1500,
    walkMeters: 0,
    realStepsToday: 1240,
    zoneId: 'park',
    timeOfDay: 'day',
    leashEnabled: true,
    ownedItems: [],
    completedQuests: [],
    redeemedGoods: [],
    helpedSitters: [],
    stats: {
      fullness: 82,
      cleanliness: 86,
      energy: 88,
      affection: 74,
      stress: 16
    },
    growth: {
      exp: 65
    },
    memory: {
      lastVisitTs: Date.now(),
      visitCount: 1,
      counts: {
        feed: 0,
        brush: 0,
        bath: 0,
        pet: 0,
        walk: 0,
        train: 0,
        ball: 0
      },
      learnedSkills: {
        sit: 1,
        paw: 0,
        jump: 1,
        wait: 0
      },
      notes: ['오늘 처음 PawVerse에서 보호자님을 만났어요! 🐾']
    },
    myRoom: {
      themeId: 'gallery',
      warmth: 12,
      spotlights: true,
      showVideoWall: true,
      videoIndex: 0,
      galleryPhotos: [PEXELS_PHOTOS.dogGolden, PEXELS_PHOTOS.catCafe],
      invitedSpriteIds: ['dog_brown', 'cat_ginger'],
      customCatalog: [],
      placed: [
        { itemId: 'room_bed', x: 205, y: 410, scale: 1 },
        { itemId: 'room_bowl', x: 470, y: 448, scale: 1 },
        { itemId: 'room_toy', x: 725, y: 418, scale: 1 },
        { itemId: 'room_plant', x: 118, y: 365, scale: 1.05 }
      ]
    },
    avatar: {
      name: '몽이',
      tagText: 'PAW-0127',
      species: 'dog',
      spriteId: 'dog_golden',
      color: '#E46A52',
      photoUrl: PEXELS_PHOTOS.dogGolden,
      accessory: 'none',
      personality: '활발한 탐험가'
    },
    posts: DEFAULT_POSTS
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(DEFAULT_STATE);
      const parsed = JSON.parse(raw);
      return {
        ...structuredClone(DEFAULT_STATE),
        ...parsed,
        stats: { ...DEFAULT_STATE.stats, ...(parsed.stats || {}) },
        growth: { ...DEFAULT_STATE.growth, ...(parsed.growth || {}) },
        memory: {
          ...DEFAULT_STATE.memory,
          ...(parsed.memory || {}),
          counts: { ...DEFAULT_STATE.memory.counts, ...((parsed.memory && parsed.memory.counts) || {}) },
          learnedSkills: { ...DEFAULT_STATE.memory.learnedSkills, ...((parsed.memory && parsed.memory.learnedSkills) || {}) },
          notes: Array.isArray(parsed.memory && parsed.memory.notes) ? parsed.memory.notes : [...DEFAULT_STATE.memory.notes]
        },
        myRoom: {
          ...DEFAULT_STATE.myRoom,
          ...(parsed.myRoom || {}),
          placed: Array.isArray(parsed.myRoom && parsed.myRoom.placed) ? parsed.myRoom.placed : structuredClone(DEFAULT_STATE.myRoom.placed)
        },
        avatar: { ...DEFAULT_STATE.avatar, ...(parsed.avatar || {}) },
        ownedItems: Array.isArray(parsed.ownedItems) ? parsed.ownedItems : [],
        completedQuests: Array.isArray(parsed.completedQuests) ? parsed.completedQuests : [],
        redeemedGoods: Array.isArray(parsed.redeemedGoods) ? parsed.redeemedGoods : [],
        helpedSitters: Array.isArray(parsed.helpedSitters) ? parsed.helpedSitters : [],
        posts: Array.isArray(parsed.posts) && parsed.posts.length ? parsed.posts : structuredClone(DEFAULT_POSTS)
      };
    } catch {
      return structuredClone(DEFAULT_STATE);
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore quota errors
    }
  }

  return {
    PEXELS_PHOTOS,
    PET_SPRITES,
    PET_PORTRAITS,
    GROWTH_STAGES,
    getGrowthInfo,
    LIVE_VIDEOS,
    SPECIES,
    COLORS,
    ACCESSORIES,
    PERSONALITIES,
    ZONES,
    NPCS,
    ROOM_THEMES,
    ROOM_ITEMS,
    ADOPTION_QUESTS,
    PET_SITTER_REQUESTS,
    REAL_GOODS,
    SHOP_ITEMS,
    loadState,
    saveState
  };
})();
