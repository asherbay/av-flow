export class Device {
    constructor({deviceType, label, ports = []}) {
      this.id = crypto.randomUUID();
      this.deviceType = deviceType;
      this.label = label;
      this.ports = ports;
      this.ports.forEach((port) => {
        port.device = this
      })
    }
  } 