export const tableData = {
    headers: [
        {key: 'month', label: 'Month'},
        {key: 'orders', label: 'Orders'},
        {key: 'revenue', label: 'Revenue'},
    ],
    rows: [
        [
            {display: 'January', value: 1},
            {display: 10, value: 10},
            {display: '$530.00', value: 530},
        ],
        [
            {display: 'February', value: 2},
            {display: 13, value: 13},
            {display: '$675.00', value: 675},
        ],
        [
            {display: 'March', value: 3},
            {display: 9, value: 9},
            {display: '$460.00', value: 460},
        ],
    ],
    summary: [
        {label: 'Gross Income', value: '$830.00'},
        {label: 'Taxes', value: '$96.32'},
        {label: 'Shipping', value: '$50.00'},
    ]
};

export const chartData = [
    {
        date: '2018-05-30T00:00:00',
        Hoodie: {
            label: 'Hoodie',
            value: 21599,
        },
        Sunglasses: {
            label: 'Sunglasses',
            value: 38537,
        },
        Cap: {
            label: 'Cap',
            value: 106010,
        },
    },
    {
        date: '2018-05-31T00:00:00',
        Hoodie: {
            label: 'Hoodie',
            value: 14205,
        },
        Sunglasses: {
            label: 'Sunglasses',
            value: 24721,
        },
        Cap: {
            label: 'Cap',
            value: 70131,
        },
    },
    {
        date: '2018-06-01T00:00:00',
        Hoodie: {
            label: 'Hoodie',
            value: 10581,
        },
        Sunglasses: {
            label: 'Sunglasses',
            value: 19991,
        },
        Cap: {
            label: 'Cap',
            value: 53552,
        },
    },
    {
        date: '2018-06-02T00:00:00',
        Hoodie: {
            label: 'Hoodie',
            value: 9250,
        },
        Sunglasses: {
            label: 'Sunglasses',
            value: 16072,
        },
        Cap: {
            label: 'Cap',
            value: 47821,
        },
    },
];

export const filterPickerData = [
    { label: 'Breakfast', value: 'breakfast' },
    {
        label: 'Lunch',
        value: 'lunch',
        subFilters: [
            { label: 'Meat', value: 'meat', path: [ 'lunch' ] },
            { label: 'Vegan', value: 'vegan', path: [ 'lunch' ] },
            {
                label: 'Pescatarian',
                value: 'fish',
                path: [ 'lunch' ],
                subFilters: [
                    { label: 'Snapper', value: 'snapper', path: [ 'lunch', 'fish' ] },
                    { label: 'Cod', value: 'cod', path: [ 'lunch', 'fish' ] },
                    // Specify a custom component to render (Work in Progress)
                    {
                        label: 'Other',
                        value: 'other_fish',
                        path: [ 'lunch', 'fish' ],
                        component: 'OtherFish',
                    },
                ],
            },
        ],
    },
    { label: 'Dinner', value: 'dinner' },
];
