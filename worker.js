// worker.js Cloudflare Worker

const COOKIES = [
  {
    cookie_name: 'Adventurer Cookie',
    primary_color: 'Brown',
    secondary_color: 'White',
    rarity: 'Rare',
    type: 'Ambush',
    position: 'Middle',
    skill_name: 'Rope Master',
    skill_cooldown: 12,
  },
  {
    cookie_name: 'Affogato Cookie',
    primary_color: 'Purple',
    secondary_color: 'Brown',
    rarity: 'Epic',
    type: 'Bomber',
    position: 'Middle',
    skill_name: 'Sweet Scheme',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Agar Agar Cookie',
    primary_color: 'Gray',
    secondary_color: 'Red',
    rarity: 'Epic',
    type: 'Ambush',
    position: 'Middle',
    skill_name: 'Ravenous Mirror',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Alchemist Cookie',
    primary_color: 'Purple',
    secondary_color: 'Brown',
    rarity: 'Rare',
    type: 'Bomber',
    position: 'Middle',
    skill_name: 'Unstable Formula',
    skill_cooldown: 16,
  },
  {
    cookie_name: 'Almond Cookie',
    primary_color: 'Brown',
    secondary_color: 'White',
    rarity: 'Epic',
    type: 'Support',
    position: 'Rear',
    skill_name: 'Almond Handcuffs',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Angel Cookie',
    primary_color: 'Yellow',
    secondary_color: 'White',
    rarity: 'Common',
    type: 'Healing',
    position: 'Rear',
    skill_name: 'Celestial Light',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Avocado Cookie',
    primary_color: 'Green',
    secondary_color: 'Brown',
    rarity: 'Rare',
    type: 'Defense',
    position: 'Front',
    skill_name: 'Battle Smithing',
    skill_cooldown: 13,
  },
  {
    cookie_name: 'Beet Cookie',
    primary_color: 'Pink',
    secondary_color: 'Green',
    rarity: 'Common',
    type: 'Ranged',
    position: 'Rear',
    skill_name: 'Hunters Sense',
    skill_cooldown: 12,
  },
  {
    cookie_name: 'Black Forest Cookie',
    primary_color: 'Brown',
    secondary_color: 'White',
    rarity: 'Epic',
    type: 'Charge',
    position: 'Front',
    skill_name: 'For the Creators!',
    skill_cooldown: 8,
  },
  {
    cookie_name: 'Black Lemonade Cookie',
    primary_color: 'Yellow',
    secondary_color: 'Black',
    rarity: 'Epic',
    type: 'Bomber',
    position: 'Middle',
    skill_name: 'Electrifying Rock!',
    skill_cooldown: 10,
  },
  {
    cookie_name: 'Black Pearl Cookie',
    primary_color: 'Black',
    secondary_color: 'White',
    rarity: 'Legendary',
    type: 'Ambush',
    position: 'Middle',
    skill_name: 'Duskglooms Sovereign',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Black Raisin Cookie',
    primary_color: 'Black',
    secondary_color: 'Purple',
    rarity: 'Epic',
    type: 'Ambush',
    position: 'Middle',
    skill_name: 'Shadow Watcher',
    skill_cooldown: 14,
  },
  {
    cookie_name: 'Black Sapphire Cookie',
    primary_color: 'Black',
    secondary_color: 'Purple',
    rarity: 'Epic',
    type: 'Support',
    position: 'Middle',
    skill_name: "It's Showtime",
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Blackberry Cookie',
    primary_color: 'Purple',
    secondary_color: 'Black',
    rarity: 'Rare',
    type: 'Magic',
    position: 'Rear',
    skill_name: 'Ghost Servants',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Blueberry Pie Cookie',
    primary_color: 'Blue',
    secondary_color: 'Brown',
    rarity: 'Epic',
    type: 'Magic',
    position: 'Middle',
    skill_name: 'Cursed Tome',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Burning Spice Cookie',
    primary_color: 'Red',
    secondary_color: 'Black',
    rarity: 'Beast',
    type: 'Charge',
    position: 'Front',
    skill_name: 'Tyrants Wrath',
    skill_cooldown: 9,
  },
  {
    cookie_name: 'Burnt Cheese Cookie',
    primary_color: 'Black',
    secondary_color: 'Brown',
    rarity: 'Epic',
    type: 'Charge',
    position: 'Front',
    skill_name: 'Keeper of the Gates',
    skill_cooldown: 10,
  },
  {
    cookie_name: 'Butter Roll Cookie',
    primary_color: 'White',
    secondary_color: 'Red',
    rarity: 'Epic',
    type: 'Charge',
    position: 'Front',
    skill_name: 'Dough Experiment',
    skill_cooldown: 12,
  },
  {
    cookie_name: 'Camellia Cookie',
    primary_color: 'Green',
    secondary_color: 'White',
    rarity: 'Super Epic',
    type: 'Charge',
    position: 'Front',
    skill_name: 'Battle Scene Painting',
    skill_cooldown: 13,
  },
  {
    cookie_name: 'Candy Apple Cookie',
    primary_color: 'Red',
    secondary_color: 'Black',
    rarity: 'Epic',
    type: 'Bomber',
    position: 'Middle',
    skill_name: 'Apple of My Eye!',
    skill_cooldown: 12,
  },
  {
    cookie_name: 'Candy Diver Cookie',
    primary_color: 'Red',
    secondary_color: 'Blue',
    rarity: 'Epic',
    type: 'Support',
    position: 'Rear',
    skill_name: 'Deep-sea Diver',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Capsaicin Cookie',
    primary_color: 'Orange',
    secondary_color: 'Black',
    rarity: 'Super Epic',
    type: 'Charge',
    position: 'Front',
    skill_name: 'Capsaicin Magma',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Captain Caviar Cookie',
    primary_color: 'Black',
    secondary_color: 'Yellow',
    rarity: 'Epic',
    type: 'Bomber',
    position: 'Middle',
    skill_name: 'Black Shark Torpedo',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Caramel Arrow Cookie',
    primary_color: 'Black',
    secondary_color: 'Brown',
    rarity: 'Epic',
    type: 'Ranged',
    position: 'Front',
    skill_name: 'Arrow of Resolution',
    skill_cooldown: 10,
  },
  {
    cookie_name: 'Caramel Choux Cookie',
    primary_color: 'Brown',
    secondary_color: 'Yellow',
    rarity: 'Epic',
    type: 'Support',
    position: 'Rear',
    skill_name: 'Ive Got Choux',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Carol Cookie',
    primary_color: 'Green',
    secondary_color: 'Brown',
    rarity: 'Epic',
    type: 'Healing',
    position: 'Rear',
    skill_name: 'Magic Songs',
    skill_cooldown: 16,
  },
  {
    cookie_name: 'Carrot Cookie',
    primary_color: 'Orange',
    secondary_color: 'Brown',
    rarity: 'Rare',
    type: 'Support',
    position: 'Middle',
    skill_name: 'Carrot Harvest',
    skill_cooldown: 19,
  },
  {
    cookie_name: 'Charcoal Cookie',
    primary_color: 'Black',
    secondary_color: 'Gray',
    rarity: 'Epic',
    type: 'Magic',
    position: 'Rear',
    skill_name: "Tombkeeper's Rite",
    skill_cooldown: 12,
  },
  {
    cookie_name: 'Cherry Blossom Cookie',
    primary_color: 'Pink',
    secondary_color: 'Brown',
    rarity: 'Epic',
    type: 'Ambush',
    position: 'Rear',
    skill_name: 'Cherry Blossom Rain',
    skill_cooldown: 17,
  },
  {
    cookie_name: 'Cherry Cookie',
    primary_color: 'Red',
    secondary_color: 'White',
    rarity: 'Rare',
    type: 'Bomber',
    position: 'Rear',
    skill_name: 'Huge Cherry Bomb',
    skill_cooldown: 16,
  },
  {
    cookie_name: 'Chess Choco Cookie',
    primary_color: 'White',
    secondary_color: 'Brown',
    rarity: 'Epic',
    type: 'Bomber',
    position: 'Rear',
    skill_name: 'Chess Time!',
    skill_cooldown: 14,
  },
  {
    cookie_name: 'Chili Pepper Cookie',
    primary_color: 'Red',
    secondary_color: 'Black',
    rarity: 'Epic',
    type: 'Ambush',
    position: 'Middle',
    skill_name: 'Cheap Shot',
    skill_cooldown: 12,
  },
  {
    cookie_name: 'Choco Drizzle Cookie',
    primary_color: 'Black',
    secondary_color: 'Brown',
    rarity: 'Epic',
    type: 'Ambush',
    position: 'Middle',
    skill_name: 'Choco Penumbra',
    skill_cooldown: 12,
  },
  {
    cookie_name: 'Clotted Cream Cookie',
    primary_color: 'Yellow',
    secondary_color: 'White',
    rarity: 'Super Epic',
    type: 'Magic',
    position: 'Middle',
    skill_name: 'Consuls Orders',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Cloud Haetae Cookie',
    primary_color: 'White',
    secondary_color: 'Brown',
    rarity: 'Epic',
    type: 'Defense',
    position: 'Front',
    skill_name: 'Haetae Charge',
    skill_cooldown: 11,
  },
  {
    cookie_name: 'Clover Cookie',
    primary_color: 'Green',
    secondary_color: 'White',
    rarity: 'Rare',
    type: 'Support',
    position: 'Rear',
    skill_name: 'Bards Song',
    skill_cooldown: 17,
  },
  {
    cookie_name: 'Cocoa Cookie',
    primary_color: 'White',
    secondary_color: 'Brown',
    rarity: 'Epic',
    type: 'Defense',
    position: 'Front',
    skill_name: 'Cocoa is Love',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Cotton Cookie',
    primary_color: 'White',
    secondary_color: 'Brown',
    rarity: 'Epic',
    type: 'Support',
    position: 'Rear',
    skill_name: 'A Warm Light',
    skill_cooldown: 17,
  },
  {
    cookie_name: 'Cream Ferret Cookie',
    primary_color: 'White',
    secondary_color: 'Yellow',
    rarity: 'Special',
    type: 'Support',
    position: 'Rear',
    skill_name: 'Snuggly Ferret',
    skill_cooldown: 18,
  },
  {
    cookie_name: 'Cream Puff Cookie',
    primary_color: 'Brown',
    secondary_color: 'Blue',
    rarity: 'Epic',
    type: 'Support',
    position: 'Rear',
    skill_name: 'Jellius Extremus!',
    skill_cooldown: 16,
  },
  {
    cookie_name: 'Cream Soda Cookie',
    primary_color: 'Blue',
    secondary_color: 'Pink',
    rarity: 'Epic',
    type: 'Charge',
    position: 'Front',
    skill_name: 'Cream Soda Blade',
    skill_cooldown: 14,
  },
  {
    cookie_name: 'Cream Unicorn Cookie',
    primary_color: 'White',
    secondary_color: 'Pink',
    rarity: 'Epic',
    type: 'Healing',
    position: 'Rear',
    skill_name: 'Midsummer Nights Dream',
    skill_cooldown: 17,
  },
  {
    cookie_name: 'Crimson Coral Cookie',
    primary_color: 'Red',
    secondary_color: 'Pink',
    rarity: 'Super Epic',
    type: 'Defense',
    position: 'Front',
    skill_name: 'Somber Affection',
    skill_cooldown: 12,
  },
  {
    cookie_name: 'Crunchy Chip Cookie',
    primary_color: 'White',
    secondary_color: 'Black',
    rarity: 'Epic',
    type: 'Charge',
    position: 'Front',
    skill_name: 'Wolf Squadron',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Crème Brûlée Cookie',
    primary_color: 'Yellow',
    secondary_color: 'Brown',
    rarity: 'Epic',
    type: 'Ranged',
    position: 'Rear',
    skill_name: 'Accelerando',
    skill_cooldown: 9,
  },
  {
    cookie_name: 'Custard Cookie III',
    primary_color: 'Brown',
    secondary_color: 'White',
    rarity: 'Rare',
    type: 'Healing',
    position: 'Rear',
    skill_name: 'Kings Favor',
    skill_cooldown: 16,
  },
  {
    cookie_name: 'Dark Cacao Cookie',
    primary_color: 'Black',
    secondary_color: 'Purple',
    rarity: 'Ancient',
    type: 'Charge',
    position: 'Front',
    skill_name: 'Solemn Judgment',
    skill_cooldown: 16,
  },
  {
    cookie_name: 'Dark Choco Cookie',
    primary_color: 'Black',
    secondary_color: 'Brown',
    rarity: 'Epic',
    type: 'Charge',
    position: 'Front',
    skill_name: 'Sword of Darkness',
    skill_cooldown: 13,
  },
  {
    cookie_name: 'Dark Enchantress Cookie',
    primary_color: 'Red',
    secondary_color: 'White',
    rarity: 'Witch',
    type: 'Magic',
    position: 'Middle',
    skill_name: 'Visions of Doom',
    skill_cooldown: 16,
  },
  {
    cookie_name: 'Devil Cookie',
    primary_color: 'Red',
    secondary_color: 'Black',
    rarity: 'Rare',
    type: 'Magic',
    position: 'Middle',
    skill_name: 'Devilish Rune',
    skill_cooldown: 18,
  },
  {
    cookie_name: 'Doughael Cookie',
    primary_color: 'White',
    secondary_color: 'Brown',
    rarity: 'Super Epic',
    type: 'Healing',
    position: 'Middle',
    skill_name: 'Consecrated Vow',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Eclair Cookie',
    primary_color: 'Green',
    secondary_color: 'White',
    rarity: 'Epic',
    type: 'Support',
    position: 'Middle',
    skill_name: 'Book of History',
    skill_cooldown: 16,
  },
  {
    cookie_name: 'Elder Faerie Cookie',
    primary_color: 'Gray',
    secondary_color: 'White',
    rarity: 'Super Epic',
    type: 'Defense',
    position: 'Front',
    skill_name: 'Guardians Valor',
    skill_cooldown: 12,
  },
  {
    cookie_name: 'Elphaba Cookie',
    primary_color: 'Black',
    secondary_color: 'Green',
    rarity: 'Special',
    type: 'Magic',
    position: 'Rear',
    skill_name: 'Unlimited!',
    skill_cooldown: 14,
  },
  {
    cookie_name: 'Espresso Cookie',
    primary_color: 'Black',
    secondary_color: 'Brown',
    rarity: 'Epic',
    type: 'Magic',
    position: 'Middle',
    skill_name: 'Grinding',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Eternal Sugar Cookie',
    primary_color: 'Pink',
    secondary_color: 'Purple',
    rarity: 'Beast',
    type: 'Bomber',
    position: 'Middle',
    skill_name: 'Eternal Enchantment',
    skill_cooldown: 12,
  },
  {
    cookie_name: 'Fettuccine Cookie',
    primary_color: 'Yellow',
    secondary_color: 'Brown',
    rarity: 'Epic',
    type: 'Defense',
    position: 'Front',
    skill_name: 'Unstable Fettuccine',
    skill_cooldown: 12,
  },
  {
    cookie_name: 'Fig Cookie',
    primary_color: 'Purple',
    secondary_color: 'Brown',
    rarity: 'Epic',
    type: 'Support',
    position: 'Middle',
    skill_name: 'Jelly Horn',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Financier Cookie',
    primary_color: 'Yellow',
    secondary_color: 'White',
    rarity: 'Epic',
    type: 'Defense',
    position: 'Front',
    skill_name: 'Paladin Protection',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Fire Spirit Cookie',
    primary_color: 'Red',
    secondary_color: 'Yellow',
    rarity: 'Legendary',
    type: 'Magic',
    position: 'Rear',
    skill_name: 'Ever-Burning Flames',
    skill_cooldown: 14,
  },
  {
    cookie_name: 'Frilled Jellyfish Cookie',
    primary_color: 'White',
    secondary_color: 'Blue',
    rarity: 'Epic',
    type: 'Support',
    position: 'Middle',
    skill_name: 'Frilled Snare',
    skill_cooldown: 12,
  },
  {
    cookie_name: 'Frost Queen Cookie',
    primary_color: 'White',
    secondary_color: 'Blue',
    rarity: 'Legendary',
    type: 'Magic',
    position: 'Middle',
    skill_name: 'Freezing Squall',
    skill_cooldown: 18,
  },
  {
    cookie_name: 'GingerBrave',
    primary_color: 'Brown',
    secondary_color: 'Blue',
    rarity: 'Common',
    type: 'Charge',
    position: 'Front',
    skill_name: 'Brave Dash',
    skill_cooldown: 8,
  },
  {
    cookie_name: 'Glinda Cookie',
    primary_color: 'Pink',
    secondary_color: 'Yellow',
    rarity: 'Special',
    type: 'Magic',
    position: 'Rear',
    skill_name: 'Dazzling Presence',
    skill_cooldown: 14,
  },
  {
    cookie_name: 'Golden Cheese Cookie',
    primary_color: 'Yellow',
    secondary_color: 'Brown',
    rarity: 'Ancient',
    type: 'Ranged',
    position: 'Middle',
    skill_name: 'Brilliance of the Absolute',
    skill_cooldown: 13,
  },
  {
    cookie_name: 'Golden Osmanthus Cookie',
    primary_color: 'Yellow',
    secondary_color: 'White',
    rarity: 'Epic',
    type: 'Bomber',
    position: 'Middle',
    skill_name: 'Incense of Affection',
    skill_cooldown: 13,
  },
  {
    cookie_name: 'Grapefruit Cookie',
    primary_color: 'Red',
    secondary_color: 'Green',
    rarity: 'Epic',
    type: 'Charge',
    position: 'Front',
    skill_name: 'Catch Me If You Can!',
    skill_cooldown: 13,
  },
  {
    cookie_name: 'Green Tea Mousse Cookie',
    primary_color: 'Green',
    secondary_color: 'Brown',
    rarity: 'Epic',
    type: 'Defense',
    position: 'Front',
    skill_name: 'Mousse Shield',
    skill_cooldown: 11,
  },
  {
    cookie_name: 'Gumball Cookie',
    primary_color: 'Blue',
    secondary_color: 'Red',
    rarity: 'Rare',
    type: 'Bomber',
    position: 'Rear',
    skill_name: 'Art-illery',
    skill_cooldown: 0,
  },
  {
    cookie_name: 'Herb Cookie',
    primary_color: 'Green',
    secondary_color: 'Brown',
    rarity: 'Epic',
    type: 'Healing',
    position: 'Rear',
    skill_name: 'Sunny Garden',
    skill_cooldown: 17,
  },
  {
    cookie_name: 'Hollyberry Cookie',
    primary_color: 'Pink',
    secondary_color: 'Red',
    rarity: 'Ancient',
    type: 'Defense',
    position: 'Front',
    skill_name: 'Oath on the Shield',
    skill_cooldown: 18,
  },
  {
    cookie_name: 'Icicle Yeti Cookie',
    primary_color: 'Blue',
    secondary_color: 'White',
    rarity: 'Special',
    type: 'Healing',
    position: 'Front',
    skill_name: 'Lets Be Friends!',
    skill_cooldown: 12,
  },
  {
    cookie_name: 'Jagae Cookie',
    primary_color: 'Purple',
    secondary_color: 'White',
    rarity: 'Epic',
    type: 'Support',
    position: 'Front',
    skill_name: 'Iridescent Storm',
    skill_cooldown: 13,
  },
  {
    cookie_name: 'Knight Cookie',
    primary_color: 'White',
    secondary_color: 'Blue',
    rarity: 'Rare',
    type: 'Defense',
    position: 'Front',
    skill_name: 'Calvary Charge',
    skill_cooldown: 13,
  },
  {
    cookie_name: 'Kouign-Amann Cookie',
    primary_color: 'Pink',
    secondary_color: 'Yellow',
    rarity: 'Epic',
    type: 'Defense',
    position: 'Front',
    skill_name: 'Paladins Way',
    skill_cooldown: 12,
  },
  {
    cookie_name: 'Kumiho Cookie',
    primary_color: 'Red',
    secondary_color: 'Blue',
    rarity: 'Epic',
    type: 'Charge',
    position: 'Front',
    skill_name: 'Somersault',
    skill_cooldown: 14,
  },
  {
    cookie_name: 'Latte Cookie',
    primary_color: 'Brown',
    secondary_color: 'White',
    rarity: 'Epic',
    type: 'Magic',
    position: 'Middle',
    skill_name: 'Care for a Latte?',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Lemon Cookie',
    primary_color: 'Yellow',
    secondary_color: 'Blue',
    rarity: 'Epic',
    type: 'Ambush',
    position: 'Middle',
    skill_name: 'Lightning Dash',
    skill_cooldown: 12,
  },
  {
    cookie_name: 'Licorice Cookie',
    primary_color: 'Black',
    secondary_color: 'White',
    rarity: 'Epic',
    type: 'Magic',
    position: 'Middle',
    skill_name: 'Licorice Servants',
    skill_cooldown: 14,
  },
  {
    cookie_name: 'Lilac Cookie',
    primary_color: 'Purple',
    secondary_color: 'White',
    rarity: 'Epic',
    type: 'Support',
    position: 'Middle',
    skill_name: 'Chakram Throw',
    skill_cooldown: 13,
  },
  {
    cookie_name: 'Lime Cookie',
    primary_color: 'Green',
    secondary_color: 'Brown',
    rarity: 'Epic',
    type: 'Support',
    position: 'Rear',
    skill_name: 'Beach Ball Surprise',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Linzer Cookie',
    primary_color: 'Red',
    secondary_color: 'Brown',
    rarity: 'Epic',
    type: 'Support',
    position: 'Rear',
    skill_name: 'The Culprit... is YOU!',
    skill_cooldown: 16,
  },
  {
    cookie_name: 'Macaron Cookie',
    primary_color: 'Red',
    secondary_color: 'White',
    rarity: 'Epic',
    type: 'Magic',
    position: 'Middle',
    skill_name: 'Mighty Macaron Parade',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Madeleine Cookie',
    primary_color: 'White',
    secondary_color: 'Blue',
    rarity: 'Epic',
    type: 'Defense',
    position: 'Front',
    skill_name: 'Commanders Honor',
    skill_cooldown: 13,
  },
  {
    cookie_name: 'Mala Sauce Cookie',
    primary_color: 'Red',
    secondary_color: 'Gray',
    rarity: 'Epic',
    type: 'Charge',
    position: 'Front',
    skill_name: 'Spicy Mala Strike',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Mango Cookie',
    primary_color: 'Orange',
    secondary_color: 'Green',
    rarity: 'Epic',
    type: 'Magic',
    position: 'Middle',
    skill_name: 'Mango Juice Wave',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Manju Cookie',
    primary_color: 'Brown',
    secondary_color: 'Red',
    rarity: 'Epic',
    type: 'Ambush',
    position: 'Rear',
    skill_name: 'Flash Strike',
    skill_cooldown: 17,
  },
  {
    cookie_name: 'Marshmallow Bunny Cookie',
    primary_color: 'Pink',
    secondary_color: 'Blue',
    rarity: 'Special',
    type: 'Support',
    position: 'Rear',
    skill_name: "Let's Go Bunny Tunnel!",
    skill_cooldown: 18,
  },
  {
    cookie_name: 'Matcha Cookie',
    primary_color: 'Green',
    secondary_color: 'Brown',
    rarity: 'Epic',
    type: 'Magic',
    position: 'Middle',
    skill_name: 'Sinister Scheme',
    skill_cooldown: 12,
  },
  {
    cookie_name: 'Menthol Cookie',
    primary_color: 'Blue',
    secondary_color: 'White',
    rarity: 'Epic',
    type: 'Bomber',
    position: 'Rear',
    skill_name: 'Menthol Censer',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Mercurial Knight Cookie',
    primary_color: 'Gray',
    secondary_color: 'White',
    rarity: 'Epic',
    type: 'Charge',
    position: 'Front',
    skill_name: 'Mercury Knights Oath',
    skill_cooldown: 11,
  },
  {
    cookie_name: 'Milk Cookie',
    primary_color: 'White',
    secondary_color: 'Blue',
    rarity: 'Epic',
    type: 'Defense',
    position: 'Front',
    skill_name: 'Noble Sacrifice',
    skill_cooldown: 12,
  },
  {
    cookie_name: 'Milky Way Cookie',
    primary_color: 'Black',
    secondary_color: 'White',
    rarity: 'Epic',
    type: 'Charge',
    position: 'Front',
    skill_name: 'Sugarcloud Express',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Millenial Tree Cookie',
    primary_color: 'Brown',
    secondary_color: 'Green',
    rarity: 'Legendary',
    type: 'Support',
    position: 'Front',
    skill_name: 'Millenial Tree',
    skill_cooldown: 8,
  },
  {
    cookie_name: 'Mint Choco Cookie',
    primary_color: 'Blue',
    secondary_color: 'White',
    rarity: 'Epic',
    type: 'Support',
    position: 'Rear',
    skill_name: 'Battlefield Symphony',
    skill_cooldown: 16,
  },
  {
    cookie_name: 'Mold Dough Cookie',
    primary_color: 'Black',
    secondary_color: 'Brown',
    rarity: 'Epic',
    type: 'Charge',
    position: 'Front',
    skill_name: 'Order: Eliminate',
    skill_cooldown: 10,
  },
  {
    cookie_name: 'Moon Rabbit Cookie',
    primary_color: 'White',
    secondary_color: 'Pink',
    rarity: 'Epic',
    type: 'Defense',
    position: 'Front',
    skill_name: 'Giant Rice Cake Bunny',
    skill_cooldown: 14,
  },
  {
    cookie_name: 'Moonlight Cookie',
    primary_color: 'Blue',
    secondary_color: 'Black',
    rarity: 'Legendary',
    type: 'Magic',
    position: 'Middle',
    skill_name: 'Dream of the Night Sky',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Mozzarella Cookie',
    primary_color: 'Yellow',
    secondary_color: 'Brown',
    rarity: 'Epic',
    type: 'Magic',
    position: 'Middle',
    skill_name: 'Bat Attack',
    skill_cooldown: 11,
  },
  {
    cookie_name: 'Muscle Cookie',
    primary_color: 'Black',
    secondary_color: 'Brown',
    rarity: 'Common',
    type: 'Charge',
    position: 'Front',
    skill_name: 'Muscle King Power',
    skill_cooldown: 10,
  },
  {
    cookie_name: 'Mystic Flour Cookie',
    primary_color: 'White',
    secondary_color: 'Brown',
    rarity: 'Beast',
    type: 'Healing',
    position: 'Rear',
    skill_name: 'Whispers of Apathy',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Ninja Cookie',
    primary_color: 'Blue',
    secondary_color: 'Brown',
    rarity: 'Common',
    type: 'Ambush',
    position: 'Middle',
    skill_name: 'Swift Strike',
    skill_cooldown: 11,
  },
  {
    cookie_name: 'Nutmeg Tiger Cookie',
    primary_color: 'Red',
    secondary_color: 'Brown',
    rarity: 'Epic',
    type: 'Support',
    position: 'Front',
    skill_name: 'The Great General',
    skill_cooldown: 12,
  },
  {
    cookie_name: 'Okchun Cookie',
    primary_color: 'White',
    secondary_color: 'Red',
    rarity: 'Epic',
    type: 'Healing',
    position: 'Middle',
    skill_name: 'Okchun Pouch',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Olive Cookie',
    primary_color: 'Green',
    secondary_color: 'Brown',
    rarity: 'Epic',
    type: 'Support',
    position: 'Rear',
    skill_name: 'Bat Attack',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Onion Cookie',
    primary_color: 'Purple',
    secondary_color: 'White',
    rarity: 'Rare',
    type: 'Support',
    position: 'Middle',
    skill_name: 'Unstoppable Tears',
    skill_cooldown: 19,
  },
  {
    cookie_name: 'Orange Cookie',
    primary_color: 'Orange',
    secondary_color: 'Brown',
    rarity: 'Epic',
    type: 'Magic',
    position: 'Rear',
    skill_name: 'Juicy Serve!',
    skill_cooldown: 12,
  },
  {
    cookie_name: 'Oyster Cookie',
    primary_color: 'White',
    secondary_color: 'Gray',
    rarity: 'Super Epic',
    type: 'Support',
    position: 'Rear',
    skill_name: 'Might of Oyster House',
    skill_cooldown: 17,
  },
  {
    cookie_name: 'Pancake Cookie',
    primary_color: 'Brown',
    secondary_color: 'White',
    rarity: 'Rare',
    type: 'Ambush',
    position: 'Rear',
    skill_name: 'Take an Acorn!',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Parfait Cookie',
    primary_color: 'White',
    secondary_color: 'Pink',
    rarity: 'Epic',
    type: 'Support',
    position: 'Rear',
    skill_name: 'Para-Paru-Parfait!',
    skill_cooldown: 17,
  },
  {
    cookie_name: 'Pastry Cookie',
    primary_color: 'White',
    secondary_color: 'Purple',
    rarity: 'Epic',
    type: 'Ranged',
    position: 'Rear',
    skill_name: 'Battle Prayer',
    skill_cooldown: 13,
  },
  {
    cookie_name: 'Pavlova Cookie',
    primary_color: 'Pink',
    secondary_color: 'Red',
    rarity: 'Epic',
    type: 'Ranged',
    position: 'Rear',
    skill_name: 'Heart-Piercing Arrow',
    skill_cooldown: 6,
  },
  {
    cookie_name: 'Peach Blossom Cookie',
    primary_color: 'Pink',
    secondary_color: 'White',
    rarity: 'Epic',
    type: 'Support',
    position: 'Middle',
    skill_name: 'Heavenly Fruit',
    skill_cooldown: 12,
  },
  {
    cookie_name: 'Peppermint Cookie',
    primary_color: 'Blue',
    secondary_color: 'White',
    rarity: 'Epic',
    type: 'Support',
    position: 'Rear',
    skill_name: 'Freshness of the Sea',
    skill_cooldown: 17,
  },
  {
    cookie_name: 'Pinecone Cookie',
    primary_color: 'Brown',
    secondary_color: 'Green',
    rarity: 'Epic',
    type: 'Bomber',
    position: 'Front',
    skill_name: 'Pinecone Bomb',
    skill_cooldown: 12,
  },
  {
    cookie_name: 'Pitaya Dragon Cookie',
    primary_color: 'Red',
    secondary_color: 'White',
    rarity: 'Dragon',
    type: 'Charge',
    position: 'Front',
    skill_name: 'Draconic Bladestorm',
    skill_cooldown: 13,
  },
  {
    cookie_name: 'Poison Mushroom Cookie',
    primary_color: 'Purple',
    secondary_color: 'Brown',
    rarity: 'Epic',
    type: 'Bomber',
    position: 'Middle',
    skill_name: 'Poison Cloud',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Pom-pom Dough Cookie',
    primary_color: 'White',
    secondary_color: 'Green',
    rarity: 'Epic',
    type: 'Support',
    position: 'Middle',
    skill_name: 'Pom-pom Spores!',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Pomegranate Cookie',
    primary_color: 'Red',
    secondary_color: 'Green',
    rarity: 'Epic',
    type: 'Support',
    position: 'Middle',
    skill_name: 'Pomegranate Magic',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Princess Cookie',
    primary_color: 'Pink',
    secondary_color: 'White',
    rarity: 'Rare',
    type: 'Charge',
    position: 'Front',
    skill_name: 'Royal Swing',
    skill_cooldown: 13,
  },
  {
    cookie_name: 'Prophet Cookie',
    primary_color: 'Brown',
    secondary_color: 'Purple',
    rarity: 'Epic',
    type: 'Support',
    position: 'Rear',
    skill_name: 'Seven Prophecies',
    skill_cooldown: 19,
  },
  {
    cookie_name: 'Prune Juice Cookie',
    primary_color: 'Purple',
    secondary_color: 'Black',
    rarity: 'Epic',
    type: 'Bomber',
    position: 'Middle',
    skill_name: 'Prune Juice Potion',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Pudding à la Mode Cookie',
    primary_color: 'White',
    secondary_color: 'Brown',
    rarity: 'Epic',
    type: 'Bomber',
    position: 'Rear',
    skill_name: 'Plasma Cannon',
    skill_cooldown: 11,
  },
  {
    cookie_name: 'Pumpkin Pie Cookie',
    primary_color: 'Orange',
    secondary_color: 'Black',
    rarity: 'Epic',
    type: 'Magic',
    position: 'Middle',
    skill_name: 'Pompon help!',
    skill_cooldown: 18,
  },
  {
    cookie_name: 'Pure Vanilla Cookie',
    primary_color: 'Yellow',
    secondary_color: 'White',
    rarity: 'Ancient',
    type: 'Healing',
    position: 'Rear',
    skill_name: 'Love & Peace',
    skill_cooldown: 19,
  },
  {
    cookie_name: 'Purple Yam Cookie',
    primary_color: 'Purple',
    secondary_color: 'Pink',
    rarity: 'Epic',
    type: 'Charge',
    position: 'Front',
    skill_name: 'Purple Tornado',
    skill_cooldown: 12,
  },
  {
    cookie_name: 'Raspberry Cookie',
    primary_color: 'Pink',
    secondary_color: 'White',
    rarity: 'Epic',
    type: 'Charge',
    position: 'Front',
    skill_name: 'Raspberry Reprise',
    skill_cooldown: 14,
  },
  {
    cookie_name: 'Rebel Cookie',
    primary_color: 'Blue',
    secondary_color: 'White',
    rarity: 'Epic',
    type: 'Ambush',
    position: 'Front',
    skill_name: 'Here There Everywhere!',
    skill_cooldown: 13,
  },
  {
    cookie_name: 'Red Osmanthus Cookie',
    primary_color: 'Red',
    secondary_color: 'White',
    rarity: 'Epic',
    type: 'Ranged',
    position: 'Middle',
    skill_name: 'The Pipas Song',
    skill_cooldown: 10,
  },
  {
    cookie_name: 'Red Velvet Cookie',
    primary_color: 'Red',
    secondary_color: 'White',
    rarity: 'Epic',
    type: 'Charge',
    position: 'Front',
    skill_name: 'Crimson Hand',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Rockstar Cookie',
    primary_color: 'Red',
    secondary_color: 'Gray',
    rarity: 'Epic',
    type: 'Healing',
    position: 'Middle',
    skill_name: 'Legend of Rock',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Royal Margarine Cookie',
    primary_color: 'Brown',
    secondary_color: 'White',
    rarity: 'Epic',
    type: 'Ambush',
    position: 'Middle',
    skill_name: 'Buttercream Blast',
    skill_cooldown: 12,
  },
  {
    cookie_name: 'Rye Cookie',
    primary_color: 'Brown',
    secondary_color: 'Red',
    rarity: 'Epic',
    type: 'Ranged',
    position: 'Rear',
    skill_name: 'Final Showdown',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Salt Cellar Cookie',
    primary_color: 'White',
    secondary_color: 'Gray',
    rarity: 'Epic',
    type: 'Defense',
    position: 'Front',
    skill_name: 'Knight of Solidarity',
    skill_cooldown: 14,
  },
  {
    cookie_name: 'Schwarzwälder',
    primary_color: 'Brown',
    secondary_color: 'Red',
    rarity: 'Epic',
    type: 'Charge',
    position: 'Front',
    skill_name: 'Choco Chip Hammer',
    skill_cooldown: 12,
  },
  {
    cookie_name: 'Sea Fairy Cookie',
    primary_color: 'Blue',
    secondary_color: 'White',
    rarity: 'Legendary',
    type: 'Bomber',
    position: 'Middle',
    skill_name: 'Soaring Compassion',
    skill_cooldown: 17,
  },
  {
    cookie_name: 'Seltzer Cookie',
    primary_color: 'White',
    secondary_color: 'Blue',
    rarity: 'Epic',
    type: 'Support',
    position: 'Rear',
    skill_name: 'Bubble Rain',
    skill_cooldown: 12,
  },
  {
    cookie_name: 'Shadow Milk Cookie',
    primary_color: 'Blue',
    secondary_color: 'Black',
    rarity: 'Beast',
    type: 'Magic',
    position: 'Middle',
    skill_name: 'Act 1: Lies',
    skill_cooldown: 11,
  },
  {
    cookie_name: 'Sherbet Cookie',
    primary_color: 'White',
    secondary_color: 'Blue',
    rarity: 'Super Epic',
    type: 'Ranged',
    position: 'Middle',
    skill_name: 'Frost Shards',
    skill_cooldown: 13,
  },
  {
    cookie_name: 'Shining Glitter Cookie',
    primary_color: 'Pink',
    secondary_color: 'Black',
    rarity: 'Super Epic',
    type: 'Magic',
    position: 'Middle',
    skill_name: 'All Eyes on the Stage!',
    skill_cooldown: 12,
  },
  {
    cookie_name: 'Silent Salt Cookie',
    primary_color: 'Black',
    secondary_color: 'Gray',
    rarity: 'Beast',
    type: 'Ambush',
    position: 'Front',
    skill_name: 'End of Silence',
    skill_cooldown: 14,
  },
  {
    cookie_name: 'Silverbell Cookie',
    primary_color: 'White',
    secondary_color: 'Gray',
    rarity: 'Epic',
    type: 'Support',
    position: 'Rear',
    skill_name: 'Gleeful Chime',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Smoked Cheese Cookie',
    primary_color: 'Red',
    secondary_color: 'Yellow',
    rarity: 'Epic',
    type: 'Magic',
    position: 'Rear',
    skill_name: 'Get Smoked!',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Snapdragon Cookie',
    primary_color: 'Pink',
    secondary_color: 'White',
    rarity: 'Special',
    type: 'Support',
    position: 'Rear',
    skill_name: 'Arcane Blossom',
    skill_cooldown: 17,
  },
  {
    cookie_name: 'Snow Sugar Cookie',
    primary_color: 'Blue',
    secondary_color: 'White',
    rarity: 'Epic',
    type: 'Magic',
    position: 'Middle',
    skill_name: 'Blizzard',
    skill_cooldown: 20,
  },
  {
    cookie_name: 'Sonic Cookie',
    primary_color: 'Blue',
    secondary_color: 'White',
    rarity: 'Special',
    type: 'Ambush',
    position: 'Middle',
    skill_name: 'Sonics Spin Dash',
    skill_cooldown: 16,
  },
  {
    cookie_name: 'Sorbet Shark Cookie',
    primary_color: 'Brown',
    secondary_color: 'Blue',
    rarity: 'Epic',
    type: 'Ambush',
    position: 'Middle',
    skill_name: 'Shark Splash',
    skill_cooldown: 17,
  },
  {
    cookie_name: 'Space Doughnut',
    primary_color: 'Pink',
    secondary_color: 'Brown',
    rarity: 'Epic',
    type: 'Charge',
    position: 'Front',
    skill_name: 'Doughnut Beam',
    skill_cooldown: 12,
  },
  {
    cookie_name: 'Sparkling Cookie',
    primary_color: 'Yellow',
    secondary_color: 'Black',
    rarity: 'Epic',
    type: 'Healing',
    position: 'Rear',
    skill_name: 'Sparkling Cocktail',
    skill_cooldown: 13,
  },
  {
    cookie_name: 'Squid Ink Cookie',
    primary_color: 'Black',
    secondary_color: 'Blue',
    rarity: 'Epic',
    type: 'Magic',
    position: 'Middle',
    skill_name: 'Ink Tentacle Slap',
    skill_cooldown: 16,
  },
  {
    cookie_name: 'Star Coral Cookie',
    primary_color: 'Black',
    secondary_color: 'Blue',
    rarity: 'Epic',
    type: 'Support',
    position: 'Rear',
    skill_name: 'Twinkling Coral',
    skill_cooldown: 14,
  },
  {
    cookie_name: 'Stardust Cookie',
    primary_color: 'Blue',
    secondary_color: 'Black',
    rarity: 'Super Epic',
    type: 'Ambush',
    position: 'Middle',
    skill_name: 'Wrath of the Stars',
    skill_cooldown: 13,
  },
  {
    cookie_name: 'Stormbringer Cookie',
    primary_color: 'Yellow',
    secondary_color: 'Black',
    rarity: 'Legendary',
    type: 'Charge',
    position: 'Front',
    skill_name: 'Lightning Blitzstorm',
    skill_cooldown: 13,
  },
  {
    cookie_name: 'Strawberry Cookie',
    primary_color: 'Pink',
    secondary_color: 'Brown',
    rarity: 'Common',
    type: 'Defense',
    position: 'Front',
    skill_name: 'Dont Come Near!',
    skill_cooldown: 10,
  },
  {
    cookie_name: 'Strawberry Crepe Cookie',
    primary_color: 'Pink',
    secondary_color: 'Brown',
    rarity: 'Epic',
    type: 'Defense',
    position: 'Front',
    skill_name: 'Crepe Thrust',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Street Urchin Cookie',
    primary_color: 'Black',
    secondary_color: 'Brown',
    rarity: 'Epic',
    type: 'Bomber',
    position: 'Middle',
    skill_name: 'Ride or Crumble',
    skill_cooldown: 12,
  },
  {
    cookie_name: 'Sugarfly Cookie',
    primary_color: 'Yellow',
    secondary_color: 'Blue',
    rarity: 'Epic',
    type: 'Support',
    position: 'Rear',
    skill_name: 'Butterflys Whisper',
    skill_cooldown: 6,
  },
  {
    cookie_name: 'Tails Cookie',
    primary_color: 'Orange',
    secondary_color: 'White',
    rarity: 'Special',
    type: 'Ambush',
    position: 'Middle',
    skill_name: 'Tails Spin Dash',
    skill_cooldown: 17,
  },
  {
    cookie_name: 'Tarte Tatin Cookie',
    primary_color: 'Red',
    secondary_color: 'Gray',
    rarity: 'Epic',
    type: 'Ranged',
    position: 'Rear',
    skill_name: 'Cannonade',
    skill_cooldown: 12,
  },
  {
    cookie_name: 'Tea Knight Cookie',
    primary_color: 'Gray',
    secondary_color: 'Blue',
    rarity: 'Epic',
    type: 'Charge',
    position: 'Front',
    skill_name: 'Battlemaster',
    skill_cooldown: 18,
  },
  {
    cookie_name: 'Tiger Lily Cookie',
    primary_color: 'Blue',
    secondary_color: 'Orange',
    rarity: 'Epic',
    type: 'Ranged',
    position: 'Rear',
    skill_name: 'Tiger Rider',
    skill_cooldown: 13,
  },
  {
    cookie_name: 'Twizzly Gummy Cookie',
    primary_color: 'Blue',
    secondary_color: 'Pink',
    rarity: 'Epic',
    type: 'Ranged',
    position: 'Rear',
    skill_name: 'Twizzly Beam',
    skill_cooldown: 16,
  },
  {
    cookie_name: 'Vampire Cookie',
    primary_color: 'Red',
    secondary_color: 'Black',
    rarity: 'Epic',
    type: 'Ambush',
    position: 'Rear',
    skill_name: 'Vampirism',
    skill_cooldown: 13,
  },
  {
    cookie_name: 'Venom Dough Cookie',
    primary_color: 'White',
    secondary_color: 'Purple',
    rarity: 'Super Epic',
    type: 'Bomber',
    position: 'Rear',
    skill_name: 'Mind Venom',
    skill_cooldown: 14,
  },
  {
    cookie_name: 'Wedding Cake Cookie',
    primary_color: 'Pink',
    secondary_color: 'White',
    rarity: 'Epic',
    type: 'Magic',
    position: 'Middle',
    skill_name: 'Anything for the Bride!',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Werewolf Cookie',
    primary_color: 'Gray',
    secondary_color: 'White',
    rarity: 'Epic',
    type: 'Charge',
    position: 'Front',
    skill_name: 'Transformation',
    skill_cooldown: 11,
  },
  {
    cookie_name: 'White Lily Cookie',
    primary_color: 'Green',
    secondary_color: 'White',
    rarity: 'Ancient',
    type: 'Bomber',
    position: 'Middle',
    skill_name: 'Lily Bud',
    skill_cooldown: 15,
  },
  {
    cookie_name: 'Wildberry Cookie',
    primary_color: 'White',
    secondary_color: 'Red',
    rarity: 'Epic',
    type: 'Defense',
    position: 'Front',
    skill_name: 'Wild Punch',
    skill_cooldown: 10,
  },
  {
    cookie_name: 'Wind Archer Cookie',
    primary_color: 'Green',
    secondary_color: 'White',
    rarity: 'Legendary',
    type: 'Ranged',
    position: 'Rear',
    skill_name: 'Last Wind',
    skill_cooldown: 6,
  },
  {
    cookie_name: 'Wizard Cookie',
    primary_color: 'Blue',
    secondary_color: 'White',
    rarity: 'Common',
    type: 'Magic',
    position: 'Middle',
    skill_name: 'Magic Storm',
    skill_cooldown: 13,
  },
];

