/* eslint-disable prettier/prettier */
import { api } from "./axios";
import { ApiEndPoint } from "./ApiEndPoint";
// import VueCookies from 'vue-cookies'

// import { ref } from '@vue/runtime-core';
export class RequestApi {
  constructor() {
    this.clientId = 0; // VueCookies.get('id');
    this.number = 0; //VueCookies.get('phone');
    this.ApiEndPoint = new ApiEndPoint();
  }

  /**
   *
   * @param {*} client
   * @returns retourne les  client
   */
  getClientList = async () => {
    let dataRes = { status: true, data: [] };

    await api
      .get(this.ApiEndPoint.user_all)
      .then(async (response) => {
        dataRes = {
          status: true,
          data: response.data,
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
          data: [],
        };
      });

    return dataRes;
  };

  sendWelcomeNotifications = async (userId) => {
    let dataRes = { status: true, data: [] };

    await api
      .get(this.ApiEndPoint.notifcation_welcom + "?userId=" + userId)
      .then(async () => {
        dataRes = {
          status: true,
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
        };
      });
    //console.log(dataRes)
    return dataRes;
  };

  sendGeneraleNotifications = async (data) => {
    let dataRes = { status: true, data: [] };

    await api
      .post(this.ApiEndPoint.notifcation_general, data)
      .then(async () => {
        dataRes = {
          status: true,
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
        };
      });
    //console.log(dataRes)
    return dataRes;
  };

  sendPersonnalNotifications = async (data) => {
    let dataRes = { status: true, data: [] };

    await api
      .post(this.ApiEndPoint.notifcation_user, data)
      .then(async () => {
        dataRes = {
          status: true,
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
        };
      });
    //console.log(dataRes)
    return dataRes;
  };
}
