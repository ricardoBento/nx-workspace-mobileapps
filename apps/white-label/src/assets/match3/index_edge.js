/*jslint */
/*global AdobeEdge: false, window: false, document: false, console:false, alert: false */
(function (compId) {

    "use strict";
    var im='images/',
        aud='media/',
        vid='media/',
        js='js/',
        fonts = {
            'NotoSans-ExtraCondensedBold': '<link rel=\"stylesheet\" href=\"css/fonts.css\" type=\"text/css\" media=\"screen\" title=\"\" charset=\"utf-8\" />',
            'NotoSans-Regular': '<link rel=\"stylesheet\" href=\"css/fonts.css\" type=\"text/css\" media=\"screen\" title=\"\" charset=\"utf-8\" />'        },
        opts = {
            'gAudioPreloadPreference': 'auto',
            'gVideoPreloadPreference': 'auto'
        },
        resources = [
        ],
        scripts = [
            js+"TweenMax.min.js",
            js+"jquery-3.3.1.min.js",
            js+"jquery-ui.min.js",
            js+"jquery-ui-touch-punch.js",
            js+"utilities.js",
            js+"chance.js",
            js+"present.js",
            js+"swapGrid.js",
            js+"htmlToCanvas.js",
            js+"createTimer.js",
            js+"colourChange.js"
        ],
        symbols = {
            "stage": {
                version: "6.0.0",
                minimumCompatibleVersion: "5.0.0",
                build: "6.0.0.400",
                scaleToFit: "both",
                centerStage: "both",
                resizeInstances: false,
                content: {
                    dom: [
                        {
                            id: 'cover',
                            type: 'rect',
                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                            opacity: '0',
                            fill: ["rgba(255,0,0,0.23)"],
                            stroke: [0,"rgb(0, 0, 0)","none"]
                        }
                    ],
                    style: {
                        '${Stage}': {
                            isStage: true,
                            rect: ['null', 'null', '720px', '1280px', 'auto', 'auto'],
                            overflow: 'visible',
                            fill: ["rgba(255,0,0,0.00)",[270,[['rgba(255,255,255,0.00)',0],['rgba(255,255,255,0.00)',100]]]]
                        }
                    }
                },
                timeline: {
                    duration: 0,
                    autoPlay: true,
                    data: [

                    ]
                }
            },
            "pauseButton": {
                version: "6.0.0",
                minimumCompatibleVersion: "5.0.0",
                build: "6.0.0.400",
                scaleToFit: "none",
                centerStage: "none",
                resizeInstances: false,
                content: {
                    dom: [
                        {
                            type: 'ellipse',
                            borderRadius: ['50%', '50%', '50%', '50%'],
                            id: 'base',
                            stroke: [0, 'rgba(0,0,0,1)', 'none'],
                            userClass: 'buttonBase',
                            overflow: 'hidden',
                            rect: ['0px', '0px', '60px', '60px', 'auto', 'auto'],
                            fill: ['rgba(192,192,192,1)'],
                            c: [
                            {
                                userClass: 'highlights',
                                borderRadius: ['50%', '50%', '50%', '50%'],
                                rect: ['0px', '0px', '60px', '60px', 'auto', 'auto'],
                                id: 'highlight',
                                stroke: [0, 'rgb(0, 0, 0)', 'none'],
                                type: 'ellipse',
                                fill: ['rgba(255,255,255,1.00)']
                            }]
                        },
                        {
                            type: 'rect',
                            rect: ['0px', '0px', '60px', '60px', 'auto', 'auto'],
                            id: 'container',
                            stroke: [0, 'rgb(0, 0, 0)', 'none'],
                            fill: ['rgba(255,255,255,0)'],
                            c: [
                            {
                                type: 'text',
                                rect: ['0px', '0px', '60px', '60px', 'auto', 'auto'],
                                id: 'Text',
                                text: '<p style=\"margin: 0px;\">​</p>',
                                userClass: 'centeredText',
                                font: ['Arial, Helvetica, sans-serif', [24, ''], 'rgba(0,0,0,1)', 'normal', 'none', '', 'break-word', 'normal']
                            }]
                        },
                        {
                            type: 'image',
                            rect: ['12px', '11px', '35px', '37px', 'auto', 'auto'],
                            id: 'image',
                            opacity: '0',
                            display: 'block',
                            fill: ['rgba(0,0,0,0)', 'images/exitIcon.png', '0px', '0px']
                        },
                        {
                            type: 'rect',
                            rect: ['0px', '0px', '60px', '60px', 'auto', 'auto'],
                            opacity: '0',
                            id: 'HS',
                            stroke: [0, 'rgb(0, 0, 0)', 'none'],
                            cursor: 'pointer',
                            fill: ['rgba(255,255,255,0.00)']
                        }
                    ],
                    style: {
                        '${symbolSelector}': {
                            rect: [null, null, '60px', '60px']
                        }
                    }
                },
                timeline: {
                    duration: 0,
                    autoPlay: true,
                    data: [
                        [
                            "eid3454",
                            "display",
                            0,
                            0,
                            "linear",
                            "${image}",
                            'block',
                            'block'
                        ]
                    ]
                }
            },
            "panel": {
                version: "6.0.0",
                minimumCompatibleVersion: "5.0.0",
                build: "6.0.0.400",
                scaleToFit: "none",
                centerStage: "none",
                resizeInstances: false,
                content: {
                    dom: [
                        {
                            type: 'rect',
                            borderRadius: ['25px', '25px', '25px', '25px 25px'],
                            id: 'base',
                            stroke: [0, 'rgb(0, 0, 0)', 'none'],
                            rect: ['0px', '0px', '200px', '60px', 'auto', 'auto'],
                            overflow: 'hidden',
                            userClass: 'buttonBase',
                            fill: ['rgba(192,192,192,1)'],
                            c: [
                            {
                                rect: ['0px', '0px', '200px', '60px', 'auto', 'auto'],
                                borderRadius: ['25px', '25px', '25px', '25px 25px'],
                                userClass: 'panelHighlights',
                                id: 'highlight',
                                stroke: [0, 'rgb(0, 0, 0)', 'none'],
                                type: 'rect',
                                fill: ['rgba(255,255,255,1.00)']
                            }]
                        },
                        {
                            rect: ['0px', '0px', '200px', '48px', 'auto', 'auto'],
                            type: 'rect',
                            id: 'container',
                            stroke: [0, 'rgb(0, 0, 0)', 'none'],
                            fill: ['rgba(255,255,255,0.00)'],
                            c: [
                            {
                                font: ['Arial, Helvetica, sans-serif', [24, ''], 'rgba(0,0,0,1)', 'normal', 'none', '', 'break-word', 'normal'],
                                type: 'text',
                                id: 'Text',
                                text: '<p style=\"margin: 0px;\">​</p>',
                                userClass: 'centeredText',
                                rect: ['0px', '0px', '200px', '60px', 'auto', 'auto']
                            }]
                        },
                        {
                            type: 'group',
                            id: 'meter',
                            rect: ['20', '45', '160', '6', 'auto', 'auto'],
                            c: [
                            {
                                rect: ['0px', '0px', '160px', '6px', 'auto', 'auto'],
                                borderRadius: ['50px', '50px', '50px', '50px 50px'],
                                userClass: 'meterBG',
                                id: 'meterBG',
                                stroke: [0, 'rgb(0, 0, 0)', 'none'],
                                type: 'rect',
                                fill: ['rgba(255,255,255,1.00)']
                            },
                            {
                                rect: ['0px', '0px', '160px', '6px', 'auto', 'auto'],
                                borderRadius: ['50px', '50px', '50px', '50px 50px'],
                                userClass: 'meterFill',
                                id: 'meterFill',
                                stroke: [0, 'rgb(0, 0, 0)', 'none'],
                                type: 'rect',
                                fill: ['rgba(255,255,255,1.00)']
                            }]
                        }
                    ],
                    style: {
                        '${symbolSelector}': {
                            rect: [null, null, '200px', '60px']
                        }
                    }
                },
                timeline: {
                    duration: 0,
                    autoPlay: true,
                    data: [

                    ]
                }
            },
            "pauseMenu": {
                version: "6.0.0",
                minimumCompatibleVersion: "5.0.0",
                build: "6.0.0.400",
                scaleToFit: "none",
                centerStage: "none",
                resizeInstances: false,
                content: {
                    dom: [
                        {
                            rect: ['0px', '0px', '1024px', '600px', 'auto', 'auto'],
                            stroke: [0, 'rgb(0, 0, 0)', 'none'],
                            id: 'whiten',
                            opacity: '0.8',
                            type: 'rect',
                            fill: ['rgba(255,255,255,1.00)']
                        },
                        {
                            type: 'rect',
                            borderRadius: ['25px', '25px', '25px', '25px 25px'],
                            id: 'pauseBox',
                            stroke: [10, 'rgb(0, 0, 0)', 'solid'],
                            userClass: 'colouredBorder',
                            rect: ['120px', '125px', '410px', '330px', 'auto', 'auto'],
                            fill: ['rgba(255,255,255,0.80)'],
                            c: [
                            {
                                rect: ['32px', '292px', '120px', '30px', 'auto', 'auto'],
                                type: 'rect',
                                id: 'exitContainer',
                                stroke: [3, 'rgb(0, 0, 0)', 'none'],
                                fill: ['rgba(255,255,255,0)'],
                                c: [
                                {
                                    font: ['Arial, Helvetica, sans-serif', [24, 'px'], 'rgba(0,0,0,1)', '400', 'none', 'normal', 'break-word', 'normal'],
                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                    userClass: 'centeredText',
                                    textStyle: ['', '', '', '', 'none'],
                                    align: 'left',
                                    text: '<p style=\"margin: 0px;\">​</p>',
                                    id: 'exitText',
                                    type: 'text'
                                }]
                            },
                            {
                                rect: ['259px', '290px', '120px', '34px', 'auto', 'auto'],
                                type: 'rect',
                                id: 'resumeContainer',
                                stroke: [3, 'rgb(0, 0, 0)', 'none'],
                                fill: ['rgba(255,255,255,0)'],
                                c: [
                                {
                                    type: 'text',
                                    rect: ['9px', '6px', '27px', '11px', 'auto', 'auto'],
                                    id: 'resumeText',
                                    text: '<p style=\"margin: 0px;\">​</p>',
                                    userClass: 'centeredText',
                                    font: ['Arial, Helvetica, sans-serif', [24, ''], 'rgba(0,0,0,1)', 'normal', 'none', '', 'break-word', 'normal']
                                }]
                            },
                            {
                                rect: ['145px', '290px', '120px', '34px', 'auto', 'auto'],
                                type: 'rect',
                                id: 'retryContainer',
                                stroke: [3, 'rgb(0, 0, 0)', 'none'],
                                fill: ['rgba(255,255,255,0)'],
                                c: [
                                {
                                    font: ['Arial, Helvetica, sans-serif', [24, 'px'], 'rgba(0,0,0,1)', '400', 'none', 'normal', 'break-word', 'normal'],
                                    rect: ['0px', '0px', '120px', '34px', 'auto', 'auto'],
                                    userClass: 'centeredText',
                                    textStyle: ['', '', '', '', 'none'],
                                    align: 'left',
                                    text: '<p style=\"margin: 0px;\">​</p>',
                                    id: 'retryText',
                                    type: 'text'
                                }]
                            },
                            {
                                id: 'exitButton',
                                symbolName: 'pauseButton',
                                rect: ['15%', '230px', null, null, 'auto', 'auto'],
                                type: 'rect'
                            },
                            {
                                id: 'resumeButton',
                                symbolName: 'pauseButton',
                                rect: ['70.4%', '230px', null, null, 'auto', 'auto'],
                                type: 'rect'
                            },
                            {
                                id: 'retryButton',
                                symbolName: 'pauseButton',
                                rect: ['175px', '230px', null, null, 'auto', 'auto'],
                                type: 'rect'
                            },
                            {
                                id: 'musicCheckBox',
                                symbolName: 'checkBox',
                                rect: ['112px', '140px', '247', '25', 'auto', 'auto'],
                                type: 'rect'
                            },
                            {
                                id: 'soundsCheckBox',
                                symbolName: 'checkBox',
                                rect: ['112px', '175px', null, null, 'auto', 'auto'],
                                type: 'rect'
                            },
                            {
                                id: 'divider',
                                type: 'image',
                                rect: ['15%', '70px', '70%', '66px', 'auto', 'auto'],
                                fill: ['rgba(0,0,0,0)', 'images/divider.png', '0px', '0px']
                            },
                            {
                                rect: ['15%', '30px', '70%', '39px', 'auto', 'auto'],
                                type: 'rect',
                                id: 'titleContainer',
                                stroke: [10, 'rgb(0, 0, 0)', 'none'],
                                fill: ['rgba(255,255,255,0.00)'],
                                c: [
                                {
                                    font: ['Arial, Helvetica, sans-serif', [24, 'px'], 'rgba(0,0,0,1)', '400', 'none', 'normal', 'break-word', 'normal'],
                                    rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                    userClass: 'centeredText',
                                    textStyle: ['', '', '', '', 'none'],
                                    align: 'left',
                                    text: '<p style=\"margin: 0px;\">​</p>',
                                    id: 'titleText',
                                    type: 'text'
                                }]
                            },
                            {
                                id: 'closeButton',
                                symbolName: 'pauseButton',
                                rect: ['-25px', '-30px', null, null, 'auto', 'auto'],
                                type: 'rect'
                            }]
                        },
                        {
                            id: 'infoGroup2',
                            symbolName: 'infoGroup',
                            rect: ['690px', '390px', null, null, 'auto', 'auto'],
                            type: 'rect'
                        },
                        {
                            id: 'infoGroup1',
                            symbolName: 'infoGroup',
                            rect: ['690px', '230px', null, null, 'auto', 'auto'],
                            type: 'rect'
                        },
                        {
                            id: 'infoGroup0',
                            symbolName: 'infoGroup',
                            rect: ['690px', '70px', '200', '140', 'auto', 'auto'],
                            type: 'rect'
                        }
                    ],
                    style: {
                        '${symbolSelector}': {
                            rect: [null, null, '1024px', '600px']
                        }
                    }
                },
                timeline: {
                    duration: 0,
                    autoPlay: true,
                    data: [

                    ]
                }
            },
            "checkBox": {
                version: "6.0.0",
                minimumCompatibleVersion: "5.0.0",
                build: "6.0.0.400",
                scaleToFit: "none",
                centerStage: "none",
                resizeInstances: false,
                content: {
                    dom: [
                        {
                            rect: ['0px', '0px', '19px', '19px', 'auto', 'auto'],
                            borderRadius: ['50%', '50%', '50%', '50%'],
                            userClass: 'colouredBorder',
                            id: 'Ellipse',
                            stroke: [3, 'rgb(0, 0, 0)', 'solid'],
                            type: 'ellipse',
                            fill: ['rgba(255,255,255,0)']
                        },
                        {
                            rect: ['25px', '0px', '222px', '25px', 'auto', 'auto'],
                            type: 'rect',
                            id: 'container',
                            stroke: [3, 'rgb(0, 0, 0)', 'none'],
                            fill: ['rgba(255,255,255,0)'],
                            c: [
                            {
                                font: ['Arial, Helvetica, sans-serif', [24, 'px'], 'rgba(0,0,0,1)', '400', 'none', 'normal', 'break-word', 'normal'],
                                rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                userClass: 'centeredText',
                                textStyle: ['', '', '', '', 'none'],
                                align: 'left',
                                text: '<p style=\"margin: 0px;\">​</p>',
                                id: 'Text',
                                type: 'text'
                            }]
                        },
                        {
                            id: 'tick',
                            type: 'image',
                            rect: ['5px', '0px', '20px', '19px', 'auto', 'auto'],
                            fill: ['rgba(0,0,0,0)', 'images/tick.svg', '0px', '0px']
                        },
                        {
                            rect: ['0px', '0px', '25px', '25px', 'auto', 'auto'],
                            type: 'rect',
                            id: 'HS',
                            stroke: [3, 'rgb(0, 0, 0)', 'none'],
                            cursor: 'pointer',
                            fill: ['rgba(255,255,255,0)']
                        }
                    ],
                    style: {
                        '${symbolSelector}': {
                            rect: [null, null, '247px', '25px']
                        }
                    }
                },
                timeline: {
                    duration: 0,
                    autoPlay: true,
                    data: [

                    ]
                }
            },
            "infoPanel": {
                version: "6.0.0",
                minimumCompatibleVersion: "5.0.0",
                build: "6.0.0.400",
                scaleToFit: "none",
                centerStage: "none",
                resizeInstances: false,
                content: {
                    dom: [
                        {
                            type: 'rect',
                            borderRadius: ['30px', '30px', '30px', '30px 30px'],
                            id: 'base',
                            stroke: [3, 'rgb(0, 0, 0)', 'none'],
                            userClass: 'buttonBase',
                            overflow: 'hidden',
                            rect: ['-40px', '0px', '200px', '60px', 'auto', 'auto'],
                            fill: ['rgba(176,176,176,1)'],
                            c: [
                            {
                                userClass: 'panelHighlights',
                                borderRadius: ['30px', '30px', '30px', '30px 30px'],
                                rect: ['0px', '0px', '200px', '60px', 'auto', 'auto'],
                                id: 'highlight',
                                stroke: [3, 'rgb(0, 0, 0)', 'none'],
                                type: 'rect',
                                fill: ['rgba(255,255,255,1.00)']
                            }]
                        },
                        {
                            type: 'rect',
                            rect: ['-40px', '0px', '200px', '60px', 'auto', 'auto'],
                            id: 'container',
                            stroke: [3, 'rgb(0, 0, 0)', 'none'],
                            fill: ['rgba(255,255,255,0.00)'],
                            c: [
                            {
                                type: 'text',
                                rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                id: 'Text',
                                text: '<p style=\"margin: 0px;\">​</p>',
                                align: 'left',
                                textStyle: ['', '', '', '', 'none'],
                                font: ['Arial, Helvetica, sans-serif', [24, 'px'], 'rgba(0,0,0,1)', '400', 'none', 'normal', 'break-word', 'normal'],
                                userClass: 'centeredText'
                            }]
                        }
                    ],
                    style: {
                        '${symbolSelector}': {
                            rect: [null, null, '120px', '60px']
                        }
                    }
                },
                timeline: {
                    duration: 0,
                    autoPlay: true,
                    data: [

                    ]
                }
            },
            "infoGroup": {
                version: "6.0.0",
                minimumCompatibleVersion: "5.0.0",
                build: "6.0.0.400",
                scaleToFit: "none",
                centerStage: "none",
                resizeInstances: false,
                content: {
                    dom: [
                        {
                            id: 'infoPanel',
                            symbolName: 'infoPanel',
                            rect: ['40px', '80px', '120', '60', 'auto', 'auto'],
                            type: 'rect'
                        },
                        {
                            rect: ['0px', '0px', '200px', '80px', 'auto', 'auto'],
                            type: 'rect',
                            id: 'container',
                            stroke: [3, 'rgb(0, 0, 0)', 'none'],
                            fill: ['rgba(255,255,255,0)'],
                            c: [
                            {
                                font: ['Arial, Helvetica, sans-serif', [24, 'px'], 'rgba(0,0,0,1)', '400', 'none', 'normal', 'break-word', 'normal'],
                                rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                userClass: 'centeredText',
                                textStyle: ['', '', '', '', 'none'],
                                align: 'left',
                                text: '<p style=\"margin: 0px;\">​</p>',
                                id: 'Text',
                                type: 'text'
                            }]
                        }
                    ],
                    style: {
                        '${symbolSelector}': {
                            rect: [null, null, '200px', '140px']
                        }
                    }
                },
                timeline: {
                    duration: 0,
                    autoPlay: true,
                    data: [

                    ]
                }
            },
            "startButton": {
                version: "6.0.0",
                minimumCompatibleVersion: "5.0.0",
                build: "6.0.0.400",
                scaleToFit: "none",
                centerStage: "none",
                resizeInstances: false,
                content: {
                    dom: [
                        {
                            type: 'ellipse',
                            borderRadius: ['50%', '50%', '50%', '50%'],
                            id: 'base',
                            stroke: [0, 'rgb(0, 0, 0)', 'none'],
                            rect: ['0px', '0px', '88px', '88px', 'auto', 'auto'],
                            overflow: 'hidden',
                            userClass: 'buttonBase',
                            fill: ['rgba(143,143,143,1.00)'],
                            c: [
                            {
                                rect: ['0px', '0px', '88px', '88px', 'auto', 'auto'],
                                borderRadius: ['50%', '50%', '50%', '50%'],
                                userClass: 'highlights',
                                id: 'highlight',
                                stroke: [0, 'rgb(0, 0, 0)', 'none'],
                                type: 'ellipse',
                                fill: ['rgba(255,255,255,1.00)']
                            }]
                        },
                        {
                            rect: ['0px', '0px', '88px', '88px', 'auto', 'auto'],
                            type: 'rect',
                            id: 'container',
                            stroke: [0, 'rgb(0, 0, 0)', 'none'],
                            fill: ['rgba(255,255,255,0.00)'],
                            c: [
                            {
                                font: ['Arial, Helvetica, sans-serif', [24, 'px'], 'rgba(0,0,0,1)', '400', 'none', 'normal', 'break-word', 'normal'],
                                rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                userClass: 'centeredText',
                                textStyle: ['', '', '', '', 'none'],
                                align: 'left',
                                text: '<p style=\"margin: 0px;\">​</p>',
                                id: 'Text',
                                type: 'text'
                            }]
                        },
                        {
                            rect: ['0px', '0px', '88px', '88px', 'auto', 'auto'],
                            type: 'rect',
                            stroke: [0, 'rgb(0, 0, 0)', 'none'],
                            id: 'HS',
                            opacity: '0',
                            cursor: 'pointer',
                            fill: ['rgba(255,255,255,0.00)']
                        }
                    ],
                    style: {
                        '${symbolSelector}': {
                            rect: [null, null, '88px', '88px']
                        }
                    }
                },
                timeline: {
                    duration: 0,
                    autoPlay: true,
                    data: [

                    ]
                }
            },
            "introScreen": {
                version: "6.0.0",
                minimumCompatibleVersion: "5.0.0",
                build: "6.0.0.400",
                scaleToFit: "none",
                centerStage: "none",
                resizeInstances: false,
                content: {
                    dom: [
                        {
                            type: 'rect',
                            id: 'Rectangle',
                            stroke: [0, 'rgba(0,0,0,1)', 'none'],
                            rect: ['0px', '0px', '1024px', '600px', 'auto', 'auto'],
                            fill: ['rgba(192,192,192,0.00)']
                        }
                    ],
                    style: {
                        '${symbolSelector}': {
                            rect: [null, null, '1024px', '600px']
                        }
                    }
                },
                timeline: {
                    duration: 0,
                    autoPlay: true,
                    data: [

                    ]
                }
            },
            "gameOverScreen": {
                version: "6.0.0",
                minimumCompatibleVersion: "5.0.0",
                build: "6.0.0.400",
                scaleToFit: "none",
                centerStage: "none",
                resizeInstances: false,
                content: {
                    dom: [
                        {
                            rect: ['0px', '0px', '1024px', '600px', 'auto', 'auto'],
                            opacity: '0.8',
                            id: 'whiten',
                            stroke: [0, 'rgb(0, 0, 0)', 'none'],
                            type: 'rect',
                            fill: ['rgba(255,255,255,1.00)']
                        },
                        {
                            type: 'rect',
                            borderRadius: ['25px', '25px', '25px', '25px 25px'],
                            id: 'pauseBox',
                            stroke: [10, 'rgb(0, 0, 0)', 'solid'],
                            rect: ['448px', '125px', '410px', '330px', 'auto', 'auto'],
                            userClass: 'colouredBorder',
                            fill: ['rgba(255,255,255,0.80)'],
                            c: [
                            {
                                rect: ['11px', '-10px', '388', '294', 'auto', 'auto'],
                                id: 'Group',
                                type: 'group',
                                c: [
                                {
                                    type: 'rect',
                                    rect: ['9px', '292px', '120px', '30px', 'auto', 'auto'],
                                    id: 'exitContainer',
                                    stroke: [3, 'rgb(0, 0, 0)', 'none'],
                                    fill: ['rgba(255,255,255,0)'],
                                    c: [
                                    {
                                        type: 'text',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        align: 'left',
                                        text: '<p style=\"margin: 0px;\">​</p>',
                                        id: 'exitText',
                                        textStyle: ['', '', '', '', 'none'],
                                        userClass: 'centeredText',
                                        font: ['Arial, Helvetica, sans-serif', [24, 'px'], 'rgba(0,0,0,1)', '400', 'none', 'normal', 'break-word', 'normal']
                                    }]
                                },
                                {
                                    type: 'rect',
                                    rect: ['263px', '290px', '120px', '34px', 'auto', 'auto'],
                                    id: 'resumeContainer',
                                    stroke: [3, 'rgb(0, 0, 0)', 'none'],
                                    fill: ['rgba(255,255,255,0)'],
                                    c: [
                                    {
                                        rect: ['9px', '6px', '27px', '11px', 'auto', 'auto'],
                                        font: ['Arial, Helvetica, sans-serif', [24, ''], 'rgba(0,0,0,1)', 'normal', 'none', '', 'break-word', 'normal'],
                                        id: 'resumeText',
                                        text: '<p style=\"margin: 0px;\">​</p>',
                                        userClass: 'centeredText',
                                        type: 'text'
                                    }]
                                },
                                {
                                    type: 'rect',
                                    rect: ['96px', '290px', '200px', '34px', 'auto', 'auto'],
                                    id: 'leaderboardContainer',
                                    stroke: [3, 'rgb(0, 0, 0)', 'none'],
                                    fill: ['rgba(255,255,255,0)'],
                                    c: [
                                    {
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        font: ['Arial, Helvetica, sans-serif', [24, ''], 'rgba(0,0,0,1)', 'normal', 'none', '', 'break-word', 'normal'],
                                        id: 'leaderboardText',
                                        text: '<p style=\"margin: 0px;\">​</p>',
                                        userClass: 'centeredText',
                                        type: 'text'
                                    }]
                                },
                                {
                                    id: 'leaderboardButton',
                                    symbolName: 'pauseButton',
                                    type: 'rect',
                                    rect: ['166px', '230px', null, null, 'auto', 'auto']
                                },
                                {
                                    id: 'exitButton',
                                    symbolName: 'pauseButton',
                                    type: 'rect',
                                    rect: ['10%', '230px', null, null, 'auto', 'auto']
                                },
                                {
                                    id: 'replayButton',
                                    symbolName: 'pauseButton',
                                    type: 'rect',
                                    rect: ['75.4%', '230px', null, null, 'auto', 'auto']
                                },
                                {
                                    id: 'divider',
                                    type: 'image',
                                    rect: ['15%', '70px', '70%', '66px', 'auto', 'auto'],
                                    fill: ['rgba(0,0,0,0)', 'images/divider.png', '0px', '0px']
                                },
                                {
                                    type: 'rect',
                                    rect: ['15%', '30px', '70%', '39px', 'auto', 'auto'],
                                    id: 'titleContainer',
                                    stroke: [10, 'rgb(0, 0, 0)', 'none'],
                                    fill: ['rgba(255,255,255,0.00)'],
                                    c: [
                                    {
                                        type: 'text',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        align: 'left',
                                        text: '<p style=\"margin: 0px;\">​</p>',
                                        id: 'titleText',
                                        textStyle: ['', '', '', '', 'none'],
                                        userClass: 'centeredText',
                                        font: ['Arial, Helvetica, sans-serif', [24, 'px'], 'rgba(0,0,0,1)', '400', 'none', 'normal', 'break-word', 'normal']
                                    }]
                                },
                                {
                                    type: 'rect',
                                    rect: ['15.2%', '142px', '71%', '40px', 'auto', 'auto'],
                                    id: 'bodyContainer',
                                    stroke: [10, 'rgb(0, 0, 0)', 'none'],
                                    fill: ['rgba(255,255,255,0)'],
                                    c: [
                                    {
                                        type: 'text',
                                        rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                                        align: 'left',
                                        text: '<p style=\"margin: 0px;\">​</p>',
                                        id: 'bodyText',
                                        textStyle: ['', '', '', '', 'none'],
                                        userClass: 'centeredText',
                                        font: ['Arial, Helvetica, sans-serif', [24, 'px'], 'rgba(0,0,0,1)', '400', 'none', 'normal', 'break-word', 'normal']
                                    }]
                                },
                                {
                                    id: 'entry2',
                                    symbolName: 'leaderboardEntry',
                                    type: 'rect',
                                    rect: ['19px', '157px', null, null, 'auto', 'auto']
                                },
                                {
                                    id: 'entry1',
                                    symbolName: 'leaderboardEntry',
                                    type: 'rect',
                                    rect: ['19px', '93px', '350', '64', 'auto', 'auto']
                                },
                                {
                                    id: 'entry0',
                                    symbolName: 'leaderboardEntry',
                                    type: 'rect',
                                    rect: ['19px', '29px', null, null, 'auto', 'auto']
                                }]
                            }]
                        }
                    ],
                    style: {
                        '${symbolSelector}': {
                            rect: [null, null, '1024px', '600px']
                        }
                    }
                },
                timeline: {
                    duration: 0,
                    autoPlay: true,
                    data: [

                    ]
                }
            },
            "leaderboardEntry": {
                version: "6.0.0",
                minimumCompatibleVersion: "5.0.0",
                build: "6.0.0.400",
                scaleToFit: "none",
                centerStage: "none",
                resizeInstances: false,
                content: {
                    dom: [
                        {
                            userClass: 'buttonBase',
                            borderRadius: ['30px', '30px', '30px', '30px 30px'],
                            rect: ['0%', '0px', '100%', '60px', 'auto', 'auto'],
                            id: 'leaderboardBase',
                            stroke: [10, 'rgb(0, 0, 0)', 'none'],
                            type: 'rect',
                            fill: ['rgba(152,152,152,1.00)']
                        },
                        {
                            userClass: 'panelHighlights',
                            borderRadius: ['30px', '30px', '30px', '30px 30px'],
                            rect: ['0%', '0px', '100%', '60px', 'auto', 'auto'],
                            id: 'leaderboardHighlight',
                            stroke: [10, 'rgb(0, 0, 0)', 'none'],
                            type: 'rect',
                            fill: ['rgba(255,255,255,1.00)']
                        },
                        {
                            type: 'rect',
                            rect: ['12px', '10px', '60px', '40px', 'auto', 'auto'],
                            borderRadius: ['100px', '100px', '100px', '100px 100px'],
                            id: 'numberContainer',
                            stroke: [10, 'rgb(0, 0, 0)', 'none'],
                            fill: ['rgba(255,255,255,1.00)'],
                            c: [
                            {
                                type: 'text',
                                rect: ['0px', '0px', '60px', '40px', 'auto', 'auto'],
                                align: 'left',
                                text: '<p style=\"margin: 0px;\">​</p>',
                                id: 'numberText',
                                textStyle: ['', '', '', '', 'none'],
                                userClass: 'centeredText',
                                font: ['Arial, Helvetica, sans-serif', [24, 'px'], 'rgba(0,0,0,1)', '400', 'none', 'normal', 'break-word', 'normal']
                            }]
                        },
                        {
                            type: 'rect',
                            rect: ['82px', '0px', '160px', '60px', 'auto', 'auto'],
                            id: 'nameContainer',
                            stroke: [10, 'rgb(0, 0, 0)', 'none'],
                            fill: ['rgba(255,255,255,0.00)'],
                            c: [
                            {
                                type: 'text',
                                rect: ['0px', '0px', '160px', '60px', 'auto', 'auto'],
                                align: 'left',
                                text: '<p style=\"margin: 0px;\">​</p>',
                                id: 'nameText',
                                textStyle: ['', '', '', '', 'none'],
                                userClass: 'centeredText',
                                font: ['Arial, Helvetica, sans-serif', [24, 'px'], 'rgba(0,0,0,1)', '400', 'none', 'normal', 'break-word', 'normal']
                            }]
                        },
                        {
                            type: 'rect',
                            rect: ['245px', '0px', '95px', '60px', 'auto', 'auto'],
                            id: 'scoreContainer',
                            stroke: [10, 'rgb(0, 0, 0)', 'none'],
                            fill: ['rgba(255,255,255,0)'],
                            c: [
                            {
                                type: 'text',
                                rect: ['0px', '0px', '95px', '60px', 'auto', 'auto'],
                                align: 'left',
                                text: '<p style=\"margin: 0px;\">​</p>',
                                id: 'scoreText',
                                textStyle: ['', '', '', '', 'none'],
                                userClass: 'centeredText',
                                font: ['Arial, Helvetica, sans-serif', [24, 'px'], 'rgba(0,0,0,1)', '400', 'none', 'normal', 'break-word', 'normal']
                            }]
                        }
                    ],
                    style: {
                        '${symbolSelector}': {
                            rect: [null, null, '350px', '60px']
                        }
                    }
                },
                timeline: {
                    duration: 0,
                    autoPlay: true,
                    data: [

                    ]
                }
            }
        };

    AdobeEdge.registerCompositionDefn(compId, symbols, fonts, scripts, resources, opts);

    if (!window.edge_authoring_mode) AdobeEdge.getComposition(compId).load("index_edgeActions.js");
})("EDGE-2597805");
