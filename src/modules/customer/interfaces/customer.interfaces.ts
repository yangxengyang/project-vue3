import type { IPagination } from "../../../common/interfaces/pagination.interfaces";
import type { CustomerEntity } from "../entity/customer.entity";

export interface ICustomers {
  customers: CustomerEntity[];
  pagination: IPagination;
}