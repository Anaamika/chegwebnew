import { Injectable } from '@angular/core';
import * as mixpanel from 'mixpanel-browser';
import { utilities } from '@utilities/utilities';

@Injectable({
  providedIn: 'root'
})
export class MixpanelService {

  /**
 * Initialize mixpanel.
 *
 * @param {string} userToken
 * @memberof MixpanelService
 */

  init(userToken: string): void {
    let token = utilities.getMPToken();
    mixpanel.init(token);
    mixpanel.identify(userToken);
  }

  identify(userToken: string): void {
    mixpanel.identify(userToken);
  }

  /**
   * Push new action to mixpanel.
   *
   * @param {string} id Name of the action to track.
   * @param {*} [action={}] Actions object with custom properties.
   * @memberof MixpanelService
   */

  track(event: string, property: any = {}): void {
    mixpanel.track(event, property);
  }

  track_links(selector, event: string): void {
    mixpanel.track_links(selector, event, {
      // "referrer": document.referrer
    });
  }

  register(property: any = {}): void {
    mixpanel.register(property);
  }

  register_once(property: any = {}): void {
    mixpanel.register_once(property);
  }

  setProfile(userToken: string, property: any = {}): void {
    mixpanel.people.set(property);
    mixpanel.identify(userToken);
  }

  Increment(field: string, count: number): void {
    mixpanel.people.increment(field, count);
  }

  TrackRevenue(userToken: string, ammount: null, property: any = {}): void {
    mixpanel.identify(userToken);
    mixpanel.people.track_charge(ammount, property);
  }

  constructor() { }
}
