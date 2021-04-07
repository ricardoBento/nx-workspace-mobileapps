import { Injectable } from '@angular/core';

export interface IMenuConfig {
  font?: string;
  defaultOpen?: boolean;
  defaultPosition?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  radius?: number;
  angle?: number;
  offset?: number;
  showIcons?: boolean;
  onlyIcons?: boolean;
  spinable?: boolean;
  wingFontSize?: number;
  wingFontWeight?: number;
  wingFontColor?: string;
  wingIconSize?: number;
  buttonWidth?: number;
  buttonBackgroundColor?: string;
  buttonFontColor?: string;
  buttonFontWeight?: number;
  buttonFontSize?: number;
  buttonCrossImgSize?: string;
  buttonOpacity?: number;
}
export interface IMenuWing {
  title: string;
  color: string;
  titleColor?: string;
  icon?: { name: string; color?: string; size?: number };
}
@Injectable({
  providedIn: 'root',
})
export class MenuOptions {
  public menuConfig: IMenuConfig = {
    font: 'sans-serif',
    defaultOpen: true,
    defaultPosition: 'topLeft',
    radius: 200,
    angle: 30,
    offset: 25,
    showIcons: true,
    onlyIcons: false,
    spinable: false,
    wingFontSize: 16,
    wingFontWeight: 600,
    wingFontColor: '#ffffff',
    wingIconSize: 35,
    buttonWidth: 60,
    buttonBackgroundColor: '#ff7f7f',
    buttonFontColor: '#ffffff',
    buttonFontWeight: 700,
    buttonFontSize: 14,
    buttonCrossImgSize: '50%',
    buttonOpacity: 0.7,
  };
  get MenuConfig(): IMenuConfig {
    return this.menuConfig;
  }
  private gutter: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  } = {
    top: 130,
    left: 30,
    right: 30,
    bottom: 30,
  };
  get Gutter(): {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  } {
    return this.gutter;
  }
  private startAngles: {
    topLeft?: number;
    topRight?: number;
    bottomRight?: number;
    bottomLeft?: number;
  } = {
    topLeft: 0,
    topRight: 90,
    bottomRight: 180,
    bottomLeft: 270,
  };
  get StartAngles(): {
    topLeft?: number;
    topRight?: number;
    bottomRight?: number;
    bottomLeft?: number;
  } {
    return this.startAngles;
  }
  private center: { x: number; y: number };
  // For setting the menu spin start position
  get Center(): { x: number; y: number } {
    return this.center;
  }
  set Center(value: { x: number; y: number }) {
    this.center = {
      x: value.x + this.menuConfig.buttonWidth / 2,
      y: value.y + this.menuConfig.buttonWidth / 2,
    };
  }
  /* Property menuPositions */
  private menuPositions: any;

  get MenuPositions(): any {
    return this.menuPositions;
  }
  constructor() {}
  public setMenuOptions(
    menuConfig: IMenuConfig,
    gutter: Object,
    startAngles: Object
  ): void {
    this.menuConfig = Object.assign(this.menuConfig, menuConfig);
    this.gutter = Object.assign(this.gutter, gutter);
    this.startAngles = Object.assign(this.startAngles, startAngles);

    this.menuPositions = {
      topLeft: {
        top: this.gutter.top,
        left: this.gutter.left,
        textAnchor: 'middle',
        textRotate: 0,
      },
      topRight: {
        top: this.gutter.top,
        left:
          window.innerWidth - this.menuConfig.buttonWidth - this.gutter.right,
        textAnchor: 'end',
        textRotate: 180,
      },
      bottomRight: {
        top:
          window.innerHeight - this.menuConfig.buttonWidth - this.gutter.bottom,
        left:
          window.innerWidth - this.menuConfig.buttonWidth - this.gutter.right,
        textAnchor: 'end',
        textRotate: 180,
      },
      bottomLeft: {
        top:
          window.innerHeight - this.menuConfig.buttonWidth - this.gutter.bottom,
        left: this.gutter.left,
        textAnchor: 'middle',
        textRotate: 0,
      },
    };
  }
}
