namespace bot {
    export const capThresh = 0.9;

    // utility to calculate how many of something to buy
    export function price(x: number, cost: number) {
        return Math.max(Math.floor(x/cost), 1);
    }

    export function onCap(res: string, f: (c: number) => void, test = ((_: number) => true)) {
        let r = game.resPool.resourceMap[res];

        if (!r.unlocked) {
            return;
        }

        if (Math.floor(r.value) > Math.floor(r.maxValue) && r.value - r.maxValue > r.maxValue * 0.1) {
            return;
        }
        
        let th = r.maxValue * capThresh;
        let fallback = 10;
        while (r.value > th && test(r.value - th)) {
            //console.log(`${res} spending ${r.value - th}`);
            f(r.value - th);
            if (fallback-- <= 0) {
                console.log(`${res}: tried to run more than 10 times`);
                return;
            }
        }
    };

    export function onCapCraft(res: string, toRes: string, cost: number, f = ((_: number) => true)) {
        if (!game.resPool.resourceMap[toRes].unlocked) {
            return;
        }

        onCap(res, (c) => game.workshop.craft(toRes, price(c, cost)), f);
    };

    
    export function onCapCraftOrDemand(resource: string, craft: string, demand: string, craftPrice: number, demandPrice: number) {
        onCapCraft(resource, craft, craftPrice, (c) => {
            let d = price(c, craftPrice) * demandPrice;
            if (game.resPool.resourceMap[demand].value >= d) {
                return true;
            } else {
                addDemand(demand, d - game.resPool.resourceMap[demand].value);
                return false;
            }
        });
    }
}