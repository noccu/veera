// (function() {
//   chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//     if(message.request) {
//       if(message.request.url.indexOf('assets_en/img/sp/') !== -1 && message.request.url.indexOf('.jpg') !== -1) {
//         Quest.LoadImage(message.request.url);
//       }
//       //profile
//       if(message.request.url.indexOf('/mbp/mbp_info?_=') !== -1) {
//         Profile.SetPendants(message.request.response);
//       }
//       //verify current ap/ep
//       if(message.request.url.indexOf('/user/status?') !== -1 || message.request.url.indexOf('/user/data_assets?') !== -1) {
//           APBP.VerifyAPBP(message.request.response);
//           Profile.SetLupiCrystal(message.request.response);
//       }
//       //check entering raid resources
//       if(message.request.url.indexOf('/quest/treasure_raid')  !== -1) {
//           Supplies.RaidTreasureInfo(message.request.response);
//       }
//       if(message.request.url.indexOf('/quest/treasure_check_item')  !== -1) {
//           Supplies.RaidTreasureCheck(message.request.response, message.request.url);
//       }
//       //check limited quest
//       if(message.request.url.indexOf('/quest/check_quest_start/') !== -1) {
//           //Message.ConsoleLog('network.js', 'test1');
//           Message.MessageTabs({selectQuest: true});
//           Quest.CheckDailyRaid(message.request.response, message.request.url);
//           //Message.ConsoleLog('network.js', 'test2');
//       }
//       //initialize quest -> SELECTING QUEST
//       if(message.request.url.indexOf('/quest/quest_data/') !== -1) {
//           APBP.InitializeQuest(message.request.response);
//           Quest.InitializeQuest(message.request.response, message.request.url);
//           Supplies.InitializeRaid(message.request.response, message.request.url);
//           Message.MessageTabs({startQuest: {
//             'name': message.request.response.chapter_name,
//             'ap': message.request.response.action_point,
//           }}, function(response) {
//             Quest.InitializeQuestImg(response);
//           });
//           // chrome.runtime.sendMessage({enterQuest : {'name': message.request.response.chapter_name}}, function(response) {
//           //   Message.ConsoleLog('network.js', response);
//           //   //Quest.InitializeQuestImg(response);
//           // })
//       }
//       //start quest -> ACTUALLY ENTER THE QUEST
//       if(message.request.url.indexOf('/quest/create_quest?') !== -1) {
//           APBP.StartQuest(message.request.response);
//           Quest.StartQuest(message.request.response);
//           Supplies.EnterRaid(message.request.response);
//       }
//       //CHECK IF HOSTING QUEST IS RAID
//       if(message.request.url.indexOf('/quest/raid_info') !== -1) {
//           Quest.CheckRaid(message.request.response);
//       }
//       //PROGRESS TO NEXT STAGE IN QUEST
//       if(message.request.url.indexOf('/raid/start.json') !== -1) {
//           Quest.NextBattle(message.request.response);
//       }
//       //quest page - check if currently in quest
//       if(message.request.url.indexOf('quest/init_list/null?_=') !== -1) {
//           Quest.CheckQuest(message.request.response);
//       }

//       //quest loot
//       if(message.request.url.indexOf('/result/data/') !== -1) {
//           Quest.CompleteQuest(message.request.response);
//           Profile.CompleteQuest(message.request.response);
//           Supplies.GetLoot(message.request.response);
//       }
//       //initialize raid -> SELECTING RAID
//       if(message.request.url.indexOf('/quest/assist_list') !== -1) {
//           APBP.InitializeRaid(message.request.response);
//           if(message.request.url.indexOf('/0/') !== -1) {
//             Quest.InitializeRaid(message.request.response, 'normal');
//           } else {
//             Quest.InitializeRaid(message.request.response, 'event');
//           }
//         Message.MessageTabs({checkRaids: true}, function(response) {

