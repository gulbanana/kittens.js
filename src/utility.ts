namespace bot {
    export const capThresh = 0.9;

    // utility to calculate how many of something to buy
    export function price(x: number, cost: number) {
        return Math.max(Math.floor(x/cost), 1);
    }

    export function onAffordBuy(bld: string) {
        let b = game.bld.get(bld);

        if (b.unlocked) {
            for (let p of game.bld.getPrices(bld)) {
                let res = game.resPool.resourceMap[p.name];
                if ((res.value > res.maxValue && res.maxValue != 0) || // post-reset or something
                    game.resPool.resourceMap[p.name].value < p.val) {
                    //console.log("not building due to " + res);
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

    export function onCap(res: string, f: (c: number) => void, test = (() => true)) {
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
    };

    export function onCapCraft(res: string, toRes: string, cost: number, f = (() => true)) {
        if (!game.resPool.resourceMap[toRes].unlocked) {
            return;
        }

        onCap(res, (c) => game.workshop.craft(toRes, price(c, cost)), f);
    };
}