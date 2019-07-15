const fs = require('fs');
const path = require('path');
const { swPrecacheConfig, pwa } = require('../../config');

const pwaConfigFilePath = path.join('dist/pwaConfig.json');

const createPwaConfigFile = () => {
	try {
		if (pwa) {
			fs.writeFileSync(pwaConfigFilePath, `{"pwa":${swPrecacheConfig}}`);
		}
	} catch (e) {
		console.log('createPwaConfigFile', e);
	}
};

module.exports = createPwaConfigFile;
