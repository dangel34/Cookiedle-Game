const COOKIES = [
  {cookie_name:"Adventurer Cookie",primary_color:"Brown",secondary_color:"White",rarity:"Rare",type:"Ambush",position:"Middle",skill_name:"Rope Master",skill_cooldown:12},
  {cookie_name:"Affogato Cookie",primary_color:"Purple",secondary_color:"Brown",rarity:"Epic",type:"Bomber",position:"Middle",skill_name:"Sweet Scheme",skill_cooldown:15},
  {cookie_name:"Agar Agar Cookie",primary_color:"Gray",secondary_color:"Red",rarity:"Epic",type:"Ambush",position:"Middle",skill_name:"Ravenous Mirror",skill_cooldown:15},
  {cookie_name:"Alchemist Cookie",primary_color:"Purple",secondary_color:"Brown",rarity:"Rare",type:"Bomber",position:"Middle",skill_name:"Unstable Formula",skill_cooldown:16},
  {cookie_name:"Almond Cookie",primary_color:"Brown",secondary_color:"White",rarity:"Epic",type:"Support",position:"Rear",skill_name:"Almond Handcuffs",skill_cooldown:15},
  {cookie_name:"Angel Cookie",primary_color:"Yellow",secondary_color:"White",rarity:"Common",type:"Healing",position:"Rear",skill_name:"Celestial Light",skill_cooldown:15},
  {cookie_name:"Avocado Cookie",primary_color:"Green",secondary_color:"Brown",rarity:"Rare",type:"Defense",position:"Front",skill_name:"Battle Smithing",skill_cooldown:13},
  {cookie_name:"Beet Cookie",primary_color:"Pink",secondary_color:"Green",rarity:"Common",type:"Ranged",position:"Rear",skill_name:"Hunters Sense",skill_cooldown:12},
  {cookie_name:"Black Forest Cookie",primary_color:"Brown",secondary_color:"White",rarity:"Epic",type:"Charge",position:"Front",skill_name:"For the Creators!",skill_cooldown:8},
  {cookie_name:"Black Lemonade Cookie",primary_color:"Yellow",secondary_color:"Black",rarity:"Epic",type:"Bomber",position:"Middle",skill_name:"Electrifying Rock!",skill_cooldown:10},
  {cookie_name:"Black Pearl Cookie",primary_color:"Black",secondary_color:"White",rarity:"Legendary",type:"Ambush",position:"Middle",skill_name:"Duskglooms Sovereign",skill_cooldown:15},
  {cookie_name:"Black Raisin Cookie",primary_color:"Black",secondary_color:"Purple",rarity:"Epic",type:"Ambush",position:"Middle",skill_name:"Shadow Watcher",skill_cooldown:14},
  {cookie_name:"Black Sapphire Cookie",primary_color:"Black",secondary_color:"Purple",rarity:"Epic",type:"Support",position:"Middle",skill_name:"It's Showtime",skill_cooldown:15},
  {cookie_name:"Blackberry Cookie",primary_color:"Purple",secondary_color:"Black",rarity:"Rare",type:"Magic",position:"Rear",skill_name:"Ghost Servants",skill_cooldown:15},
  {cookie_name:"Blueberry Pie Cookie",primary_color:"Blue",secondary_color:"Brown",rarity:"Epic",type:"Magic",position:"Middle",skill_name:"Cursed Tome",skill_cooldown:15},
  {cookie_name:"Burning Spice Cookie",primary_color:"Red",secondary_color:"Black",rarity:"Beast",type:"Charge",position:"Front",skill_name:"Tyrants Wrath",skill_cooldown:9},
  {cookie_name:"Burnt Cheese Cookie",primary_color:"Black",secondary_color:"Brown",rarity:"Epic",type:"Charge",position:"Front",skill_name:"Keeper of the Gates",skill_cooldown:10},
  {cookie_name:"Butter Roll Cookie",primary_color:"White",secondary_color:"Red",rarity:"Epic",type:"Charge",position:"Front",skill_name:"Dough Experiment",skill_cooldown:12},
  {cookie_name:"Camellia Cookie",primary_color:"Green",secondary_color:"White",rarity:"Super Epic",type:"Charge",position:"Front",skill_name:"Battle Scene Painting",skill_cooldown:13},
  {cookie_name:"Candy Apple Cookie",primary_color:"Red",secondary_color:"Black",rarity:"Epic",type:"Bomber",position:"Middle",skill_name:"Apple of My Eye!",skill_cooldown:12},
  {cookie_name:"Candy Diver Cookie",primary_color:"Red",secondary_color:"Blue",rarity:"Epic",type:"Support",position:"Rear",skill_name:"Deep-sea Diver",skill_cooldown:15},
  {cookie_name:"Capsaicin Cookie",primary_color:"Orange",secondary_color:"Black",rarity:"Super Epic",type:"Charge",position:"Front",skill_name:"Capsaicin Magma",skill_cooldown:15},
  {cookie_name:"Captain Caviar Cookie",primary_color:"Black",secondary_color:"Yellow",rarity:"Epic",type:"Bomber",position:"Middle",skill_name:"Black Shark Torpedo",skill_cooldown:15},
  {cookie_name:"Caramel Arrow Cookie",primary_color:"Black",secondary_color:"Brown",rarity:"Epic",type:"Ranged",position:"Front",skill_name:"Arrow of Resolution",skill_cooldown:10},
  {cookie_name:"Caramel Choux Cookie",primary_color:"Brown",secondary_color:"Yellow",rarity:"Epic",type:"Support",position:"Rear",skill_name:"Ive Got Choux",skill_cooldown:15},
  {cookie_name:"Carol Cookie",primary_color:"Green",secondary_color:"Brown",rarity:"Epic",type:"Healing",position:"Rear",skill_name:"Magic Songs",skill_cooldown:16},
  {cookie_name:"Carrot Cookie",primary_color:"Orange",secondary_color:"Brown",rarity:"Rare",type:"Support",position:"Middle",skill_name:"Carrot Harvest",skill_cooldown:19},
  {cookie_name:"Charcoal Cookie",primary_color:"Black",secondary_color:"Gray",rarity:"Epic",type:"Magic",position:"Rear",skill_name:"Tombkeeper's Rite",skill_cooldown:12},
  {cookie_name:"Cherry Blossom Cookie",primary_color:"Pink",secondary_color:"Brown",rarity:"Epic",type:"Ambush",position:"Rear",skill_name:"Cherry Blossom Rain",skill_cooldown:17},
  {cookie_name:"Cherry Cookie",primary_color:"Red",secondary_color:"White",rarity:"Rare",type:"Bomber",position:"Rear",skill_name:"Huge Cherry Bomb",skill_cooldown:16},
  {cookie_name:"Chess Choco Cookie",primary_color:"White",secondary_color:"Brown",rarity:"Epic",type:"Bomber",position:"Rear",skill_name:"Chess Time!",skill_cooldown:14},
  {cookie_name:"Chili Pepper Cookie",primary_color:"Red",secondary_color:"Black",rarity:"Epic",type:"Ambush",position:"Middle",skill_name:"Cheap Shot",skill_cooldown:12},
  {cookie_name:"Choco Drizzle Cookie",primary_color:"Black",secondary_color:"Brown",rarity:"Epic",type:"Ambush",position:"Middle",skill_name:"Choco Penumbra",skill_cooldown:12},
  {cookie_name:"Clotted Cream Cookie",primary_color:"Yellow",secondary_color:"White",rarity:"Super Epic",type:"Magic",position:"Middle",skill_name:"Consuls Orders",skill_cooldown:15},
  {cookie_name:"Cloud Haetae Cookie",primary_color:"White",secondary_color:"Brown",rarity:"Epic",type:"Defense",position:"Front",skill_name:"Haetae Charge",skill_cooldown:11},
  {cookie_name:"Clover Cookie",primary_color:"Green",secondary_color:"White",rarity:"Rare",type:"Support",position:"Rear",skill_name:"Bards Song",skill_cooldown:17},
  {cookie_name:"Cocoa Cookie",primary_color:"White",secondary_color:"Brown",rarity:"Epic",type:"Defense",position:"Front",skill_name:"Cocoa is Love",skill_cooldown:15},
  {cookie_name:"Cotton Cookie",primary_color:"White",secondary_color:"Brown",rarity:"Epic",type:"Support",position:"Rear",skill_name:"A Warm Light",skill_cooldown:17},
  {cookie_name:"Cream Ferret Cookie",primary_color:"White",secondary_color:"Yellow",rarity:"Special",type:"Support",position:"Rear",skill_name:"Snuggly Ferret",skill_cooldown:18},
  {cookie_name:"Cream Puff Cookie",primary_color:"Brown",secondary_color:"Blue",rarity:"Epic",type:"Support",position:"Rear",skill_name:"Jellius Extremus!",skill_cooldown:16},
  {cookie_name:"Cream Soda Cookie",primary_color:"Blue",secondary_color:"Pink",rarity:"Epic",type:"Charge",position:"Front",skill_name:"Cream Soda Blade",skill_cooldown:14},
  {cookie_name:"Cream Unicorn Cookie",primary_color:"White",secondary_color:"Pink",rarity:"Epic",type:"Healing",position:"Rear",skill_name:"Midsummer Nights Dream",skill_cooldown:17},
  {cookie_name:"Crimson Coral Cookie",primary_color:"Red",secondary_color:"Pink",rarity:"Super Epic",type:"Defense",position:"Front",skill_name:"Somber Affection",skill_cooldown:12},
  {cookie_name:"Crunchy Chip Cookie",primary_color:"White",secondary_color:"Black",rarity:"Epic",type:"Charge",position:"Front",skill_name:"Wolf Squadron",skill_cooldown:15},
  {cookie_name:"Crème Brûlée Cookie",primary_color:"Yellow",secondary_color:"Brown",rarity:"Epic",type:"Ranged",position:"Rear",skill_name:"Accelerando",skill_cooldown:9},
  {cookie_name:"Custard Cookie III",primary_color:"Brown",secondary_color:"White",rarity:"Rare",type:"Healing",position:"Rear",skill_name:"Kings Favor",skill_cooldown:16},
  {cookie_name:"Dark Cacao Cookie",primary_color:"Black",secondary_color:"Purple",rarity:"Ancient",type:"Charge",position:"Front",skill_name:"Solemn Judgment",skill_cooldown:16},
  {cookie_name:"Dark Choco Cookie",primary_color:"Black",secondary_color:"Brown",rarity:"Epic",type:"Charge",position:"Front",skill_name:"Sword of Darkness",skill_cooldown:13},
  {cookie_name:"Dark Enchantress Cookie",primary_color:"Red",secondary_color:"White",rarity:"Witch",type:"Magic",position:"Middle",skill_name:"Visions of Doom",skill_cooldown:16},
  {cookie_name:"Devil Cookie",primary_color:"Red",secondary_color:"Black",rarity:"Rare",type:"Magic",position:"Middle",skill_name:"Devilish Rune",skill_cooldown:18},
  {cookie_name:"Doughael Cookie",primary_color:"White",secondary_color:"Brown",rarity:"Super Epic",type:"Healing",position:"Middle",skill_name:"Consecrated Vow",skill_cooldown:15},
  {cookie_name:"Eclair Cookie",primary_color:"Green",secondary_color:"White",rarity:"Epic",type:"Support",position:"Middle",skill_name:"Book of History",skill_cooldown:16},
  {cookie_name:"Elder Faerie Cookie",primary_color:"Gray",secondary_color:"White",rarity:"Super Epic",type:"Defense",position:"Front",skill_name:"Guardians Valor",skill_cooldown:12},
  {cookie_name:"Elphaba Cookie",primary_color:"Black",secondary_color:"Green",rarity:"Special",type:"Magic",position:"Rear",skill_name:"Unlimited!",skill_cooldown:14},
  {cookie_name:"Espresso Cookie",primary_color:"Black",secondary_color:"Brown",rarity:"Epic",type:"Magic",position:"Middle",skill_name:"Grinding",skill_cooldown:15},
  {cookie_name:"Eternal Sugar Cookie",primary_color:"Pink",secondary_color:"Purple",rarity:"Beast",type:"Bomber",position:"Middle",skill_name:"Eternal Enchantment",skill_cooldown:12},
  {cookie_name:"Fettuccine Cookie",primary_color:"Yellow",secondary_color:"Brown",rarity:"Epic",type:"Defense",position:"Front",skill_name:"Unstable Fettuccine",skill_cooldown:12},
  {cookie_name:"Fig Cookie",primary_color:"Purple",secondary_color:"Brown",rarity:"Epic",type:"Support",position:"Middle",skill_name:"Jelly Horn",skill_cooldown:15},
  {cookie_name:"Financier Cookie",primary_color:"Yellow",secondary_color:"White",rarity:"Epic",type:"Defense",position:"Front",skill_name:"Paladin Protection",skill_cooldown:15},
  {cookie_name:"Fire Spirit Cookie",primary_color:"Red",secondary_color:"Yellow",rarity:"Legendary",type:"Magic",position:"Rear",skill_name:"Ever-Burning Flames",skill_cooldown:14},
  {cookie_name:"Frilled Jellyfish Cookie",primary_color:"White",secondary_color:"Blue",rarity:"Epic",type:"Support",position:"Middle",skill_name:"Frilled Snare",skill_cooldown:12},
  {cookie_name:"Frost Queen Cookie",primary_color:"White",secondary_color:"Blue",rarity:"Legendary",type:"Magic",position:"Middle",skill_name:"Freezing Squall",skill_cooldown:18},
  {cookie_name:"GingerBrave",primary_color:"Brown",secondary_color:"Blue",rarity:"Common",type:"Charge",position:"Front",skill_name:"Brave Dash",skill_cooldown:8},
  {cookie_name:"Glinda Cookie",primary_color:"Pink",secondary_color:"Yellow",rarity:"Special",type:"Magic",position:"Rear",skill_name:"Dazzling Presence",skill_cooldown:14},
  {cookie_name:"Golden Cheese Cookie",primary_color:"Yellow",secondary_color:"Brown",rarity:"Ancient",type:"Ranged",position:"Middle",skill_name:"Brilliance of the Absolute",skill_cooldown:13},
  {cookie_name:"Golden Osmanthus Cookie",primary_color:"Yellow",secondary_color:"White",rarity:"Epic",type:"Bomber",position:"Middle",skill_name:"Incense of Affection",skill_cooldown:13},
  {cookie_name:"Grapefruit Cookie",primary_color:"Red",secondary_color:"Green",rarity:"Epic",type:"Charge",position:"Front",skill_name:"Catch Me If You Can!",skill_cooldown:13},
  {cookie_name:"Green Tea Mousse Cookie",primary_color:"Green",secondary_color:"Brown",rarity:"Epic",type:"Defense",position:"Front",skill_name:"Mousse Shield",skill_cooldown:11},
  {cookie_name:"Gumball Cookie",primary_color:"Blue",secondary_color:"Red",rarity:"Rare",type:"Bomber",position:"Rear",skill_name:"Art-illery",skill_cooldown:0},
  {cookie_name:"Herb Cookie",primary_color:"Green",secondary_color:"Brown",rarity:"Epic",type:"Healing",position:"Rear",skill_name:"Sunny Garden",skill_cooldown:17},
  {cookie_name:"Hollyberry Cookie",primary_color:"Pink",secondary_color:"Red",rarity:"Ancient",type:"Defense",position:"Front",skill_name:"Oath on the Shield",skill_cooldown:18},
  {cookie_name:"Icicle Yeti Cookie",primary_color:"Blue",secondary_color:"White",rarity:"Special",type:"Healing",position:"Front",skill_name:"Lets Be Friends!",skill_cooldown:12},
  {cookie_name:"Jagae Cookie",primary_color:"Purple",secondary_color:"White",rarity:"Epic",type:"Support",position:"Front",skill_name:"Iridescent Storm",skill_cooldown:13},
  {cookie_name:"Knight Cookie",primary_color:"White",secondary_color:"Blue",rarity:"Rare",type:"Defense",position:"Front",skill_name:"Calvary Charge",skill_cooldown:13},
  {cookie_name:"Kouign-Amann Cookie",primary_color:"Pink",secondary_color:"Yellow",rarity:"Epic",type:"Defense",position:"Front",skill_name:"Paladins Way",skill_cooldown:12},
  {cookie_name:"Kumiho Cookie",primary_color:"Red",secondary_color:"Blue",rarity:"Epic",type:"Charge",position:"Front",skill_name:"Somersault",skill_cooldown:14},
  {cookie_name:"Latte Cookie",primary_color:"Brown",secondary_color:"White",rarity:"Epic",type:"Magic",position:"Middle",skill_name:"Care for a Latte?",skill_cooldown:15},
  {cookie_name:"Lemon Cookie",primary_color:"Yellow",secondary_color:"Blue",rarity:"Epic",type:"Ambush",position:"Middle",skill_name:"Lightning Dash",skill_cooldown:12},
  {cookie_name:"Licorice Cookie",primary_color:"Black",secondary_color:"White",rarity:"Epic",type:"Magic",position:"Middle",skill_name:"Licorice Servants",skill_cooldown:14},
  {cookie_name:"Lilac Cookie",primary_color:"Purple",secondary_color:"White",rarity:"Epic",type:"Support",position:"Middle",skill_name:"Chakram Throw",skill_cooldown:13},
  {cookie_name:"Lime Cookie",primary_color:"Green",secondary_color:"Brown",rarity:"Epic",type:"Support",position:"Rear",skill_name:"Beach Ball Surprise",skill_cooldown:15},
  {cookie_name:"Linzer Cookie",primary_color:"Red",secondary_color:"Brown",rarity:"Epic",type:"Support",position:"Rear",skill_name:"The Culprit... is YOU!",skill_cooldown:16},
  {cookie_name:"Macaron Cookie",primary_color:"Red",secondary_color:"White",rarity:"Epic",type:"Magic",position:"Middle",skill_name:"Mighty Macaron Parade",skill_cooldown:15},
  {cookie_name:"Madeleine Cookie",primary_color:"White",secondary_color:"Blue",rarity:"Epic",type:"Defense",position:"Front",skill_name:"Commanders Honor",skill_cooldown:13},
  {cookie_name:"Mala Sauce Cookie",primary_color:"Red",secondary_color:"Gray",rarity:"Epic",type:"Charge",position:"Front",skill_name:"Spicy Mala Strike",skill_cooldown:15},
  {cookie_name:"Mango Cookie",primary_color:"Orange",secondary_color:"Green",rarity:"Epic",type:"Magic",position:"Middle",skill_name:"Mango Juice Wave",skill_cooldown:15},
  {cookie_name:"Manju Cookie",primary_color:"Brown",secondary_color:"Red",rarity:"Epic",type:"Ambush",position:"Rear",skill_name:"Flash Strike",skill_cooldown:17},
  {cookie_name:"Marshmallow Bunny Cookie",primary_color:"Pink",secondary_color:"Blue",rarity:"Special",type:"Support",position:"Rear",skill_name:"Let's Go Bunny Tunnel!",skill_cooldown:18},
  {cookie_name:"Matcha Cookie",primary_color:"Green",secondary_color:"Brown",rarity:"Epic",type:"Magic",position:"Middle",skill_name:"Sinister Scheme",skill_cooldown:12},
  {cookie_name:"Menthol Cookie",primary_color:"Blue",secondary_color:"White",rarity:"Epic",type:"Bomber",position:"Rear",skill_name:"Menthol Censer",skill_cooldown:15},
  {cookie_name:"Mercurial Knight Cookie",primary_color:"Gray",secondary_color:"White",rarity:"Epic",type:"Charge",position:"Front",skill_name:"Mercury Knights Oath",skill_cooldown:11},
  {cookie_name:"Milk Cookie",primary_color:"White",secondary_color:"Blue",rarity:"Epic",type:"Defense",position:"Front",skill_name:"Noble Sacrifice",skill_cooldown:12},
  {cookie_name:"Milky Way Cookie",primary_color:"Black",secondary_color:"White",rarity:"Epic",type:"Charge",position:"Front",skill_name:"Sugarcloud Express",skill_cooldown:15},
  {cookie_name:"Millenial Tree Cookie",primary_color:"Brown",secondary_color:"Green",rarity:"Legendary",type:"Support",position:"Front",skill_name:"Millenial Tree",skill_cooldown:8},
  {cookie_name:"Mint Choco Cookie",primary_color:"Blue",secondary_color:"White",rarity:"Epic",type:"Support",position:"Rear",skill_name:"Battlefield Symphony",skill_cooldown:16},
  {cookie_name:"Mold Dough Cookie",primary_color:"Black",secondary_color:"Brown",rarity:"Epic",type:"Charge",position:"Front",skill_name:"Order: Eliminate",skill_cooldown:10},
  {cookie_name:"Moon Rabbit Cookie",primary_color:"White",secondary_color:"Pink",rarity:"Epic",type:"Defense",position:"Front",skill_name:"Giant Rice Cake Bunny",skill_cooldown:14},
  {cookie_name:"Moonlight Cookie",primary_color:"Blue",secondary_color:"Black",rarity:"Legendary",type:"Magic",position:"Middle",skill_name:"Dream of the Night Sky",skill_cooldown:15},
  {cookie_name:"Mozzarella Cookie",primary_color:"Yellow",secondary_color:"Brown",rarity:"Epic",type:"Magic",position:"Middle",skill_name:"Bat Attack",skill_cooldown:11},
  {cookie_name:"Muscle Cookie",primary_color:"Black",secondary_color:"Brown",rarity:"Common",type:"Charge",position:"Front",skill_name:"Muscle King Power",skill_cooldown:10},
  {cookie_name:"Mystic Flour Cookie",primary_color:"White",secondary_color:"Brown",rarity:"Beast",type:"Healing",position:"Rear",skill_name:"Whispers of Apathy",skill_cooldown:15},
  {cookie_name:"Ninja Cookie",primary_color:"Blue",secondary_color:"Brown",rarity:"Common",type:"Ambush",position:"Middle",skill_name:"Swift Strike",skill_cooldown:11},
  {cookie_name:"Nutmeg Tiger Cookie",primary_color:"Red",secondary_color:"Brown",rarity:"Epic",type:"Support",position:"Front",skill_name:"The Great General",skill_cooldown:12},
  {cookie_name:"Okchun Cookie",primary_color:"White",secondary_color:"Red",rarity:"Epic",type:"Healing",position:"Middle",skill_name:"Okchun Pouch",skill_cooldown:15},
  {cookie_name:"Olive Cookie",primary_color:"Green",secondary_color:"Brown",rarity:"Epic",type:"Support",position:"Rear",skill_name:"Bat Attack",skill_cooldown:15},
  {cookie_name:"Onion Cookie",primary_color:"Purple",secondary_color:"White",rarity:"Rare",type:"Support",position:"Middle",skill_name:"Unstoppable Tears",skill_cooldown:19},
  {cookie_name:"Orange Cookie",primary_color:"Orange",secondary_color:"Brown",rarity:"Epic",type:"Magic",position:"Rear",skill_name:"Juicy Serve!",skill_cooldown:12},
  {cookie_name:"Oyster Cookie",primary_color:"White",secondary_color:"Gray",rarity:"Super Epic",type:"Support",position:"Rear",skill_name:"Might of Oyster House",skill_cooldown:17},
  {cookie_name:"Pancake Cookie",primary_color:"Brown",secondary_color:"White",rarity:"Rare",type:"Ambush",position:"Rear",skill_name:"Take an Acorn!",skill_cooldown:15},
  {cookie_name:"Parfait Cookie",primary_color:"White",secondary_color:"Pink",rarity:"Epic",type:"Support",position:"Rear",skill_name:"Para-Paru-Parfait!",skill_cooldown:17},
  {cookie_name:"Pastry Cookie",primary_color:"White",secondary_color:"Purple",rarity:"Epic",type:"Ranged",position:"Rear",skill_name:"Battle Prayer",skill_cooldown:13},
  {cookie_name:"Pavlova Cookie",primary_color:"Pink",secondary_color:"Red",rarity:"Epic",type:"Ranged",position:"Rear",skill_name:"Heart-Piercing Arrow",skill_cooldown:6},
  {cookie_name:"Peach Blossom Cookie",primary_color:"Pink",secondary_color:"White",rarity:"Epic",type:"Support",position:"Middle",skill_name:"Heavenly Fruit",skill_cooldown:12},
  {cookie_name:"Peppermint Cookie",primary_color:"Blue",secondary_color:"White",rarity:"Epic",type:"Support",position:"Rear",skill_name:"Freshness of the Sea",skill_cooldown:17},
  {cookie_name:"Pinecone Cookie",primary_color:"Brown",secondary_color:"Green",rarity:"Epic",type:"Bomber",position:"Front",skill_name:"Pinecone Bomb",skill_cooldown:12},
  {cookie_name:"Pitaya Dragon Cookie",primary_color:"Red",secondary_color:"White",rarity:"Dragon",type:"Charge",position:"Front",skill_name:"Draconic Bladestorm",skill_cooldown:13},
  {cookie_name:"Poison Mushroom Cookie",primary_color:"Purple",secondary_color:"Brown",rarity:"Epic",type:"Bomber",position:"Middle",skill_name:"Poison Cloud",skill_cooldown:15},
  {cookie_name:"Pom-pom Dough Cookie",primary_color:"White",secondary_color:"Green",rarity:"Epic",type:"Support",position:"Middle",skill_name:"Pom-pom Spores!",skill_cooldown:15},
  {cookie_name:"Pomegranate Cookie",primary_color:"Red",secondary_color:"Green",rarity:"Epic",type:"Support",position:"Middle",skill_name:"Pomegranate Magic",skill_cooldown:15},
  {cookie_name:"Princess Cookie",primary_color:"Pink",secondary_color:"White",rarity:"Rare",type:"Charge",position:"Front",skill_name:"Royal Swing",skill_cooldown:13},
  {cookie_name:"Prophet Cookie",primary_color:"Brown",secondary_color:"Purple",rarity:"Epic",type:"Support",position:"Rear",skill_name:"Seven Prophecies",skill_cooldown:19},
  {cookie_name:"Prune Juice Cookie",primary_color:"Purple",secondary_color:"Black",rarity:"Epic",type:"Bomber",position:"Middle",skill_name:"Prune Juice Potion",skill_cooldown:15},
  {cookie_name:"Pudding à la Mode Cookie",primary_color:"White",secondary_color:"Brown",rarity:"Epic",type:"Bomber",position:"Rear",skill_name:"Plasma Cannon",skill_cooldown:11},
  {cookie_name:"Pumpkin Pie Cookie",primary_color:"Orange",secondary_color:"Black",rarity:"Epic",type:"Magic",position:"Middle",skill_name:"Pompon help!",skill_cooldown:18},
  {cookie_name:"Pure Vanilla Cookie",primary_color:"Yellow",secondary_color:"White",rarity:"Ancient",type:"Healing",position:"Rear",skill_name:"Love & Peace",skill_cooldown:19},
  {cookie_name:"Purple Yam Cookie",primary_color:"Purple",secondary_color:"Pink",rarity:"Epic",type:"Charge",position:"Front",skill_name:"Purple Tornado",skill_cooldown:12},
  {cookie_name:"Raspberry Cookie",primary_color:"Pink",secondary_color:"White",rarity:"Epic",type:"Charge",position:"Front",skill_name:"Raspberry Reprise",skill_cooldown:14},
  {cookie_name:"Rebel Cookie",primary_color:"Blue",secondary_color:"White",rarity:"Epic",type:"Ambush",position:"Front",skill_name:"Here There Everywhere!",skill_cooldown:13},
  {cookie_name:"Red Osmanthus Cookie",primary_color:"Red",secondary_color:"White",rarity:"Epic",type:"Ranged",position:"Middle",skill_name:"The Pipas Song",skill_cooldown:10},
  {cookie_name:"Red Velvet Cookie",primary_color:"Red",secondary_color:"White",rarity:"Epic",type:"Charge",position:"Front",skill_name:"Crimson Hand",skill_cooldown:15},
  {cookie_name:"Rockstar Cookie",primary_color:"Red",secondary_color:"Gray",rarity:"Epic",type:"Healing",position:"Middle",skill_name:"Legend of Rock",skill_cooldown:15},
  {cookie_name:"Royal Margarine Cookie",primary_color:"Brown",secondary_color:"White",rarity:"Epic",type:"Ambush",position:"Middle",skill_name:"Buttercream Blast",skill_cooldown:12},
  {cookie_name:"Rye Cookie",primary_color:"Brown",secondary_color:"Red",rarity:"Epic",type:"Ranged",position:"Rear",skill_name:"Final Showdown",skill_cooldown:15},
  {cookie_name:"Salt Cellar Cookie",primary_color:"White",secondary_color:"Gray",rarity:"Epic",type:"Defense",position:"Front",skill_name:"Knight of Solidarity",skill_cooldown:14},
  {cookie_name:"Schwarzwälder",primary_color:"Brown",secondary_color:"Red",rarity:"Epic",type:"Charge",position:"Front",skill_name:"Choco Chip Hammer",skill_cooldown:12},
  {cookie_name:"Sea Fairy Cookie",primary_color:"Blue",secondary_color:"White",rarity:"Legendary",type:"Bomber",position:"Middle",skill_name:"Soaring Compassion",skill_cooldown:17},
  {cookie_name:"Seltzer Cookie",primary_color:"White",secondary_color:"Blue",rarity:"Epic",type:"Support",position:"Rear",skill_name:"Bubble Rain",skill_cooldown:12},
  {cookie_name:"Shadow Milk Cookie",primary_color:"Blue",secondary_color:"Black",rarity:"Beast",type:"Magic",position:"Middle",skill_name:"Act 1: Lies",skill_cooldown:11},
  {cookie_name:"Sherbet Cookie",primary_color:"White",secondary_color:"Blue",rarity:"Super Epic",type:"Ranged",position:"Middle",skill_name:"Frost Shards",skill_cooldown:13},
  {cookie_name:"Shining Glitter Cookie",primary_color:"Pink",secondary_color:"Black",rarity:"Super Epic",type:"Magic",position:"Middle",skill_name:"All Eyes on the Stage!",skill_cooldown:12},
  {cookie_name:"Silent Salt Cookie",primary_color:"Black",secondary_color:"Gray",rarity:"Beast",type:"Ambush",position:"Front",skill_name:"End of Silence",skill_cooldown:14},
  {cookie_name:"Silverbell Cookie",primary_color:"White",secondary_color:"Gray",rarity:"Epic",type:"Support",position:"Rear",skill_name:"Gleeful Chime",skill_cooldown:15},
  {cookie_name:"Smoked Cheese Cookie",primary_color:"Red",secondary_color:"Yellow",rarity:"Epic",type:"Magic",position:"Rear",skill_name:"Get Smoked!",skill_cooldown:15},
  {cookie_name:"Snapdragon Cookie",primary_color:"Pink",secondary_color:"White",rarity:"Special",type:"Support",position:"Rear",skill_name:"Arcane Blossom",skill_cooldown:17},
  {cookie_name:"Snow Sugar Cookie",primary_color:"Blue",secondary_color:"White",rarity:"Epic",type:"Magic",position:"Middle",skill_name:"Blizzard",skill_cooldown:20},
  {cookie_name:"Sonic Cookie",primary_color:"Blue",secondary_color:"White",rarity:"Special",type:"Ambush",position:"Middle",skill_name:"Sonics Spin Dash",skill_cooldown:16},
  {cookie_name:"Sorbet Shark Cookie",primary_color:"Brown",secondary_color:"Blue",rarity:"Epic",type:"Ambush",position:"Middle",skill_name:"Shark Splash",skill_cooldown:17},
  {cookie_name:"Space Doughnut",primary_color:"Pink",secondary_color:"Brown",rarity:"Epic",type:"Charge",position:"Front",skill_name:"Doughnut Beam",skill_cooldown:12},
  {cookie_name:"Sparkling Cookie",primary_color:"Yellow",secondary_color:"Black",rarity:"Epic",type:"Healing",position:"Rear",skill_name:"Sparkling Cocktail",skill_cooldown:13},
  {cookie_name:"Squid Ink Cookie",primary_color:"Black",secondary_color:"Blue",rarity:"Epic",type:"Magic",position:"Middle",skill_name:"Ink Tentacle Slap",skill_cooldown:16},
  {cookie_name:"Star Coral Cookie",primary_color:"Black",secondary_color:"Blue",rarity:"Epic",type:"Support",position:"Rear",skill_name:"Twinkling Coral",skill_cooldown:14},
  {cookie_name:"Stardust Cookie",primary_color:"Blue",secondary_color:"Black",rarity:"Super Epic",type:"Ambush",position:"Middle",skill_name:"Wrath of the Stars",skill_cooldown:13},
  {cookie_name:"Stormbringer Cookie",primary_color:"Yellow",secondary_color:"Black",rarity:"Legendary",type:"Charge",position:"Front",skill_name:"Lightning Blitzstorm",skill_cooldown:13},
  {cookie_name:"Strawberry Cookie",primary_color:"Pink",secondary_color:"Brown",rarity:"Common",type:"Defense",position:"Front",skill_name:"Dont Come Near!",skill_cooldown:10},
  {cookie_name:"Strawberry Crepe Cookie",primary_color:"Pink",secondary_color:"Brown",rarity:"Epic",type:"Defense",position:"Front",skill_name:"Crepe Thrust",skill_cooldown:15},
  {cookie_name:"Street Urchin Cookie",primary_color:"Black",secondary_color:"Brown",rarity:"Epic",type:"Bomber",position:"Middle",skill_name:"Ride or Crumble",skill_cooldown:12},
  {cookie_name:"Sugarfly Cookie",primary_color:"Yellow",secondary_color:"Blue",rarity:"Epic",type:"Support",position:"Rear",skill_name:"Butterflys Whisper",skill_cooldown:6},
  {cookie_name:"Tails Cookie",primary_color:"Orange",secondary_color:"White",rarity:"Special",type:"Ambush",position:"Middle",skill_name:"Tails Spin Dash",skill_cooldown:17},
  {cookie_name:"Tarte Tatin Cookie",primary_color:"Red",secondary_color:"Gray",rarity:"Epic",type:"Ranged",position:"Rear",skill_name:"Cannonade",skill_cooldown:12},
  {cookie_name:"Tea Knight Cookie",primary_color:"Gray",secondary_color:"Blue",rarity:"Epic",type:"Charge",position:"Front",skill_name:"Battlemaster",skill_cooldown:18},
  {cookie_name:"Tiger Lily Cookie",primary_color:"Blue",secondary_color:"Orange",rarity:"Epic",type:"Ranged",position:"Rear",skill_name:"Tiger Rider",skill_cooldown:13},
  {cookie_name:"Twizzly Gummy Cookie",primary_color:"Blue",secondary_color:"Pink",rarity:"Epic",type:"Ranged",position:"Rear",skill_name:"Twizzly Beam",skill_cooldown:16},
  {cookie_name:"Vampire Cookie",primary_color:"Red",secondary_color:"Black",rarity:"Epic",type:"Ambush",position:"Rear",skill_name:"Vampirism",skill_cooldown:13},
  {cookie_name:"Venom Dough Cookie",primary_color:"White",secondary_color:"Purple",rarity:"Super Epic",type:"Bomber",position:"Rear",skill_name:"Mind Venom",skill_cooldown:14},
  {cookie_name:"Wedding Cake Cookie",primary_color:"Pink",secondary_color:"White",rarity:"Epic",type:"Magic",position:"Middle",skill_name:"Anything for the Bride!",skill_cooldown:15},
  {cookie_name:"Werewolf Cookie",primary_color:"Gray",secondary_color:"White",rarity:"Epic",type:"Charge",position:"Front",skill_name:"Transformation",skill_cooldown:11},
  {cookie_name:"White Lily Cookie",primary_color:"Green",secondary_color:"White",rarity:"Ancient",type:"Bomber",position:"Middle",skill_name:"Lily Bud",skill_cooldown:15},
  {cookie_name:"Wildberry Cookie",primary_color:"White",secondary_color:"Red",rarity:"Epic",type:"Defense",position:"Front",skill_name:"Wild Punch",skill_cooldown:10},
  {cookie_name:"Wind Archer Cookie",primary_color:"Green",secondary_color:"White",rarity:"Legendary",type:"Ranged",position:"Rear",skill_name:"Last Wind",skill_cooldown:6},
  {cookie_name:"Wizard Cookie",primary_color:"Blue",secondary_color:"White",rarity:"Common",type:"Magic",position:"Middle",skill_name:"Magic Storm",skill_cooldown:13},
];

