import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './pages/overview/overview.component';
import { AccountComponent } from './pages/account/account.component';
import { RewardsComponent } from './pages/rewards/rewards.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { MyGiftCardsComponent } from './pages/my-gift-cards/my-gift-cards.component';
import { RedeemComponent } from './pages/redeem/redeem.component';
import { HrDashboardComponent } from './pages/hr-dashboard/hr-dashboard.component';
import { RewardActivitiesComponent } from './pages/reward-activities/reward-activities.component';
import { GiftCardRedemptionsComponent } from './pages/gift-card-redemptions/gift-card-redemptions.component';
import { TransactionLogComponent } from './pages/transaction-log/transaction-log.component';
import { AwardDetailsComponent } from './pages/award-details/award-details.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RoleGuardService as RoleGuard } from '@core/services/guards/role-guard.service';
import { BestdealsComponent } from '../offers/pages/bestdeals/bestdeals.component';
import { StoresGridComponent } from '../store/components/stores-grid/stores-grid.component';
import { StoresComponent } from '../store/pages/stores/stores.component';
import { GiftCardsComponent } from '../gifts/pages/gift-cards/gift-cards.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AccountComponent,
        children: [
          {
            path: '',
            component: OverviewComponent,
            data: {
              breadcrumb: '',
            },
          },
          {
            path: 'profile',
            component: ProfileComponent,
            data: {
              breadcrumb: 'Profile',
            },
          },
          {
            path: 'rewards',
            component: RewardsComponent,
            data: {
              breadcrumb: 'My Rewards',
            },
          },
          {
            path: 'orders',
            component: OrdersComponent,
            data: {
              breadcrumb: 'My Orders',
            },
          },
          {
            path: 'mygiftcards',
            component: MyGiftCardsComponent,
            data: {
              breadcrumb: 'My Gift Cards',
            },
          },
          {
            path: 'redeem',
            component: RedeemComponent,
            data: {
              breadcrumb: 'Redeem',
            },
          },
          {
            path: 'offers',
            component: BestdealsComponent,
            data: {
              breadcrumb: 'Offers',
            },
          },
          {
            path: 'stores',
            component: StoresComponent,
            data: {
              breadcrumb: 'Stores',
            },
          },
          {
            path: 'gift-cards',
            component: GiftCardsComponent,
            data: {
              breadcrumb: 'Vouchers',
            },
          },
          {
            path: 'hr-dashboard',
            component: HrDashboardComponent,
            canActivate: [RoleGuard],
            data: {
              breadcrumb: 'Admin',
              expectedRole: 1
            },
          },
          {
            path: 'reward-activities',
            component: RewardActivitiesComponent,
            canActivate: [RoleGuard],
            data: {
              breadcrumb: 'Reward activities',
              expectedRole: 1
            },
          },
          {
            path: 'gift-card-redemptions',
            component: GiftCardRedemptionsComponent,
            canActivate: [RoleGuard],
            data: {
              breadcrumb: 'Gift Card Redemptions',
              expectedRole: 1
            },
          },
          {
            path: 'transaction-log',
            component: TransactionLogComponent,
            canActivate: [RoleGuard],
            data: {
              breadcrumb: 'Transaction Log',
              expectedRole: 1
            },
          },
          {
            path: 'awards-details',
            component: AwardDetailsComponent,
            canActivate: [RoleGuard],
            data: {
              breadcrumb: 'Awards',
              expectedRole: 1
            },
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule { }
