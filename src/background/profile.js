(function () {
  var profile = {
    lupi: null,
    level: 1,
    levelPercent: null,
    levelNextExp: null,
    job: null,
    jobPercent: null,
    jobNextExp: null,
    jobPoints: null,
    zenith: null,
    zenithPercent: null,
    zenithNextExp: null,
    renown: null,
    prestige: null,
    casinoChips: null,
    weaponNumber: null,
    weaponMax: null,
    summonNumber: null,
    summonMax: null,
    characterNumber: null,
    drops: null,
    crystal: null,
    defenseBadges: null,
    defenseRank: null,
    sparks: null,
    arcaP: null,
    arcaB: null,
  }
  var responseList = {};
  var restoreIDs = ['1', '2', '3', '5'];
  var profileNames = [];
  var nextUncap = null;
  var nextCost = 0;
  var nextUpgrade = null;
  window.Profile = {
    Initialize: function (callback) {
      for (var i = 0; i < restoreIDs.length; i++) {
        Supplies.Get(restoreIDs[i], 'recovery', function (id, amt) {
          Message.PostAll({
            setText: {
              'id': '#profile-' + id,
              'value': amt
            }
          });
        });
      }
      Storage.Get(['profile'], function (response) {
        if (response['profile'] !== undefined) {
          profile = response['profile'];
        } else {
          Storage.Set('profile', profile);
        }
        Object.keys(responseList).forEach(function (key) {
          for (var i = 0; i < responseList[key].length; i++) {
            responseList[key][i](profile[key]);
          }
        });
        if (callback !== undefined) {
          callback();
        }
      });

    },
    InitializeDev: function () {
      var response = [];
      Object.keys(profile).forEach(function (key) {
        response.push(getJquery(key));
      });
      for (var i = 0; i < restoreIDs.length; i++) {
        response.push({
          setText: {
            'id': '#profile-' + restoreIDs[i],
            'value': Supplies.Get(restoreIDs[i], 'recovery')
          }
        });
      }
      return response;
    },
    Get: function (category, response) {
      if (response !== undefined) {
        if (responseList[category] === undefined) {
          responseList[category] = [];
        }
        responseList[category].push(response);
        response(profile[category]);
      }
      if (profile[category] !== undefined) {
        return profile[category];
      }
    },
    CompleteQuest: function (json, raidTuples) {
      var tuples = {};
      if (raidTuples !== undefined) {
        tuples = raidTuples;
      }
      tuples['lupi'] = profile['lupi'] + json.rewards.lupi.sum;
      if (json.values.pc_levelup.is_levelup) {
        var remain = 0;
        for (var i = 1; i <= json.values.pc.param.new.level; i++) {
          if (json.values.pc.param.next_exp_list['' + i] !== undefined) {
            remain += json.values.pc.param.next_exp_list['' + i];
          }
        }
        tuples['levelNextExp'] = remain - json.values.pc.param.new.exp;
        APBP.SetMax();
      } else {
        tuples['levelNextExp'] = parseInt(json.values.pc.param.remain_next_exp) - (parseInt(json.values.get_exp.exp) + parseInt(json.values.get_exp.exp_bonus));
      }
      tuples['level'] = json.values.pc.param.new.level;
      tuples['levelPercent'] = json.values.pc.param.new.exp_width + '%';

      if (profile['job'] !== json.values.pc.job.new.level) {
        var remain = 0;
        for (var i = 1; i <= json.values.pc.job.new.level; i++) {
          if (json.values.pc.job.next_exp_list['' + i] !== undefined) {
            remain += json.values.pc.job.next_exp_list['' + i];
          }
        }
        tuples['jobNextExp'] = remain - json.values.pc.job.new.exp;
      } else {
        tuples['jobNextExp'] = parseInt(json.values.pc.job.remain_next_exp) - (parseInt(json.values.get_exp.job_exp) + parseInt(json.values.get_exp.job_exp_bonus));
      }
      tuples['job'] = json.values.pc.job.new.level;
      tuples['jobPercent'] = json.values.pc.job.new.exp_width + '%';
      if (tuples['job'] === 20) {
        tuples['zenith'] = parseInt(json.values.pc.job.zenith.after_lp);
        tuples['zenithPercent'] = json.values.pc.job.zenith.after_exp_gauge + '%';
        tuples['zenithNextExp'] = profile['zenithNextExp'] - (parseInt(json.values.get_exp.job_exp) + parseInt(json.values.get_exp.job_exp_bonus));
      }
      var list = json.rewards.reward_list;
      var item;
      var category;
      for (var property in list) {
        if (list.hasOwnProperty(property)) {
          for (var i = 0; i < list[property].length; i++) {
            item = list[property][i];
            category = getCategory(item.item_kind);
            if (category !== undefined) {
              if (tuples[category] === undefined) {
                tuples[category] = profile[category] + 1;
              } else {
                tuples[category]++;
              }
            }
          }
        }
      }
      setProfile(tuples);
    },
    CompleteRaid: function (json) {
      var path;
      var tuples = {};
      var ids = ['10100', '20100', '20200'];
      if (!Array.isArray(json.mbp_info) && json.mbp_info !== undefined) {
        tuples['renown'] = profile['renown'];
        tuples['prestige'] = profile['prestige'];
        for (var i = 0; i < ids.length; i++) {
          if (json.mbp_info.add_result[ids[i]] !== undefined) {
            path = json.mbp_info.add_result[ids[i]];
            if (path.add_point !== 0) {
              if (path.mbp_id === '4') {
                tuples['prestige'] += path.add_point;
                break;
              } else {
                tuples['renown'] += path.add_point;
              }
            }
          }
        }
      }
      Profile.CompleteQuest(json, tuples);
    },
    SetChips: function (amount) {
      setProfile({
        'casinoChips': parseInt(amount)
      });
    },
    SetWeaponNumber: function (json) {
      var tuples = {};
      tuples['weaponMax'] = parseInt(json.options.max_number);
      tuples['weaponNumber'] = json.options.number;

      setProfile(tuples);
    },
    SetSummonNumber: function (json) {
      var tuples = {};
      tuples['summonMax'] = parseInt(json.options.max_number);
      tuples['summonNumber'] = json.options.number;

      setProfile(tuples);
    },
    SetCharacterNumber: function (json, url) {
      if (url.indexOf('/1/0?') !== -1) {
        for (var key in json.options.filter) {
          if (json.options.filter.hasOwnProperty(key)) {
            if (parseInt(json.options.filter[key]) !== 0) {
              return;
            }
          }
        }
        setProfile({
          'characterNumber': json.options.number
        });
      }
    },
    MoveFromStash: function (json) {
      var tuples = {};
      var type;
      if (json.from_name.indexOf('Weapon') !== -1) {
        type = 'weapon';
      } else if (json.from_name.indexOf('Summon') !== -1) {
        type = 'summon';
      }
      tuples[type + 'Max'] = parseInt(json.to_max_number);
      tuples[type + 'Number'] = json.to_number;
      setProfile(tuples);
    },
    MoveToStash: function (json) {
      var tuples = {};
      var type;
      if (json.to_name.indexOf('Weapon') !== -1) {
        type = 'weapon';
      } else if (json.to_name.indexOf('Summon') !== -1) {
        type = 'summon';
      }
      tuples[type + 'Max'] = parseInt(json.from_max_number);
      tuples[type + 'Number'] = json.from_number;
      setProfile(tuples);
    },
    SetLupiCrystal: function (json) {
      var jsondata = unescape(json.data);
      var tuples = {};
      if (json.mydata !== undefined) {
        tuples['lupi'] = parseInt(jsondata.match(/\"prt-lupi">?(\d*)\<\/div>/)[1]);
        tuples['crystal'] = parseInt(jsondata.match(/\"prt-stone">?(\d*)\<\/div>/)[1]);
        setProfile(tuples);
      } else if (json.option !== undefined && json.option.mydata_assets !== undefined) {
        tuples['lupi'] = parseInt(jsondata.match(/\"prt-lupi">?(\d*)\<\/div>/)[1]);
        tuples['crystal'] = parseInt(jsondata.match(/\"prt-stone">?(\d*)\<\/div>/)[1]);
        setProfile(tuples);
      }
    },
    LupiDraw: function (json) {
      var tuples = {};

      tuples['weaponMax'] = parseInt(json.user_info.weapon_max);
      tuples['weaponNumber'] = parseInt(json.user_info.weapon_count);

      tuples['summonMax'] = parseInt(json.user_info.summon_max);
      tuples['summonNumber'] = parseInt(json.user_info.summon_count);
      tuples['lupi'] = parseInt(json.user_info.money);
      tuples['crystal'] = parseInt(json.user_info.user_money);
      setProfile(tuples);
    },
    SetDrops: function (json) {
      var tuples = {};
      tuples['crystal'] = parseInt(json.amount);
      tuples['drops'] = parseInt(json.trangect_drop);
      setProfile(tuples);
    },
    SetArcanum: function (json) {
      jsondata = unescape(json.data);
      var tuples = {};
      tuples['arcaB'] = parseInt(jsondata.match(/\"txt-passport-num">?(\d*)\<\/span>/)[1]);
      tuples['arcaP'] = parseInt(jsondata.match(/\"txt-possession-num"><span>?(\d*)\<\/span>/)[1]);
      setProfile(tuples);
    },
    SetDefense: function (json) {
      var tuples = {};
      if (json.defendorder_point_total !== undefined) {
        tuples['defenseBadges'] = parseInt(json.defendorder_point_total);
      }
      if (json.defendorder_title !== undefined) {
        tuples['defenseRank'] = parseInt(json.defendorder_title.level);
      }
      setProfile(tuples);
    },
    SpendCrystals: function (json) {},
    SetHomeProfile: function (rank, rankPercent, job, jobPercent, jobPoints, renown, prestige, arcaB, arcaP) {
      var tuples = {};

      tuples['level'] = rank;
      if (rankPercent !== undefined) {
        tuples['levelPercent'] = rankPercent.substring(rankPercent.indexOf(': ') + 2, rankPercent.indexOf(';'));
      }
      tuples['job'] = parseInt(job);
      if (jobPercent !== undefined) {
        if (profile['job'] === 20) {
          tuples['zenithPercent'] = jobPercent.substring(jobPercent.indexOf(': ') + 2, jobPercent.indexOf(';'));
        } else {
          tuples['jobPercent'] = jobPercent.substring(jobPercent.indexOf(': ') + 2, jobPercent.indexOf(';'));
        }
      }
      if (!isNaN(jobPoints)) {
        tuples['jobPoints'] = parseInt(jobPoints);
      }
      if (!isNaN(renown)) {
        tuples['renown'] = parseInt(renown);
      }
      if (!isNaN(prestige)) {
        tuples['prestige'] = parseInt(prestige);
      }
      if (!isNaN(arcaP)) {
        tuples['arcaP'] = parseInt(arcaP);
      }
      if (!isNaN(arcaB)) {
        tuples['arcaB'] = parseInt(arcaB);
      }
      setProfile(tuples);
    },
    AddLupi: function (amt) {
      setProfile({
        'lupi': profile['lupi'] + parseInt(amt)
      });
    },
    CheckWeaponSummon: function (json) {
      var tuples = {};
      tuples['weaponMax'] = parseInt(json.weapon_count.max_count);
      tuples['weaponNumber'] = json.weapon_count.current_count;
      tuples['summonMax'] = parseInt(json.summon_count.max_count);
      tuples['summonNumber'] = json.summon_count.current_count;
      setProfile(tuples);
    },
    GetLoot: function (json) {
      var item;
      var tuples = {};
      var list = json.rewards.reward_list;
      for (var property in list) {
        if (list.hasOwnProperty(property)) {
          for (var i = 0; i < list[property].length; i++) {
            item = list[property][i];
            category = getCategory(item.item_kind);
            if (category !== undefined) {
              if (tuples[category] === undefined) {
                tuples[category] = profile[category] + 1;
              } else {
                tuples[category]++;
              }
            }
          }
        }
      }
      list = json.rewards.article_list;
      for (var property in list) {
        if (list.hasOwnProperty(property)) {
          item = list[property];
          category = getCategory('' + item.kind);
          if (category !== undefined) {
            if (tuples[category] === undefined) {
              tuples[category] = profile[category] + item.count;
            } else {
              tuples[category] += item.count;
            }
          }
        }
      }
      setProfile(tuples);
    },
    GetGift: function (json) {
      var category = getCategory(json.item_kind_id);
      if (category !== undefined) {
        setProfile({
          [category]: profile[category] + parseInt(json.number)
        });
      }
    },
    GetAllGifts: function (json) {
      var item;
      var category;
      var tuples = {};
      for (var i = 0; i < json.presents.length; i++) {
        item = json.presents[i];
        category = getCategory(item.item_kind_id);
        if (category !== undefined) {
          if (tuples[category] === undefined) {
            tuples[category] = profile[category] + parseInt(item.number);
          } else {
            tuples[category] += parseInt(item.number);
          }
        }
      }
      setProfile(tuples);
    },
    SetUncapItem: function (json) {
      nextUncap = null;
    },
    SetUncap: function (json, url) {
      if (url.indexOf('weapon') !== -1) {
        nextUncap = 'weaponNumber';
      } else if (url.indexOf('summon') !== -1) {
        nextUncap = 'summonNumber';
      }
    },
    Uncap: function (json) {
      if (nextUncap !== null) {
        setProfile({
          [nextUncap]: profile[nextUncap] - 1
        });
      }
    },
    SetUncapCost: function (json) {
      nextCost = parseInt(json.cost);
      setProfile({
        'lupi': parseInt(json.amount)
      });
    },
    BuyUncap: function () {
      setProfile({
        'lupi': nextCost
      });
    },
    SetUpgrade: function (json, url) {
      var category;
      if (url.indexOf('weapon') !== -1 || url.indexOf('npc') !== -1) {
        category = 'weaponNumber';
      } else if (url.indexOf('summon') !== -1) {
        category = 'summonNumber';
      }
      nextUpgrade = {
        'amount': json.material_list.length,
        'category': category
      }
    },
    Upgrade: function (json) {
      if (nextUpgrade !== undefined) {
        setProfile({
          [nextUpgrade.category]: profile[nextUpgrade.category] - nextUpgrade.amount
        });
      }
    },
    PurchaseItem: function (json) {
      var dir = json.article.article1;
      if (dir.master !== undefined) {
        var amt = parseInt(dir.has_number) - parseInt(json.article.article1_number) * json.purchase_number;
        if (dir.master.id === '92001') {
          setProfile({
            'renown': amt
          });
        } else if (dir.master.id === '92002') {
          setProfile({
            'prestige': amt
          });
        }
      }
    },
  }
  getCategory = function (item_kind) {
    if (item_kind === '1') {
      return 'weaponNumber';
    } else if (item_kind === '2') {
      return 'summonNumber';
    } else if (item_kind === '3') {
      return 'characterNumber';
    } else if (item_kind === '7') {
      return 'lupi';
    } else if (item_kind === '9') {
      return 'crystal';
    } else if (item_kind === '19') {
      return 'jobPoints';
    } else if (item_kind === '31') {
      return 'casinoChips';
    } else if (item_kind === '40') {
      return 'zenith';
    } else if (item_kind === '59') {
      return 'defenseBadges';
    } else {
      return undefined;
    }
  }

  setProfile = function (tuples) {
    var updated = false;
    var value;
    var category;
    Object.keys(tuples).forEach(function (category) {
      value = tuples[category];
      if (value < 0) {
        value = 0;
      }
      if (category === 'weaponNumber') {
        if (value > profile['weaponMax']) {
          value = profile['weaponMax'];
        }
      } else if (category === 'summonNumber') {
        if (value > profile['summonMax']) {
          value = profile['summonMax'];
        }
      }
      if (profile[category] !== value) {
        profile[category] = value;
        updated = true;
        Message.PostAll(getJquery(category));
        if (category === 'crystal') {
          Message.PostAll({
            'setPlannerItemAmount': {
              'id': category,
              'sequence': 0,
              'current': value
            }
          });
        }
        if (responseList[category] !== undefined) {
          for (var i = 0; i < responseList[category].length; i++) {
            responseList[category][i](value);
          }
        }
      }
    });
    if (updated) {
      Storage.Set('profile', profile);
    }
  }

  getJquery = function (category) {
    var value;
    if (category === 'jobNextExp' && profile.job === 20) {
      value = profile['zenithNextExp'];
    } else if (category === 'jobPercent' && profile.job === 20) {
      value = profile['zenithPercent'];
    } else if ((category === 'weaponMax' || category === 'weaponNumber') && profile['weaponNumber'] !== null && profile['weaponMax'] !== null) {
      value = profile['weaponNumber'] + '/' + profile['weaponMax'];
      category = 'weapon';
    } else if ((category === 'summonMax' || category === 'summonNumber') && profile['summonnNumber'] !== null && profile['summonMax'] !== null) {
      value = profile['summonNumber'] + '/' + profile['summonMax'];
      category = 'summon';
    } else {
      value = profile[category];
    }
    if (value === null || value === undefined) {
      value = '???';
    }
    if (category === 'zenithNextExp') {
      value = '';
    }
    if (category === 'zenithNextExp' && profile.job === 20) {
      category = 'jobNextExp';
    } else if (category === 'zenithPercent') {
      category = 'jobPercent';
    }
    value = numberWithCommas(value);
    if (category === 'level') {
      value = 'Rank: ' + value;
    } else if (category === 'job') {
      value = 'Class: ' + value;
    } else if (category === 'levelPercent' || category === 'jobPercent') {
      if (value === '???') {
        value = 0;
      }
      return {
        setBar: {
          'id': '#profile-' + category,
          'value': value
        }
      };
    }
    return {
      setText: {
        'id': '#profile-' + category,
        'value': value
      }
    };
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
})();