// ─────────────────────────────────────────
// DAILY TARGET — server-side only
// COOKIE_SECRET is an env variable set in
// the Cloudflare dashboard. Nobody can see it.
// ─────────────────────────────────────────
async function getDailyTarget(secret) {
  const now = new Date();
  const dateStr = `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}`;
  const msgBuffer = new TextEncoder().encode(dateStr + secret);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashInt = hashArray.slice(0, 4).reduce((acc, b) => (acc * 256 + b) >>> 0, 0);
  return COOKIES[hashInt % COOKIES.length];
}

// Game 2 target — different cookie, uses a different hash offset
async function getDailyTarget2(secret) {
  const now = new Date();
  const dateStr = `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}-skill`;
  const msgBuffer = new TextEncoder().encode(dateStr + secret);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashInt = hashArray.slice(0, 4).reduce((acc, b) => (acc * 256 + b) >>> 0, 0);
  return COOKIES[hashInt % COOKIES.length];
}

// ─────────────────────────────────────────
// CORS HEADERS — allow your GitHub Pages domain
// Update ALLOWED_ORIGIN to your actual URL
// ─────────────────────────────────────────
const ALLOWED_ORIGIN = 'https://dange134.github.io';

function corsHeaders(origin) {
  const allowed = origin === ALLOWED_ORIGIN || origin?.endsWith('.github.io');
  return {
    'Access-Control-Allow-Origin': allowed ? origin : ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function jsonResponse(data, status = 200, origin = '') {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin),
    },
  });
}

