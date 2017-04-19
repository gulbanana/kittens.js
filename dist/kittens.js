var bot;
(function (bot) {
    function main() {
        bot.onAffordBuy("logHouse");
        bot.onAffordBuy("hut");
        bot.onAffordBuy("mansion");
        bot.onAffordBuy("workshop");
        bot.onAffordBuy("unicornPasture");
        bot.onAffordBuy("mine");
        bot.onAffordBuy("lumberMill");
        bot.onAffordBuy("smelter");
        bot.onAffordBuy("pasture");
        bot.onAffordBuy("field");
        bot.onAffordBuy("aqueduct");
        bot.onAffordBuy("academy");
        bot.onAffordBuy("library");
        bot.onAffordBuy("tradepost");
        bot.onAffordBuy("amphitheatre");
        bot.onAffordBuy("barn");
        bot.onAffordBuy("warehouse");
        bot.onCap("gold", (c) => game.diplomacy.tradeMultiple(game.diplomacy.races[4], Math.min(bot.price(c, 15), bot.price(game.resPool.resourceMap["manpower"].value, 50))), () => (game.resPool.resourceMap["iron"].value <= game.resPool.resourceMap["iron"].maxValue * bot.capThresh ||
            game.resPool.resourceMap["titanium"].value <= game.resPool.resourceMap["titanium"].maxValue * bot.capThresh) &&
            game.resPool.resourceMap["manpower"].value > 50);
        bot.onCapCraft("wood", "beam", 175);
        bot.onCapCraft("minerals", "slab", 250);
        bot.onCapCraft("iron", "plate", 125);
        bot.onCapCraft("oil", "kerosene", 7500);
        bot.onCapCraft("uranium", "thorium", 250);
        bot.onCapCraft("coal", "steel", 100, () => game.resPool.resourceMap["iron"].value >= game.resPool.resourceMap["coal"].value);
        bot.onCapCraft("unobtainium", "eludium", 1000, () => {
            if (game.resPool.resourceMap["alloy"].value < 2500) {
                game.workshop.craftAll("alloy");
            }
            return game.resPool.resourceMap["alloy"].value >= 2500;
        });
        bot.onCap("faith", () => game.religion.praise());
        bot.onCap("manpower", (c) => game.village.huntMultiple(bot.price(c, 100)));
        bot.onCap("culture", (_) => game.workshop.craft("manuscript", 1), () => {
            game.workshop.craftAll("parchment");
            return game.resPool.resourceMap["parchment"].value >= 2525;
        });
    }
    bot.main = main;
})(bot || (bot = {}));
if (!game.console.filters.trade) {
    game.console.filters.trade = {
        title: "Trades",
        enabled: true,
        unlocked: true
    };
    game.ui.renderFilters();
}
if (typeof interval != "undefined") {
    clearInterval(interval);
}
interval = setInterval(bot.main, 1000);
var bot;
(function (bot) {
    bot.capThresh = 0.9;
    function price(x, cost) {
        return Math.max(Math.floor(x / cost), 1);
    }
    bot.price = price;
    function onAffordBuy(bld) {
        let b = game.bld.get(bld);
        if (b.unlocked) {
            for (let p of game.bld.getPrices(bld)) {
                let res = game.resPool.resourceMap[p.name];
                if ((res.value > res.maxValue && res.maxValue != 0) ||
                    game.resPool.resourceMap[p.name].value < p.val) {
                    return;
                }
                for (let button of game.tabs[0].buttons) {
                    if (typeof button.model.metadata != 'undefined' &&
                        button.model.metadata.name == bld) {
                        button.controller.build(button.model, 1);
                        button.update();
                        return;
                    }
                }
                console.log("can't find button for building " + bld);
                console.log(b);
            }
        }
    }
    bot.onAffordBuy = onAffordBuy;
    function onCap(res, f, test = (() => true)) {
        let r = game.resPool.resourceMap[res];
        if (!r.unlocked || Math.floor(r.value) > Math.floor(r.maxValue)) {
            return;
        }
        let th = r.maxValue * bot.capThresh;
        let fallback = 10;
        while (r.value > th && test()) {
            f(r.value - th);
            if (fallback-- <= 0) {
                console.log(`${res}: tried to run more than 10 times`);
                return;
            }
        }
    }
    bot.onCap = onCap;
    ;
    function onCapCraft(res, toRes, cost, f = (() => true)) {
        if (!game.resPool.resourceMap[toRes].unlocked) {
            return;
        }
        onCap(res, (c) => game.workshop.craft(toRes, price(c, cost)), f);
    }
    bot.onCapCraft = onCapCraft;
    ;
})(bot || (bot = {}));
