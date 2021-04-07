import {
    trigger, state, style, transition,
    animate, group, query, stagger, keyframes
} from '@angular/animations';

export const SlideInOutAnimation = [
    trigger('slideInOut', [
        state('in', style({
            'opacity': '1', 'visibility': 'visible'
        })),
        state('out',
            style({
                'opacity': '0', 'visibility': 'hidden'
            })
        ),
        transition('in => out', [group([
            animate('500ms ease-in-out', style({
                'opacity': '0'
            })),
            animate('500ms ease-in-out', style({
                'max-height': '0px'
            })),
            animate('500ms ease-in-out', style({
                'visibility': 'hidden'
            }))
        ]
        )]),
        transition('out => in', [group([
            animate('1ms ease-in-out', style({
                'visibility': 'visible'
            })),
            animate('500ms ease-in-out',
                style({
                    'max-height': '500px'
                })
            ),
            animate('500ms ease-in-out', style({
                'opacity': '1'
            }))
        ]
        )])
    ]),
]
export const fadeAnimation = [
    trigger('fade', [
        transition('void => *', [
            style({ opacity: 0 }),
            animate(500, style({ opacity: 1 }))
        ])
    ])
];
export const simpleFadein = [
    trigger('simpleFadeAnimation', [

        // the "in" style determines the "resting" state of the element when it is visible.
        state('in', style({ opacity: 1 })),

        // fade in when created. this could also be written as transition('void => *')
        transition(':enter', [
            style({ opacity: 0 }),
            animate(100)
        ]),

        // fade out when destroyed. this could also be written as transition('void => *')
        transition(':leave',
            animate(100, style({ opacity: 0 })))
    ])
]