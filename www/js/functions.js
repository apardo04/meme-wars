var msg = $('#messages');
var userItem = 0;
var userSupp = 0;  // Slot 1 Support
var userSupp2 = 0; // Slot 2 Support
var userItemsAttached =  0; // How many items are attached
var userSuppsSummoned = 0; // How many supports have been summoned
var user2Item = 0;
var user2Supp = 0;
var user2Supp2 = 0;
var user2ItemsAttached =  0;
var user2SuppsSummoned = 0;
var userTurn; // true: user1's turn, false: user2
var extraDmg = 0; // Exrta damage for current turn
var damage = 0; // Damage being done this turn
var energyUsedCounter = 0; // Energies used so far this turn.
var attacked = false; // False: Hasn't attacked this turn
var tempUser; // Dynamic user variable depending on turn
var idNum; // Dynamic HTML id depending on turn
var tempItem // Makes userItem dynamic
var tempOpp;
var idOppNum;
var tempOppItem;
var basicSummoned = false; // If false, current user hasn't played a basic Supp this turn
var epicSummoned = false;
var itemEquipped = false;

// ------- Local Play Functions-------- ///
function tempUserCheck() {
  tempUser = (userTurn) ? user : user2;
  idNum = (userTurn) ? '' : '2';
  tempItem = (userTurn) ? userItem : user2Item;
  tempOpp = (!userTurn) ? user : user2;
  idOppNum = (!userTurn) ? '' : '2';
  tempOppItem = (!userTurn) ? user : user2;
}
function userCardPrint() {
  tempUserCheck();
  $('#move1-cost' + idNum + ' img').remove();
  $('#move2-cost' + idNum + ' img').remove();
  $('#hero-name' + idNum).text(hero[tempUser].name);
  $('#hero-hp' + idNum).text(hero[tempUser].hp);
  $('#hero-img' + idNum).attr("src", hero[tempUser].img);
  $('#move1-name' + idNum).text(hero[tempUser].m1);
  for (var i = 0; i < hero[tempUser].m1_energy; i++) {
    $('#move1-cost' + idNum).prepend(like);
  }
  $('#move1-dmg' + idNum).text(hero[tempUser].m1_dmg);
  $('#move1-effect' + idNum).html(hero[tempUser].m1_effect);
  $('#move2-name' + idNum).text(hero[tempUser].m2);
  for (var i = 0; i < hero[tempUser].m2_energy; i++) {
    $('#move2-cost' + idNum).prepend(like);
  }
  $('#move2-dmg' + idNum).text(hero[tempUser].m2_dmg);
  $('#move2-effect' + idNum).html(hero[tempUser].m2_effect);

  $('#menu' + idNum + '-move').text(hero[tempUser].m1);
  $('#menu' + idNum + '-move2').text(hero[tempUser].m2);
}
function coinFlip() {
  return (Math.floor(Math.random() * 2) == 0);
}
function randomG(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function scroll() {
  console.log("triggered");
  msg.animate({scrollTop: msg.prop("scrollHeight")}, 500);
}
function energyText(energyUsed, likeOpacity) {
  tempUserCheck();
  $('#hero-energy' + idNum + ' span').text("(" + hero[tempUser].energy_left + "/" + hero[tempUser].energy + ")");
  $('#hero-energy' + idOppNum + ' span').text("(" + hero[tempOpp].energy_left + "/" + hero[tempOpp].energy + ")");
  if (likeOpacity) {
    energyUsedCounter += energyUsed;
    $('div#hero-energy' + idNum + ' img').slice(-energyUsedCounter).addClass("likeUsed");
  }
}
function endTurn() {
  tempUserCheck();
  $('div#turn-menu1').toggleClass( "disabled" );
  $('div#turn-menu2').toggleClass('disabled');
  $('div#hero-energy' + idNum + ' img').removeClass("likeUsed");
  msg.append($('<li>').text(hero[tempOpp].name + "'s turn"));
  if (hero[tempOpp].energy < 6) {
    hero[tempOpp].energy++;
    $('#hero-energy' + idOppNum).append(like);
  }
  hero[tempOpp].energy_left = hero[tempOpp].energy;
  hero[tempUser].energy_left = hero[tempUser].energy;
  energyText();
  msg.append($('<li>').text(hero[tempOpp].name + " has " + hero[tempOpp].energy_left + " like's"));
  scroll();
  extraDmg = 0;
  energyUsedCounter = 0;
  attacked = false;
  basicSummoned = false;
  epicSummoned = false;
  itemEquipped = false;
  if (hero[tempOpp].intimidate == true)
    m1_effects(0, true);
  userTurn = !userTurn;
}
function turnCheck() {
  tempUserCheck();
  if (hero[tempOpp].hp <= 0 && hero[tempUser].hp <= 0) {
    $('#hero-hp' + idNum).text("0");
    $('#hero-hp' + idOppNum).text("0");
    msg.append($('<li>').text("It's a draw! For now.."));
    // Tie breaker rules come into play
  }
  else if (hero[tempOpp].hp <= 0) {
    $('#hero-hp' + idOppNum).text("0");
    msg.append($('<li>').text(hero[tempUser].name + " Wins!"));
    $('body').addClass('loser gray');
    var sound = new Howl({
      src: ['audio/soundOfSilence.mp3'],
      volume: 0.5
    });
    sound.play();
    // sweet victory & sound of silence
  }
  // Confusion self kill
  else if (hero[tempUser].hp <= 0) {
    $('#hero-hp' + idNum).text("0");
    msg.append($('<li>').text(hero[tempOpp].name + " Wins!"));
    $('body').addClass('loser gray');
    var sound = new Howl({
      src: ['audio/soundOfSilence.mp3'],
      volume: 0.5
    });
    sound.play();
  }
}
function m1_effects(num, opp) {
  tempUserCheck();
  switch(num) {
    case 0: // SpongeGar's 'Intimidate'
      if (!opp) {
          hero[tempUser].intimidate = true;
          hero[tempUser].armor += 10;
          msg.append($('<li>').text(hero[tempUser].name + " will have +10 armor next turn."));
          $('#armor-text' + idNum + ' span').text('+ ' + hero[tempUser].armor);
        }
        else {
          hero[tempOpp].intimidate = false;
          hero[tempOpp].armor -= 10;
          $('#armor-text' + idOppNum + ' span').text('+ ' + hero[tempOpp].armor);
        }
        break;
    case 1: // Dat Boi's 'Ohh Shit'
      if (coinFlip()) {
        hero[tempUser].m2_dmg += 10;
        $('#move2-dmg' + idNum).text(hero[tempUser].m2_dmg);
        msg.append($('<li>').text("Coin flip result: Heads"));
        msg.append($('<li>').text(hero[tempUser].m2 + " now does " + hero[tempUser].m2_dmg + " damage"));
      }
      else {
        msg.append($('<li>').text("Coin flip result: Tails"));
      }
      break;
    case 2: // Pepe's 'Feels Bad Man' / Final Form Pepe's 'You Fool'
      if (coinFlip()) {
        msg.append($('<li>').text("Coin flip result: Heads"));
      }
      else {
        extraDmg = -hero[tempUser].m1_dmg
        msg.append($('<li>').text("Coin flip result: Tails"));
      }
      break;
    case 4: // Doge's 'Such Treat'
      break;
    case 5: // Slenderman's 'Static'
      hero[tempUser].m2_dmg += 20;
      $('#move2-dmg' + idNum).text(hero[tempUser].m2_dmg);
      break;
    case 8: // Nyan Cat's 'NYANYANYAN'
      hero[tempUser].hp += (hero[tempUser].max_hp - hero[tempUser].hp >= 20) ? 20 : hero[tempUser].max_hp - hero[tempUser].hp;
      $('#hero-hp' + idNum).text(hero[tempUser].hp);
      break;
  }
}
function m2_effects(num) {
  tempUserCheck();
  switch (num) {
    case 5:
      hero[tempUser].m2_dmg = 0;
      $('#move2-dmg' + idNum).text(hero[tempUser].m2_dmg);
  }
}
function evolve() {
  if (userTurn)
    user++;
  else
    user2++;
  tempUserCheck();
  hero[tempUser].hp += (hero[tempUser - 1].hp - hero[tempUser - 1].max_hp);
  hero[tempUser].max_hp += (hero[tempUser - 1].hp - hero[tempUser - 1].max_hp);
  if (hero[tempUser - 1].armor > 0) {
    hero[tempUser].armor = hero[tempUser - 1].armor;
    $('#armor-text' + idNum + ' span').text('+' + hero[tempUser].armor);
    console.log(hero[tempUser].armor + " user armor | " + hero[tempUser - 1].armor + " user - 1 armor |");
  }
  hero[tempUser].energy = hero[tempUser - 1].energy;
  hero[tempUser].energy_left = hero[tempUser - 1].energy_left;
  msg.append($('<li>').text(hero[tempUser - 1].name + " has evolved into " + hero[tempUser].name));
  userCardPrint();
  //console.log("evolve steam sale argument = " + $('#support-name').text() == "Steam Sale" || $('#support2-name').text() == "Steam Sale" );
  if ($('#support-name' + idNum).text() == "Steam Sale" || $('#support2-name' + idNum).text() == "Steam Sale" ) // to do
    EpicSuppEffect(1);
  }
function items() {
  tempUserCheck();
  switch (tempItem) {
    case 0: // dealWithIt
      hero[tempUser].hp += (hero[tempUser].max_hp - hero[tempUser].hp >= 20) ? 20 : hero[tempUser].max_hp - hero[tempUser].hp;
      $('#hero-hp' + idNum).text(hero[tempUser].hp);
      if (hero[tempUser].energy < 6) {
        hero[tempUser].energy++;
        hero[tempUser].energy_left++;
        $('#hero-energy' + idNum).append(like);
        energyText();
      }
      break;
    case 1: // scumbagSteveHat
      hero[tempUser].armor += 10;
      $('#armor-text' + idNum + ' span').text('+ ' + hero[tempUser].armor);
      console.log(hero[tempUser].armor);
      if (hero[tempOpp].energy > 0) {
        hero[tempOpp].energy--;
        hero[tempOpp].energy_left--;
        $('#hero-energy' + idOppNum + ' img:last-child').remove()
        energyText();
      }
      break;
    case 2: // Nokia
      hero[tempUser].armor += 20;
      $('#armor-text' + idNum + ' span').text('+ ' + hero[tempUser].armor);
      break;
  }
}
function confusion() {
  tempUserCheck();
  hero[tempUser].hp -= 10;
  msg.append($('<li>').text(hero[tempUser].name + " took 10 damage out of confusion."));
  $('#hero-hp' + idNum).text(hero[tempUser].hp);
}
function basicSuppPrint(tempSupp, slot2) {
  tempUserCheck();
  var slot = (slot2) ? "2" : ""; // if true, replacing slot 2
  $('#support' + slot + '-name' + idNum).text(basicSupp[tempSupp].name);
  $('#support' + slot + '-hp' + idNum).text(basicSupp[tempSupp].hp);
  $('#support' + slot + '-img' + idNum).attr("src", basicSupp[tempSupp].img);
  $('#support' + slot + '-effect' + idNum).html(basicSupp[tempSupp].effect);
  hero[tempUser].energy_left--;
  energyText(1, true);
  if (tempSupp == 0)
    BasicSuppEffect(0, true); // Me Gusta, Summoned
  if (tempSupp == 2)
    BasicSuppEffect(2); // I Feel It
}
function epicSuppPrint(tempSupp, slot2) {
  tempUserCheck();
  var slot = (slot2) ? "2" : ""; // if true, replacing slot 2
  $('#support' + slot + '-name' + idNum).text(epicSupp[tempSupp].name);
  $('#support' + slot + '-hp' + idNum).text(epicSupp[tempSupp].hp);
  $('#support' + slot + '-img' + idNum).attr("src", epicSupp[tempSupp].img);
  $('#support' + slot + '-effect' + idNum).html(epicSupp[tempSupp].effect);
  hero[tempUser].energy_left-= 3;
  energyText(3, true);
  if (tempSupp == 0)
    EpicSuppEffect(0); // Surprise Motherfucker
  if (tempSupp == 1)
    EpicSuppEffect(1); // Steam Sale
}
function suppReplace() {
  tempUserCheck();
  var tempSupp;
  do {
    tempSupp = randomG(0, basicSuppCount);
    console.log(tempSupp + " = tempSupp");
  } while ($('#support-name' + idNum).text() == basicSupp[tempSupp].name || $('#support2-name' + idNum).text() == basicSupp[tempSupp].name );
  alert("Click on the Support you want to replace.");
  $("#support-card" + idNum).click(function() {
    msg.append($('<li>').text(hero[tempUser].name + " replaced " + $("#support-name" + idNum).text() + " with " + basicSupp[tempSupp].name));
    scroll();
    basicSuppPrint(tempSupp);
    if (userTurn)
      userSupp = tempSupp;
    else
      user2Supp = tempSupp;
    $("#support-card" + idNum).unbind('click');
    $("#support2-card" + idNum).unbind('click');
  });
  $("#support2-card" + idNum).click(function() {
    msg.append($('<li>').text(hero[tempUser].name + " replaced " + $("#support2-name" + idNum).text() + " with " + basicSupp[tempSupp].name));
    scroll();
    basicSuppPrint(tempSupp, true);
    if (userTurn)
      userSupp2 = tempSupp;
    else
      user2Supp2 = tempSupp;
    $("#support-card" + idNum).unbind('click');
    $("#support2-card" + idNum).unbind('click');
  });
  basicSummoned = true;
  return;
}
function BasicSuppEffect(supp, summoned) {
  tempUserCheck();
  switch (supp) {
    case 0: // Me Gusta
      if (summoned) {
        hero[tempUser].hp += 10;
        hero[tempUser].max_hp += 10;
        $('#hero-hp' + idNum).text(hero[tempUser].hp);
        msg.append($('<li>').text(hero[tempUser].name + " now has " + hero[tempUser].hp + " HP"));
      }
      else {
        extraDmg += 10;
      }
      break;
    case 1: // Forever Alone
      extraDmg += 20;
      break;
    case 2: // I Feel It
      hero[tempOpp].hp -= 30;
      $('#hero-hp' + idOppNum).text(hero[tempOpp].hp);
      msg.append($('<li>').text(hero[tempOpp].name + " took 30 damage"));
      hero[tempUser].hp -= 10;
      $('#hero-hp' + idNum).text(hero[tempUser].hp);
      msg.append($('<li>').text(hero[tempUser].name + " took 10 damage"));
  }
}
function EpicSuppEffect(supp) {
  tempUserCheck();
  switch (supp) {
    case 0: // surpriseMotherfucker
      hero[tempOpp].hp -= 30;
      msg.append($('<li>').text(hero[tempOpp].name + " took 30 damage"));
      $('#hero-hp' + idOppNum).text(hero[tempOpp].hp);
      turnCheck();
      break;
    case 1: // steamSale
      hero[tempUser].m1_energy = (hero[tempUser].m1_energy > 0) ? hero[tempUser].m1_energy - 1 : 0;
      hero[tempUser].m2_energy = (hero[tempUser].m2_energy > 0) ? hero[tempUser].m2_energy - 1 : 0;;
      $("#move1-cost" + idNum + " img").remove();
      $("#move2b-cost" + idNum + " img").remove();
      $("#move2-cost" + idNum + " img").remove();
      userCardPrint();
  }
}
