/* CoffeeBeans - Admin Launcher
   File: js/admin-init.js
*/
(function (g) {
    'use strict';
    if (g.document) {
        var startAdmin = function () {
            if (g.CBA && typeof g.CBA.init === 'function') {
                g.CBA.init();
            }
        };
        if (g.document.readyState === 'loading') {
            g.document.addEventListener('DOMContentLoaded', startAdmin);
        } else {
            startAdmin();
        }
    }
})(typeof window !== 'undefined' ? window : globalThis);
