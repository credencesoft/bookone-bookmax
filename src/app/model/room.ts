// import { RatesAndAvailability } from './ratesAndAvailability';
// import { Bed } from './bed';

// import { RoomInfo } from './roominfo';

// import { RoomImage } from './roomImage';
import { Bed } from './bed';
import { RatesAndAvailability } from './ratesAndAvailability';
import { RoomImage } from './roomImage';
import { RoomRatePlans } from './roomRatePlans';
import { RoomInfo } from './roominfo';

export class Room {

    id: number;
    name: string;
    roomId: number;
    roomName: string;
    roomFacilities: any[];
    description: string;
    minimumOccupancy: number;
    dayTrip:boolean;
    maximumOccupancy: number;
    extraChargePerPerson: number;
    propertyId: number;
    roomOnlyPrice: number;
    totalPriceServices: number;
    totalPriceAmenities: number;
    totalPriceRoom: number;
    totalNoRooms: number;
    noOfBooked:number;
    noOfAvailable:number;
    noOfOnHold:number;
    noOfPerson: number;
    isShared: Boolean;
    noOfRooms: number;
    propertyName: string;
    beds: Bed[];
    roomDetails: RoomInfo[];
    price: number;
    priceFortNight:	number;
    priceMonthly:	number;
    pricePerNight:	number;
    pricePerWeek:	number;
    maximumLengthOfStay: number;
    minimumLengthOfStay: number;
    imageList: RoomImage[];
    roomRatePlans: RoomRatePlans[];
    ratesAndAvailabilityDtos: RatesAndAvailability[];
    constructor() { }
}
