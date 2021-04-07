// http://i18next.com/docs/
// https://github.com/i18next/jquery-i18next#initialize-the-plugin
// https://github.com/i18next/jquery-i18next#usage-of-selector-function
MobileApp.prototype.initI18next = function () {
    var self = this;
    document.addEventListener("deviceready", function (e) {
        e.preventDefault();
        if (window.Intl && typeof window.Intl === 'object') {
            var saved_locale = localStorage.locale;
            var navigator_language = navigator.language;
            var short_language = shortDeviceLanguage(navigator_language);
            if (saved_locale === navigator_language) {
                nextTranslate(short_language);
            } else {
                nextTranslate(short_language);
                localStorage.locale += navigator_language;
            }
        }
    }, { passive: false });
    $('#lng-prompt-select').change(function () {
        var prompt_selected_language = ($(this).find(':selected').val());
        prompt_selected_language = shortDeviceLanguage(prompt_selected_language);
        localStorage.locale = prompt_selected_language;
        nextTranslate(prompt_selected_language);
    });
    function nextTranslate(selected_language) {
        i18next
            .use(i18nextXHRBackend)
            .init({
                lng: selected_language,
                ns: ['translation'],
                defaultNS: 'translation',
                debug: true,
                fallbackLng: 'en',
                shortcutFunction: 'sprintf',
                backend: {
                    loadPath: 'locales/{{lng}}/string.json'
                },
            }, function () {
                jqueryI18next.init(i18next, $, {});
                $('[data-i18n]').localize();
            });
    }
    function shortDeviceLanguage(language) {
        var short = language.split('-');
        var short_language = short[0];
        return short_language;
    }
};