// ─────────────────────────────────────────
// DAILY TARGET — server-side only
// COOKIE_SECRET is an env variable set in
// the Cloudflare dashboard. Nobody can see it.
// ─────────────────────────────────────────
async function getDailyTarget(secret) {
  const now = new Date();
  const dateStr = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;
  const msgBuffer = new TextEncoder().encode(dateStr + secret);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashInt = hashArray.slice(0, 4).reduce((acc, b) => (acc * 256 + b) >>> 0, 0);
  return COOKIES[hashInt % COOKIES.length];
}

// Game 2 target — different cookie, uses a different hash offset
async function getDailyTarget2(secret) {
  const now = new Date();
  const dateStr = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}-skill`;
  const msgBuffer = new TextEncoder().encode(dateStr + secret);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashInt = hashArray.slice(0, 4).reduce((acc, b) => (acc * 256 + b) >>> 0, 0);
  return COOKIES[hashInt % COOKIES.length];
}

// Game 3 target — silhouette guesser
async function getDailyTarget3(secret) {
  const now = new Date();
  const dateStr = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}-silhouette`;
  const msgBuffer = new TextEncoder().encode(dateStr + secret);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashInt = hashArray.slice(0, 4).reduce((acc, b) => (acc * 256 + b) >>> 0, 0);
  return COOKIES[hashInt % COOKIES.length];
}

