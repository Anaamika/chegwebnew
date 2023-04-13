import { OffersData } from '@shared/models/offers-data'
export class BestDealsData {
    constructor(
        public categoryName: string,
        public id: number,
        public userId: number,
        public offers: {
            bankName: string,
            bannerImage: string,
            cardType: string,
            category: string,
            categoryId: number,
            discount: string,
            discountAmount: number,
            discountType: string,
            endDate: string,
            id: number,
            isBankBanner: string,
            merchantLogo: string,
            merchantName: string,
            merchantURLAffl: string,
            merchantUrl: string,
            offer: string,
            offerAdditionalInfo: string,
            offerAdditionalLink: string,
            offerDetail: string,
            percentageValue: number,
            promoLink: string,
            siteId: number,
            startDate: string,
            terms: string,
            transactionId: string,
            userId: number
        }
    ) { }
}
