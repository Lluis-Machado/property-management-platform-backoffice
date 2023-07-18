export const fileItems = [
    {
        uuid: 0,
        name: 'files',
        isDirectory: true,
        isRoot: true,
        items: [
            {
                uuid: '1',
                name: 'Documents',
                isDirectory: true,
                items: [
                    {
                        uuid: '1.1',
                        name: 'Projects',
                        isDirectory: true,
                        items: [
                            {
                                uuid: '1.1.0',
                                name: 'Test',
                                isDirectory: true,
                                items: [
                                    {
                                        uuid: '1.1.0.1',
                                        name: 'About.rtf',
                                        isDirectory: false,
                                        size: 1024,
                                    },
                                ],
                            },
                            {
                                uuid: '1.1.1',
                                name: 'About.rtf',
                                isDirectory: false,
                                size: 1024,
                            },
                            {
                                uuid: '1.1.2',
                                name: 'Passwords.rtf',
                                isDirectory: false,
                                size: 2048,
                            },
                        ],
                    },
                    {
                        uuid: '1.2',
                        name: 'About.xml',
                        isDirectory: false,
                        size: 1024,
                    },
                    {
                        uuid: '1.3',
                        name: 'Managers.rtf',
                        isDirectory: false,
                        size: 2048,
                    },
                    {
                        uuid: '1.4',
                        name: 'ToDo.txt',
                        isDirectory: false,
                        size: 3072,
                    },
                ],
            },
            {
                uuid: '2',
                name: 'Images',
                isDirectory: true,
                items: [
                    {
                        uuid: '2.1',
                        name: 'logo.png',
                        isDirectory: false,
                        size: 20480,
                    },
                    {
                        uuid: '2.2',
                        name: 'banner.gif',
                        isDirectory: false,
                        size: 10240,
                    },
                ],
            },
            {
                uuid: '3',
                name: 'System',
                isDirectory: true,
                items: [
                    {
                        uuid: '3.1',
                        name: 'Employees.txt',
                        isDirectory: false,
                        size: 3072,
                    },
                    {
                        uuid: '3.2',
                        name: 'PasswordList.txt',
                        isDirectory: false,
                        size: 5120,
                    },
                ],
            },
            {
                uuid: '4',
                name: 'Description.rtf',
                isDirectory: false,
                size: 1024,
            },
            {
                uuid: '5',
                name: 'Description.txt',
                isDirectory: false,
                size: 2048,
            },
        ],
    },
];
