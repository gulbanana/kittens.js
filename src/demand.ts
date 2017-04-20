namespace bot {
    const satisfyThresh = 0.2;

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
            let totalD = d;

            let craft = game.workshop.getCraft(resource);
            let prices = game.workshop.getCraftPrice(craft);
            let anyRequirementsInDemand = false;
            for (let p of prices) {
                let r = game.resPool.resourceMap[p.name];
                d = Math.min(d, r.value / p.val);
                if (typeof demand[p.name] != 'undefined') {
                    anyRequirementsInDemand = true;
                }
            }

            if (!anyRequirementsInDemand || d > satisfyThresh * totalD) { // otherwise we're just wasting time
                //console.log(`crafting ${d} ${resource} to meet demand`);

                game.workshop.craft(resource, d);
                demand[resource] = true;
            }
        }
    }
}