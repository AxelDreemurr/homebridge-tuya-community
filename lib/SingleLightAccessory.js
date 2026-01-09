const BaseAccessory = require('./BaseAccessory');

// Individual light accessory for a single gang of a multi-gang light switch
class SingleLightAccessory extends BaseAccessory {
    static getCategory(Categories) {
        return Categories.LIGHTBULB;
    }

    constructor(platform, accessory, device, dp, isNew, shouldConnect = true) {
        super(platform, accessory, device, isNew, shouldConnect);
        // Store the DP after calling super
        this.dp = dp;
    }

    _registerPlatformAccessory() {
        const { Service } = this.hap;

        this.accessory.addService(Service.Lightbulb, this.device.context.name);

        super._registerPlatformAccessory();
    }

    _registerCharacteristics(dps) {
        const { Service, Characteristic } = this.hap;
        const service = this.accessory.getService(Service.Lightbulb);
        this._checkServiceName(service, this.device.context.name);

        // Use the stored dp for this specific gang
        const dpPower = this.dp;

        const characteristicOn = service.getCharacteristic(Characteristic.On)
            .updateValue(dps[dpPower])
            .on('get', this.getState.bind(this, dpPower))
            .on('set', this.setState.bind(this, dpPower));

        this.device.on('change', (changes, state) => {
            if (changes.hasOwnProperty(dpPower) && characteristicOn.value !== changes[dpPower]) {
                characteristicOn.updateValue(changes[dpPower]);
            }
            this.log.info('SingleLight changed: ' + JSON.stringify(state));
        });
    }
}

module.exports = SingleLightAccessory;
