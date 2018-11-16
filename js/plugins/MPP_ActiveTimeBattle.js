//=============================================================================
// MPP_ActiveTimeBattle.js
//=============================================================================
// Copyright (c) 2017 Mokusei Penguin
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc 【ver.1.11】 Change battle system into active time battle
 * @author Mokusei Penguin
 *
 * @help ●Party Command
 *  Actor command selected or no one enters command
 *  Press Cancel key to open party command
 *
 *  As long the party command is open, time stops during battle
 *  It's a substitute for pause.
 *
 * ●Battle event start
 *  Time stops during the start of battle event
 *
 * ●Battle Mode （0:Active, 1:Wait, 2:Stop）
 * 　Active： Time flows
 * 　Wait　：Time will stop during skill, item, target selection.
 * 　　　　　　　Time flows while inputting actor command.
 * 　Stop　：Time will stop during command input.
 * 　　　　　　　When acceleration button is pressed while entering actor command, time flows.
 *  ※In any mode, time stops while selecting a party command or executing an event.
 *
 * ●AT Gauge
 *  Maximum value of AT Gauge
 *   1.Average agility of party members (not including enemies)
 *   2.Optional player setting
 *   3.Reference value set with plugin command
 *
 *  Increment of AT Gauge
 *  Character agility + Increase value
 *  Larger the [Increase value] can be set with plugin command,
 *  The effect of agility is reduced.
 *
 * ●Acceleration button
 *  X button on gamepad/ Shift on keyboard,
 *  For mouse, accelerate by continuing to click about the status window.
 *  However, it does not accelerate when the message window is displayed.
 *
 * ●Switch actors to enter commands
 *  LB/RB on gamepad、Q button on keyboard、Page up/W、Page down、
 *  With the mouse, by left clicking the status window
 *  You can switch to the object you clicked on.
 *  （To be exact, it switches when you release the left click）
 *
 * ●Scroll on status window
 *  Left-click with the mouse and move the mouse up and down the window
 *  It is measured when a party member does not fit in the status window
 *
 * ●Escape
 *  All actors will make an escape based on AT necessary to requirements
 *  If you failed to escape, the condition will not change.
 *  If you choose to fight with party command, it will cancel.
 *
 *  When "true" is set [whether or not to run away in escape state]
 *  The actor will show run away during escape.
 *  Be careful as there is no motion that runs backward by default.
 *
 * ●Cast time for skill
 *  Casting time will be generated through speed setting and compensate item/ skills by subtract
 *  Each time speed is -1, casting time is about 0.5 seconds
 *  By the the cast is finished, it will enter from battle order list
 *
 *  Casting will be raised/ lowered according to battle speed setting
 *  Even if you change the [Battle Speed Reference Value], it won't change
 *
 * ●Multiple actions
 *  We can't guarantee the behavior of 2 actions be possible by adding value of features 
 *  Please use action once.
 *
 * ================================
 * Author : Mokusei Penguin
 * URL : http://woodpenguin.blog.fc2.com/
 *
 * @param === Option ===
 *
 * @param ATB Mode Default
 * @type number
 * @max 2
 * @desc Default value for battle mode
 * (0:Active, 1:Wait, 2:Stop)
 * @default 1
 *
 * @param ATB Mode Name
 * @desc Item name for battle mode to be displayed on Optiona
 * If it is blank, it will not be added to Options
 * @default Battle Mode
 *
 * @param ATB Mode Status
 * @desc Status name for battle mode displayed on Options
 * （Please separate with commas）
 * @default Active,Wait
 *
 * @param ATB Speed Default
 * @type number
 * @max 4
 * @desc Default value of battle speed (0～4)
 * @default 2
 *
 * @param ATB Speed Name
 * @desc Item name for battle speed displayed on Options
 * If it's blank, it won't be added to Options
 * @default Battle Speed
 *
 * @param ATB Speed Status
 * @desc Status name for battle speed displayed on Options
 * （Please separate with commas）
 * @default 1,2,3,4,5
 *
 * @param === Battle ===
 *
 * @param ATB Speed Base
 * @type number
 * @desc Battle Speed Reference Value
 * Can't change in-game settings on creator side
 * @default 6
 *
 * @param AT Increment
 * @type number
 * @desc Increase value of AT gauge
 * @default 10
 *
 * @param Reset AT Die?
 * @type boolean
 * @desc Whether to reset AT gauge when battle is inevitable?
 * @default true
 *
 * @param Need Escape At
 * @type number
 * @max 100
 * @desc Percent of AT gauge required to escape (0～100)
 * @default 100
 *
 * @param Escape AT Cost
 * @type number
 * @max 100
 * @desc Percent of AT gauge cost (0～100)
 * @default 75
 *
 * @param Escape Anime?
 * @type boolean
 * @desc Whether or not to run away during escape (true/false)
 * @default false
 *
 * @param Input Step Forward?
 * @type boolean
 * @desc Whether to move forward during command input (true/false)
 * @default false
 *
 * @param ATB Fast Enable?
 * @type boolean
 * @desc Enable/ disable acceleration button (true/false)
 * @default true
 *
 * @param ATB Fast Rate
 * @type number
 * @desc Acceleration when speed button is pressed
 * @default 3
 *
 * @param Fast Log Eneble?
 * @type boolean
 * @desc Battle log fast forward enable/ disable (true/false)
 * Battle log fast forward by default
 * @default true
 *
 * @param Active SE Name
 * @desc Name of SE when battle starts
 * @default Decision1
 * @require 1
 * @dir audio/se
 * @type file
 *
 * @param Active SE Params
 * @desc Volume, Pitch, Random SE
 * @default 90,100,0
 *
 * @param === Window ===
 *
 * @param Help Window Pos
 * @type number
 * @min -1
 * @max 1
 * @desc Help window position （-1:hidden, 0:above, 1:top of status）
 * @default 1
 *
 * @param Help Window Row
 * @type number
 * @desc Number of lines in the help window
 * @default 1
 *
 * @param Status Window Pos
 * @type number
 * @max 2
 * @desc Position of Status window （0:Left, 1:Center, 2:Right）
 * @default 1
 *
 * @param Skill Window HP Draw?
 * @type boolean
 * @desc Whether to display HP during skill window popup
 * @default false
 *
 * @param === AT Gauge ===
 *
 * @param AT Gauge Name
 * @desc Name for AT Gauge
 * @default
 *
 * @param AT Gauge Width
 * @type number
 * @desc Width of AT Gauge
 * @default 60
 *
 * @param AT Gauge Height
 * @type number
 * @desc Height of AT Gauge
 * @default 12
 *
 * @param AT Charge Color1
 * @desc AT Increase Gauge Color 1(specified by RGB)
 * @default 192,192,192
 *
 * @param AT Charge Color2
 * @desc AT Increase Gauge Color 2(specified by RGB)
 * @default 255,255,255
 *
 * @param AT Max Color1
 * @desc AT Gauge Max Color 1(specified by RGB)
 * @default 192,192,192
 *
 * @param AT Max Color2
 * @desc AT Gauge Max Color 2(specified by RGB)
 * @default 255,255,192
 *
 * @param Chanting View?
 * @type boolean
 * @desc Whether to display MP Gauge or not
 * @default true
 *
 * @param AT Chanting Color1
 * @desc Cast Gauge Color 1(specified by RGB)
 * @default 128,32,0
 *
 * @param AT Chanting Color2
 * @desc Cast Gauge Color 2(specified by RGB)
 * @default 255,64,0
 *
 * @param Escaping Change?
 * @type boolean
 * @desc Whether to change color of the gauge during escape
 * @default true
 *
 * @param AT Escaping Color1
 * @desc Choice Gauge Color 1(specified by RGB)
 * @default 192,192,192
 *
 * @param AT Escaping Color2
 * @desc Choice Gauge Color 2 (specified by RGB)
 * @default 192,192,255
 *
 */

