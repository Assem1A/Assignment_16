"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBrepo = void 0;
class DBrepo {
    model;
    constructor(model) {
        this.model = model;
    }
    async create({ data, options, }) {
        const docs = await this.model.create([data]);
        return docs[0];
    }
    async findOneM({ data, projection, options }) {
        return await this.model.findOne(data, projection, options);
    }
    async update({ filter, update, options }) {
        return await this.model.updateOne(filter, update, options);
    }
    async updateMany({ filter, update, options }) {
        return await this.model.updateMany(filter, update, options);
    }
    async delete({ filter, }) {
        return await this.model.deleteOne(filter);
    }
    async deleteMany({ filter, }) {
        return await this.model.deleteMany(filter);
    }
    async findOneAndUpdate({ filter, update, options = { new: true } }) {
        return await this.model.findOneAndUpdate(filter, update, options);
    }
}
exports.DBrepo = DBrepo;
