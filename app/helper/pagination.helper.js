const paginationHelper = {
    paginate: async (model, { page, limit, filter = {}, populate = [] }) => {
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const skip = (pageNumber - 1) * limitNumber;

        let query = model.find(filter).skip(skip).limit(limitNumber);

        // aplicar populate si existe
        if (populate.length) {
            populate.forEach(pop => {
                query = query.populate(pop);
            });
        }

        const [data, total] = await Promise.all([
            query.exec(),
            model.countDocuments(filter)
        ]);

        return {
            data,
            total,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(total / limitNumber)
        };
    }
}

export default paginationHelper;