Component Configuration
Once the component is added to the element, it can be configured with the following configuration attributes.

Attribute Type Required Default Description
[options] attribute Optional {} The menu option properties are below for details.
[gutter] attribute Optional {top: 130, left: 30, right: 30, bottom: 30} The space between the menu and the boundaries of the page window. The object can have four properties left, right, top, bottom with values to be defined in Number
[startAngles] attribute Optional {topLeft: 0, topRight: 90, bottomRight: 180, bottomLeft: 270} The angle when the menu open at four different positions and before it expands. The object can have four properties topLeft, topRight, bottomRight, bottomLeft with values to be defined in Number. The default value 'topLeft: 0' means the menu would open to 3 o'clock degree when the menu is in topLeft position. (topRight: 90 -> 6 o'clock, bootomRight: 180 -> 9 o'clock, bottomLeft: 270 -> 12 o'clock)
[wings] Array [Object] YES none Array of menu item objects. Each menu is an object. Refer to the Data Array - Menu Item Object Properties are below for details.
[(onWingSelected)] Method YES '' Callback on menu item wing clicked. It returns the wing object which is be clicked
Config Menu Option Properties

Property Type Required Default Description
[font] string Optional 'sans-serif' The font family of the whole menu. If you use other font family, remember to include the font style in your project.
[radius] number Optional 200 The radius of the menu wings from the center of the button. The measure unit is 'px'.
[defaultOpen] Boolean Optional true Open menu automatically on load.
[defaultPosition] string Optional topLeft Position at the which the menu appears on load. Possible values are topLeft, topRight, bottomLeft,bottomRight
angle number Optional 30 The angle at which each menu wing would expand when clicked.
[offset] number Optional 25 The gap between the menu button and the menu item wings. The measure unit is 'px'.
[showIcons] boolean Optional true A flag that determines whether to show or hide icons along with the text in menu item wing.
[onlyIcons] boolean Optional false A flag that determines whether to only show icons in the menu wings (hide the wing title).
[spinable] boolean Optional false A flag that determines whether the menu could be spun. It is recommended to set it true if your menu is out of the screen when it is expanded.
[buttonWidth] number Optional 60 The width of the menu button. The measure unit is 'px'.
[buttonBackgroundColor] string Optional '#ff7f7f' The background color of the menu button.
[buttonFontColor] string Optional '#ffffff' The font color of the menu button. This would be the cross image color when the mean is expanded
[buttonFontWeight] number Optional 700 The font weight of the menu button.
[buttonFontSize] number Optional 14 The font size of the menu button. The measure unit is 'px'.
[buttonCrossImgSize] string Optional '50%' The size of the menu cross image. The measure unit could 'px', 'em', '%' or 'rem'. Remember to include the measure unit when you set this property
[buttonOpacity] number Optional 0.7 The button would be blur if the menu is not expanded. Set it to 1 if you don't want any blur.
[wingFontSize] number Optional 16 The font size of the menu wing text. This is the general font size for all the menu wings. You could config the font size for a signal menu wing to override this when you set the wing. The measure unit is 'px'.
[wingFontWeight] number Optional 600 The font weight of the menu wing text. This is the general font weight for all the menu wings. You could config the font weight for a signal menu wing to override this when you set the wing.
[wingFontColor] string Optional '#ffffff' The font color of the menu wing text. This is the general font color for all the menu wings and their icons. You could config the font color for a signal menu wing to override this when you set the wing.
[wingIconSize] number Optional 35 The size of the menu wing icons. This is the general size for all the menu wings' icons. You could config the size for a signal menu wing icon to override this when you set the wing. The measure unit is 'px'.

Data Array - Menu Item Object Properties
wings - Array [menuWing]

menuWing {} properties

# Property Type Required Description

[title] String YES Title of the menu item.
[color] Hex Code YES Background color of the wing.
[titleColor] Hex Code YES Text color of the title.
[icon] Object YES Icon object properties. {"color":"#fff","name":"fa fa-tablet","size": 35}

- the wing icon is font icon image. You can use Fontawesome, Bootstrap or any other font icon libraries. Remember to include all those font files and style files into your project.

#Emit Events

(onWingSelected) --- it would emit the wing that is being clicked or selected.

(onWingHovered) --- it would emit the wing that is being mouse over(hover).

(onMenuBtnClicked) --- it would emit boolean value if the menu button is being clicked. It emits true if the menu button is clicked to open the menu list, false if the button is clicked to close the menu list.

(onMenuListSpinning) --- it would emit true if the menu list is being spun.
