import {
  HOTEL_ADMIN,
  SUPER_ADMIN,
  USER,
  ORG_ADMIN,
  ORG_CUST_SUPPORT,
  HOTEL_FRONTDESK,
  HOTEL_MANAGER,
  HOTEL_SERVICE,
  HOUSE_KEEPING,
  HOTEL_FINANCE,
  ORG_FINANCE,
  ORG_SALES,
  SMS_SUBSCRIPTION,
  HOTEL_MARKETING,
  SMS_HOST,
  PAYMENT_LINK,
  BUSINESS_TYPE_SOFTWARE_CONSULTING,
  PROP_FO_EXECUTIVE,
  PROP_SERVICE_EXECUTIVE,
} from "../app.component";


import { Subcription } from "./subcription";

export class CheckUserType {

  isSoftwareConsulting(type: string) {
    if (type === BUSINESS_TYPE_SOFTWARE_CONSULTING) {
      return true;
    } else {
      return false;
    }
  }

  isAdmin(type: string) {
    if (type === SUPER_ADMIN || type === ORG_ADMIN || type === HOTEL_ADMIN) {
      return true;
    } else {
      return false;
    }
  }

  isSuperAdminAndOrgAdmin(type: string) {
    if (type === SUPER_ADMIN || this.isAnyOrgAdmin(type) === true) {
      return true;
    } else {
      return false;
    }
  }

  isOrganization(type: string) {
    if (type === ORG_ADMIN) {
      return true;
    } else {
      return false;
    }
  }

  isAnyOrgAdmin(type: string) {
    if (
      type === ORG_ADMIN ||
      type === ORG_CUST_SUPPORT ||
      type === ORG_FINANCE ||
      type === ORG_SALES
    ) {
      return true;
    } else {
      return false;
    }
  }

  isOrganizationCustomerSupport(type: string) {
    if (type === ORG_CUST_SUPPORT) {
      return true;
    } else {
      return false;
    }
  }

  isSuperAdmin(type: string) {
    if (type === SUPER_ADMIN) {
      return true;
    } else {
      return false;
    }
  }

  isHotelAdmin(type: string) {
    if (
      type === HOTEL_ADMIN ||
      type === HOTEL_FRONTDESK ||
      type === HOTEL_MANAGER ||
      type === HOTEL_SERVICE ||
      type === HOUSE_KEEPING ||
      type === HOTEL_FINANCE ||
      type === PROP_SERVICE_EXECUTIVE ||
      type === PROP_FO_EXECUTIVE
    ) {
      return true;
    } else {
      return false;
    }
  }

  isPropAdmin(type: string) {
    if (type === HOTEL_ADMIN) {
      return true;
    } else {
      return false;
    }
  }

  isSeviceExecutive(type: string)
  {
    if(type === PROP_SERVICE_EXECUTIVE){
      return true;
    } else {
      return false;
    }
  }

  isFontDeskEx(type: string) {
    if (type === PROP_FO_EXECUTIVE) {
      return true;
    } else {
      return false;
    }
  }

  isFontDesk(type: string) {
    if (type === HOTEL_FRONTDESK) {
      return true;
    } else {
      return false;
    }
  }

  isManager(type: string) {
    if (type === HOTEL_MANAGER) {
      return true;
    } else {
      return false;
    }
  }

  isServiceRestaurant(type: string) {
    if (type === HOTEL_SERVICE) {
      return true;
    } else {
      return false;
    }
  }

  isPropFinance(type: string) {
    if (type === HOTEL_FINANCE) {
      return true;
    } else {
      return false;
    }
  }

  isHouseKeeping(type: string) {
    if (type === HOUSE_KEEPING) {
      return true;
    } else {
      return false;
    }
  }

  isMarketingManager(type: string) {
    if (type === HOTEL_MARKETING) {
      return true;
    } else {
      return false;
    }
  }

  isLeadsManagementUser(type: string) {
    if (type === HOTEL_MARKETING ) {
      return true;
    } else {
      return false;
    }
  }

  isPaymentLink(subscriptionList: Subcription[]) {
    if (
      subscriptionList != null &&
      subscriptionList != undefined &&
      subscriptionList.length > 0
    ) {
      if (
        subscriptionList.some((data) => data.name.trim() === PAYMENT_LINK) === true
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  isSMSHost(subscriptionList: Subcription[]) {
    if (
      subscriptionList != null &&
      subscriptionList != undefined &&
      subscriptionList.length > 0
    ) {
      if (
        subscriptionList.some((data) => data.name.trim() === SMS_HOST) === true
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  isSMSSubscription(subscriptionList: Subcription[]) {
    if (
      subscriptionList != null &&
      subscriptionList != undefined &&
      subscriptionList.length > 0
    ) {
      if (
        subscriptionList.some((data) => data.name.trim() === SMS_SUBSCRIPTION) === true
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
