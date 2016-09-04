var msg = $('#messages');
var userItem = 0;
var userSupp = 0;  // HTML Slot 1 Support
var userSupp2 = 0; // HTML Slot 2 Support
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
var player; // Stores 0 for user1 turn, 1 for user2 turn
var tempUser; // Dynamic user variable depending on turn
var idNum; // Dynamic HTML id depending on turn
var tempItem // Makes userItem dynamic
var tempOpp;
var idOppNum;
var tempOppItem;
var newSupp; // Temp var when drawing a new supp
var basicSummoned = false; // If false, current user hasn't played a basic Supp this turn
var epicSummoned = false;
var itemEquipped = false;

// ------- Local Play Functions-------- ///
function tempUserCheck() {
  player = (userTurn) ? 0 : 1;
  tempUser = (userTurn) ? user : user2;
  idNum = (userTurn) ? '' : '2';
  tempItem = (userTurn) ? userItem : user2Item;
  tempOpp = (!userTurn) ? user : user2;
  idOppNum = (!userTurn) ? '' : '2';
  tempOppItem = (!userTurn) ? user2Item : user2Item
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
  //console.log("triggered");
  $('#messages').animate({scrollTop: $('#messages').prop("scrollHeight")}, 500);
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
  $('#messages').append($('<li>').text(hero[tempOpp].name + "'s turn"));
  if (hero[tempOpp].energy < 6) {
    hero[tempOpp].energy++;
    $('#hero-energy' + idOppNum).append(like);
  }
  hero[tempOpp].energy_left = hero[tempOpp].energy;
  hero[tempUser].energy_left = hero[tempUser].energy;
  energyText();
  $('#messages').append($('<li>').text(hero[tempOpp].name + " has " + hero[tempOpp].energy_left + " like's"));
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
    $('#messages').append($('<li>').text("It's a draw! For now.."));
    // Tie breaker rules come into play
  }
  else if (hero[tempOpp].hp <= 0) {
    $('#hero-hp' + idOppNum).text("0");
    $('#messages').append($('<li>').text(hero[tempUser].name + " Wins!"));
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
    $('#messages').append($('<li>').text(hero[tempOpp].name + " Wins!"));
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
          $('#messages').append($('<li>').text(hero[tempUser].name + " will have +10 armor next turn."));
          $('#armor-text' + idNum + ' span').text('+ ' + hero[tempUser].armor);
        }
        else { // Removing intimidate effect
          hero[tempOpp].intimidate = false;
          hero[tempOpp].armor -= 10;
          $('#armor-text' + idOppNum + ' span').text('+ ' + hero[tempOpp].armor);
        }
        break;
    case 1: // Dat Boi's 'Ohh Shit'
      if (coinFlip()) {
        hero[tempUser].m2_dmg += 10;
        $('#move2-dmg' + idNum).text(hero[tempUser].m2_dmg);
        $('#messages').append($('<li>').text("Coin flip result: Heads"));
        $('#messages').append($('<li>').text(hero[tempUser].m2 + " now does " + hero[tempUser].m2_dmg + " damage"));
      }
      else {
        $('#messages').append($('<li>').text("Coin flip result: Tails"));
      }
      break;
    case 2: // Pepe's 'Feels Bad Man' / Final Form Pepe's 'You Fool'
      if (coinFlip()) {
        $('#messages').append($('<li>').text("Coin flip result: Heads"));
      }
      else {
        extraDmg = -hero[tempUser].m1_dmg
        $('#messages').append($('<li>').text("Coin flip result: Tails"));
      }
      break;
    case 4: // Doge's 'Such Treat'
      if (coinFlip()) {
        $('#messages').append($('<li>').text("Coin flip result: Heads"));
        if (itemsArr[player].length > 1) {
          hero[tempUser].suchTreat = true;
          var tempItemsAttached = (userTurn) ? userItemsAttached : user2ItemsAttached;
          itemReplace(tempItemsAttached);
        }
        else {
          $('#messages').append($('<li>').text(hero[tempUser].name + " ran out of item cards."));
        }
      }
      else {
        $('#messages').append($('<li>').text("Coin flip result: Tails"));
      }
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
  $('#messages').append($('<li>').text(hero[tempUser - 1].name + " has evolved into " + hero[tempUser].name));
  userCardPrint();
  //console.log("evolve steam sale argument = " + $('#support-name').text() == "Steam Sale" || $('#support2-name').text() == "Steam Sale" );
  if ($('#support-name' + idNum).text() == "Steam Sale" || $('#support2-name' + idNum).text() == "Steam Sale" ) // to do
    EpicSuppEffect(1);
}
function itemCardPrint() {
  tempUserCheck();
  $('#item-name' + idNum).text(itemsArr[player][tempItem].name);
  $("#item-img" + idNum).attr("src", itemsArr[player][tempItem].img);
  $('#item-effect' + idNum).html(itemsArr[player][tempItem].effect);
  if (!hero[4].suchTreat) {
    hero[tempUser].energy_left -= 2;
    energyText(2, true);
  }
  else {
    hero[4].suchTreat = false;
  }
}
function items() {
  tempUserCheck();
  switch (itemsArr[player][tempItem].name) {
    case 'Deal With It': // dealWithIt
      hero[tempUser].hp += (hero[tempUser].max_hp - hero[tempUser].hp >= 20) ? 20 : hero[tempUser].max_hp - hero[tempUser].hp;
      $('#hero-hp' + idNum).text(hero[tempUser].hp);
      if (hero[tempUser].energy < 6) {
        hero[tempUser].energy++;
        hero[tempUser].energy_left++;
        $('#hero-energy' + idNum).append(like);
        energyText();
      }
      break;
    case 'Scumbag Steve Hat': // scumbagSteveHat
      hero[tempUser].armor += 10;
      $('#armor-text' + idNum + ' span').text('+ ' + hero[tempUser].armor);
      console.log(hero[tempUser].armor + " +10");
      if (hero[tempOpp].energy > 0) {
        hero[tempOpp].energy--;
        hero[tempOpp].energy_left--;
        $('#hero-energy' + idOppNum + ' img:last-child').remove()
        energyText();
      }
      break;
    case 'Nokia Phone': // Nokia
      console.log("items 2 triggered");
      hero[tempUser].armor += 20;
      $('#armor-text' + idNum + ' span').text('+ ' + hero[tempUser].armor);
      break;
  }
}
function itemReplace(itemsAttached) {
  tempUserCheck();
  var newItem;
  if (itemsAttached == 0) {
    newItem = randomG(0, itemsArr[player].length - 1);
    $('#messages').append($('<li>').text(hero[tempUser].name + " attached " + itemsArr[player][newItem].name));
    if (userTurn)
      userItemsAttached++;
    else
      user2ItemsAttached++;
  }
  else {
    if (itemsArr[player][tempItem].name == 'Scumbag Steve Hat') { // Removing Scumbag Steve Hat's armor
      hero[tempUser].armor -= 10;
      $('#armor-text' + idNum + ' span').text('+ ' + hero[tempUser].armor);
    }
    else if (itemsArr[player][tempItem].name == 'Nokia Phone') { // Removing Nokia's armor
      hero[tempUser].armor -= 20;
      $('#armor-text' + idNum + ' span').text('+ ' + hero[tempUser].armor);
    }
    itemsArr[player].splice(tempItem,1);
    newItem = randomG(0, itemsArr[player].length - 1);
    $('#messages').append($('<li>').text(hero[tempUser].name + " replaced " + $("#item-name" + idNum).text() + " with " + itemsArr[player][newItem].name));
  }
  scroll();
  if (userTurn)
    userItem = newItem;
  else
    user2Item = newItem;
  items();
  itemCardPrint();
  itemEquipped = true;
}
function confusion() {
  tempUserCheck();
  hero[tempUser].hp -= 10;
  $('#messages').append($('<li>').text(hero[tempUser].name + " took 10 damage out of confusion."));
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
function basicReplace(suppsSummoned, basic) {
  tempUserCheck();
  if (suppsSummoned == 0) {
    if (basic) {
      newSupp = randomG(0, basicArr[player].length - 1);
      $('#messages').append($('<li>').text(hero[tempUser].name + " summoned " + basicArr[player][newSupp].name));
      scroll();
      basicSuppPrint(newSupp);
      basicSummoned = true;
      if (userTurn)
        userBasicCount--;
      else
        user2BasicCount--;
    }
    else {
      newSupp = randomG(0, epicArr[player].length - 1);
      $('#messages').append($('<li>').text(hero[tempUser].name + " summoned " + epicArr[player][newSupp].name));
      scroll();
      epicSuppPrint(newSupp);
      epicSummoned = true;
      if (userTurn)
        userEpicCount--;
      else
        user2EpicCount--;
    }
    if (userTurn) {
      userSupp = newSupp;
      userSuppsSummoned++;
    }
    else {
      user2Supp = newSupp;
      user2SuppsSummoned++;
    }
  }
  else if (suppsSummoned == 1) {
    if (basic) {
      do {
        newSupp = randomG(0, basicArr[player].length - 1);
      } while ($('#support-name' + idNum).text() == basicArr[player][newSupp].name);
      $('#messages').append($('<li>').text(hero[tempUser].name + " summoned " + basicArr[player][newSupp].name));
      scroll();
      basicSuppPrint(newSupp, true);
      basicSummoned = true;
      if (userTurn)
        userBasicCount--;
      else
        user2BasicCount--;
    }
    else {
      do {
        newSupp = randomG(0, epicArr[player].length - 1);
      } while ($('#support-name').text() == epicArr[player][newSupp].name);
      $('#messages').append($('<li>').text(hero[tempUser].name + " summoned " + epicArr[player][newSupp].name));
      scroll();
      epicSuppPrint(newSupp, true);
      epicSummoned = true;
      if (userTurn)
        userEpicCount--;
      else
        user2EpicCount--;
    }
    if (userTurn) {
      userSupp2 = newSupp;
      userSuppsSummoned++;
    }
    else {
      user2Supp2 = newSupp;
      user2SuppsSummoned++;
    }
  }
  else if (suppsSummoned == 2) {
    if (basic) {
      do {
        newSupp = randomG(0, basicArr[player].length - 1);
      } while ($('#support-name' + idNum).text() == basicArr[player][newSupp].name || $('#support2-name' + idNum).text() == basicArr[player][newSupp].name );
      alert("Click on the Support you want to replace.");
      $("#support-card" + idNum).click(function() { // Replacing Slot1 with a Basic
        $('#messages').append($('<li>').text(hero[tempUser].name + " replaced " + $("#support-name" + idNum).text() + " with " + basicArr[player][newSupp].name));
        scroll();
        if (userTurn) {
          if (basicArr[player].length - 1 >= userSupp && $('#support-name' + idNum).text() == basicArr[player][userSupp].name) // if/elseif checks if replacing a basic or epic on user slot1
            basicArr[player].splice(userSupp, 1);
          else if (epicArr[player].length - 1 >= userSupp && $('#support-name' + idNum).text() == epicArr[player][userSupp].name)
            epicArr[player].splice(userSupp, 1);
          userSupp = newSupp;
          userBasicCount--;
        }
        else {
          if (basicArr[player].length - 1 >= userSupp && $('#support-name' + idNum).text() == basicArr[player][user2Supp].name) // if/elseif checks if replacing a basic or epic on user2 slot1
            basicArr[player].splice(user2Supp, 1);
          else if (epicArr[player].length - 1 >= userSupp && $('#support-name' + idNum).text() == epicArr[player][user2Supp].name)
            epicArr[player].splice(user2Supp, 1);
          user2Supp = newSupp;
          user2BasicCount--;
        }
        basicSuppPrint(newSupp);
        $("#support-card" + idNum).unbind('click');
        $("#support2-card" + idNum).unbind('click');
      });
      $("#support2-card" + idNum).click(function() { // Replacing Slot2 with a Basic
        $('#messages').append($('<li>').text(hero[tempUser].name + " replaced " + $("#support2-name" + idNum).text() + " with " + basicArr[player][newSupp].name));
        scroll();
        if (userTurn) {
          if (basicArr[player].length - 1 >= userSupp2 && $('#support2-name' + idNum).text() == basicArr[player][userSupp2].name) // if/elseif checks if replacing a basic or epic on user slot2
            basicArr[player].splice(userSupp2, 1);
          else if (epicArr[player].length - 1 >= userSupp2 && $('#support2-name' + idNum).text() == epicArr[player][userSupp2].name)
            epicArr[player].splice(userSupp2, 1);
          userSupp2 = newSupp;
          userBasicCount--;
        }
        else {
          if (basicArr[player].length - 1 >= user2Supp2 && $('#support2-name' + idNum).text() == basicArr[player][user2Supp2].name) // if/elseif checks if replacing a basic or epic on user2 slot2
            basicArr[player].splice(user2Supp2, 1);
          else if (epicArr[player].length - 1 >= user2Supp2 && $('#support2-name' + idNum).text() == epicArr[player][user2Supp2].name)
            epicArr[player].splice(user2Supp2, 1);
          user2Supp2 = newSupp;
          user2BasicCount--;
        }
        basicSuppPrint(newSupp, true);
        $("#support-card" + idNum).unbind('click');
        $("#support2-card" + idNum).unbind('click');
      });
      basicSummoned = true;
    }
    else { // epic replace
      do {
        newSupp = randomG(0, epicArr[player].length - 1);
      } while ($('#support-name' + idNum).text() == epicArr[player][newSupp].name || $('#support2-name' + idNum).text() == epicArr[player][newSupp].name );
      alert("Click on the Support you want to replace.");
      $("#support-card" + idNum).click(function() {
        $('#messages').append($('<li>').text(hero[tempUser].name + " replaced " + $("#support-name" + idNum).text() + " with " + epicArr[player][newSupp].name));
        scroll();
        if (userTurn) {
          if (basicArr[player].length - 1 >= userSupp && $('#support-name' + idNum).text() == basicArr[player][userSupp].name) // if/elseif checks if replacing a basic or epic on user slot1
            basicArr[player].splice(userSupp, 1);
          else if (epicArr[player].length - 1 >= userSupp && $('#support-name' + idNum).text() == epicArr[player][userSupp].name)
            epicArr[player].splice(userSupp, 1);
          userSupp = newSupp;
          userEpicCount--;
        }
        else {
          if (basicArr[player].length - 1 >= user2Supp && $('#support-name' + idNum).text() == basicArr[player][user2Supp].name) // if/elseif checks if replacing a basic or epic on user2 slot1
            basicArr[player].splice(user2Supp, 1);
          else if (epicArr[player].length - 1 >= user2Supp && $('#support-name' + idNum).text() == epicArr[player][user2Supp].name)
            epicArr[player].splice(user2Supp, 1);
          user2Supp = newSupp;
          user2EpicCount--;
        }
        epicSuppPrint(newSupp);
        $("#support-card" + idNum).unbind('click');
        $("#support2-card" + idNum).unbind('click');
      });
      $("#support2-card" + idNum).click(function() {
        $('#messages').append($('<li>').text(hero[tempUser].name + " replaced " + $("#support2-name" + idNum).text() + " with " + epicArr[player][newSupp].name));
        scroll();
        if (userTurn) {
          if (basicArr[player].length - 1 >= userSupp2 && $('#support2-name' + idNum).text() == basicArr[player][userSupp2].name) // if/elseif checks if replacing a basic or epic on user slot2
            basicArr[player].splice(userSupp2, 1);
          else if (epicArr[player].length - 1 >= userSupp2 && $('#support2-name' + idNum).text() == epicArr[player][userSupp2].name)
            epicArr[player].splice(userSupp2, 1);
          userSupp2 = newSupp;
          userEpicCount--;
        }
        else {
          if (basicArr[player].length - 1 >= user2Supp2 && $('#support2-name' + idNum).text() == basicArr[player][user2Supp2].name) // if/elseif checks if replacing a basic or epic on user2 slot2
            basicArr[player].splice(user2Supp2, 1);
          else if (epicArr[player].length - 1 >= user2Supp2 && $('#support2-name' + idNum).text() == epicArr[player][user2Supp2].name)
            epicArr[player].splice(user2Supp2, 1);
          user2Supp2 = newSupp;
          user2EpicCount--;
        }
        epicSuppPrint(newSupp, true);
        $("#support-card" + idNum).unbind('click');
        $("#support2-card" + idNum).unbind('click');
      });
      epicSummoned = true;
    }
  }
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
        $('#messages').append($('<li>').text(hero[tempUser].name + " now has " + hero[tempUser].hp + " HP"));
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
      $('#messages').append($('<li>').text(hero[tempOpp].name + " took 30 damage"));
      hero[tempUser].hp -= 10;
      $('#hero-hp' + idNum).text(hero[tempUser].hp);
      $('#messages').append($('<li>').text(hero[tempUser].name + " took 10 damage"));
  }
}
function EpicSuppEffect(supp) {
  tempUserCheck();
  switch (supp) {
    case 0: // surpriseMotherfucker
      hero[tempOpp].hp -= 30;
      $('#messages').append($('<li>').text(hero[tempOpp].name + " took 30 damage"));
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
