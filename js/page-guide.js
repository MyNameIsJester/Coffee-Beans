/* CoffeeBeans - View: Guide / Documentation (Hướng dẫn sử dụng)
   File: js/page-guide.js
*/
(function (g) {
    'use strict';
    var CB = (g.CB = g.CB || {});
    CB.views = CB.views || {};

    CB.views.guide = {
        mount: function (root, params) {
            CB.mountTemplate(root, 'tpl-guide');
        },
        unmount: function () {}
    };
})(typeof window !== 'undefined' ? window : globalThis);
