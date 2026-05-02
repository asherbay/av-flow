export class Port {
    constructor({id, key, label, portType, signal, direction}) { //ie. "HDMI", "input"
      this.id = id;
      this.key = key;
      this.label = label;
      this.portType = portType;
      this.signal = signal;
      this.direction = direction;
      this.connectedTo = null;
      this.device = null;
    }
    
  }