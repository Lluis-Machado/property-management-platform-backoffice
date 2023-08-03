const data = {
    form: {
        businessPartner: {
            name: 'string',
            vatNumber: 'string',
        },
        refNumber: 'string',
        date: '2023-08-02T11:37:45.265Z',
        currency: 'EUR',
        invoiceLines: [
            {
                description: 'Table',
                tax: 21,
                quantity: 1,
                unitPrice: 100,
                expenseCategoryId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                depreciationRatePerYear: 10,
                serviceDateFrom: '2023-08-02T11:37:45.265Z',
                serviceDateTo: '2023-08-02T11:37:45.265Z',
            },
            {
                description: 'Chairs',
                tax: 21,
                quantity: 4,
                unitPrice: 50,
                expenseCategoryId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                depreciationRatePerYear: 0,
                serviceDateFrom: '2023-08-02T11:37:45.265Z',
                serviceDateTo: '2023-08-02T11:37:45.265Z',
            },
        ],
        totalAmount: 300,
    },
    analyzeResult: {
        modelId: 'string',
        content: 'string',
        pages: [
            {
                unit: 0,
                pageNumber: 0,
                angle: 0,
                width: 0,
                height: 0,
                spans: [
                    {
                        index: 0,
                        length: 0,
                    },
                ],
                words: [
                    {
                        boundingPolygon: [
                            {
                                isEmpty: true,
                                x: 0,
                                y: 0,
                            },
                        ],
                        content: 'string',
                        span: {
                            index: 0,
                            length: 0,
                        },
                        confidence: 0,
                    },
                ],
                selectionMarks: [
                    {
                        boundingPolygon: [
                            {
                                isEmpty: true,
                                x: 0,
                                y: 0,
                            },
                        ],
                        state: 0,
                        span: {
                            index: 0,
                            length: 0,
                        },
                        confidence: 0,
                    },
                ],
                lines: [
                    {
                        boundingPolygon: [
                            {
                                isEmpty: true,
                                x: 0,
                                y: 0,
                            },
                        ],
                        content: 'string',
                        spans: [
                            {
                                index: 0,
                                length: 0,
                            },
                        ],
                    },
                ],
            },
        ],
        paragraphs: [
            {
                role: {},
                content: 'string',
                boundingRegions: [
                    {
                        pageNumber: 0,
                        boundingPolygon: [
                            {
                                isEmpty: true,
                                x: 0,
                                y: 0,
                            },
                        ],
                    },
                ],
                spans: [
                    {
                        index: 0,
                        length: 0,
                    },
                ],
            },
        ],
        tables: [
            {
                rowCount: 0,
                columnCount: 0,
                cells: [
                    {
                        kind: {},
                        rowSpan: 0,
                        columnSpan: 0,
                        rowIndex: 0,
                        columnIndex: 0,
                        content: 'string',
                        boundingRegions: [
                            {
                                pageNumber: 0,
                                boundingPolygon: [
                                    {
                                        isEmpty: true,
                                        x: 0,
                                        y: 0,
                                    },
                                ],
                            },
                        ],
                        spans: [
                            {
                                index: 0,
                                length: 0,
                            },
                        ],
                    },
                ],
                boundingRegions: [
                    {
                        pageNumber: 0,
                        boundingPolygon: [
                            {
                                isEmpty: true,
                                x: 0,
                                y: 0,
                            },
                        ],
                    },
                ],
                spans: [
                    {
                        index: 0,
                        length: 0,
                    },
                ],
            },
        ],
        keyValuePairs: [
            {
                key: {
                    content: 'string',
                    boundingRegions: [
                        {
                            pageNumber: 0,
                            boundingPolygon: [
                                {
                                    isEmpty: true,
                                    x: 0,
                                    y: 0,
                                },
                            ],
                        },
                    ],
                    spans: [
                        {
                            index: 0,
                            length: 0,
                        },
                    ],
                },
                value: {
                    content: 'string',
                    boundingRegions: [
                        {
                            pageNumber: 0,
                            boundingPolygon: [
                                {
                                    isEmpty: true,
                                    x: 0,
                                    y: 0,
                                },
                            ],
                        },
                    ],
                    spans: [
                        {
                            index: 0,
                            length: 0,
                        },
                    ],
                },
                confidence: 0,
            },
        ],
        styles: [
            {
                isHandwritten: true,
                spans: [
                    {
                        index: 0,
                        length: 0,
                    },
                ],
                confidence: 0,
            },
        ],
        languages: [
            {
                locale: 'string',
                spans: [
                    {
                        index: 0,
                        length: 0,
                    },
                ],
                confidence: 0,
            },
        ],
        documents: [
            {
                documentType: 'string',
                boundingRegions: [
                    {
                        pageNumber: 0,
                        boundingPolygon: [
                            {
                                isEmpty: true,
                                x: 0,
                                y: 0,
                            },
                        ],
                    },
                ],
                spans: [
                    {
                        index: 0,
                        length: 0,
                    },
                ],
                fields: {
                    additionalProp1: {
                        fieldType: 0,
                        expectedFieldType: 0,
                        value: {},
                        content: 'string',
                        boundingRegions: [
                            {
                                pageNumber: 0,
                                boundingPolygon: [
                                    {
                                        isEmpty: true,
                                        x: 0,
                                        y: 0,
                                    },
                                ],
                            },
                        ],
                        spans: [
                            {
                                index: 0,
                                length: 0,
                            },
                        ],
                        confidence: 0,
                    },
                    additionalProp2: {
                        fieldType: 0,
                        expectedFieldType: 0,
                        value: {},
                        content: 'string',
                        boundingRegions: [
                            {
                                pageNumber: 0,
                                boundingPolygon: [
                                    {
                                        isEmpty: true,
                                        x: 0,
                                        y: 0,
                                    },
                                ],
                            },
                        ],
                        spans: [
                            {
                                index: 0,
                                length: 0,
                            },
                        ],
                        confidence: 0,
                    },
                    additionalProp3: {
                        fieldType: 0,
                        expectedFieldType: 0,
                        value: {},
                        content: 'string',
                        boundingRegions: [
                            {
                                pageNumber: 0,
                                boundingPolygon: [
                                    {
                                        isEmpty: true,
                                        x: 0,
                                        y: 0,
                                    },
                                ],
                            },
                        ],
                        spans: [
                            {
                                index: 0,
                                length: 0,
                            },
                        ],
                        confidence: 0,
                    },
                },
                confidence: 0,
            },
        ],
    },
};
export { data };