//         });
//       }
//       //initialize raid through code
//       if(message.request.url.indexOf('/quest/battle_key_check') !== -1) {
//           APBP.InitializeRaidCode(message.request.response);
//           Quest.InitializeRaidCode(message.request.response);
//       }
//       //join raid
//       if(message.request.url.indexOf('/quest/raid_deck_data_create') !== -1) {
//           APBP.StartRaid(message.request.response);
//           Quest.EnterRaid(message.request.response);
//       }
//       //enter raid
//       if(message.request.url.indexOf('/multiraid/start.json?_=') !== -1) {
//           //APBP.StartRaid(message.request.response);
//       }
//       //check raid complete
//       if(message.request.url.indexOf('/resultmulti/check_reward/') !== -1) {
//           //APBP.ClearRaid(message.request.response, url);
//           Quest.CheckRaidReward(message.request.response, message.request.url);
//       }
//       //raid loot
//       if(message.request.url.indexOf('/resultmulti/data/') !== -1) {
//           Quest.CompleteRaid(message.request.response, message.request.url);
//           Supplies.GetLoot(message.request.response);
//           Profile.CompleteRaid(message.request.response);       
//           Dailies.CompleteCoop(message.request.response);
//           Dailies.CompleteRaid(message.request.response);
//           //APBP.RestoreAPBP(message.request.response);
//       }
//       //set coop room
//       if(message.request.url.indexOf('/coopraid/room_quest_setting') !== -1) {
//           Quest.InitializeCoop(message.request.response);
//       }
//       //enter coop room
//       if(message.request.url.indexOf('/coopraid/content/room/') !== -1) {
//           Quest.EnterCoop(message.request.response);
//       }
//       //restore ap/bp
//       if(message.request.url.indexOf('/quest/user_item/') !== -1) {
//           APBP.RestoreAPBP(message.request.response);
//           Supplies.UseRecovery(message.request.response, message.request.url);
//       }
//       //gacha
//       if(message.request.url.indexOf('/gacha/list?_=') !== -1) {
//           Dailies.SetDraws(message.request.response);
//       }
//       if(message.request.url.indexOf('/gacha/normal/result//normal/6?_=') !== -1) {
//           Dailies.DecDraws(message.request.response);
//           Profile.LupiDraw(message.request.response);
//       } 
//       if(message.request.url.indexOf('/gacha/result//legend') !== -1) {
//           Dailies.DecDraws(message.request.response);
//           Profile.CrystalDraw(message.request.response);
//       }
//       //co-op dailies
//       if(message.request.url.indexOf('/coopraid/daily_mission?_=') !== -1) {
//           Dailies.SetCoop(message.request.response);
//       }
//       //casino list
//       if(message.request.url.indexOf('/casino/article_list/1/1?_=') !== -1 || message.request.url.indexOf('/casino/article_list/undefined/1?_=') !== -1) {
//           Casino.SetCasino1(message.request.response);
//           Profile.SetChips(message.request.response.medal.number);
//       }
//       if(message.request.url.indexOf('/casino/article_list/undefined/2?_=') !== -1) {
//           Casino.SetCasino2(message.request.response);
//           Profile.SetChips(message.request.response.medal.number);
//       }
//       //casino buy
//       if(message.request.url.indexOf('/casino/exchange?_=') !== -1) {
//           Casino.BuyCasino(message.request.response);
//   //Supplies.BuyCasino(message.request.response, JSON.stringify(request.request.postData).replace(/:/g, '').replace(/,/g, '').split('\\\"'));
//       }
//       if(message.request.url.indexOf('/twitter/twitter_info/') !== -1) {
//           Dailies.CheckTweet(message.request.response);
//       }
//       if(message.request.url.indexOf('/twitter/tweet?_=') !== -1) {
//           Dailies.UseTweet(message.request.response);
//       }
//       if(message.request.url.indexOf('/item/normal_item_list') !== -1) {
//           Supplies.SetRecovery(message.request.response);
//       }
//       if(message.request.url.indexOf('/item/evolution_items') !== -1) {
//           Supplies.SetPowerUp(message.request.response);
//       }
//       if(message.request.url.indexOf('/item/article_list') !== -1) {
//           Supplies.SetTreasure(message.request.response);
//       }
//       if(message.request.url.indexOf('/item/gacha_ticket_list') !== -1) {
//           Supplies.SetDraw(message.request.response);
//       }
//       if(message.request.url.indexOf('/present/possessed') !== -1) {
//           Profile.CheckWeaponSummon(message.request.response);
//       }
//       if(message.request.url.indexOf('/present/receive?') !== -1) {
//           Supplies.GetGift(message.request.response);
//           Profile.GetGift(message.request.response);
//       }
//       if(message.request.url.indexOf('/present/receive_all?') !== -1 || message.request.url.indexOf('/present/term_receive_all?') !== -1) {
//           Supplies.GetAllGifts(message.request.response);
//           Profile.GetAllGifts(message.request.response);
//       }
//       //treasure trade purchase
//       if(message.request.url.indexOf('/shop_exchange/purchase/') !== -1) {
//           Supplies.PurchaseItem(message.request.response);
//           Dailies.PurchaseMoon(message.request.response);
//       }
//       if(message.request.url.indexOf('/weapon/list/') !== -1) {
//           Profile.SetWeaponNumber(message.request.response);
//       }
//       if(message.request.url.indexOf('/npc/list/') !== -1) {
//           Profile.SetCharacterNumber(message.request.response);
//       }
//       if(message.request.url.indexOf('/summon/list/') !== -1) {
//           Profile.SetSummonNumber(message.request.response);
//       }
//       if(message.request.url.indexOf('/container/move?') !== -1) {
//           Profile.MoveFromStash(message.request.response);
//       }
//       if(message.request.url.indexOf('/listall/move?') !== -1) {
//           Profile.MoveToStash(message.request.response);
//       }
//       if(message.request.url.indexOf('/shop/point_list') !== -1) {
//           Profile.SetDrops(message.request.response);
//       }
//       //Moon shop
//       if(message.request.url.indexOf('/shop_exchange/article_list/5/1/1/null/null/null?') !== -1 || message.request.url.indexOf('/shop_exchange/article_list/5/1/1/null/null/3?') !== -1) {
//           Dailies.CheckMoons(message.request.response);
//       }
//       //do shop
//       if(message.request.url.indexOf('/shop_exchange/article_list/10/1/1/null/null/') !== -1) {
//           Profile.SetDefense(message.request.response);
//           Dailies.CheckDefense(message.request.response, message.request.url);
//       }
//       if(message.request.url.indexOf('/shop/purchase') !== -1) {
//           Profile.SpendCrystals(message.request.response);
//       }
//       if(message.request.url.indexOf('/npc/list') !== -1 || message.request.url.indexOf('/weapon/list') !== -1 || message.request.url.indexOf('/summon/list') !== -1) {
//           Profile.SetInventoryCount(message.request.response, message.request.url);
//       }
//       if(message.request.url.indexOf('mbp/mbp_info') !== -1) {
//           Dailies.CheckRenown(message.request.response);
//       }
//       if(message.request.url.indexOf('evolution_weapon/evolution?') !== -1 || message.request.url.indexOf('evolution_summon/evolution?') !== -1) {
//           Profile.Uncap(message.request.response);
//           Profile.BuyUncap();
//       }
//       if(message.request.url.indexOf('evolution_weapon/item_evolution?') !== -1 || message.request.url.indexOf('evolution_summon/item_evolution?') !== -1) {
//           Supplies.Uncap(message.request.response);
//           Profile.BuyUncap();
//       }
//       if(message.request.url.indexOf('item/evolution_items/') !== -1) {
//           Supplies.CheckUncapItem(message.request.response);
//       }
//       if(message.request.url.indexOf('item/evolution_item_one') !== -1) {
//           Supplies.SetUncapItem(message.request.response);
//           Profile.SetUncapItem(message.request.response);
//       }
//       if(message.request.url.indexOf('weapon/weapon_base_material?') !== -1 || message.request.url.indexOf('summon/summon_base_material?') !== -1) {
//           Supplies.SetUncap(message.request.response);
//           Profile.SetUncap(message.request.response, message.request.url);
//       }
//       if(message.request.url.indexOf('npc/evolution_materials') !== -1) {
//           Supplies.SetNpcUncap(message.request.response);
//       }
//       if(message.request.url.indexOf('evolution_npc/item_evolution?') !== -1) {
//           Supplies.NpcUncap(message.request.response);
//           Profile.BuyUncap();
//       }
//       if(message.request.url.indexOf('weapon/weapon_material') !== -1 || 
//         message.request.url.indexOf('summon/summon_material') !== -1 ||
//         message.request.url.indexOf('npc/npc_material') !== -1) {
//           Profile.SetUpgrade(message.request.response, message.request.url);
//       }
//       if(message.request.url.indexOf('enhancement_weapon/enhancement') !== -1 ||
//         message.request.url.indexOf('enhancement_summon/enhancement') !== -1 ||
//         message.request.url.indexOf('enhancement_npc/enhancement') !== -1) {
//           Profile.Upgrade(message.request.response);
//       }

