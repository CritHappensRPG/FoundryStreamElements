# Stream Overlay

This module adds the ability to capture dice rolls in OBS (or any streaming software) from Foundry VTT for you to use on your stream.

## Installation

To install, import this [Manifest](https://github.com/CritHappensRPG/FoundryStreamElements/releases/download/1.0.0/module.json) into your module browser.

## Usage

### Custom Overlay

> Provide an overlay to display rolls in a customizable maner

1. Subscribe to <https://www.youtube.com/@CritHappensRPG>

2. To start, open Settings, select Stream Overlay from the module list

3. Modify the CSS and/or HTML

4. Click the `Save` button to save the modifications

5. Copy the link at the bottom of the dialog

6. Create a `Browser Source` on `OBS` (or any streaming software that support browser sources)

7. Enjoy!

There are multiple settings :

| Name | Description |
|------|-------------|
| One roll at a time | Only one roll will be displayed at a time, the overlay will wait the disappearing of a roll to display the next one. |
| Roll display time | Define the roll appearance duration  |
| Custom CSS | Apply a style for only one page. If not set, global style will be used. If set, both the global one and the cusom one will be used |
| Custom HTML | Apply a temlpate for only one page. If not set, global temlpate will be used, If set, only the custom one will be used |

Other infos :

- The link will always be available as long as Foundry is currently running.

### Global styling and templating

> Provide a way to dynamically edit the style and template used for the overlays

| Name | Description |
|------|-------------|
| Custom CSS | Define the style for the overlays |
| Custom HTML | Define the template for the overlays |

### HTML Templating and CSS Styling

- Template :

You can define the layout to use to display a roll, you may use the provided variables. Any occurence of the variable will be replaced. The variable name should be put between `{` and `}` without spaces. The available variables are `username`, `actorname`, `roll_result`, `roll_formula`, `flavor`


- Style :

You can define the style to use on the template.

- Exemple 1 - basic overlay :

Template

```html
<div class="box">
    <div class="header">{username}</div>
    <div class="content">{roll_result}</div>
</div>
```
 
Style

```css
.box{
    color: black;
    margin: 3px;
    padding: 5px;
    background-color: #E0DFD5;
    border: 2px solid #6F6C66;
    border-radius: 5px;
}
.content{
    text-align: center;
    background: rgba(0,0,0,0.1);
    border: 1px solid #999;
    border-radius: 3px;
}
```

- Exemple 2 - specific color for an user :

Template

```html
<div class="box">
    <div class="header {username}">{username}</div>
    <div class="content">{roll_result}</div>
</div>
```
 
Style, replace `user1` with the name of the user

```css
.user1{
    color: red;
}
.box{
    color: black;
    margin: 3px;
    padding: 5px;
    background-color: #E0DFD5;
    border: 2px solid #6F6C66;
    border-radius: 5px;
}
.content{
    text-align: center;
    background: rgba(0,0,0,0.1);
    border: 1px solid #999;
    border-radius: 3px;
}
```

## Feature Requests

If there is anything related to this module that you want or that might be usefull, feel free to create a feature request or message me on Discord!
