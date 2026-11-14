(function () {
  'use strict';

  var STORAGE_KEY = 'tilda_bvi_config';

  var DEFAULT_CONFIG = {
    active: false,
    fontSize: 'normal',
    theme: 'white',
    images: 'on',
    fontFamily: 'sans',
    spacing: 'normal',
    lineHeight: 'normal',
    speech: false
  };

  function loadConfig() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        var parsed = JSON.parse(saved);
        return Object.assign({}, DEFAULT_CONFIG, parsed);
      }
    } catch (e) {}
    return Object.assign({}, DEFAULT_CONFIG);
  }

  function saveConfig(cfg) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
    } catch (e) {}
  }

  var config = loadConfig();

  function applyClasses() {
    var root = document.documentElement;
    if (config.active) {
      root.classList.add('bvi-active');
    } else {
      root.classList.remove('bvi-active');
      return;
    }

    var toRemove = [];
    for (var i = 0; i < root.classList.length; i++) {
      var c = root.classList[i];
      if (c.indexOf('bvi-font-') === 0 ||
          c.indexOf('bvi-theme-') === 0 ||
          c.indexOf('bvi-images-') === 0 ||
          c.indexOf('bvi-family-') === 0 ||
          c.indexOf('bvi-spacing-') === 0 ||
          c.indexOf('bvi-line-') === 0) {
        toRemove.push(c);
      }
    }
    toRemove.forEach(function (c) { root.classList.remove(c); });

    root.classList.add('bvi-font-' + config.fontSize);
    root.classList.add('bvi-theme-' + config.theme);
    root.classList.add('bvi-images-' + config.images);
    root.classList.add('bvi-family-' + config.fontFamily);
    root.classList.add('bvi-spacing-' + config.spacing);
    root.classList.add('bvi-line-' + config.lineHeight);

    updatePanelButtons();
  }

  if (config.active) {
    document.documentElement.classList.add('bvi-active');
    document.documentElement.classList.add('bvi-font-' + config.fontSize);
    document.documentElement.classList.add('bvi-theme-' + config.theme);
    document.documentElement.classList.add('bvi-images-' + config.images);
    document.documentElement.classList.add('bvi-family-' + config.fontFamily);
    document.documentElement.classList.add('bvi-spacing-' + config.spacing);
    document.documentElement.classList.add('bvi-line-' + config.lineHeight);
  }

  function initDOM() {
    if (document.getElementById('bvi-panel')) return;

    // Плавающая кнопка переключения
    var trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'bvi-trigger-btn';
    trigger.setAttribute('aria-label', 'Включить версию сайта для слабовидящих');
    trigger.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg><span>Версия для слабовидящих</span>';
    trigger.addEventListener('click', function () {
      config.active = true;
      saveConfig(config);
      applyClasses();
    });
    document.body.appendChild(trigger);

    // Панель настроек
    var panel = document.createElement('div');
    panel.id = 'bvi-panel';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', 'Панель настроек доступности для слабовидящих');
    panel.innerHTML = [
      '<div class="bvi-panel-inner">',
      '  <div class="bvi-group" role="group" aria-label="Размер шрифта">',
      '    <span class="bvi-label">Шрифт:</span>',
      '    <button type="button" class="bvi-btn" data-bvi-set="fontSize" data-bvi-val="normal" title="Стандартный размер">А</button>',
      '    <button type="button" class="bvi-btn" data-bvi-set="fontSize" data-bvi-val="medium" title="Увеличенный размер (120%)" style="font-size:16px;">А+</button>',
      '    <button type="button" class="bvi-btn" data-bvi-set="fontSize" data-bvi-val="large" title="Большой размер (140%)" style="font-size:19px;">А++</button>',
      '  </div>',
      '  <div class="bvi-group" role="group" aria-label="Цветовая схема">',
      '    <span class="bvi-label">Цвет:</span>',
      '    <button type="button" class="bvi-btn bvi-theme-btn bvi-theme-btn-white" data-bvi-set="theme" data-bvi-val="white" title="Черным по белому">Ц</button>',
      '    <button type="button" class="bvi-btn bvi-theme-btn bvi-theme-btn-black" data-bvi-set="theme" data-bvi-val="black" title="Белым по черному">Ц</button>',
      '    <button type="button" class="bvi-btn bvi-theme-btn bvi-theme-btn-blue" data-bvi-set="theme" data-bvi-val="blue" title="Темно-синим по голубому">Ц</button>',
      '    <button type="button" class="bvi-btn bvi-theme-btn bvi-theme-btn-beige" data-bvi-set="theme" data-bvi-val="beige" title="Коричневым по бежевому">Ц</button>',
      '    <button type="button" class="bvi-btn bvi-theme-btn bvi-theme-btn-yellow" data-bvi-set="theme" data-bvi-val="yellow" title="Черным по желтому">Ц</button>',
      '  </div>',
      '  <div class="bvi-group" role="group" aria-label="Изображения">',
      '    <span class="bvi-label">Картинки:</span>',
      '    <button type="button" class="bvi-btn" data-bvi-set="images" data-bvi-val="on" title="Цветные изображения">Вкл</button>',
      '    <button type="button" class="bvi-btn" data-bvi-set="images" data-bvi-val="grayscale" title="Черно-белые изображения">Ч/Б</button>',
      '    <button type="button" class="bvi-btn" data-bvi-set="images" data-bvi-val="off" title="Выключить изображения">Выкл</button>',
      '  </div>',
      '  <div class="bvi-group" role="group" aria-label="Гарнитура шрифта">',
      '    <span class="bvi-label">Гарнитура:</span>',
      '    <button type="button" class="bvi-btn" data-bvi-set="fontFamily" data-bvi-val="sans" title="Без засечек (Arial)">Без засечек</button>',
      '    <button type="button" class="bvi-btn" data-bvi-set="fontFamily" data-bvi-val="serif" title="С засечками (Times New Roman)">С засечками</button>',
      '  </div>',
      '  <div class="bvi-group" role="group" aria-label="Межстрочный интервал">',
      '    <span class="bvi-label">Интервал:</span>',
      '    <button type="button" class="bvi-btn" data-bvi-set="lineHeight" data-bvi-val="normal" title="Стандартный интервал">1.4x</button>',
      '    <button type="button" class="bvi-btn" data-bvi-set="lineHeight" data-bvi-val="medium" title="Средний интервал">1.7x</button>',
      '    <button type="button" class="bvi-btn" data-bvi-set="lineHeight" data-bvi-val="large" title="Большой интервал">2.0x</button>',
      '  </div>',
      '  <div class="bvi-group" role="group" aria-label="Межбуквенный интервал">',
      '    <span class="bvi-label">Кернинг:</span>',
      '    <button type="button" class="bvi-btn" data-bvi-set="spacing" data-bvi-val="normal" title="Стандартный">Стандарт</button>',
      '    <button type="button" class="bvi-btn" data-bvi-set="spacing" data-bvi-val="medium" title="Средний">+1px</button>',
      '    <button type="button" class="bvi-btn" data-bvi-set="spacing" data-bvi-val="large" title="Большой">+2px</button>',
      '  </div>',
      '  <div class="bvi-group" role="group" aria-label="Синтезатор речи">',
      '    <button type="button" class="bvi-btn" id="bvi-speech-toggle" title="Озвучивать текст при клике или выделении">🔊 Голос: <span id="bvi-speech-status">Выкл</span></button>',
      '  </div>',
      '  <div class="bvi-group">',
      '    <button type="button" class="bvi-btn bvi-btn-close" id="bvi-close-btn" title="Вернуться к обычной версии сайта">Обычная версия сайта</button>',
      '  </div>',
      '</div>'
    ].join('\n');

    document.body.insertBefore(panel, document.body.firstChild);

    var speechInd = document.createElement('div');
    speechInd.id = 'bvi-speech-indicator';
    speechInd.innerHTML = '<span>🔊 Идет чтение текста...</span><button type="button" id="bvi-speech-stop">Остановить</button>';
    document.body.appendChild(speechInd);

    panel.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-bvi-set]');
      if (btn) {
        var prop = btn.getAttribute('data-bvi-set');
        var val = btn.getAttribute('data-bvi-val');
        config[prop] = val;
        saveConfig(config);
        applyClasses();
        return;
      }

      if (e.target.closest('#bvi-close-btn')) {
        config.active = false;
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        saveConfig(config);
        applyClasses();
        return;
      }

      if (e.target.closest('#bvi-speech-toggle')) {
        config.speech = !config.speech;
        if (!config.speech && window.speechSynthesis) {
          window.speechSynthesis.cancel();
          speechInd.style.display = 'none';
        }
        saveConfig(config);
        updatePanelButtons();
        return;
      }
    });

    document.getElementById('bvi-speech-stop').addEventListener('click', function () {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      speechInd.style.display = 'none';
      clearSpeechHighlight();
    });

    // Поддержка ссылок #bvi
    document.addEventListener('click', function (e) {
      var customLink = e.target.closest('[href="#bvi"], .bvi-open, [data-bvi-open]');
      if (customLink) {
        e.preventDefault();
        config.active = true;
        saveConfig(config);
        applyClasses();
        return;
      }

      if (!config.active || !config.speech) return;
      if (e.target.closest('#bvi-panel') || e.target.closest('#bvi-speech-indicator')) return;

      var text = '';
      var selection = window.getSelection ? window.getSelection().toString().trim() : '';
      var targetEl = e.target;

      if (selection) {
        text = selection;
      } else {
        var el = e.target.closest('p, h1, h2, h3, h4, h5, h6, li, .t-title, .t-descr, .t-text, .tn-atom, button, a');
        if (el) {
          text = el.innerText ? el.innerText.trim() : '';
          targetEl = el;
        }
      }

      if (text && window.speechSynthesis) {
        speakText(text, targetEl);
      }
    });

    updatePanelButtons();
  }

  function clearSpeechHighlight() {
    var prev = document.querySelectorAll('.bvi-speech-highlight');
    for (var i = 0; i < prev.length; i++) {
      prev[i].classList.remove('bvi-speech-highlight');
    }
  }

  function speakText(text, el) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    clearSpeechHighlight();

    if (el && el.classList) {
      el.classList.add('bvi-speech-highlight');
    }

    var ind = document.getElementById('bvi-speech-indicator');
    if (ind) ind.style.display = 'flex';

    var utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ru-RU';
    utter.rate = 1.0;
    utter.onend = function () {
      if (ind) ind.style.display = 'none';
      clearSpeechHighlight();
    };
    utter.onerror = function () {
      if (ind) ind.style.display = 'none';
      clearSpeechHighlight();
    };

    window.speechSynthesis.speak(utter);
  }

  function updatePanelButtons() {
    var panel = document.getElementById('bvi-panel');
    if (!panel) return;

    var buttons = panel.querySelectorAll('[data-bvi-set]');
    for (var i = 0; i < buttons.length; i++) {
      var b = buttons[i];
      var prop = b.getAttribute('data-bvi-set');
      var val = b.getAttribute('data-bvi-val');
      if (config[prop] === val) {
        b.classList.add('bvi-active');
      } else {
        b.classList.remove('bvi-active');
      }
    }

    var speechStatus = document.getElementById('bvi-speech-status');
    var speechToggle = document.getElementById('bvi-speech-toggle');
    if (speechStatus && speechToggle) {
      speechStatus.textContent = config.speech ? 'Вкл' : 'Выкл';
      if (config.speech) {
        speechToggle.classList.add('bvi-active');
      } else {
        speechToggle.classList.remove('bvi-active');
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDOM);
  } else {
    initDOM();
  }
})();