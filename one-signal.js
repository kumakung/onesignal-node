var rest = require('unirest');

var URL_NOTIFCATION = 'https://onesignal.com/api/v1/notifications/';

var os = function(app_id, rest_key) {
	this._app_id = app_id;
	this._rest_key = rest_key;
};

/**
 * This callback is response err / data
 * @callback req-callback
 * @param {object} responseErrors
 * @param {object} responseDatas
 */

os.prototype = {

	/**
	 * auth() helper function to add authorization parameter
	 * @param {unirest} myrest - unirest object
	 * @return {unirest}
	 */

	auth: function(myrest) {
		return myrest
				.header('Authorization', 'Basic ' + this._rest_key)
				.header('Content-Type', 'application/json');
	},

	/**
	 * predata() helper function to create data object
	 * with app_id
	 * @return {object} data object
	 */

	predata: function () {
		return {
			app_id: this._app_id
		};
	},

	/**
	 * createObj() helper function create object with key
	 * @param  {string} propName  - object key
	 * @param  {*} propValue - object value
	 * @return {object}
	 */

	createObj: function (propName, propValue) {
		var boo = {};
		boo[propName] = propValue;

		return boo;
	},

	/**
	 * raw_send() one-signal notification send api
	 * more info : https://documentation.onesignal.com/docs/notifications-create-notification
	 *
	 * @param {string/array} uuids - device target
	 * @param {string} title - content title
	 * @param {string} message - content message
	 * @param {object} params - add-on more parameters
	 * @param {callback} cb - callback that handles reponse
	 */

	raw_send: function(params, cb){
		var data = this.predata();
		for(var k in params)
			data[k] = params[k];

		this.auth(rest.post(URL_NOTIFCATION))
			.send(data)
			.end(cb);
	},

	/**
	 * send() notification to device
	 * need more feature see also raw_send()
	 *
	 * @param {string/array} uuids - device target
	 * @param {string} title - content title
	 * @param {string} message - content message
	 * @param {object} params - add-on more parameters
	 * @param {callback} cb - callback that handles reponse
	 */

	send: function(uuids, title, message, params, cb) {
		var data = this.predata();

		// prepare data
		data.headings	= this.createObj('en', title);
		data.contents	= this.createObj('en', message);
		data.data		= params;

		// target or broadcast
		if(uuids !== null)
			data.include_player_ids	= (typeof uuids === 'string')? [uuids] : uuids;
		else
			data.included_segments = ['All'];

		this.raw_send(data, function(res){
			res = res.body;
			if(res.error || res.errors)
				return cb(res.error || res.errors);

			return cb(null, res);
		});
	},

	/**
	 * status() one-signal notification status tracking api
	 * more info : https://documentation.onesignal.com/docs/notifications-view-notifications
	 *
	 * @param {string} id - send id
	 * @param {callback} cb - callback that handles reponse
	 */

	status: function(id, cb){
		var data = this.predata();

		this.auth(rest.get(URL_NOTIFCATION + id))
			.send(data)
			.end(function(res){
				res = res.body;
				if(res.error || res.errors)
					return cb(res.error || res.errors);

				return cb(null, res);
			});
	},

};

module.exports.OneSignal = os;
