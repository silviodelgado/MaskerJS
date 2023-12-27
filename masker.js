/*!
 * MaskerJS v1.20 - Vanilla Javascript mask plugin to input form elements
 * Copyright 2019-2023 Silvio Delgado (https://github.com/silviodelgado)
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
            let paste = target.value == target.value.replace(/\D/g, '');
            if ((!paste && target.value.length <= 14) || (paste && target.value.length == 11)) {
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
                .replace(/\((\d{2})(\d{1})/, '($1) $2')
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
            if (target.value.length > 7) return target.value.substring(0, 7);
            return target.value
                .replace(/\D/g, '')
                .replace(/(\d{4})(\d)/, '$1/$2')
                .replace(/(\/\d{2})\d+?$/, '$1');
        },
        month_year: function (target) {
            if (target.value.length > 7) return target.value.substring(0, 7);
            return target.value
                .replace(/\D/g, '')
                .replace(/(\d{2})(\d)/, '$1/$2')
                .replace(/\/(\d{4})\d+?$/, '$1');
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
            target.setAttribute('maxlength', 18);
            let value = target.value;
            while (value.length > 0 && (value.substring(0, 1) == '0' || value.substring(0, 1) == '.' || value.substring(0, 1) == ',')) {
                value = value.substring(1);
            }
            if (value.length == 1) {
                value = '0.0' + value;
            } else if (value.length == 2) {
                value = '0.' + value;
            }
            switch (culture.toLowerCase()) {
                case 'pt-br':
                    target.setAttribute('placeholder', '0,00');
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
                    target.setAttribute('placeholder', '0.00');
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
            let result = target.value.replace(/\D/g, '');
            let first = result.length > 0 ? result.substring(0, 1) : '';
            if (first == '') return '';
            switch (first) {
                case '4':
                case '5':
                case '6':
                    target.setAttribute('maxlength', 19);
                    return result
                        .replace(/(\d{4})(\d)/, '$1 $2')
                        .replace(/( \d{4})(\d)/, '$1 $2')
                        .replace(/( \d{4})(\d)/, '$1 $2')
                        .replace(/( \d{4})(\d+?$)/, '$1 $2');
                case '3':
                    let second = result.length > 1 ? result.substring(1, 1) : '';
                    if (second == '') return result;
                    switch (second) {
                        case '6':
                        case '8':
                            target.setAttribute('maxlength', 16);
                            return result
                                .replace(/(\d{4})(\d)/, '$1 $2')
                                .replace(/( \d{6})(\d)/, '$1 $2')
                                .replace(/( \d{4})(\d+?$)/, '$1 $2');
                        case '4':
                        case '7':
                            target.setAttribute('maxlength', 17);
                            return result
                                .replace(/(\d{4})(\d)/, '$1 $2')
                                .replace(/( \d{6})(\d)/, '$1 $2')
                                .replace(/( \d{5})(\d+?$)/, '$1 $2');
                        default:
                            return result;
                    }
                default:
                    return result;
            }

        },
        number: function (target) {
            return target.value
                .replace(/\D/g, '');
        },
        float: function (target) {
            return target.value
                .replace(/[^\-0-9.,]/g, '')
        },
        percent: function (target) {
            let culture = target.dataset.culture || 'en-us';
            let precision = parseInt(target.dataset.precision || '2');
            let firstTime = !(target.dataset.masked || false);
            target.setAttribute('maxlength', (4 + precision));
            let value = target.value;
            while (value.length > 0 && (value.substring(0, 1) == '0' || value.substring(0, 1) == '.' || value.substring(0, 1) == ',')) {
                value = value.substring(1);
            }
            while (value.length > 0 && value.length <= precision) {
                value = '0.' + value.padStart(precision, '0');
            }
            let regex1 = new RegExp('(\\d{1,' + precision + '})$');
            let regex2 = new RegExp('(\\d{1,3})(\\d{' + precision + '})');
            switch (culture.toLowerCase()) {
                case 'pt-br':
                    target.setAttribute('placeholder', '0,' + '0'.padEnd(precision, '0'));
                    value = (firstTime
                        ? parseFloat(value).toFixed(precision).toString()
                        : value.replace(',', '.'))
                        .replace(/\D/g, '')
                        .replace(regex1, '$1')
                        .replace(regex2, '$1,$2');
                    break;
                default:
                    target.setAttribute('placeholder', '0.' + '0'.padEnd(precision, '0'));
                    value = (firstTime
                        ? parseFloat(value).toFixed(precision).toString()
                        : value)
                        .replace(/\D/g, '')
                        .replace(regex1, '$1')
                        .replace(regex2, '$1.$2');
                    break;
            }
            target.dataset.masked = true;
            if (parseFloat(value) > 100) {
                value = value.substring(0, value.length - 1);
            }
            return value;
        }
    };

    const init_component = function () {
        document.querySelectorAll('input[data-mask]').forEach(($elem) => {
            if (!$elem.dataset.mask)
                return false;
            $elem.value = masks[$elem.dataset.mask] ? masks[$elem.dataset.mask]($elem) : $elem.value;
            $elem.addEventListener('input', (e) => {
                if (e.data == null && e.target.value != '') {
                    e.target.value = e.target.value.substring(0, e.target.value.length);
                    return;
                }
                e.target.value = masks[$elem.dataset.mask](e.target);
            });
            $elem.addEventListener('blur', (e) => {
                e.target.value = masks[$elem.dataset.mask](e.target);
            });
            $elem.addEventListener('keyup', (e) => {
                e.target.value = masks[$elem.dataset.mask](e.target);
            });
            $elem.addEventListener('focus', (e) => {
                $elem.select();
            });
        });
    };

    return {
        init: init_component
    };

});