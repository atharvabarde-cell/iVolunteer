export class ApiResponse {
    constructor(statusCode, data, message="Success", meta=null){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;

        if(meta) {
            this.meta = meta;
        }
    }
}


// meta property use:
/*
const user = await User.find().limit(10).skip(0); // Pagination logic

const meta = {
    page: 1,
    limit: 10,
    total: 125,
    totalPages: 13,
    requrestId: req.id // if attaching a requrest ID per request
}

return res.status(200)
          .json(new ApiResponse(200, users, "Fetched users successfully", meta))

*/