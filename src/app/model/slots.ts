// import { ResourceList } from './resourceList';

import { ResourceList } from "./resourceList";

export class Slots {
  date: string;
  duration: number;
  available: boolean;
  count: number;
  day: string;
  beforeTax: number;
  tax: number;
  price: number;
  businessServiceId: number;
  businessServiceTypeId: number;
  resourceList: ResourceList[];
  constructor() { }
}
