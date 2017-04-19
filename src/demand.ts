namespace bot {
    let demand: { [index:string]: number | boolean | undefined } = {};

    export function resetDemand() {        
        for (let key in demand) {
            if (demand.hasOwnProperty(key)) {
                if (typeof demand[key] == 'boolean') {
                    //console.log(`${key} demand: ${demand[key]}`);

                    if (demand[key]) {
                        demand[key] = false;
                    } else {
                        demand[key] = undefined;
                    }
                }
            }
        }
    }

    export function addDemand(resource: string, amount: number) {
        let d = demand[resource];
        if (typeof d == 'undefined') {
            demand[resource] = amount;
        } else if (typeof d == 'number') {
            demand[resource] = Math.max(d, amount);
        }
    }

    export function onDemandCraft(resource: string) {
        let d = demand[resource];

        if (typeof d == 'number' && d > 0) {
            let craft = game.workshop.getCraft(resource);
            let prices = game.workshop.getCraftPrice(craft);
            for (let p of prices) {
                let r = game.resPool.resourceMap[p.name];
                d = Math.min(d, r.value / p.val);
            }

            if (d > 0) {
                //console.log(`crafting ${d} ${resource} to meet demand`);

                game.workshop.craft(resource, d);
                demand[resource] = true;
            }
        }
    }

    export function onCapCraftOrDemand(resource: string, craft: string, demand: string, craftPrice: number, demandPrice: number) {
        onCapCraft(resource, craft, craftPrice, (c) => {
            let d = price(c, craftPrice) * demandPrice;
            if (game.resPool.resourceMap[demand].value >= d) {
                return true;
            } else {
                addDemand(demand, d);
                return false;
            }
        });
    }
}