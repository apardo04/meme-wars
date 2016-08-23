var like = "<img id='like' src='img/extras/like.gif'/>";
var user = 9;
var user2 = 8;
var hero = [];
var item = [];
var basicSupp = [];
var epicSupp = [];

// -------- Hero JS -------- //
var spongegar = {name: 'SpongeGar', hp: 160, max_hp: 170, armor: 0, img: 'img/Heroes/spongegar.png', m1: 'Intimidate', m1_energy: 3, m1_dmg: 20, m1_effect: 'Flip a coin. If heads, +10 armor.', m2: 'React', m2_energy: 5, m2_dmg: 50, m2_effect: '', energy: 0, energy_left: 0, intimidate: false};
var datboi = {name: 'Dat Boi', hp: 160, max_hp: 160, armor: 0, img: 'img/Heroes/datboi.png', m1: 'Ohh Shit', m1_energy: 3, m1_dmg: 30, m1_effect: 'Flip a coin. If heads, Waddup does +10 more damage(stacks)', m2: 'Waddup', m2_energy: 5, m2_dmg: 60, m2_effect: '', energy: 0, energy_left: 0};
var pepe = {name: 'Pepe', hp: 120, max_hp: 120, armor: 0, img: 'img/Heroes/pepe.png', m1: 'Feels Bad Man', m1_energy: 1, m1_dmg: 30, m1_effect: 'Flip a coin. If tails, this attack does nothing.', m2: 'Evolve: Final Form Pepe', m2_energy: 4, m2_dmg: 40, m2_effect: '', energy: 0, energy_left: 0};
var finalFormPepe = {name: 'Final Form Pepe', hp: 180, max_hp: 180, armor: 0, img: 'img/Heroes/finalFormPepe.png', m1: 'You Fool', m1_energy: 2, m1_dmg: 40, m1_effect: 'Flip a coin. If tails, this attack does nothing.', m2: 'True Power', m2_energy: 6, m2_dmg: 60, m2_effect: '', energy: 0, energy_left: 0};
var doge = {name: "Doge", hp: 150, max_hp: 150, armor: 0, img: 'img/Heroes/doge.png', m1: 'Such Treat', m1_energy: 2, m1_dmg: 30, m1_effect: 'Flip a coin. If heads, get an item.', m2: 'So Wow', m2_energy: 5, m2_dmg: 60, m2_effect: '', energy: 0, energy_left: 0};
var slenderman = {name: 'Slenderman', hp: 160, max_hp: 160, armor: 0, img: 'img/Heroes/slenderman.jpg', m1: 'Static', m1_energy: 1, m1_dmg: 0, m1_effect: 'Mutilation will now do +20 damage', m2: 'Mutilation', m2_energy: 6, m2_dmg: 0, m2_effect: "This attack reset's to 0 damage.", energy: 0, energy_left: 0};
var harambe = {name: 'Harambe', hp: 200, max_hp: 200, armor: 0, img: 'img/Heroes/harambe2.jpg', m1: 'Drag', m1_energy: 2, m1_dmg: 20, m1_effect: '', m2: 'Dicks Out', m2_energy: 4, m2_dmg: 50, m2_effect: '', energy: 0, energy_left: 0};
var chuckNorris = {name: 'Chuck Norris', hp: 170, max_hp: 170, armor: 0, img: 'img/Heroes/chuckNorris.png', m1: 'Roundhouse', m1_energy: 3, m1_dmg: 30, m1_effect: '', m2: 'Beard Deflect', m2_energy: 5, m2_dmg: 50, m2_effect: 'Flip a coin. If heads, Chuck Norris deflects 20 damage next turn.', energy: 0, energy_left: 0};
var nyanCat = {name: 'Nyan Cat', hp: 130, max_hp: 130, armor: 0, img: 'img/Heroes/nyanCat.png', m1: 'NYANYANYAN', m1_energy: 2, m1_dmg: 0, m1_effect: 'Heal 20 HP', m2: 'Rainbow Blast', m2_energy: 5, m2_dmg: 60, m2_effect: '', energy: 0, energy_left: 0};
var vapeNation = {name: 'Vape Nation', hp: 150, max_hp: 150, armor: 0, img: 'img/Heroes/vapeNation.png', m1:'Vape Screen', m1_energy: 2, m1_dmg: 10, m1_effect: 'Opponent has to flip a coin before attacking next turn.<br>If heads, the attack misses.', m2: 'Fattest Rip', m2_energy: 5, m2_dmg: 50, m2_effect: '', energy: 0, energy_left: 0};
hero[0] = spongegar; hero[1] = datboi; hero[2] = pepe; hero[3] = finalFormPepe;
hero[4] = doge; hero[5] = slenderman; hero[6] = harambe; hero[7] = chuckNorris;
hero[8] = nyanCat; hero[9] = vapeNation;

// -------- Item JS -------- //
var dealWithIt = {name: 'Deal With It', img: 'img/Items/dealWithIt.png', effect: 'Heal +20 HP <br> +1 Like'};
var scumBagSteveHat = {name: 'Scumbag Steve Hat', img: 'img/Items/ScumBagSteveHat.png', effect: 'Opponent loses 1 Like <br> Attached: +10 armor'};
var nokia = {name: "Nokia Phone", img: 'img/Items/nokia.png', effect: '+20 Armor'}
var horseHead = {name: "Horse Head", img: 'img/Items/horseMask.png', effect: "When your opponent attacks,<br> they take 10 damage <br> out of confusion."}
item[0] = dealWithIt; item[1] = scumBagSteveHat; item[2] = nokia; item[3] = horseHead;
var itemCount = item.length - 1;

// -------- Basic Support JS -------- //
var meGusta = {name: 'Me Gusta', img: 'img/supports/megusta.png', effect: '+10 HP<br>While Active:<br>+10 Damage'};
var foreverAlone = {name: 'Forever Alone', img: 'img/supports/foreverAlone.png', effect: 'If this is your only support:<br>+ 20 damage'};
var iFeelIt = {name: "I Feel It", img: 'img/supports/iFeelIt.png', effect: 'Opponent takes 30 damage.<br>You take 10 damage.'}
basicSupp[0] = meGusta; basicSupp[1] = foreverAlone; basicSupp[2] = iFeelIt;
var basicSuppCount = basicSupp.length -1;
var basicSupp2 = basicSupp.slice(0);

// -------- Epic Support JS -------- //
//var ifYouKnowWhatIMean = {name: 'If You know What I Mean', hp: 30, img: 'img/supports/ifyouknowhatimean.png', effect: '+20 Armor <br> If this is your only support:<br>Summon a 1 like support'}
var surpriseMotherfucker = {name: "Surprise Motherfucker", hp: 0, img: 'img/supports/surpriseMotherfucker.gif', effect: 'Opponent takes 30 damage'}
var steamSale = {name: "Steam Sale", hp: 40, img: 'img/supports/steamSale.png', effect: 'Your attacks cost 1 less like'}
epicSupp[0] = surpriseMotherfucker; epicSupp[1] = steamSale;
var epicSuppCount = epicSupp.length -1;
var epicSupp2 = epicSupp.slice(0);
