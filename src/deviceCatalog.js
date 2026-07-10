  export const deviceCatalog = [ 
    {
        deviceType: 'Laptop',
        label: 'Laptop',
        ports: [
            {
                key: 'hdmi-out', 
                label: 'HDMI Out', 
                portType: 'HDMI', 
                signal: 'video', 
                direction: 'output',
                flowRole: 'origin'
            },
            {
                key: 'headphone-out', 
                label: 'Headphone Out', 
                portType: '1/8" TRS', 
                signal: 'audio', 
                direction: 'output',
                flowRole: 'origin'
            }
        ],
        routing: {}
    },

    {
        deviceType: 'Projector',
        label: 'Projector',
        ports: [
            {
                key: 'hdmi-in', 
                label: 'HDMI In', 
                portType: 'HDMI', 
                signal: 'video', 
                direction: 'input',
                flowRole: 'terminate'
            }
        ],
        routing: {}
    },

    {
        deviceType: 'Mixer',
        label: 'Mixer',
        ports: [
            {
                key: 'main-out-l', 
                label: 'Main Out L:', 
                portType: 'XLR', 
                signal: 'audio', 
                direction: 'output',
                flowRole: 'pass-through'
            },
            {
                key: 'main-out-r', 
                label: 'Main Out R:', 
                portType: 'XLR', 
                signal: 'audio', 
                direction: 'output',
                flowRole: 'pass-through'
            },
            {
                key: 'ch-1-in', 
                label: 'Channel 1 In:', 
                portType: 'XLR', 
                signal: 'audio', 
                direction: 'input',
                flowRole: 'pass-through'
            },
            {
                key: 'ch-2-in', 
                label: 'Channel 2 In:', 
                portType: 'XLR', 
                signal: 'audio', 
                direction: 'input',
                flowRole: 'pass-through'
            },
            {
                key: 'ch-3-in', 
                label: 'Channel 3 In:', 
                portType: 'XLR', 
                signal: 'audio', 
                direction: 'input',
                flowRole: 'pass-through'
            },
            {
                key: 'ch-4-in', 
                label: 'Channel 4 In:', 
                portType: 'XLR', 
                signal: 'audio', 
                direction: 'input',
                flowRole: 'pass-through'
            },
        ],
        routing: {
            'ch-1-in': ['main-out-l', 'main-out-r'],
            'ch-2-in': ['main-out-l', 'main-out-r'],
            'ch-3-in': ['main-out-l', 'main-out-r'],
            'ch-4-in': ['main-out-l', 'main-out-r']
        }
    },
    {
        deviceType: 'Wireless Microphone Receiver',
        label: 'Wireless Microphone Receiver',
        ports: [
            {
                key: 'audio-out', 
                label: 'Audio Out', 
                portType: 'XLR', 
                signal: 'audio', 
                direction: 'output',
                flowRole: 'origin'
            }
        ],
        routing: {}
    },
    {
        deviceType: 'Speaker',
        label: 'Speaker',
        ports: [
            {
                key: 'audio-in', 
                label: 'Audio In', 
                portType: 'XLR', 
                signal: 'audio', 
                direction: 'input',
                flowRole: 'terminate'
            },
            {
                key: 'audio-thru', 
                label: 'Audio Thru', 
                portType: 'XLR', 
                signal: 'audio', 
                direction: 'output',
                flowRole: 'pass-through'
            },
        ],
        routing: {'audio-in': ['audio-thru']}
    },


  ]
  
 