// ─────────────────────────────────────────
// EVALUATE A GUESS AGAINST TARGET
// Returns trait results without revealing target
// ─────────────────────────────────────────
function evaluateGuess(guess, target) {
  const cmp = (a, b) => a.toLowerCase() === b.toLowerCase();
  return {
    cookie_name:     guess.cookie_name,
    primary_color:   cmp(guess.primary_color,   target.primary_color)   ? 'correct'
                   : cmp(guess.primary_color,   target.secondary_color) ? 'partial' : 'wrong',
    secondary_color: cmp(guess.secondary_color, target.secondary_color) ? 'correct'
                   : cmp(guess.secondary_color, target.primary_color)   ? 'partial' : 'wrong',
    rarity:          cmp(guess.rarity,    target.rarity)    ? 'correct' : 'wrong',
    type:            cmp(guess.type,      target.type)      ? 'correct' : 'wrong',
    position:        cmp(guess.position,  target.position)  ? 'correct' : 'wrong',
    correct:         cmp(guess.cookie_name, target.cookie_name),
  };
}

// ─────────────────────────────────────────
// MAIN HANDLER
// ─────────────────────────────────────────
export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const url    = new URL(request.url);

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    const target  = await getDailyTarget(env.COOKIE_SECRET);
    const target2 = await getDailyTarget2(env.COOKIE_SECRET);

    // POST /guess — check a guess, return trait results
    if (url.pathname === '/guess' && request.method === 'POST') {
      let body;
      try {
        body = await request.json();
      } catch {
        return jsonResponse({ error: 'Invalid JSON' }, 400, origin);
      }

      const guessName = (body.guess || '').trim().toLowerCase();
      if (!guessName) {
        return jsonResponse({ error: 'No guess provided' }, 400, origin);
      }

      const guessCookie = COOKIES.find(c => c.cookie_name.toLowerCase() === guessName);
      if (!guessCookie) {
        return jsonResponse({ error: 'Cookie not found' }, 404, origin);
      }

      const result = evaluateGuess(guessCookie, target);

      // If correct, also return skill info for the victory screen
      if (result.correct) {
        result.skill_name     = target.skill_name     || '';
        result.skill_cooldown = target.skill_cooldown || 0;
        result.cookie_name    = target.cookie_name;
      }

      return jsonResponse(result, 200, origin);
    }

    // GET /hint?trait=rarity — reveal one trait value (only called after 5 wrong guesses)
    if (url.pathname === '/hint' && request.method === 'GET') {
      const trait = url.searchParams.get('trait');
      const valid = ['primary_color','secondary_color','rarity','type','position'];
      if (!valid.includes(trait)) {
        return jsonResponse({ error: 'Invalid trait' }, 400, origin);
      }
      return jsonResponse({ trait, value: target[trait] }, 200, origin);
    }

    // GET /cookies — returns full cookie list for autocomplete/display
    // Safe to expose: no target info, just the cookie attributes
    if (url.pathname === '/cookies' && request.method === 'GET') {
      return jsonResponse(COOKIES, 200, origin);
    }

    // GET /skill — returns today's skill name and cooldown for game 2
    // Safe to expose: reveals skill but not which cookie owns it
    if (url.pathname === '/skill' && request.method === 'GET') {
      return jsonResponse({
        skill_name:     target2.skill_name,
        skill_cooldown: target2.skill_cooldown,
      }, 200, origin);
    }

    // POST /guess2 — check a game 2 guess (which cookie owns the skill)
    if (url.pathname === '/guess2' && request.method === 'POST') {
      let body;
      try {
        body = await request.json();
      } catch {
        return jsonResponse({ error: 'Invalid JSON' }, 400, origin);
      }

      const guessName = (body.guess || '').trim().toLowerCase();
      if (!guessName) {
        return jsonResponse({ error: 'No guess provided' }, 400, origin);
      }

      const correct = guessName === target2.cookie_name.toLowerCase();
      return jsonResponse({
        correct,
        cookie_name: correct ? target2.cookie_name : undefined,
      }, 200, origin);
    }

    // GET /hint2 — reveals rarity, type, and position after 5 wrong guesses
    if (url.pathname === '/hint2' && request.method === 'GET') {
      return jsonResponse({
        rarity:   target2.rarity,
        type:     target2.type,
        position: target2.position,
      }, 200, origin);
    }

    // GET /cookie-count — how many cookies total (for debugging)
    if (url.pathname === '/cookie-count') {
      return jsonResponse({ count: COOKIES.length }, 200, origin);
    }

    return jsonResponse({ error: 'Not found' }, 404, origin);
  },
};// worker.js — Cookiedle Cloudflare Worker
// Deploy this at: https://dash.cloudflare.com → Workers
// Set environment variable: COOKIE_SECRET = any long random string you choose

