export interface AuthState {
    username: string | undefined;
    statusSignin: string;
    message: string;
}

//cart
export interface CartStateType {
    status: string;
    message: string;
    cartError: {
        qtyStock?: string;
        productUuid?: string;
    };
}
