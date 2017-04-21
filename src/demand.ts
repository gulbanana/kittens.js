namespace bot {
    let demand: { [index:string]: number[] | boolean | undefined } = {};

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
        let demands = demand[resource];
        if (typeof demands == 'undefined') {
            demand[resource] = [amount];
        } else if (typeof demands == 'object') {
            if (demands.indexOf(amount) == -1) {
                demands.push(amount);
                demands.sort((a, b) => b - a);
            }
        }
    }

    export function onDemandCraft(resource: string) {
        let demands = demand[resource];

        if (typeof demands == 'object') {
            //console.log("process demand for " + resource);
            let supply = demands[0];
            let craft = game.workshop.getCraft(resource);
            let prices = game.workshop.getCraftPrice(craft);
            
            for (let p of prices) {
                let res = game.resPool.resourceMap[p.name];
                
                let available = res.value;
                //console.log('raw ' + p.name + ': ' + available);
                //let resDemands = demand[p.name]
                //console.log(resDemands);
                //if (typeof resDemands == 'object') {
                //    available -= resDemands[resDemands.length - 1];
                //}
                //console.log('available ' + p.name + ': ' + available);

                supply = Math.min(supply, available / p.val);
            }

            for (let d of demands) {
                if (supply >= d) {
                    //console.log("available at " + d);
                    game.workshop.craft(resource, d);
                    demand[resource] = true;
                    return;
                }
                //console.log("not available at " + d);
            }
        }
    }
}