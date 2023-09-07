export type LoginParam = {
    phone: string,
    password: string
}

export type UpdateFcmTokenParam = {
    deliverymanID: string,
    fcmToken: string,
}

export type SignupParam = {
    phone: string,
    password: string,
    name: string,
}

export type PhoneCheckParam = {
    phone: string
}

export type GetByIdParam = {
    id: string,
}

export type UpdateLocationParam = {
    deliverymanID: string,
    locationLatitude: string,
    locationLongitude: string,
}

export type CreatedOrderListParam = {
    deliverymanID: string
}

export type AcceptRequestParam = {
    orderID: number,
    deliverymanID: number,
}

export type CancelOrderParam = {
    orderID: string,
    cancelReason: string,
    by: number,
    deliverymanID: string
}

export type OrderUpdateParam = {
    orderID: number,
}

export type GeoCoordinates = {
    latitude: number,
    longitude: number,
}

export type LocationInfoType = {
    location: GeoCoordinates,
    displayName: string,
}

export type ScreenProps = {
    navigation: any;
}

export type TabSceneProps = {
    handleNext: (position: LocationInfoType) => void;
    handleBack?: () => void;
    fromLocation?: LocationInfoType,
    toLocation?: LocationInfoType,
    navigation?: any,
}

export type ControlButtonProps = {
    handler: any,
    children: any,
}