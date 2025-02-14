export interface CabinTypeInterface{
    ID?: number;
    TypeName?: string;
    CabinPrice?: number;
    Image?: string;
    Cabinsize?: number;
    data: {
        ID?: number;
        TypeName: string;
        CabinPrice: number;
        Cabinsize: number;
    };
}