namespace bot {
    export function main() {   
        resetDemand();

        /*************************************************************/
        /* 1: build when buildings are affordable, in priority order */
        /*************************************************************/
        // housing
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
        onAffordBuy("oilWell");
        onAffordBuy("accelerator");

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
        onAffordBuy("temple");
        onAffordBuy("chapel");

        // storage
        onAffordBuy("barn");
        onAffordBuy("warehouse");
        onAffordBuy("harbor");

        // blueprint eaters
        onAffordBuy("steamworks");
        onAffordBuy("magneto");
        onAffordBuy("reactor");
        onAffordBuy("factory");
        onAffordBuy("calciner");
        onAffordBuy("ziggurat");

        if (game.spaceTab.visible) {
            // starcharts
            onAffordBuy("researchVessel", "piscine");
            onAffordBuy("sattelite", "cath");

            // space production
            onAffordBuy("moonOutpost", "moon");
            onAffordBuy("planetCracker", "dune");
            onAffordBuy("hydrofracturer", "dune");
            onAffordBuy("spaceElevator", "cath");
            onAffordBuy("spiceRefinery", "dune");

            // space housing (deprioritised because it doesn't speed things up as much at this stage of the game)
            onAffordBuy("spaceStation", "cath");
            
            // space storage
            onAffordBuy("moonBase", "moon");
        }

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
        onCapCraftOrDemand("unobtainium", "eludium", "alloy", 1000, 2500);

        // pray and hunt
        onCap("faith", () => game.religion.praise());
        onCap("manpower", (c) => game.village.huntMultiple(price(c, 100)));

        // move papercrafts along the culture/science tree
        onCapCraftOrDemand("culture", "manuscript", "parchment", 400, 25);
        onCapCraftOrDemand("science", "compedium", "manuscript", 10000, 50);

        /*****************************************/
        /* 3: convert crafted resources up tiers */
        /*****************************************/
        onDemandCraft("parchment");
        onDemandCraft("scaffold");
        onDemandCraft("megalith");
        onDemandCraft("gear");
        onDemandCraft("alloy");
        onDemandCraft("concrate");
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


