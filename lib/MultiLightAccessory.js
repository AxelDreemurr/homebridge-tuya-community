const SingleLightAccessory = require('./SingleLightAccessory');

// Manager class that creates multiple individual accessories
class MultiLightAccessory {
    static getCategory(Categories) {
        return Categories.LIGHTBULB;
    }

    constructor(platform, accessory, device, _isNew) {
        this.platform = platform;
        this.device = device;
        this.log = platform.log;
        this.childAccessories = [];

        const lightCount = parseInt(device.context.lightCount) || 1;

        // Create a separate accessory for each gang
        for (let i = 1; i <= lightCount; i++) {
            const gangName = device.context.name + ' ' + i;
            const gangUUID = platform.api.hap.uuid.generate(device.context.UUID + ':light:' + i);

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
                    MultiLightAccessory.getCategory(platform.api.hap.Accessory.Categories)
                );

                const Service = platform.api.hap.Service;
                const Characteristic = platform.api.hap.Characteristic;

                gangAccessory.getService(Service.AccessoryInformation)
                    .setCharacteristic(Characteristic.Manufacturer, device.context.manufacturer || "Unknown")
                    .setCharacteristic(Characteristic.Model, device.context.model || "Unknown")
                    .setCharacteristic(Characteristic.SerialNumber, (device.context.serialNumber || device.context.id.slice(8)) + '-' + i)
                    .setCharacteristic(Characteristic.FirmwareRevision, device.context.firmwareVersion || '1.0');
            }

            if (gangAccessory.displayName !== gangName) {
                gangAccessory.displayName = gangName;
            }

            // Only connect to the device on the first child accessory
            const shouldConnect = i === 1;

            // Create the individual light accessory wrapper with the specific DP
            const childAccessory = new SingleLightAccessory(platform, gangAccessory, device, String(i), isGangNew, shouldConnect);

            platform.cachedAccessories.set(gangUUID, childAccessory);
            this.childAccessories.push(childAccessory);
        }
    }
}

module.exports = MultiLightAccessory;