//=============================================================================
// Option
//=============================================================================

(function() {

var MPPlugin = { params : PluginManager.parameters('MPP_ActiveTimeBattle') };

//=== Option ===
MPPlugin.atbMode = Number(MPPlugin.params['ATB Mode Default'] || 0).clamp(0, 2);
MPPlugin.atbModeName = MPPlugin.params['ATB Mode Name'];
MPPlugin.atbModeStatus = (MPPlugin.params['ATB Mode Status'] || 'Active,Wait').split(',');
MPPlugin.atbSpeed = Number(MPPlugin.params['ATB Speed Default'] || 2).clamp(0, 4);
MPPlugin.atbSpeedName = (MPPlugin.params['ATB Speed Name']);
MPPlugin.atbSpeedStatus = (MPPlugin.params['ATB Speed Status'] || '1,2,3,4,5').split(',');

var Alias = {};

//-----------------------------------------------------------------------------
// ConfigManager

ConfigManager.atbMode = MPPlugin.atbMode;
ConfigManager.atbSpeed = MPPlugin.atbSpeed;

//71
Alias.CoMa_mp01_makeData = ConfigManager.makeData;
ConfigManager.makeData = function() {
    var config = Alias.CoMa_mp01_makeData.call(this);
    config.atbMode = this.atbMode;
    config.atbSpeed = this.atbSpeed;
    return config;
};

//82
Alias.CoMa_applyData = ConfigManager.applyData;
ConfigManager.applyData = function(config) {
    Alias.CoMa_applyData.call(this, config);
    var value = config.atbMode;
    this.atbMode = (value !== undefined ? value : MPPlugin.atbMode);
    value = config.atbSpeed;
    this.atbSpeed = (value !== undefined ? value : MPPlugin.atbSpeed);
};

//-----------------------------------------------------------------------------
// Window_Options

//36
Alias.WiOp_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
Window_Options.prototype.addGeneralOptions = function() {
    Alias.WiOp_addGeneralOptions.call(this);
    if (MPPlugin.atbModeName) {
        this.addCommand(MPPlugin.atbModeName, 'atbMode');
    }
    if (MPPlugin.atbSpeedName) {
        this.addCommand(MPPlugin.atbSpeedName, 'atbSpeed');
    }
};

Alias.WiOp_isMppSymbol = Window_Options.prototype.isMppSymbol;
Window_Options.prototype.isMppSymbol = function(symbol) {
    if (Alias.WiOp_isMppSymbol && Alias.WiOp_isMppSymbol.call(this, symbol)) {
        return true;
    }
    return (symbol === 'atbMode' || symbol === 'atbSpeed');
};

Alias.WiOp_getMppStatus = Window_Options.prototype.getMppStatus;
Window_Options.prototype.getMppStatus = function(symbol) {
    if (symbol === 'atbMode') {
        return MPPlugin.atbModeStatus;
    } else if (symbol === 'atbSpeed') {
        return MPPlugin.atbSpeedStatus;
    } else if (Alias.WiOp_getMppStatus) {
        return Alias.WiOp_getMppStatus.call(this, symbol);
    } else {
        return [];
    }
};

if (!Window_Options.MPP_Option || Window_Options.MPP_Option < 1.0) {

//62
Alias.WiOp_statusText = Window_Options.prototype.statusText;
Window_Options.prototype.statusText = function(index) {
    var symbol = this.commandSymbol(index);
    if (this.isMppSymbol(symbol)) {
        var status = this.getMppStatus(symbol);
        var value = this.getConfigValue(symbol);
        return status[value];
    } else {
        return Alias.WiOp_statusText.call(this, index);
    }
};

//84
Alias.WiOp_processOk = Window_Options.prototype.processOk;
Window_Options.prototype.processOk = function() {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    if (this.isMppSymbol(symbol)) {
        var status = this.getMppStatus(symbol);
        var value = this.getConfigValue(symbol);
        value++;
        if (value >= status.length) {
            value = 0;
        }
        value = value.clamp(0, status.length - 1);
        this.changeValue(symbol, value);
    } else {
        Alias.WiOp_processOk.call(this);
    }
};

//100
Alias.WiOp_cursorRight = Window_Options.prototype.cursorRight;
Window_Options.prototype.cursorRight = function(wrap) {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    if (this.isMppSymbol(symbol)) {
        var status = this.getMppStatus(symbol);
        var value = this.getConfigValue(symbol);
        value++;
        value = value.clamp(0, status.length - 1);
        this.changeValue(symbol, value);
    } else {
        Alias.WiOp_cursorRight.call(this, wrap);
    }
};

//113
Alias.WiOp_cursorLeft = Window_Options.prototype.cursorLeft;
Window_Options.prototype.cursorLeft = function(wrap) {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    if (this.isMppSymbol(symbol)) {
        var status = this.getMppStatus(symbol);
        var value = this.getConfigValue(symbol);
        value--;
        value = value.clamp(0, status.length - 1);
        this.changeValue(symbol, value);
    } else {
        Alias.WiOp_cursorLeft.call(this, wrap);
    }
};

Window_Options.MPP_Option = 1.0;
} //if (!Window_Options.MPP_Option || Window_Options.MPP_Option < 1.0)

})();


//=============================================================================
// Main
//=============================================================================

function Window_AtbSkillStatus() {
    this.initialize.apply(this, arguments);
}

