window.PAWVERSE_DATA = (() => {
  const STORAGE_KEY = 'pawverse_state_v2';

  const PEXELS_PHOTOS = {
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

  const PET_PORTRAITS = [
    { id: 'dog_golden', species: 'dog', label: '골든 퍼피', url: PEXELS_PHOTOS.dogGolden },
    { id: 'dog_brown', species: 'dog', label: '초코 댕댕이', url: PEXELS_PHOTOS.dogBrown },
    { id: 'dog_collie', species: 'dog', label: '보더콜리', url: PEXELS_PHOTOS.dogCollie },
    { id: 'cat_ginger', species: 'cat', label: '치즈 냥이', url: PEXELS_PHOTOS.catGinger },
    { id: 'cat_tabby', species: 'cat', label: '낮잠 태비냥', url: PEXELS_PHOTOS.catTabby },
    { id: 'rabbit_gray', species: 'rabbit', label: '그레이 토끼', url: PEXELS_PHOTOS.rabbitGray },
    { id: 'rabbit_grass', species: 'rabbit', label: '초원 토끼', url: PEXELS_PHOTOS.rabbitGrass },
    { id: 'hamster_white', species: 'hamster', label: '스노우 햄찌', url: PEXELS_PHOTOS.hamsterWhite },
    { id: 'hamster_couch', species: 'hamster', label: '소파 햄찌', url: PEXELS_PHOTOS.hamsterCouch }
  ];

  const SPECIES = [
    { id: 'dog', name: '강아지', emoji: '🐶', defaultPhoto: PEXELS_PHOTOS.dogGolden },
    { id: 'cat', name: '고양이', emoji: '🐱', defaultPhoto: PEXELS_PHOTOS.catGinger },
    { id: 'rabbit', name: '토끼', emoji: '🐰', defaultPhoto: PEXELS_PHOTOS.rabbitGray },
    { id: 'hamster', name: '햄스터', emoji: '🐹', defaultPhoto: PEXELS_PHOTOS.hamsterWhite }
  ];

  const COLORS = [
    { id: 'cream', name: '크림', hex: '#F6E7CB' },
    { id: 'caramel', name: '카라멜', hex: '#D8965A' },
    { id: 'choco', name: '초코', hex: '#7A5238' },
    { id: 'white', name: '스노우', hex: '#FFFFFF' },
    { id: 'gray', name: '실버그레이', hex: '#A9B2BC' },
    { id: 'peach', name: '피치핑크', hex: '#F4B6B0' }
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
      name: '햇살 공원 광장',
      icon: '🌳',
      coverPhoto: PEXELS_PHOTOS.dogPark,
      desc: '푸른 잔디와 중앙 분수대에서 강아지·고양이 친구들과 산책하는 메인 커뮤니티 광장입니다.',
      ground: '#BFE8A9',
      path: '#EFE5CF',
      accent: '#63C174',
      landmark: 'fountain',
      visitors: 64
    },
    {
      id: 'cafe',
      name: '포우 카페 테라스',
      icon: '☕',
      coverPhoto: PEXELS_PHOTOS.catCafe,
      desc: '아늑한 카페 테이블에서 수제 멍푸치노와 츄르를 나누며 쉬어가는 공간입니다.',
      ground: '#EBD9C1',
      path: '#D6BC9C',
      accent: '#D98B5F',
      landmark: 'cafe',
      visitors: 31
    },
    {
      id: 'rainbow',
      name: '무지개 메모리얼 가든',
      icon: '🌈',
      coverPhoto: PEXELS_PHOTOS.flowerMeadow,
      desc: '들꽃이 만개한 정원에서 소중한 반려동물을 추억하고 편지를 남기는 힐링 공간입니다.',
      ground: '#DCEAD7',
      path: '#EFE9F7',
      accent: '#9E8DF7',
      landmark: 'rainbow',
      visitors: 19
    },
    {
      id: 'arena',
      name: '어질리티 아레나',
      icon: '🏆',
      coverPhoto: PEXELS_PHOTOS.dogCollie,
      desc: '넓은 초원에서 전력 질주와 산책 챌린지를 즐기는 활기찬 액티비티 존입니다.',
      ground: '#CFE39A',
      path: '#F5D6A7',
      accent: '#F5A623',
      landmark: 'arena',
      visitors: 14
    }
  ];

  const NPCS = [
    {
      id: 'npc-1',
      name: '초코',
      species: 'dog',
      color: '#7A5238',
      photoUrl: PEXELS_PHOTOS.dogBrown,
      accessory: 'scarf',
      personality: '간식 헌터',
      x: 240,
      y: 220,
      lines: ['멍멍! 오늘 잔디밭 산책 최고야!', '혹시 고구마 간식 있어?', '실사 사진으로 만나니 반갑다~']
    },
    {
      id: 'npc-2',
      name: '모찌',
      species: 'cat',
      color: '#F6E7CB',
      photoUrl: PEXELS_PHOTOS.catTabby,
      accessory: 'ribbon',
      personality: '낮잠 장인',
      x: 610,
      y: 190,
      lines: ['냥... 햇볕이 너무 따끈해', '포우 카페 테이블에 누워있을래', '그루밍 타임이야 ✨']
    },
    {
      id: 'npc-3',
      name: '두부',
      species: 'rabbit',
      color: '#A9B2BC',
      photoUrl: PEXELS_PHOTOS.rabbitGray,
      accessory: 'sprout',
      personality: '활발한 탐험가',
      x: 650,
      y: 380,
      lines: ['깡총깡총! 같이 뛰어놀자!', '새싹 핀 어때? 잘 어울리지?', '야채 먹방 영상 보고 왔어 🐰']
    },
    {
      id: 'npc-4',
      name: '코코',
      species: 'hamster',
      color: '#D8965A',
      photoUrl: PEXELS_PHOTOS.hamsterWhite,
      accessory: 'crown',
      personality: '동네 인싸',
      x: 220,
      y: 390,
      lines: ['해바라기씨 나눠줄까?', '포우버스 광장에 온 걸 환영해!', '볼따구 빵빵 🐹']
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
      desc: '광장 최고 인싸로 만들어주는 시크한 미니 선글라스',
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
      desc: '실사 프로필 위에서도 돋보이는 사랑스러운 리본',
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
      desc: '구매 즉시 광장에서 행복 이모트와 함께 즐길 수 있어요',
      price: 120
    },
    {
      id: 'treat_cafe',
      category: 'treat',
      categoryLabel: '간식 & 소모품',
      name: '포우 카페 티타임 간식',
      emoji: '☕',
      photoUrl: PEXELS_PHOTOS.catCafe,
      desc: '고양이와 강아지 모두가 좋아하는 프리미엄 펫 간식',
      price: 180
    },
    {
      id: 'furn_cushion',
      category: 'furniture',
      categoryLabel: '마이룸 가구',
      name: '구름 푹신 펫 베드',
      emoji: '🛏️',
      photoUrl: PEXELS_PHOTOS.petBed,
      desc: '비글도 푹 빠지는 푹신푹신한 호텔급 꿀잠 방석',
      price: 420
    },
    {
      id: 'furn_sofa',
      category: 'furniture',
      categoryLabel: '마이룸 가구',
      name: '미니 패브릭 소파 하우스',
      emoji: '🛋️',
      photoUrl: PEXELS_PHOTOS.hamsterCouch,
      desc: '소동물과 반려묘를 위한 포근한 패브릭 소파 공간',
      price: 580
    },
    {
      id: 'furn_garden',
      category: 'furniture',
      categoryLabel: '마이룸 가구',
      name: '야생화 테라스 화단',
      emoji: '🌼',
      photoUrl: PEXELS_PHOTOS.flowerMeadow,
      desc: '마이 룸 창가를 싱그러운 들꽃 정원으로 꾸며보세요',
      price: 490
    }
  ];

  const DEFAULT_POSTS = [
    {
      id: 'post-1',
      category: '산책일기',
      author: '몽이네 집사',
      authorAvatar: PEXELS_PHOTOS.dogGolden,
      photoUrl: PEXELS_PHOTOS.dogPark,
      time: '12분 전',
      content: '오늘 햇살 공원 광장에서 친구 리트리버랑 실컷 뛰어놀았어요! 실사 포토 아바타로 바꾸니까 우리 아이가 진짜 산책하는 느낌이에요 ✨',
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
      content: '오늘 밤 9시에 포우 카페 테라스에서 냥집사 티타임 정모 열어요! 치즈냥·태비냥 모두 환영합니다 ☕🐾',
      likes: 17,
      liked: false
    },
    {
      id: 'post-3',
      category: '추억편지',
      author: '별이엄마',
      authorAvatar: PEXELS_PHOTOS.dogBrown,
      photoUrl: PEXELS_PHOTOS.flowerMeadow,
      time: '2시간 전',
      content: '들꽃 가득한 무지개 메모리얼 가든에 오늘도 들렀어. 그곳에서도 좋아하던 풀냄새 맡으며 행복하게 뛰어놀고 있길 바라.',
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
      content: '아이템 샵에서 펫 베드랑 수제 간식 구경하다가 왕관까지 질렀어요 👑 라이브 캠 영상 틀어놓고 작업하면 힐링 그 자체!',
      likes: 15,
      liked: false
    }
  ];

  const DEFAULT_STATE = {
    coins: 1500,
    zoneId: 'park',
    timeOfDay: 'day',
    avatarMode: 'photo',
    ownedItems: [],
    avatar: {
      name: '몽이',
      species: 'dog',
      color: '#F6E7CB',
      photoUrl: PEXELS_PHOTOS.dogGolden,
      accessory: 'scarf',
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
        avatar: {
          ...DEFAULT_STATE.avatar,
          ...(parsed.avatar || {})
        },
        ownedItems: Array.isArray(parsed.ownedItems) ? parsed.ownedItems : [],
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
      // Ignore storage quota errors
    }
  }

  return {
    PEXELS_PHOTOS,
    LIVE_VIDEOS,
    PET_PORTRAITS,
    SPECIES,
    COLORS,
    ACCESSORIES,
    PERSONALITIES,
    ZONES,
    NPCS,
    SHOP_ITEMS,
    loadState,
    saveState
  };
})();
