import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeroesComponent } from "./heroes.component";
import { HeroService } from "../hero.service";
import { Component, Directive, Input, NO_ERRORS_SCHEMA } from "@angular/core";
import { of } from "rxjs";
import { Hero } from "../hero";
import { By } from "@angular/platform-browser";
import { HeroComponent } from "../hero/hero.component";

@Directive({
    selector: "[routerLink]",
    host: { '(click)': 'onClick()' }
})
export class RouterLinkDirectiveStub {
    @Input('routerLink') linkParams: any;
    navigatedTo: any = null;

    onClick() {
      this.navigatedTo = this.linkParams;
    }
}

describe('HeroesComponent (Deep tests)', () => {
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
            declarations: [
                HeroesComponent,
                HeroComponent,
                RouterLinkDirectiveStub
            ],
            providers: [
                { provide: HeroService, useValue: mockHeroService }
            ],
            //schemas: [NO_ERRORS_SCHEMA] // skip routerLink error
        });
        fixture = TestBed.createComponent(HeroesComponent);
    });

    it('should render each hero as a HeroComponent', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));

        // run ngOnInit
        fixture.detectChanges();

        var heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
        expect(heroComponentDEs.length).toBe(3);
        for (let i=0; i<heroComponentDEs.length; i++) {
            expect(heroComponentDEs[i].componentInstance.hero).toBe(HEROES[i]);
        }
    });

    it(`should call delete when the Heroe Component's 
    delete button is clicked`, () => {
      spyOn(fixture.componentInstance, 'delete');
      mockHeroService.getHeroes.and.returnValue(of(HEROES));

      // run ngOnInit
      fixture.detectChanges();

      const hereoComponets = fixture.debugElement.queryAll(By.directive(HeroComponent));
      // METHOD 1. real trigger button click event
      // hereoComponets[0].query(By.css('button'))
      //     .triggerEventHandler('click', {stopPropagation: () => {}});
      // METHOD 2. just test binding
      // (<HeroComponent>hereoComponets[0].componentInstance).delete.emit(undefined);
      // METHOD 3. just use debugElement to trigger event
      hereoComponets[0].triggerEventHandler('delete', null);

      expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
  });

    it(`should call heroService.deleteHero when the Heroe Component's 
      delete button is clicked`, () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        mockHeroService.deleteHero.and.returnValue(of());

        // run ngOnInit
        fixture.detectChanges();

        const hereoComponets = fixture.debugElement.queryAll(By.directive(HeroComponent));
        hereoComponets[0].query(By.css('button'))
            .triggerEventHandler('click', {stopPropagation: () => {}});

        expect(mockHeroService.deleteHero).toHaveBeenCalledWith(HEROES[0]);
    });

    it('should add a new hero to the hero list when the add button is clicked', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();
        const name = 'Mr. Ice';
        const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        mockHeroService.addHero.and.returnValue(of({id: 5, name: name, strength: 4}));
        const addButton = fixture.debugElement.queryAll(By.css('button'))[0];

        inputElement.value = name;
        addButton.triggerEventHandler('click', null);
        fixture.detectChanges(); // trigger UI to update

        const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent;
        expect(heroText).toContain(name);
    });
});