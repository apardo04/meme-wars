$( document ).ready(function() {
  var msg = $('#messages');
  var userItem = 0;
  var userSupp = 0;  // Slot 1 Support
  var userSupp2 = 0; // Slot 2 Support
  var userItemsAttached =  0; // How many items are attached
  var userSuppsSummoned = 0; // How many supports have been summoned
  var userSuppDmg = 0;
  var user2Item = 0;
  var user2Supp = 0;
  var user2Supp2 = 0;
  var user2ItemsAttached =  0;
  var user2SuppsSummoned = 0;
  var user2SuppDmg = 0;
  var userTurn; // true: user1's turn, false: user2
  var extraDmg = 0; // Exrta damage for current turn
  var damage = 0; // Damage being done this turn
  var attacked = false; // False: Hasn't attacked this turn
  var tempUser; // Makes user variable dynamic
  var idNum; // Makes id # dynamic
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
  function endTurn() {
    if (userTurn) {
      $('div#turn-menu1').addClass('disabled');
      $('div#turn-menu2').removeClass('disabled');
      msg.append($('<li>').text(hero[user2].name + "'s turn"));
      if (hero[user2].energy < 6) {
        hero[user2].energy++;
        $('#hero-energy2').append(like);
      }
      hero[user2].energy_left = hero[user2].energy;
      msg.append($('<li>').text(hero[user2].name + " has " + hero[user2].energy_left + " like's"));
      scroll();
      extraDmg = 0;
      attacked = false;
      userTurn = false;
    }
    else {
      $('div#turn-menu2').addClass('disabled');
      $('div#turn-menu1').removeClass('disabled');
      msg.append($('<li>').text(hero[user].name + "'s turn"));
      if (hero[user].energy < 6) {
        hero[user].energy++;
        $('#hero-energy').append(like);
      }
      hero[user].energy_left = hero[user].energy;
      msg.append($('<li>').text(hero[user].name + " has " + hero[user].energy_left + " like's"));
      scroll();
      extraDmg = 0;
      attacked = false;
      userTurn = true;
    }
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
        volume: 0.3
      });
      sound.play();
      // sweet victory & sound fo silence
      //alert(hero[tempUser].name + " Wins!");
    }
  }
  function extraDmgTurn() {
      tempUserCheck();
      if (coinFlip()) {
        if (tempUser == 3) // Final Form Pepe
          extraDmg += 20;
        msg.append($('<li>').text("Coin flip result: Heads"));
      }
      else {
        if (tempUser == 2) // Pepe
          extraDmg = -hero[tempUser].m1_dmg
        msg.append($('<li>').text("Coin flip result: Tails"));
      }
  }
  function evolve() {
    if (userTurn) {
      user++;
      hero[user].hp += (hero[user - 1].hp - hero[user - 1].max_hp);
      hero[user].max_hp += (hero[user - 1].hp - hero[user - 1].max_hp);
      hero[user].armor += hero[user - 1].armor;
      hero[user].energy = hero[user - 1].energy;
      hero[user].energy_left = hero[user - 1].energy_left;
      msg.append($('<li>').text(hero[user - 1].name + " has evolved into " + hero[user].name));
      userCardPrint();
      console.log("evolve steam sale argument = " + $('#support-name').text() == "Steam Sale" || $('#support2-name').text() == "Steam Sale" );
      if ($('#support-name').text() == "Steam Sale" || $('#support2-name').text() == "Steam Sale" ) // to do
        supports3(1);
    }
    else {
      user2++;
      hero[user2].hp += (hero[user2 - 1].hp - hero[user2 - 1].max_hp);
      hero[user2].max_hp += (hero[user2 - 1].hp - hero[user2 - 1].max_hp);
      hero[user2].energy = hero[user2 - 1].energy;
      hero[user2].energy_left = hero[user2 - 1].energy_left;
      msg.append($('<li>').text(hero[user2 - 1].name + " has evolved into " + hero[user2].name));
      user2CardPrint();
      if ($('#support-name2').text() == "Steam Sale" || $('#support2-name2').text() == "Steam Sale" ) // to do
        supports3(1);
    }
  }
  function datBoi() {
    if (userTurn) {
      if (coinFlip()) {
        hero[user].m2_dmg += 10;
        $('#move2-dmg').text(hero[user].m2_dmg);
        msg.append($('<li>').text("Coin flip result: Heads"));
        msg.append($('<li>').text(hero[user].m2 + " now does " + hero[user].m2_dmg + " damage"));
      }
      else {
        msg.append($('<li>').text("Coin flip result: Tails"));
      }
    }
    else {
      if (coinFlip()) {
        hero[user2].m2_dmg += 10;
        $('#move2-dmg2').text(hero[user2].m2_dmg);
        msg.append($('<li>').text("Coin flip result: Heads"));
        msg.append($('<li>').text(hero[user2].m2 + " now does " + hero[user2].m2_dmg + " damage"));
      }
      else {
        msg.append($('<li>').text("Coin flip result: Tails"));
      }
    }
  }
  function items() {
    tempUserCheck();
    switch (tempItem) {
      case 0:
        hero[tempUser].hp += (hero[tempUser].max_hp - hero[tempUser].hp >= 20) ? 20 : hero[tempUser].max_hp - hero[tempUser].hp;
        $('#hero-hp' + idNum).text(hero[tempUser].hp);
        if (hero[tempUser].energy < 6) {
          hero[tempUser].energy++;
          hero[tempUser].energy_left++;
          $('#hero-energy' + idNum).append(like);
        }
        break;
      case 1:
        hero[tempUser].armor += 10;
        console.log(hero[tempUser].armor);
        if (hero[tempOpp].energy > 0) {
          hero[tempOpp].energy--;
          $('#hero-energy' + idOppNum + ' img:last-child').remove()
        }
        break;
      case 2:
        hero[tempUser].armor += 20;
        break;
    }
  }
  function confusion() {
    tempUserCheck();
    hero[tempUser].hp -= 10;
    msg.append($('<li>').text(hero[tempUser].name + " took 10 damage out of confusion."));
    $('#hero-hp' + idNum).text(hero[tempUser].hp);
  }
  function supports(supp, summoned) {
    tempUserCheck();
    switch (supp) {
      case 0: // meGusta
        extraDmg += 10;
        if (summoned) {
          hero[tempUser].hp += 10;
          hero[tempUser].max_hp += 10;
          $('#hero-hp' + idNum).text(hero[tempUser].hp);
          msg.append($('<li>').text(hero[tempUser].name + " now has " + hero[tempUser].hp + " HP"));
        }
        break;
      case 1: // foreverAlone
        extraDmg += 20;
        break;
    }
  }
  function supports3(supp) {
    tempUserCheck();
    switch (supp) {
      case 0: // surpriseMotherfucker
        hero[tempOpp].hp -= 30;
        msg.append($('<li>').text(hero[tempOpp].name + " took 30 damage"));
        $('#hero-hp' + idOppNum).text(hero[tempOpp].hp);
        turnCheck();
        break;
      case 1: // steamSale
        hero[tempUser].m1_energy--;
        hero[tempUser].m2_energy--;
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
  userCardPrint();
  user2CardPrint();
  msg.append($('<li>').text(hero[user].name + " is Heads."));
  msg.append($('<li>').text(hero[user2].name + " is Tails."));
  if (coinFlip()) {
    $('div#turn-menu2').addClass('disabled');
    msg.append($('<li>').text("Coin flip result: Heads"));
    msg.append($('<li>').text(hero[user].name + " will go first"));
    hero[user].energy++;
    hero[user].energy_left = hero[user].energy;
    $('#hero-energy').append(like);
    msg.append($('<li>').text(hero[user].name + " has " + hero[user].energy + " like"));
    userTurn = true;
  }
  else {
    $('div#turn-menu1').addClass('disabled');
    msg.append($('<li>').text("Coin flip result: Tails"));
    msg.append($('<li>').text(hero[user2].name + " will go first"));
    hero[user2].energy++;
    hero[user2].energy_left = hero[user2].energy;
    $('#hero-energy2').append(like);
    msg.append($('<li>').text(hero[user2].name + " has " + hero[user2].energy + " like"));
    userTurn = false;
  }

  $("#menu-move").click(function() {
    if (!attacked) {
      if (userTurn) {
        if (hero[user].energy_left >= hero[user].m1_energy) {
          msg.append($('<li>').text(hero[user].name + " used " + hero[user].m1));
          if ((userSuppsSummoned > 0 && $('#support-name').text() == support[0].name) || (userSuppsSummoned == 2 && $('#support2-name').text() == support[0].name))
            supports(0); // Me Gusta
          if (userSuppsSummoned == 1 && $('#support-name').text() == support[1].name)
            supports(1); // Forever Alone
          if (user == 2 || user == 3) // Pepe's 'Feels Bad Man' / Final Form Pepe's 'You Fool'
            extraDmgTurn();
          damage = ((hero[user].m1_dmg + extraDmg - hero[user2].armor) < 0) ? 0 : (hero[user].m1_dmg + extraDmg - hero[user2].armor);
          console.log(damage + " user1 move1");
          msg.append($('<li>').text(hero[user2].name + " took " + damage + " damage"));
          hero[user2].hp -= damage;
          $('#hero-hp2').text(hero[user2].hp);
          if (user == 1) // Dat Boi's ohh shit
            datBoi();
          if (user2Item == 3)
            confusion();
          hero[user].energy_left -= hero[user].m1_energy;
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
          if ((userSuppsSummoned > 0 && $('#support-name').text() == support[0].name) || (userSuppsSummoned == 2 && $('#support2-name').text() == support[0].name))
            supports(0);
          if (userSuppsSummoned == 1 && $('#support-name').text() == support[1].name)
            supports(1);
          damage = ((hero[user].m2_dmg + extraDmg - hero[user2].armor) < 0) ? 0 : (hero[user].m2_dmg + extraDmg - hero[user2].armor);
          console.log(damage + " user1 move2");
          msg.append($('<li>').text(hero[user2].name + " took " + damage + " damage"));
          hero[user2].hp -= damage;
          $('#hero-hp2').text(hero[user2].hp);
          hero[user].energy_left -= hero[user].m2_energy;
          if (user == 2)
            evolve();
          if (user2Item == 3)
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
          userSupp = randomG(0, supportCount);
          userSupp = 1;
          msg.append($('<li>').text(hero[user].name + " summoned " + support[userSupp].name));
          scroll();
          $('#support-name').text(support[userSupp].name);
          $('#support-hp').text(support[userSupp].hp);
          $('#support-img').attr("src", support[userSupp].img);
          $('#support-effect').html(support[userSupp].effect);
          hero[user].energy_left--;
          if (userSupp == 0) {
            supports(0, true);
          }
          if (userSupp == 1)
            supports(1);
          userSuppsSummoned++;
        }
        else if (userSuppsSummoned == 1){
          do {
            userSupp2 = randomG(0, supportCount);
            //console.log(support[userSupp].name + " =supp |" + support[userSupp2].name + " = supp2 " + (support[userSupp].name == support[userSupp2].name));
          } while (support[userSupp].name == support[userSupp2].name);
          msg.append($('<li>').text(hero[user].name + " summoned " + support[userSupp2].name));
          scroll();
          $('#support2-name').text(support[userSupp2].name);
          $('#support2-hp').text(support[userSupp2].hp);
          $('#support2-img').attr("src", support[userSupp2].img);
          $('#support2-effect').html(support[userSupp2].effect);
          hero[user].energy_left--;
          if (userSupp2 == 0)
            supports(0,true);
          userSuppsSummoned++;
        }
        else {
          alert("You can only have 2 supports summoned.")
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
          userSupp = randomG(0, support3Count);
          userSupp = 1;
          msg.append($('<li>').text(hero[user].name + " summoned " + support3[userSupp].name));
          scroll();
          $('#support-name').text(support3[userSupp].name);
          $('#support-hp').text(support3[userSupp].hp);
          $('#support-img').attr("src", support3[userSupp].img);
          $('#support-effect').html(support3[userSupp].effect);
          hero[user].energy_left -= 3;
          if (userSupp == 0)
            supports3(0);
          if (userSupp == 1)
            supports3(1);
          userSuppsSummoned++;
        }
        else if (userSuppsSummoned == 1) {
          do {
            userSupp2 = randomG(0, support3Count);
          } while (support[userSupp].name == support[userSupp2].name);
          msg.append($('<li>').text(hero[user].name + " summoned " + support3[userSupp2].name));
          scroll();
          $('#support2-name').text(support3[userSupp2].name);
          $('#support2-hp').text(support3[userSupp2].hp);
          $('#support2-img').attr("src", support3[userSupp2].img);
          $('#support2-effect').html(support3[userSupp2].effect);
          hero[user].energy_left -= 3;
          if (userSupp2 == 0)
            supports3(0);
          if (userSupp2 == 1)
            supports3(1);
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
          if ((user2SuppsSummoned > 0 && $('#support-name2').text() == support[0].name) || (user2SuppsSummoned == 2 && $('#support2-name2').text() == support[0].name)){
            console.log("user2 megusta triggered");
            supports(0);}
          if (user2SuppsSummoned == 1 && $('#support-name2').text() == support[1].name){
            supports(1);}
          if (user2 == 2 || user2 == 3) // Pepe's 'Feels Bad Man' / Final Form Pepe's 'You Fool'
            extraDmgTurn();
          damage = ((hero[user2].m1_dmg + extraDmg - hero[user].armor) < 0) ? 0 : (hero[user2].m1_dmg + extraDmg - hero[user].armor);
          console.log(damage + " user2 move1");
          msg.append($('<li>').text(hero[user].name + " took " + damage + " damage"));
          hero[user].hp -= damage;
          $('#hero-hp').text(hero[user].hp);
          if (user2 == 1) // Dat Boi's ohh shit
            datBoi();
          if (userItem == 3)
            confusion();
          hero[user2].energy_left -= hero[user2].m1_energy;
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
          if ((user2SuppsSummoned > 0 && $('#support-name2').text() == support[0].name) || (user2SuppsSummoned == 2 && $('#support2-name2').text() == support[0].name)){
            console.log("user2 megusta triggered");
            supports(0);}
          if (user2SuppsSummoned == 1 && $('#support-name2').text() == support[1].name) {
            console.log("forever alone user2 triggered");
            supports(1);
          }
          damage = ((hero[user2].m2_dmg + extraDmg - hero[user].armor) < 0) ? 0 : (hero[user2].m2_dmg + extraDmg - hero[user].armor);
          console.log(damage + " user2 move2");
          msg.append($('<li>').text(hero[user].name + " took " + damage + " damage"));
          hero[user].hp -= damage;
          $('#hero-hp').text(hero[user].hp);
          hero[user2].energy_left -= hero[user2].m2_energy;
          if (user2 == 2)
            evolve();
          if (userItem == 3)
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
          //user2Item = 0;
          console.log("user2 item = " + user2Item);
          msg.append($('<li>').text(hero[user2].name + " attached " + item[user2Item].name));
          scroll();
          $('#item-name2').text(item[user2Item].name);
          $("#item-img2").attr("src", item[user2Item].img);
          $('#item-effect2').html(item[user2Item].effect);
          hero[user2].energy_left -= 2;
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
          user2Supp = randomG(0, supportCount);
          msg.append($('<li>').text(hero[user2].name + " summoned " + support[user2Supp].name));
          scroll();
          $('#support-name2').text(support[user2Supp].name);
          $('#support-hp2').text(support[user2Supp].hp);
          $('#support-img2').attr("src", support[user2Supp].img);
          $('#support-effect2').html(support[user2Supp].effect);
          hero[user2].energy_left--;
          if (user2Supp == 0)
            if (user2Supp2 == 0)
              supports(0,true);
          if (user2Supp == 1)
            supports(1);
          user2SuppsSummoned++;
        }
        else if (user2SuppsSummoned == 1){
          do {
            user2Supp2 = randomG(0, supportCount);
          } while (support[user2Supp].name == support[user2Supp2].name);
          msg.append($('<li>').text(hero[user2].name + " summoned " + support[user2Supp2].name));
          scroll();
          $('#support2-name2').text(support[user2Supp2].name);
          $('#support2-hp2').text(support[user2Supp2].hp);
          $('#support2-img2').attr("src", support[user2Supp2].img);
          $('#support2-effect2').html(support[user2Supp2].effect);
          hero[user2].energy_left--;
          if (user2Supp2 == 0) {
            if (user2Supp2 == 0)
              supports(0,true);
          }
          user2SuppsSummoned++;
        }
        else {
          alert("You can only have 2 supports summoned.")
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
          user2Supp = randomG(0, support3Count);
          user2Supp = 1;
          msg.append($('<li>').text(hero[user2].name + " summoned " + support3[user2Supp].name));
          scroll();
          $('#support-name2').text(support3[user2Supp].name);
          $('#support-hp2').text(support3[user2Supp].hp);
          $('#support-img2').attr("src", support3[user2Supp].img);
          $('#support-effect2').html(support3[user2Supp].effect);
          hero[user2].energy_left -= 3;
          if (user2Supp == 0)
            supports3(0);
          if (user2Supp == 1)
            supports3(1);
          user2SuppsSummoned++;
        }
        else if (user2SuppsSummoned == 1){
          do {
            user2Supp2 = randomG(0, support3Count);
          } while (support[user2Supp].name == support3[user2Supp2].name);
          msg.append($('<li>').text(hero[user2].name + " summoned " + support3[user2Supp2].name));
          scroll();
          $('#support2-name2').text(support3[user2Supp2].name);
          $('#support2-hp2').text(support3[user2Supp2].hp);
          $('#support2-img2').attr("src", support3[user2Supp2].img);
          $('#support2-effect2').html(support3[user2Supp2].effect);
          hero[user2].energy_left -= 3;
          if (user2Supp2 == 0)
            supports3(0);
          if (user2Supp2 == 1)
            supports3(1);
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