(function() {

var MPPlugin = { params : PluginManager.parameters('MPP_ActiveTimeBattle') };

//=== Battle ===
MPPlugin.atbSpeedBase = Number(MPPlugin.params['ATB Speed Base'] || 6);
MPPlugin.atIncrement = Number(MPPlugin.params['AT Increment'] || 10);
MPPlugin.resetAtDie = !!eval(MPPlugin.params['Reset AT Die?']);
MPPlugin.needEscapeAt = Number(MPPlugin.params['Need Escape At'] || 100).clamp(0, 100);
MPPlugin.escapeAtCost = Number(MPPlugin.params['Escape At Cost'] || 75).clamp(0, 100);
MPPlugin.escapeAnime = !!eval(MPPlugin.params['Escape Anime?']);
MPPlugin.inputStepForward = !!eval(MPPlugin.params['Input Step Forward?']);
MPPlugin.atbFastEneble = !!eval(MPPlugin.params['ATB Fast Eneble?']);
MPPlugin.atbFastRate = Number(MPPlugin.params['ATB Fast Rate'] || 3).clamp(0, 10);
MPPlugin.fastLogEneble = !!eval(MPPlugin.params['Fast Log Eneble?']);
MPPlugin.ActiveSEParams = MPPlugin.params['Active SE Params'].split(',').map(Number);
MPPlugin.ActiveSE = {
    name:MPPlugin.params['Active SE Name'],
    volume:MPPlugin.ActiveSEParams[0],
    pitch:MPPlugin.ActiveSEParams[1],
    pan:MPPlugin.ActiveSEParams[2]
};

//=== Window ===
MPPlugin.helpWindowPos = Number(MPPlugin.params['Help Window Pos'] || 1).clamp(-1, 1);
MPPlugin.helpWindowRow = Number(MPPlugin.params['Help Window Row'] || 1).clamp(0, 2);
MPPlugin.stWindowPos = Number(MPPlugin.params['Status Window Pos'] || 1).clamp(0, 2);
MPPlugin.SkillWindowHpDraw = !!eval(MPPlugin.params['Skill Window HP Draw?']);

//=== AT Gauge ===
MPPlugin.atGaugeName = MPPlugin.params['AT Gauge Name'] || '';
MPPlugin.atGaugeWidth = Number(MPPlugin.params['AT Gauge Width'] || 84);
MPPlugin.atGaugeHeight = Number(MPPlugin.params['AT Gauge Height'] || 12);
MPPlugin.atChargeColor1 = 'rgb(%1)'.format(MPPlugin.params['AT Charge Color1'] || '192,192,192');
MPPlugin.atChargeColor2 = 'rgb(%1)'.format(MPPlugin.params['AT Charge Color2'] || '255,255,255');
MPPlugin.atMaxColor1 = 'rgb(%1)'.format(MPPlugin.params['AT Max Color1'] || '192,192,192');
MPPlugin.atMaxColor2 = 'rgb(%1)'.format(MPPlugin.params['AT Max Color2'] || '255,255,192');
MPPlugin.chantingView = !!eval(MPPlugin.params['Chanting View?']);
MPPlugin.atChantingColor1 = 'rgb(%1)'.format(MPPlugin.params['AT Chanting Color1'] || '128,32,0');
MPPlugin.atChantingColor2 = 'rgb(%1)'.format(MPPlugin.params['AT Chanting Color2'] || '255,64,0');
MPPlugin.EscapingChange = !!eval(MPPlugin.params['Escaping Change?']);
MPPlugin.atEscapingColor1 = 'rgb(%1)'.format(MPPlugin.params['AT Escaping Color1'] || '192,192,192');
MPPlugin.atEscapingColor2 = 'rgb(%1)'.format(MPPlugin.params['AT Escaping Color2'] || '192,192,255');


var Alias = {};

//-----------------------------------------------------------------------------
// BattleManager

//10
Alias.BaMa_setup = BattleManager.setup;
BattleManager.setup = function(troopId, canEscape, canLose) {
    Alias.BaMa_setup.call(this, troopId, canEscape, canLose);
    var rate = (7 - ConfigManager.atbSpeed) * MPPlugin.atbSpeedBase * 16;
    this._maxAt = Math.max(Math.round($gameParty.agility() * rate), 10);
    this._refreshHandler = null;
    this._waitHandler = null;
    this._escaping = false;
};

BattleManager.maxAt = function() {
    return this._maxAt;
};

BattleManager.setEscaping = function(escaping) {
    this._escaping = escaping;
    $gameParty.requestMotionRefresh();
};

BattleManager.isEscaping = function() {
    return this._escaping;
};

BattleManager.needEscapeAt = function() {
    return MPPlugin.needEscapeAt / 100;
};

BattleManager.escapeAtCost = function() {
    return MPPlugin.escapeAtCost / 100;
};

//113
Alias.BaMa_update = BattleManager.update;
BattleManager.update = function() {
    this.updateATB();
    this.updateCmdActor();
    Alias.BaMa_update.call(this);
};

BattleManager.updateATB = function() {
    if (Graphics.frameCount % 2 === 0 && !this.isAtbWait()) {
        var rate = this.isFastForward() ? MPPlugin.atbFastRate : 1;
        this.allBattleMembers().forEach(function(battler) {
            battler.updateATB(rate);
            if (battler.isMadeAction()) {
                this.addActionBattler(battler);
            }
        }, this);
    }
};

BattleManager.updateCmdActor = function() {
    if (this.isEvantWait() || this.isBattleEnd()) {
        return this.clearActor();
    }
    if (!this.isAtbWait() && !this.actor()) {
        var members = $gameParty.battleMembers();
        for (var i = 0; i < members.length; i++) {
            if (members[i].isStandby()) {
                return this.changeActor(i);
            }
        }
    } else if (this.actor() && !this.actor().isStandby()) {
        this.clearActor();
    }
};

BattleManager.addActionBattler = function(battler) {
    this._actionBattlers.push(battler);
    battler.setDecided(2);
};

BattleManager.deleteDeactiveBattler = function() {
    this._actionBattlers = this._actionBattlers.filter(function(battler) {
        if (battler.atRate() === 1) {
            return true;
        } else {
            battler.setDecided(0);
            return false;
        }
    });
    if (this.actor() && !this.actor().isStandby()) {
        this.clearActor();
    }
};

BattleManager.isFastForward = function() {
    if (!MPPlugin.atbFastEneble || this.isEvantWait()) {
        return false;
    } else if (Input.isPressed('shift')) {
        return true;
    } else {
        return TouchInput.y < this._statusWindow.y && TouchInput.isPressed();
    }
};

BattleManager.isEvantWait = function() {
    return $gameTroop.isEventRunning() || $gameMessage.isBusy();
};

BattleManager.isAtbWait = function() {
    return (this.isEvantWait() || this._waitHandler());
};

//220
Alias.BaMa_startBattle = BattleManager.startBattle;
BattleManager.startBattle = function() {
    Alias.BaMa_startBattle.call(this);
    this.setupAllBattlerAt();
    this.startTurn();
};

BattleManager.setupAllBattlerAt = function() {
    if (this._preemptive) {
        $gameParty.members().forEach(function(member) {
            member.setAt(1);
        });
    } else if (this._surprise) {
        $gameTroop.members().forEach(function(member) {
            member.setAt(1);
        });
    } else {
        $gameParty.members().forEach(function(member) {
            member.setAt(0.8 * Math.random());
        });
        $gameTroop.members().forEach(function(member) {
            member.setAt(0.8 * Math.random());
        });
    }
    this.refreshStatus();
};

//253
BattleManager.selectNextCommand = function() {
    var members = $gameParty.battleMembers();
    if (this.actor() && this.actor().isStandby()) {
        var actionState = 'undecided';
    } else {
        var actionState = 'waiting';
    }
    for (var i = 1; i < members.length; i++) {
        var n = (this._actorIndex + i).mod(members.length);
        if (members[n].isStandby() && members[n].canInput()) {
            return this.changeActor(n, actionState);
        }
    }
    return this.changeActor(-1, actionState);
};

//265
BattleManager.selectPreviousCommand = function() {
    var members = $gameParty.battleMembers();
    if (this.actor() && this.actor().isStandby()) {
        var actionState = 'undecided';
    } else {
        var actionState = 'waiting';
    }
    for (var i = 1; i < members.length; i++) {
        var n = (this._actorIndex - i).mod(members.length);
        if (members[n].isStandby() && members[n].canInput()) {
            return this.changeActor(n, actionState);
        }
    }
    return this.changeActor(-1, actionState);
};

//276
BattleManager.refreshStatus = function() {
    this._refreshHandler();
};

//280
BattleManager.startTurn = function() {
    this._phase = 'turn';
    //this.clearActor();
    //$gameTroop.increaseTurn();
    //this.makeActionOrders();
    $gameParty.requestMotionRefresh();
    this._logWindow.startTurn();
};

//289
BattleManager.updateTurn = function() {
    $gameParty.requestMotionRefresh();
    if (!this._subject) {
        this._subject = this.getNextSubject();
        if (this._subject) {
            this._subject.onTurnEnd();
            this.refreshStatus();
            this._logWindow.displayAutoAffectedStatus(this._subject);
            this._logWindow.displayRegeneration(this._subject);
            return;
        }
    }
    if (this._subject) {
        this.processTurn();
    } else {
        this.endTurn();
    }
};

//301
BattleManager.processTurn = function() {
    var subject = this._subject;
    var action = subject.currentAction();
    if (action) {
        action.prepare();
        if (action.isValid()) {
            this.startAction();
        }
        subject.removeCurrentAction();
    } else {
        $gameTroop.increaseTurn();
        subject.onAllActionsEnd();
        subject.setAt(0);
        this.refreshStatus();
        this._logWindow.displayAutoAffectedStatus(subject);
        this._logWindow.displayCurrentState(subject);
        this._logWindow.displayRegeneration(subject);
        this.endTurn();
    }
};

//320
BattleManager.endTurn = function() {
    this._phase = 'turnEnd';
    this._subject = null;
};

//332
BattleManager.updateTurnEnd = function() {
    if (!this._escaping || !$gameParty.canEscape() || !this.processEscape()) {
        this.startTurn();
    }
};

//336
Alias.BaMa_getNextSubject = BattleManager.getNextSubject;
BattleManager.getNextSubject = function() {
    if (this.isAtbWait() || this._logWindow.isBusy()) return null;
    return Alias.BaMa_getNextSubject.call(this);
};

//515
BattleManager.processEscape = function() {
    $gameParty.performEscape();
    SoundManager.playEscape();
    var success = this._preemptive ? true : (Math.random() < this._escapeRatio);
    if (success) {
        this.displayEscapeSuccessMessage();
        this._escaped = true;
        this.processAbort();
    } else {
        this.displayEscapeFailureMessage();
        this._escapeRatio += 0.1;
        //$gameParty.clearActions();
        //this.startTurn();
        $gameParty.escapeFailure();
    }
    return success;
};

//532
Alias.BaMa_processAbort = BattleManager.processAbort;
BattleManager.processAbort = function() {
    this.clearActor();
    Alias.BaMa_processAbort.call(this);
};

//-----------------------------------------------------------------------------
// Game_BattlerBase

//110
Alias.GaBa_initMembers = Game_BattlerBase.prototype.initMembers;
Game_BattlerBase.prototype.initMembers = function() {
    Alias.GaBa_initMembers.call(this);
    this._at = 0;
    this._ct = 0;
    this._maxCt = 0;
    this._turnCount = 0;
    this._decided = 0;
};

//235
Alias.GaBa_die = Game_BattlerBase.prototype.die;
Game_BattlerBase.prototype.die = function() {
    Alias.GaBa_die.call(this);
    if (MPPlugin.resetAtDie) {
        this._at = 0;
    } else {
        this._at = Math.min(this._at, BattleManager.maxAt() - 1);
    }
    this._ct = 0;
    this._maxCt = 0;
    this._decided = 0;
};

Game_BattlerBase.prototype.onMadeAction = function() {
    this.setDecided(1);
    var action = this.currentAction();
    if (action) {
        var item = action.item();
        if (item) {
            this._maxCt = Math.max(item.speed * (ConfigManager.atbSpeed - 7) * 3, 0);
        }
    }
};

Game_BattlerBase.prototype.setDecided = function(decided) {
    this._decided = decided;
};

Game_BattlerBase.prototype.setAt = function(rate) {
    this._at = Math.floor(BattleManager.maxAt() * rate);
    this._at = this._at.clamp(0, BattleManager.maxAt() - 1);
};

Game_BattlerBase.prototype.atRate = function() {
    return BattleManager.maxAt() > 0 ? this._at / BattleManager.maxAt() : 0;
};

Game_BattlerBase.prototype.castRate = function() {
    if (this._maxCt > 0) {
        return this._ct / this._maxCt;
    } else {
        return -1;
    }
};

Game_BattlerBase.prototype.isStandby = function() {
    return this._decided === 0 && this.atRate() === 1;
};

Game_BattlerBase.prototype.decided = function() {
    return this._decided;
};

Game_BattlerBase.prototype.isMadeAction = function() {
    return this._decided === 1 && this._ct === this._maxCt;
};

//-----------------------------------------------------------------------------
// Game_Battler

//144
Alias.GaBa_clearActions = Game_Battler.prototype.clearActions;
Game_Battler.prototype.clearActions = function() {
    Alias.GaBa_clearActions.call(this);
    this._ct = 0;
    this._maxCt = 0;
};

//419
Alias.GaBa_onBattleStart = Game_Battler.prototype.onBattleStart;
Game_Battler.prototype.onBattleStart = function() {
    Alias.GaBa_onBattleStart.call(this);
    this._ct = 0;
    this._maxCt = 0;
    this._turnCount = 0;
    this._decided = 0;
};

//427
Alias.GaBa_onAllActionsEnd = Game_Battler.prototype.onAllActionsEnd;
Game_Battler.prototype.onAllActionsEnd = function() {
    Alias.GaBa_onAllActionsEnd.call(this);
    this.regenerateAll();
    this._turnCount++;
    this._ct = 0;
    this._maxCt = 0;
    this.setDecided(0);
    this.setActionState('undecided');
};

//433
Alias.GaBa_onTurnEnd = Game_Battler.prototype.onTurnEnd;
Game_Battler.prototype.onTurnEnd = function() {
    if ($gameParty.inBattle()) {
        this.clearResult();
        //this.regenerateAll();
        this.updateStateTurns();
        this.updateBuffTurns();
        this.removeStatesAuto(2);
    } else {
        Alias.GaBa_onTurnEnd.call(this);
    }
};

Game_Battler.prototype.canEscape = function() {
    return this.atRate() >= BattleManager.needEscapeAt();
};

Game_Battler.prototype.escapeFailure = function() {
    if (this.atRate() === 1 && BattleManager.escapeAtCost() > 0) {
        this.clearActions();
    }
    this.setAt(this.atRate() - BattleManager.escapeAtCost());
};

Game_Battler.prototype.updateATB = function(rate) {
    if (!this.isAlive()) {
        return;
    }
    if (this._at < BattleManager.maxAt()) {
        this._at += (this.agi + MPPlugin.atIncrement) * rate;
        if(this._at >= BattleManager.maxAt()) {
            this._at = BattleManager.maxAt();
            this.makeActions();
        }
    } else if (this._ct < this._maxCt) {
        this._ct = Math.min(this._ct + rate, this._maxCt);
    }
};

Game_Battler.prototype.atGaugeRate = function() {
    if (MPPlugin.chantingView && this.castRate() >= 0) {
        return this.castRate();
    } else {
        return this.atRate();
    }
};

Game_Battler.prototype.atGaugeColor1 = function() {
    var color = this.atGaugeColorEx1();
    if (color) return color;
    return (this.atRate() < 1 ? MPPlugin.atChargeColor1 : MPPlugin.atMaxColor1);
};

Game_Battler.prototype.atGaugeColorEx1 = function() {
    if (MPPlugin.chantingView && this.castRate() >= 0) {
        return MPPlugin.atChantingColor1;
    } else if (MPPlugin.EscapingChange && this.isActor() &&
            BattleManager.isEscaping() && this.isAlive()) {
        return MPPlugin.atEscapingColor1;
    }
    return null;
};

Game_Battler.prototype.atGaugeColor2 = function() {
    var color = this.atGaugeColorEx2();
    if (color) return color;
    return (this.atRate() < 1 ? MPPlugin.atChargeColor2 : MPPlugin.atMaxColor2);
};

Game_Battler.prototype.atGaugeColorEx2 = function() {
    if (MPPlugin.chantingView && this.castRate() >= 0) {
        return MPPlugin.atChantingColor2;
    } else if (MPPlugin.EscapingChange && this.isActor() &&
            BattleManager.isEscaping() && this.isAlive()) {
        return MPPlugin.atEscapingColor2;
    }
    return null;
};

//-----------------------------------------------------------------------------
// Game_Actor

if (Game_Actor.prototype.hasOwnProperty('onRestrict')) {
    Alias.GaAc_onRestrict = Game_Actor.prototype.onRestrict;
}
Game_Actor.prototype.onRestrict = function() {
    if (Alias.GaAc_onRestrict) {
        Alias.GaAc_onRestrict.call(this);
    } else {
        Game_Battler.prototype.onRestrict.call(this);
    }
    if ($gameParty.inBattle() && !this._active && this.isAlive() &&
            this._at === BattleManager.maxAt()) {
        this.makeActions();
    }
};

//714
Alias.GaAc_makeAutoBattleActions = Game_Actor.prototype.makeAutoBattleActions;
Game_Actor.prototype.makeAutoBattleActions = function() {
    Alias.GaAc_makeAutoBattleActions.call(this);
    this.onMadeAction();
};

//729
Alias.GaAc_makeConfusionActions = Game_Actor.prototype.makeConfusionActions;
Game_Actor.prototype.makeConfusionActions = function() {
    Alias.GaAc_makeConfusionActions.call(this);
    this.onMadeAction();
};

//736
Alias.GaAc_makeActions = Game_Actor.prototype.makeActions;
Game_Actor.prototype.makeActions = function() {
    Alias.GaAc_makeActions.call(this);
    if (!this.canInput()) {
        this.onMadeAction();
    }
};

//-----------------------------------------------------------------------------
// Game_Enemy

//214
Game_Enemy.prototype.meetsTurnCondition = function(param1, param2) {
    var n = this._turnCount;
    if (param2 === 0) {
        return n === param1;
    } else {
        return n >= param1 && n % param2 === param1 % param2;
    }
};

//278
Alias.GaEn_makeActions = Game_Enemy.prototype.makeActions;
Game_Enemy.prototype.makeActions = function() {
    Alias.GaEn_makeActions.call(this);
    this.onMadeAction();
};

//-----------------------------------------------------------------------------
// Game_Unit

Game_Unit.prototype.selectAll = function() {
    this.members().forEach(function(member) {
        member.select();
    });
};

Game_Unit.prototype.select = function(activeMember) {
    this.members().forEach(function(member) {
        if (member === activeMember) {
            member.select();
        } else {
            member.deselect();
        }
    });
};


//-----------------------------------------------------------------------------
// Game_Party

Game_Party.prototype.canEscape = function() {
    return this.aliveMembers().every(function(member) {
        return member.canEscape();
    });
};

Game_Party.prototype.escapeFailure = function() {
    this.aliveMembers().forEach(function(member) {
        member.escapeFailure();
    });
    BattleManager.deleteDeactiveBattler();
};

//-----------------------------------------------------------------------------
// Window_BattleLog

//121
Alias.WiBaLo_isFastForward = Window_BattleLog.prototype.isFastForward;
Window_BattleLog.prototype.isFastForward = function() {
    return (MPPlugin.fastLogEneble && Alias.WiBaLo_isFastForward.call(this));
};

//-----------------------------------------------------------------------------
// Window_BattleStatus

Window_BattleStatus.prototype.setActorCmdWindow = function(actorCmdWindow) {
    this._actorCmdWindow = actorCmdWindow;
};

Window_BattleStatus.prototype.isActorCmdEnabled = function() {
    return this._actorCmdWindow &&
            (this._actorCmdWindow.active || !this._actorCmdWindow.isOpen());
};

Window_BattleStatus.prototype.processHandling = function() {
    if (this.isOpen() && this.isActorCmdEnabled()) {
        if (this.isHandled('pagedown') && Input.isTriggered('pagedown')) {
            this.processPagedown();
        } else if (this.isHandled('pageup') && Input.isTriggered('pageup')) {
            this.processPageup();
        }
    }
};

Window_BattleStatus.prototype.processTouch = function() {
    if (this.isOpen() && this.isActorCmdEnabled()) {
        if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
            this._touching = true;
            this.updateInputData();
        }
        if (this._touching) {
            if (TouchInput.isPressed()) {
                this.onTouch(false);
            } else {
                if (this.isTouchedInsideFrame()) {
                    this.onTouch(true);
                }
                this._touching = false;
            }
        }
    }
};

Window_BattleStatus.prototype.onTouch = function(triggered) {
    var lastTopRow = this.topRow();
    var x = this.canvasToLocalX(TouchInput.x);
    var y = this.canvasToLocalY(TouchInput.y);
    var hitIndex = this.hitTest(x, y);
    if (hitIndex >= 0) {
        if (triggered && this.isTouchOkEnabled()) {
            var actor = $gameParty.battleMembers()[hitIndex];
            if (actor && actor.isStandby()) {
                this.select(hitIndex);
                this.processOk();
            }
        }
    } else if (this._stayCount >= 10) {
        if (y < this.padding) {
            this.scrollUp();
        } else if (y >= this.height - this.padding) {
            this.scrollDown();
        }
    }
    if (this.topRow() !== lastTopRow) {
        SoundManager.playCursor();
    }
};

Window_BattleStatus.prototype.processOk = function() {
    this.updateInputData();
    this.deactivate();
    this.callOkHandler();
};

Window_BattleStatus.prototype.processPageup = function() {
    this.updateInputData();
    this.deactivate();
    this.callHandler('pageup');
};

Window_BattleStatus.prototype.processPagedown = function() {
    this.updateInputData();
    this.deactivate();
    this.callHandler('pagedown');
};

Window_BattleStatus.prototype.isCursorMovable = function() {
    return false;
};

Window_BattleStatus.prototype.isDrawAt = function() {
    return MPPlugin.atGaugeWidth > 0;
};

//39
Alias.WiBaSt_refresh = Window_BattleStatus.prototype.refresh;
Window_BattleStatus.prototype.refresh = function() {
    this.clearUpdateDrawer();
    Alias.WiBaSt_refresh.call(this);
};

//63
Alias.WiBaSt_gaugeAreaWidth = Window_BattleStatus.prototype.gaugeAreaWidth;
Window_BattleStatus.prototype.gaugeAreaWidth = function() {
    if (this.isDrawAt()) {
        return 234 + MPPlugin.atGaugeWidth;
    } else {
        return Alias.WiBaSt_gaugeAreaWidth.call(this);
    }
};

//80
Alias.WiBaSt_drawGaugeAreaWithTp = Window_BattleStatus.prototype.drawGaugeAreaWithTp;
Window_BattleStatus.prototype.drawGaugeAreaWithTp = function(rect, actor) {
    if (this.isDrawAt()) {
        this.drawActorHp(actor, rect.x + 0, rect.y, 108);
        this.drawActorMpTp(actor, rect.x + 123, rect.y, 96);
        this.drawActorAt(actor, rect.x + 234, rect.y, MPPlugin.atGaugeWidth);
    } else {
        Alias.WiBaSt_drawGaugeAreaWithTp.call(this, rect, actor);
    }
};

//86
Alias.WiBaSt_drawGaugeAreaWithoutTp = Window_BattleStatus.prototype.drawGaugeAreaWithoutTp;
Window_BattleStatus.prototype.drawGaugeAreaWithoutTp = function(rect, actor) {
    if (this.isDrawAt()) {
        this.drawActorHp(actor, rect.x + 0, rect.y, 108);
        this.drawActorMp(actor, rect.x + 123, rect.y, 96);
        this.drawActorAt(actor, rect.x + 234, rect.y, MPPlugin.atGaugeWidth);
    } else {
        Alias.WiBaSt_drawGaugeAreaWithoutTp.call(this, rect, actor);
    }
};

Window_BattleStatus.prototype.drawActorMpTp = function(actor, x, y, width) {
    width = (width || 186) - 10;
    this.drawGauge(x + 10, y, width, actor.tpRate(),
                   this.tpGaugeColor1(), this.tpGaugeColor2());
    this.drawGauge(x, y - 8, width, actor.mpRate(),
                   this.mpGaugeColor1(), this.mpGaugeColor2());
    this.contents.fontSize = 24;
    this.changeTextColor(this.systemColor());
    this.contents.drawText(TextManager.mpA, x, y + 1, 32, 24);
    this.contents.drawText(TextManager.tpA, x + 22, y + 10, 32, 24);
    this.contents.fontSize = this.standardFontSize();
};

Window_BattleStatus.prototype.drawActorAt = function(actor, x, y, width, drawer) {
    width = width || 60;
    var color1 = actor.atGaugeColor1();
    var color2 = actor.atGaugeColor2();
    this.drawAtGauge(x, y, width, actor.atGaugeRate(), color1, color2);
    this.changeTextColor(this.systemColor());
    this.drawText(MPPlugin.atGaugeName, x, y, 44);
    
    if (drawer === undefined) drawer = true;
    if (drawer) {
        var process = this.actorAtDrawer.bind(this, actor, x, y, width);
        this.addUpdateDrawer(process);
    }
};

Window_BattleStatus.prototype.drawAtGauge = function(x, y, width, rate, color1, color2) {
    var height = MPPlugin.atGaugeHeight;
    var fillW = width * rate;
    var gaugeY = y + this.lineHeight() - height - 2;
    this.contents.fillRect(x, gaugeY, width, height, this.gaugeBackColor());
    this.contents.gradientFillRect(x, gaugeY, fillW, height, color1, color2);
};

Window_BattleStatus.prototype.actorAtDrawer = function(actor, x, y, width) {
    if (Graphics.frameCount % 2 === 0) {
        this.contents.clearRect(x, y, width, this.lineHeight());
        this.drawActorAt(actor, x, y, width, false);
    }
    return true;
};

//-----------------------------------------------------------------------------
// Window_BattleActor

Window_BattleActor.prototype.processHandling = function() {
    Window_Selectable.prototype.processHandling.call(this);
};

Window_BattleActor.prototype.processTouch = function() {
    Window_Selectable.prototype.processTouch.call(this);
};

Window_BattleActor.prototype.onTouch = function(triggered) {
    Window_Selectable.prototype.onTouch.call(this, triggered);
};

Window_BattleActor.prototype.processOk = function() {
    Window_Selectable.prototype.processOk.call(this);
};

Window_BattleActor.prototype.isCursorMovable = function() {
    return Window_Selectable.prototype.isCursorMovable.call(this);
};

Window_BattleActor.prototype.isDrawAt = function() {
    return false;
};

Window_BattleActor.prototype.selectForItem = function() {
    var actor = BattleManager.actor();
    var action = actor.inputtingAction();
    this.setCursorFixed(false);
    this.setCursorAll(false);
    if (action.isForUser()) {
        this.setCursorFixed(true);
        this.select(actor.index());
    } else if (action.isForAll()) {
        this.setCursorAll(true);
        this.select(0);
    } else {
        this.select(actor.index());
    }
};

//31
Alias.WiBaAc_select = Window_BattleActor.prototype.select;
Window_BattleActor.prototype.select = function(index) {
    Alias.WiBaAc_select.call(this, index);
    if (this._cursorAll) {
        $gameParty.selectAll();
    }
};

if (Window_BattleActor.prototype.hasOwnProperty('hitTest')) {
    Alias.WiBaAc_hitTest = Window_BattleActor.prototype.hitTest;
}
Window_BattleActor.prototype.hitTest = function(x, y) {
    var result = 0;
    if (Alias.WiBaAc_hitTest) {
        result = Alias.WiBaAc_hitTest.call(this, x, y);
    } else {
        result = Window_BattleStatus.prototype.hitTest.call(this, x, y);
    }
    if (result < 0 && this._cursorAll && this.isContentsArea(x, y)) {
        return 0;
    }
    return result;
};

//-----------------------------------------------------------------------------
// Window_BattleEnemy

Window_BattleEnemy.prototype.isCurrentItemEnabled = function() {
    return !!this.enemy();
};

//58
Window_BattleEnemy.prototype.show = function() {
    //this.refresh();
    //this.select(0);
    Window_Selectable.prototype.show.call(this);
};

Window_BattleEnemy.prototype.selectForItem = function() {
    var actor = BattleManager.actor();
    var action = actor.inputtingAction();
    this.setCursorAll(false);
    if (action.isForAll()) {
        this.setCursorAll(true);
    }
    this.select(0);
};

if (Window_BattleEnemy.prototype.hasOwnProperty('hitTest')) {
    Alias.WiBaEn_hitTest = Window_BattleEnemy.prototype.hitTest;
}
Window_BattleEnemy.prototype.hitTest = function(x, y) {
    var result = 0;
    if (Alias.WiBaEn_hitTest) {
        result = Alias.WiBaEn_hitTest.call(this, x, y);
    } else {
        result = Window_Selectable.prototype.hitTest.call(this, x, y);
    }
    if (result < 0 && this._cursorAll && this.isContentsArea(x, y)) {
        return 0;
    }
    return result;
};

//69
Alias.WiBaEn_refresh = Window_BattleEnemy.prototype.refresh;
Window_BattleEnemy.prototype.refresh = function() {
    Alias.WiBaEn_refresh.call(this);
    if (this.index() >= 0) {
        this.select(this._index.clamp(0, this.maxItems() - 1));
    }
};

//74
Alias.WiBaEn_select = Window_BattleEnemy.prototype.select;
Window_BattleEnemy.prototype.select = function(index) {
    Alias.WiBaEn_select.call(this, index);
    if (this._cursorAll) {
        $gameTroop.selectAll();
    }
};


//-----------------------------------------------------------------------------
// Window_BattleSkill

Window_BattleSkill.prototype.setStatusWindow = function(statusWindow) {
    this._statusWindow = statusWindow;
};

Window_BattleSkill.prototype.setActor = function(actor) {
    Window_SkillList.prototype.setActor.call(this, actor);
    if (this._statusWindow) {
        this._statusWindow.setActor(actor);
    }
};

//18
Alias.WiBaSk_show = Window_BattleSkill.prototype.show;
Window_BattleSkill.prototype.show = function() {
    if (this._statusWindow) {
        this._statusWindow.show();
    }
    Alias.WiBaSk_show.call(this);
};

//24
Alias.WiBaSk_hide = Window_BattleSkill.prototype.hide;
Window_BattleSkill.prototype.hide = function() {
    if (this._statusWindow) {
        this._statusWindow.hide();
    }
    Alias.WiBaSk_hide.call(this);
};

//-----------------------------------------------------------------------------
// Window_AtbSkillStatus

Window_AtbSkillStatus.prototype = Object.create(Window_Base.prototype);
Window_AtbSkillStatus.prototype.constructor = Window_AtbSkillStatus;

Window_AtbSkillStatus.prototype.initialize = function(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.hide();
};

Window_AtbSkillStatus.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
};

