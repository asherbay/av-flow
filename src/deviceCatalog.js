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
            },
            {
                key: 'headphone-out', 
                label: 'Headphone Out', 
                portType: '1/8" TRS', 
                signal: 'audio', 
                direction: 'output'
            }
        ]
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
            }
        ]
    },


  ]
  
 