const COOKIES = [
  {cookie_name:"Adventurer Cookie",primary_color:"Brown",secondary_color:"White",rarity:"Rare",type:"Ambush",position:"Middle"},
  {cookie_name:"Affogato Cookie",primary_color:"Purple",secondary_color:"Brown",rarity:"Epic",type:"Bomber",position:"Middle"},
  {cookie_name:"Agar Agar Cookie",primary_color:"Gray",secondary_color:"Red",rarity:"Epic",type:"Ambush",position:"Middle"},
  {cookie_name:"Alchemist Cookie",primary_color:"Purple",secondary_color:"Brown",rarity:"Rare",type:"Bomber",position:"Middle"},
  {cookie_name:"Almond Cookie",primary_color:"Brown",secondary_color:"White",rarity:"Epic",type:"Support",position:"Rear"},
  {cookie_name:"Angel Cookie",primary_color:"Yellow",secondary_color:"White",rarity:"Common",type:"Healing",position:"Rear"},
  {cookie_name:"Avocado Cookie",primary_color:"Green",secondary_color:"Brown",rarity:"Rare",type:"Defense",position:"Front"},
  {cookie_name:"Beet Cookie",primary_color:"Pink",secondary_color:"Green",rarity:"Common",type:"Ranged",position:"Rear"},
  {cookie_name:"Black Forest Cookie",primary_color:"Brown",secondary_color:"White",rarity:"Epic",type:"Charge",position:"Front"},
  {cookie_name:"Black Lemonade Cookie",primary_color:"Yellow",secondary_color:"Black",rarity:"Epic",type:"Bomber",position:"Middle"},
  {cookie_name:"Black Pearl Cookie",primary_color:"Black",secondary_color:"White",rarity:"Legendary",type:"Ambush",position:"Middle"},
  {cookie_name:"Black Raisin Cookie",primary_color:"Black",secondary_color:"Purple",rarity:"Epic",type:"Ambush",position:"Middle"},
  {cookie_name:"Black Sapphire Cookie",primary_color:"Black",secondary_color:"Purple",rarity:"Epic",type:"Support",position:"Middle"},
  {cookie_name:"Blackberry Cookie",primary_color:"Purple",secondary_color:"Black",rarity:"Rare",type:"Magic",position:"Rear"},
  {cookie_name:"Blueberry Pie Cookie",primary_color:"Blue",secondary_color:"Brown",rarity:"Epic",type:"Magic",position:"Middle"},
  {cookie_name:"Burning Spice Cookie",primary_color:"Red",secondary_color:"Black",rarity:"Beast",type:"Charge",position:"Front"},
  {cookie_name:"Burnt Cheese Cookie",primary_color:"Black",secondary_color:"Brown",rarity:"Epic",type:"Charge",position:"Front"},
  {cookie_name:"Butter Roll Cookie",primary_color:"White",secondary_color:"Red",rarity:"Epic",type:"Charge",position:"Front"},
  {cookie_name:"Camellia Cookie",primary_color:"Green",secondary_color:"White",rarity:"Super Epic",type:"Charge",position:"Front"},
  {cookie_name:"Candy Apple Cookie",primary_color:"Red",secondary_color:"Black",rarity:"Epic",type:"Bomber",position:"Middle"},
  {cookie_name:"Candy Diver Cookie",primary_color:"Red",secondary_color:"Blue",rarity:"Epic",type:"Support",position:"Rear"},
  {cookie_name:"Capsaicin Cookie",primary_color:"Orange",secondary_color:"Black",rarity:"Super Epic",type:"Charge",position:"Front"},
  {cookie_name:"Captain Caviar Cookie",primary_color:"Black",secondary_color:"Yellow",rarity:"Epic",type:"Bomber",position:"Middle"},
  {cookie_name:"Caramel Arrow Cookie",primary_color:"Black",secondary_color:"Brown",rarity:"Epic",type:"Ranged",position:"Front"},
  {cookie_name:"Caramel Choux Cookie",primary_color:"Brown",secondary_color:"Yellow",rarity:"Epic",type:"Support",position:"Rear"},
  {cookie_name:"Carol Cookie",primary_color:"Green",secondary_color:"Brown",rarity:"Epic",type:"Healing",position:"Rear"},
  {cookie_name:"Carrot Cookie",primary_color:"Orange",secondary_color:"Brown",rarity:"Rare",type:"Support",position:"Middle"},
  {cookie_name:"Charcoal Cookie",primary_color:"Black",secondary_color:"Gray",rarity:"Epic",type:"Magic",position:"Rear"},
  {cookie_name:"Cherry Blossom Cookie",primary_color:"Pink",secondary_color:"Brown",rarity:"Epic",type:"Ambush",position:"Rear"},
  {cookie_name:"Cherry Cookie",primary_color:"Red",secondary_color:"White",rarity:"Rare",type:"Bomber",position:"Rear"},
  {cookie_name:"Chess Choco Cookie",primary_color:"White",secondary_color:"Brown",rarity:"Epic",type:"Bomber",position:"Rear"},
  {cookie_name:"Chili Pepper Cookie",primary_color:"Red",secondary_color:"Black",rarity:"Epic",type:"Ambush",position:"Middle"},
  {cookie_name:"Choco Drizzle Cookie",primary_color:"Black",secondary_color:"Brown",rarity:"Epic",type:"Ambush",position:"Middle"},
  {cookie_name:"Clotted Cream Cookie",primary_color:"Yellow",secondary_color:"White",rarity:"Super Epic",type:"Magic",position:"Middle"},
  {cookie_name:"Cloud Haetae Cookie",primary_color:"White",secondary_color:"Brown",rarity:"Epic",type:"Defense",position:"Front"},
  {cookie_name:"Clover Cookie",primary_color:"Green",secondary_color:"White",rarity:"Rare",type:"Support",position:"Rear"},
  {cookie_name:"Cocoa Cookie",primary_color:"White",secondary_color:"Brown",rarity:"Epic",type:"Defense",position:"Front"},
  {cookie_name:"Cotton Cookie",primary_color:"White",secondary_color:"Brown",rarity:"Epic",type:"Support",position:"Rear"},
  {cookie_name:"Cream Ferret Cookie",primary_color:"White",secondary_color:"Yellow",rarity:"Special",type:"Support",position:"Rear"},
  {cookie_name:"Cream Puff Cookie",primary_color:"Brown",secondary_color:"Blue",rarity:"Epic",type:"Support",position:"Rear"},
  {cookie_name:"Cream Soda Cookie",primary_color:"Blue",secondary_color:"Pink",rarity:"Epic",type:"Charge",position:"Front"},
  {cookie_name:"Cream Unicorn Cookie",primary_color:"White",secondary_color:"Pink",rarity:"Epic",type:"Healing",position:"Rear"},
  {cookie_name:"Crimson Coral Cookie",primary_color:"Red",secondary_color:"Pink",rarity:"Super Epic",type:"Defense",position:"Front"},
  {cookie_name:"Crunchy Chip Cookie",primary_color:"White",secondary_color:"Black",rarity:"Epic",type:"Charge",position:"Front"},
  {cookie_name:"Crème Brûlée Cookie",primary_color:"Yellow",secondary_color:"Brown",rarity:"Epic",type:"Ranged",position:"Rear"},
  {cookie_name:"Custard Cookie III",primary_color:"Brown",secondary_color:"White",rarity:"Rare",type:"Healing",position:"Rear"},
  {cookie_name:"Dark Cacao Cookie",primary_color:"Black",secondary_color:"Purple",rarity:"Ancient",type:"Charge",position:"Front"},
  {cookie_name:"Dark Choco Cookie",primary_color:"Black",secondary_color:"Brown",rarity:"Epic",type:"Charge",position:"Front"},
  {cookie_name:"Dark Enchantress Cookie",primary_color:"Red",secondary_color:"White",rarity:"Witch",type:"Magic",position:"Middle"},
  {cookie_name:"Devil Cookie",primary_color:"Red",secondary_color:"Black",rarity:"Rare",type:"Magic",position:"Middle"},
  {cookie_name:"Doughael Cookie",primary_color:"White",secondary_color:"Brown",rarity:"Super Epic",type:"Healing",position:"Middle"},
  {cookie_name:"Eclair Cookie",primary_color:"Green",secondary_color:"White",rarity:"Epic",type:"Support",position:"Middle"},
  {cookie_name:"Elder Faerie Cookie",primary_color:"Gray",secondary_color:"White",rarity:"Super Epic",type:"Defense",position:"Front"},
  {cookie_name:"Elphaba Cookie",primary_color:"Black",secondary_color:"Green",rarity:"Special",type:"Magic",position:"Rear"},
  {cookie_name:"Espresso Cookie",primary_color:"Black",secondary_color:"Brown",rarity:"Epic",type:"Magic",position:"Middle"},
  {cookie_name:"Eternal Sugar Cookie",primary_color:"Pink",secondary_color:"Purple",rarity:"Beast",type:"Bomber",position:"Middle"},
  {cookie_name:"Fettuccine Cookie",primary_color:"Yellow",secondary_color:"Brown",rarity:"Epic",type:"Defense",position:"Front"},
  {cookie_name:"Fig Cookie",primary_color:"Purple",secondary_color:"Brown",rarity:"Epic",type:"Support",position:"Middle"},
  {cookie_name:"Financier Cookie",primary_color:"Yellow",secondary_color:"White",rarity:"Epic",type:"Defense",position:"Front"},
  {cookie_name:"Fire Spirit Cookie",primary_color:"Red",secondary_color:"Yellow",rarity:"Legendary",type:"Magic",position:"Rear"},
  {cookie_name:"Frilled Jellyfish Cookie",primary_color:"White",secondary_color:"Blue",rarity:"Epic",type:"Support",position:"Middle"},
  {cookie_name:"Frost Queen Cookie",primary_color:"White",secondary_color:"Blue",rarity:"Legendary",type:"Magic",position:"Middle"},
  {cookie_name:"GingerBrave",primary_color:"Brown",secondary_color:"Blue",rarity:"Common",type:"Charge",position:"Front"},
  {cookie_name:"Glinda Cookie",primary_color:"Pink",secondary_color:"Yellow",rarity:"Special",type:"Magic",position:"Rear"},
  {cookie_name:"Golden Cheese Cookie",primary_color:"Yellow",secondary_color:"Brown",rarity:"Ancient",type:"Ranged",position:"Middle"},
  {cookie_name:"Golden Osmanthus Cookie",primary_color:"Yellow",secondary_color:"White",rarity:"Epic",type:"Bomber",position:"Middle"},
  {cookie_name:"Grapefruit Cookie",primary_color:"Red",secondary_color:"Green",rarity:"Epic",type:"Charge",position:"Front"},
  {cookie_name:"Green Tea Mousse Cookie",primary_color:"Green",secondary_color:"Brown",rarity:"Epic",type:"Defense",position:"Front"},
  {cookie_name:"Gumball Cookie",primary_color:"Blue",secondary_color:"Red",rarity:"Rare",type:"Bomber",position:"Rear"},
  {cookie_name:"Herb Cookie",primary_color:"Green",secondary_color:"Brown",rarity:"Epic",type:"Healing",position:"Rear"},
  {cookie_name:"Hollyberry Cookie",primary_color:"Pink",secondary_color:"Red",rarity:"Ancient",type:"Defense",position:"Front"},
  {cookie_name:"Icicle Yeti Cookie",primary_color:"Blue",secondary_color:"White",rarity:"Special",type:"Healing",position:"Front"},
  {cookie_name:"Jagae Cookie",primary_color:"Purple",secondary_color:"White",rarity:"Epic",type:"Support",position:"Front"},
  {cookie_name:"Knight Cookie",primary_color:"White",secondary_color:"Blue",rarity:"Rare",type:"Defense",position:"Front"},
  {cookie_name:"Kouign-Amann Cookie",primary_color:"Pink",secondary_color:"Yellow",rarity:"Epic",type:"Defense",position:"Front"},
  {cookie_name:"Kumiho Cookie",primary_color:"Red",secondary_color:"Blue",rarity:"Epic",type:"Charge",position:"Front"},
  {cookie_name:"Latte Cookie",primary_color:"Brown",secondary_color:"White",rarity:"Epic",type:"Magic",position:"Middle"},
  {cookie_name:"Lemon Cookie",primary_color:"Yellow",secondary_color:"Blue",rarity:"Epic",type:"Ambush",position:"Middle"},
  {cookie_name:"Licorice Cookie",primary_color:"Black",secondary_color:"White",rarity:"Epic",type:"Magic",position:"Middle"},
  {cookie_name:"Lilac Cookie",primary_color:"Purple",secondary_color:"White",rarity:"Epic",type:"Support",position:"Middle"},
  {cookie_name:"Lime Cookie",primary_color:"Green",secondary_color:"Brown",rarity:"Epic",type:"Support",position:"Rear"},
  {cookie_name:"Linzer Cookie",primary_color:"Red",secondary_color:"Brown",rarity:"Epic",type:"Support",position:"Rear"},
  {cookie_name:"Macaron Cookie",primary_color:"Red",secondary_color:"White",rarity:"Epic",type:"Magic",position:"Middle"},
  {cookie_name:"Madeleine Cookie",primary_color:"White",secondary_color:"Blue",rarity:"Epic",type:"Defense",position:"Front"},
  {cookie_name:"Mala Sauce Cookie",primary_color:"Red",secondary_color:"Gray",rarity:"Epic",type:"Charge",position:"Front"},
  {cookie_name:"Mango Cookie",primary_color:"Orange",secondary_color:"Green",rarity:"Epic",type:"Magic",position:"Middle"},
  {cookie_name:"Manju Cookie",primary_color:"Brown",secondary_color:"Red",rarity:"Epic",type:"Ambush",position:"Rear"},
  {cookie_name:"Marshmallow Bunny Cookie",primary_color:"Pink",secondary_color:"Blue",rarity:"Special",type:"Support",position:"Rear"},
  {cookie_name:"Matcha Cookie",primary_color:"Green",secondary_color:"Brown",rarity:"Epic",type:"Magic",position:"Middle"},
  {cookie_name:"Menthol Cookie",primary_color:"Blue",secondary_color:"White",rarity:"Epic",type:"Bomber",position:"Rear"},
  {cookie_name:"Mercurial Knight Cookie",primary_color:"Gray",secondary_color:"White",rarity:"Epic",type:"Charge",position:"Front"},
  {cookie_name:"Milk Cookie",primary_color:"White",secondary_color:"Blue",rarity:"Epic",type:"Defense",position:"Front"},
  {cookie_name:"Milky Way Cookie",primary_color:"Black",secondary_color:"White",rarity:"Epic",type:"Charge",position:"Front"},
  {cookie_name:"Millenial Tree Cookie",primary_color:"Brown",secondary_color:"Green",rarity:"Legendary",type:"Support",position:"Front"},
  {cookie_name:"Mint Choco Cookie",primary_color:"Blue",secondary_color:"White",rarity:"Epic",type:"Support",position:"Rear"},
  {cookie_name:"Mold Dough Cookie",primary_color:"Black",secondary_color:"Brown",rarity:"Epic",type:"Charge",position:"Front"},
  {cookie_name:"Moon Rabbit Cookie",primary_color:"White",secondary_color:"Pink",rarity:"Epic",type:"Defense",position:"Front"},
  {cookie_name:"Moonlight Cookie",primary_color:"Blue",secondary_color:"Black",rarity:"Legendary",type:"Magic",position:"Middle"},
  {cookie_name:"Mozzarella Cookie",primary_color:"Yellow",secondary_color:"Brown",rarity:"Epic",type:"Magic",position:"Middle"},
  {cookie_name:"Muscle Cookie",primary_color:"Black",secondary_color:"Brown",rarity:"Common",type:"Charge",position:"Front"},
  {cookie_name:"Mystic Flour Cookie",primary_color:"White",secondary_color:"Brown",rarity:"Beast",type:"Healing",position:"Rear"},
  {cookie_name:"Ninja Cookie",primary_color:"Blue",secondary_color:"Brown",rarity:"Common",type:"Ambush",position:"Middle"},
  {cookie_name:"Nutmeg Tiger Cookie",primary_color:"Red",secondary_color:"Brown",rarity:"Epic",type:"Support",position:"Front"},
  {cookie_name:"Okchun Cookie",primary_color:"White",secondary_color:"Red",rarity:"Epic",type:"Healing",position:"Middle"},
  {cookie_name:"Olive Cookie",primary_color:"Green",secondary_color:"Brown",rarity:"Epic",type:"Support",position:"Rear"},
  {cookie_name:"Onion Cookie",primary_color:"Purple",secondary_color:"White",rarity:"Rare",type:"Support",position:"Middle"},
  {cookie_name:"Orange Cookie",primary_color:"Orange",secondary_color:"Brown",rarity:"Epic",type:"Magic",position:"Rear"},
  {cookie_name:"Oyster Cookie",primary_color:"White",secondary_color:"Gray",rarity:"Super Epic",type:"Support",position:"Rear"},
  {cookie_name:"Pancake Cookie",primary_color:"Brown",secondary_color:"White",rarity:"Rare",type:"Ambush",position:"Rear"},
  {cookie_name:"Parfait Cookie",primary_color:"White",secondary_color:"Pink",rarity:"Epic",type:"Support",position:"Rear"},
  {cookie_name:"Pastry Cookie",primary_color:"White",secondary_color:"Purple",rarity:"Epic",type:"Ranged",position:"Rear"},
  {cookie_name:"Pavlova Cookie",primary_color:"Pink",secondary_color:"Red",rarity:"Epic",type:"Ranged",position:"Rear"},
  {cookie_name:"Peach Blossom Cookie",primary_color:"Pink",secondary_color:"White",rarity:"Epic",type:"Support",position:"Middle"},
  {cookie_name:"Peppermint Cookie",primary_color:"Blue",secondary_color:"White",rarity:"Epic",type:"Support",position:"Rear"},
  {cookie_name:"Pinecone Cookie",primary_color:"Brown",secondary_color:"Green",rarity:"Epic",type:"Bomber",position:"Front"},
  {cookie_name:"Pitaya Dragon Cookie",primary_color:"Red",secondary_color:"White",rarity:"Dragon",type:"Charge",position:"Front"},
  {cookie_name:"Poison Mushroom Cookie",primary_color:"Purple",secondary_color:"Brown",rarity:"Epic",type:"Bomber",position:"Middle"},
  {cookie_name:"Pom-pom Dough Cookie",primary_color:"White",secondary_color:"Green",rarity:"Epic",type:"Support",position:"Middle"},
  {cookie_name:"Pomegranate Cookie",primary_color:"Red",secondary_color:"Green",rarity:"Epic",type:"Support",position:"Middle"},
  {cookie_name:"Princess Cookie",primary_color:"Pink",secondary_color:"White",rarity:"Rare",type:"Charge",position:"Front"},
  {cookie_name:"Prophet Cookie",primary_color:"Brown",secondary_color:"Purple",rarity:"Epic",type:"Support",position:"Rear"},
  {cookie_name:"Prune Juice Cookie",primary_color:"Purple",secondary_color:"Black",rarity:"Epic",type:"Bomber",position:"Middle"},
  {cookie_name:"Pudding à la Mode Cookie",primary_color:"White",secondary_color:"Brown",rarity:"Epic",type:"Bomber",position:"Rear"},
  {cookie_name:"Pumpkin Pie Cookie",primary_color:"Orange",secondary_color:"Black",rarity:"Epic",type:"Magic",position:"Middle"},
  {cookie_name:"Pure Vanilla Cookie",primary_color:"Yellow",secondary_color:"White",rarity:"Ancient",type:"Healing",position:"Rear"},
  {cookie_name:"Purple Yam Cookie",primary_color:"Purple",secondary_color:"Pink",rarity:"Epic",type:"Charge",position:"Front"},
  {cookie_name:"Raspberry Cookie",primary_color:"Pink",secondary_color:"White",rarity:"Epic",type:"Charge",position:"Front"},
  {cookie_name:"Rebel Cookie",primary_color:"Blue",secondary_color:"White",rarity:"Epic",type:"Ambush",position:"Front"},
  {cookie_name:"Red Osmanthus Cookie",primary_color:"Red",secondary_color:"White",rarity:"Epic",type:"Ranged",position:"Middle"},
  {cookie_name:"Red Velvet Cookie",primary_color:"Red",secondary_color:"White",rarity:"Epic",type:"Charge",position:"Front"},
  {cookie_name:"Rockstar Cookie",primary_color:"Red",secondary_color:"Gray",rarity:"Epic",type:"Healing",position:"Middle"},
  {cookie_name:"Royal Margarine Cookie",primary_color:"Brown",secondary_color:"White",rarity:"Epic",type:"Ambush",position:"Middle"},
  {cookie_name:"Rye Cookie",primary_color:"Brown",secondary_color:"Red",rarity:"Epic",type:"Ranged",position:"Rear"},
  {cookie_name:"Salt Cellar Cookie",primary_color:"White",secondary_color:"Gray",rarity:"Epic",type:"Defense",position:"Front"},
  {cookie_name:"Schwarzwälder",primary_color:"Brown",secondary_color:"Red",rarity:"Epic",type:"Charge",position:"Front"},
  {cookie_name:"Sea Fairy Cookie",primary_color:"Blue",secondary_color:"White",rarity:"Legendary",type:"Bomber",position:"Middle"},
  {cookie_name:"Seltzer Cookie",primary_color:"White",secondary_color:"Blue",rarity:"Epic",type:"Support",position:"Rear"},
  {cookie_name:"Shadow Milk Cookie",primary_color:"Blue",secondary_color:"Black",rarity:"Beast",type:"Magic",position:"Middle"},
  {cookie_name:"Sherbet Cookie",primary_color:"White",secondary_color:"Blue",rarity:"Super Epic",type:"Ranged",position:"Middle"},
  {cookie_name:"Shining Glitter Cookie",primary_color:"Pink",secondary_color:"Black",rarity:"Super Epic",type:"Magic",position:"Middle"},
  {cookie_name:"Silent Salt Cookie",primary_color:"Black",secondary_color:"Gray",rarity:"Beast",type:"Ambush",position:"Front"},
  {cookie_name:"Silverbell Cookie",primary_color:"White",secondary_color:"Gray",rarity:"Epic",type:"Support",position:"Rear"},
  {cookie_name:"Smoked Cheese Cookie",primary_color:"Red",secondary_color:"Yellow",rarity:"Epic",type:"Magic",position:"Rear"},
  {cookie_name:"Snapdragon Cookie",primary_color:"Pink",secondary_color:"White",rarity:"Special",type:"Support",position:"Rear"},
  {cookie_name:"Snow Sugar Cookie",primary_color:"Blue",secondary_color:"White",rarity:"Epic",type:"Magic",position:"Middle"},
  {cookie_name:"Sonic Cookie",primary_color:"Blue",secondary_color:"White",rarity:"Special",type:"Ambush",position:"Middle"},
  {cookie_name:"Sorbet Shark Cookie",primary_color:"Brown",secondary_color:"Blue",rarity:"Epic",type:"Ambush",position:"Middle"},
  {cookie_name:"Space Doughnut",primary_color:"Pink",secondary_color:"Brown",rarity:"Epic",type:"Charge",position:"Front"},
  {cookie_name:"Sparkling Cookie",primary_color:"Yellow",secondary_color:"Black",rarity:"Epic",type:"Healing",position:"Rear"},
  {cookie_name:"Squid Ink Cookie",primary_color:"Black",secondary_color:"Blue",rarity:"Epic",type:"Magic",position:"Middle"},
  {cookie_name:"Star Coral Cookie",primary_color:"Black",secondary_color:"Blue",rarity:"Epic",type:"Support",position:"Rear"},
  {cookie_name:"Stardust Cookie",primary_color:"Blue",secondary_color:"Black",rarity:"Super Epic",type:"Ambush",position:"Middle"},
  {cookie_name:"Stormbringer Cookie",primary_color:"Yellow",secondary_color:"Black",rarity:"Legendary",type:"Charge",position:"Front"},
  {cookie_name:"Strawberry Cookie",primary_color:"Pink",secondary_color:"Brown",rarity:"Common",type:"Defense",position:"Front"},
  {cookie_name:"Strawberry Crepe Cookie",primary_color:"Pink",secondary_color:"Brown",rarity:"Epic",type:"Defense",position:"Front"},
  {cookie_name:"Street Urchin Cookie",primary_color:"Black",secondary_color:"Brown",rarity:"Epic",type:"Bomber",position:"Middle"},
  {cookie_name:"Sugarfly Cookie",primary_color:"Yellow",secondary_color:"Blue",rarity:"Epic",type:"Support",position:"Rear"},
  {cookie_name:"Tails Cookie",primary_color:"Orange",secondary_color:"White",rarity:"Special",type:"Ambush",position:"Middle"},
  {cookie_name:"Tarte Tatin Cookie",primary_color:"Red",secondary_color:"Gray",rarity:"Epic",type:"Ranged",position:"Rear"},
  {cookie_name:"Tea Knight Cookie",primary_color:"Gray",secondary_color:"Blue",rarity:"Epic",type:"Charge",position:"Front"},
  {cookie_name:"Tiger Lily Cookie",primary_color:"Blue",secondary_color:"Orange",rarity:"Epic",type:"Ranged",position:"Rear"},
  {cookie_name:"Twizzly Gummy Cookie",primary_color:"Blue",secondary_color:"Pink",rarity:"Epic",type:"Ranged",position:"Rear"},
  {cookie_name:"Vampire Cookie",primary_color:"Red",secondary_color:"Black",rarity:"Epic",type:"Ambush",position:"Rear"},
  {cookie_name:"Venom Dough Cookie",primary_color:"White",secondary_color:"Purple",rarity:"Super Epic",type:"Bomber",position:"Rear"},
  {cookie_name:"Wedding Cake Cookie",primary_color:"Pink",secondary_color:"White",rarity:"Epic",type:"Magic",position:"Middle"},
  {cookie_name:"Werewolf Cookie",primary_color:"Gray",secondary_color:"White",rarity:"Epic",type:"Charge",position:"Front"},
  {cookie_name:"White Lily Cookie",primary_color:"Green",secondary_color:"White",rarity:"Ancient",type:"Bomber",position:"Middle"},
  {cookie_name:"Wildberry Cookie",primary_color:"White",secondary_color:"Red",rarity:"Epic",type:"Defense",position:"Front"},
  {cookie_name:"Wind Archer Cookie",primary_color:"Green",secondary_color:"White",rarity:"Legendary",type:"Ranged",position:"Rear"},
  {cookie_name:"Wizard Cookie",primary_color:"Blue",secondary_color:"White",rarity:"Common",type:"Magic",position:"Middle"},
];