Window_AtbSkillStatus.prototype.refresh = function() {
    this.contents.clear();
    if (this._actor) {
        var y = 0;
        var height = this.lineHeight();
        if (MPPlugin.SkillWindowHpDraw) {
            this.drawActorHp(this._actor, 0, 0, this.contentsWidth());
            y += height;
        }
        if ($dataSystem.optDisplayTp) {
            this.drawActorMp(this._actor, 0, y, this.contentsWidth());
            this.drawActorTp(this._actor, 0, y + height, this.contentsWidth());
        } else {
            this.drawActorMp(this._actor, 0, y, this.contentsWidth());
        }
    }
};

//-----------------------------------------------------------------------------
// Sprite_Actor

//141
Alias.SpAc_updateTargetPosition = Sprite_Actor.prototype.updateTargetPosition;
Sprite_Actor.prototype.updateTargetPosition = function() {
    if (MPPlugin.inputStepForward || !this._actor.isInputting()) {
        Alias.SpAc_updateTargetPosition.call(this);
    }
};

//208
Alias.SpAc_refreshMotion = Sprite_Actor.prototype.refreshMotion;
Sprite_Actor.prototype.refreshMotion = function() {
    var actor = this._actor;
    if (MPPlugin.escapeAnime && actor) {
        var stateMotion = actor.stateMotionIndex();
        if (actor.isActing()) {
        } else if (stateMotion === 3) {
        } else if (stateMotion === 2) {
        } else if (BattleManager.isEscaping()) {
            return this.startMotion('escape');
        }
    }
    Alias.SpAc_refreshMotion.call(this);
};

