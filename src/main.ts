namespace bot {
    export function main() {   
        resetDemand();

        /*************************************************************/
        /* 1: build when buildings are affordable, in priority order */
        /*************************************************************/
        // population
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
        onAffordBuy("quarry");

        // food
        onAffordBuy("pasture");
        onAffordBuy("field");
        onAffordBuy("aqueduct");

        // science
        onAffordBuy("academy");
        onAffordBuy("library");
        onAffordBuy("observatory");
        onAffordBuy("biolab");

        // culture
        onAffordBuy("tradepost");
        onAffordBuy("amphitheatre");

        // storage
        onAffordBuy("barn");
        onAffordBuy("warehouse");
        onAffordBuy("harbor");

        /***********************************************/
        /* 2: consume capped resources in various ways */
        /***********************************************/
        // trade if we can
        onCap("gold", (c) => game.diplomacy.tradeMultiple(game.diplomacy.races[4], Math.min(price(c, 15), price(game.resPool.resourceMap["manpower"].value, 50))),
                    () => (game.resPool.resourceMap["iron"].value <= game.resPool.resourceMap["iron"].maxValue * capThresh || 
                            game.resPool.resourceMap["titanium"].value <= game.resPool.resourceMap["titanium"].maxValue * capThresh) && 
                            game.resPool.resourceMap["manpower"].value > 50);

        // do basic conversion crafting
        onCapCraft("wood", "beam", 175);
        onCapCraft("minerals", "slab", 250);
        onCapCraft("iron", "plate", 125);
        onCapCraft("oil", "kerosene", 7500);
        onCapCraft("uranium", "thorium", 250);
        onCapCraft("coal", "steel", 100, () => game.resPool.resourceMap["iron"].value >= game.resPool.resourceMap["coal"].value);
        onCapCraft("unobtainium", "eludium", 1000, (c) => {
            let d = price(c, 2500);
            if (game.resPool.resourceMap["alloy"].value >= d) {
                return true;
            } else {
                addDemand("alloy", d);
                return false;
            }
        });

        // pray and hunt
        onCap("faith", () => game.religion.praise());
        onCap("manpower", (c) => game.village.huntMultiple(price(c, 100)));

        // move papercrafts along the culture/science tree
        onCapCraft("culture", "manuscript", 400, (c) => {
            let d = price(c, 25);
            if (game.resPool.resourceMap["parchment"].value >= d) {
                return true;
            } else {
                addDemand("parchment", d);
                return false;
            }
        });

        /*****************************************/
        /* 3: convert crafted resources up tiers */
        /*****************************************/
        onDemandCraft("scaffold");
        onDemandCraft("parchment");
        onDemandCraft("alloy");
    }
}

// add a custom log filter for all the trading we do
if (!game.console.filters.trade){
    game.console.filters.trade = {
        title: "Trades",
        enabled: true,
        unlocked: true
    };
    game.ui.renderFilters();
}

// schedule the bot
declare var interval: number | undefined;
if (typeof interval != "undefined") {
    clearInterval(interval);
}
interval = setInterval(bot.main, 1000);