// ─────────────────────────────────────────
// CORS HEADERS
// ─────────────────────────────────────────
const ALLOWED_ORIGINS = new Set(['https://cookiedle.nappi.work']);

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.has(origin);
  return {
    'Access-Control-Allow-Origin': allowed ? origin : 'https://cookiedle.nappi.work',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function jsonResponse(data, status = 200, origin = '') {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...corsHeaders(origin),
    },
  });
}

// ─────────────────────────────────────────
// EVALUATE A GUESS AGAINST TARGET
// Returns trait results without revealing target
// ─────────────────────────────────────────
const cmpI = (a, b) => a.toLowerCase() === b.toLowerCase();

function colorResult(guess, primary, secondary) {
  if (cmpI(guess, primary)) return 'correct';
  if (cmpI(guess, secondary)) return 'partial';
  return 'wrong';
}

function evaluateGuess(guess, target) {
  return {
    cookie_name: guess.cookie_name,
    primary_color: colorResult(guess.primary_color, target.primary_color, target.secondary_color),
    secondary_color: colorResult(
      guess.secondary_color,
      target.secondary_color,
      target.primary_color
    ),
    rarity: cmpI(guess.rarity, target.rarity) ? 'correct' : 'wrong',
    type: cmpI(guess.type, target.type) ? 'correct' : 'wrong',
    position: cmpI(guess.position, target.position) ? 'correct' : 'wrong',
    correct: cmpI(guess.cookie_name, target.cookie_name),
  };
}

