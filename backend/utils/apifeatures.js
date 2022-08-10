// serach fillters and pagination
class ApiFeatures {
    constructor (query,queryStr){
        this.query = query;
        this.queryStr = queryStr;

    }
    // search
    search(){
        const keyword = this.queryStr.keyword ? {
            name:{
                $regex:this.queryStr.keyword,
                $options:"i", //this is case cnestive which mean it  depands on lower or upper case ex => find for "ABC" it will not find for small "abc"

            },

        }:{};
        console.log(keyword)
        this.query = this.query.find({...keyword});
        return this;
    }
    // fillters
    filter(){
        const queryCopy = {...this.queryStr}


        // removing some feild for category
        const removeFields = ["keyword", "page","limit"];

        removeFields.forEach((key) => delete queryCopy[key]);

    //    Fillter for price and rating


    console.log(queryCopy)
      let queryStr = JSON.stringify(queryCopy);
      queryStr = queryStr.replace(/\b(gt|gte|lt|lte|)\b/g,key => `${key}`);


      this.query = this.query.find (JSON.parse(queryStr));
      console.log(queryStr)
      return this;
    }
    // Pagination = product per page
    Pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1 ; 
        // product skip when vist on second page
        
        const skip = resultPerPage * (currentPage -1);

        this.query = this.query.limit(resultPerPage).skip(skip); //  it limits the product to show on per page where" this.query is product.find() which find product and ".limit " will limit the product

        return this;
    }
}



module.exports = ApiFeatures;