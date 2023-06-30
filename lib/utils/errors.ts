const createErrorFactory = function (name: string) {
    return class BusinessError extends Error {
        constructor (msg: string) {
            super(msg);
            this.name = name;
        };
    };
};

export const ApiCallError = createErrorFactory('ApiCallError');