// ─────────────────────────────────────────
// HMAC HELPERS — for unlimited mode tokens
// Token = HMAC-SHA256(cookieName|timestamp, COOKIE_SECRET)
// Tokens expire after 2 hours.
// Client holds the token, never the name.
// ─────────────────────────────────────────
const TOKEN_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const hmacKeyCache = new Map();

function base64UrlEncodeBytes(bytes) {
  return btoa(String.fromCodePoint(...bytes))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/g, '');
}

function base64UrlDecodeToBytes(str) {
  const b64 = str.replaceAll('-', '+').replaceAll('_', '/');
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  return Uint8Array.from(atob(padded), (c) => c.codePointAt(0));
}

async function getHmacKey(secret) {
  if (!hmacKeyCache.has(secret)) {
    hmacKeyCache.set(
      secret,
      crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      )
    );
  }
  return hmacKeyCache.get(secret);
}

async function signMessage(secret, message) {
  const key = await getHmacKey(secret);
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return base64UrlEncodeBytes(new Uint8Array(sig));
}

async function makeToken(cookieIndex, secret) {
  const ts = Math.floor(Date.now() / TOKEN_TTL_MS); // changes every 2h
  const payloadObj = { i: cookieIndex, t: ts };
  const payloadB64 = base64UrlEncodeBytes(encoder.encode(JSON.stringify(payloadObj)));
  const sig = await signMessage(secret, payloadB64);
  return `${payloadB64}.${sig}`;
}

