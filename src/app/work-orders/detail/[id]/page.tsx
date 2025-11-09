import {use} from "react";
//componente para:
type Car = {
  pattern: string;
  kms: number;
  model: string;
  brand: string;

}
type ClientInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
}
//componente para:
type Service = {
  name:string,
  time:number, // hours
}
type DetailWorkOrder = {
  id: number;
  checkInObsersations: string;
  tableLights: Array<string>; // url's a los svg
  carPhotos: Array<string>; //url's a las imagenes sacadas del auto
  services: Array<Service>
  mechanics: Array<string>;
  user: ClientInfo;
  carDetail: Car;

}
export default function WorkOrderDetail({params}: { params: Promise<{ id: number }> }) {
  const {id} = use(params)
}