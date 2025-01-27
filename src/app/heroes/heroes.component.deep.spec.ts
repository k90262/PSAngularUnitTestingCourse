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
        givenTriggerNgOnInit();

        var heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
        expect(heroComponentDEs.length).toBe(3);
        for (let i=0; i<heroComponentDEs.length; i++) {
            expect(heroComponentDEs[i].componentInstance.hero).toBe(HEROES[i]);
        }
    });


    function givenTriggerNgOnInit() {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));

        // run ngOnInit
        fixture.detectChanges();
    }

    it(`should call delete when the Heroe Component's 
    delete button is clicked`, () => {
      spyOn(fixture.componentInstance, 'delete');
      givenTriggerNgOnInit();

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
        mockHeroService.deleteHero.and.returnValue(of());
        givenTriggerNgOnInit();

        const hereoComponets = fixture.debugElement.queryAll(By.directive(HeroComponent));
        hereoComponets[0].query(By.css('button'))
            .triggerEventHandler('click', {stopPropagation: () => {}});

        expect(mockHeroService.deleteHero).toHaveBeenCalledWith(HEROES[0]);
    });

    it('should add a new hero to the hero list when the add button is clicked', () => {
        givenTriggerNgOnInit();
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

    it('should not add a new hero to the hero list when the add button is clicked but input name is empty', () => {
        //spyOn(fixture.componentInstance, 'add');
        givenTriggerNgOnInit();
        const name = '';
        const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        mockHeroService.addHero.and.returnValue(of({}));
        const addButton = fixture.debugElement.queryAll(By.css('button'))[0];

        inputElement.value = name;
        addButton.triggerEventHandler('click', null);
        fixture.detectChanges(); 

        //expect(fixture.componentInstance.add).toHaveBeenCalledWith(name);
        expect(mockHeroService.addHero).not.toHaveBeenCalled();
    });

    it('should have the correct route for the first hero', () => {
        givenTriggerNgOnInit();
        const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

        let routerLink = heroComponents[0]
            .query(By.directive(RouterLinkDirectiveStub))
            .injector.get(RouterLinkDirectiveStub);
        
        heroComponents[0].query(By.css('a')).triggerEventHandler('click', null);

        expect(routerLink.navigatedTo).toBe('/detail/1');
    });
});