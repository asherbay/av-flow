  export const deviceCatalog = [ 
    {
        deviceType: 'Laptop',
        label: 'Laptop',
        paletteCategory: 'Sources',
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
        paletteCategory: 'Outputs',
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
        paletteCategory: 'Processing',
        ports: [
            {
                key: 'main-out-l', 
                label: 'Main Out L', 
                portType: 'XLR', 
                signal: 'audio', 
                direction: 'output',
                flowRole: 'pass-through'
            },
            {
                key: 'main-out-r', 
                label: 'Main Out R', 
                portType: 'XLR', 
                signal: 'audio', 
                direction: 'output',
                flowRole: 'pass-through'
            },
            {
                key: 'ch-1-in', 
                label: 'Channel 1 In', 
                portType: 'XLR', 
                signal: 'audio', 
                direction: 'input',
                flowRole: 'pass-through'
            },
            {
                key: 'ch-2-in', 
                label: 'Channel 2 In', 
                portType: 'XLR', 
                signal: 'audio', 
                direction: 'input',
                flowRole: 'pass-through'
            },
            {
                key: 'ch-3-in', 
                label: 'Channel 3 In', 
                portType: 'XLR', 
                signal: 'audio', 
                direction: 'input',
                flowRole: 'pass-through'
            },
            {
                key: 'ch-4-in', 
                label: 'Channel 4 In', 
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
        paletteCategory: 'Sources',
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
        paletteCategory: 'Outputs',
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
    {
        deviceType: 'DI Box (Mono)',
        label: 'DI Box (Mono)',
        paletteCategory: 'Conversion',
        ports: [
            {
                key: 'audio-in',
                label: 'Stereo Audio In',
                portType: '1/8" TRS',
                signal: 'audio',
                direction: 'input',
                flowRole: 'pass-through'
            },
            {
                key: 'audio-out',
                label: 'Mono Audio Out',
                portType: 'XLR',
                signal: 'audio',
                direction: 'output',
                flowRole: 'pass-through'
            }
        ],
        routing: {'audio-in': ['audio-out']}
    },
    {
        deviceType: 'Wired Microphone',
        label: 'Wired Microphone',
        paletteCategory: 'Sources',
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
        deviceType: 'HDMI Splitter (1x4)',
        label: 'HDMI Splitter (1x4)',
        paletteCategory: 'Distribution',
        ports: [
            {
                key: 'hdmi-in',
                label: 'HDMI In',
                portType: 'HDMI',
                signal: 'video',
                direction: 'input',
                flowRole: 'pass-through'
            },
            {
                key: 'hdmi-out-1',
                label: 'HDMI Out 1',
                portType: 'HDMI',
                signal: 'video',
                direction: 'output',
                flowRole: 'pass-through'
            },
            {
                key: 'hdmi-out-2',
                label: 'HDMI Out 2',
                portType: 'HDMI',
                signal: 'video',
                direction: 'output',
                flowRole: 'pass-through'
            },
            {
                key: 'hdmi-out-3',
                label: 'HDMI Out 3',
                portType: 'HDMI',
                signal: 'video',
                direction: 'output',
                flowRole: 'pass-through'
            },
            {
                key: 'hdmi-out-4',
                label: 'HDMI Out 4',
                portType: 'HDMI',
                signal: 'video',
                direction: 'output',
                flowRole: 'pass-through'
            }
        ],
        routing: {
            'hdmi-in': ['hdmi-out-1', 'hdmi-out-2', 'hdmi-out-3', 'hdmi-out-4']
        }
    },
    {
        deviceType: 'HDMI/SDI Cross Converter',
        label: 'HDMI/SDI Cross Converter',
        paletteCategory: 'Conversion',
        ports: [
            {
                key: 'hdmi-in',
                label: 'HDMI In',
                portType: 'HDMI',
                signal: 'video',
                direction: 'input',
                flowRole: 'pass-through'
            },
            {
                key: 'sdi-in',
                label: 'SDI In',
                portType: 'SDI',
                signal: 'video',
                direction: 'input',
                flowRole: 'pass-through'
            },
            {
                key: 'hdmi-out',
                label: 'HDMI Out',
                portType: 'HDMI',
                signal: 'video',
                direction: 'output',
                flowRole: 'pass-through'
            },
            {
                key: 'sdi-out',
                label: 'SDI Out',
                portType: 'SDI',
                signal: 'video',
                direction: 'output',
                flowRole: 'pass-through'
            }
        ],
        routing: {
            'hdmi-in': ['sdi-out'],
            'sdi-in': ['hdmi-out']
        }
    },
    {
        deviceType: 'TV / Monitor',
        label: 'TV / Monitor',
        paletteCategory: 'Outputs',
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
        deviceType: 'House PA Patch',
        label: 'House PA Patch',
        paletteCategory: 'Outputs',
        ports: [
            {
                key: 'audio-in',
                label: 'Audio In',
                portType: 'XLR',
                signal: 'audio',
                direction: 'input',
                flowRole: 'terminate'
            }
        ],
        routing: {}
    },
    {
        deviceType: 'Camera (SDI)',
        label: 'Camera (SDI)',
        paletteCategory: 'Sources',
        ports: [
            {
                key: 'sdi-out',
                label: 'SDI Out',
                portType: 'SDI',
                signal: 'video',
                direction: 'output',
                flowRole: 'origin'
            }
        ],
        routing: {}
    },
    {
        deviceType: 'Audio Recorder',
        label: 'Audio Recorder',
        paletteCategory: 'Outputs',
        ports: [
            {
                key: 'audio-in',
                label: 'Audio In',
                portType: 'XLR',
                signal: 'audio',
                direction: 'input',
                flowRole: 'terminate'
            }
        ],
        routing: {}
    },
    {
        deviceType: 'Video Switcher (Single-Output)',
        label: 'Video Switcher (Single-Output)',
        paletteCategory: 'Switching & Routing',
        ports: [
            {
                key: 'hdmi-in-1',
                label: 'HDMI In 1',
                portType: 'HDMI',
                signal: 'video',
                direction: 'input',
                flowRole: 'pass-through'
            },
            {
                key: 'hdmi-in-2',
                label: 'HDMI In 2',
                portType: 'HDMI',
                signal: 'video',
                direction: 'input',
                flowRole: 'pass-through'
            },
            {
                key: 'hdmi-in-3',
                label: 'HDMI In 3',
                portType: 'HDMI',
                signal: 'video',
                direction: 'input',
                flowRole: 'pass-through'
            },
            {
                key: 'hdmi-out',
                label: 'HDMI Out',
                portType: 'HDMI',
                signal: 'video',
                direction: 'output',
                flowRole: 'pass-through'
            },
            
        ],
        routing: {'hdmi-in-1': ['hdmi-out']}
    },
    {
        deviceType: 'Video Switcher (Multi-Output)',
        label: 'Video Switcher (Multi-Output)',
        paletteCategory: 'Switching & Routing',
        ports: [
            {
                key: 'hdmi-in-1',
                label: 'HDMI In 1',
                portType: 'HDMI',
                signal: 'video',
                direction: 'input',
                flowRole: 'pass-through'
            },
            {
                key: 'hdmi-in-2',
                label: 'HDMI In 2',
                portType: 'HDMI',
                signal: 'video',
                direction: 'input',
                flowRole: 'pass-through'
            },
            {
                key: 'hdmi-in-3',
                label: 'HDMI In 3',
                portType: 'HDMI',
                signal: 'video',
                direction: 'input',
                flowRole: 'pass-through'
            },
            {
                key: 'sdi-in-1',
                label: 'SDI In 1',
                portType: 'SDI',
                signal: 'video',
                direction: 'input',
                flowRole: 'pass-through'
            },
            {
                key: 'sdi-in-2',
                label: 'SDI In 2',
                portType: 'SDI',
                signal: 'video',
                direction: 'input',
                flowRole: 'pass-through'
            },
            {
                key: 'hdmi-out-1',
                label: 'HDMI Out 1',
                portType: 'HDMI',
                signal: 'video',
                direction: 'output',
                flowRole: 'pass-through'
            },
            {
                key: 'hdmi-out-2',
                label: 'HDMI Out 2',
                portType: 'HDMI',
                signal: 'video',
                direction: 'output',
                flowRole: 'pass-through'
            },
            {
                key: 'sdi-out-1',
                label: 'SDI Out 1',
                portType: 'SDI',
                signal: 'video',
                direction: 'output',
                flowRole: 'pass-through'
            },
            {
                key: 'sdi-out-2',
                label: 'SDI Out 2',
                portType: 'SDI',
                signal: 'video',
                direction: 'output',
                flowRole: 'pass-through'
            },
            
        ],
        routing: {'hdmi-in-1': ['hdmi-out-1', 'hdmi-out-2', 'sdi-out-1', 'sdi-out-2']}
    },
  ]
  
 