//-----------------------------------------------------------------------------
// Scene_Battle

//22
Alias.ScBa_start = Scene_Battle.prototype.start;
Scene_Battle.prototype.start = function() {
    BattleManager._refreshHandler = this.refreshStatus.bind(this);
    BattleManager._waitHandler = this.isAtbWait.bind(this);
    Alias.ScBa_start.call(this);
};

Scene_Battle.prototype.isAtbWait = function() {
    if (!this._partyCommandWindow.isClosed()) return true;
    if (ConfigManager.atbMode > 0) {
        if (this._skillWindow.visible || this._itemWindow.visible ||
                this._actorWindow.visible || this._enemyWindow.visible) {
            return true;
        }
    }
    if (ConfigManager.atbMode > 1) {
        if (!this._actorCommandWindow.isClosed() && !BattleManager.isFastForward()) {
            return true;
        }
    }
    return false;
};

//41
Scene_Battle.prototype.updateBattleProcess = function() {
    //if (!this.isAnyInputWindowActive() || BattleManager.isAborting() ||
    //        BattleManager.isBattleEnd()) {
        BattleManager.update();
        this.changeInputWindow();
    //}
};

//58
Scene_Battle.prototype.changeInputWindow = function() {
    if (!this._partyCommandWindow.isClosed() ||
            this._actorCommandWindow.isClosing()) {
        return;
    } else if (this._actor !== BattleManager.actor()) {
        this._actor = BattleManager.actor();
        if (this._actor) {
            this._actorCommandWindow.openness = 0;
            this.startActorCommandSelection();
        } else {
            this.endCommandSelection();
        }
    } else if (!this._actor) {
        if (Input.isTriggered('cancel') || TouchInput.isCancelled()) {
            SoundManager.playCancel();
            this.startPartyCommandSelection();
        }
    }
};

