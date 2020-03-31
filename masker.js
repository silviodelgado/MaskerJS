/*!
 * MaskerJS v1.0 - Vanilla Javascript mask plugin to input form elements
 * Copyright 2019 Silvio Delgado (https://github.com/silviodelgado)
 * Licensed under MIT (https://opensource.org/licenses/MIT)
 * https://github.com/silviodelgado/maskerjs
*/
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory(root));
    } else if (typeof exports === 'object') {
        module.exports = factory(root);
    } else {
        root.Masker = factory(root);
    }
})(typeof global !== "undefined" ? global : this.window || this.global, function (root) {
    'use strict';

    String.prototype.replaceAll = function (find, replace) {
        let str = this;
        while (str.indexOf(find) >= 0) {
            str = str.replace(find, replace);
        }
        return str;
    };

    const masks = {
        cpf: function (target) {
            return target.value
                .replace(/\D/g, '')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})/, '$1-$2')
                .replace(/(-\d{2})\d+?$/, '$1');
        },
        cnpj: function (target) {
            return target.value
                .replace(/\D/g, '')
                .replace(/(\d{2})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,4})/, '$1/$2')
                .replace(/(\/\d{4})(\d{1,2})/, '$1-$2')
                .replace(/(-\d{2})\d+?$/, '$1');
        },
        cpf_cnpj: function (target) {
            if (target.value.length <= 14) {
                return masks.cpf(target);
            }
            return masks.cnpj(target);
        },
        cep: function (target) {
            return target.value
                .replace(/\D/g, '')
                .replace(/(\d{5})(\d)/, '$1-$2')
                .replace(/(-\d{3})\d+?$/, '$1');
        },
        phone: function (target) {
            return target.value.replace(/\D/g, '')
                .replace(/(\d{1,2})/, '($1')
                .replace(/(\d{2})/, '$1) ')
                .replace(/(\d{4})(\d{1,4})/, '$1-$2')
                .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
                .replace(/(-\d{4})\d+?$/, '$1');
        },
        date: function (target) {
            return target.value
                .replace(/\D/g, '')
                .replace(/(\d{2})(\d)/, '$1/$2')
                .replace(/(\d{2})(\d{1,4})/, '$1/$2')
                .replace(/(\/\d{4})\d+?$/, '$1');
        },
        datetime: function (target) {
            return target.value
                .replace(/\D/g, '')
                .replace(/(\d{2})(\d)/, '$1/$2')
                .replace(/(\d{2})(\d{1,4})/, '$1/$2')
                .replace(/(\d{4})(\d{1,2})/, '$1 $2')
                .replace(/(\d{4}) (\d{2})(\d{1,2})/, '$1 $2:$3')
                .replace(/(\:\d{2})\d+?$/, '$1');
        },
        year_month: function (target) {
            return target.value
                .replace(/\D/g, '')
                .replace(/(\d{4})(\d)/, '$1/$2')
                .replace(/(\/\d{2})\d+?$/, '$1');
        },
        month_year: function (target) {
            return target.value
                .replace(/\D/g, '')
                .replace(/(\d{2})(\d)/, '$1-$2')
                .replace(/(\-\d{4})\d+?$/, '$1');
        },
        time: function (target) {
            return target.value
                .replace(/\D/g, '')
                .replace(/(\d{2})(\d)/, '$1:$2')
                .replace(/(\:\d{2})\d+?$/, '$1');
        },
        money: function (target) {
            let culture = target.dataset.culture || 'en-us';
            let firstTime = !(target.dataset.masked || false);
            if (firstTime) {
                document.querySelector('#' + target.id).setAttribute('maxlength', 18);
            }
            let value = target.value;
            switch (culture.toLowerCase()) {
                case 'pt-br':
                    value = (firstTime
                        ? parseFloat(value).toFixed(2).toString()
                        : value.replaceAll('.', '').replace(',', '.'))
                        .replace(/\D/g, '')
                        .replace(/(\d{1, 2})$/, '$1')
                        .replace(/(\d+)(\d{2})/, '$1,$2')
                        .replace(/(\d+)(\d{3})/, '$1.$2')
                        .replace(/(\d+)(\d{3})/, '$1.$2')
                        .replace(/(\d+)(\d{3})/, '$1.$2')
                        .replace(/(\d+)(\d{3})/, '$1.$2');
                    break;
                default:
                    value = (firstTime
                        ? parseFloat(value).toFixed(2).toString()
                        : value.replace(',', '.'))
                        .replace(/\D/g, '')
                        .replace(/(\d{1, 2})$/, '$1')
                        .replace(/(\d+)(\d{2})/, '$1.$2')
                        .replace(/(\d+)(\d{3})/, '$1,$2')
                        .replace(/(\d+)(\d{3})/, '$1,$2')
                        .replace(/(\d+)(\d{3})/, '$1,$2')
                        .replace(/(\d+)(\d{3})/, '$1,$2');
                    break;
            }
            target.dataset.masked = true;
            return value;
        },
        ccard: function (target) {
            return target.value
                .replace(/\D/g, '')
                .replace(/(\d{4})(\d)/, '$1 $2')
                .replace(/( \d{4})(\d)/, '$1 $2')
                .replace(/( \d{4})(\d)/, '$1 $2')
                .replace(/( \d{4})(\d+?$)/, '$1 $2');
        },
        number: function (target) {
            return target.value
                .replace(/\D/g, '');
        },
        float: function (target) {
            return target.value
                .replace(/[^0-9.,]/g, '')
        },
        percent: function (target) {
            let culture = target.dataset.culture || 'en-us';
            let firstTime = !(target.dataset.masked || false);
            if (firstTime) {
                document.querySelector('#' + target.id).setAttribute('maxlength', 6);
            }
            let value = target.value;
            switch (culture.toLowerCase()) {
                case 'pt-br':
                    value = (firstTime
                        ? parseFloat(value).toFixed(2).toString()
                        : value.replace(',', '.'))
                        .replace(/\D/g, '')
                        .replace(/(\d{1, 2})$/, '$1')
                        .replace(/(\d{1,3})(\d{2})/, '$1,$2');
                    break;
                default:
                    value = (firstTime
                        ? parseFloat(value).toFixed(2).toString()
                        : value)
                        .replace(/\D/g, '')
                        .replace(/(\d{1, 2})$/, '$1')
                        .replace(/(\d{1,3})(\d{2})/, '$1.$2');
                    break;
            }
            target.dataset.masked = true;
            return value;
        }
    };

    var init_component = function () {
        document.querySelectorAll('input').forEach(($elem) => {
            if (!$elem.dataset.mask)
                return false;
            $elem.value = masks[$elem.dataset.mask] ? masks[$elem.dataset.mask]($elem) : $elem.value;
            $elem.addEventListener('input', (e) => {
                e.target.value = masks[$elem.dataset.mask](e.target);
            });
        });
    };

    return {
        init: init_component
    };

});