// ─────────────────────────────────────────
// DAILY TARGET — server-side only
// COOKIE_SECRET is an env variable set in
// the Cloudflare dashboard. Nobody can see it.
// ─────────────────────────────────────────
async function getDailyTarget(secret) {
  const now = new Date();
  const dateStr = `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}`;
  const msgBuffer = new TextEncoder().encode(dateStr + secret);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashInt = hashArray.slice(0, 4).reduce((acc, b) => (acc * 256 + b) >>> 0, 0);
  return COOKIES[hashInt % COOKIES.length];
}

// ─────────────────────────────────────────
// CORS HEADERS — allow your GitHub Pages domain
// Update ALLOWED_ORIGIN to your actual URL
// ─────────────────────────────────────────
const ALLOWED_ORIGIN = 'https://dange134.github.io';

function corsHeaders(origin) {
  const allowed = origin === ALLOWED_ORIGIN || origin?.endsWith('.github.io');
  return {
    'Access-Control-Allow-Origin': allowed ? origin : ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function jsonResponse(data, status = 200, origin = '') {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin),
    },
  });
}

// ─────────────────────────────────────────
// EVALUATE A GUESS AGAINST TARGET
// Returns trait results without revealing target
// ─────────────────────────────────────────
function evaluateGuess(guess, target) {
  const cmp = (a, b) => a.toLowerCase() === b.toLowerCase();
  return {
    cookie_name:     guess.cookie_name,
    primary_color:   cmp(guess.primary_color,   target.primary_color)   ? 'correct'
                   : cmp(guess.primary_color,   target.secondary_color) ? 'partial' : 'wrong',
    secondary_color: cmp(guess.secondary_color, target.secondary_color) ? 'correct'
                   : cmp(guess.secondary_color, target.primary_color)   ? 'partial' : 'wrong',
    rarity:          cmp(guess.rarity,    target.rarity)    ? 'correct' : 'wrong',
    type:            cmp(guess.type,      target.type)      ? 'correct' : 'wrong',
    position:        cmp(guess.position,  target.position)  ? 'correct' : 'wrong',
    correct:         cmp(guess.cookie_name, target.cookie_name),
  };
}

