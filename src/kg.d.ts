declare namespace game {
    namespace bld {
        function get(building: string): Building;
        function getPrices(building: string): Price[];
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
        const resourceMap: { [index:string]: Resource }
    }

    namespace religion {
        function praise(): void;
    }

    const spaceTab: SpaceTab;

    const tabs: Tab[];

    namespace ui {
        function renderFilters(): void;
    }

    namespace village {
        function huntMultiple(amount: number): void;
    }

    namespace workshop {
        function craft(resource: string, amount: number): void;
        function craftAll(resource: string): void;
        function getCraft(resource: string): Craft;
        function getCraftPrice(craft: Craft): Price[];
    }

    interface Price {
        name: string;
        val: number;
    }

    interface Building {
        unlocked: boolean,
        name: string,
        label: string,
    }

    interface Resource {
        value: number,
        maxValue: number,
        unlocked: boolean,
        craftable: boolean
    }

    interface Craft {
        prices: Price[];
    }

    interface Race {}

    interface Tab {
        visible: boolean,
        buttons: Button[],
    }

    interface Button {
        update: () => void;
        model: ButtonModel;
        controller: ButtonController;
    }

    interface ButtonModel {
        metadata: {
            name: string;
        }
    }

    interface ButtonController {
        build: (model: ButtonModel, amount: number) => void;
        getPrices: (model: ButtonModel) => Price[];
    }

    interface SpaceTab extends Tab {
        planetPanels: {
            children: Button[]
            planet: Planet
        }[]
    }

    interface Planet {
        name: string;
        reached: boolean;
        buildings: Building[];
    }
}