export const tableData = {
    headers: [
        {key: 'country', label: 'Country'},
        {key: 'sales-absolute', label: 'Sales'},
        {key: 'sales-percent', label: 'Sales (percentage)'},
        {key: 'orders', label: 'Number of Orders'},
        {key: 'avg-order', label: 'Average Order Value'},
    ],
    rows: [
        [
            {display: 'France', value: 1},
            {display: '₽33,023', value: 33023},
            {display: '63.6%', value: 63.6},
            {display: 1, value: 1},
            {display: '33023', value: 33023},
        ],
        [
            {display: 'Uganda', value: 2},
            {display: '₽6,839', value: 6839},
            {display: '13.2%', value: 13.2},
            {display: 1, value: 1},
            {display: '6839', value: 6839},
        ],
        [
            {display: 'Niue', value: 3},
            {display: '₽6,534', value: 6534},
            {display: '12.6%', value: 12.6},
            {display: 1, value: 1},
            {display: '6534', value: 6534},
        ],
        [
            {display: 'Moldova', value: 4},
            {display: '₽2,550', value: 2550},
            {display: '4.9%', value: 4.9},
            {display: 1, value: 1},
            {display: '2550', value: 2550},
        ],
        [
            {display: 'Canada', value: 5},
            {display: '₽957', value: 957},
            {display: '1.8%', value: 1.8},
            {display: 1, value: 1},
            {display: '957', value: 957},
        ],
        [
            {display: 'Romania', value: 6},
            {display: '₽931', value: 931},
            {display: '63.6%', value: 63.6},
            {display: 1, value: 1},
            {display: '931', value: 931},
        ],
        [
            {display: 'Russia', value: 7},
            {display: '₽607', value: 607},
            {display: '63.6%', value: 63.6},
            {display: 1, value: 1},
            {display: '607', value: 607},
        ],
        [
            {display: 'Maldives', value: 8},
            {display: '₽516', value: 516},
            {display: '1%', value: 1},
            {display: 1, value: 1},
            {display: '516', value: 516},
        ]
    ],
    summary: [
        {key: "sales", label: 'Sales in this period', value: '51957,06₽'},
        {key: "orders", label: 'Orders in this period', value: '8'},
        {key: "countries", label: 'Countries in this period', value: '8'},
    ]
};

export const chartData = [
    {
        date: '2018-05-30T00:00:00',
        France: {
            label: 'France',
            value: 21599,
        },
        USA: {
            label: 'USA',
            value: 38537,
        },
        Germany: {
            label: 'Germany',
            value: 106010,
        },
        Russia: {
            label: 'Russia',
            value: 4033,
        },
        Estonia: {
            label: 'Estonia',
            value: 2190,
        },
        Italy: {
            label: 'Italy',
            value: 870,
        },
    }
];
