namespace bot {
    let demand: { [index:string]: number | undefined } = {};

    export function resetDemand() {
        demand = {};
    }

    export function addDemand(resource: string, amount: number) {
        demand[resource] = Math.max(demand[resource]||0, amount);
    }

    export function onDemandCraft(resource: string) {
        let d = demand[resource]||0;

        if (d > 0) {
            game.workshop.craft(resource, d);
        }
    }
}