async function verifyAndDecodeToken(token, secret) {
  if (typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payloadB64, sig] = parts;
  if (!payloadB64 || !sig) return null;

  const expectedSig = await signMessage(secret, payloadB64);
  if (expectedSig !== sig) return null;

  let payload;
  try {
    payload = JSON.parse(decoder.decode(base64UrlDecodeToBytes(payloadB64)));
  } catch {
    return null;
  }
  if (!payload || !Number.isInteger(payload.i) || !Number.isInteger(payload.t)) return null;

  const nowTs = Math.floor(Date.now() / TOKEN_TTL_MS);
  if (payload.t !== nowTs && payload.t !== nowTs - 1) return null;
  if (payload.i < 0 || payload.i >= COOKIES.length) return null;

  return payload;
}

async function makeProgressToken(progressState, secret) {
  const payloadB64 = base64UrlEncodeBytes(encoder.encode(JSON.stringify(progressState)));
  const sig = await signMessage(secret, payloadB64);
  return `${payloadB64}.${sig}`;
}

async function verifyProgressToken(token, expectedGame, expectedDate, secret) {
  if (!token) return { game: expectedGame, date: expectedDate, wrong: 0, hint_used: false };
  if (typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payloadB64, sig] = parts;
  if (!payloadB64 || !sig) return null;

  const expectedSig = await signMessage(secret, payloadB64);
  if (expectedSig !== sig) return null;

  let payload;
  try {
    payload = JSON.parse(decoder.decode(base64UrlDecodeToBytes(payloadB64)));
  } catch {
    return null;
  }
  if (!payload || payload.game !== expectedGame || payload.date !== expectedDate) return null;
  if (!Number.isInteger(payload.wrong) || payload.wrong < 0) return null;
  if (typeof payload.hint_used !== 'boolean') return null;
  return payload;
}

