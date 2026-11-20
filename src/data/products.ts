import { CategoryFilter, Product } from '../types/store';

export const HERO_IMAGE = '/src/assets/images/hero_ceramic_sculpture_1795189888514.jpg';
export const ATELIER_IMAGE = '/src/assets/images/atelier_craftsman_studio_1795189893060.jpg';

export const CATEGORY_TABS: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: 'كل الشغل' },
  { id: 'ceramics', label: 'خزف وفخار' },
  { id: 'textiles', label: 'نسيج يدوي' },
  { id: 'woodwork', label: 'خشب منحوت' },
  { id: 'metal_glass', label: 'نحاس وزجاج' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'ath-01',
    slug: 'cobalt-horizon-vessel',
    name: 'فازة الكوبالت الهادية',
    category: 'ceramics',
    categoryLabel: 'خزف وفخار',
    editionLabel: '٢٤ قطعة بس',
    price: 1450,
    artisan: 'سلمى الشاذلي',
    origin: 'ورشة الفسطاط، القاهرة',
    dimensions: 'الارتفاع ٢٦ سم × القطر ١٩ سم',
    craftTime: '١٤ يوم شغل وحرق مرتين في الفرن',
    material: 'طين حجري رمادي مع طلاء كوبالت مطفي',
    shortDescription:
      'فازة خزف معمولة بإيدين على الدولاب، بحافة طين طبيعي من فوق عشان تبيّن جمال الخامة والألوان.',
    story:
      'الفازة دي اتشكلت من طين حجري تقيل، واتحرقت في الفرن على ١٠٠٠ درجة وبعدها اتغمست في لون كوبالت طبيعي مع حافة سادة من الطين الخام عشان تحس بملمس الشغل اليدوي في كل تفصيلة.',
    image: '/src/assets/images/product_cobalt_vase_1795189891436.jpg',
    inStock: true,
    stockCount: 5,
    variants: [
      { id: 'v-cobalt-m', label: 'كوبالت غامق — مقاس وسط', priceDelta: 0, swatchHex: '#1E3A8A' },
      { id: 'v-cobalt-l', label: 'كوبالت غامق — مقاس كبير', priceDelta: 450, swatchHex: '#172554' },
    ],
    reviews: [
      {
        id: 'rev-01-a',
        reviewerName: 'ندى المنشاوي',
        reviewerLocation: 'الزمالك، القاهرة',
        rating: 5,
        date: '١٢ أكتوبر ٢٠٢٦',
        comment:
          'اللون على الحقيقة أهدى وأحلى بكتير من الصور، وحافة الطين اللي فوق مديّاها شكل فني مختلف على ترابيزة الصالون.',
      },
      {
        id: 'rev-01-b',
        reviewerName: 'أحمد عبد العزيز',
        reviewerLocation: 'سموحة، الإسكندرية',
        rating: 5,
        date: '٢٨ سبتمبر ٢٠٢٦',
        comment:
          'التغليف كان ممتاز جداً والقطعة وصلت ومعاها كارت برقمها وتوقيع الفنانة سلمى. باين فيها تقل وجودة الطين الحجري.',
      },
    ],
  },
  {
    id: 'ath-02',
    slug: 'indigo-loom-throw',
    name: 'شال النول النيلي المنسوج',
    category: 'textiles',
    categoryLabel: 'نسيج يدوي',
    editionLabel: '١٨ قطعة بس',
    price: 1850,
    artisan: 'ورشة أخميم للنسيج',
    origin: 'سوهاج، صعيد مصر',
    dimensions: '١٤٠ سم × ٢١٠ سم',
    craftTime: '٩ أيام نسج على النول الخشب',
    material: 'كتان مصري طبيعي وقطن مصبوغ بالنيلة',
    shortDescription:
      'مفرش أو شال منسوج على النول اليدوي بخيوط كتان طبيعي وخطوط نيلي هادية وأهداب مربوطة بالإيد.',
    story:
      'خيوط الكتان والقطن بتتغزل وتتصبغ في أحواض نيلة طبيعية، وبعدها تتنسج بالراحة على النول الخشب، وده اللي بيدي كل قطعة ملمس ناعم وإحساس دافي ومريح في البيت.',
    image: '/src/assets/images/product_linen_throw_1795189892108.jpg',
    inStock: true,
    stockCount: 4,
    variants: [
      { id: 'v-indigo-stripe', label: 'كتان طبيعي بخط نيلي', priceDelta: 0, swatchHex: '#2B4570' },
      { id: 'v-slate-stripe', label: 'كتان رمادي بخط كحلي هادي', priceDelta: 150, swatchHex: '#475569' },
    ],
    reviews: [
      {
        id: 'rev-02-a',
        reviewerName: 'مريم طارق',
        reviewerLocation: 'المعادي، القاهرة',
        rating: 5,
        date: '٣ نوفمبر ٢٠٢٦',
        comment:
          'خامة الكتان تحفة ومريحة جداً، والألوان هادية وراكية على الكنبة. شغل يفتح النفس بصراحة.',
      },
      {
        id: 'rev-02-b',
        reviewerName: 'ياسمين فؤاد',
        reviewerLocation: 'الشيخ زايد، الجيزة',
        rating: 4,
        date: '١٩ أكتوبر ٢٠٢٦',
        comment:
          'شغل النول اليدوي مظبوط جداً والأهداب متقفلة بنظافة. عجبني إن معاه ورقة بتشرح إزاي نحافظ عليه في الغسيل.',
      },
    ],
  },
  {
    id: 'ath-03',
    slug: 'olivewood-sculptural-bowl',
    name: 'طبق خشب الزيتون المنحوت',
    category: 'woodwork',
    categoryLabel: 'خشب منحوت',
    editionLabel: 'قطعة واحدة ١/١',
    price: 1200,
    artisan: 'طارق النجار',
    origin: 'سيوة والواحات',
    dimensions: 'القطر ٢٨ سم × الارتفاع ١١ سم',
    craftTime: '٦ أيام نحت وصنفرة بالإيد',
    material: 'خشب زيتون طبيعي متعالج بزيت اللوز وشمع العسل',
    shortDescription:
      'طبق منحوت من حتة خشب زيتون واحدة بشكل طبيعي غير منتظم يحافظ على تعريجات الخشب وحوافه الأصلية.',
    story:
      'الطبق ده منحوت من خشب تقليم شجر الزيتون من غير ما نقطع ولا شجرة، واتصنفر بالإيد على ٥ مراحل واتدهن بزيت طبيعي آمن للأكل عشان يفضل محافظ على لمعته وعروقه.',
    image: '/src/assets/images/product_olivewood_bowl_1795189892121.jpg',
    inStock: true,
    stockCount: 3,
    variants: [
      { id: 'v-olive-organic', label: 'حافة طبيعية — عروق حرة', priceDelta: 0, swatchHex: '#8C6239' },
      { id: 'v-olive-wide', label: 'مقاس سفرة كبير ٣٤ سم', priceDelta: 380, swatchHex: '#6E4B2A' },
    ],
    reviews: [
      {
        id: 'rev-03-a',
        reviewerName: 'حسام الدين راشد',
        reviewerLocation: 'التجمع الخامس، القاهرة',
        rating: 5,
        date: '٧ نوفمبر ٢٠٢٦',
        comment:
          'تعريجات خشب الزيتون خطيرة وملمسه ناعم جداً من غير أي ورنيش صناعي. بنستخدمه كل يوم للفاكهة على السفرة.',
      },
      {
        id: 'rev-03-b',
        reviewerName: 'سارة السعيد',
        reviewerLocation: 'الدقي، الجيزة',
        rating: 5,
        date: '١٥ أكتوبر ٢٠٢٦',
        comment:
          'تحفة فنية بجد؛ كل زاوية فيه شكلها مختلف. جبته هدية وعجب الكل جداً.',
      },
    ],
  },
  {
    id: 'ath-04',
    slug: 'hammered-brass-incense',
    name: 'مبخرة النحاس المطروق مع الصينية',
    category: 'metal_glass',
    categoryLabel: 'نحاس وزجاج',
    editionLabel: '٣٠ قطعة بس',
    price: 1650,
    artisan: 'محمود الدرب الأحمر',
    origin: 'القاهرة التاريخية',
    dimensions: 'الارتفاع ١٩ سم · الصينية ١٤ × ٢٠ سم',
    craftTime: '٨ أيام طرق وتشكيل يدوي',
    material: 'نحاس أصفر نقي مطروق بطبقة مطفية',
    shortDescription:
      'طقم مبخرة معماري من النحاس المطروق بالإيد ومعاه صينية مربعة بنفس اللمسة عشان يلم الرماد بشكل شيك.',
    story:
      'لوح النحاس بيتشكل بمئات الدقات الهادية بالمطرقة لحد ما يطلع بالشكل المتوازن ده، ويفضل محتفظ بأثر الدق اليدوي اللي بيعكس النور بنعومة.',
    image: '/src/assets/images/product_brass_incense_1795189893694.jpg',
    inStock: true,
    stockCount: 7,
    variants: [
      { id: 'v-brass-satin', label: 'نحاس مطفي مطروق', priceDelta: 0, swatchHex: '#A68B4C' },
      { id: 'v-brass-patina', label: 'نحاس معتق غامق', priceDelta: 200, swatchHex: '#5C5036' },
    ],
    reviews: [
      {
        id: 'rev-04-a',
        reviewerName: 'داليا خليل',
        reviewerLocation: 'مصر الجديدة، القاهرة',
        rating: 5,
        date: '٢٩ أكتوبر ٢٠٢٦',
        comment:
          'نقرة المطرقة على النحاس شكلها راقي أوي ومفيهاش لمعان مبالغ فيه، والصينية المربعة عملية جداً.',
      },
      {
        id: 'rev-04-b',
        reviewerName: 'عمر الشريف',
        reviewerLocation: 'المنصورة، الدقهلية',
        rating: 5,
        date: '٩ أكتوبر ٢٠٢٦',
        comment:
          'تصميم جديد ومختلف تماماً عن المباخر التقليدية. تقيلة وثابتة جداً على المكتب.',
      },
    ],
  },
  {
    id: 'ath-05',
    slug: 'speckled-basalt-cups',
    name: 'طقم فنجانين قهوة من البازلت',
    category: 'ceramics',
    categoryLabel: 'خزف وفخار',
    editionLabel: '٤٠ طقم بس',
    price: 890,
    artisan: 'سلمى الشاذلي',
    origin: 'ورشة الفسطاط، القاهرة',
    dimensions: 'الفنجان ١١٠ مل · الصينية قطر ٢١ سم',
    craftTime: '١٠ أيام شغل وتزجيج',
    material: 'طين خزفي مرقط مع صينية تقديم متطابقة',
    shortDescription:
      'فنجانين للقهوة والإسبريسو من غير ودن مع صينية دائرية متطابقة، بملمس رملي دافي يحفظ سخونة القهوة.',
    story:
      'متصممين على قد كف الإيد بالظبط، مع قاعدة سفلية سادة من الطين الخام عشان تحس بدفء الطين قصاد نعومة الطلاء اللي جوه.',
    image: '/src/assets/images/product_stoneware_cups_1795189891833.jpg',
    inStock: true,
    stockCount: 9,
    variants: [
      { id: 'v-cups-duo', label: 'فنجانين + الصينية', priceDelta: 0, swatchHex: '#64748B' },
      { id: 'v-cups-quad', label: '٤ فناجين + صينية كبيرة', priceDelta: 620, swatchHex: '#334155' },
    ],
    reviews: [
      {
        id: 'rev-05-a',
        reviewerName: 'زياد وجدي',
        reviewerLocation: 'جاردن سيتي، القاهرة',
        rating: 5,
        date: '١٠ نوفمبر ٢٠٢٦',
        comment:
          'تخانة الفنجان ممتازة بتحافظ على سخونة الإسبريسو ومبتلسعش الإيد. الصينية خلّت ركن القهوة في البيت شكله يجنن.',
      },
      {
        id: 'rev-05-b',
        reviewerName: 'ليلى حسن',
        reviewerLocation: 'كفر عبده، الإسكندرية',
        rating: 4,
        date: '٢٢ أكتوبر ٢٠٢٦',
        comment:
          'ملمس الفخار المرقط مريح أوي في المسكة، وناوية أطلب طقم تاني لما ييجي ضيوف.',
      },
    ],
  },
  {
    id: 'ath-06',
    slug: 'smoky-sapphire-carafe',
    name: 'شفشق زجاج منفوخ لون دخاني',
    category: 'metal_glass',
    categoryLabel: 'نحاس وزجاج',
    editionLabel: '١٥ قطعة بس',
    price: 1380,
    artisan: 'يوسف حلمي',
    origin: 'منشية ناصر، القاهرة',
    dimensions: 'السعة ٩٥٠ مل · الارتفاع ٢٤ سم',
    craftTime: 'نفخ حر وتبريد ٤٨ ساعة',
    material: 'زجاج معاد تدويره بلون أزرق دخاني طبيعي',
    shortDescription:
      'شفشق مية منفوخ يدوي من غير قوالب من زجاج معاد تدويره بلون كحلي دخاني شفاف وتموجات طبيعية.',
    story:
      'الزجاج بيتصهر على ١١٥٠ درجة ويتنفخ حر بالبؤ، فكل فقاعة صغيرة وكل تموجة في الإبريق بتخليه قطعة مميزة مش شبه التانية.',
    image: '/src/assets/images/product_blown_glass_1795189891874.jpg',
    inStock: true,
    stockCount: 3,
    variants: [
      { id: 'v-glass-smoke', label: 'دخاني نيلي ٩٥٠ مل', priceDelta: 0, swatchHex: '#3B4D63' },
      { id: 'v-glass-set', label: 'الشفشق مع كوبايتين شبهه', priceDelta: 540, swatchHex: '#1E293B' },
    ],
    reviews: [
      {
        id: 'rev-06-a',
        reviewerName: 'رنا جلال',
        reviewerLocation: 'المهندسين، الجيزة',
        rating: 5,
        date: '٤ نوفمبر ٢٠٢٦',
        comment:
          'اللون الدخاني مع الفقاعات الصغيرة بتاعة النفخ اليدوي بيعكس نور الشمس على السفرة بطريقة تجنن.',
      },
      {
        id: 'rev-06-b',
        reviewerName: 'كريم نصار',
        reviewerLocation: 'الرحاب، القاهرة',
        rating: 5,
        date: '١٦ أكتوبر ٢٠٢٦',
        comment:
          'طلبت الطقم مع الكوبايتين هدية لجواز صاحبي، والتغليف وصل سليم ومتأمن جداً.',
      },
    ],
  },
];

