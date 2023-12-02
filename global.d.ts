interface Snap {
    pay: (transactionToken: string, options: any) => void;
}

interface Window {
    snap: Snap;
}