//       if(message.request.url.indexOf('/shop_exchange/activate_personal_support?_=') !== -1) {
//         // request.getContent(function(responseBody) {
//         //   Dailies.UseTweet(message.request.response);
//         // })
//         //request payload
//         //support_id int
//         //support_level int
//         //support_time string
//         //success:true
//         //Message.ConsoleLog(Object.keys(request.request));
//     //Buffs.StartBuff(JSON.stringify(request.request.postData).replace(/:/g, '').replace(/,/g, '').split('\\\"'));
//       }
//       if(message.request.url.indexOf('/sell_article/execute') !== -1) {
//     //Supplies.SellCoop(JSON.stringify(request.request.postData).replace(/:/g, '').replace(/,/g, '').split('\\\"'));
//         // Profile.SellCoop(request.request.postData);
//         //Profile.SellCoop(JSON.stringify(request.request.postData).replace(/:/g, '').replace(/,/g, '').split('\\\"'));
//         //Message.ConsoleLog(request.request.text.postData.split('\"'));
//         // request.getContent(function(responseBody) {
//         //   Profile.SetShop(message.request.response);
//         // })
//       }
//     }
//   });
// })();



// //   window.Message = {
// //     Notify: function(title, message, type) {
// //       chrome.runtime.sendMessage({notification: {
// //         type: type,
// //         notification: {
// //           type: 'basic',
// //           title: title,
// //           message: message,
// //           iconUrl: 'src/assets/images/icon.png' 
// //         }
// //       }});
// //     },
// //     OpenURL: function(url) {
// //       chrome.runtime.sendMessage({openURL: {
// //         url: url
// //       }});
// //     },
// //     MessageBackground: function(message, sendResponse) {
// //     },
// //     MessageTabs: function(message, sendResponse) {
// //       chrome.runtime.sendMessage({tabs: message}, function(response) {
// //         sendResponse(response);
// //       });
// //     },
// //     GetOption: function(message, sendResponse) {

// //       if(message.response !== undefined) {
// //         if(optionResponses[message.id] == undefined) {
// //           optionResponses[message.id] = [];
// //         }
// //         if(optionResponses[message.id].indexOf(message.response) === -1) {
// //           optionResponses[message.id].push(message.response);
// //         }
// //       }
// //       chrome.runtime.sendMessage({getOption: message.id}, function(response) {
// //         sendResponse(response);
// //       });
// //     },
// //     ConsoleLog: function(sender, message) {
// //       chrome.runtime.sendMessage({consoleLog: {
// //         sender: sender,
// //         message: message
// //       }});
// //     }
// //   };
// // })();