//106
Scene_Battle.prototype.updateWindowPositions = function() {
    var statusX = 0;
    if (!this._partyCommandWindow.isClosed() || !this._actorCommandWindow.isClosed()) {
        statusX = this._partyCommandWindow.width;
    } else {
        statusX = this._partyCommandWindow.width * MPPlugin.stWindowPos / 2;
    }
    if (this._statusWindow.x < statusX) {
        this._statusWindow.x += 16;
        if (this._statusWindow.x > statusX) {
            this._statusWindow.x = statusX;
        }
    }
    if (this._statusWindow.x > statusX) {
        this._statusWindow.x -= 16;
        if (this._statusWindow.x < statusX) {
            this._statusWindow.x = statusX;
        }
    }
};

//161
Alias.ScBa_createStatusWindow = Scene_Battle.prototype.createStatusWindow;
Scene_Battle.prototype.createStatusWindow = function() {
    Alias.ScBa_createStatusWindow.call(this);
    this._statusWindow.setHandler('ok',  this.onStatusOk.bind(this));
    this._statusWindow.setHandler('pageup', this.selectPreviousCommand.bind(this));
    this._statusWindow.setHandler('pagedown', this.selectNextCommand.bind(this));
};

//174
Alias.ScBa_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
Scene_Battle.prototype.createActorCommandWindow = function() {
    Alias.ScBa_createActorCommandWindow.call(this);
    this._actorCommandWindow.setHandler('cancel', this.startPartyCommandSelection.bind(this));
    this._statusWindow.setActorCmdWindow(this._actorCommandWindow);
};

