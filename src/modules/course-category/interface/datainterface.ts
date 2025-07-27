import type { ICatgoryEntity } from "../entity/category.entity";

export interface IData{
    categories:ICatgoryEntity[];
    isLoading:boolean;
}