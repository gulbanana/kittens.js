namespace bot {
    function getBuilding(building: string, planet?: string): game.Building | undefined {
        if (typeof planet == 'string') {
            for (let panel of game.spaceTab.planetPanels) {
                if (panel.planet.name == planet) {
                    let p = panel.planet;
                    for (let b of p.buildings) {
                        if (b.name == building) {
                            return b;
                        }
                    }
                    return undefined;
                }
            }
            return undefined;
        } else {
            return game.bld.get(building);
        }
    }

    // building purchases are ui driven using dojo MVC - we have to find the button controller and call a method on it
    function getButton(building: string, planet?: string): game.Button | undefined {
        if (typeof planet == 'string') {
            for (let panel of game.spaceTab.planetPanels) {
                if (panel.planet.name == planet) {
                    for (let button of panel.children) {
                        if (button.model.metadata.name == building) {
                            return button;
                        }
                    }
                }
            }
        } else {
            for (let button of game.tabs[0].buttons) {
                if (typeof button.model.metadata != 'undefined' && button.model.metadata.name == building) {
                    return button;
                }
            }
        }

        return undefined;
    }

    function reachedPlanet(planet: string): boolean {
        for (let panel of game.spaceTab.planetPanels) {
            if (panel.planet.name == planet) {
                return true;
            }
        }

        return false;
    }

    export function onAffordBuy(building: string, planet?: string) {
        if (typeof planet == 'string' && !reachedPlanet(planet)) {
            return;
        }

        let b = getBuilding(building, planet);
        if (typeof b == 'undefined') {
            console.log(`cannot find metadata for building ${building} on planet ${planet}`);
            return;
        }

        if (b.unlocked) {
            let ui = getButton(building, planet);
            if (typeof ui == 'undefined') {
                console.log(`cannot find button for building ${building} on planet ${planet}`);
                return;
            }

            for (let price of ui.controller.getPrices(ui.model)) {
                let res = game.resPool.resourceMap[price.name];

                if (res.maxValue != 0 && res.value > res.maxValue && res.value - res.maxValue > res.maxValue * 0.1) { // post-reset or something
                    return;
                }

                if (game.resPool.resourceMap[price.name].value < price.val) { // can't afford it
                    addDemand(price.name, price.val - game.resPool.resourceMap[price.name].value);
                    return;
                }
            }

            ui.controller.build(ui.model, 1);
            ui.update();            
        }
    }
}