//184
Scene_Battle.prototype.createHelpWindow = function() {
    if (MPPlugin.helpWindowPos >= 0) {
        this._helpWindow = new Window_Help(MPPlugin.helpWindowRow);
        this._helpWindow.visible = false;
        if (MPPlugin.helpWindowPos === 1) {
            this._helpWindow.y = this._statusWindow.y - this._helpWindow.height;
        }
        this.addWindow(this._helpWindow);
    }
};

//190
Scene_Battle.prototype.createSkillWindow = function() {
    var wy = this._statusWindow.y;
    var ww = Graphics.boxWidth - 144
    var wh = this._statusWindow.height;
    this._skillWindow = new Window_BattleSkill(0, wy, ww, wh);
    this._skillWindow.setHelpWindow(this._helpWindow);
    this._skillWindow.setHandler('ok',     this.onSkillOk.bind(this));
    this._skillWindow.setHandler('cancel', this.onSkillCancel.bind(this));
    this.addWindow(this._skillWindow);

    this._skillStatusWindow = new Window_AtbSkillStatus(ww, wy, 144, wh);
    this.addWindow(this._skillStatusWindow);
    this._skillWindow.setStatusWindow(this._skillStatusWindow);
};

//200
Scene_Battle.prototype.createItemWindow = function() {
    var wy = this._statusWindow.y;
    var wh = this._statusWindow.height;
    this._itemWindow = new Window_BattleItem(0, wy, Graphics.boxWidth, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    this.addWindow(this._itemWindow);
};

//210
Alias.ScBa_createActorWindow = Scene_Battle.prototype.createActorWindow;
Scene_Battle.prototype.createActorWindow = function() {
    Alias.ScBa_createActorWindow.call(this);
    this._actorWindow.x = Graphics.boxWidth - this._actorWindow.width;
};

//238
Alias.ScBa_refreshStatus = Scene_Battle.prototype.refreshStatus;
Scene_Battle.prototype.refreshStatus = function() {
    Alias.ScBa_refreshStatus.call(this);
    this._actorCommandWindow.refresh();
    if (this._skillWindow.visible) this._skillWindow.refresh();
    if (this._skillStatusWindow.visible) this._skillStatusWindow.refresh();
    if (this._itemWindow.visible)  this._itemWindow.refresh();
    if (this._actorWindow.visible) this._actorWindow.refresh();
    if (this._enemyWindow.visible) this._enemyWindow.refresh();
};

//242
Alias.ScBa_startPartyCommandSelection = Scene_Battle.prototype.startPartyCommandSelection;
Scene_Battle.prototype.startPartyCommandSelection = function() {
    Alias.ScBa_startPartyCommandSelection.call(this);
    this._actor = null;
};

//250
Scene_Battle.prototype.commandFight = function() {
    BattleManager.setEscaping(false);
    this._partyCommandWindow.close();
};

//254
Scene_Battle.prototype.commandEscape = function() {
    BattleManager.setEscaping(true);
    this._partyCommandWindow.close();
};

//259
Alias.ScBa_startActorCommandSelection = Scene_Battle.prototype.startActorCommandSelection;
Scene_Battle.prototype.startActorCommandSelection = function() {
    AudioManager.playStaticSe(MPPlugin.ActiveSE);
    Alias.ScBa_startActorCommandSelection.call(this);
    this._skillWindow.deactivate();
    this._skillWindow.hide();
    this._itemWindow.deactivate();
    this._itemWindow.hide();
    this._actorWindow.deactivate();
    this._actorWindow.hide();
    this._enemyWindow.deactivate();
    this._enemyWindow.hide();
};

//278
Alias.ScBa_commandGuard = Scene_Battle.prototype.commandGuard;
Scene_Battle.prototype.commandGuard = function() {
    BattleManager.inputtingAction().setGuard();
    BattleManager.actor().onMadeAction();
    Alias.ScBa_commandGuard.call(this);
};

Scene_Battle.prototype.onStatusOk = function() {
    BattleManager.changeActor(this._statusWindow.index(), 'undecided');
    this.changeInputWindow();
};

//299
Alias.ScBa_selectActorSelection = Scene_Battle.prototype.selectActorSelection;
Scene_Battle.prototype.selectActorSelection = function() {
    Alias.ScBa_selectActorSelection.call(this);
    this._actorWindow.selectForItem();
};

//305
Alias.ScBa_onActorOk = Scene_Battle.prototype.onActorOk;
Scene_Battle.prototype.onActorOk = function() {
    BattleManager.actor().onMadeAction();
    Alias.ScBa_onActorOk.call(this);
};

//328
Alias.ScBa_selectEnemySelection = Scene_Battle.prototype.selectEnemySelection;
Scene_Battle.prototype.selectEnemySelection = function() {
    Alias.ScBa_selectEnemySelection.call(this);
    this._enemyWindow.selectForItem();
};

//335
Alias.ScBa_onEnemyOk = Scene_Battle.prototype.onEnemyOk;
Scene_Battle.prototype.onEnemyOk = function() {
    BattleManager.actor().onMadeAction();
    Alias.ScBa_onEnemyOk.call(this);
};

//387
Scene_Battle.prototype.onSelectAction = function() {
    var action = BattleManager.inputtingAction();
    //this._skillWindow.hide();
    //this._itemWindow.hide();
    if (action.isForOpponent()) {
        this.selectEnemySelection();
    } else {
        this.selectActorSelection();
    }
};

//400
Alias.ScBa_endCommandSelection = Scene_Battle.prototype.endCommandSelection;
Scene_Battle.prototype.endCommandSelection = function() {
    this._actor = null;
    Alias.ScBa_endCommandSelection.call(this);
    this._skillWindow.deactivate();
    this._skillWindow.hide();
    this._itemWindow.deactivate();
    this._itemWindow.hide();
    this._actorWindow.deactivate();
    this._actorWindow.hide();
    this._enemyWindow.deactivate();
    this._enemyWindow.hide();
};


})();


