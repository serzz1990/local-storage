/**
 * Класс для хранения информации пользователя на локальном компьютере
 *
 * @module local-storage
 */

(function () {

	'use strict';

	var _private = {};


	/**
	 * @constructor
	 */
	function LocalStorage() {

		throw new Error('Can\'t create instance of static class LocalStorage');

	}


	/**
	 * Префикс для ключей в localStorage
	 *
	 * @access private
	 * @type {string}
	 */
	_private.lacalStoragePrefix = 'storage:';


	/**
	 * Получает текущее время
	 *
	 * @access private
	 *
	 * @return {Number} - объект даты
	 */
	_private.getTime = function () {

		return (new Date()).getTime();

	};


	/**
	 * Проверяет ключ на валидность
	 *
	 * @access private
	 *
	 * @param {String} key - Ключ для запроса в localStorage
	 *
	 * @returns {Boolean}
	 */
	_private.validateKey = function (key) {

		return (key && key.constructor === String && key.split(':').length > 1);

	};


	/**
	 * Парсит JSON
	 *
	 * @access private
	 *
	 * @param {String} data - Данные из localStorage
	 *
	 * @returns {*}
	 *
	 */
	_private.parseData = function (data){

		try {

			return JSON.parse( data );

		} catch (e) {

			return data;

		}

	};


	/**
	 * Готовит данные для записи в localStorage
	 *
	 * @access private
	 *
	 * @param {*} data - Даные для записи
	 *
	 * @returns {String}
	 *
	 */
	_private.stringifyData = function (data){

		return (JSON.stringify({
			date : (new Date()).toString(),
			time : _private.getTime(),
			data : data
		}));

	};

	/**
	 * Сообщает об ошибке
	 *
	 * @access private
	 *
	 * @returns {Undefined}
	 *
	 */
	_private.error = function(){

		var args = Array.prototype.slice.call(arguments);

		console.error( args.join(' | ') );

	};


	/**
	 * Проверяет поддержку localStorage
	 *
	 * @access private
	 *
	 * @returns {boolean}
	 */
	LocalStorage.isSupported = function(){

		return (typeof Storage !== 'undefined');

	};


	/**
	 * Получает все данные([time,date,data]) из локального хранилища по ключу
	 *
	 * @access public
	 *
	 * @param {String} key - название ключа
	 * @param {Boolean} global - поиск от глобального объекта
	 *
	 * @return {Object}
	 *
	 */
	LocalStorage.getInstance = function (key, global) {

		if (!_private.validateKey(key) && !global) {

			_private.error('Invalid key', key);
			return null;

		}

		return _private.parseData( localStorage.getItem( (global?'':_private.lacalStoragePrefix) + key ) );

	};


	/**
	 * Получает только данные из локального хранилища по ключу
	 *
	 * @access public
	 *
	 * @param {String} key - название ключа
	 * @param {Boolean} global - поиск от глобального объекта
	 *
	 * @return {Object}
	 *
	 */
	LocalStorage.get = function (key, global) {

		if (!_private.validateKey(key) && !global) {

			_private.error('Invalid key', key);
			return null;

		}

		var res = _private.parseData( localStorage.getItem( (global?'':_private.lacalStoragePrefix) + key ) );
		return res && (res.data||null);

	};


	/**
	 * Получает данные и проверяет время хранения
	 *
	 * @access public
	 *
	 * @param {String} key - название ключа
	 * @param {Number|String} timeLife - Время хранения данных ( 1d - один день | 10m - 10 минут ) default seconds
	 *
	 * @return {Object}
	 *
	 */
	LocalStorage.getCheckTime = function (key , timeLife) {

		if (!_private.validateKey( key )) {

			_private.error('Invalid key', key);
			return null;

		}

		var res = _private.parseData( localStorage.getItem( _private.lacalStoragePrefix + key )),
			time = parseFloat( timeLife );

		if (!res) {

			return null;

		}

		switch (true) {
			case timeLife.search(/m/) > 0:
				time *= 60;
				break;
			case timeLife.search(/h/) > 0 :
				time *= 60 * 60;
				break;
			case timeLife.search(/d/) > 0 :
				time *= 60 * 60 * 24;
				break;
		}

		if ( _private.getTime() - res.time > time * 1000 ){

			this.remove( key );
			return null;

		}

		return res && (res.data||null);

	};


	/**
	 * Записывает данные в локальное хранилище
	 *
	 * @access public
	 *
	 * @param {String} key - название ключа
	 * @param {*} data - Данные
	 *
	 * @return {LocalStorage}
	 */
	LocalStorage.set = function (key , data) {

		if(!_private.validateKey(key)){
			_private.error('Invalid key', key);
			return this;
		}

		localStorage.setItem(_private.lacalStoragePrefix + key, _private.stringifyData(data));

		return this;

	};


	/**
	 * Получает все данные в зоне ключа
	 *
	 * @access public
	 *
	 * @param {String} keyZone - зона ключа
	 *
	 * @return {Array}
	 */
	LocalStorage.dump = function (keyZone) {

		var data = [],
			expr = new RegExp( '^' + _private.lacalStoragePrefix + (keyZone || '') , 'i');

		for ( var key in localStorage ){

			if (localStorage.hasOwnProperty(key) && key.match(expr)) {

				data.push({
					key: key,
					dada: this.get(key, true)
				});

			}

		}

		return data;

	};


	/**
	 * Проверяет наличие данных по ключу
	 *
	 * @access public
	 *
	 * @param {String} key - название ключа
	 *
	 * @return {Boolean}
	 */
	LocalStorage.has = function (key) {

		if (!_private.validateKey(key)) {

			_private.error('Invalid key', key);
			return false;

		}

		return (localStorage.getItem(_private.lacalStoragePrefix + key)) ? true : false;

	};


	/**
	 * Удалят данные по ключу
	 *
	 * @access public
	 *
	 * @param {String} key - название ключа
	 *
	 * @return {Boolean|LocalStorage}
	 */
	LocalStorage.remove = function (key) {

		if (!_private.validateKey(key)) {

			_private.error('Invalid key', key);
			return this;

		}

		localStorage.removeItem(_private.lacalStoragePrefix + key);

		return this;

	};


	/**
	 * Удаляет данные в зоне утилиты
	 *
	 * @access public
	 *
	 * @param {String} keyZone - название зоны
	 *
	 * @return {LocalStorage}
	 */
	LocalStorage.clear = function (keyZone) {

		var expr = new RegExp('^' + _private.lacalStoragePrefix + (keyZone || '') , 'i');

		for (var key in localStorage) {

			if(localStorage.hasOwnProperty(key) && key.match(expr)) {

				localStorage.removeItem(key);

			}

		}

		return this;

	};


	/**
	 * Удаляет все данные из локального хранилища
	 *
	 * @access public
	 *
	 * @return {LocalStorage}
	 */
	LocalStorage.clearAll = function () {

		localStorage.clear();

		return this;

	};


	window.LocalStorage = LocalStorage;
	//return LocalStorage;


})();