var createRaid = function (name, type, isHL) {
  return {
    name: name,
    type: type,
    isHL: isHL
  };
}

var createDistinction = function (name, type) {
  return {
    name: name,
    type: type
  };
}
var raidInfo = {
  '300011': createRaid('Griffin (N)', '0', false),
  '300021': createRaid('Griffin (H)', '1', false),
  '300031': createRaid('Tiamat (N)', '2', false),
  '300041': createRaid('Tiamat (H)', '3', false),
  '300051': createRaid('Tiamat (EX)', '4', false),
  '300421': createRaid('Nezha (EX)', '5', false),
  '301381': createRaid('Garuda (EX)', '6', false),
  '300441': createRaid('Tiamat (HL)', '7', true),
  '300451': createRaid('Nezha (HL)', '8', true),

  '300061': createRaid('Flame (N)', '0', false),
  '300071': createRaid('Flame (H)', '1', false),
  '300081': createRaid('Colossus (N)', '2', false),
  '300091': createRaid('Colossus (H)', '3', false),
  '300101': createRaid('Colossus (EX)', '4', false),
  '300411': createRaid('Elements (EX)', '5', false),
  '301071': createRaid('Athena (EX)', '6', false),
  '300491': createRaid('Colossus (HL)', '7', true),
  '300501': createRaid('Elements (HL)', '8', true),

  '300111': createRaid('Guard (N)', '0', false),
  '300121': createRaid('Guard (H)', '1', false),
  '300141': createRaid('Leviathan (N)', '2', false),
  '300151': createRaid('Leviathan (H)', '3', false),
  '300161': createRaid('Leviathan (EX)', '4', false),
  '300381': createRaid('Macula (EX)', '5', false),
  '300481': createRaid('Grani (EX)', '6', false),
  '300511': createRaid('Leviathan (HL)', '7', true),
  '300521': createRaid('Macula (HL)', '8', true),

  '300170': createRaid(null, '0', null, false),
  '300171': createRaid('Dragon (H)', '1', false),
  '300181': createRaid('Yggdrasil (N)', '2', false),
  '300191': createRaid('Yggdrasil (H)', '3', false),
  '300261': createRaid('Yggdrasil (EX)', '4', false),
  '300391': createRaid('Medusa (EX)', '5', false),
  '301371': createRaid('Baal (EX)', '6', false),
  '300531': createRaid('Yggdrasil (HL)', '7', true),
  '300541': createRaid('Medusa (HL)', '8', true),

  '300200': createRaid(null, '0', null, false),
  '300201': createRaid('Wisp (H)', '1', false),
  '300211': createRaid('Adversa (N)', '2', false),
  '300221': createRaid('Adversa (H)', '3', false),
  '300271': createRaid('Lumi (EX)', '4', false),
  '300431': createRaid('Apollo (EX)', '5', false),
  '300461': createRaid('Odin (EX)', '6', false),
  '300561': createRaid('Lumi (HL)', '7', true),
  '300571': createRaid('Apollo (HL)', '8', true),

  '300230': createRaid(null, '0', null, false),
  '300231': createRaid('Eye (H)', '1', false),
  '300241': createRaid('Celeste (N)', '2', false),
  '300251': createRaid('Celeste (H)', '3', false),
  '300281': createRaid('Celeste (EX)', '4', false),
  '300401': createRaid('Olivia (EX)', '5', false),
  '300551': createRaid('Lich (EX)', '6', false),
  '300581': createRaid('Celest (HL)', '7', true),
  '300591': createRaid('Olivia (HL)', '8', true),

  '300291': createRaid('Baha (EX)', '9', false),
  '301051': createRaid('Grand (EX)', '9', false),
  '300471': createRaid('Rose (HL)', '9', true),
  '301061': createRaid('Baha (HL)', '9', true)
};

var distinctionInfo = {
  '20411': createDistinction('Gladiator', '1'),
  '20421': createDistinction('Guardian', '1'),
  '20431': createDistinction('Pilgrim', '1'),
  '20441': createDistinction('Mage', '1'),
  '20451': createDistinction('Bandit', '1'),
  '20461': createDistinction('Fencer', '1'),
  '20471': createDistinction('Combatant', '2'),
  '20481': createDistinction('Sharpshooter', '2'),
  '20491': createDistinction('Troubadour', '2'),
  '20501': createDistinction('Cavalryman', '2'),
  '20511': createDistinction('Alchemist', '2'),
  '20671': createDistinction('Samurai', '2'),
  '20681': createDistinction('Ninja', '3'),
  '20691': createDistinction('Sword Master', '3'),
  '20701': createDistinction('Gunslinger', '3'),
  '20751': createDistinction('Mystic', '3'),
  '20761': createDistinction('Assassin', '3'),
};