// Verifies a Cloudflare Turnstile token server-side.
async function verifyTurnstile(token, secret, ip) {
  if (!token || !secret) return false;
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret, response: token, remoteip: ip }),
  });
  const data = await res.json();
  return data.success === true;
}

// Input sanitization — strip non-printable chars, enforce max length
function sanitizeInput(str, maxLen = 100) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[^\x20-\x7E\u00A0-\u024F]/g, '')
    .trim()
    .slice(0, maxLen);
}
// ─────────────────────────────────────────
// ROUTE HANDLERS
// ─────────────────────────────────────────
async function handleUnlimitedNew({ env, origin }) {
  const cookieIndex = crypto.getRandomValues(new Uint32Array(1))[0] % COOKIES.length;
  const token = await makeToken(cookieIndex, env.COOKIE_SECRET);
  const progress_token = await makeProgressToken(
    { game: 'unlimited', date: 'rolling', wrong: 0, hint_used: false, token_bind: token },
    env.COOKIE_SECRET
  );
  return jsonResponse({ token, progress_token }, 200, origin);
}

async function handleUnlimitedGuess({ request, env, origin }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400, origin);
  }
  const token = sanitizeInput(body.token || '', 300);
  const progressToken = sanitizeInput(body.progress_token || '', 500);
  const guess = sanitizeInput(body.guess || '');
  if (!token || !guess || !progressToken)
    return jsonResponse({ error: 'Missing token, progress token, or guess' }, 400, origin);
  if (token.length > 280 || progressToken.length > 480)
    return jsonResponse({ error: 'Invalid token' }, 400, origin);

  const tokenPayload = await verifyAndDecodeToken(token, env.COOKIE_SECRET);
  if (!tokenPayload)
    return jsonResponse(
      { error: 'Invalid or expired token — click New Cookie to get a fresh one.' },
      400,
      origin
    );
  const target_u = COOKIES[tokenPayload.i];

  const progress = await verifyProgressToken(
    progressToken,
    'unlimited',
    'rolling',
    env.COOKIE_SECRET
  );
  if (progress?.token_bind !== token) {
    return jsonResponse(
      { error: 'Invalid progress token — click New Cookie to start over.' },
      400,
      origin
    );
  }

  const guessCookie = COOKIES.find((c) => c.cookie_name.toLowerCase() === guess.toLowerCase());
  if (!guessCookie) return jsonResponse({ error: 'Cookie not found' }, 404, origin);

  const result = evaluateGuess(guessCookie, target_u);
  const nextProgress = { ...progress, wrong: result.correct ? progress.wrong : progress.wrong + 1 };
  result.progress_token = await makeProgressToken(nextProgress, env.COOKIE_SECRET);
  if (result.correct) {
    result.cookie_name = target_u.cookie_name;
    result.skill_name = target_u.skill_name || '';
    result.skill_cooldown = target_u.skill_cooldown || 0;
  }
  return jsonResponse(result, 200, origin);
}

