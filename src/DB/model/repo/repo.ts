import { UpdateOptions } from "mongodb";
import { DeleteResult, UpdateResult, UpdateWithAggregationPipeline } from "mongoose";
import { CreateOptions, HydratedDocument, Model,MongooseUpdateQueryOptions,QueryFilter,QueryOptions, UpdateQuery } from "mongoose";
import { ProjectionType } from "mongoose";

export class DBrepo<T>{
    constructor(protected readonly model:Model<T>){}
     public async create({
        data,
        options,
    }: {
        data: Partial<T>;
        options?: CreateOptions | undefined;
    }): Promise<HydratedDocument<T>> {
        const docs = await this.model.create([data]);
        return docs[0] as HydratedDocument<T>;
    }
    public  async findOneM({
            data,
            projection,
            options
         }:{
            data:QueryFilter<T>,
            projection:ProjectionType<T> | null | undefined,
            options?:QueryOptions|undefined
         }):Promise<HydratedDocument<T>>{
            return await this.model.findOne(data ,projection,options) as HydratedDocument<T>;
         }
         public async update({
            filter,
            update,
            options
         }:{
            filter: QueryFilter<T>,
                  update: UpdateQuery<T> | UpdateWithAggregationPipeline,
                  options?: (UpdateOptions) | null
         }):Promise<UpdateResult>{
                  return await this.model.updateOne(filter ,update,options) 
         }
          public async updateMany({
            filter,
            update,
            options
         }:{
            filter: QueryFilter<T>,
                  update: UpdateQuery<T> | UpdateWithAggregationPipeline,
                  options?: (UpdateOptions) | null
         }):Promise<UpdateResult>{
                  return await this.model.updateMany(filter ,update,options) 
         }
          public async delete({
            filter,
           
         }:{
            filter: QueryFilter<T>,
        
         }):Promise<DeleteResult>{
                  return await this.model.deleteOne(filter) 
         }
         public async deleteMany({
            filter,
           
         }:{
            filter: QueryFilter<T>,
        
         }):Promise<DeleteResult>{
                  return await this.model.deleteMany(filter) 
         }
         public async findOneAndUpdate({filter,update,options={new:true}}:{filter: QueryFilter<T>,
               update: UpdateQuery<T> ,
               options: QueryOptions<T>}):Promise<HydratedDocument<T>>{
            return await this.model.findOneAndUpdate(filter,update,options) as HydratedDocument<T>
         }
}
