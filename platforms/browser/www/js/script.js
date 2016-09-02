$( document ).ready(function() {
/*  var timer = new Tock({
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
});*/
  var msg = $('#messages');
  // ------- Local Play-------- ///
  user = 4//randomG(0, 9);
  user2 = randomG(0, 9);
  console.log(msg);
  userCardPrint();
  userTurn = true;
  userCardPrint();
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
          if (itemsArr[1][user2Item].name == "Horse Head") // Horse Head
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
          if (itemsArr[1][user2Item].name == "Horse Head") // Horse Head
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
      if (itemsArr[0].length > 1) {
        if (!itemEquipped) {
          if (hero[user].energy_left >= 2) {
            itemReplace(userItemsAttached);
          }
          else
            alert("You don't have enough likes.");
        }
        else
          alert("You already equipped an Item this turn");
      }
      else
        alert("You ran out of Item Cards.");
    }
  });
  $("#menu-1support").click(function() {
    if (userTurn) {
      if (!basicSummoned) {
        if (hero[user].energy_left > 0) {
          if (userSuppsSummoned == 0) {
            userSupp = randomG(0, basicSuppCount);
            //userSupp = 1;
            msg.append($('<li>').text(hero[user].name + " summoned " + basicSupp[userSupp].name));
            scroll();
            basicSuppPrint(userSupp);
            basicSummoned = true;
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
            basicSummoned = true;
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
      else {
        alert("You already played a Basic Support this turn")
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
          if (itemsArr[0][userItem].name == "Horse Head") // Horse Head
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
          if (itemsArr[0][userItem].name == "Horse Head") // Horse Head
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
      if (itemsArr[1].length > 1) {
        if (!itemEquipped) {
          if (hero[user2].energy_left >= 2) {
            if (user2ItemsAttached == 0) {
              user2Item = randomG(0, itemsArr[1].length - 1);
              //user2Item = 1;
              msg.append($('<li>').text(hero[user2].name + " attached " + itemsArr[1][user2Item].name));
              scroll();
              items();
              itemCardPrint();
              user2ItemsAttached++;
              itemEquipped = true;
            }
            else if (user2ItemsAttached == 1)
              itemReplace();
          }
          else
            alert("You don't have enough likes.");
        }
        else
          alert("You already equipped an Item this turn");
      }
      else
        alert("You ran out of Item Cards.");
    }
  });
  $("#menu2-1support").click(function() {
    if (!userTurn) {
      if (!basicSummoned) {
        if (hero[user2].energy_left > 0) {
          if (user2SuppsSummoned == 0) {
            user2Supp = randomG(0, basicSuppCount);
            msg.append($('<li>').text(hero[user2].name + " summoned " + basicSupp[user2Supp].name));
            scroll();
            basicSuppPrint(user2Supp);
            basicSummoned = true;
            user2SuppsSummoned++;
          }
          else if (user2SuppsSummoned == 1){
            do {
              user2Supp2 = randomG(0, basicSuppCount);
            } while ($('#support-name2').text() == basicSupp[user2Supp2].name);
            msg.append($('<li>').text(hero[user2].name + " summoned " + basicSupp[user2Supp2].name));
            scroll();
            basicSuppPrint(user2Supp2, true);
            basicSummoned = true;
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
      else {
        alert("You already played a Basic Support this turn")
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