async function handleUnlimitedHint({ request, env, origin }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400, origin);
  }
  const token = sanitizeInput(body.token || '', 300);
  const progressToken = sanitizeInput(body.progress_token || '', 500);
  const trait = sanitizeInput(body.trait || '');
  const valid = ['primary_color', 'secondary_color', 'rarity', 'type', 'position'];
  if (!token || !progressToken || !valid.includes(trait))
    return jsonResponse({ error: 'Invalid request' }, 400, origin);

  const tokenPayload = await verifyAndDecodeToken(token, env.COOKIE_SECRET);
  if (!tokenPayload) return jsonResponse({ error: 'Invalid or expired token' }, 400, origin);
  const target_u = COOKIES[tokenPayload.i];

  const progress = await verifyProgressToken(
    progressToken,
    'unlimited',
    'rolling',
    env.COOKIE_SECRET
  );
  if (progress?.token_bind !== token) {
    return jsonResponse(
      { error: 'Invalid progress token — click New Cookie to start over.' },
      400,
      origin
    );
  }
  if (progress.hint_used)
    return jsonResponse({ error: 'Hint already used this round' }, 403, origin);
  if (progress.wrong < 5)
    return jsonResponse({ error: 'Hint requires 5 wrong guesses' }, 403, origin);

  const nextProgress = { ...progress, hint_used: true };
  return jsonResponse(
    {
      trait,
      value: target_u[trait],
      progress_token: await makeProgressToken(nextProgress, env.COOKIE_SECRET),
    },
    200,
    origin
  );
}

// ─────────────────────────────────────────
// SHARED DAILY GAME HELPERS
// ─────────────────────────────────────────

// Shared hint gate: verifies token, enforces 5-wrong minimum, records analytics, returns hint payload.
async function handleDailyHint({ url, env, origin, gameId, todayStr, buildPayload }) {
  const stateToken = sanitizeInput(url.searchParams.get('state_token') || '', 500);
  const state = await verifyProgressToken(stateToken, gameId, todayStr, env.COOKIE_SECRET);
  if (!state)
    return jsonResponse({ error: 'Invalid state token. Refresh to continue.' }, 400, origin);
  if (state.hint_used) return jsonResponse({ error: 'Hint already used' }, 403, origin);
  if (state.wrong < 5) return jsonResponse({ error: 'Hint requires 5 wrong guesses' }, 403, origin);
  const nextState = { ...state, hint_used: true };
  return jsonResponse(
    { ...buildPayload(), state_token: await makeProgressToken(nextState, env.COOKIE_SECRET) },
    200,
    origin
  );
}

// Shared binary guess (Games 2 & 3): verifies token, checks correct, records analytics.
// Caller must parse the request body and pass it as `body`.
async function handleDailyBinaryGuess({ body, env, origin, gameId, todayStr, target, ip }) {
  const guessName = sanitizeInput(body.guess || '').toLowerCase();
  const stateToken = sanitizeInput(body.state_token || '', 500);
  if (!guessName) return jsonResponse({ error: 'No guess provided' }, 400, origin);
  if (env.TURNSTILE_SECRET) {
    const ok = await verifyTurnstile(body.cf_turnstile || '', env.TURNSTILE_SECRET, ip);
    if (!ok) return jsonResponse({ error: 'Challenge failed — please try again.' }, 403, origin);
  }
  const state = await verifyProgressToken(stateToken, gameId, todayStr, env.COOKIE_SECRET);
  if (!state)
    return jsonResponse({ error: 'Invalid state token. Refresh to continue.' }, 400, origin);
  const correct = guessName === target.cookie_name.toLowerCase();
  const nextState = { ...state, wrong: correct ? state.wrong : state.wrong + 1 };
  return jsonResponse(
    {
      correct,
      cookie_name: correct ? target.cookie_name : undefined,
      state_token: await makeProgressToken(nextState, env.COOKIE_SECRET),
    },
    200,
    origin
  );
}

