export interface TreeNode {
    id?: string;
    items?: TreeNode[];
    text: string;
}

export const root: TreeNode[] = [
    {
        text: 'Archive',
        items: [
            {
                text: "Node 1",
                items: [
                    {
                        text: "Node 1.1",
                        items: [
                            {
                                text: "Node 1.1.1",
                                items: [
                                    {
                                        text: "Node 1.1.1.1"
                                    },
                                    {
                                        text: "Node 1.1.1.2"
                                    }
                                ]
                            },
                            {
                                text: "Node 1.1.2",
                                items: [
                                    {
                                        text: "Node 1.1.2.1"
                                    },
                                    {
                                        text: "Node 1.1.2.2"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        text: "Node 1.2",
                        items: [
                            {
                                text: "Node 1.2.1"
                            },
                            {
                                text: "Node 1.2.2"
                            }
                        ]
                    }
                ]
            },
            {
                text: "Node 2",
                items: [
                    {
                        text: "Node 2.1",
                        items: [
                            {
                                text: "Node 2.1.1"
                            },
                            {
                                text: "Node 2.1.2"
                            }
                        ]
                    },
                    {
                        text: "Node 2.2",
                        items: [
                            {
                                text: "Node 2.2.1"
                            },
                            {
                                text: "Node 2.2.2",
                                items: [
                                    {
                                        text: "Node 2.2.2.1"
                                    },
                                    {
                                        text: "Node 2.2.2.2"
                                    },
                                    {
                                        text: "Node 2.2.2.3"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                text: "Node 3"
            }
        ]
    }
];
