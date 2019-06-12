/*!
Vanilla Javascript mask plugin to input form elements
Author: Silvio Delgado - www.interart.com
License: MIT
https://github.com/silviodelgado/maskerjs
*/
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory(root));
    } else if (typeof exports === 'object') {
        module.exports = factory(root);
    } else {
        root.masker = factory(root);
    }
})(typeof global !== "undefined" ? global : this.window || this.global, function (root) {
    'use strict';

    String.prototype.replaceAll = function (find, replace) {
        var str = this;
        while (str.match(find)) {
            str = str.replace(find, replace);
        }
        return str;
    }

    const masks = {
        cpf(target) {
            return target.value
                .replace(/\D/g, '')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})/, '$1-$2')
                .replace(/(-\d{2})\d+?$/, '$1');
        },
        cnpj(target) {
            return target.value
                .replace(/\D/g, '')
                .replace(/(\d{2})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,4})/, '$1/$2')
                .replace(/(\/\d{4})(\d{1,2})/, '$1-$2')
                .replace(/(-\d{2})\d+?$/, '$1');
        },
        cep(target) {
            return target.value
                .replace(/\D/g, '')
                .replace(/(\d{5})(\d)/, '$1-$2')
                .replace(/(-\d{3})\d+?$/, '$1');
        },
        phone(target) {
            var value = target.value.replace(/\D/g, '');
            return value
                .replace(/(\d{1,2})/, '($1')
                .replace(/(\d{2})/, '$1) ')
                .replace(/(\d{4})(\d{1,4})/, '$1-$2')
                .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
                .replace(/(-\d{4})\d+?$/, '$1');
        },
        date(target) {
            return target.value
                .replace(/\D/g, '')
                .replace(/(\d{2})(\d)/, '$1/$2')
                .replace(/(\d{2})(\d{1,4})/, '$1/$2')
                .replace(/(\/\d{4})\d+?$/, '$1');
        },
        datetime(target) {
            return target.value
                .replace(/\D/g, '')
                .replace(/(\d{2})(\d)/, '$1/$2')
                .replace(/(\d{2})(\d{1,4})/, '$1/$2')
                .replace(/(\d{4})(\d{1,2})/, '$1 $2')
                .replace(/(\d{4}) (\d{2})(\d{1,2})/, '$1 $2:$3')
                .replace(/(\:\d{2})\d+?$/, '$1');
        },
        time(target) {
            return target.value
                .replace(/\D/g, '')
                .replace(/(\d{2})(\d)/, '$1:$2')
                .replace(/(\:\d{2})\d+?$/, '$1');
        },
        money(target) {
            var culture = target.dataset.culture || 'us';
            var value = target.value.replace(/\D/g, '');
            switch (culture) {
                case 'pt-br':
                    value = value
                        .replace(/(\d{1, 2})$/, '$1')
                        .replace(/(\d+)(\d{2})/, '$1,$2')
                        .replaceAll(/(\d+)(\d{3})/, '$1.$2');
                    break;
                default:
                    value = value
                        .replace(/(\d{1, 2})$/, '$1')
                        .replace(/(\d+)(\d{2})/, '$1.$2')
                        .replaceAll(/(\d+)(\d{3})/, '$1,$2');
                    break;
            }
            return value;
        }
    }

    var init_component = function () {
        document.querySelectorAll('input').forEach(($elem) => {
            if (!$elem.dataset.mask)
                return false;
            $elem.value = masks[$elem.dataset.mask] ? masks[$elem.dataset.mask]($elem) : $elem.value;
            $elem.addEventListener('input', (e) => {
                e.target.value = masks[$elem.dataset.mask](e.target);
            });
        });
    }

    return {
        init: init_component
    }

});