var options = [
  'ougiRefresh',
  'skip',
  'skipNext',
  'enableNotifications',
  'muteNotifications',
  'apNotifications',
  'epNotifications',
  'dailyResetNotifications',
  'strikeTimeNotifications',
  'angelHaloNotifications',
  'defenseOrderNotifications',
  'isMagFest',
  'increasedRenownLimit',
  'freeSingleRoll',
  'primarchDaily',
  'sortRaidsDifficulty',
  'copyJapaneseName',
  'windowTheme',
  'notificationTheme',

  '300011',
  '300021',
  '300031',
  '300041',
  '300051',
  '300421',
  '301381',
  '300441',
  '300451',

  '300061',
  '300071',
  '300081',
  '300091',
  '300101',
  '300411',
  '301071',
  '300491',
  '300501',

  '300111',
  '300121',
  '300141',
  '300151',
  '300161',
  '300381',
  '300481',
  '300511',
  '300521',

  '300171',
  '300181',
  '300191',
  '300261',
  '300391',
  '301371',
  '300531',
  '300541',

  '300201',
  '300211',
  '300221',
  '300271',
  '300431',
  '300461',
  '300561',
  '300571',

  '300231',
  '300241',
  '300251',
  '300281',
  '300401',
  '300551',
  '300581',
  '300591',

  '300291',
  '301051',
  '300471',
  '301061',

  '20411',
  '20421',
  '20431',
  '20441',
  '20451',
  '20461',
  '20471',
  '20481',
  '20491',
  '20501',
  '20511',
  '20671',
  '20681',
  '20691',
  '20701',
  '20751',
  '20761'
];
var $raids = $('#raids');
var $raid = $raids.find('.raid').first().clone();
$raids.find('.raid').first().remove();
for (var i = 0; i < options.length; i++) {
  var key = options[i];
  if (raidInfo.hasOwnProperty(key)) {
    if (raidInfo[key].name !== null) {
      var newRaid = $raid.clone();
      newRaid.attr('id', 'raid-' + key);
      newRaid.children('.check').attr('id', key);
      // if(raidInfo[key].isHL) {
      //   newRaid.children('.check').prop('checked', false);
      // } else {
      //   newRaid.children('.check').prop('checked', true);
      // }
      newRaid.children('.name').text(raidInfo[key].name);
      //$raids.children('#' + raidInfo[key].type).append(newRaid);
      newRaid.appendTo('#' + raidInfo[key].type);
    } else {
      var newRaid = $raid.clone();
      newRaid.children('.check').hide();
      newRaid.children('.name').text('  ');
      newRaid.appendTo('#' + raidInfo[key].type);
    }
  } else if (distinctionInfo.hasOwnProperty(key)) {
    if (distinctionInfo[key].name !== null) {
      var newRaid = $raid.clone();
      newRaid.attr('id', 'distinction-' + key);
      newRaid.children('.check').attr('id', key);
      // if(raidInfo[key].isHL) {
      //   newRaid.children('.check').prop('checked', false);
      // } else {
      //   newRaid.children('.check').prop('checked', true);
      // }
      newRaid.children('.name').text(distinctionInfo[key].name);
      //$raids.children('#' + raidInfo[key].type).append(newRaid);
      newRaid.appendTo('#d' + distinctionInfo[key].type);
    } else {
      // var newRaid = $raid.clone();
      // newRaid.children('.check').hide();
      // newRaid.children('.name').text('  ');
      // newRaid.appendTo('#' + raidInfo[key].type);
    }
  }
}


$(':checkbox').each(function () {
  $(this).click(function () {
    checkEnabled($(this));
    chrome.runtime.sendMessage({
      setOption: {
        'id': [$(this).attr('id')],
        'value': $(this).is(':checked')
      }
    });
  });
});
$('select').each(function () {
  $(this).on('change', function () {
    chrome.runtime.sendMessage({
      setOption: {
        'id': [$(this).attr('id')],
        'value': this.value
      }
    });
  });
});

var checkEnabled = function (obj) {
  if (obj.attr('id') === 'enableNotifications') {
    var checked = obj.is(':checked')
    $('#notifications').find('.check').each(function () {
      $(this).prop('disabled', !checked);
    });
    $('#notifications').find('.name').each(function () {
      if (checked) {
        $(this).css('color', '#333333');
      } else {
        $(this).css('color', 'grey');
      }
    });
  }
}

for (var i = 0; i < options.length; i++) {
  chrome.runtime.sendMessage({
    getOption: options[i]
  }, function (response) {
    if (response.value !== null) {
      if (response.id === 'windowTheme' || response.id === 'notificationTheme') {
        $('#' + response.id).val(response.value);
      } else {
        $('#' + response.id).prop('checked', response.value);
        checkEnabled($('#' + response.id));
      }
    } else {
      $('#raid-' + response.id).hide();
    }
  });
}