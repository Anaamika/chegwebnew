import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component'
import { OffersComponent } from './pages/offers/offers.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { TermsAndConditionsComponent } from './pages/terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { FaqComponent } from './pages/faq/faq.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { HowItWorksComponent } from './pages/how-it-works/how-it-works.component';
import { ContestComponent } from './pages/contest/contest.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'offers',
        component: OffersComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('@module/offers/offers.module').then(m => m.OffersModule),
          }
        ],
        data: {
          breadcrumb: 'All Offers'
        }
      },
      {
        path: 'featured',
        children: [
          {
            path: '',
            loadChildren: () => import('@module/products/products.module').then(m => m.ProductsModule),
          }
        ],
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'about-us',
        component: AboutUsComponent,
        data: {
          breadcrumb: 'About Us'
        }
      },
      {
        path: 'terms-and-conditions',
        component: TermsAndConditionsComponent,
        data: {
          breadcrumb: 'Terms and Conditions'
        }
      },
      {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent,
        data: {
          breadcrumb: 'Privacy Policy'
        }
      },
      {
        path: 'faq',
        component: FaqComponent,
        data: {
          breadcrumb: 'FAQ'
        }
      },
      {
        path: 'contact-us',
        component: ContactUsComponent,
        data: {
          breadcrumb: 'Contact Us'
        }
      },
      {
        path: 'how-it-works',
        component: HowItWorksComponent,
        data: {
          breadcrumb: 'How It Works'
        }
      },
      {
        path: 'contest',
        component: ContestComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
