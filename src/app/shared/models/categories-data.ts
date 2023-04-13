export class CategoriesData {
    constructor(
        public active: string,
        public categoryLevel: number,
        public categoryLogo: string,
        public categoryName: string,
        public id: number,
        public isBestSeller: boolean,
        public isFav: boolean,
        public nodeId: string,
        public offerCount: number,
        public parentCategoryName: string,
        public parentNodeId: string,
        public rootCategoryName: string,
        public rootID: string,
        public searchIndexId: number,
        public searchIndexName: string,
        public userId: number,
    ) { }
}