export const CRAFT_PRINCIPLES = [
  {
    index: '٠١.',
    title: 'شغل يدوي حر بعيد عن قوالب المصانع',
    description:
      'كل قطعة في دار أثر بتعدي على إيد الحرفي من أول الخامة لحد اللمسة الأخيرة، عشان كده كل قطعة ليها روح وبصمة متتكررش.',
  },
  {
    index: '٠٢.',
    title: 'خامات طبيعية من بلدنا وألوان نباتية',
    description:
      'بنشتغل بالطين الحجري المصري، خشب تقليم الشجر، الكتان الطبيعي، والزجاج المعاد تدويره من غير أي مواد صناعية مضرة.',
  },
  {
    index: '٠٣.',
    title: 'ترقيم خاص وشهادة أصالة مع كل طلب',
    description:
      'القطعة بتوصلك متغلفة بأمان ومعاها كارت ممضي باسم الفنان، رقمها في الإصدار المحدود، وتاريخ ما اتعملت.',
  },
];

export const GOVERNORATES = [
  'القاهرة',
  'الجيزة',
  'الإسكندرية',
  'الشيخ زايد / ٦ أكتوبر',
  'القاهرة الجديدة',
  'الدقهلية',
  'الشرقية',
  'الغربية',
  'الأقصر',
  'أسوان',
  'البحر الأحمر',
  'جنوب سيناء',
];