// ─────────────────────────────────────────
// GAME 1 HANDLERS
// ─────────────────────────────────────────

async function handleGuess1({ request, env, origin, target, todayStr, ip }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400, origin);
  }
  const guessName = sanitizeInput(body.guess || '').toLowerCase();
  const stateToken = sanitizeInput(body.state_token || '', 500);
  if (!guessName) return jsonResponse({ error: 'No guess provided' }, 400, origin);
  if (env.TURNSTILE_SECRET) {
    const ok = await verifyTurnstile(body.cf_turnstile || '', env.TURNSTILE_SECRET, ip);
    if (!ok) return jsonResponse({ error: 'Challenge failed — please try again.' }, 403, origin);
  }

  const guessCookie = COOKIES.find((c) => c.cookie_name.toLowerCase() === guessName);
  if (!guessCookie) return jsonResponse({ error: 'Cookie not found' }, 404, origin);

  const result = evaluateGuess(guessCookie, target);
  const state = await verifyProgressToken(stateToken, 'daily1', todayStr, env.COOKIE_SECRET);
  if (!state)
    return jsonResponse({ error: 'Invalid state token. Refresh to continue.' }, 400, origin);
  const nextState = { ...state, wrong: result.correct ? state.wrong : state.wrong + 1 };
  result.state_token = await makeProgressToken(nextState, env.COOKIE_SECRET);
  if (result.correct) {
    result.skill_name = target.skill_name || '';
    result.skill_cooldown = target.skill_cooldown || 0;
    result.cookie_name = target.cookie_name;
  }
  return jsonResponse(result, 200, origin);
}

async function handleHint1({ url, env, origin, target, todayStr }) {
  const trait = sanitizeInput(url.searchParams.get('trait') || '');
  const valid = ['primary_color', 'secondary_color', 'rarity', 'type', 'position'];
  if (!valid.includes(trait)) return jsonResponse({ error: 'Invalid trait' }, 400, origin);
  return handleDailyHint({
    url,
    env,
    origin,
    gameId: 'daily1',
    todayStr,
    buildPayload: () => ({ trait, value: target[trait] }),
  });
}

// ─────────────────────────────────────────
// ASSET & UTILITY HANDLERS
// ─────────────────────────────────────────

function handleCookies({ origin }) {
  return jsonResponse(COOKIES, 200, origin);
}

function handleSkill({ origin, target2 }) {
  return jsonResponse(
    { skill_name: target2.skill_name, skill_cooldown: target2.skill_cooldown },
    200,
    origin
  );
}

async function handleSkillImage({ request, env, origin, target2 }) {
  const filename = target2.cookie_name.replaceAll(' ', '_') + '.webp';
  const assetReq = new Request(new URL(`/cookie_skill_images/${filename}`, request.url).toString());
  const assetRes = await env.ASSETS.fetch(assetReq);
  const headers = new Headers(assetRes.headers);
  Object.entries(corsHeaders(origin)).forEach(([k, v]) => headers.set(k, v));
  return new Response(assetRes.body, { status: assetRes.status, headers });
}

async function handleSilhouette3Image({ request, env, origin, target3 }) {
  const filename = target3.cookie_name.replaceAll(' ', '_') + '.webp';
  const assetReq = new Request(new URL(`/cookie_silhouettes/${filename}`, request.url).toString());
  const assetRes = await env.ASSETS.fetch(assetReq);
  const headers = new Headers(assetRes.headers);
  Object.entries(corsHeaders(origin)).forEach(([k, v]) => headers.set(k, v));
  return new Response(assetRes.body, { status: assetRes.status, headers });
}

// ─────────────────────────────────────────
// GAME 2 HANDLERS
// ─────────────────────────────────────────

async function handleGuess2({ request, env, origin, target2, todayStr, ip }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400, origin);
  }
  return handleDailyBinaryGuess({
    body,
    env,
    origin,
    gameId: 'daily2',
    todayStr,
    target: target2,
    ip,
  });
}

async function handleHint2({ url, env, origin, target2, todayStr }) {
  return handleDailyHint({
    url,
    env,
    origin,
    gameId: 'daily2',
    todayStr,
    buildPayload: () => ({
      rarity: target2.rarity,
      type: target2.type,
      position: target2.position,
    }),
  });
}

// ─────────────────────────────────────────
// GAME 3 HANDLERS
// ─────────────────────────────────────────

async function handleGuess3({ request, env, origin, target3, todayStr, ip }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400, origin);
  }
  const guessName = sanitizeInput(body.guess || '').toLowerCase();
  if (guessName && !COOKIES.some((c) => c.cookie_name.toLowerCase() === guessName))
    return jsonResponse({ error: 'Cookie not found' }, 404, origin);
  return handleDailyBinaryGuess({
    body,
    env,
    origin,
    gameId: 'daily3',
    todayStr,
    target: target3,
    ip,
  });
}

async function handleHint3({ url, env, origin, target3, todayStr }) {
  return handleDailyHint({
    url,
    env,
    origin,
    gameId: 'daily3',
    todayStr,
    buildPayload: () => ({
      primary_color: target3.primary_color,
      type: target3.type,
      rarity: target3.rarity,
    }),
  });
}

function handleCookieCount({ origin }) {
  return jsonResponse({ count: COOKIES.length }, 200, origin);
}

function handleHealth({ origin }) {
  const now = new Date();
  return jsonResponse(
    {
      ok: true,
      cookies: COOKIES.length,
      date: `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`,
    },
    200,
    origin
  );
}

// ─────────────────────────────────────────
// ROUTE TABLE & MAIN HANDLER
// ─────────────────────────────────────────
const ROUTES = new Map([
  ['GET /unlimited/new', handleUnlimitedNew],
  ['POST /unlimited/guess', handleUnlimitedGuess],
  ['POST /unlimited/hint', handleUnlimitedHint],
  ['POST /guess', handleGuess1],
  ['GET /hint', handleHint1],
  ['GET /cookies', handleCookies],
  ['GET /skill', handleSkill],
  ['GET /skill-image', handleSkillImage],
  ['POST /guess2', handleGuess2],
  ['GET /hint2', handleHint2],
  ['GET /silhouette3-image', handleSilhouette3Image],
  ['POST /guess3', handleGuess3],
  ['GET /hint3', handleHint3],
  ['GET /cookie-count', handleCookieCount],
  ['GET /health', handleHealth],
]);

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    try {
      const url = new URL(request.url);

      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders(origin) });
      }

      const now = new Date();
      const todayStr = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;

      const handler = ROUTES.get(`${request.method} ${url.pathname}`);
      if (!handler) return jsonResponse({ error: 'Not found' }, 404, origin);

      const needsTarget1 = url.pathname === '/guess' || url.pathname === '/hint';
      const needsTarget2 =
        url.pathname === '/skill' ||
        url.pathname === '/skill-image' ||
        url.pathname === '/guess2' ||
        url.pathname === '/hint2';
      const needsTarget3 =
        url.pathname === '/silhouette3-image' ||
        url.pathname === '/guess3' ||
        url.pathname === '/hint3';

      const [target, target2, target3] = await Promise.all([
        needsTarget1 ? getDailyTarget(env.COOKIE_SECRET) : null,
        needsTarget2 ? getDailyTarget2(env.COOKIE_SECRET) : null,
        needsTarget3 ? getDailyTarget3(env.COOKIE_SECRET) : null,
      ]);

      const ip = request.headers.get('CF-Connecting-IP') || '';
      return handler({ request, env, url, origin, target, target2, target3, todayStr, ip });
    } catch (err) {
      console.error(err);
      return jsonResponse({ error: 'Internal server error' }, 500, origin);
    }
  },
};
