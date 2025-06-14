// used variable
let so_waitingRoll = false

Hooks.once("init", function () {
  const namespace = "streamoverlay";

  game.socket.on("any", console.log);

  game.settings.register(namespace, "displayTime", {
    scope: "world",
    config: false,
    type: Number,
    default: 10,
  });

  game.settings.register(namespace, "htmlEditor", {
    scope: "world",
    config: false,
    type: String,
    default:
      `<div class="notif">
    <div class="actor-name">{actorname}</div>
    <div class="dice">
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        <polygon points="50,5 88.97,27.5 88.97,72.5 50,95 11.03,72.5 11.03,27.5" />
      </svg>
        <div class="dice-number">{roll_result}</div>
    </div>
    <div class="flavor">{flavor}</div>
    <div class="formula">{roll_formula}</div>
</div>`,
  });

  game.settings.register(namespace, "cssEditor", {
    scope: "world",
    config: false,
    type: String,
    default: 
    `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap');

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
}

@keyframes diceRoll {
    0% {
      transform: translate(0, 0) rotate(0deg);
    }
    10% {
      transform: translate(-3px, 2px) rotate(10deg);
    }
    20% {
      transform: translate(2px, -2px) rotate(-10deg);
    }
    30% {
      transform: translate(-2px, 3px) rotate(15deg);
    }
    40% {
      transform: translate(3px, -3px) rotate(-15deg);
    }
    50% {
      transform: translate(-2px, 2px) rotate(10deg);
    }
    60% {
      transform: translate(2px, -2px) rotate(-10deg);
    }
    70% {
      transform: translate(0, 0) rotate(0deg);
    }
    100% {
      transform: translate(0, 0) rotate(0deg);
    }
  }

body {
    margin: 0;
    padding: 0;
    height: 100vh;
    background-color: #00b140;
    color: #ffcc66;
    font-family: 'Cinzel', serif;
    display: flex;
    justify-content: center;
    align-items: center;
}

.notif {
    min-width: 240px;
    max-width: 240px;
    border: 4px solid #d88a2b;
    border-radius: 12px;
    padding: 40px 50px;
    margin-top: 25px;
    position: relative;
    box-shadow: 0 0 20px #d88a2b;
    background: #0d0d0d;
    opacity: 0;
    animation: fadeIn 0.5s forwards;
    transition: opacity 0.5s ease-in-out;
}

.notif.fade-out {
    animation: fadeOut 0.5s forwards;
}

.notif::before {
    top: -10px;
    left: -10px;
    border-right: none;
    border-bottom: none;
}

.notif::after {
    bottom: -10px;
    right: -10px;
    border-left: none;
    border-top: none;
}

.dice {
    width: 140px;
    height: 140px;
    margin: 0 auto;
    margin-top: 15px;
    position: relative;
    animation: diceRoll 0.5s forwards;
}

.dice svg {
    width: 100%;
    height: 100%;
    fill: #8a2f06;
    stroke: #d88a2b;
    stroke-width: 4;
    filter: drop-shadow(0 0 10px #ffae42);
}

.dice-number {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 48px;
    font-weight: bold;
    color: #ffcc66;
    text-shadow: 0 0 10px #ffae42;
}

.actor-name {
    position: absolute;
    top: 7%;
    left: 50%;
    width: 100%;
    margin-top: 10px;
    text-align: center;
    transform: translate(-50%, -50%);
    font-size: 22px;
    color: #ffcc66;
    text-shadow: 0 0 10px #ffae42;
}

.formula {
    position: absolute;
    top: 92%;
    left: 50%;
    width: 100%;
    text-align: center;
    transform: translate(-50%, -50%);
    font-size: 16px;
    color: #ffcc66;
    text-shadow: 0 0 10px #ffae42;
}

.flavor {
    text-align: center;
    font-size: 22px;
    margin-top: 20px;
    text-shadow: 0 0 8px #ffae42;
    border-top: 1px solid #ffae42;
    padding-top: 10px;
}`,
  });

  game.settings.registerMenu(namespace, "linkGenerator", {
    name: game.i18n.localize(`${namespace}.settings.linkGenerator.name`),
    label: game.i18n.localize(`${namespace}.settings.linkGenerator.label`),
    hint: game.i18n.localize(`${namespace}.settings.linkGenerator.hint`),
    icon: "far fa-file-code",
    type: so_LinkGenerator,
    restricted: true,
  });
});

/**
 * @description settings window that includes 2 ace editors
 *
 * @class LinkGenerator
 * @extends {Application}
 */
class so_LinkGenerator extends FormApplication {
  constructor(object = {}, options = {}) {
    super(object, options);
    this.editorArray = {};
  }
  initEditorHtml() {
    const css = game.settings.get("streamoverlay", "cssEditor");
    const html = game.settings.get("streamoverlay", "htmlEditor");

    this.createEditor("cssEditor", "ace/mode/css", css);
    this.createEditor("htmlEditor", "ace/mode/html", html);

    var displayTimeField = document.getElementById("so_displaytime");
    displayTimeField.value = game.settings.get("streamoverlay", "displayTime");
  }
  createEditor(name, mode, initialValue) {
    this.editorArray[name] = ace.edit(name);
    this.editorArray[name].setOptions(mergeObject(ace.userSettings, {mode: mode,}));
    this.editorArray[name].setOptions({
      fontSize: "12px"
    });
    this.editorArray[name].setOption("indentedSoftWrap", false);

    this.editorArray[name].setValue(initialValue, -1);

    new ResizeObserver(() => {
      this.editorArray[name].resize();
      this.editorArray[name].renderer.updateFull();
    }).observe(this.editorArray[name].container);
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "link-generator",
      title: game.i18n.localize("streamoverlay.windows.LinkGenerator.title"),
      template: "modules/crithappensstream/templates/linkGenerator.html",
      classes: ["sheet"],
      closeOnSubmit: true,
      resizable: true,
      width: 1200,
      height: 800,
    });
  }
  /** @param {JQuery} html */
  activateListeners(html) {
    super.activateListeners(html);

    // inserts ace editors into html
    this.initEditorHtml();

    function so_changeDisplay($el) {
      if ($el.classList.contains("so_is-hidden")) $el.classList.remove("so_is-hidden");
      else $el.classList.add("so_is-hidden");
    }

    // Add a click event on buttons to extend the list
    (document.querySelectorAll(".so_collapsible") || []).forEach(($trigger) => {
      const list = $trigger.dataset.target;
      const $target = document.getElementById(list);
      $trigger.addEventListener("click", () => {so_changeDisplay($target);});
    });
  }
  getData(options) {
    const data = super.getData(options);
    data.actors = this.actors;
    data.users = this.users;
    return data;
  }
}
