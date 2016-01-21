var vows = require('vows'),
    assert = require('assert');

var CFG = require('./config.js');
var onesignal = require('./../index.js');

var id_device = '57b19fdc-c007-4eb5-a3b2-9e8a9d1f8d30';
var id_sended = '';

vows.describe('OneSignal rest api').addBatch({
    'onesignl send + status': {
        topic: new onesignal(CFG.APP_ID, CFG.APP_KEY),

        'sending..': {
			topic: function(os){
				os.send(id_device, 'lorem Ipsum', 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..', null, this.callback);
			},
			'result of sending..': function(err, res){
				assert.isNull(err);
				id_sended = res.id;
			},
		},

		'tracking..': {
			topic: function(os){
				os.status(id_sended, this.callback);
			},
			'result of tracking..': function(err, res){
				assert.isNull(err);
			},
		},
    },
}).export(module);
