import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { APIResult, Order, OrderLineItem, OrderPackage } from '@ikas/api-client';
import { DB, ensureDBConnect, ShipmentCarrier, ShipmentHelpers, ShippingAppSettingsManager } from '@ikas-shipping-app/common';
import { ensureLoggedIn } from '@ikas-apps/common-client';
import { ApiResponseType } from '@ikas-apps/common';
import { AuthTokenManager, getIkas } from '@ikas-apps/common-mongodb';

export type PackIkasOrdersApiRequest = {
  orderId: string;
  orderLineItemIds: string[];
  selectedCarrier?: ShipmentCarrier | null;
  quantityMap?: any | null;
};

export type PackIkasOrdersApiResponse = {
  order: Order;
};

const handler = nc<NextApiRequest, NextApiResponse<ApiResponseType<PackIkasOrdersApiResponse>>>()
  .use(ensureLoggedIn)
  .use(ensureDBConnect)
  .post(async (req, res) => {
    try {
      const { orderId, orderLineItemIds, selectedCarrier, quantityMap } = req.body as PackIkasOrdersApiRequest;
      console.log(`packOrder --> orderId= ${orderId}, orderLineItems= ${orderLineItemIds}, quantityMap= ${quantityMap}`);
      const authToken = await AuthTokenManager.get(DB, req.user!.authorizedAppId);
      const settings = await ShippingAppSettingsManager.get(req.user!.authorizedAppId);
      console.log(`authToken: ${authToken?._id}, settings: ${settings?._id} `);
      const quantityInfo = quantityMap ? JSON.parse(quantityMap) : null;
      let sendNotificationToCustomer: boolean = false;
      if (settings && settings.sendNotificationToCustomer) {
        sendNotificationToCustomer = true;
      }
      let ikasOrder: Order | undefined = undefined;
      if (authToken) {
        const ikas = getIkas(DB, authToken);
        const response = await ikas.adminApi.queries.listOrder({
          variables: { pagination: { page: 1, limit: 1 }, id: { eq: orderId } },
        });

        if (response.isSuccess && response.data && response.data.data) {
          ikasOrder = response.data.data[0];

          const carrierSelections = await ShippingAppSettingsManager.getCarrierSelections(req.user!.authorizedAppId, selectedCarrier);
          let isContinueShippingZoneRate = false;
          console.log('handleIkasWebhook--orderZoneRateId', ikasOrder.shippingZoneRateId);
          for (const carrierSelection of carrierSelections || []) {
            const ruleResponse = await ShipmentHelpers.checkIkasShippingRules(ikasOrder, carrierSelection, settings);
            if (ruleResponse) {
              isContinueShippingZoneRate = true;
              continue;
            }
          }
          if (!isContinueShippingZoneRate) {
            console.log('handleIkasWebhook--isContinueShippingZoneRate = false');
            res.status(404).json({ error: { statusCode: 404, message: 'No shipping company was found that complies with the shipping rule in the order.' } });
            return;
          }

          const selectedOrderLines: OrderLineItem[] = [];
          console.log(
            'packOrder --> ikasOrderLineItems= ',
            ikasOrder.orderLineItems.map((o) => o.id),
          );
          const orderLineItems = ikasOrder.orderLineItems;
          for (const orderLineItem of orderLineItems) {
            if (orderLineItemIds.includes(orderLineItem.id)) {
              if (quantityInfo) {
                const orderLineQuantity = quantityInfo[orderLineItem.id];
                if (orderLineQuantity) {
                  orderLineItem.quantity = orderLineQuantity;
                }
              }
              selectedOrderLines.push(orderLineItem);
            }
          }
          console.log(
            'packOrder --> selectedOrderLineIds= ',
            selectedOrderLines.map((o) => o.id),
          );

          if (selectedOrderLines.length > 0) {
            console.log('packOrder --> fulfillOrder api called');
            const responsePack: APIResult<Partial<Order>> = await ikas.adminApi.mutations.fulfillOrder({
              variables: {
                input: {
                  orderId: orderId,
                  lines: selectedOrderLines.map((o) => ({
                    orderLineItemId: o.id,
                    quantity: o.quantity,
                  })),
                  sendNotificationToCustomer: sendNotificationToCustomer,
                  markAsReadyForShipment: true,
                },
              },
            });
            if (responsePack.isSuccess && responsePack.data) {
              console.log('packOrder --> the order has been packed. ');
              const responseOrder = responsePack.data as Order;
              const responseOrderPackages: OrderPackage[] = [];
              for (const responseOrderPackage of responseOrder.orderPackages || []) {
                const responseOrderLineItemIds = [];
                const responseOriginalOrderLineItemIds = [];

                for (const responseOrderLineItemId of responseOrderPackage.orderLineItemIds) {
                  const findOrderLineItem = responseOrder.orderLineItems.find((o) => o.id === responseOrderLineItemId);
                  if (findOrderLineItem) {
                    responseOrderLineItemIds.push(findOrderLineItem.id);
                    responseOriginalOrderLineItemIds.push(findOrderLineItem.originalOrderLineItemId);
                  }
                }
                console.log('packOrder --> responseOrderLineItemIds', responseOrderLineItemIds);
                console.log('packOrder --> orderLineItems', orderLineItemIds);
                if (responseOrderLineItemIds.sort().toString() == orderLineItemIds.sort().toString()) {
                  responseOrderPackages.push(responseOrderPackage);
                } else if (responseOriginalOrderLineItemIds.sort().toString() == orderLineItemIds.sort().toString()) {
                  responseOrderPackages.push(responseOrderPackage);
                }
              }
              responseOrder.orderPackages = responseOrderPackages;
              console.log(
                'packOrder --> orderPackagesIds: ',
                responseOrder.orderPackages?.map((o) => o.id),
              );
              res.status(200).send({ data: { order: responseOrder } });
            } else {
              res.status(404).json({ error: { statusCode: 404, message: 'There was a problem with the automatic packaging process.' } });
            }
          } else {
            res.status(404).json({ error: { statusCode: 404, message: 'The orderLineItemIds entered for this order could not be found.' } });
          }
        }
      } else {
        res.status(404).json({ error: { statusCode: 404, message: 'Auth Token Not Found' } });
      }
    } catch (err: any) {
      res.status(500).json({ error: { statusCode: 500, message: err.message } });
      return;
    }
  });

export default handler;
