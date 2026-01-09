const SingleLightAccessory = require('./SingleLightAccessory');

// Manager class that creates multiple individual accessories
class CustomMultiLightAccessory {
    static getCategory(Categories) {
        return Categories.LIGHTBULB;
    }

    constructor(platform, accessory, device, _isNew) {
        this.platform = platform;
        this.device = device;
        this.log = platform.log;
        this.childAccessories = [];

        if (!Array.isArray(device.context.lights)) {
            throw new Error(`The lights definition is missing or is malformed: ${device.context.lights}`);
        }

        // Create a separate accessory for each gang
        device.context.lights.forEach((light, i) => {
            if (!light || !light.hasOwnProperty('name') || !light.hasOwnProperty('dp') || !isFinite(light.dp)) {
                throw new Error(`The light definition #${i} is missing or is malformed: ${light}`);
            }

            const gangName = ((light.name || '').trim() || 'Unnamed') + ' - ' + device.context.name;
            const gangUUID = platform.api.hap.uuid.generate(device.context.UUID + ':light:' + light.dp);

            let gangAccessory = platform.cachedAccessories.get(gangUUID);
            let isGangNew = true;

            if (gangAccessory) {
                // Check if accessory is already wrapped by an accessory class
                if (gangAccessory.accessory) {
                    // Extract the raw PlatformAccessory from the wrapper
                    gangAccessory = gangAccessory.accessory;
                }
                isGangNew = false;
            } else {
                gangAccessory = new platform.PlatformAccessory(
                    gangName,
                    gangUUID,
                    CustomMultiLightAccessory.getCategory(platform.api.hap.Accessory.Categories)
                );

                const Service = platform.api.hap.Service;
                const Characteristic = platform.api.hap.Characteristic;

                gangAccessory.getService(Service.AccessoryInformation)
                    .setCharacteristic(Characteristic.Manufacturer, device.context.manufacturer || "Unknown")
                    .setCharacteristic(Characteristic.Model, device.context.model || "Unknown")
                    .setCharacteristic(Characteristic.SerialNumber, device.context.id.slice(8) + '-' + light.dp);
            }

            if (gangAccessory.displayName !== gangName) {
                gangAccessory.displayName = gangName;
            }

            // Only connect to the device on the first child accessory
            const shouldConnect = i === 0;

            // Create the individual light accessory wrapper with the specific DP
            const childAccessory = new SingleLightAccessory(platform, gangAccessory, device, String(light.dp), isGangNew, shouldConnect);

            platform.cachedAccessories.set(gangUUID, childAccessory);
            this.childAccessories.push(childAccessory);
        });
    }
}

module.exports = CustomMultiLightAccessory;
