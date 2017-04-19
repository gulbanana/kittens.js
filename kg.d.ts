declare namespace game {
    namespace bld {
        function get(building: string): any;
        function getPrices(building: string): any;
    }

    namespace console {
        const filters: { [index:string]: {
            title: string,
            enabled: boolean,
            unlocked: boolean
        } }
    }

    namespace diplomacy {
        const races: Race[];
        function tradeMultiple(race: Race, amount: number): void;
    }

    namespace resPool {
        const resourceMap: { [index:string]: {
            value: number,
            maxValue: number,
            unlocked: true
        } }
    }

    namespace religion {
        function praise(): void;
    }

    const tabs: any[];

    namespace ui {
        function renderFilters(): void;
    }

    namespace village {
        function huntMultiple(amount: number);
    }

    namespace workshop {
        function craft(resource: string, amount: number): void;
        function craftAll(resource: string): void;
    }

    interface Race {}
}