// ─────────────────────────────────────────
// MAIN HANDLER
// ─────────────────────────────────────────
export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const url    = new URL(request.url);

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    const target = await getDailyTarget(env.COOKIE_SECRET);

    // POST /guess — check a guess, return trait results
    if (url.pathname === '/guess' && request.method === 'POST') {
      let body;
      try {
        body = await request.json();
      } catch {
        return jsonResponse({ error: 'Invalid JSON' }, 400, origin);
      }

      const guessName = (body.guess || '').trim().toLowerCase();
      if (!guessName) {
        return jsonResponse({ error: 'No guess provided' }, 400, origin);
      }

      const guessCookie = COOKIES.find(c => c.cookie_name.toLowerCase() === guessName);
      if (!guessCookie) {
        return jsonResponse({ error: 'Cookie not found' }, 404, origin);
      }

      const result = evaluateGuess(guessCookie, target);

      // If correct, also return skill info for the victory screen
      if (result.correct) {
        result.skill_name     = target.skill_name     || '';
        result.skill_cooldown = target.skill_cooldown || 0;
        result.cookie_name    = target.cookie_name;
      }

      return jsonResponse(result, 200, origin);
    }

    // GET /hint?trait=rarity — reveal one trait value (only called after 5 wrong guesses)
    if (url.pathname === '/hint' && request.method === 'GET') {
      const trait = url.searchParams.get('trait');
      const valid = ['primary_color','secondary_color','rarity','type','position'];
      if (!valid.includes(trait)) {
        return jsonResponse({ error: 'Invalid trait' }, 400, origin);
      }
      return jsonResponse({ trait, value: target[trait] }, 200, origin);
    }

    // GET /cookies — returns full cookie list for autocomplete/display
    // Safe to expose: no target info, just the cookie attributes
    if (url.pathname === '/cookies' && request.method === 'GET') {
      return jsonResponse(COOKIES, 200, origin);
    }

    // GET /cookie-count — how many cookies total (for debugging)
    if (url.pathname === '/cookie-count') {
      return jsonResponse({ count: COOKIES.length }, 200, origin);
    }

    return jsonResponse({ error: 'Not found' }, 404, origin);
  },
};
