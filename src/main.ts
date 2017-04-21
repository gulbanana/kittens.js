namespace bot {
    export function main() {   
        resetDemand();

        /*************************************************************/
        /* 1: build when buildings are affordable, in priority order */
        /*************************************************************/
        let buildings = [
            "logHouse", "hut", "mansion", //housing
            "workshop", "steamworks", "magneto", "factory", "ziggurat", // metaproduction
            "unicornPasture", "mine", "lumberMill", "smelter", "quarry", "oilWell", "accelerator", "calciner", //production
            "pasture", "field", "aqueduct", "reactor", //food/energy
            "academy", "library", "observatory", "biolab", //science
            "barn", "warehouse", "harbor", //storage
            "tradepost", "amphitheatre", "temple", "chapel", //culture
        ];

        for (let building of buildings) {
            onAffordBuy(building);
        }

        if (game.spaceTab.visible) {
            let spaceBuildings = [
                ["researchVessel", "piscine"], ["sattelite", "cath"], //starcharts
                ["moonOutpost", "moon"], ["planetCracker", "dune"], ["hydrofracturer", "dune"], ["spaceElevator", "cath"], ["spiceRefinery", "dune"], //production
                ["spaceStation", "cath"], ["moonBase", "moon"], //housing and storage
            ];

            for (let building of spaceBuildings) {
                onAffordBuy(building[0], building[1]);
            }
        }

        /****************************************/
        /* 2: consume capped resources usefully */
        /****************************************/
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

        /**********************************************************/
        /* 3: convert crafted resources up tiers to fulfil demand */
        /**********************************************************/
        onDemandCraft("parchment");
        onDemandCraft("scaffold");
        onDemandCraft("megalith");
        onDemandCraft("gear");
        onDemandCraft("alloy");
        onDemandCraft("concrate");
        onDemandCraft("blueprint");
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


