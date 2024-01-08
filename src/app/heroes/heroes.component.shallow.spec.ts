import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeroesComponent } from "./heroes.component";
import { HeroService } from "../hero.service";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { of } from "rxjs";

describe('HeroesComponent (Shallow tests)', () => {
    let fixture: ComponentFixture<HeroesComponent>;
    let mockHeroService;
    let HEROES;

    beforeEach(() => {
        HEROES = [
            {id: 1, name: 'SpiderDude', strengh: 8},
            {id: 2, name: 'Wonderful Woman', strengh: 24},
            {id: 3, name: 'SuperDude', strengh: 55}
        ];
        mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);
        TestBed.configureTestingModule({
            declarations: [HeroesComponent],
            providers: [
                { provide: HeroService, useValue: mockHeroService }
            ],
            schemas: [NO_ERRORS_SCHEMA] // skip child component directive error
        });
        fixture = TestBed.createComponent(HeroesComponent);
    });

    it('should set heroes correctly from the serivce', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges(); // trigger ngOnInit from live cycle

        expect(fixture.componentInstance.heroes.length).toBe(3);
    });
});