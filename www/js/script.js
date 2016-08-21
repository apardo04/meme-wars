$( document ).ready(function() {

  var timer = new Tock({
      callback: function () {
          $('#clockface').val(timer.msToTime(timer.lap()));
      }
  });

  var countdown = Tock({
    countdown: true,
    interval: 250,
    callback: function () {
        console.log(countdown.lap() / 1000);
        $('#countdown_clock').val(timer.msToTime(countdown.lap()));
    },
    complete: function () {
        console.log('end');
        alert("Time's up!");
    }
});
$('#startCountdown').on('click', function () {
    countdown.start($('#countdown_clock').val());
});
$('#pauseCountdown').on('click', function () {
    countdown.pause();
});
$('#stopCountdown').on('click', function () {
    countdown.stop();
});
$('#resetCountdown').on('click', function () {
    countdown.stop();
    $('#countdown_clock').val('00:10');
});

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

  // ------- Local Play Functions-------- ///
  function coinFlip() {
    return (Math.floor(Math.random() * 2) == 0);
  }
  function randomG(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function scroll() {
    msg.animate({scrollTop: msg.prop("scrollHeight")}, 500);
  }
  function tempUserCheck() {
    tempUser = (userTurn) ? user : user2;
    idNum = (userTurn) ? '' : '2';
    tempItem = (userTurn) ? userItem : user2Item;
    tempOpp = (!userTurn) ? user : user2;
    idOppNum = (!userTurn) ? '' : '2';
    tempOppItem = (!userTurn) ? user : user2;
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
    if (userTurn)
      userCardPrint();
    else
      user2CardPrint();
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
        if (userTurn)
          userCardPrint();
        else
          user2CardPrint();
        break;
    }
  }

  // ------- Local Play-------- ///
  user = 4//randomG(0, 9);
  user2 = randomG(0, 9);
  console.log(user+"   "+user2)
  userCardPrint();
  user2CardPrint();
  msg.append($('<li>').text(hero[user].name + " is Heads."));
  msg.append($('<li>').text(hero[user2].name + " is Tails."));
  if (coinFlip()) {
    userTurn = true;
    $('div#turn-menu2').addClass('disabled');
    msg.append($('<li>').text("Coin flip result: Heads"));
    msg.append($('<li>').text(hero[user].name + " will go first"));
    hero[user].energy++;
    hero[user].energy_left = hero[user].energy;
    energyText();
    $('#hero-energy').append(like);
    msg.append($('<li>').text(hero[user].name + " has " + hero[user].energy + " like"));
  }
  else {
    userTurn = false;
    $('div#turn-menu1').addClass('disabled');
    msg.append($('<li>').text("Coin flip result: Tails"));
    msg.append($('<li>').text(hero[user2].name + " will go first"));
    hero[user2].energy++;
    hero[user2].energy_left = hero[user2].energy;
    energyText();
    $('#hero-energy2').append(like);
    msg.append($('<li>').text(hero[user2].name + " has " + hero[user2].energy + " like"));
  }

  $("#menu-move").click(function() {
    if (!attacked) {
      if (userTurn) {
        if (hero[user].energy_left >= hero[user].m1_energy) {
          msg.append($('<li>').text(hero[user].name + " used " + hero[user].m1));
          if ((userSuppsSummoned > 0 && $('#support-name').text() == basicSupp[0].name) || (userSuppsSummoned == 2 && $('#support2-name').text() == basicSupp[0].name))
            BasicSuppEffect(0); // Me Gusta extraDmg
          if (userSuppsSummoned == 1 && $('#support-name').text() == basicSupp[1].name)
            BasicSuppEffect(1); // Forever Alone extraDmg
          if (user == 2 || user == 3) // Pepe's 'Feels Bad Man' / Final Form Pepe's 'You Fool'
            m1_effects(2);
          damage = ((hero[user].m1_dmg + extraDmg - hero[user2].armor) < 0) ? 0 : (hero[user].m1_dmg + extraDmg - hero[user2].armor);
          console.log(hero[user].m1_dmg + " dmg |" + extraDmg + " extradmg |" + hero[user2].armor + " armor |");
          console.log(damage + " user1 move1");
          msg.append($('<li>').text(hero[user2].name + " took " + damage + " damage"));
          hero[user2].hp -= damage;
          $('#hero-hp2').text(hero[user2].hp);
          if (user == 0) // SpongeGar's 'Intimidate'
            m1_effects(0);
          else if (user == 1) // Dat Boi's 'Ohh Shit'
            m1_effects(1);
          else if (user == 4) // Doge's 'Such Treat'
            m1_effects(4);
          else if (user == 5) // Slenderman's 'Static'
            m1_effects(5);
          else if (user == 8) // Nyan Cat's 'NYANYANYAN'
            m1_effects(8);
          if (user2Item == 3) // Horse Head
            confusion();
          hero[user].energy_left -= hero[user].m1_energy;
          energyText(hero[user].m1_energy, true);
          scroll();
          attacked = true;
          turnCheck();
        }
        else {
          alert("You do not have enough likes to do this attack");
        }
      }
    }
    else {
      alert("You can only attack once per turn.");
    }
  });
  $("#menu-move2").click(function() {
    if (!attacked) {
      if (userTurn) {
        if (hero[user].energy_left >= hero[user].m2_energy) {
          msg.append($('<li>').text(hero[user].name + " used " + hero[user].m2));
          if ((userSuppsSummoned > 0 && $('#support-name').text() == basicSupp[0].name) || (userSuppsSummoned == 2 && $('#support2-name').text() == basicSupp[0].name))
            BasicSuppEffect(0);
          if (userSuppsSummoned == 1 && $('#support-name').text() == basicSupp[1].name)
            BasicSuppEffect(1);
          damage = ((hero[user].m2_dmg + extraDmg - hero[user2].armor) < 0) ? 0 : (hero[user].m2_dmg + extraDmg - hero[user2].armor);
          console.log(damage + " user1 move2");
          msg.append($('<li>').text(hero[user2].name + " took " + damage + " damage"));
          hero[user2].hp -= damage;
          $('#hero-hp2').text(hero[user2].hp);
          hero[user].energy_left -= hero[user].m2_energy;
          energyText(hero[user].m2_energy, true);
          if (user == 2) // Pepe's Evolve
            evolve();
          if (user2 == 5) // Slenderman's 'Mutilation'
            m2_effects(5)
          if (user2Item == 3) // Horse Head
            confusion();
          scroll();
          attacked = true;
          turnCheck();
        }
        else {
          alert("You do not have enough likes to do this attack");
        }
      }
    }
    else {
      alert("You can only attack once per turn.");
    }
  });
  $("#menu-item").click(function() {
    if (userTurn) {
      if (hero[user].energy_left >= 2) {
        if (userItemsAttached == 0) {
          userItem = randomG(0, itemCount);
          //userItem = 0;
          msg.append($('<li>').text(hero[user].name + " attached " + item[userItem].name));
          scroll();
          $('#item-name').text(item[userItem].name);
          $("#item-img").attr("src", item[userItem].img);
          $('#item-effect').html(item[userItem].effect);
          hero[user].energy_left -= 2;
          energyText(2, true);
          items();
          userItemsAttached++;
        }
        else {
          alert("You can only have one item attached.");
        }
      }
      else {
        alert("You don't have enough likes.")
      }
    }
  });
  $("#menu-1support").click(function() {
    if (userTurn) {
      if (hero[user].energy_left > 0) {
        if (userSuppsSummoned == 0) {
          userSupp = randomG(0, basicSuppCount);
          //userSupp = 1;
          msg.append($('<li>').text(hero[user].name + " summoned " + basicSupp[userSupp].name));
          scroll();
          basicSuppPrint(userSupp);
          userSuppsSummoned++;
        }
        else if (userSuppsSummoned == 1){
          do {
            userSupp2 = randomG(0, basicSuppCount);
            console.log("userSupp2 = " + userSupp2);
          } while ($('#support-name').text() == basicSupp[userSupp2].name);
          msg.append($('<li>').text(hero[user].name + " summoned " + basicSupp[userSupp2].name));
          scroll();
          basicSuppPrint(userSupp2, true);
          userSuppsSummoned++;
        }
        else if (userSuppsSummoned == 2) {
          suppReplace();
        }
      }
      else {
        alert("You don't have enough likes");
      }
    }
  });
  $("#menu-3support").click(function() {
    if (userTurn) {
      if (hero[user].energy_left >= 3) {
        if (userSuppsSummoned == 0) {
          userSupp = randomG(0, epicSuppCount);
          //userSupp = 1;
          msg.append($('<li>').text(hero[user].name + " summoned " + epicSupp[userSupp].name));
          scroll();
          epicSuppPrint(userSupp);
          userSuppsSummoned++;
        }
        else if (userSuppsSummoned == 1) {
          do {
            userSupp2 = randomG(0, epicSuppCount);
          } while ($('#support-name').text() == epicSupp[userSupp2].name);
          msg.append($('<li>').text(hero[user].name + " summoned " + epicSupp[userSupp2].name));
          scroll();
          epicSuppPrint(userSupp2, true);
          userSuppsSummoned++;
        }
        else {
          alert("You can only have 2 supports summoned.")
        }
      }
      else {
        alert("You dont have enough like's to summon a 3 cost support.")
      }
    }
  });
  $("#menu-end").click(function() {
    if (userTurn)
      endTurn();
  });

  // User2 JS
  $("#menu2-move").click(function() {
    if (!attacked) {
      if (!userTurn) {
        if (hero[user2].energy_left >= hero[user2].m1_energy) {
          msg.append($('<li>').text(hero[user2].name + " used " + hero[user2].m1));
          if ((user2SuppsSummoned > 0 && $('#support-name2').text() == basicSupp[0].name) || (user2SuppsSummoned == 2 && $('#support2-name2').text() == basicSupp[0].name))
            BasicSuppEffect(0);
          if (user2SuppsSummoned == 1 && $('#support-name2').text() == basicSupp[1].name)
            BasicSuppEffect(1);
          if (user2 == 2 || user2 == 3) // Pepe's 'Feels Bad Man' / Final Form Pepe's 'You Fool'
            m1_effects(2);
          damage = ((hero[user2].m1_dmg + extraDmg - hero[user].armor) < 0) ? 0 : (hero[user2].m1_dmg + extraDmg - hero[user].armor);
          console.log(damage + " user2 move1");
          msg.append($('<li>').text(hero[user].name + " took " + damage + " damage"));
          hero[user].hp -= damage;
          $('#hero-hp').text(hero[user].hp);
          if (user2 == 0) // SpongeGar's 'Intimidate'
            m1_effects(0);
          else if (user2 == 1) // Dat Boi's 'Ohh Shit'
            m1_effects(1);
          else if (user2 == 5) // Slenderman's 'Static'
            m1_effects(5);
          else if (user2 == 8) // Nyan Cat's 'NYANYANYAN'
            m1_effects(8);
          if (userItem == 3) // Horse Head
            confusion();
          hero[user2].energy_left -= hero[user2].m1_energy;
          energyText(hero[user2].m1_energy, true);
          scroll();
          attacked = true;
          turnCheck();
        }
        else {
          alert("You do not have enough likes to do this attack");
        }
      }
    }
    else {
      alert("You can only attack once per turn.");
    }
  });
  $("#menu2-move2").click(function() {
    if (!attacked) {
      if (!userTurn) {
        if (hero[user2].energy_left >= hero[user2].m2_energy) {
          msg.append($('<li>').text(hero[user2].name + " used " + hero[user2].m2));
          if ((user2SuppsSummoned > 0 && $('#support-name2').text() == basicSupp[0].name) || (user2SuppsSummoned == 2 && $('#support2-name2').text() == basicSupp[0].name)){
            console.log("user2 megusta triggered");
            BasicSuppEffect(0);}
          if (user2SuppsSummoned == 1 && $('#support-name2').text() == basicSupp[1].name) {
            console.log("forever alone user2 triggered");
            BasicSuppEffect(1);
          }
          damage = ((hero[user2].m2_dmg + extraDmg - hero[user].armor) < 0) ? 0 : (hero[user2].m2_dmg + extraDmg - hero[user].armor);
          console.log(damage + " user2 move2");
          msg.append($('<li>').text(hero[user].name + " took " + damage + " damage"));
          hero[user].hp -= damage;
          $('#hero-hp').text(hero[user].hp);
          hero[user2].energy_left -= hero[user2].m2_energy;
          energyText(hero[user2].m2_energy, true);
          if (user2 == 2) // Pepe's Evolve
            evolve();
          if (user2 == 5) // Slenderman's 'Mutilation'
            m2_effects(5)
          if (userItem == 3) // Horse Head
            confusion();
          scroll();
          attacked = true;
          turnCheck();
        }
        else {
          alert("You do not have enough likes to do this attack");
        }
      }
    }
    else {
      alert("You can only attack once per turn.");
    }
  });
  $("#menu2-item").click(function() {
    if (!userTurn) {
      if (hero[user2].energy_left >= 2) {
        if (user2ItemsAttached == 0) {
          user2Item = randomG(0, itemCount);
          //user2Item = 1;
          console.log("user2 item = " + user2Item);
          msg.append($('<li>').text(hero[user2].name + " attached " + item[user2Item].name));
          scroll();
          $('#item-name2').text(item[user2Item].name);
          $("#item-img2").attr("src", item[user2Item].img);
          $('#item-effect2').html(item[user2Item].effect);
          hero[user2].energy_left -= 2;
          energyText(2, true);
          items();
          user2ItemsAttached++;
        }
        else {
          alert("You can only have one item attached.");
        }
      }
      else {
        alert("You don't have enough likes.")
      }
    }
  });
  $("#menu2-1support").click(function() {
    if (!userTurn) {
      if (hero[user2].energy_left > 0) {
        if (user2SuppsSummoned == 0) {
          user2Supp = randomG(0, basicSuppCount);
          msg.append($('<li>').text(hero[user2].name + " summoned " + basicSupp[user2Supp].name));
          scroll();
          basicSuppPrint(user2Supp);
          user2SuppsSummoned++;
        }
        else if (user2SuppsSummoned == 1){
          do {
            user2Supp2 = randomG(0, basicSuppCount);
          } while ($('#support-name2').text() == basicSupp[user2Supp2].name);
          msg.append($('<li>').text(hero[user2].name + " summoned " + basicSupp[user2Supp2].name));
          scroll();
          basicSuppPrint(user2Supp2, true);
          user2SuppsSummoned++;
        }
        else if (user2SuppsSummoned == 2) {
          suppReplace();
        }
      }
    else {
      alert("You don't have enough likes");
    }
    }
  });
  $("#menu2-3support").click(function() {
    if (!userTurn) {
      if (hero[user2].energy_left >= 3) {
        if (user2SuppsSummoned == 0) {
          user2Supp = randomG(0, epicSuppCount);
          //user2Supp = 1;
          msg.append($('<li>').text(hero[user2].name + " summoned " + epicSupp[user2Supp].name));
          scroll();
          epicSuppPrint(user2Supp);
          user2SuppsSummoned++;
        }
        else if (user2SuppsSummoned == 1){
          do {
            user2Supp2 = randomG(0, epicSuppCount);
          } while ($('#support-name2').text() == epicSupp[user2Supp2].name);
          msg.append($('<li>').text(hero[user2].name + " summoned " + epicSupp[user2Supp2].name));
          scroll();
          epicSuppPrint(user2Supp2, true);
          user2SuppsSummoned++;
        }
        else {
          alert("You can only have 2 supports summoned.")
        }
      }
      else {
        alert("You dont have enough like's to summon a 3 cost support.")
      }
    }
  });
  $("#menu2-end").click(function() {
    if (!userTurn)
      endTurn();
  });
});
