let bot;
if (typeof bot != "undefined") {
    clearInterval(bot);
}
if (!game.console.filters.trade) {
    game.console.filters.trade = {
        title: "Trades",
        enabled: true,
        unlocked: true
    };
    game.ui.renderFilters();
}
bot = setInterval(() => {
    // utility to calculate how many of something to buy
    function price(x, cost) {
        return Math.max(Math.floor(x / cost), 1);
    }
    // build when buildings are affordable 
    function onAffordBuy(bld) {
        let b = game.bld.get(bld);
        if (b.unlocked) {
            for (let p of game.bld.getPrices(bld)) {
                let res = game.resPool.resourceMap[p.name];
                if ((res.value > res.maxValue && res.maxValue != 0) ||
                    game.resPool.resourceMap[p.name].value < p.val) {
                    return;
                }
                // building purchases are ui driven using dojo MVC - we have to find the button controller and call a method on it
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
    // kittens
    onAffordBuy("logHouse");
    onAffordBuy("hut");
    onAffordBuy("mansion");
    // construction
    onAffordBuy("workshop");
    // production
    onAffordBuy("unicornPasture");
    onAffordBuy("mine");
    onAffordBuy("lumberMill");
    onAffordBuy("smelter");
    // food
    onAffordBuy("pasture");
    onAffordBuy("field");
    onAffordBuy("aqueduct");
    // science
    onAffordBuy("academy");
    onAffordBuy("library");
    // culture
    onAffordBuy("tradepost");
    onAffordBuy("amphitheatre");
    // storage
    onAffordBuy("barn");
    // consume capped resources in various ways
    const capThresh = 0.9;
    function onCap(res, f, test = (() => true)) {
        let r = game.resPool.resourceMap[res];
        if (!r.unlocked || Math.floor(r.value) > Math.floor(r.maxValue)) {
            return;
        }
        let th = r.maxValue * capThresh;
        let fallback = 10;
        while (r.value > th && test()) {
            //console.log(`${res} spending ${r.value - th}`);
            f(r.value - th);
            if (fallback-- <= 0) {
                console.log(`${res}: tried to run more than 10 times`);
                return;
            }
        }
    }
    ;
    function onCapCraft(res, toRes, cost, f = (() => true)) {
        if (!game.resPool.resourceMap[toRes].unlocked) {
            return;
        }
        onCap(res, (c) => game.workshop.craft(toRes, price(c, cost)), f);
    }
    ;
    // first, trade if we can
    onCap("gold", (c) => game.diplomacy.tradeMultiple(game.diplomacy.races[4], Math.min(price(c, 15), price(game.resPool.resourceMap["manpower"].value, 50))), () => (game.resPool.resourceMap["iron"].value <= game.resPool.resourceMap["iron"].maxValue * capThresh ||
        game.resPool.resourceMap["titanium"].value <= game.resPool.resourceMap["titanium"].maxValue * capThresh) &&
        game.resPool.resourceMap["manpower"].value > 50);
    // do basic conversion crafting
    onCapCraft("wood", "beam", 175);
    onCapCraft("minerals", "slab", 250);
    onCapCraft("iron", "plate", 125);
    onCapCraft("oil", "kerosene", 7500);
    onCapCraft("uranium", "thorium", 250);
    onCapCraft("coal", "steel", 100, () => game.resPool.resourceMap["iron"].value >=
        game.resPool.resourceMap["coal"].value);
    onCapCraft("unobtainium", "eludium", 1000, () => {
        if (game.resPool.resourceMap["alloy"].value < 2500) {
            game.workshop.craftAll("alloy");
        }
        return game.resPool.resourceMap["alloy"].value >= 2500;
    });
    onCap("culture", (_) => game.workshop.craft("manuscript", 1), () => {
        game.workshop.craftAll("parchment");
        return game.resPool.resourceMap["parchment"].value >= 2525;
    });
    // pray and hunt
    onCap("faith", () => game.religion.praise());
    onCap("manpower", (c) => game.village.huntMultiple(price(c, 100)));
}, 1000);
