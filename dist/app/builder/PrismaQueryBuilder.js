"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Prisma Query Builder class for building complex queries with chaining methods
 * Similar pattern to the Mongoose QueryBuilder but adapted for Prisma
 */
class PrismaQueryBuilder {
    constructor(prismaModel, query) {
        this.whereClause = {};
        this.orderBy = [];
        this.selectFields = null;
        this.prismaModel = prismaModel;
        this.query = query;
    }
    /**
     * Add search functionality to the query
     * @param searchableFields - Array of fields to search in
     * @returns PrismaQueryBuilder instance for chaining
     */
    search(searchableFields) {
        const searchTerm = this.query.search;
        if (searchTerm) {
            this.whereClause = Object.assign(Object.assign({}, this.whereClause), { OR: searchableFields.map(field => ({
                    [field]: {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }
                })) });
        }
        return this;
    }
    /**
     * Add filtering to the query
     * @returns PrismaQueryBuilder instance for chaining
     */
    filter() {
        const queryObj = Object.assign({}, this.query);
        const excludeFields = ['search', 'sort', 'page', 'limit', 'fields'];
        excludeFields.forEach(el => delete queryObj[el]);
        // Add the remaining query parameters to the where clause
        Object.entries(queryObj).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                this.whereClause = Object.assign(Object.assign({}, this.whereClause), { [key]: value });
            }
        });
        return this;
    }
    /**
     * Add sorting to the query
     * @returns PrismaQueryBuilder instance for chaining
     */
    sort() {
        const sortField = this.query.sort;
        if (sortField) {
            const sortFields = sortField.split(',');
            this.orderBy = sortFields.map(field => {
                const isDescending = field.startsWith('-');
                const fieldName = isDescending ? field.substring(1) : field;
                return {
                    [fieldName]: isDescending ? 'desc' : 'asc'
                };
            });
        }
        else {
            // Default sort by createdAt in descending order
            this.orderBy = [{ createdAt: 'desc' }];
        }
        return this;
    }
    /**
     * Add pagination to the query
     * @returns PrismaQueryBuilder instance for chaining
     */
    paginate() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        this.skipValue = (page - 1) * limit;
        this.takeValue = limit;
        return this;
    }
    /**
     * Field selection to include specific fields
     * @returns PrismaQueryBuilder instance for chaining
     */
    fields() {
        const fields = this.query.fields;
        if (fields) {
            const fieldArray = fields.split(',');
            this.selectFields = fieldArray.reduce((acc, field) => {
                // Skip the __v field which doesn't exist in Prisma
                if (field !== '__v') {
                    acc[field] = true;
                }
                return acc;
            }, {});
        }
        return this;
    }
    /**
     * Execute the query and return results with metadata
     * @returns Object with data and pagination metadata
     */
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const page = Number(this.query.page) || 1;
            const limit = Number(this.query.limit) || 10;
            // Build the query parameters
            const queryOptions = {
                where: this.whereClause,
                orderBy: this.orderBy.length > 0 ? this.orderBy : undefined,
                skip: this.skipValue,
                take: this.takeValue
            };
            // Add select if specified
            if (this.selectFields) {
                queryOptions.select = this.selectFields;
            }
            // Get total count
            const totalData = yield this.prismaModel.count({ where: this.whereClause });
            const totalPage = Math.ceil(totalData / limit);
            // Get data
            const data = yield this.prismaModel.findMany(queryOptions);
            return {
                data,
                meta: {
                    page,
                    limit,
                    totalData,
                    totalPage
                }
            };
        });
    }
    /**
     * Get total count and pagination metadata without fetching data
     * @returns Object with pagination metadata
     */
    countTotal() {
        return __awaiter(this, void 0, void 0, function* () {
            const page = Number(this.query.page) || 1;
            const limit = Number(this.query.limit) || 10;
            const totalData = yield this.prismaModel.count({ where: this.whereClause });
            const totalPage = Math.ceil(totalData / limit);
            return {
                page,
                limit,
                totalData,
                totalPage
            };
        });
    }
}
exports.default = PrismaQueryBuilder;
