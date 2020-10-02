# ContextmenuJS

ContextmenuJS is a simple JavaScript library, to display custom contextmenus (right-click).

**Demo:** https://m-thalmann.github.io/contextmenujs/

## Navigation
- [Installation](#installation)
- [Usage](#usage)
- [Documentation](#documentation)
  - [ContextMenu](#contextmenu)
  - [Menu structure](#menu-structure)
  - [ContextUtil](#contextutil)
  - [Options](#options)
- [Example](#example)

## Installation
1. Download the .zip-File and put it in your project-folder.

2. Add this script-tag to the head of the file
```html
<script src="path/to/js/file.js"></script>
```

3. Add this link-tag to the head of the file, to include the styles
```html
<link rel="stylesheet" href="path/to/css/file.css" />
```

4. Start using the library!

## Usage
### Create menu structure
```javascript
var menuitems = [
  {
    "text": "Item 1",
    "icon": "&#9819;",
    "sub": [
      {
        "text": "Item 1.1",
        "enabled": false
      }
    ]
  },
  {
    "text": "Item 2"
  }
];
```

### Create new contextmenu
```javascript
var menu = new ContextMenu(menuitems);
```

### Append contextmenu to listener
```javascript
document.addEventListener("contextmenu", function(e){
  menu.display(e);
});
```

### (Re-)load the contextmenu
```javascript
menu.reload(); // Always use this, when you change the menu
```
## Documentation
### Contextmenu
It's the main object to display the contextmenu
#### Instanciating
```javascript
new ContextMenu(menu_structure, options);
```
- **menu_structure** (Array): This array contains all items of the menu (see [below](#menu-structure))
- **options** (object): A object with options for the contextmenu (see [below](#options)) **(optional)**

After the instanciation, the contextmenu is reloaded/rendered, but not shown

#### Methods
```javascript
menu.reload();                    // Reloads/Renders the contextmenu inside of a container (id: cm_<num>)
menu.display(e, target);          // Displays the contextmenu on the location present in the contextmenu-event (e)
                                  // and executes e.preventDefault();
                                  // if target is set, the contextTarget is set to that
menu.hide();                      // Hides the menu, if shown
                            
menu.setOptions(options);         // Resets the options (object)
menu.changeOption(option, value); // Changes one option (string, object)
menu.getOptions();                // Returns the options
```

#### Properties (variables)
```javascript
menu.menu                         // The menu structure; change this, or the parameter, to change the menu (no setter)
menu.contextTarget                // The target, where the contextmenu was last opened

ContextMenu.count                 // Number of contextmenus created (for the id's)
ContextMenu.DIVIDER               // Constant, that is used to mark a item as a divider ("type": ContextMenu.DIVIDER)
```

### Menu structure
It's only a guideline, to define a menu (no object etc.)

```javascript
var menustructure = [
  {
    "text": "Item1",                         // Text to display
    "icon": '<img src="images/item.png" />', // Icon to display next to the text
    "sub": [                                 // Item has nested items
      {
        "text": "Item1.1",
        "enabled": false                     // Item is disabled (if it has nested items, they won't show)
      }
    ]
  },
  {
    "type": ContextMenu.DIVIDER              // This item is a divider (shows only gray line, no text etc.)
  },
  {
    "text": "Item2",
    "events": {                              // Adds eventlisteners to the item (you can use any event there is)
      "click": function(e){
        console.log("clicked");
      },
      "mouseover": function(e){
        console.log("mouse is over menuitem");
      }
    }
  }
];
```
**NOTE:** The braces after the = and after `"sub":` are square ones!

**NOTE:** Every other property, not mentioned here, is skipped!

### ContextUtil
A collection of helper methods. Can't be instanciated.
#### Methods
```javascript
ContextUtil.getProperty(opt, o, def);        // Returns the value of 'o' in the array/object opt, if it is set;
                                             // else it returns def (object, string, object)

ContextUtil.getSizes(obj);                   // Recursively gets the size of a DOM-List (ul), that has absolute positioned
                                             // children (dom-element)
```

### Options

| Option | Values | Definition |
|:---------------:|:----------:|:---------------------------------------------------------------:|
| close_on_resize | true/false | Sets if the contextmenu is closed, when the window is resized |
| close_on_click | true/false | Sets if the contextmenu is closed, when the window is clicked |
| default_icon | [string] | Sets the default icon for a menu item (is overridden, when set) |
| default_text | [string] | Sets the default text for a menu item (is overridden, when set) |
| sub_icon | [string] | Sets the arrow icon for sub menus |
| mouse_offset | [integer] | Sets the offset to the mouse, when opened (in pixel) |

## Example
### Code:
```javascript
var menu = new ContextMenu(
  [
    {
      "text": "Item 1",
      "sub": [
        {
          "text": "Item 11"
        },
        {
          "text": "Item 12"
        },
        {
          "type": ContextMenu.DIVIDER
        },
        {
          "text": "Item 13",
          "enabled": false,
          "sub": [
            {
              "text": "Item 131"
            }
          ]
        }
      ]
    },
    {
      "text": "Item 2",
      "icon": '<i class="fas fa-exclamation-circle"></i>',
      "events": {
        "click": function(e){
          alert(e);
        }
      }
    }
  ]
);
```

### Output:

![contextmenuJs example](demo/example.gif)