//=============================================================================
// UpdateDrawer
//=============================================================================

(function() {

if (!Window_Base.MPP_UpdateDrawer || Window_Base.MPP_UpdateDrawer < 1.0) {

var Alias = {};

//-----------------------------------------------------------------------------
// Window_Base

//13
Alias.WiBa_initialize = Window_Base.prototype.initialize;
Window_Base.prototype.initialize = function(x, y, width, height) {
    Alias.WiBa_initialize.call(this, x, y, width, height);
    this._updateDrawers = [];
};

//105
Alias.WiBa_update = Window_Base.prototype.update;
Window_Base.prototype.update = function() {
    Alias.WiBa_update.call(this);
    this.updateDrawer();
};

Window_Base.prototype.updateDrawer = function() {
    if (this.isOpen() && this.visible && this._updateDrawers.length > 0) {
        this._updateDrawers = this._updateDrawers.filter(function(process) {
            return process();
        });
    }
};

Window_Base.prototype.addUpdateDrawer = function(process) {
    this._updateDrawers.push(process);
};

Window_Base.prototype.clearUpdateDrawer = function() {
    this._updateDrawers = [];
};

Window_Base.MPP_UpdateDrawer = 1.0;
} //if (!Window_Base.MPP_UpdateDrawer || Window_Base.MPP_UpdateDrawer < 1.0)


})();
