window.PAWVERSE_DATA = (() => {
  const STORAGE_KEY = 'pawverse_state_v1';

  const SPECIES = [
    { id: 'dog', name: '강아지', emoji: '🐶' },
    { id: 'cat', name: '고양이', emoji: '🐱' },
    { id: 'rabbit', name: '토끼', emoji: '🐰' },
    { id: 'hamster', name: '햄스터', emoji: '🐹' }
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
      iconBg: '#E9F8F1',
      desc: '중앙 분수대와 잔디 산책로가 펼쳐진 메인 커뮤니티 광장입니다.',
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
      iconBg: '#FFF0E5',
      desc: '수제 멍푸치노와 츄르를 나누며 집사들과 수다 떠는 아늑한 테라스입니다.',
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
      iconBg: '#F0EEFF',
      desc: '별이 된 반려동물을 추억하고 따뜻한 편지를 띄워 보내는 힐링 정원입니다.',
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
      iconBg: '#FFF6D8',
      desc: '점프 허들과 산책 챌린지가 열리는 활기찬 미니게임 운동장입니다.',
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
      accessory: 'scarf',
      personality: '간식 헌터',
      x: 240,
      y: 220,
      lines: ['멍멍! 오늘 산책 날씨 최고야!', '혹시 고구마 간식 있어?', '분수대 물소리 좋다~']
    },
    {
      id: 'npc-2',
      name: '모찌',
      species: 'cat',
      color: '#FFFFFF',
      accessory: 'ribbon',
      personality: '낮잠 장인',
      x: 610,
      y: 190,
      lines: ['냥... 햇볕이 따끈해', '츄르 주면 친구 해줄게', '그루밍 타임이야 ✨']
    },
    {
      id: 'npc-3',
      name: '두부',
      species: 'rabbit',
      color: '#F6E7CB',
      accessory: 'sprout',
      personality: '활발한 탐험가',
      x: 650,
      y: 380,
      lines: ['깡총깡총! 같이 뛰어놀자!', '새싹 핀 어때? 귀엽지!', '광장 구경하는 중이야 🐾']
    },
    {
      id: 'npc-4',
      name: '코코',
      species: 'hamster',
      color: '#D8965A',
      accessory: 'crown',
      personality: '동네 인싸',
      x: 220,
      y: 390,
      lines: ['해바라기씨 나눠줄까?', '모두 포우버스에 온 걸 환영해!', '볼따구 빵빵 🐹']
    }
  ];

  const SHOP_ITEMS = [
    {
      id: 'acc_sunglasses',
      category: 'accessory',
      categoryLabel: '액세서리',
      name: '힙스터 선글라스',
      emoji: '🕶️',
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
      desc: '어느 털 색에도 찰떡같이 어울리는 사랑스러운 리본',
      price: 250,
      accessoryId: 'ribbon'
    },
    {
      id: 'treat_puppuccino',
      category: 'treat',
      categoryLabel: '간식 & 소모품',
      name: '포우 멍푸치노',
      emoji: '🥤',
      desc: '구매 즉시 광장에서 행복 이모트와 함께 즐길 수 있어요',
      price: 120
    },
    {
      id: 'treat_salmon',
      category: 'treat',
      categoryLabel: '간식 & 소모품',
      name: '연어 동결건조 트릿',
      emoji: '🍣',
      desc: '고양이와 강아지 모두가 환장하는 프리미엄 간식',
      price: 180
    },
    {
      id: 'furn_cushion',
      category: 'furniture',
      categoryLabel: '마이룸 가구',
      name: '구름 푹신 방석',
      emoji: '☁️',
      desc: '마이 룸에 배치할 수 있는 구름 모양 꿀잠 방석',
      price: 420
    },
    {
      id: 'furn_cattower',
      category: 'furniture',
      categoryLabel: '마이룸 가구',
      name: '원목 캣타워',
      emoji: '🪵',
      desc: '창밖을 구경하기 좋은 3단 친환경 원목 캣타워',
      price: 680
    },
    {
      id: 'furn_tent',
      category: 'furniture',
      categoryLabel: '마이룸 가구',
      name: '인디언 피크닉 텐트',
      emoji: '⛺',
      desc: '아늑한 나만의 숨숨집을 꾸며보세요',
      price: 550
    }
  ];

  const DEFAULT_POSTS = [
    {
      id: 'post-1',
      category: '산책일기',
      author: '몽이네 집사',
      petEmoji: '🐶',
      time: '12분 전',
      content: '오늘 햇살 공원 광장에서 초코랑 두부 만나서 한참 뛰어놀았어요! 저녁 노을 모드로 바꾸니까 분위기 너무 예쁘네요 ✨',
      likes: 14,
      liked: false
    },
    {
      id: 'post-2',
      category: '모임모집',
      author: '모찌언니',
      petEmoji: '🐱',
      time: '45분 전',
      content: '오늘 밤 9시에 포우 카페 테라스에서 치즈태비 & 흰냥이 정모 열어요! 츄르 이모트 들고 놀러오세요 ☕',
      likes: 9,
      liked: false
    },
    {
      id: 'post-3',
      category: '추억편지',
      author: '별이엄마',
      petEmoji: '🌈',
      time: '2시간 전',
      content: '우리 별이, 무지개 가든에 오늘도 놀러 왔어. 거기선 아프지 말고 좋아하는 공놀이 실컷 하고 있어. 늘 보고 싶어.',
      likes: 32,
      liked: false
    },
    {
      id: 'post-4',
      category: '꿀팁공유',
      author: '두부아빠',
      petEmoji: '🐰',
      time: '4시간 전',
      content: '아바타 스튜디오에서 새싹 핀 무료로 착용 가능해요! 포우코인 모아서 선글라스 사니까 엄청 힙해지네요 🕶️',
      likes: 11,
      liked: false
    }
  ];

  const DEFAULT_STATE = {
    coins: 1500,
    zoneId: 'park',
    timeOfDay: 'day',
    ownedItems: [],
    avatar: {
      name: '몽이',
      species: 'dog',
      color: '#F6E7CB',
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
      // Ignore storage quota errors in private mode
    }
  }

  return {
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
