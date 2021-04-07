import {
  Component,
  OnInit,
  Input,
  HostListener,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  Renderer2,
  ChangeDetectionStrategy,
  HostBinding,
  Injectable,
} from '@angular/core';
import {
  animate,
  animateChild,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MenuOptions, IMenuConfig, IMenuWing } from './menu-options.service';
@Component({
  selector: 'app-menu-container',
  templateUrl: './menu-container.component.html',
  styleUrls: ['./menu-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('btnText', [
      transition('0 <=> 1', [
        query(':leave', style({ opacity: 1, transform: 'scale(1)' })),
        query(':enter', style({ opacity: 0, transform: 'scale(0)' })),
        group([
          query(
            ':enter',
            animate(
              '300ms cubic-bezier(0.35, 0, 0.25, 1)',
              style({
                opacity: 1,
                transform: 'scale(1)',
              })
            )
          ),
          query(
            ':leave',
            animate(
              '300ms cubic-bezier(0.35, 0, 0.25, 1)',
              style({
                opacity: 0,
                transform: 'scale(0)',
              })
            )
          ),
        ]),
      ]),
    ]),
    trigger('menuState', [
      transition(':enter', [
        style({ transform: 'scale(0)' }),
        animate(
          '0ms cubic-bezier(0, 0, 0, 0)',
          style({ transform: 'scale(0)' })
        ),
        query('@rotateWing', animateChild(), { optional: true }),
      ]),
      transition(':leave', [
        animate(
          '0ms cubic-bezier(0, 0, 0, 0)',
          style({ transform: 'scale(0)' })
        ),
      ]),
    ]),
  ],
})
export class MenuContainerComponent implements OnInit {
  @ViewChild('menuWings', { static: false }) public menuWingsElm: ElementRef;
  @Input() public options: IMenuConfig;
  @Input() public gutter: Object;
  @Input() public wings: IMenuWing[];
  @Input() public startAngles: Object;
  @Output() public onWingSelected = new EventEmitter<IMenuWing>();
  @Output() public onWingHovered = new EventEmitter<IMenuWing>();
  @Output() public onMenuBtnClicked = new EventEmitter<boolean>();
  @Output() public onMenuListSpinning = new EventEmitter<boolean>();
  public menuBtnStyle: Object;
  public menuWingsStyle: Object;
  public svgPath: string;
  public wingsState: boolean;
  public positionClass: string;
  public menuConfig: any;
  public top: number;
  public left: number;
  private allowTransition = true;
  private isDragging = false;
  private isSpinning = false;
  @HostBinding('@menuState') public menuState = true;

  constructor(
    private menuOptions: MenuOptions,
    private renderer: Renderer2,
    private elm: ElementRef
  ) {}
  public ngOnInit() {
    this.menuOptions.setMenuOptions(
      this.options,
      this.gutter,
      this.startAngles
    );
    this.menuConfig = this.menuOptions.MenuConfig;
    this.wingsState = this.menuConfig.defaultOpen;
    this.positionClass = this.menuConfig.defaultPosition;
    this.setElementsStyle();
    this.calculateSvgPath();
  }
  public animationDone() {
    this.allowTransition = true;
  }
  public clickWing(wing: IMenuWing): void {
    this.onWingSelected.emit(wing);
  }
  public hoverWing(wing: IMenuWing): void {
    if (!this.isDragging && !this.isSpinning) {
      this.onWingHovered.emit(wing);
    }
  }
  public toggleMenu() {
    if (this.allowTransition) {
      this.wingsState = !this.wingsState;
      this.allowTransition = false;
      this.onMenuBtnClicked.emit(this.wingsState);
    }
  }
  public onPanEnd(): void {
    const centreX = window.innerWidth / 2 - this.menuConfig.buttonWidth / 2;
    const centreY = window.innerHeight / 2 - this.menuConfig.buttonWidth / 2;
    // set host element's position class based on its position when the panMove ends
    if (this.top > centreY && this.left < centreX) {
      this.positionClass = 'bottomLeft';
    } else if (this.top < centreY && this.left < centreX) {
      this.positionClass = 'topLeft';
    } else if (this.top < centreY && this.left > centreX) {
      this.positionClass = 'topRight';
    } else if (this.top > centreY && this.left > centreX) {
      this.positionClass = 'bottomRight';
    }
  }
  private setElementsStyle(): void {
    this.renderer.setStyle(
      this.elm.nativeElement,
      'width',
      this.menuConfig.buttonWidth + 'px'
    );
    this.renderer.setStyle(
      this.elm.nativeElement,
      'height',
      this.menuConfig.buttonWidth + 'px'
    );
    this.renderer.setStyle(
      this.elm.nativeElement,
      'font-family',
      this.menuConfig.font
    );
    this.menuBtnStyle = {
      background: this.menuConfig.buttonBackgroundColor,
      color: this.menuConfig.buttonFontColor,
      'font-size.px': this.menuConfig.buttonFontSize,
      'font-weight': this.menuConfig.buttonFontWeight,
    };
    if (!this.wingsState) {
      this.menuBtnStyle['opacity'] = this.menuConfig.buttonOpacity;
    }
    this.menuWingsStyle = {
      'top.px': -(this.menuConfig.radius - this.menuConfig.buttonWidth) / 2,
      'left.px': +this.menuConfig.buttonWidth / 2,
      'width.px': +this.menuConfig.radius,
      'height.px': +this.menuConfig.radius,
    };
    return;
  }
  /**
   * Calculate SVG path
   * */
  private calculateSvgPath(): void {
    const buttonWidth = +this.menuConfig.buttonWidth;
    const offset = +this.menuConfig.offset;
    const angle = +this.menuConfig.angle;
    const radius = +this.menuConfig.radius;
    const innerRadius = buttonWidth / 2 + offset;
    const x1 = Math.floor(
      radius * Math.cos((Math.PI * (360 - angle / 2)) / 180)
    );
    const y1 = Math.floor(
      radius / 2 + radius * Math.sin((Math.PI * (360 - angle / 2)) / 180)
    );
    const x2 = Math.floor(radius * Math.cos((Math.PI * (angle / 2)) / 180));
    const y2 = Math.floor(
      radius / 2 + radius * Math.sin((Math.PI * (angle / 2)) / 180)
    );
    const a1 = Math.floor(
      innerRadius * Math.cos((Math.PI * (360 - angle / 2)) / 180)
    );
    const b1 = Math.floor(
      radius / 2 + innerRadius * Math.sin((Math.PI * (360 - angle / 2)) / 180)
    );
    const a2 = Math.floor(
      innerRadius * Math.cos((Math.PI * (angle / 2)) / 180)
    );
    const b2 = Math.floor(
      radius / 2 + 1 + innerRadius * Math.sin((Math.PI * (angle / 2)) / 180)
    );

    this.svgPath =
      'M' +
      a1 +
      ',' +
      b1 +
      ' L' +
      x1 +
      ',' +
      y1 +
      ' A' +
      radius +
      ',' +
      radius +
      ' 0 0, 1' +
      ' ' +
      x2 +
      ',' +
      y2 +
      ' L' +
      a2 +
      ',' +
      b2 +
      '  A' +
      innerRadius +
      ',' +
      innerRadius +
      ' 1 0, 0' +
      ' ' +
      a1 +
      ',' +
      b1 +
      ' z';

    return;
  }
}
