import { of } from "rxjs";
import { HeroesComponent } from "./heroes.component";

describe('HeroesComponent', () => {
    let component: HeroesComponent;
    let HEROES;
    let mockHeroService;

    beforeEach(() => {
        HEROES = [
            {id: 1, name: 'SpiderDude', strengh: 8},
            {id: 2, name: 'Wonderful Woman', strengh: 24},
            {id: 3, name: 'SuperDude', strengh: 55}
        ];

        mockHeroService = jasmine.createSpyObj(['getHeroes', 'deleteHero', 'addHero']);

        component = new HeroesComponent(mockHeroService);
    });

    describe('delete', () => {
        it('should delete the indicated here from the heroes list', () => {
            component.heroes = HEROES;
            mockHeroService.deleteHero.and.returnValue(of(true));

            component.delete(HEROES[2]);

            expect(component.heroes.length).toBe(2);
        });

        it('should call deleteHero', () => {
            component.heroes = HEROES;
            mockHeroService.deleteHero.and.returnValue(of(true));

            component.delete(HEROES[2]);

            expect(mockHeroService.deleteHero).toHaveBeenCalledWith(HEROES[2]);
        });
    });

});