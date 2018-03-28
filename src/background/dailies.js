(function () {
  var dailyNames = ['draw-rupie', 'tweet', 'coop'];
  var weeklyNames = ['renown'];
  var monthlyNames = ['moons'];
  var drawCount = 101;
  var coopDailies = [];
  var tweet = true;
  var moons = {
    '30031': 1,
    '30032': 1,
    '30033': 1
  }
  var coopNum = 3;

  //var defenseRank = 1;
  var isHL = false;
  // var defenseShop = {
  //   '1356': 5,
  //   '1357': 5,
  //   '1368': 1,
  //   '1381': 1
  // }
  // var defenseMax = {
  //   '1356': 5,
  //   '1357': 5,
  //   '1368': 1,
  //   '1381': 1
  // }

  var renown = {
    '1': 0,
    '2': 0,
    '3': 0,
    '4': 0,
    '7': 0
  }
  var renownMax = {
    '1': 2000,
    '2': 500,
    '3': 500,
    '4': 500,
    '7': 200,
  }
  var renownIncreasedMax = {
    '1': 4000,
    '2': 1000,
    '3': 1000,
    '4': 1000,
    '7': 400,
  }
  var dailiesData = {
    'renown': {
      '1': 2000,
      '2': 500,
      '3': 500,
      '4': 500,
      '7': 200
    },
    // 'defense' :{
    //   '1356': 5,
    //   '1357': 5,
    //   '1368': 1,
    //   '1381': 1
    // },
    'moons': {
      '30031': 1,
      '30032': 1,
      '30033': 1
    }
  }

  var dailies = {
    'draw-rupie': 101,
    'tweet': true,
    'freeSingleRoll': true,
    'freeTenRoll': true,
    'primarchs': 2,
    'coop': {
      '0': {
        'raw': '',
        'quest': '???',
        'progress': '',
        'max': ''
      },
      '1': {
        'raw': '',
        'quest': '???',
        'progress': '',
        'max': ''
      },
      '2': {
        'raw': '',
        'quest': '???',
        'progress': '',
        'max': ''
      },
    },
    'renown': {
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0
    },
    // 'defense': {
    //   '1356': 5,
    //   '1357': 5,
    //   '1368': 1,
    //   '1381': 1
    // },
    'moons': {
      '30031': 1,
      '30032': 1,
      '30033': 1
    },
    'distinctions': {
      '20411': 1,
      '20421': 1,
      '20431': 1,
      '20441': 1,
      '20451': 1,
      '20461': 1,
      '20471': 1,
      '20481': 1,
      '20491': 1,
      '20501': 1,
      '20511': 1,
      '20671': 1,
      '20681': 1,
      '20691': 1,
      '20701': 1,
      '20751': 1,
      '20761': 1
    },
  }
  var enabledDistinctionList = [];

  var primarchHash = {
    //michael
    '500871': true,
    '500881': true,
    '500891': true,
    '500901': true,
    //gabriel
    '500951': true,
    '500961': true,
    '500971': true,
    '500981': true,
    //uriel
    '500911': true,
    '500921': true,
    '500931': true,
    '500941': true,
    //raphael
    '500991': true,
    '501001': true,
    '501011': true,
    '501021': true
  }
  // var $dailiesPanel = $('#dailies-panel');
  // var $weekliesPanel = $('#weeklies-panel');
  // var $monthliesPanel = $('#monthlies-panel');

  // var $coopQuests = $dailiesPanel.find('.coop-quest');
  // var $coopProgresses = $dailiesPanel.find('.coop-progress');
  // var $drawCount = $dailiesPanel.find('#draw-count');
  // var $tweetStatus = $dailiesPanel.find('#tweet-status');

  // var $defensePanel = $weekliesPanel.find('#defense-weekly-collapse');
  // var $renownPanel = $weekliesPanel.find('#renown-weekly-collapse');

  // var $moonPanel = $monthliesPanel.find('#moon-monthly-collapse');

  // var $miscellaneousCollapse = $('#misc-daily-collapse');
  // var $coopCollapse = $('#coop-daily-collapse');
  // var $renownCollapse = $('#renown-weekly-collapse');
  // var $defenseCollapse = $('#defense-weekly-collapse');
  // var $moonCollapse = $('#moon-monthly-collapse');

  // var $prestige = $('#weekly-prestige');
  // var $defenseThree = $('#defense-three');
  // var $defenseTwo = $('#defense-two');

  // var hidePrestige = function(rank) {
  //   if(rank === null || rank < 101) {
  //     isHL = false;
  //     //$prestige.hide();
  //   } else {
  //     isHL = true;
  //     //$prestige.show();
  //   }
  //   checkRenown();
  // }

  // var hideDefenseShop = function(rank) {
  //   defenseRank = rank;
  //   if(rank === null || rank < 3) {
  //     //$defenseThree.hide();
  //   } else if(rank === 3) {
  //     //$defenseThree.show();
  //   }
  //   if(rank === null || rank < 2) {
  //     //$defenseTwo.hide();
  //   } else if(rank >= 2) {
  //     //$defenseTwo.show();
  //   }
  //   checkDefenseShop();
  // }


  window.Dailies = {
    Initialize: function (callback) {

      Options.Get('increasedRenownLimit', function (id, value) {
        increaseRenown(value);
        var array = [];
        Object.keys(dailies.renown).forEach(function (key) {
          array.push(['renown', key], dailies.renown[key]);
        });
        setDailies(array, true);
      });
      var hide = Options.Get('freeSingleRoll', function (id, value) {
        Message.PostAll({
          'hideObject': {
            'id': '#dailies-freeSingleRoll-Panel',
            'value': !value
          }
        });
        setDailies([
          ['freeSingleRoll'], dailies['freeSingleRoll']
        ], true);
      });
      Options.Get('primarchDaily', function (id, value) {
        Message.PostAll({
          'hideObject': {
            'id': '#dailies-primarchs-Panel',
            'value': !value
          }
        });
        setDailies([
          ['primarchs'], dailies['primarchs']
        ], true);
      });
      Object.keys(dailies.distinctions).forEach(function (key) {
        Options.Get(key, function (id, value) {
          id = id[0];
          var index = enabledDistinctionList.indexOf(id)
          if (value && index === -1) {
            if (enabledDistinctionList.length === 0) {
              Message.PostAll({
                'hideObject': {
                  'id': '#distinction-dailies',
                  'value': false
                }
              });
            }
            enabledDistinctionList.push(id);
            Message.PostAll({
              'setHeight': {
                'id': '#daily-distinction-list',
                'value': Math.ceil(enabledDistinctionList.length / 4) * 47
              }
            });
          } else if (!value && index !== -1) {
            enabledDistinctionList.splice(index, 1);
            if (enabledDistinctionList.length === 0) {
              Message.PostAll({
                'hideObject': {
                  'id': '#distinction-dailies',
                  'value': true
                }
              });
            } else {
              Message.PostAll({
                'setHeight': {
                  'id': '#daily-distinction-list',
                  'value': Math.ceil(enabledDistinctionList.length / 4) * 47
                }
              });
            }
          }
          Message.PostAll({
            'hideObject': {
              'id': '#distinctions-body-' + id,
              'value': !value
            }
          });
          setDailies([
            ['distinctions', id], dailies.distinctions[id]
          ], true);
        });
      });
      Profile.Get('level', function (value) {
        if (!isHL && value >= 101) {
          isHL = true;
          Message.PostAll({
            'hideObject': {
              'id': '#weekly-prestige',
              'value': false
            }
          });
        }

      });
      Storage.GetMultiple(['dailies'], function (response) {

        if (response['dailies'] !== undefined) {
          if (response['dailies']['primarchs'] === undefined) {
            for (var key in dailies) {
              if (response['dailies'][key] == undefined) {
                response['dailies'][key] = dailies[key];
              }
            }
            dailies = response['dailies'];
            Storage.Set('dailies', dailies);
          } else {
            dailies = response['dailies'];
          }
        } else {
          Storage.Set('dailies', dailies);
        }
        if (callback !== undefined) {
          callback();
        }
      });
      // Profile.Get('defenseRank', hideDefenseShop);
    },
    InitializeDev: function () {
      // Object.keys(dailies.renown).forEach(function(key) {
      //       array.push(['renown', key], dailies.renown[key]);
      //   });
      increaseRenown(Options.Get('increasedRenownLimit'));
      Message.PostAll({
        'hideObject': {
          'id': '#dailies-freeSingleRoll-Panel',
          'value': !Options.Get('freeSingleRoll')
        }
      });
      Message.PostAll({
        'hideObject': {
          'id': '#dailies-primarchs-Panel',
          'value': !Options.Get('primarchDaily')
        }
      });

      var response = [];
      var checking = false;
      if (enabledDistinctionList.length == 0) {
        checking = true;
      }
      Object.keys(dailies.distinctions).forEach(function (key) {
        var enabled = Options.Get(key);
        if (checking && enabled) {
          enabledDistinctionList.push(key);
        }
        response.push({
          'addDistinction': {
            'id': key,
            'amount': dailies.distinctions[key],
            'max': '1',
            'isEnabled': enabled
          }
        });
      });
      response.push({
        'setHeight': {
          'id': '#daily-distinction-list',
          'value': Math.ceil(enabledDistinctionList.length / 4) * 47
        }
      });
      if (enabledDistinctionList.length === 0 || !isHL) {
        response.push({
          'hideObject': {
            'id': '#distinction-dailies',
            'value': true
          }
        });
      } else {
        response.push({
          'hideObject': {
            'id': '#distinction-dailies',
            'value': false
          }
        });
      }
      Object.keys(dailies).forEach(function (key) {
        response.push(checkCollapse([key]));
      });
      response = response.concat(recursiveSearch(dailies, []));
      response.push({
        'hideObject': {
          'id': '#weekly-prestige',
          'value': !isHL
        }
      });

      return response;
    },
    Reset: function () {
      var array = [
        ['draw-rupie'], 101, ['tweet'], true, ['freeSingleRoll'], true, ['freeTenRoll'], true, ['primarchs'], 2
      ];
      Object.keys(dailies.coop).forEach(function (key) {
        array.push(['coop', key, 'raw'], '');
        array.push(['coop', key, 'quest'], '???');
        array.push(['coop', key, 'max'], '');
        array.push(['coop', key, 'progress'], '');
      });
      Object.keys(dailies.distinctions).forEach(function (key) {
        array.push(['distinctions', key], 1);
      });
      setDailies(array);
      Casino.Reset();
      Quest.Reset();
    },
    WeeklyReset: function () {
      var array = [];
      var name;
      for (var i = 0; i < weeklyNames.length; i++) {
        name = weeklyNames[i];
        Object.keys(dailies[name]).forEach(function (key) {
          array.push([name, key], 0);
        });
      }
      setDailies(array);
    },
    MonthlyReset: function () {
      var array = [];
      var namem;
      for (var i = 0; i < monthlyNames.length; i++) {
        name = monthlyNames[i];
        Object.keys(dailies[name]).forEach(function (key) {
          array.push([name, key], dailiesData[name][key]);
        });
      }
      setDailies(array);
      Casino.MonthlyReset();
    },
    SetDraws: function (json) {
      if (json.user_info.is_free) {
        setDailies([
          ['draw-rupie'], 101
        ]);
      } else {
        setDailies([
          ['draw-rupie'], json.user_info.free_count
        ]);
      }
    },
    DecDraws: function (json) {
      if (json.gacha[0].name === 'Rupie Draw') {
        setDailies([
          ['draw-rupie'], dailies['draw-rupie'] - json.count
        ]);
      }
    },
    SetCoop: function (json) {
      var description;
      var array = [];
      var key;
      for (var i = 0; i < json.daily_mission.length; i++) {
        description = json.daily_mission[i].description;
        key = '' + i;
        array.push(['coop', key, 'raw'], description);
        array.push(['coop', key, 'quest'], parseDescription(description));
        array.push(['coop', key, 'max'], parseInt(json.daily_mission[i].max_progress));
        array.push(['coop', key, 'progress'], parseInt(json.daily_mission[i].progress));
      }
      setDailies(array);
    },
    CompleteCoop: function (json) {
      if (json.url === 'coopraid') {
        var list = json.popup_data.coop_daily_mission;
        if (list.length > 0) {
          var exists;
          var array = [];
          for (var i = 0; i < list.length; i++) {
            var keys = Object.keys(dailies.coop);
            for (var j = 0; j < keys.length; j++) {
              key = keys[j];
              if (dailies.coop[key].quest !== '???') {
                if (dailies.coop[key].raw === list[i].description) {
                  array.push(['coop', key, 'progress'], parseInt(list[i].progress));
                  break;
                }
              } else {
                array.push(['coop', key, 'raw'], list[i].description);
                array.push(['coop', key, 'quest'], parseDescription(list[i].description));
                array.push(['coop', key, 'max'], parseInt(list[i].max_progress));
                array.push(['coop', key, 'progress'], parseInt(list[i].progress));
                break;
              }
            }
          }
          setDailies(array);
        }
      }
    },
    CompleteRaid: function (json) {
      var path;
      var id;
      var array = [];
      if (!Array.isArray(json.mbp_info) && json.mbp_info !== undefined && json.mbp_info.add_result !== undefined) {
        Object.keys(json.mbp_info.add_result).forEach(function (key) {
          path = json.mbp_info.add_result[key];
          id = '' + path.mbp_id;
          array.push(['renown', id], dailies.renown[id] + parseInt(path.add_point));
        });
      }
      setDailies(array);
    },
    CheckRenownPrestige: function (json) {
      var array = [];
      if (json.option !== undefined) {
        json = json.option;
      }
      var hash = json.mbp_limit_info['92001'].limit_info;
      Object.keys(hash).forEach(function (key) {
        array.push(['renown', '' + hash[key].param.mbp_id], parseInt(hash[key].data.weekly.get_number));
      });
      var path = json.mbp_limit_info['92002'].limit_info['10100'];
      array.push(['renown', '' + path.param.mbp_id], parseInt(path.data.weekly.get_number));
      var path = json.mbp_limit_info['92002'].limit_info['20300'];
      array.push(['renown', '' + path.param.mbp_id], parseInt(path.data.weekly.get_number));
      setDailies(array);
    },
    CheckTweet: function (json) {
      if (json.twitter.campaign_info.is_avail_twitter !== undefined) {
        if (json.twitter.campaign_info.is_avail_twitter === true) {
          setDailies([
            ['tweet'], true
          ]);
        } else {
          setDailies([
            ['tweet'], false
          ]);
        }
      }
    },
    UseTweet: function (json) {
      if (json.reward_status === true) {
        APBP.SetMax();
        setDailies([
          ['tweet'], false
        ]);
      }
    },
    PurchaseMoon: function (json) {
      var id = json.article.item_ids[0];
      if (id === '30031' || id === '30032' || id === '30033') {
        setDailies(['moons', id], 0);
      }
    },
    CheckMoons: function (json) {
      var id;
      var amounts = {
        '30031': 0,
        '30032': 0,
        '30033': 0
      };
      for (var i = 0; i < json.list.length; i++) {
        id = json.list[i].item_ids[0];
        if (id === '30031' || id === '30032' || id === '30033') {
          amounts[id] = 1;
        }
      }
      Object.keys(amounts).forEach(function (key) {
        setDailies([
          ['moons', key], amounts[key]
        ]);
      });
    },
    CheckGacha: function (json) {
      var canRoll = false;
      if (json.enable_term_free_legend !== undefined && json.enable_term_free_legend !== false) {
        canRoll = true;
      } else if (json.enable_term_free_legend_10 !== undefined && json.enable_term_free_legend_10 !== false) {
        canRoll = true;
      }
      setDailies([
        ['freeSingleRoll'], canRoll
      ]);
    },
    RollCampaign: function (json, header) {
      setDailies([
        ['freeSingleRoll'], false
      ]);
    },
    PurchaseDistinction: function (json) {
      var id = json.article.item_ids[0];
      if (dailies.distinctions[id] !== undefined) {
        setDailies([
          ['distinctions', id], 0
        ]);
      }
    },
    SetDistinctions: function (json) {
      var keys = Object.keys(json.list);
      var ids = {};
      var first = -1;
      var last = -1;
      var found = false;
      for (var i = 0; i < keys.length; i++) {
        //if start hasn't been determined
        var id = json.list[keys[i]].item_ids[0];
        if (dailies.distinctions[id] !== undefined) {
          ids[id] = true;
          found = true;
          if (first === -1) {
            first = parseInt(id);
          } else {
            last = parseInt(id);
          }
        } else {
          if (i === 0) {
            first = 20411;
          } else if (i === keys.length - 1) {
            last = 20761;
          }
        }
      }
      if (found) {
        var distinctions = Object.keys(dailies.distinctions);
        // var start = 0;
        // if(!pre) {
        //   start = distinctions.indexOf(ids[0]);
        // }
        // var end = distinctions.length;
        var array = [];
        for (var i = 0; i < distinctions.length; i++) {
          var id = distinctions[i];
          if (parseInt(id) >= first && parseInt(id) <= last) {
            if (ids[id] === undefined) {
              array.push(['distinctions', id], 0);
            }
          }
        }
        setDailies(array);
      }
    },
    SetPrimarchs: function (json) {
      var primarchJson = json.option.quest.extra_normal_quest.quest_list.host_group['3000'];
      setDailies([
        ['primarchs'], primarchJson.group_limited_count
      ]);
    },
    DecPrimarchs: function (payload) {
      if (primarchHash['' + payload.quest_id]) {
        setDailies([
          ['primarchs'], dailies['primarchs'] - 1
        ]);
      }
    }
    // PurchaseDefense: function(json) {
    //   // var id = json.article.item_ids[0];
    //   // if(id === '30031' || id === '30032' || id === '30033') {
    //   //   if(setMoon(id, 0)) {
    //   //     saveMoons();
    //   //   }
    //   // }
    // },
    // CheckDefense: function(json, url) {
    //   var id;
    //   var amounts;
    //   switch(url.substring(url.lastIndexOf('/') + 1, url.indexOf('?'))) {
    //     case '1':
    //       amounts = {'1356': 0, '1357': 0};
    //       break;
    //     case '2':
    //       amounts = {'1368': 0};
    //       break;
    //     case '3':
    //       amounts = {'1381': 0};
    //       break;
    //   }
    //   for(var i = 0; i < json.list.length; i++) {
    //     id = json.list[i].id;
    //     if(amounts[id] !== undefined) {
    //       amounts[id] = json.list[i].remain_number;
    //     }
    //   }
    //   Object.keys(amounts).forEach(function(key) {
    //     setDailies([['defense', key], amounts[key]]);
    //   });
    // },
  }
  var setDailies = function (array, override) { //category, value) {
    var category;
    var value;
    var updated = false;
    for (var i = 0; i < array.length; i += 2) {
      category = array[i];
      value = array[i + 1];
      var curr = dailies;
      var cat = category;
      for (var j = 0; j < category.length - 1; j++) {
        curr = curr[category[j]];
      }
      cat = category[category.length - 1];
      if (curr[cat] === undefined || curr[cat] !== value) {
        updated = true;
        curr[cat] = value;
        Message.PostAll(getJquery(category));
        Message.PostAll(checkCollapse(category));
      } else if (override) {
        Message.PostAll(getJquery(category));
        Message.PostAll(checkCollapse(category));
      }
    }
    if (updated) {
      Storage.Set('dailies', dailies);
    }
  }

  var checkCollapse = function (category) {
    var collapse = true;
    if (category[0] === 'draw-rupie' || category[0] === 'tweet' || category[0] === 'freeSingleRoll' || category[0] === 'primarchs') {
      category[0] = 'misc';
      if (dailies['draw-rupie'] !== 0 || dailies['tweet']) {
        collapse = false;
      } else if (Options.Get('freeSingleRoll') && dailies['freeSingleRoll']) {
        collapse = false;
      } else if (Options.Get('primarchDaily') && dailies['primarchs'] !== 0) {
        collapse = false;
      }
    } else if (category[0] === 'coop') {
      var coop;
      var coops = Object.keys(dailies['coop']);
      for (var i = 0; i < coops.length; i++) {
        coop = dailies['coop'][coops[i]];
        if (coop.quest === '???' || coop.progress !== coop.max) {
          collapse = false;
          break;
        }
      }
    } else if (category[0] === 'renown') {
      var cat = category[0];
      var array = Object.keys(dailies[cat]);
      for (var i = 0; i < array.length; i++) {
        if (!(array[i] === '4' && !isHL) && array[i] !== '5' && array[i] !== '6') {
          if (dailies[cat][array[i]] !== dailiesData[cat][array[i]]) {
            collapse = false;
            break;
          }
        }

      }
    } else if (category[0] === 'moons') {
      var cat = category[0];
      var array = Object.keys(dailies[cat]);
      for (var i = 0; i < array.length; i++) {
        if (dailies[cat][array[i]] === dailiesData[cat][array[i]]) {
          collapse = false;
          break;
        }
      }
    } else if (category[0] === 'distinctions') {
      var cat = category[0];
      var array = Object.keys(dailies[cat]);
      for (var i = 0; i < array.length; i++) {
        if (dailies[cat][array[i]] === 1 && Options.Get(array[i])) {
          collapse = false;
          break;
        }
      }
    }
    var id = '#collapse-dailies-' + category[0];
    return {
      'collapsePanel': {
        'id': id,
        'value': collapse
      }
    };
  }
  var getJquery = function (category) {
    var id = '#dailies'
    var value = dailies;
    var str = '';
    if (category[0] === 'draw-rupie') {
      str += 'Rupie draws: ';
    } else if (category[0] === 'tweet') {
      str += 'Tweet refill: ';
    } else if (category[0] === 'freeSingleRoll') {
      str += 'Free Gacha Roll: ';
    } else if (category[0] === 'primarchs') {
      str += 'Primarchs: ';
    } else if (category[0] === 'coop') {
      if (category[2] === 'raw' || category[2] === 'max') {
        return undefined;
      }
    }
    for (var i = 0; i < category.length; i++) {
      id += '-' + category[i];
      if (value !== undefined) {
        value = value[category[i]];
      }
    }
    if (value !== undefined) {
      if (value === true) {
        str += 'Available';
      } else if (value === false) {
        str += 'Not available';
      } else {
        str += value;
      }
      if (dailiesData[category[0]] !== undefined) {
        str += '/' + dailiesData[category[0]][category[1]];
      } else if (category[0] === 'coop' && value !== '' && category[2] === 'progress') {
        str += '/' + dailies[category[0]][category[1]]['max'];
      } else if (category[0] === 'distinctions') {
        str += '/1'
      }
    }
    //console.log('setting text: ' + id + ' ' + str);
    return {
      'setText': {
        'id': id,
        'value': str
      }
    };
  }

  var recursiveSearch = function (category, array) {
    if (typeof category !== 'object') {
      return getJquery(array);
    } else {
      var response = [];
      Object.keys(category).forEach(function (key) {
        response = response.concat(recursiveSearch(category[key], array.concat(key)));
      })
      return response;
    }
  }

  var parseDescription = function (description) {
    newDescription = "";
    if (description.indexOf('stage') !== -1) {
      newDescription = "Clear " + description.substring(description.indexOf('stage') + 8, description.lastIndexOf(' ', description.lastIndexOf('time') - 2));
      if (newDescription.indexOf('(Hard)') !== -1) {
        newDescription = newDescription.replace('(Hard)', '(H' + description.charAt(12) + ').');
      } else {
        newDescription += ' (N' + description.charAt(12) + ').';
      }
    } else if (description.indexOf('in Co-Op rooms') !== -1) {
      newDescription = description.substring(0, description.indexOf('in Co-Op rooms') - 1) + '.';
    } else {
      newDescription = description;
    }
    return newDescription;
  }

  var increaseRenown = function (isIncreased) {
    for (var key in renownMax) {
      if (renownMax.hasOwnProperty(key)) {
        if (isIncreased) {
          dailiesData.renown[key] = renownIncreasedMax[key];
        } else {
          dailiesData.renown[key] = renownMax[key];
        }
      }
    }
  }
})();