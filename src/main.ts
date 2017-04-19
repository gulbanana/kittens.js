namespace bot {
    export function main() {   
        /*************************************************************/
        /* 1: build when buildings are affordable, in priority order */
        /*************************************************************/

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
        onAffordBuy("warehouse");

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
        onCapCraft("unobtainium", "eludium", 1000, () => {
            if (game.resPool.resourceMap["alloy"].value < 2500) {
                game.workshop.craftAll("alloy");
            }
            return game.resPool.resourceMap["alloy"].value >= 2500;
        });

        // pray and hunt
        onCap("faith", () => game.religion.praise());
        onCap("manpower", (c) => game.village.huntMultiple(price(c, 100)));

        // move crafts up the culture/science tree
        onCap("culture", (_) => game.workshop.craft("manuscript", 1), () => {
            game.workshop.craftAll("parchment");
            return game.resPool.resourceMap["parchment"].value >= 2525;
        });
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


